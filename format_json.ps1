$jsonPath = "data.json"
$content = Get-Content -Raw $jsonPath
$data = ConvertFrom-Json $content

$photos = @(
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&q=80",
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1400&q=80",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1400&q=80",
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1400&q=80",
    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1400&q=80",
    "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1400&q=80",
    "https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?w=1400&q=80",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1400&q=80"
)

# Loop over all services and ensure 10 photos in gallery
foreach ($prop in $data.psobject.properties) {
    $service = $prop.Value
    if ($null -ne $service.projects) {
        foreach ($proj in $service.projects) {
            $gallery = New-Object System.Collections.ArrayList
            [void]$gallery.Add($proj.thumbnail)
            
            $i = 0
            while ($gallery.Count -lt 10) {
                [void]$gallery.Add($photos[$i % $photos.Count])
                $i++
            }
            
            $proj.gallery = $gallery.ToArray()
        }
    }
}

$data | ConvertTo-Json -Depth 10 | Out-File -Encoding utf8 "data.json"
Write-Host "data.json successfully updated with 10 images per project"
