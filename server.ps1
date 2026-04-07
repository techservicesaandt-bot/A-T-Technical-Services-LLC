$root = 'C:\Users\ahmed\.gemini\antigravity\scratch\AandT-Technical'
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add('http://localhost:3000/')
$listener.Start()
Write-Host "A&T Site running at http://localhost:3000/" -ForegroundColor Green
while ($listener.IsListening) {
    $ctx  = $listener.GetContext()
    $req  = $ctx.Request
    $res  = $ctx.Response
    $path = $req.Url.LocalPath
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
