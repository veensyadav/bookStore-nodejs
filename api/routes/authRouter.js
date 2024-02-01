const express = require("express");
const authController = require("../controllers/authController");

/*
    baseUrl: api/v1/users/
*/
const router = express.Router();

router.post("/signup", authController.signUp);

router.post("/login", authController.login);

module.exports = router;