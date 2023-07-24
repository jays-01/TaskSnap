const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = ''; // Global variable to store the Task instance

let today = new Date();
let options = {
  weekday: "long",
  day: "numeric",
  month: "long"
};
let day = today.toLocaleDateString("en-In", options);

// Connect to the MongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/taskSnap');

// Define the Mongoose schema for tasks
const taskSchema = {
  pending: [],
  completed: []
};

// Create the Mongoose model for tasks
const Task = mongoose.model("Task", taskSchema);

// Function to initialize the 'items' variable with data from the database
async function initializeItems() {
  try {
    // Find the first document (task) in the "Task" collection
    const foundTask = await Task.findOne().exec();
    
    if (!foundTask) {
      // Create a new instance if no data exists in the database
      const items = new Task();
      await items.save();
      console.log("Initialized new 'Task' instance.");
    } else {
      // Use the existing data fetched from the database
      items = foundTask;
      console.log("Fetched existing data from the database.");
    }

    // Start the server only after fetching the data
    app.listen(3000, function() {
      console.log("Server is UP!");
    });
  } catch (error) {
    console.error("Error initializing items:", error);
  }
}

// Call the async function to initialize the data
initializeItems();

// Route to render the home page with pending tasks
app.get("/", function(req, res){
  res.render("todo", { kindOfDay: day, items: items.pending });
});

// Route to handle adding new tasks
app.post("/", function(req, res){
  let newTask = {
    title: req.body.newTask,
    description: req.body.description
  };

  if (newTask.title.length > 0) {
    items.pending.push(newTask);
    items.save();
    res.redirect("/");
  }
});

// Route to handle marking a task as completed
app.post("/move_to_completed", function(req, res){
  checkedItemId = req.body.checkBox;

  items.pending.forEach((item, index) => {
    if (item.title === checkedItemId) {
      items.completed.push(item);
      items.pending.splice(index, 1);
      items.save();
      console.log(items);
      res.redirect("/");
    }
  });
});

// Route to render the completed tasks page
app.get('/completed', function(req, res) {
  res.render('completed.ejs', { kindOfDay: day, completed: items.completed });
});

// Route to handle deleting a completed task
app.post("/delete", function(req, res) {
  checkedItemId = req.body.checkBox;

  items.completed.forEach((item, index) => {
    if (item.title === checkedItemId) {
      items.completed.splice(index, 1);
      items.save();
      console.log(items);
      res.redirect("/completed");
    }
  });
});