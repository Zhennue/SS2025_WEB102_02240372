const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { users } = require('../utils/mockData');

// @desc    Get all users
// @route   GET /api/users
// @access  Public
exports.getUsers = asyncHandler(async (req, res, next) => {
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = users.length;

    // Get paginated results
    const results = users.slice(startIndex, endIndex);

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        };
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        };
    }

    res.status(200).json({
        success: true,
        count: results.length,
        page,
        total_pages: Math.ceil(total / limit),
        pagination,
        data: results
    });
});

app.use(require('./middleware/formatresponse'));