const AppError = require("../../utill/appError");
const catchAsync = require("../../utill/catchAsync");
const db = require("../../db-setup");
const emailSent = require("../services/mailController");

const cron = require('node-cron');

const books = db.books;
const purchase = db.purchaseHistory;
const users = db.users;


//create purchase data
exports.purchaseBook = catchAsync(async (req, res, next) => {
    // const userId = req.user.id;
    const { userId, bookId, quantity } = req.body;
    const userDetails = await users.findOne({ where: { id: userId } });
    if (userDetails.user_Type === "retail_user") {
        const book = await books.findOne({ where: { id: bookId } });
        if (book) {
            const purchaseData = await purchase.create({
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
                // Notify author and send email logic
                const retialerDetails = await users.findOne({ where: { id: purchaseData.userId } });
                const retailerEmail = retialerDetails.email;
                const authorData = await users.findOne({ where: { id: book.userId } });
                const authorEmail = authorData.email;
                emailSent.ClientPurchaseInfo(book, retailerEmail, purchaseData, authorEmail);
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
    if (userDetails) {
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
    } else {
        return next(new AppError("user is not exists.", 402));
    }
});


// get revenue by month and year
async function totalRevenueDetail() {
    const userDetails = await users.findAll({ where: { user_Type: "Author" } });
    let totalMonthlyRevenue = 0;
    let totalYearlyRevenue = 0;
    let totalRevenueTillToday = 0;
    const authorEmails = await userDetails.map((emails)=>emails.email);
    const authorIds = await userDetails.map((userId) => userId.id);
    for (const id of authorIds) {
        const booksDetails = await books.findAll({ where: { userId: id } });
        const bookIds = await booksDetails.map((bookid) => bookid.id);
        for (const bookid of bookIds) {
            const purchaseDetails = await purchase.findAll({ where: { bookId: bookid } });
            const currentMonthSells = purchaseDetails.filter((purchase) => {
                const purchaseDate = purchase.purchaseDate;
                const currentDate = new Date();
                return (purchaseDate.getMonth() + 1) === (currentDate.getMonth() + 1) && (purchaseDate.getFullYear() + 1) === (currentDate.getFullYear() + 1);
            });

            const bookRevenue = currentMonthSells.reduce((total, purchase) => total + purchase.price, 0);
            totalMonthlyRevenue += bookRevenue;
        } for (const bookid of bookIds) {
            const purchaseDetails = await purchase.findAll({ where: { bookId: bookid } });
            const currentYearSells = purchaseDetails.filter((purchase) => {
                const purchaseDate = purchase.purchaseDate;
                const currentDate = new Date();
                return (purchaseDate.getFullYear() + 1) === (currentDate.getFullYear() + 1);
            });

            const bookRevenue = currentYearSells.reduce((total, purchase) => total + purchase.price, 0);
            totalYearlyRevenue += bookRevenue;
        }

        for (const bookid of bookIds) {
            const purchaseDetails = await purchase.findAll({ where: { bookId: bookid } });
            const bookRevenue = purchaseDetails.reduce((total, purchase) => total + purchase.price, 0);
            totalRevenueTillToday += bookRevenue;
        }

        return {totalMonthlyRevenue, totalYearlyRevenue, totalRevenueTillToday, authorEmails};
    }

};


cron.schedule('0 0 1 * *', async () => { //  it specifies that the task should run at midnight on the first day of every month 
    // * * * * * * = sec:1-59, min:1-59, hour: 1-12, Day of the month, month, Day of the week, year
    const totalRevenue = await totalRevenueDetail();
    await emailSent.authorRevenueDetails(totalRevenue);
    console.log(totalRevenue, "totalRevenue");
});