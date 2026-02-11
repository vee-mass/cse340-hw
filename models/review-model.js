const pool = require("../database")

/* *****************************
* Add New Review
* ***************************** */
async function addReview(review_text, inv_id, account_id) {
  try {
    const sql = "INSERT INTO public.review (review_text, inv_id, account_id) VALUES ($1, $2, $3) RETURNING *"
    const result = await pool.query(sql, [review_text, inv_id, account_id])
    return result.rows[0]
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Get Reviews for a Specific Inventory Item
* ***************************** */
async function getReviewsByInvId(inv_id) {
  try {
    const sql = `SELECT r.*, a.account_firstname, a.account_lastname 
                 FROM public.review AS r 
                 JOIN public.account AS a ON r.account_id = a.account_id 
                 WHERE r.inv_id = $1 
                 ORDER BY r.review_date DESC`
    const result = await pool.query(sql, [inv_id])
    return result.rows
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Get Reviews for a Specific Account
* ***************************** */
async function getReviewsByAccountId(account_id) {
  try {
    const sql = `SELECT r.*, i.inv_make, i.inv_model 
                 FROM public.review AS r 
                 JOIN public.inventory AS i ON r.inv_id = i.inv_id 
                 WHERE r.account_id = $1 
                 ORDER BY r.review_date DESC`
    const result = await pool.query(sql, [account_id])
    return result.rows
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Get a Specific Review by ID (For Edit/Delete)
* ***************************** */
async function getReviewById(review_id) {
  try {
    const sql = "SELECT * FROM public.review WHERE review_id = $1"
    const result = await pool.query(sql, [review_id])
    return result.rows[0]
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Update a Review
* ***************************** */
async function updateReview(review_id, review_text) {
  try {
    const sql = "UPDATE public.review SET review_text = $1 WHERE review_id = $2 RETURNING *"
    const result = await pool.query(sql, [review_text, review_id])
    return result.rows[0]
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Delete a Review
* ***************************** */
async function deleteReview(review_id) {
  try {
    const sql = "DELETE FROM public.review WHERE review_id = $1"
    const result = await pool.query(sql, [review_id])
    return result
  } catch (error) {
    return new Error("Delete Review Failed")
  }
}

module.exports = {addReview, getReviewsByInvId, getReviewsByAccountId, getReviewById, updateReview, deleteReview}