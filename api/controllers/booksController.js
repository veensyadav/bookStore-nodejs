const AppError = require("../../utill/appError");
const catchAsync = require("../../utill/catchAsync");
const db = require("../../db-setup");

const books = db.books;
const user = db.users;


// API to allow author to publish books
exports.createBook = catchAsync(async (req, res, next) => {
    const bookExists = await books.findOne({ where: { title: req.body.title, isDeleted: false } });
    if (bookExists) {
        return next(new AppError("Book with this tittle is already registered", 402));
    } else {
        // const userDetails = await user.findOne({ where: { id: req.user.id, isDeleted: false } });
        const userDetails = await user.findOne({ where: { id: req.body.userId, isDeleted: false } });
        if (userDetails.user_Type == "Author") {
            const newBook = await books.create({
                authors: req.body.authors,
                title: req.body.title,
                description: req.body.description,
                price: req.body.price,
                userId: req.body.userId,
                isDeleted: false
            })
            res.status(200).json({
                status: "success",
                data: {
                    newBooks: newBook,
                }
            });
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
    const userDetails = await user.findOne({ where: { id: req.params.id, isDeleted: false } });
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
        console.log(userDetails.user_Type,"userDetails")
        if (!userDetails.user_Type === "retail_user") {
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
