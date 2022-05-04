export class APIError {
    constructor(message, status) {
        this.message = message;
        this.status = status
    }

    badRequest() {
        return new APIError(this.status,this.message);
    }

    notFound() {
        return new APIError(this.status,this.message);
    }

}