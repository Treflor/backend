const { Storage } = require('@google-cloud/storage');
const config = require('../configuration');

const CLOUD_BUCKET = config.storage.bucket;

const storage = new Storage({
    projectId: config.storage.projectId,
    credentials: {
        client_email: config.storage.client_email,
        private_key: config.storage.private_key.replace(new RegExp("\\\\n", "\g"), "\n"),
    }
});
const bucket = storage.bucket(CLOUD_BUCKET);

exports.storeFile = (fileBuffer, path, filename, cb) => {
    const storageFile = bucket.file(path + '/' + filename);

    const stream = storageFile.createWriteStream({
        metadata: {
            contentType: "image/png"
        },
        resumable: false
    });

    stream.on('error', (err) => {
        cb(err, null);
    });

    stream.on('finish', () => {
        storageFile.makePublic().then(() => {
            cb(null, getPublicUrl(path, filename));
        });
    });

    stream.end(fileBuffer);
}

exports.deleteFile = (path, filename, cb) => {
    const storageFile = bucket.file(path + '/' + filename);

    storageFile.delete().then(res => {
        cb(null, res);
    }, err => {
        cb(err, null);
    });
}

function getPublicUrl(path, filename) {
    return `https://storage.googleapis.com/${CLOUD_BUCKET}/${path}/${filename}`;
}