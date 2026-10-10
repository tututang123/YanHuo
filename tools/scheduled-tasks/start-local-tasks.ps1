$ErrorActionPreference = "Stop"

function ConvertFrom-CodePoints {
    param(
        [Parameter(Mandatory = $true)]
        [string] $CodePoints
    )

    return -join ($CodePoints -split " " | ForEach-Object {
        [char][Convert]::ToInt32($_, 16)
    })
}

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$dnfTaskName = "DNF" + (ConvertFrom-CodePoints "6570 636E 5E93 81EA 52A8 5907 4EFD")
$radarTaskName = "YanHuo GitHub Radar"
$radarCommand = 'cmd /c cd /d "' + $repoRoot + '\tools\github-radar" && npm run scan'

$tasks = @(
    @{
        Name = $dnfTaskName
        Description = "Run DNF database backup every 30 minutes"
        CreateArgs = @(
            "/create",
            "/tn", $dnfTaskName,
            "/tr", "py E:\dnf\yanhuo70\backup.py",
            "/sc", "minute",
            "/mo", "30",
            "/f"
        )
    },
    @{
        Name = $radarTaskName
        Description = "Scan GitHub trending projects into YanHuo knowledge daily"
        CreateArgs = @(
            "/create",
            "/tn", $radarTaskName,
            "/tr", $radarCommand,
            "/sc", "daily",
            "/st", "09:30",
            "/f"
        )
    }
)

function Test-ScheduledTaskExists {
    param(
        [Parameter(Mandatory = $true)]
        [string] $Name
    )

    $previousErrorActionPreference = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    & schtasks /query /tn $Name *> $null
    $exitCode = $LASTEXITCODE
    $ErrorActionPreference = $previousErrorActionPreference

    return $exitCode -eq 0
}

foreach ($task in $tasks) {
    if (Test-ScheduledTaskExists -Name $task.Name) {
        Write-Host "[SKIP] $($task.Name) already exists. $($task.Description)"
        continue
    }

    Write-Host "[CREATE] $($task.Name) - $($task.Description)"
    & schtasks @($task.CreateArgs)
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to create scheduled task: $($task.Name)"
    }
}

Write-Host "Done."
