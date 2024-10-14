import { User } from "@prisma/client";
import { prismaClient } from "../application/database";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        res.status(401)
            .json({ errors: "Unauthorized: Token is missing or invalid" })
            .end();
        return;
    }

    const token = authorization.split(" ")[1]; // Extract the JWT token from the "Bearer" format
    const secret = process.env.JWT_SECRET!;

    try {
        const decodedToken = jwt.verify(token, secret) as { uuid: string };
        (req as any).uuid = decodedToken.uuid; // menyimpan uuid di req.user

        next();
    } catch (error) {
        res.status(401)
            .json({ errors: "Unauthorized: Invalid or expired token" })
            .end();
        return;
    }
};
