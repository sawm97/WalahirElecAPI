const { generateUserSASToken } = require('../helpers/azureBlobHelper');
const { storeUserSASToken } = require('../models/userModel');

async function refreshSASToken(req, res) {
    const userId = req.user.id; // dari middleware autentikasi JWT

    try {
        const { sasToken, expiresAt } = generateUserSASToken(userId);
        await storeUserSASToken(userId, sasToken, expiresAt);

        res.status(200).json({
            status: 'success',
            IsSuccess: true,
            sasToken,
            expiresAt
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            IsSuccess: false,
            message: 'Gagal merefresh SAS Token',
            error: error.message
        });
    }
}

module.exports = { refreshSASToken };
