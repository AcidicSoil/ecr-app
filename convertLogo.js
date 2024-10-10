const fs = require('fs');
const path = require('path');

// Use path.join to create a platform-independent file path
const logoPath = path.join(__dirname, 'logo.png');

try {
  // Check if the file exists before trying to read it
  if (fs.existsSync(logoPath)) {
    const data = fs.readFileSync(logoPath);
    // Convert the buffer to a base64 string
    const base64String = data.toString('base64');

    // Create the full data URL
    const dataUrl = `data:image/png;base64,${base64String}`;

    // Write the result to a file
    fs.writeFileSync('src/assets/logoBase64.js', `export const logoBase64 = '${dataUrl}';`);

    console.log('Base64 logo string has been written to src/assets/logoBase64.js');
  } else {
    console.error(`File not found: ${logoPath}`);
  }
} catch (error) {
  console.error('Error reading file:', error);
}