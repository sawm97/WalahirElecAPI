const logRequest = (req, res, next) => {
    console.log(`Request happens on:`, req.path, ` | Request type:`, req.method, ` | Request time:`, new Date());
    next();
}

module.exports = logRequest;