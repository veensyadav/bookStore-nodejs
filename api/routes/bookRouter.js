const express = require("express");
const booksController = require("../controllers/booksController");

/*
    baseUrl: api/v1/book/
*/
const router = express.Router();

router.post("/create", booksController.createBook);

router.get("/getAll", booksController.getBooks);

router.post("/getById/:id", booksController.getBooksById);

router.post("/byAuthor/:id", booksController.getBooksByAuthor);

router.put("/deleteBook/:id", booksController.deleteBook);

module.exports = router;