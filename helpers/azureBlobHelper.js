const { BlobServiceClient, generateBlobSASQueryParameters, StorageSharedKeyCredential } = require('@azure/storage-blob');
require('dotenv').config();

const account = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

// Menggunakan StorageSharedKeyCredential yang benar
const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);

// Membuat blobServiceClient
const blobServiceClient = new BlobServiceClient(
    `https://${account}.blob.core.windows.net`,
    sharedKeyCredential
);

// Fungsi untuk mengupload file ke Azure Blob Storage
async function uploadToAzureBlob(fileBuffer, fileName, mimeType) {
    try {
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);

        await blockBlobClient.uploadData(fileBuffer, {
            blobHTTPHeaders: { blobContentType: mimeType }
        });

        return blockBlobClient.url;
    } catch (error) {
        console.error('Error uploading to Azure Blob:', error);
        throw error;
    }
}

// Fungsi untuk membuat SAS Token
function generateUserSASToken(userId) {
    const expiresOn = new Date();
    expiresOn.setMinutes(expiresOn.getMinutes() + parseInt(process.env.SAS_TOKEN_EXPIRY_MINUTES)); // contoh 10 menit

    const sasToken = generateBlobSASQueryParameters({
        containerName,
        permissions: "rwd", // read, write, delete
        expiresOn,
    }, sharedKeyCredential).toString();

    return { sasToken, expiresAt: expiresOn };
}

module.exports = { uploadToAzureBlob, generateUserSASToken };
