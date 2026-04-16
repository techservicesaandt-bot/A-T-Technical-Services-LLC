$root = $PSScriptRoot
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add('http://localhost:3001/')
$listener.Start()
Write-Host "A&T Site running at http://localhost:3001/" -ForegroundColor Green
while ($listener.IsListening) {
    $ctx  = $listener.GetContext()
    $req  = $ctx.Request
    $res  = $ctx.Response
    $path = $req.Url.LocalPath

    # API HANDLING: SAVE DATA
    if ($req.HttpMethod -eq 'POST' -and $path -eq '/api/save') {
        $reader = [System.IO.StreamReader]::new($req.InputStream)
        $body = $reader.ReadToEnd()
        $json = $body | ConvertFrom-Json
        
        $target = Join-Path $root ($json.file)
        # Ensure directory exists
        $dir = Split-Path $target
        if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir > $null }
        
        $json.data | ConvertTo-Json -Depth 100 | Out-File -FilePath $target -Encoding utf8
        
        $res.StatusCode = 200
        $res.OutputStream.Close()
        continue
    }

    # API HANDLING: UPLOAD IMAGE
    if ($req.HttpMethod -eq 'POST' -and $path -eq '/api/upload') {
        $reader = [System.IO.StreamReader]::new($req.InputStream)
        $body = $reader.ReadToEnd()
        $json = $body | ConvertFrom-Json
        
        $filename = $json.filename
        $base64 = $json.base64.Split(',')[-1]
        $bytes = [System.Convert]::FromBase64String($base64)
        
        $target = Join-Path $root "assets\uploads\$filename"
        $dir = Split-Path $target
        if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir > $null }
        
        [System.IO.File]::WriteAllBytes($target, $bytes)
        
        $res.StatusCode = 200
        $res.OutputStream.Close()
        continue
    }

    if ($path -eq '/') { $path = '/index.html' }
    $file = Join-Path $root $path.TrimStart('/')
    if (Test-Path $file -PathType Leaf) {
        $ext = [System.IO.Path]::GetExtension($file).ToLower()
        $ct  = switch ($ext) {
            '.html' { 'text/html; charset=utf-8' }
            '.css'  { 'text/css; charset=utf-8' }
            '.js'   { 'application/javascript; charset=utf-8' }
            '.json' { 'application/json; charset=utf-8' }
            '.png'  { 'image/png' }
            '.jpg'  { 'image/jpeg' }
            '.jpeg' { 'image/jpeg' }
            '.svg'  { 'image/svg+xml' }
            '.webp' { 'image/webp' }
            default { 'application/octet-stream' }
        }
        $bytes = [System.IO.File]::ReadAllBytes($file)
        $res.ContentType = $ct
        $res.ContentLength64 = $bytes.Length
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $res.StatusCode = 404
        $b = [System.Text.Encoding]::UTF8.GetBytes('404 Not Found')
        $res.OutputStream.Write($b, 0, $b.Length)
    }
    $res.OutputStream.Close()
}
