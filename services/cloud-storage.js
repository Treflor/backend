const path = require('path');
const { Storage } = require('@google-cloud/storage');

const gcs = new Storage({
    projectId: process.env.PROJECT_ID,
    credentials:{
        client_email:process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY.replace(new RegExp("\\\\n", "\g"), "\n"),
    }
});

module.exports = gcs; 