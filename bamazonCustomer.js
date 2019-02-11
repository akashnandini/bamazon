var mysql = require("mysql");
var inquirer = require("inquirer");
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
      choices: ["View All Products for Buy", "Buy", "Exit"]
    })
    .then(function(answer) {
      if (answer.option === "View All Products for Buy") {
        displayAllItems();
      } else if (answer.option === "Buy") {
        buyDetails();
      } else {
        connection.end();
      }
    });
}

function displayAllItems() {
  connection.query("SELECT * FROM products", function(err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log(
        res[i].item_id +
          " | " +
          res[i].product_name +
          " | " +
          res[i].department_name +
          " | " +
          res[i].price +
          " | " +
          res[i].stock_quantity
      );
    }
    console.log("-----------------------------------");
    start();
  });
}

function buyDetails() {
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].product_name);
            }
            return choiceArray;
          },
          message: "Which item id you would want to buy?"
        },
        {
          name: "product_quantity",
          type: "input",
          message: "how many units of the product you would like to buy?"
        }
      ])
      .then(function(answer) {
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].product_name === answer.choice) {
            chosenItem = results[i];
          }
        }
        if (chosenItem.stock_quantity >= parseInt(answer.product_quantity)) {
          var tot_cost = answer.product_quantity * chosenItem.price;
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity:
                  chosenItem.stock_quantity - answer.product_quantity,
                product_sales: tot_cost
              },
              {
                item_id: chosenItem.item_id
              }
            ],
            function(error) {
              if (error) throw error;
              console.log("Order processed..\nTotal cost is = " + tot_cost);
              start();
            }
          );
        } else {
          console.log("Insufficient quantity!");
          start();
        }
      });
  });
}
