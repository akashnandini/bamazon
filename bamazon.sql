USE bamazon;
CREATE TABLE departments(
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100) NOT NULL,
  over_head_costs INTEGER(10) NOT NULL,
  PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name, over_head_costs) values ('Furniture',500);
INSERT INTO departments (department_name, over_head_costs) values ('Jwellery',600);
INSERT INTO departments (department_name, over_head_costs) values ('Clothes',300);
INSERT INTO departments (department_name, over_head_costs) values ('Electronics',500);
INSERT INTO departments (department_name, over_head_costs) values ('cosmetics',600);
INSERT INTO departments (department_name, over_head_costs) values ('Food',600);

