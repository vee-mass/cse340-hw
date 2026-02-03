const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}

/* **********************************
 * Classification Validation Rules
 * ********************************** */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isAlphanumeric() // Rule: No spaces or special characters
      .withMessage("Classification name must be alphanumeric with no spaces."),
  ]
}

/* **********************************
 * Check Classification Data
 * ********************************** */
validate.checkIdData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

/* **********************************
 * Inventory Validation Rules (Task 3)
 * ********************************** */
validate.inventoryRules = () => {
  return [
    body("classification_id").notEmpty().withMessage("Please select a classification."),
    body("inv_make").trim().escape().notEmpty().withMessage("Make is required."),
    body("inv_model").trim().escape().notEmpty().withMessage("Model is required."),
    body("inv_description").trim().escape().notEmpty().withMessage("Description is required."),
    body("inv_image").trim().notEmpty().withMessage("Image path is required."),
    body("inv_thumbnail").trim().notEmpty().withMessage("Thumbnail path is required."),
    body("inv_price").trim().isDecimal().withMessage("Price must be a number."),
    body("inv_year").trim().isNumeric().isLength({ min: 4, max: 4 }).withMessage("Year must be 4 digits."),
    body("inv_miles").trim().isNumeric().withMessage("Miles must be a number."),
    body("inv_color").trim().escape().notEmpty().withMessage("Color is required."),
  ]
}

/* **********************************
 * Check Inventory Data (Task 3 Stickiness)
 * ********************************** */
validate.checkInventoryData = async (req, res, next) => {
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    // Re-build the classification dropdown for the sticky form
    let classificationSelect = await utilities.buildClassificationList(classification_id)
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Vehicle",
      nav,
      classificationSelect,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    })
    return
  }
  next()
}

module.exports = validate