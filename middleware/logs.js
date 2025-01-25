const logRequest = (req, res, next) => {
    let date = new Date();
    date.setHours(date.getHours() + 7); // Menambahkan 7 jam

    // Format tanggal ke format Indonesia (DD-MM-YYYY HH:mm:ss)
    const formattedDate = date.toLocaleString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    console.log(`Request happens on:`, req.path, ` | Request type:`, req.method, ` | Request time:`, formattedDate);
    next();
}

module.exports = logRequest;
