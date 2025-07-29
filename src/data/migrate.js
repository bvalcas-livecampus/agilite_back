const db = require("./db");

async function migrate() {
    await db.schema.createTableIfNotExists("users", (table) => {
        table.increments("id").primary();
        table.string("email").unique().notNullable();
        table.string("password_hash").notNullable();
        table.string("username");
    });

    await db.schema.createTableIfNotExists("movies", (table) => {
        table.increments("id").primary();
        table.string("title").notNullable();
        table.string("genre");
        table.text("synopsis");
        table.string("poster_url");
        table.integer("year");
    });

    await db.schema.createTableIfNotExists("movie_evaluations", (table) => {
        table.increments("id").primary();
        table.integer("user_id").notNullable();
        table.integer("movie_id").notNullable();
        table.integer("rating").notNullable();
        table.text("comment");
        table.timestamp("created_at").defaultTo(db.fn.now());
        table.timestamp("updated_at").defaultTo(db.fn.now());
        table.foreign("user_id").references("users.id").onDelete("CASCADE");
        table.foreign("movie_id").references("movies.id").onDelete("CASCADE");
    });

    console.log("Migration users terminée");
    process.exit();
}
migrate();
