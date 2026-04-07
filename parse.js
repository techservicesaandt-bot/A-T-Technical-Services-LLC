const fs = require('fs');

// Read the data.js file
const content = fs.readFileSync('data.js', 'utf8');

// Use regex to strip out `const AT_SERVICES = ` and the trailing semicolon
const jsonText = content.replace(/const\s+AT_SERVICES\s*=\s*/, '').replace(/;?\s*$/, '');

try {
    // Evaluate it securely or use simple replacement (since it's JS object syntax, eval is easiest locally)
    const data = eval('(' + jsonText + ')');

    // Add 10 gallery images to each project
    for (const service in data) {
        data[service].projects.forEach(proj => {
            proj.gallery = [
                proj.img, // Original image
                'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&q=80',
                'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1400&q=80',
                'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1400&q=80',
                'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1400&q=80',
                'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1400&q=80',
                'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1400&q=80',
                'https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?w=1400&q=80',
                'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80',
                'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1400&q=80'
            ];
            // Remove the single img since it's redundant, or keep it as thumbnail
            proj.thumbnail = proj.img;
            delete proj.img;
        });
    }

    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
    console.log("Successfully converted to data.json with galleries.");
} catch (e) {
    console.error("Error evaluating:", e);
}
