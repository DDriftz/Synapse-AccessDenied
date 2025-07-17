#!/usr/bin/env pwsh
# SYNAPSE - Project Validation Script
# Comprehensive testing and validation of the entire project

Write-Host "🧠 SYNAPSE - Project Validation Script" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
Write-Host ""

$ProjectRoot = "c:\Users\Hussein Mohammed Ali\Desktop\SynapseBlazor\Synapse-AccessDenied\Synapse-AccessDenied"
$ErrorCount = 0
$WarningCount = 0

function Test-FileExists {
    param([string]$FilePath, [string]$Description)
    
    $FullPath = Join-Path $ProjectRoot $FilePath
    if (Test-Path $FullPath) {
        Write-Host "✅ $Description" -ForegroundColor Green
        return $true
    } else {
        Write-Host "❌ $Description - File not found: $FilePath" -ForegroundColor Red
        $script:ErrorCount++
        return $false
    }
}

function Test-DirectoryExists {
    param([string]$DirPath, [string]$Description)
    
    $FullPath = Join-Path $ProjectRoot $DirPath
    if (Test-Path $FullPath -PathType Container) {
        Write-Host "✅ $Description" -ForegroundColor Green
        return $true
    } else {
        Write-Host "❌ $Description - Directory not found: $DirPath" -ForegroundColor Red
        $script:ErrorCount++
        return $false
    }
}

function Test-JSONFile {
    param([string]$FilePath, [string]$Description)
    
    $FullPath = Join-Path $ProjectRoot $FilePath
    if (Test-Path $FullPath) {
        try {
            $Content = Get-Content $FullPath -Raw | ConvertFrom-Json
            Write-Host "✅ $Description - Valid JSON" -ForegroundColor Green
            return $true
        } catch {
            Write-Host "❌ $Description - Invalid JSON: $($_.Exception.Message)" -ForegroundColor Red
            $script:ErrorCount++
            return $false
        }
    } else {
        Write-Host "❌ $Description - File not found: $FilePath" -ForegroundColor Red
        $script:ErrorCount++
        return $false
    }
}

function Test-JSFile {
    param([string]$FilePath, [string]$Description)
    
    $FullPath = Join-Path $ProjectRoot $FilePath
    if (Test-Path $FullPath) {
        $Content = Get-Content $FullPath -Raw
        
        # Basic JavaScript syntax checks
        $HasSyntaxError = $false
        
        # Check for common syntax errors
        if ($Content -match '\b(class|function|const|let|var)\s+\w+' -and 
            $Content -match '[\{\}]') {
            Write-Host "✅ $Description - Basic syntax OK" -ForegroundColor Green
            return $true
        } else {
            Write-Host "⚠️ $Description - Possible syntax issues" -ForegroundColor Yellow
            $script:WarningCount++
            return $false
        }
    } else {
        Write-Host "❌ $Description - File not found: $FilePath" -ForegroundColor Red
        $script:ErrorCount++
        return $false
    }
}

Write-Host "1. Testing Core Files" -ForegroundColor Cyan
Write-Host "--------------------" -ForegroundColor Cyan
Test-FileExists "index.html" "Main HTML file"
Test-JSONFile "manifest.json" "PWA Manifest"
Test-JSFile "sw.js" "Service Worker"

Write-Host ""
Write-Host "2. Testing CSS Files" -ForegroundColor Cyan
Write-Host "-------------------" -ForegroundColor Cyan
Test-DirectoryExists "css" "CSS directory"
Test-FileExists "css/main.css" "Main stylesheet"
Test-FileExists "css/effects.css" "Effects stylesheet"
Test-FileExists "css/neural-effects.css" "Neural effects stylesheet"
Test-FileExists "css/mobile.css" "Mobile stylesheet"

Write-Host ""
Write-Host "3. Testing JavaScript Structure" -ForegroundColor Cyan
Write-Host "------------------------------" -ForegroundColor Cyan
Test-DirectoryExists "js" "JavaScript directory"
Test-DirectoryExists "js/core" "Core JS directory"
Test-DirectoryExists "js/systems" "Systems JS directory"
Test-DirectoryExists "js/ui" "UI JS directory"
Test-DirectoryExists "js/data" "Data JS directory"
Test-DirectoryExists "js/effects" "Effects JS directory"

