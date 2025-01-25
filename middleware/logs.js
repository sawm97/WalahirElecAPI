const logRequest = (req, res, next) => {
    console.log(`Request happens on:`, req.path);
    next();
}

module.exports = logRequest;