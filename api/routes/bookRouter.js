const express = require("express");
const verifyToken = require("../services/verifyToken");
const booksController = require("../controllers/booksController");

/*
    baseUrl: api/v1/book/
*/
const router = express.Router();


router.post("/create", verifyToken.verifyToken, booksController.createBook);

router.get("/getAll", booksController.getBooks);

router.post("/getById/:id", booksController.getBooksById);

router.post("/byAuthor", verifyToken.verifyToken, booksController.getBooksByAuthor);

router.put("/deleteBook/:id", verifyToken.verifyToken, booksController.deleteBook);

module.exports = router;