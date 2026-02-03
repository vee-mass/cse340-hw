const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")
const utilities = require("../utilities")

// Route to deliver management view Task 1
router.get("/", utilities.handleErrors(invController.buildManagement))

// Task 2: Add Classification
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkIdData,
  utilities.handleErrors(invController.addClassification)
)

// Task 3: Add Inventory
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

// Task 3: Add Inventory
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))
// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))
// Add this to routes/inventoryRoute.js
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId))

router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

module.exports = router