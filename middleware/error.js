const errorHandler = (error, request, response, next) => {
    if (error.status) {
        response.status(error.status).json({ msg: error.message });
    } else {
        response.status(500).json({ msg: error.message });
    }
};

module.exports = errorHandler;