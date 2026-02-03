const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 * Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 * Build vehicle detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryByInvId(inv_id)
  const detailHtml = await utilities.buildVehicleDetail(data)
  let nav = await utilities.getNav()
  const vehicleName = `${data.inv_make} ${data.inv_model}`
  res.render("./inventory/detail", {
    title: vehicleName,
    nav,
    detailHtml,
  })
}

/* ***************************
 * Trigger Intentional Error
 * ************************** */
invCont.triggerError = async function (req, res, next) {
  throw new Error("This is an intentional server error.")
}

/* ***************************
 * Build Management View (Task 1)
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
  })
}

/* ****************************************
* Deliver Add Classification View (Task 2)
* *************************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

/* ****************************************
* Process Add Classification (Task 2)
* *************************************** */
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body
  const result = await invModel.insertClassification(classification_name)

  if (result) {
    let nav = await utilities.getNav() 
    req.flash("notice", `The ${classification_name} classification was successfully added.`)
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, adding the classification failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav: await utilities.getNav(),
      errors: null,
    })
  }
}

/* ****************************************
* Deliver Add Inventory View (Task 3)
* *************************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationSelect,
    errors: null,
  })
}

/* ****************************************
* Process Add Inventory (Task 3)
* *************************************** */
invCont.addInventory = async function (req, res) {
  const { 
    classification_id, inv_make, inv_model, inv_description, 
    inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color 
  } = req.body

  const result = await invModel.insertInventory(
    classification_id, inv_make, inv_model, inv_description, 
    inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color
  )

  if (result) {
    req.flash("notice", `The ${inv_make} ${inv_model} was successfully added.`)
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav: await utilities.getNav(),
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, adding the vehicle failed.")
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    res.status(501).render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav: await utilities.getNav(),
      classificationSelect,
      errors: null,
    })
  }
}

module.exports = invCont