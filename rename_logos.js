const fs = require('fs');
const path = require('path');

const logosDir = path.join(__dirname, 'logos');

fs.readdirSync(logosDir).forEach(file => {
  if (file.endsWith('.svg')) {
    const oldPath = path.join(logosDir, file);
    const newName = file.replace(/ /g, '_');
    const newPath = path.join(logosDir, newName);

    if (oldPath !== newPath) {
      fs.renameSync(oldPath, newPath);
      console.log(`Renamed: ${file} -> ${newName}`);
    }
  }
});
