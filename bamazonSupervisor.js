var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
  //console.log("connected");
});

function start() {
  inquirer
    .prompt({
      name: "option",
      type: "list",
      message: "Choose anyone you would want :",
      choices: [
        "View Product Sales by Department",
        "Create New Department",
        "Exit"
      ]
    })
    .then(function(answer) {
      if (answer.option === "View Product Sales by Department") {
        displayProductSalesByDeppt();
      } else if (answer.option === "Create New Department") {
        newDepartment();
      } else {
        connection.end();
      }
    });
}

function displayProductSalesByDeppt() {
  /*console.log(
    "SELECT department_id,department_name,over_head_costs,product_sales.products FROM departments INNER JOIN products ON departments.department_name = products.department_name ORDER BY product_sales.products"
  );*/

  var query =
    " SELECT departments.department_id,departments.department_name,departments.over_head_costs,";
  query +=
    "sum(products.product_sales)-departments.over_head_costs as total_profit from departments left join products ON ";
  query +=
    "departments.department_name = products.department_name where products.product_sales>=0 group by";
  query += " products.department_name order by products.department_name desc";
  connection.query(query, function(err, res) {
    if (err) throw err;
    var table = new Table({
      head: [
        "department_id",
        "department_name",
        "over_head_costs",
        "total_profit"
      ]
    });
    for (var i = 0; i < res.length; i++) {
      table.push([
        res[i].department_id,
        res[i].department_name,
        res[i].over_head_costs,
        res[i].total_profit
      ]);
    }
    console.log(table.toString());
    console.log("-----------------------------------");
    start();
  });
}

function newDepartment() {
  inquirer
    .prompt([
      {
        name: "department_name",
        type: "input",
        message: "Enter the department name :"
      },
      {
        name: "over_head_costs",
        type: "input",
        message: "Enter the Over head cost :"
      }
    ])
    .then(function(answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO departments SET ?",
        {
          department_name: answer.department_name,
          over_head_costs: answer.over_head_costs
        },
        function(err) {
          if (err) throw err;
          console.log("Added new department successfully!");
          // re-prompt the user for if they want to bid or post
          start();
        }
      );
    });
}
