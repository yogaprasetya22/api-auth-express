import userService from "../service/user-service";
import { NextFunction, Request, Response } from "express";
import { google } from "googleapis";
import jwt from "jsonwebtoken";

const oauth2Client = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
});

const scopes = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
];

const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: "online",
    scope: scopes,
    include_granted_scopes: true,
});

const authGoogle = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        res.redirect(authorizationUrl);
    } catch (e) {
        next(e);
    }
};

const authGoogleCallback = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { code } = req.query;

        if (!code) {
            throw new Error("No code provided");
        }

        const { tokens } = await oauth2Client.getToken(code as string);
        oauth2Client.setCredentials(tokens);

        const oauth2 = google.oauth2({
            auth: oauth2Client,
            version: "v2",
        });

        const { data } = await oauth2.userinfo.get();

        if (!data.email || !data.name) {
            throw new Error("Invalid data from Google");
        }

        let user = await userService.validateEmail(data);

        if (!user) {
            user = await userService.register(req.body);
        }


        const secret = process.env.JWT_SECRET!;

        const expiresIn = 60 * 60 * 1;

        const token = jwt.sign(user, secret, { expiresIn: expiresIn });

        res.json({
            data: {
                uuid: user.uuid,
                first_name: user.first_name,
                full_name: user.full_name,
                email: user.email,
            },
            token: token,
        });
    } catch (e) {
        next(e);
    }
};

export default { authGoogle, authGoogleCallback };
