import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js";

export function authMiddleware(req, res, next) {
    const header = req.headers.authorization;
    if (!header) return res.sendStatus(401);
    const token = header.split(" ")[1];
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}
