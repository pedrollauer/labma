const {google} = require('googleapis')
const fs = require('fs')
const path = require('path');
const local = require('./local')




async function getUserEmail(auth) {
    const oauth2 = google.oauth2({
      auth: auth,
      version: 'v2',
    });
  
    try {
      // Get the user's profile using async/await
      const res = await oauth2.userinfo.get();
      
      // Extract the user's email from the response
      const userEmail = res.data.email;
  
      // Log the email if needed
      console.log('User email:', userEmail);
  
      // You can also save the email to a local file if needed
      const filePath = path.join(__dirname, '..', 'local_data', 'local.json');
      // You can write to this file if necessary
  
      // Return the user's email
      return userEmail;
      
    } catch (err) {
      console.error('Error fetching user info:', err);
      throw err; // Rethrow the error if you want to handle it further up
    }
  }
    function pegarBanco(auth) {
        return new Promise((resolve, reject) => {
            const FILE_NAME = "peFz2Aya9w.db";
            const drive = google.drive({ version: 'v3', auth });
    
            console.log(`Searching for file: ${FILE_NAME}`);
    
            // Modify the search to include files shared with the user
            drive.files.list({
                q: `name='${FILE_NAME}' and trashed=false`,
                fields: 'files(id, name)',
                corpora: 'user',  // This includes both 'My Drive' and shared files
                includeItemsFromAllDrives: true,  // Include shared drives if applicable
                supportsAllDrives: true  // To support shared drives if needed
            }, (err, res) => {
                if (err) {
                    console.error(`Error during file search: ${err.message}`);
                    return reject(err.response?.data?.error || "Unknown error");
                }
                
                const files = res.data.files;
                if (files.length) {
                    const file = files[0]; // Assuming the first match is the correct file
                    console.log(`Found file: ${file.name} (${file.id})`);
                    
                    baixarArquivo(auth, file.id, FILE_NAME)
                        .then(() => resolve(auth))
                        .catch(err => {
                            console.error(`Error downloading file: ${err}`);
                            reject(err);
                        });
                } else {
                    console.log('No files found with the specified name.');
                    resolve(auth);  // Resolve even when no files are found
                }
            });
        });
    }
    

function baixarArquivo(auth, fileId,FILE_NAME) {
    return new Promise((resolve, reject) => {
    const drive = google.drive({ version: 'v3', auth });
    const end = path.join(__dirname, '..', 'db', FILE_NAME)
    console.log(end)
    const dest = fs.createWriteStream(end);
    
    drive.files.get(
        { fileId: fileId, alt: 'media' },
        { responseType: 'stream' },
        (err, res) => {
            if (err) return console.error('Error downloading file:', err);
            res.data
                .on('end', () => {
                    console.log('Download completed.');
                    resolve()
                })
                .on('error', (err) => {
                    reject(new Error('Error during download', err)) 
                    
                })
                .pipe(dest);
        }
    );
    })
}

async function uploadArquivo(auth, filePath) {
    console.log("Starting file upload");
    console.log("File path:", filePath);

    // Extract the file name from the file path
    const fileName = path.basename(filePath);

    return new Promise((resolve, reject) => {
        const drive = google.drive({ version: 'v3', auth });

        const fileMetadata = {
            name: fileName, // Use the extracted file name
            parents: ['1GWPsJCbrITD9dRH_gp-9p8q7I3EdEAjP'] // Ensure it's an array of parent folder IDs
        };

        const media = {
            mimeType: 'application/pdf', // Adjust MIME type if needed
            body: fs.createReadStream(filePath),
        };

        drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id' // Request only the file ID in the response
        }, (err, file) => {
            if (err) {
                // Handle error
                console.error('Error during file upload:', err);
                reject(err); // Pass the error to the reject function
            } else {
                // File uploaded successfully
                console.log('File uploaded successfully, File ID:', file.data.id);
                resolve(file.data.id); // Resolve with the file ID
            }
        });
    });
}
async function uploadDB(auth) {
    return new Promise(async(resolve, reject) => {

        const drive = google.drive({ version: 'v3', auth });
        const filePath = path.join(__dirname, '../db/labma.db'); // Adjust the path if needed
        const fileId = '1Len4G81GeHBl72uOB5G5FFU68suKhTO2'; // The ID of the file to update

        console.log(filePath)
        const fileMetadata = {
            name: 'labma.db',
        };
        const media = {
            mimeType: 'application/x-sqlite3',
            body: fs.createReadStream(filePath),
        };

        try {
            const response = await drive.files.update({
                fileId: fileId,
                media: media,
                resource: fileMetadata,
            });
            resolve()
        } catch (error) {
            console.error('Error uploading the file:', error);
            reject()
        }
    })
}

module.exports = {
    pegarBanco,
    baixarArquivo,
    uploadDB,
    uploadArquivo,
    getUserEmail
}
