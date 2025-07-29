const knex = require('knex');
const path = require('path');

// Database configuration
const config = {
    client: 'sqlite3',
    connection: {
        filename: path.join(__dirname, '../../database.sqlite')
    },
    useNullAsDefault: true,
    migrations: {
        directory: path.join(__dirname, 'migrations')
    },
    seeds: {
        directory: path.join(__dirname, 'seeds')
    }
};

// Create knex instance
const db = knex(config);

// Initialize database tables if they don't exist
async function initializeDatabase() {
    try {
        // Check if users table exists
        const hasUsersTable = await db.schema.hasTable('users');
        if (!hasUsersTable) {
            await db.schema.createTable('users', (table) => {
                table.increments('id').primary();
                table.string('username').notNullable().unique();
                table.string('email').notNullable().unique();
                table.string('password').notNullable();
                table.timestamps(true, true);
            });
            console.log('Users table created');
        }

        // Check if movies table exists
        const hasMoviesTable = await db.schema.hasTable('movies');
        if (!hasMoviesTable) {
            await db.schema.createTable('movies', (table) => {
                table.increments('id').primary();
                table.string('title').notNullable();
                table.string('genre').notNullable();
                table.string('director');
                table.integer('year');
                table.text('description');
                table.timestamps(true, true);
            });
            console.log('Movies table created');
        }

        // Check if movie_evaluations table exists
        const hasEvaluationsTable = await db.schema.hasTable('movie_evaluations');
        if (!hasEvaluationsTable) {
            await db.schema.createTable('movie_evaluations', (table) => {
                table.increments('id').primary();
                table.integer('user_id').unsigned().notNullable();
                table.integer('movie_id').unsigned().notNullable();
                table.integer('rating').notNullable().checkBetween([1, 5]);
                table.text('comment');
                table.timestamps(true, true);
                
                // Foreign keys
                table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
                table.foreign('movie_id').references('id').inTable('movies').onDelete('CASCADE');
                
                // Unique constraint to prevent duplicate evaluations from same user for same movie
                table.unique(['user_id', 'movie_id']);
            });
            console.log('Movie evaluations table created');
        }

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization error:', error);
    }
}

// Initialize database on module load
initializeDatabase();

module.exports = db;
