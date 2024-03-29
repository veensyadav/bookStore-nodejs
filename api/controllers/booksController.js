const AppError = require("../../utill/appError");
const catchAsync = require("../../utill/catchAsync");
const db = require("../../db-setup");
const emailSent = require("../services/mailController");

const books = db.books;
const user = db.users;


// API to allow author to publish books
exports.createBook = catchAsync(async (req, res, next) => {
    const bookExists = await books.findOne({ where: { title: req.body.title, isDeleted: false } });
    if (bookExists) {
        return next(new AppError("Book with this tittle is already registered", 402));
    } else {
        const userDetails = await user.findOne({ where: { id: req.user.id, isDeleted: false } });
        if (userDetails.user_Type == "Author") {
            const newBook = await books.create({
                authors: req.body.authors,
                title: req.body.title,
                description: req.body.description,
                price: req.body.price,
                userId: req.user.id,
                isDeleted: false
            });
            if (newBook) {
                const userDetails = await user.findAll({ where: { user_Type: "retail_user" } });
                const retailersEmails = userDetails.map((email) => email.email);
                emailSent.bookReleaseNotif(newBook, retailersEmails);

                res.status(200).json({
                    status: "success",
                    data: {
                        newBooks: newBook,
                    }
                });
            }
        } else {
            return next(new AppError("Only Author will be able to publish book", 402));
        }
    }
});

// api to get all books
exports.getBooks = catchAsync(async (req, res, next) => {
    const getAllBooks = await books.findAll();
    if (getAllBooks) {
        res.status(200).json({
            status: "success",
            data: {
                allBooks: getAllBooks,
            }
        });
    } else {
        return next(new AppError("Books are not available", 402));
    }
});

// api to get books by ID
exports.getBooksById = catchAsync(async (req, res, next) => {
    const getBook = await books.findOne({ where: { id: req.params.id, isDeleted: false } });
    if (getBook) {
        res.status(200).json({
            status: "success",
            data: {
                book: getBook,
            }
        });
    } else {
        return next(new AppError("Book is not available", 402));
    }
});

// api to get books by Author
exports.getBooksByAuthor = catchAsync(async (req, res, next) => {
    const userDetails = await user.findOne({ where: { id: req.user.id, isDeleted: false } });
    if (userDetails.user_Type == "Author") {
        const getBook = await books.findAll({ where: { userId: userDetails.id, isDeleted: false } });
        if (getBook) {
            res.status(200).json({
                status: "success",
                data: {
                    book: getBook,
                },
            });
        } else {
            return next(new AppError("Book is not available", 402));
        }
    }
});

// api to delete books by author
exports.deleteBook = catchAsync(async (req, res, next) => {
    const bookId = req.params.id;
    const bookDetail = await books.findOne({
        where: { id: bookId },
    });
    if (bookDetail) {
        const userDetails = await user.findOne({ where: { id: bookDetail.userId } });
        if (!(userDetails.user_Type === "retail_user")) {
            const DeleteBook = await books.update(
                { isDeleted: true },
                {
                    where: { id: bookId },
                }
            );
            return res.send({
                object: "book",
                data: DeleteBook,
                message: "Book Deleted Successfully",
            });
        } else {
            return next(new AppError("retail user is not have permission to delete", 402));
        }
    } else {
        return next(new AppError("Book not found", 404));
    }
});

// api to review and rate books
exports.bookReview = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const booksDetails = await books.findOne({ where: { id: req.params.id } });
    if (booksDetails) {
        const userDetails = await user.findOne({ where: { id: userId } });
        if (userDetails.user_Type === "retail_user") {
            const updateReview = await books.update({
                review: req.body.review,
                rating: req.body.rating
            },
                {
                    where: { id: req.params.id }
                })
                return res.send({
                    object: "updateReview",
                    data: updateReview,
                    message: "update Review & Rating Successfully",
                });
        } else {
            return next(new AppError("You are not a retail user", 404));
        }
    } else {
        return next(new AppError("Book not found", 404));
    }
});