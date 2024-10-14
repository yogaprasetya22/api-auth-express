import { ResponseError } from "../error/response-error";
import { Schema } from "joi"; // Assuming you are using Joi for schema validation
import { Request } from "express"; // Assuming you are using Express for request type

interface ValidationResult {
    value: any;
    error?: {
        message: string;
    };
}

const validate = (schema: Schema, request: Request): any => {
    const result: ValidationResult = schema.validate(request, {
        abortEarly: false,
        allowUnknown: false,
    });
    if (result.error) {
        throw new ResponseError(400, result.error.message);
    } else {
        return result.value;
    }
};

export { validate };
