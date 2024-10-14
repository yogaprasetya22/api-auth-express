import { validate } from "../validation/validation";
import {
    getUserValidation,
    loginUserValidation,
    registerUserValidation,
    updateUserValidation,
} from "../validation/user-validatiom";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import bcrypt from "bcrypt";
import { Request } from "express";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";

const register = async (request: Request) => {
    const user = validate(registerUserValidation, request);

    const countUser = await prismaClient.user.count({
        where: {
            uuid: user.uuid,
        },
    });

    if (countUser === 1) {
        throw new ResponseError(400, "User already exists");
    }

    user.password = await bcrypt.hash(user.password, 10);
    user.uuid = uuid();

    return prismaClient.user.create({
        data: user,
        select: {
            uuid: true,
            first_name: true,
            full_name: true,
            email: true,
            password: true,
        },
    });
};

const login = async (request: Request) => {
    const loginRequest = validate(loginUserValidation, request);

    const user = await prismaClient.user.findUnique({
        where: {
            email: loginRequest.email,
        },
        select: {
            uuid: true,
            password: true,
        },
    });

    if (!user) {
        throw new ResponseError(401, "uuid or password wrong");
    }

    if (!user.password) {
        throw new ResponseError(401, "uuid or password wrong");
    }

    const isPasswordValid = await bcrypt.compare(
        loginRequest.password,
        user.password
    );
    if (!isPasswordValid) {
        throw new ResponseError(401, "uuid or password wrong");
    }

    const secret = process.env.JWT_SECRET!;

    const expiresIn = 60 * 60 * 1;

   const token = jwt.sign({ uuid: user.uuid }, secret, {
       expiresIn: expiresIn,
   });


    return {
        token: token,
        expiresIn: expiresIn,
    };
};

const get = async (uuid: string) => {
    uuid = validate(getUserValidation, uuid as any);

    const user = await prismaClient.user.findUnique({
        where: {
            uuid: uuid,
        },
        select: {
            uuid: true,
            first_name: true,
            full_name: true,
            email: true,
        },
    });

    if (!user) {
        throw new ResponseError(404, "user is not found");
    }

    return user;
};

const update = async (request: Request) => {
    const user = validate(updateUserValidation, request);

    const totalUserInDatabase = await prismaClient.user.count({
        where: {
            uuid: user.uuid,
        },
    });

    if (totalUserInDatabase !== 1) {
        throw new ResponseError(404, "user is not found");
    }

    const data: { full_name?: string; password?: string } = {};
    if (user.full_name) {
        data.full_name = user.full_name;
    }
    if (user.password) {
        data.password = await bcrypt.hash(user.password, 10);
    }

    return prismaClient.user.update({
        where: {
            uuid: user.uuid,
        },
        data: data,
        select: {
            uuid: true,
            full_name: true,
        },
    });
};

const logout = async (uuid: string) => {
    uuid = validate(getUserValidation, uuid as any);

    const user = await prismaClient.user.findUnique({
        where: {
            uuid: uuid,
        },
    });

    if (!user) {
        throw new ResponseError(404, "user is not found");
    }

    return prismaClient.user.update({
        where: {
            uuid: uuid,
        },
        data: {
            token: null,
        },
        select: {
            uuid: true,
        },
    });
};

const validateEmail = async (request: any) => {
    const user = await prismaClient.user.findUnique({
        where: {
            email: request.email,
        },
        select: {
            uuid: true,
            first_name: true,
            full_name: true,
            email: true,
        },
    });

    if (!user) {
        return prismaClient.user.create({
            data: {
                uuid: uuid(),
                first_name: request.given_name,
                full_name: request.name,
                email: request.email,
            },
        });
    }

    return user;
};

export default {
    register,
    login,
    get,
    update,
    logout,
    validateEmail,
};
