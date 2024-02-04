const AppError = require("../../utill/appError");
const catchAsync = require("../../utill/catchAsync");
const db = require("../../db-setup");

const books = db.books;
const purchase = db.purchaseHistory;
const users = db.users;
let value = 0;


//create purchase data
exports.purchaseBook = catchAsync(async (req, res, next) => {
    // const userId = req.user.id;
    const { userId, bookId, quantity } = req.body;
    const userDetails = await users.findOne({ where: { id: userId } });
    if (userDetails.user_Type === "retail_user") {
        const book = await books.findOne({ where: { id: bookId } });
        if (book) {
            const purchaseData = await purchase.create({
                purchaseId: generatePurchaseId(),
                purchaseDate: new Date(),
                userId: userId,
                bookId: bookId,
                quantity: quantity,
                price: book.price * quantity,
                isDeleted: false
            });
            // Update sellCount for the book
            book.sellCount += quantity;
            await book.save();

            if (purchaseData) {
                // Notify author and send email logic goes here...
                res.status(200).json({
                    status: "success",
                    data: {
                        purchase: purchaseData,
                    },
                    message: 'Book purchased successfully',
                });
            } else {
                return next(new AppError("Purchase Data is not created", 402));
            }
        } else {
            return next(new AppError("Book is not in stock", 402));
        }
    } else {
        return next(new AppError("only retail user allowed to purchase the book", 402));
    }
});

// Helper function to generate unique purchase ID
function generatePurchaseId() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const getNextValue = () => {
        value++;
        return value;
    };
    const x = String(getNextValue());
    const id = String(x);
    return `${year}-${month}-${day}-${id}`;
}

// get all purchase lists for admin
exports.getAllPurchaseList = catchAsync(async (req, res, next) => {
    const userDetail = await users.findOne({ where: { id: req.user.id } });
    if (userDetail.user_Type === "Admin") {
        const purchaseList = await purchase.findAll();
        if (purchaseList) {
            res.status(200).json({
                status: "success",
                data: {
                    purchaseList: purchaseList,
                }
            });
        } else {
            return next(new AppError("Not able to find purchase list.", 402));
        }
    } else {
        return next(new AppError("only admin allowed to view all purchase list.", 402));
    }
});

// get purchase history by userId for retail_users
exports.getPurchHistByUserId = catchAsync(async (req, res, next) => {
    // const purchaseList = await purchase.findAll({ where: { userId: req.user.id } });
    const purchaseList = await purchase.findAll({ where: { userId: req.params.id } });
    if (purchaseList) {
        res.status(200).json({
            status: "success",
            data: {
                purchaseList: purchaseList,
            }
        });
    } else {
        return next(new AppError("Not able to find purchase list realted to this userId.", 402));
    }
});



// get purchase history by author
exports.getPurchHistByAuthorId = catchAsync(async (req, res, next) => {
    const userDetails = await users.findOne({ where: { id: req.body.id } });
    if(userDetails){
        const booksDetails = await books.findAll({ where: { userId: userDetails.id } });
        const bookIds = booksDetails.map(book => book.id);
        const purchaseList = await purchase.findAll({ where: { bookId: bookIds } });
        if (purchaseList) {
            res.status(200).json({
                status: "success",
                data: {
                    purchaseList: purchaseList,
                }
            });
        } else {
            return next(new AppError("Not able to find purchase list realted to this userId.", 402));
        }
    } else{
        return next(new AppError("user is not exists.", 402));
    }
});