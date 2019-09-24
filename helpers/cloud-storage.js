const path = require('path');
const { Storage } = require('@google-cloud/storage');

const gcs = new Storage({
    keyFilename: path.join(__dirname, "../treflor-temp-1234cd237824.json"),
    projectId: 'treflor-temp'
});

module.exports = gcs; 