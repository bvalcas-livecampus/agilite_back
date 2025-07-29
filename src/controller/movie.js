const MovieService = require('../service/movie');

// ========== MOVIE CRUD OPERATIONS ==========

exports.getAllMovies = async (req, res) => {
    try {
        const movies = await MovieService.getAllMovies();
        res.json({
            message: 'Movies retrieved successfully',
            data: movies
        });
    } catch (err) {
        console.error('Get all movies error:', err);
        res.status(500).json({ error: 'Failed to retrieve movies' });
    }
};

exports.getMovieById = async (req, res) => {
    try {
        const movie = await MovieService.getMovieById(req.params.id);
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.json({
            message: 'Movie retrieved successfully',
            data: movie
        });
    } catch (err) {
        console.error('Get movie by ID error:', err);
        res.status(500).json({ error: 'Failed to retrieve movie' });
    }
};

exports.createMovie = async (req, res) => {
    try {
        const { title, genre, director, year, description } = req.body;
        
        // Validation
        if (!title || !genre) {
            return res.status(400).json({ 
                error: 'Title and genre are required' 
            });
        }

        const movieData = {
            title,
            genre,
            director: director || null,
            year: year || null,
            description: description || null,
            created_at: new Date(),
            updated_at: new Date()
        };

        const newMovie = await MovieService.createMovie(movieData);
        res.status(201).json({
            message: 'Movie created successfully',
            data: newMovie
        });
    } catch (err) {
        console.error('Create movie error:', err);
        res.status(500).json({ error: 'Failed to create movie' });
    }
};

exports.updateMovie = async (req, res) => {
    try {
        const { title, genre, director, year, description } = req.body;
        const movieId = req.params.id;

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (genre !== undefined) updateData.genre = genre;
        if (director !== undefined) updateData.director = director;
        if (year !== undefined) updateData.year = year;
        if (description !== undefined) updateData.description = description;
        updateData.updated_at = new Date();

        const updatedMovie = await MovieService.updateMovie(movieId, updateData);
        if (!updatedMovie) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        res.json({
            message: 'Movie updated successfully',
            data: updatedMovie
        });
    } catch (err) {
        console.error('Update movie error:', err);
        res.status(500).json({ error: 'Failed to update movie' });
    }
};

