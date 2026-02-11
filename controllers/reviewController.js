const reviewModel = require("../models/review-model")
const utilities = require("../utilities")

const reviewCont = {}

/* ***************************
 * Add Review
 * ************************** */
reviewCont.addReview = async function (req, res) {
  const { review_text, inv_id, account_id } = req.body
  const addResult = await reviewModel.addReview(review_text, inv_id, account_id)

  if (addResult) {
    req.flash("notice", "Your review was submitted successfully.")
    res.redirect("/inv/detail/" + inv_id)
  } else {
    req.flash("notice", "Sorry, the review submission failed.")
    res.redirect("/inv/detail/" + inv_id)
  }
}

/* ***************************
 * Deliver Edit Review View
 * ************************** */
reviewCont.editReviewView = async function (req, res) {
  const review_id = parseInt(req.params.review_id)
  const reviewData = await reviewModel.getReviewById(review_id)
  let nav = await utilities.getNav()
  res.render("review/edit-review", {
    title: "Edit Review",
    nav,
    errors: null,
    review_text: reviewData.review_text,
    review_id: reviewData.review_id,
    review_date: reviewData.review_date
  })
}

/* ***************************
 * Update Review
 * ************************** */
reviewCont.updateReview = async function (req, res) {
  const { review_id, review_text } = req.body
  const updateResult = await reviewModel.updateReview(review_id, review_text)
  
  if (updateResult) {
    req.flash("notice", "The review was successfully updated.")
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.redirect("/review/edit/" + review_id)
  }
}

/* ***************************
 * Deliver Delete Review View
 * ************************** */
reviewCont.deleteReviewView = async function (req, res) {
  const review_id = parseInt(req.params.review_id)
  const reviewData = await reviewModel.getReviewById(review_id)
  let nav = await utilities.getNav()
  res.render("review/delete-review", {
    title: "Delete Review",
    nav,
    errors: null,
    review_text: reviewData.review_text,
    review_id: reviewData.review_id,
    review_date: reviewData.review_date
  })
}

/* ***************************
 * Delete Review
 * ************************** */
reviewCont.deleteReview = async function (req, res) {
  const review_id = parseInt(req.body.review_id)
  const deleteResult = await reviewModel.deleteReview(review_id)
  
  if (deleteResult) {
    req.flash("notice", "The review was deleted.")
  } else {
    req.flash("notice", "Sorry, the delete failed.")
  }
  res.redirect("/account/")
}

/* ***************************
 * Deliver Edit Review View
 * ************************** */
reviewCont.editReviewView = async function (req, res, next) {
  const review_id = parseInt(req.params.review_id)
  let nav = await utilities.getNav()
  const reviewData = await reviewModel.getReviewById(review_id)
  res.render("review/edit-review", {
    title: "Edit Review",
    nav,
    errors: null,
    review_id: reviewData.review_id,
    review_text: reviewData.review_text,
    review_date: reviewData.review_date
  })
}

/* ***************************
 * Deliver Delete Review View
 * ************************** */
reviewCont.deleteReviewView = async function (req, res, next) {
  const review_id = parseInt(req.params.review_id)
  let nav = await utilities.getNav()
  const reviewData = await reviewModel.getReviewById(review_id)
  res.render("review/delete-review", {
    title: "Delete Review",
    nav,
    errors: null,
    review_id: reviewData.review_id,
    review_text: reviewData.review_text,
    review_date: reviewData.review_date
  })
}

module.exports = reviewCont