Get-ChildItem -Path "logos" -Filter "*.svg" | ForEach-Object {
    $NewName = $_.Name.Replace(" ", "_")
    if ($_.Name -ne $NewName) {
        Rename-Item -Path $_.FullName -NewName $NewName -Force
    }
}
