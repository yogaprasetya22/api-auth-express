import userService from "../service/user-service";
import { NextFunction, Request, Response } from "express";

const ping = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        res.json({
            data: "pong",
        });
    } catch (e) {
        next(e);
    }
};

const register = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const result = await userService.register(req.body);
        res.status(200).json({
            data: result,
        });
    } catch (e) {
        next(e);
    }
};

const login = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const result = await userService.login(req.body);
        res.status(200).json({
            data: result,
        });
    } catch (e) {
        next(e);
    }
};

const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const uuid = (req as any).uuid; // Casting req sebagai any untuk bypass tipe sementara
        const result = await userService.get(uuid as string);
        res.status(200).json({
            data: result,
        });
    } catch (e) {
        next(e);
    }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const username = (req as any).user.username;
        const request = req.body;
        request.username = username;

        const result = await userService.update(request);
        res.status(200).json({
            data: result,
        });
    } catch (e) {
        next(e);
    }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await userService.logout((req as any).user.username);
        res.status(200).json({
            data: "OK",
        });
    } catch (e) {
        next(e);
    }
};

export default {
    register,
    login,
    get,
    update,
    logout,
    ping,
};
