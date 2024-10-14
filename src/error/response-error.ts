class ResponseError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        Object.setPrototypeOf(this, ResponseError.prototype); // Untuk mendukung inheritance di TypeScript
    }
}

export { ResponseError };
