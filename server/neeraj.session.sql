-- drop TABLE invoice;
-- drop TABLE invoice_materials;
-- drop TABLE material;
-- drop TABLE note;
select count(*) from note group by invoice_id;
select * from usertype LEFT JOIN invoice ON invoice.cust_id = usertype.id;
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;