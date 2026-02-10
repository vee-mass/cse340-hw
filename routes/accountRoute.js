const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')
const invController = require("../controllers/invController")

// Deliver views
router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/register", utilities.handleErrors(accountController.buildRegister))
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagementView))
// Process registration
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Task 5: Deliver Update View
router.get("/update/:accountId", utilities.handleErrors(accountController.buildAccountUpdateView))

// Task 5: Process Account Update 
router.post(
  "/update",
  regValidate.updateRules(),
  regValidate.checkUpdateData, 
  utilities.handleErrors(accountController.updateAccount)
)

// Task 5: Process Password Change
router.post(
  "/password",
  regValidate.passwordRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updatePassword)
)

// Task 6: Logout 
router.get("/logout", utilities.handleErrors(accountController.accountLogout))
module.exports = router