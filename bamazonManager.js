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
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product",
        "Exit"
      ]
    })
    .then(function(answer) {
      if (answer.option === "View Products for Sale") {
        productsForSale();
      } else if (answer.option === "View Low Inventory") {
        lowInventory();
      } else if (answer.option === "Add to Inventory") {
        addInventory();
      } else if (answer.option === "Add New Product") {
        addNewProduct();
      } else {
        connection.end();
      }
    });
}

function productsForSale() {
  connection.query("SELECT * FROM products WHERE stock_quantity!=0", function(
    err,
    res
  ) {
    if (err) throw err;
    var table = new Table({
      head: [
        "item_id",
        "product_name",
        "department_name",
        "price",
        "stock_quantity"
      ]
    });
    for (var i = 0; i < res.length; i++) {
      table.push([
        res[i].item_id,
        res[i].product_name,
        res[i].department_name,
        res[i].price,
        res[i].stock_quantity
      ]);
    }
    console.log(table.toString());
    console.log("-----------------------------------");
    start();
  });
}

function lowInventory() {
  connection.query("SELECT * FROM products WHERE stock_quantity<5", function(
    err,
    res
  ) {
    if (err) throw err;
    var table = new Table({
      head: [
        "item_id",
        "product_name",
        "department_name",
        "price",
        "stock_quantity"
      ]
    });
    for (var i = 0; i < res.length; i++) {
      table.push([
        res[i].item_id,
        res[i].product_name,
        res[i].department_name,
        res[i].price,
        res[i].stock_quantity
      ]);
    }
    console.log(table.toString());
    console.log("-----------------------------------");
    start();
  });
}

function addInventory() {
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
            //console.log(choiceArray);
            return choiceArray;
          },
          message: "Which item id you would want to add more?"
        },
        {
          name: "product_quantity",
          type: "input",
          message: "how many units of the product you would like to add?"
        }
      ])
      .then(function(answer) {
        //console.log("nandini-----" + answer);
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].product_name === answer.choice) {
            chosenItem = results[i];
          }
        }
        connection.query(
          "UPDATE products SET ? WHERE ?",
          [
            {
              stock_quantity:
                chosenItem.stock_quantity + parseInt(answer.product_quantity)
            },
            {
              item_id: chosenItem.item_id
            }
          ],
          function(error) {
            if (error) throw error;
            console.log("Added successfully..");
            start();
          }
        );
        //} //else {
        //console.log("Insufficient quantity!");
        //start();
        //}
      });
  });
}

function addNewProduct() {
  inquirer
    .prompt([
      {
        name: "produc_name",
        type: "input",
        message: "What is the product you would like to submit?"
      },
      {
        name: "department_name",
        type: "input",
        message: "Which department do you want to submit?"
      },
      {
        name: "price",
        type: "input",
        message: "What is the price of the product?"
      },
      {
        name: "prod_quantity",
        type: "input",
        message: "How many items you want to add?"
      }
    ])
    .then(function(answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: answer.produc_name,
          department_name: answer.department_name,
          price: answer.price,
          stock_quantity: answer.prod_quantity || 0
        },
        function(err) {
          if (err) throw err;
          console.log("Added new product successfully!");
          // re-prompt the user for if they want to bid or post
          start();
        }
      );
    });
}
