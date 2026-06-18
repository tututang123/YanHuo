# 豆腐百科 2.5 客户端改动资料

## 定位

豆腐百科 2.5 不是主要编辑器，而是 70 DNF 客户端改动说明、资料查询和修改心得的参考来源。

主要用途：

- 查询客户端相关资料。
- 参考 PVF 文件路径和数据含义。
- 记录客户端改动经验。
- 辅助判断某个功能应该修改哪些文件。

## 本地位置

```text
C:\Users\tutut\Downloads\豆腐百科2.5\豆腐百科2.5\豆腐2.5.exe
```

## 已知文件

```text
C:\Users\tutut\Downloads\豆腐百科2.5\豆腐百科2.5\豆腐2.5.exe
C:\Users\tutut\Downloads\豆腐百科2.5\豆腐百科2.5\NativeJsBridge.java
C:\Users\tutut\Downloads\豆腐百科2.5\豆腐百科2.5\SampleApplication.java
C:\Users\tutut\Downloads\豆腐百科2.5\豆腐百科2.5\yyerror.txt
```

## 当前分析结论

- 目前目录里没有发现大量可直接读取的 Markdown、TXT、HTML 说明资料。
- 主要资料可能封装在 `豆腐2.5.exe` 内，或者需要打开软件后人工查看。
- 因此后续整理方式以“人工摘录 + 截图说明 + Codex 归纳”为主。

## 推荐整理方式

当你在豆腐百科里看到有用内容时，可以按下面方式交给 Codex：

1. 复制文字内容给 Codex。
2. 或截图给 Codex，并说明你想记录哪部分。
3. 或口述：这个功能怎么改、涉及哪些文件、注意什么。

Codex 会把内容整理到：

```text
knowledge/40-projects/dnf-70/09-client-modding/references/tofu-encyclopedia.md
```

如果内容已经能映射到具体文件，还会同步更新：

```text
knowledge/40-projects/dnf-70/09-client-modding/file-maps/client-file-index.md
```

如果内容是一次实际改动经验，还会整理为补丁记录：

```text
knowledge/40-projects/dnf-70/09-client-modding/patches/
```

## 待整理内容

| 功能/主题 | 豆腐百科说明 | 相关 PVF 文件 | 是否验证 | 备注 |
| --- | --- | --- | --- | --- |
| TBD |  |  |  |  |

## 注意

- 不要把客户端文件、exe、导出的 PVF 内容上传 GitHub。
- 如果豆腐百科内容涉及具体修改步骤，记录时要写清楚“是否已经实际验证”。
- 如果涉及 PVF 导出文件修改，必须遵守 `format-safety-rules.md`。

