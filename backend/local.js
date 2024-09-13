const fs = require('fs');
const path = require('path');

function readAndParseJSON(filePath) {
  return new Promise((resolve, reject) => {
    // Read the file content
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(`Error reading file: ${err}`);
      } else {
        try {
          // Parse the JSON data
          const parsedData = JSON.parse(data);
          resolve(parsedData);
        } catch (parseError) {
          reject(`Error parsing JSON: ${parseError}`);
        }
      }
    });
  });
}

function writeJSONToFile(filePath, jsonData) {
  return new Promise((resolve, reject) => {
    try {
      // Convert JSON object to string
      const jsonString = JSON.stringify(jsonData, null, 2); // pretty-print with 2 spaces
      // Write the string to a file
      fs.writeFile(filePath, jsonString, 'utf8', (err) => {
        if (err) {
          reject(`Error writing file: ${err}`);
        } else {
          resolve('File successfully written!');
        }
      });
    } catch (stringifyError) {
      reject(`Error converting JSON to string: ${stringifyError}`);
    }
  });
}

module.exports = {
    readAndParseJSON: readAndParseJSON,
    writeJSONToFile: writeJSONToFile
}