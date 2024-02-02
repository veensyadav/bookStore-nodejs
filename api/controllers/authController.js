const AppError = require("../../utill/appError");
const catchAsync = require("../../utill/catchAsync");
const db = require("../../db-setup");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = db.users;

exports.signUp = catchAsync(async (req, res, next) => {
    const emailExists = await User.findOne({ where: { email: req.body.email } });
    if (emailExists) {
        return next(new AppError("Email already registered", 402));
    } else {
        const password = await bcrypt.hash(req.body.password, 8);
        const userDetails = await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: password,
            email: req.body.email,
            phone: req.body.phone,
            user_Type: req.body.user_Type || "retail_user",
            isDeleted: false
        })
        res.status(200).json({
            status: "success",
            data: {
                user: userDetails,
                token: token,
            },
        });
    }
});

exports.login = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
        return next(new AppError("user not found", 404));
    } else {
        if (user.isDeleted === true) {
            return next(new AppError("user not found", 404));
        } else if (user.password === null) {
            return next(new AppError("Please Enter Your Password", 404));
        } else {
            const isMatch = await bcrypt.compare(req.body.password, user.password);
            if (!isMatch) {
                return next(new AppError("Please enter a valid password", 404));
            } else {
                const token = jwt.sign({ id: user.id }, "secret", {
                    expiresIn: "12hr",
                });

                return res.send({
                    object: "user",
                    data: { user, token },
                    message: "signin success",
                });
            }

        }
    }
});