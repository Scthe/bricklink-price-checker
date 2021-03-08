// tiny script to pack the extension into .zip
// the result is 'bricklink-price-checker.zip' in root dir of this app

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const ARGS = process.argv.slice(2);
const IN_DIR = 'extension/';
const OUT_FILE = ARGS[0] || 'packed-extension.zip';
const outPath = path.join(__dirname, OUT_FILE);
console.log(`Will pack '${IN_DIR}' directory into '${outPath}'`)


const output = createOutputStream(outPath);
const archive = createArchiver();
archive.pipe(output); // pipe archive data to the file
archive.directory(IN_DIR, false);
archive.finalize();


/////////////////////
/// Utils

function createOutputStream(outPath) {
  const output = fs.createWriteStream(outPath);

  output.on('close', function() {
    console.log(archive.pointer() + ' total bytes');
    console.log('The file \'' + OUT_FILE + '\' was succesfully created. Ready to upload to the extension store!');
  });

  output.on('end', function() {
    console.log('Data has been drained');
  });

  return output;
}

function createArchiver() {
  const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
  });

  archive.on('warning', function(err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
  });

  archive.on('error', function(err) {
    throw err;
  });

  return archive;
}
