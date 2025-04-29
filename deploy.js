const fs = require('fs-extra');
const path = require('path');

// Paths
const clientBuildPath = path.join(__dirname, 'client', 'build');
const publicPath = path.join(__dirname, 'public');

// Create public directory if it doesn't exist
if (!fs.existsSync(publicPath)) {
  fs.mkdirSync(publicPath);
}

// Copy React build to public folder
fs.copySync(clientBuildPath, publicPath, { overwrite: true });
console.log('React build files copied to public folder');

// Copy server files
const filesToCopy = [
  'server.js',
  'package.json',
  '.htaccess',
  '.env',
  'Procfile'
];

// Copy directories
const directoriesToCopy = [
  'routes',
  'models',
  'config',
  'services',
  'middleware'
];

// Copy individual files
filesToCopy.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    fs.copySync(
      path.join(__dirname, file),
      path.join(publicPath, file),
      { overwrite: true }
    );
    console.log(`Copied ${file} to public folder`);
  }
});

// Copy directories
directoriesToCopy.forEach(dir => {
  if (fs.existsSync(path.join(__dirname, dir))) {
    fs.copySync(
      path.join(__dirname, dir),
      path.join(publicPath, dir),
      { overwrite: true }
    );
    console.log(`Copied ${dir} directory to public folder`);
  }
});

console.log('All files prepared for cPanel deployment in the public folder');
console.log('Next steps:');
console.log('1. Zip the contents of the public folder');
console.log('2. Upload the zip to your cPanel hosting');
console.log('3. Extract the zip in your public_html or custom directory');
console.log('4. Set up a MySQL database in cPanel');
console.log('5. Update your .env file with the correct database credentials');
console.log('6. Install dependencies by running: ssh into your server and run npm install'); 