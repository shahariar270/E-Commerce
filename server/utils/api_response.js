
class response {
    constructor(status, message, data, success = true) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.success = success;
    }
}

module.exports = response;