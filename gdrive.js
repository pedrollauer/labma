function findAndDownloadFile(auth) {
    const drive = google.drive({ version: 'v3', auth });
    // Search for the file by name
    console.log(FILE_NAME)
    drive.files.list({
        q: `name='${FILE_NAME}'`,
        fields: 'files(id, name)',
    }, (err, res) => {
        if (err) return console.error('Error searching for file:', err);
        const files = res.data.files;
        if (files.length) {
            const file = files[0]; // Assuming the first match is the correct file
            console.log(`Found file: ${file.name} (${file.id})`);
            downloadFile(auth, file.id);
        } else {
            console.log('No files found with the specified name.');
        }
    });
}

function downloadFile(auth, fileId) {
    const drive = google.drive({ version: 'v3', auth });
    const dest = fss.createWriteStream(path.join(__dirname, 'db', FILE_NAME));
    
    drive.files.get(
        { fileId: fileId, alt: 'media' },
        { responseType: 'stream' },
        (err, res) => {
            if (err) return console.error('Error downloading file:', err);
            res.data
                .on('end', () => {
                    console.log('Download completed.');
                })
                .on('error', (err) => {
                    console.error('Error during download', err);
                })
                .pipe(dest);
        }
    );
}

