const AppError = require("../../utill/appError");
const catchAsync = require("../../utill/catchAsync");
const db = require("../../db-setup");

const books = db.books;
const purchase = db.purchaseHistory;


//create purchase data
exports.purchase = catchAsync(async (req, res, next) => {
    const { userId, bookId, quantity } = req.body;
    const book = await books.findOne({ where: { id: bookId } });
    if (book) {
        const purchaseData = await purchase.create({
            purchaseDate: new Date(),
            userId: userId,
            bookId: bookId,
            quantity: quantity,
            price: book.price * quantity
        });
        const updateSellCount = await books.increment('sellCount', { by: quantity });
        if (purchaseData) {
            // Notify author and send email logic goes here...
            res.status(200).json({
                status: "success",
                data: {
                    purchase: purchaseData,
                    updateSellCount: updateSellCount,
                },
            });
        } else {
            return next(new AppError("Purchase Data is not created", 402));
        }
    } else {
        return next(new AppError("Book is not in stock", 402));
    }
});

// get all purchase lists for admin
exports.getAllPurchaseList = catchAsync(async (req, res, next) => {
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
});

// get purchase history by userId for author or retail_users
exports.getPurchHistByUserId = catchAsync(async (req, res, next) => {
    const purchaseList = await purchase.find({ where: { userId: req.body.userId } });
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