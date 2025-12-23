// Part 1: Grabbing html elements
let inputs = document.querySelector('input');
let btn = document.querySelector('button'); // Fixed: removed extra ; inside string
let taskList = document.getElementById('task-list');

// creating a notebook (An Array)
let task = [];

// checking the Safe (Local Storage)
let localstoragedata = localStorage.getItem('task array');

// if we found data load it
if (localstoragedata != null) {
    let ogdata = JSON.parse(localstoragedata); 
    task = ogdata; // updating the notebook
    maketodo(); // tell the painter to draw the tasks
}

// Part 2: Adding add button
btn.addEventListener('click', function () {
    let query = inputs.value;
    if (query.trim() === '') {
        alert("No value has been stored!");
        return; // Stop the function here instead of throwing error
    }

    // Creating a Task object (The Package)
    let taskObj = {
        id: Date.now(), // Fixed: Used comma (,) not semicolon (;)
        text: query     // Fixed: Used variable 'query', not semicolon
    };

    // Adding it to our Notebook
    task.push(taskObj);
    
    // Saving it to our safe (localstorage)
    localStorage.setItem("task array", JSON.stringify(task));
    
    // Calling the painter
    maketodo();
    
    inputs.value = ""; // Clear input after adding
});

// Part 3: Creating the painter
function maketodo() {
    // wiping the old code so it doesn't repeat itself
    taskList.innerHTML = "";

    // looping through every task
    for (let i = 0; i < task.length; i++) {
        let { id, text } = task[i]; // getting the id and task

        // creating sticker (div)
        let element = document.createElement('div');
        
        // Fixed: Removed backslash before ${text} so it actually shows the text
        element.innerHTML = `
            <span class="task" contenteditable="false">${text}</span>
            <button class='edit'>Edit</button>
            <span class="delete"><svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM13.4142 13.9997L15.182 15.7675L13.7678 17.1817L12 15.4139L10.2322 17.1817L8.81802 15.7675L10.5858 13.9997L8.81802 12.232L10.2322 10.8178L12 12.5855L13.7678 10.8178L15.182 12.232L13.4142 13.9997ZM9 4V6H15V4H9Z"></path></svg></span>
        `;

        // IMPORTANT: We grab elements inside THIS element, not the whole document
        let delbtn = element.querySelector('.delete');
        let editbtn = element.querySelector('.edit');
        let taskText = element.querySelector('.task');

        // The delete button using filter
        delbtn.addEventListener('click', function() {
            let filteredarray = task.filter(function(taskObj) {
                return taskObj.id != id; // keeping all tasks except this one
            });
            task = filteredarray; // updating the notebook
            localStorage.setItem("task array", JSON.stringify(task)); // updating the safe
            taskList.removeChild(element); // removing sticker from screen     
        });

        // The edit button
        editbtn.addEventListener('click', function() { // Fixed typo: fucntion -> function
            if (editbtn.innerText === "Edit") {
                taskText.setAttribute("contenteditable", "true"); // enable editing
                taskText.focus(); // focusing on the text
                editbtn.innerText = "Save";
            } else {
                taskText.setAttribute("contenteditable", "false"); // disabling editing
                let updatedText = taskText.innerText.trim();
                
                if (updatedText !== "") {
                    // Update the notebook
                    task = task.map(function(taskobj) {
                        if (taskobj.id === id) {
                            taskobj.text = updatedText;
                        }
                        return taskobj;
                    });
                    // Update the safe
                    localStorage.setItem("task array", JSON.stringify(task));
                }
                editbtn.innerText = 'Edit';
            }
        });

        element.classList.add('todo');
        taskList.appendChild(element);
    }
}
//enter key logic
inputs.addEventListener('keydown',(e)=>{
    if(e.key==='Enter'){
        btn.click();
    }
});