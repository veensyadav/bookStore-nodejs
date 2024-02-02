const AppError = require("../../utill/appError");
const catchAsync = require("../../utill/catchAsync");
const jwt = require('jsonwebtoken');


exports.verifyToken = catchAsync(async (req, res, next) => {

    let token = req.body.token || req.query.token || req.headers["authorization"];

    token = String(token).split(' ')[1];

    if (!token) {
        return next(new AppError('A token is required for authentication', 404));
    }

    try {
        const decoded = jwt.verify(token, "secret");
        req.user = decoded;
    } catch (err) {
        return next(`${err['message']}`, 404);
    }

    return next();

});
