const http = require('http');
const https = require('https');
const { URL } = require('url');
const { DWClient, TOPIC_ROBOT } = require('dingtalk-stream');

function parseRobotMessage(message) {
  if (!message || typeof message !== 'object') return null;
  if (message.data && typeof message.data === 'string') {
    try {
      return JSON.parse(message.data);
    } catch (err) {
      return null;
    }
  }
  return message;
}

function stripLeadingMention(text, profile) {
  let result = String(text || '').trim();
  const names = [profile.displayName, profile.name, ...(profile.aliases || [])].filter(Boolean);
  for (const name of names) {
    const escaped = String(name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    result = result.replace(new RegExp(`^@\\s*${escaped}\\s*`, 'i'), '').trim();
  }
  return result;
}

function normalizeIncomingText(body, profile) {
  if (!body || typeof body !== 'object') return '';
  if (typeof body.text === 'string') return stripLeadingMention(body.text, profile);
  if (body.text && typeof body.text.content === 'string') {
    return stripLeadingMention(body.text.content, profile);
  }
  if (typeof body.content === 'string') return stripLeadingMention(body.content, profile);
  if (typeof body.message === 'string') return stripLeadingMention(body.message, profile);
  return '';
}

function getConversationSource(body) {
  if (!body || typeof body !== 'object') return 'dm';
  const value = String(body.conversationType || '').toLowerCase();
  if (value === '2' || value === 'group') return 'room';
  return 'dm';
}

function getSender(body) {
  if (!body || typeof body !== 'object') return 'unknown';
  return (
    body.senderNick ||
    body.senderName ||
    body.senderStaffId ||
    body.senderId ||
    body.creator ||
    'unknown'
  );
}

function postJson(target, payload) {
  return new Promise((resolve, reject) => {
    const url = new URL(target);
    const client = url.protocol === 'http:' ? http : https;
    const request = client.request(
      {
        method: 'POST',
        hostname: url.hostname,
        port: url.port || (url.protocol === 'http:' ? 80 : 443),
        path: `${url.pathname}${url.search}`,
        headers: {
          'content-type': 'application/json; charset=utf-8',
        },
      },
      (response) => {
        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => {
          resolve({
            statusCode: response.statusCode || 0,
            body: Buffer.concat(chunks).toString('utf8'),
          });
        });
      },
    );
    request.on('error', reject);
    request.write(JSON.stringify(payload));
    request.end();
  });
}

function parseMaybeJson(text) {
  try {
    return JSON.parse(text);
  } catch (err) {
    return text;
  }
}

function postJsonWithHeaders(target, payload, extraHeaders) {
  return new Promise((resolve, reject) => {
    const url = new URL(target);
    const client = url.protocol === 'http:' ? http : https;
    const request = client.request(
      {
        method: 'POST',
        hostname: url.hostname,
        port: url.port || (url.protocol === 'http:' ? 80 : 443),
        path: `${url.pathname}${url.search}`,
        headers: {
          'content-type': 'application/json; charset=utf-8',
          ...extraHeaders,
        },
      },
      (response) => {
        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => {
          const bodyText = Buffer.concat(chunks).toString('utf8');
          resolve({
            statusCode: response.statusCode || 0,
            body: parseMaybeJson(bodyText),
            rawBody: bodyText,
          });
        });
      },
    );
    request.on('error', reject);
    request.write(JSON.stringify(payload));
    request.end();
  });
}

async function replyToSessionWebhook(body, replyText, accessToken) {
  if (!body || !body.sessionWebhook) return null;
  const response = await postJsonWithHeaders(
    body.sessionWebhook,
    {
      msgtype: 'text',
      text: {
        content: replyText,
      },
      at:
      body.senderStaffId && String(body.conversationType || '').toLowerCase() === '2'
        ? {
            atUserIds: [body.senderStaffId],
            isAtAll: false,
          }
        : undefined,
    },
    accessToken ? { 'x-acs-dingtalk-access-token': accessToken } : {},
  );
  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw new Error(`sessionWebhook reply failed: ${response.statusCode} ${response.rawBody}`);
  }
  return response;
}

async function handleDingTalkMessage({ body, profile, queue, router, accessToken, client }) {
  const text = normalizeIncomingText(body, profile);
  if (!text) return '';

  const messageId =
    (body && (body.msgId || body.messageId || body.id)) ||
    (body && body.headers && (body.headers.messageId || body.headers.id)) ||
    '';

  const payload = {
    text,
    sender: getSender(body),
    source: getConversationSource(body),
    messageId,
  };

  console.log(
    `[${profile.name}] incoming: sender=${payload.sender} source=${payload.source} text=${JSON.stringify(
      payload.text,
    )}`,
  );
  const reply = await queue.enqueue(
    payload,
    () => router(payload),
    {
      dedupeKey: messageId,
    },
  );
  console.log(`[${profile.name}] reply: ${reply ? JSON.stringify(reply) : 'empty'}`);
  if (reply) {
    await replyToSessionWebhook(body, reply, accessToken);
  }
  return reply;
}

async function startDingTalkProfile({ profile, queue, router }) {
  if (profile.adapter !== 'dingtalk-stream') {
    throw new Error(`Unsupported adapter for profile ${profile.name}: ${profile.adapter}`);
  }

  if (!profile.clientId || !profile.clientSecret) {
    throw new Error(`Missing DingTalk client credentials for profile ${profile.name}`);
  }

  const client = new DWClient({
    clientId: profile.clientId,
    clientSecret: profile.clientSecret,
    keepAlive: profile.keepAlive !== false,
    debug: profile.debug === true,
  });

  const accessToken = await client.getAccessToken();

  client.registerCallbackListener(TOPIC_ROBOT, async (message) => {
    console.log(
      `[${profile.name}] callback: type=${message.type} topic=${message.headers && message.headers.topic}`,
    );
    try {
      const body = parseRobotMessage(message);
      if (!body) {
        if (message && message.headers && message.headers.messageId) {
          client.socketCallBackResponse(message.headers.messageId, {});
        }
        return;
      }

      const callbackMessageId =
        (body && (body.msgId || body.messageId || body.id)) ||
        (message && message.headers && message.headers.messageId) ||
        '';

      if (callbackMessageId) {
        client.socketCallBackResponse(callbackMessageId, { success: true });
      }

      await handleDingTalkMessage({
        body,
        profile,
        queue,
        router,
        accessToken,
      });
    } catch (err) {
      console.error(`[${profile.name}] dingtalk stream error: ${err.stack || err.message}`);
      if (message && message.headers && message.headers.messageId) {
        client.socketCallBackResponse(message.headers.messageId, {
          error: err.message,
        });
      }
    }
  });

  await client.connect();
  console.log(`[${profile.name}] dingtalk stream connected`);

  return {
    stop() {
      client.disconnect();
    },
  };
}

module.exports = {
  handleDingTalkMessage,
  startDingTalkProfile,
};
