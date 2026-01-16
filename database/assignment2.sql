-- Query 1 Inserting Account info
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony','Stark','tony@starkent.com','Iam1ronM@n');

-- Query 2 Updating Account
UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;

-- Query 3 Deleting Tony Stark
DELETE FROM account WHERE account_id = 1;

-- Query 4 Updating GM Hummer description
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Query 5 Join sport inventory items
SELECT inv_make, inv_model, classification_name
FROM inventory
INNER JOIN classification
    ON inventory.classification_id = classification.classification_id
WHERE classification.classification_name = 'Sport';

-- Query 6 Update inventory add "/vehicles" to image paths
UPDATE inventory
SET
    inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