exports.deleteMovie = async (req, res) => {
    try {
        const deleted = await MovieService.deleteMovie(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.json({ message: 'Movie deleted successfully' });
    } catch (err) {
        console.error('Delete movie error:', err);
        res.status(500).json({ error: 'Failed to delete movie' });
    }
};

// ========== MOVIE EVALUATION OPERATIONS ==========

exports.addMovieEvaluation = async (req, res) => {
    try {
        const { movieId, rating, comment } = req.body;
        const userId = req.user.id; // From authentication middleware

        // Validation
        if (!movieId || !rating) {
            return res.status(400).json({ 
                error: 'Movie ID and rating are required' 
            });
        }

        if (typeof rating !== 'number' || rating < 1 || rating > 5) {
            return res.status(400).json({ 
                error: 'Rating must be a number between 1 and 5' 
            });
        }

        // Check if movie exists
        const movie = await MovieService.getMovieById(movieId);
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        const evaluation = await MovieService.addMovieEvaluation(
            userId, 
            movieId, 
            rating, 
            comment
        );

        res.status(201).json({
            message: 'Movie evaluation added successfully',
            data: evaluation
        });
    } catch (err) {
        console.error('Add movie evaluation error:', err);
        res.status(500).json({ error: 'Failed to add movie evaluation' });
    }
};

exports.addMultipleMovieEvaluations = async (req, res) => {
    try {
        const { evaluations } = req.body;
        const userId = req.user.id; // From authentication middleware

        // Basic validation
        if (!Array.isArray(evaluations) || evaluations.length === 0) {
            return res.status(400).json({ 
                error: 'Evaluations array is required and cannot be empty' 
            });
        }

        // Validate each evaluation
        for (const evalItem of evaluations) {
            if (!evalItem.movieId || typeof evalItem.rating !== 'number') {
                return res.status(400).json({ 
                    error: 'Each evaluation must have movieId and numeric rating' 
                });
            }
            
            if (evalItem.rating < 1 || evalItem.rating > 5) {
                return res.status(400).json({ 
                    error: 'All ratings must be between 1 and 5' 
                });
            }
        }

        const results = await MovieService.addMultipleMovieEvaluations(userId, evaluations);

        res.status(201).json({
            message: 'Movie evaluations added successfully',
            data: results
        });
    } catch (err) {
        console.error('Add multiple movie evaluations error:', err);
        res.status(500).json({ error: 'Failed to add movie evaluations' });
    }
};

exports.getMovieEvaluations = async (req, res) => {
    try {
        const movieId = req.params.movieId;
        const evaluations = await MovieService.getMovieEvaluations(movieId);
        
        res.json({
            message: 'Movie evaluations retrieved successfully',
            data: evaluations
        });
    } catch (err) {
        console.error('Get movie evaluations error:', err);
        res.status(500).json({ error: 'Failed to retrieve movie evaluations' });
    }
};

exports.getUserMovieEvaluations = async (req, res) => {
    try {
        const userId = req.user.id; // From authentication middleware
        const evaluations = await MovieService.getUserMovieEvaluations(userId);
        
        res.json({
            message: 'User movie evaluations retrieved successfully',
            data: evaluations
        });
    } catch (err) {
        console.error('Get user movie evaluations error:', err);
        res.status(500).json({ error: 'Failed to retrieve user movie evaluations' });
    }
};

exports.getMovieStatistics = async (req, res) => {
    try {
        const movieId = req.params.movieId;
        const statistics = await MovieService.getMovieStatistics(movieId);
        
        res.json({
            message: 'Movie statistics retrieved successfully',
            data: statistics
        });
    } catch (err) {
        console.error('Get movie statistics error:', err);
        res.status(500).json({ error: 'Failed to retrieve movie statistics' });
    }
};

exports.deleteMovieEvaluation = async (req, res) => {
    try {
        const evaluationId = req.params.evaluationId;
        const userId = req.user.id;

        // Check if evaluation exists and belongs to the user
        const evaluation = await MovieService.getMovieEvaluationById(evaluationId);
        if (!evaluation) {
            return res.status(404).json({ error: 'Evaluation not found' });
        }

        if (evaluation.user_id !== userId) {
            return res.status(403).json({ error: 'Not authorized to delete this evaluation' });
        }

        const deleted = await MovieService.deleteMovieEvaluation(evaluationId);
        if (!deleted) {
            return res.status(404).json({ error: 'Evaluation not found' });
        }

        res.json({ message: 'Movie evaluation deleted successfully' });
    } catch (err) {
        console.error('Delete movie evaluation error:', err);
        res.status(500).json({ error: 'Failed to delete movie evaluation' });
    }
};

exports.deleteUserMovieEvaluation = async (req, res) => {
    try {
        const movieId = req.params.movieId;
        const userId = req.user.id;

        const deleted = await MovieService.deleteUserMovieEvaluation(userId, movieId);
        if (!deleted) {
            return res.status(404).json({ error: 'Evaluation not found' });
        }

        res.json({ message: 'Movie evaluation deleted successfully' });
    } catch (err) {
        console.error('Delete user movie evaluation error:', err);
        res.status(500).json({ error: 'Failed to delete movie evaluation' });
    }
};

exports.getTopRatedMovies = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const topMovies = await MovieService.getTopRatedMovies(limit);
        
        res.json({
            message: 'Top rated movies retrieved successfully',
            data: topMovies
        });
    } catch (err) {
        console.error('Get top rated movies error:', err);
        res.status(500).json({ error: 'Failed to retrieve top rated movies' });
    }
};
