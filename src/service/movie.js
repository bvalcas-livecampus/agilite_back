const db = require("../data/db.js");

// Get all movies
async function getAllMovies() {
    return db("movies").select("*");
}

// Get movie by ID
async function getMovieById(movieId) {
    return db("movies").where({ id: movieId }).first();
}

// Create a new movie
async function createMovie(movieData) {
    const [id] = await db("movies").insert(movieData);
    return getMovieById(id);
}

// Update movie by ID
async function updateMovie(movieId, updates) {
    await db("movies").where({ id: movieId }).update(updates);
    return getMovieById(movieId);
}

// Delete movie by ID
async function deleteMovie(movieId) {
    return db("movies").where({ id: movieId }).del();
}

// ========== MOVIE EVALUATIONS ==========

// Add a single evaluation for a movie
async function addMovieEvaluation(userId, movieId, rating, comment = null) {
    const evaluationData = {
        user_id: userId,
        movie_id: movieId,
        rating: rating,
        comment: comment,
        created_at: new Date(),
        updated_at: new Date(),
    };

    // Check if evaluation already exists for this user and movie
    const existingEvaluation = await db("movie_evaluations")
        .where({ user_id: userId, movie_id: movieId })
        .first();

    if (existingEvaluation) {
        // Update existing evaluation
        await db("movie_evaluations")
            .where({ user_id: userId, movie_id: movieId })
            .update({
                rating: rating,
                comment: comment,
                updated_at: new Date(),
            });

        return getMovieEvaluationByUserAndMovie(userId, movieId);
    } else {
        // Create new evaluation
        const [id] = await db("movie_evaluations").insert(evaluationData);
        return getMovieEvaluationById(id);
    }
}

// Add multiple evaluations for movies (batch operation)
async function addMultipleMovieEvaluations(userId, evaluations) {
    const results = [];

    for (const evaluation of evaluations) {
        const { movieId, rating, comment } = evaluation;
        const result = await addMovieEvaluation(
            userId,
            movieId,
            rating,
            comment
        );
        results.push(result);
    }

    return results;
}

// Get evaluation by ID
async function getMovieEvaluationById(evaluationId) {
    return db("movie_evaluations")
        .select(
            "movie_evaluations.*",
            "movies.title as movie_title",
            "movies.genre as movie_genre",
            "users.username as user_name"
        )
        .leftJoin("movies", "movie_evaluations.movie_id", "movies.id")
        .leftJoin("users", "movie_evaluations.user_id", "users.id")
        .where("movie_evaluations.id", evaluationId)
        .first();
}

// Get evaluation by user and movie
async function getMovieEvaluationByUserAndMovie(userId, movieId) {
    return db("movie_evaluations")
        .select(
            "movie_evaluations.*",
            "movies.title as movie_title",
            "movies.genre as movie_genre",
            "users.username as user_name"
        )
        .leftJoin("movies", "movie_evaluations.movie_id", "movies.id")
        .leftJoin("users", "movie_evaluations.user_id", "users.id")
        .where({
            "movie_evaluations.user_id": userId,
            "movie_evaluations.movie_id": movieId,
        })
        .first();
}

// Get all evaluations for a movie
async function getMovieEvaluations(movieId) {
    return db("movie_evaluations")
        .select("movie_evaluations.*", "users.username as user_name")
        .leftJoin("users", "movie_evaluations.user_id", "users.id")
        .where("movie_evaluations.movie_id", movieId)
        .orderBy("movie_evaluations.created_at", "desc");
}

// Get all evaluations by a user
async function getUserMovieEvaluations(userId) {
    return db("movie_evaluations")
        .select(
            "movie_evaluations.*",
            "movies.title as movie_title",
            "movies.genre as movie_genre"
        )
        .leftJoin("movies", "movie_evaluations.movie_id", "movies.id")
        .where("movie_evaluations.user_id", userId)
        .orderBy("movie_evaluations.created_at", "desc");
}

// Get movie statistics (average rating, total evaluations)
async function getMovieStatistics(movieId) {
    const stats = await db("movie_evaluations")
        .where("movie_id", movieId)
        .select(
            db.raw("AVG(rating) as average_rating"),
            db.raw("COUNT(*) as total_evaluations"),
            db.raw("MIN(rating) as min_rating"),
            db.raw("MAX(rating) as max_rating")
        )
        .first();

    return {
        movieId: movieId,
        averageRating: parseFloat(stats.average_rating) || 0,
        totalEvaluations: parseInt(stats.total_evaluations) || 0,
        minRating: parseInt(stats.min_rating) || 0,
        maxRating: parseInt(stats.max_rating) || 0,
    };
}

// Delete an evaluation
async function deleteMovieEvaluation(evaluationId) {
    return db("movie_evaluations").where({ id: evaluationId }).del();
}

// Delete user's evaluation for a specific movie
async function deleteUserMovieEvaluation(userId, movieId) {
    return db("movie_evaluations")
        .where({ user_id: userId, movie_id: movieId })
        .del();
}

// Get top rated movies
async function getTopRatedMovies(limit = 10) {
    return db("movies")
        .select(
            "movies.*",
            db.raw("AVG(movie_evaluations.rating) as average_rating"),
            db.raw("COUNT(movie_evaluations.id) as total_evaluations")
        )
        .leftJoin(
            "movie_evaluations",
            "movies.id",
            "movie_evaluations.movie_id"
        )
        .groupBy("movies.id")
        .havingRaw("COUNT(movie_evaluations.id) > 0")
        .orderBy("average_rating", "desc")
        .limit(limit);
}

module.exports = {
    // Movie CRUD operations
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie,

    // Movie evaluation operations
    addMovieEvaluation,
    addMultipleMovieEvaluations,
    getMovieEvaluationById,
    getMovieEvaluationByUserAndMovie,
    getMovieEvaluations,
    getUserMovieEvaluations,
    getMovieStatistics,
    deleteMovieEvaluation,
    deleteUserMovieEvaluation,
    getTopRatedMovies,
};
