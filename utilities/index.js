const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken") // Add this
require("dotenv").config()
const Util = {}

/************
 * Constructs the nav HTML unordered list
 * *************/
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
     data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

Util.buildNav = async function (req, res, next) {
  res.locals.nav = await Util.getNav()
  next()
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}


/* **************************************
* Build the vehicle detail view HTML
* ************************************ */
Util.buildVehicleDetail = async function(data) {
  let display
  if (data) {
    // Format Price to USD and Mileage with commas
    const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.inv_price)
    const miles = new Intl.NumberFormat('en-US').format(data.inv_miles)

    display = '<div id="detail-display">'
    display += `<img src="${data.inv_image}" alt="Image of ${data.inv_make} ${data.inv_model}">`
    display += '<section id="detail-info">'
    display += `<h2>${data.inv_make} ${data.inv_model} Details</h2>`
    display += `<h3>Price: ${price}</h3>`
    display += `<p><strong>Description:</strong> ${data.inv_description}</p>`
    display += `<p><strong>Color:</strong> ${data.inv_color}</p>`
    display += `<p><strong>Mileage:</strong> ${miles} miles</p>`
    display += '</section></div>'
  } else {
    display = '<p class="notice">Sorry, that vehicle could not be found.</p>'
  }
  return display
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
 * Build the classification select list
 * ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}


 /****************
  * JWT VErification Middleware
  * **************************/
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     res.clearCookie("jwt")
     res.locals.loggedin = 0
     res.locals.accountData = null
     next()
    } else {
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    }
   })
 } else {
  res.locals.loggedin = 0
  next()
 }
}

/* ****************************************
 * Check Account Type (Authorization)
 * ************************************ */
Util.checkAccountType = (req, res, next) => {
  if (res.locals.loggedin) {
    const account_type = res.locals.accountData.account_type
    if (account_type === "Employee" || account_type === "Admin") {
      next()
    } else {
      req.flash("notice", "You do not have permission to access this resource.")
      return res.redirect("/account/login")
    }
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 * Check Login (Task 4/5/6)
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* **************************************
* Build the reviews display HTML
* ************************************ */
Util.buildReviewDisplay = async function(data) {
  let display = '<ul id="review-list">'
  if (data.length > 0) {
    data.forEach(review => {
      const date = new Date(review.review_date).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
      })
      // Get initials or first name for display
      const screenName = `${review.account_firstname[0]}${review.account_lastname}`
      
      display += '<li>'
      display += `<p><strong>${screenName}</strong> wrote on ${date}:</p>`
      display += `<p>${review.review_text}</p>`
      display += '</li><hr>'
    })
  } else {
    display += '<p class="notice">Be the first to write a review!</p>'
  }
  display += '</ul>'
  return display
}

module.exports = Util