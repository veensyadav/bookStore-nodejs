const express = require("express");
const purchaseController = require("../controllers/purchaseController");

/*
    baseUrl: api/v1/purchase/
*/
const router = express.Router();

router.post("/buy-book", purchaseController.purchaseBook);

router.post("/history", purchaseController.getAllPurchaseList);

router.post("/historyById/:userId", purchaseController.getPurchHistByUserId);

router.post("/history/byAuthor", purchaseController.getPurchHistByAuthorId);

module.exports = router;