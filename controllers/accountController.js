const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const reviewModel = require("../models/review-model")

/* ****************************************
 * Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
 * Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
 * Process registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    return res.status(500).render("account/register", { title: "Registration", nav, errors: null })
  }
  const regResult = await accountModel.registerAccount(account_firstname, account_lastname, account_email, hashedPassword)
  if (regResult) {
    req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`)
    res.redirect("/account/login")
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", { title: "Registration", nav, errors: null })
  }
}

/* ****************************************
 * Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    return res.status(400).render("account/login", { title: "Login", nav, errors: null, account_email })
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      res.cookie("jwt", accessToken, { httpOnly: true, secure: process.env.NODE_ENV !== 'development', maxAge: 3600 * 1000 })
      return res.redirect("/account/")
    } else {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", { title: "Login", nav, errors: null, account_email })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
 * Deliver account management view
 * *************************************** */
async function buildManagementView(req, res, next) {
  let nav = await utilities.getNav()
  const account_id = res.locals.accountData.account_id
  const reviews = await reviewModel.getReviewsByAccountId(account_id)
  res.render("account/management", { title: "Account Management", nav, errors: null, reviews })
}

/* ****************************************
 * Deliver Account Update View
 * *************************************** */
async function buildAccountUpdateView(req, res, next) {
  const account_id = parseInt(req.params.accountId)
  let nav = await utilities.getNav()
  const accountData = await accountModel.getAccountById(account_id)
  res.render("account/update", { title: "Edit Account", nav, errors: null, account_firstname: accountData.account_firstname, account_lastname: accountData.account_lastname, account_email: accountData.account_email, account_id: accountData.account_id })
}

/* ****************************************
 * Process Account Update
 * *************************************** */
async function updateAccount(req, res) {
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  const updateResult = await accountModel.updateAccount(account_firstname, account_lastname, account_email, account_id)
  if (updateResult) {
    req.flash("notice", "Account updated successfully.")
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    let nav = await utilities.getNav()
    res.status(501).render("account/update", { title: "Edit Account", nav, errors: null, account_firstname, account_lastname, account_email, account_id })
  }
}

/* ****************************************
 * Process Password Update
 * *************************************** */
async function updatePassword(req, res) {
  const { account_password, account_id } = req.body
  const hashedPassword = await bcrypt.hashSync(account_password, 10)
  const updateResult = await accountModel.updatePassword(hashedPassword, account_id)
  if (updateResult) {
    req.flash("notice", "Password updated successfully.")
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the password update failed.")
    let nav = await utilities.getNav()
    res.status(501).render("account/update", { title: "Edit Account", nav, errors: null, account_id })
  }
}

/* ****************************************
 * Process Logout
 * *************************************** */
async function accountLogout(req, res, next) {
  res.clearCookie("jwt")
  res.redirect("/")
}

/* ***************************
 * Review Controller Logic
 * ************************** */
async function addReview(req, res) {
  const { review_text, inv_id, account_id } = req.body
  const result = await reviewModel.addReview(review_text, inv_id, account_id)
  req.flash("notice", result ? "Review added successfully." : "Sorry, the review could not be added.")
  res.redirect(`/inv/detail/${inv_id}`)
}

async function editReviewView(req, res) {
  const reviewData = await reviewModel.getReviewById(parseInt(req.params.review_id))
  let nav = await utilities.getNav()
  res.render("review/edit-review", { title: "Edit Review", nav, errors: null, review_id: reviewData.review_id, review_text: reviewData.review_text, review_date: reviewData.review_date })
}

async function updateReview(req, res) {
  const { review_id, review_text } = req.body
  const result = await reviewModel.updateReview(review_id, review_text)
  req.flash("notice", result ? "Review updated successfully." : "Review update failed.")
  res.redirect("/account/")
}

async function deleteReviewView(req, res) {
  const reviewData = await reviewModel.getReviewById(parseInt(req.params.review_id))
  let nav = await utilities.getNav()
  res.render("review/delete-review", { title: "Delete Review", nav, errors: null, review_id: reviewData.review_id, review_text: reviewData.review_text, review_date: reviewData.review_date })
}

async function deleteReview(req, res) {
  const result = await reviewModel.deleteReview(parseInt(req.body.review_id))
  req.flash("notice", result ? "Review deleted successfully." : "Review deletion failed.")
  res.redirect("/account/")
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildManagementView, buildAccountUpdateView, updateAccount, accountLogout, updatePassword, addReview, editReviewView, updateReview, deleteReviewView, deleteReview }