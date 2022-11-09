-- Trigger to change the quantity of each items after an update in the Customer_Order table
CREATE
OR REPLACE FUNCTION update_quantity() RETURNS TRIGGER AS $$ BEGIN
UPDATE
    Items
SET
    quantity = quantity - NEW.quantity
WHERE
    id = NEW.fk_item;

RETURN NEW;

END;

$$ LANGUAGE plpgsql;

CREATE TRIGGER update_quantity
AFTER
INSERT
    ON Cart FOR EACH ROW EXECUTE PROCEDURE update_quantity();
