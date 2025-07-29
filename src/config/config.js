import dotenv from "dotenv";
dotenv.config();

if (!process.env.JWT_SECRET) {
    console.error("Missing JWT_SECRET environment variable.");
    process.exit(1);
}

export const JWT_SECRET = process.env.JWT_SECRET;
export const PORT = process.env.PORT;
