const logRequest = (req, res, next) => {
    console.log(`Request happens on:`, req.path);
    console.log(`Request type:`, req.method);
    console.log(`Request time:`, new Date());
    next();
}

module.exports = logRequest;