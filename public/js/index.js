const toggleButton = document.getElementById("add-task-button");
const cancelButton = document.getElementById("cancel")
const itemToToggle = document.getElementById("form");
const todo = document.getElementById("todo")
const completed = document.getElementById("completed")



// Add a click event listener to the button
toggleButton.addEventListener("click", function () {
    // Toggle the visibility of the item by adding/removing the "visible" class
    itemToToggle.style.visibility = "visible";
});

cancelButton.addEventListener("click", function () {
    // Toggle the visibility of the item by adding/removing the "visible" class
    itemToToggle.style.visibility = "hidden";
});

// Get the current page URL
const currentPage = window.location.href;

// Get all the nav-item links
const navItems = document.querySelectorAll('.nav-item');

// Loop through the links and check if the link's href matches the current page
navItems.forEach(link => {
    if (link.href === currentPage) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }
});