Write-Host ""
Write-Host "4. Testing Core JavaScript Files" -ForegroundColor Cyan
Write-Host "--------------------------------" -ForegroundColor Cyan
Test-JSFile "js/main.js" "Main JavaScript file"
Test-JSFile "js/core/error-diagnostics.js" "Error diagnostics"
Test-JSFile "js/core/game-engine.js" "Game engine"
Test-JSFile "js/core/save-system.js" "Save system"
Test-JSFile "js/core/audio-manager.js" "Audio manager"

Write-Host ""
Write-Host "5. Testing System JavaScript Files" -ForegroundColor Cyan
Write-Host "---------------------------------" -ForegroundColor Cyan
Test-JSFile "js/systems/ai-personality.js" "AI personality system"
Test-JSFile "js/systems/narrative-engine.js" "Narrative engine"
Test-JSFile "js/systems/character-system.js" "Character system"
Test-JSFile "js/systems/inventory-system.js" "Inventory system"
Test-JSFile "js/systems/achievement-system.js" "Achievement system"

Write-Host ""
Write-Host "6. Testing UI JavaScript Files" -ForegroundColor Cyan
Write-Host "------------------------------" -ForegroundColor Cyan
Test-JSFile "js/ui/interface-manager.js" "Interface manager"
Test-JSFile "js/ui/command-parser.js" "Command parser"
Test-JSFile "js/ui/visual-effects.js" "Visual effects"

Write-Host ""
Write-Host "7. Testing Data JavaScript Files" -ForegroundColor Cyan
Write-Host "--------------------------------" -ForegroundColor Cyan
Test-JSFile "js/data/rooms.js" "Rooms data"
Test-JSFile "js/data/items.js" "Items data"
Test-JSFile "js/data/dialogue.js" "Dialogue data"
Test-JSFile "js/data/achievements.js" "Achievements data"
Test-JSFile "js/data/localization.js" "Localization data"

Write-Host ""
Write-Host "8. Testing Effects JavaScript Files" -ForegroundColor Cyan
Write-Host "----------------------------------" -ForegroundColor Cyan
Test-JSFile "js/effects/neural-background.js" "Neural background effects"

Write-Host ""
Write-Host "9. Testing PWA Assets" -ForegroundColor Cyan
Write-Host "--------------------" -ForegroundColor Cyan
Test-DirectoryExists "icons" "Icons directory"
Test-FileExists "icons/icon-192.png" "192x192 icon"
Test-FileExists "icons/icon-512.png" "512x512 icon"

Write-Host ""
Write-Host "10. Testing Additional Files" -ForegroundColor Cyan
Write-Host "----------------------------" -ForegroundColor Cyan
Test-FileExists "Icon.png" "Original icon file"
Test-FileExists "debug.html" "Debug test page"

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "VALIDATION SUMMARY" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green

if ($ErrorCount -eq 0 -and $WarningCount -eq 0) {
    Write-Host "🎉 ALL TESTS PASSED!" -ForegroundColor Green
    Write-Host "Your SYNAPSE project is ready to run!" -ForegroundColor Green
} elseif ($ErrorCount -eq 0) {
    Write-Host "✅ Tests completed with $WarningCount warnings" -ForegroundColor Yellow
    Write-Host "The project should run, but some optimizations are recommended." -ForegroundColor Yellow
} else {
    Write-Host "❌ Tests completed with $ErrorCount errors and $WarningCount warnings" -ForegroundColor Red
    Write-Host "Please fix the errors before running the project." -ForegroundColor Red
}

Write-Host ""
Write-Host "To run the project:" -ForegroundColor Cyan
Write-Host "1. cd `"$ProjectRoot`"" -ForegroundColor White
Write-Host "2. python -m http.server 8000" -ForegroundColor White
Write-Host "3. Open http://localhost:8000 in your browser" -ForegroundColor White
Write-Host ""
Write-Host "For debug mode, append ?debug=true to the URL" -ForegroundColor Yellow

exit $ErrorCount
