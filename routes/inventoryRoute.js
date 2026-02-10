const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")
const utilities = require("../utilities")

// Route to deliver management view 
router.get("/", 
  utilities.checkAccountType, // Added Task 2 protection
  utilities.handleErrors(invController.buildManagement)
)

// Task 2: Add Classification 
router.get("/add-classification", 
  utilities.checkAccountType, 
  utilities.handleErrors(invController.buildAddClassification)
)

router.post(
  "/add-classification",
  utilities.checkAccountType,
  invValidate.classificationRules(),
  invValidate.checkIdData,
  utilities.handleErrors(invController.addClassification)
)
// Task 3: Add Inventory 
router.get("/add-inventory", 
  utilities.checkAccountType, 
  utilities.handleErrors(invController.buildAddInventory)
)

router.post(
  "/add-inventory",
  utilities.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId))
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

/******************
 * EDIT/DELETE ROUTES - PROTECTED
 * *****************/
router.get("/edit/:inv_id", 
  utilities.checkAccountType, 
  utilities.handleErrors(invController.editInventoryView)
)

router.post(
  "/update/",
  utilities.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

router.get("/delete/:inv_id", 
  utilities.checkAccountType, 
  utilities.handleErrors(invController.deleteView)
)

router.post("/delete", 
  utilities.checkAccountType, 
  utilities.handleErrors(invController.deleteItem)
)

module.exports = router