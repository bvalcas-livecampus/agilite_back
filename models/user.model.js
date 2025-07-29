import { openDb } from "../data/db.js";

export const User = {
    async create({ email, password_hash, google_id, role = "user" }) {
        const db = await openDb();
        return db.run(
            "INSERT INTO users (email, password_hash, google_id, role) VALUES (?, ?, ?, ?)",
            [email, password_hash, google_id, role]
        );
    },
    async findByEmail(email) {
        const db = await openDb();
        return db.get("SELECT * FROM users WHERE email = ?", [email]);
    },
};
