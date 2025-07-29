const express = require('express');
const router = express.Router();
const movieController = require('../controller/movie');
const authenticate = require('../middleware/authentification');

// ========== MOVIE CRUD ROUTES ==========

// Get all movies
router.get('/', movieController.getAllMovies);

// Get movie by ID
router.get('/:id', movieController.getMovieById);

// Create a new movie (protected route)
router.post('/', authenticate, movieController.createMovie);

// Update movie by ID (protected route)
router.put('/:id', authenticate, movieController.updateMovie);

// Delete movie by ID (protected route)
router.delete('/:id', authenticate, movieController.deleteMovie);

// ========== MOVIE EVALUATION ROUTES ==========

// Add a single evaluation for a movie (protected route)
router.post('/evaluate', authenticate, movieController.addMovieEvaluation);

// Add multiple evaluations for movies (protected route)
router.post('/evaluate-many', authenticate, movieController.addMultipleMovieEvaluations);

// Get all evaluations for a specific movie
router.get('/:movieId/evaluations', movieController.getMovieEvaluations);

// Get current user's movie evaluations (protected route)
router.get('/user/evaluations', authenticate, movieController.getUserMovieEvaluations);

// Get movie statistics (average rating, total evaluations, etc.)
router.get('/:movieId/statistics', movieController.getMovieStatistics);

// Delete a specific evaluation by evaluation ID (protected route)
router.delete('/evaluations/:evaluationId', authenticate, movieController.deleteMovieEvaluation);

// Delete user's evaluation for a specific movie (protected route)
router.delete('/:movieId/evaluation', authenticate, movieController.deleteUserMovieEvaluation);

// Get top rated movies
router.get('/top/rated', movieController.getTopRatedMovies);

module.exports = router;
