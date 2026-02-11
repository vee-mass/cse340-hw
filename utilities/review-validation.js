const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/* **********************************
 * Review Data Validation Rules
 * ********************************* */
validate.reviewRules = () => {
  return [
    body("review_text")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide review text."),
  ]
}

/* ******************************
 * Check review data and return errors
 * ***************************** */
validate.checkReviewData = async (req, res, next) => {
  const { review_text, inv_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    // If there are errors, we redirect back to the detail page
    // In a real-world app, you might re-render, but a flash message 
    // and redirect is often cleaner for this specific project structure.
    req.flash("notice", "Review cannot be empty.")
    res.redirect("/inv/detail/" + inv_id)
    return
  }
  next()
}

/* ******************************
 * Check update data and return errors to the edit view
 * ***************************** */
validate.checkUpdateReviewData = async (req, res, next) => {
    const { review_text, review_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("review/edit-review", {
            title: "Edit Review",
            nav,
            errors,
            review_text,
            review_id
        })
        return
    }
    next()
}

module.exports = validate