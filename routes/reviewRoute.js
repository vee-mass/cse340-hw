const express = require("express")
const router = new express.Router()
// Import the accountController since that's where your logic lives
const accountController = require("../controllers/accountController") 
const utilities = require("../utilities")
const reviewValidate = require("../utilities/review-validation")

/* ****************************************
 * Review Routes
 * **************************************** */

// Route to add a new review
router.post(
  "/add",
  utilities.checkLogin, // Ensures user is logged in
  reviewValidate.reviewRules(),
  reviewValidate.checkReviewData,
  utilities.handleErrors(accountController.addReview) // Points to accountController
)

// Route to deliver the edit review view
router.get(
  "/edit/:review_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.editReviewView)
)

// Route to process the review update
router.post(
  "/update",
  utilities.checkLogin,
  reviewValidate.reviewRules(),
  reviewValidate.checkUpdateReviewData,
  utilities.handleErrors(accountController.updateReview)
)

// Route to deliver the delete review confirmation view
router.get(
  "/delete/:review_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.deleteReviewView)
)

// Route to process the review deletion
router.post(
  "/delete",
  utilities.checkLogin,
  utilities.handleErrors(accountController.deleteReview)
)

module.exports = router