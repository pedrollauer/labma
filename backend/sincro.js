const {google} = require('googleapis')
const fs = require('fs')
const path = require('path');

function pegarBanco(auth) {
    return new Promise((resolve, reject) => {
    const FILE_NAME = "labma.db"
    const drive = google.drive({ version: 'v3', auth });
    // Search for the file by name
    console.log(FILE_NAME)
    drive.files.list({
        q: `name='${FILE_NAME}'`,
        fields: 'files(id, name)',
    }, (err, res) => {
        if (err){
            return console.error('Error searching for file:', err);
        }
        
        const files = res.data.files;
        if (files.length) {
            const file = files[0]; // Assuming the first match is the correct file
            console.log(`Found file: ${file.name} (${file.id})`);
            baixarArquivo(auth, file.id, FILE_NAME).then(()=>{resolve()}).catch(err => console.log("Erro no download: "+err))
        } else {
            console.log('No files found with the specified name.');
        }
    });
    })
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
            console.log('File uploaded successfully', response.data);
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
    uploadDB
}
