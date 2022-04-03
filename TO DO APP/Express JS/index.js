
//-----------------------------------------------------

var textarea = document.getElementById("textarea");
var taskContainerNode = document.getElementById("task-container");
var taskList = Array();
var taskCount = 0;

//-----------------------------------------------------
// when 'enter' is hit on textarea, 

textarea.addEventListener("keyup", (event) => {
    if (event.code == "Enter" && textarea.value != '') {
        event.preventDefault();

        let taskContent = textarea.value.trim('\n');
        textarea.value = "";

        let newTaskObject = {}
        newTaskObject.id = taskCount;
        newTaskObject.content = taskContent;
        newTaskObject.status = false;

        //update taskList
        taskList.push(JSON.stringify(newTaskObject))
        //update file
        writeDataToFile();

        console.info(`ADDED [${taskCount}] : (${newTaskObject.content}), done = ${newTaskObject.status}`)

        addTaskToContainer(newTaskObject);
        taskCount++;
    }
})


//-----------------------------------------------------
// get all tasks from todos file and load them to task-container
function loadDataFromFile() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/getNotes');
    xhr.addEventListener('load', (event)=>{
        let taskObjectArray = JSON.parse(event.target.responseText);
        console.log(taskObjectArray);
        loadTaskToContainer(taskObjectArray);
    })
    xhr.send();
}


let writeDataToFile = () =>{
    console.log("write data into file");
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/saveNotes');
    xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8')
    xhr.send(JSON.stringify(taskList));
}

// -----------------------------------------------------------

function loadTaskToContainer(taskObjectArray)
{
    if (taskObjectArray !== null) {

        taskObjectArray.forEach(function (taskObject) {
            //add to tasklist
            taskObject = JSON.parse(taskObject);
            taskObject.id = taskCount; //regenerateId according to new page

            console.info(`LOADED [${taskCount}] : (${taskObject.content}),  done = ${taskObject.status}`)
            addTaskToContainer(taskObject);

            taskObject = JSON.stringify(taskObject);
            taskList.push(taskObject);
            taskCount++;
        })
    }
}

// creates a new row in task-container
function addTaskToContainer(taskObject) 
{
    let row = document.createElement("div");
    row.setAttribute("class", "task-row");
    row.setAttribute("id", "row-" + taskObject.id);

    let textBox = document.createElement("input");
    textBox.setAttribute("type", "text");
    textBox.setAttribute("id", taskObject.id);
    textBox.value = taskObject.content;
    textBox.setAttribute("class", "form-control task");
    textBox.setAttribute("readonly", "readonly");

    if (taskObject.status)
        textBox.style.textDecoration = "line-through";

    let options = document.createElement("span");
    options.setAttribute("class", "options");

    let checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.setAttribute("title", "Mark As Done/Undone");
    checkBox.setAttribute("onclick", `setTaskStatus(event, ${taskObject.id})`);
    checkBox.checked = taskObject.status;

    let Rename = document.createElement("em");
    Rename.setAttribute("class", "fas fa-pencil-alt text-dark");
    Rename.setAttribute("title", "Rename");
    Rename.setAttribute("onclick", `updateTask(${taskObject.id})`);

    let Delete = document.createElement("em");
    Delete.setAttribute("class", "fas fa-times text-danger");
    Delete.setAttribute("title", "Delete");
    Delete.setAttribute("onclick", `deleteTask(${taskObject.id})`);

    options.appendChild(checkBox);
    options.appendChild(Rename);
    options.appendChild(Delete);

    row.appendChild(textBox);
    row.appendChild(options);

    taskContainerNode.appendChild(row);
}

// -----------------------------------------------------------

// returns JSON.parse(taskList[id])
function getParsedTaskObjectById(id) {
    for (let i = 0; i < taskList.length; i++) {
        if (JSON.parse(taskList[i]).id == id) {
            let taskObject = JSON.parse(taskList[i]);
            return taskObject;
        }
    }
    return null;
}

// returns index of a task from taskList by giving its id
function getIndexByTaskId(id) {
    for (let i = 0, index = 0; i < taskList.length; i++, index++) {
        if (JSON.parse(taskList[i]).id == id)
            return index;
    }
    return null;
}

//-----------------------------------------------------
//deletes task from task-container and localStorage
function deleteTask(id) {
    // remove row from container
    let taskRow = document.getElementById('row-' + id);
    taskRow.parentNode.removeChild(taskRow);

    // remove task from taskList
    let index = getIndexByTaskId(id);
    taskList.splice(index, 1);

    // update todos file
    writeDataToFile()

    console.warn(`Deleted task-${id}`);
}


//renames task and update in taskList and localStorage
function updateTask(id) {
    let textBox = document.getElementById(id);

    //remove readonly; make available for editing
    textBox.removeAttribute("readonly");

    //highlight the task
    textBox.style.color = "red";

    //   detect 'enter'
    textBox.addEventListener("keyup", (event) => {
        if (event.code == "Enter" && textBox.value != '') {
            event.preventDefault();

            let taskObject = getParsedTaskObjectById(id);
            taskObject.content = textBox.value;

            let index = getIndexByTaskId(id);
            //update the taskList
            taskList[index] = JSON.stringify(taskObject);

            ///update file
            writeDataToFile();

            //make textbox readonly again
            textBox.setAttribute("readonly", "readonly");

            //remove highlighting
            textBox.style.color = "black";

            console.info(`Updated Task-${id}.`);
        }
    })
}


//set status of task (done/undone) and update in taskList and localStorage
function setTaskStatus(event, id) {
    let taskObject = getParsedTaskObjectById(id);
    let taskbox = document.getElementById(id);

    if (event.target.checked) {
        taskObject.status = true;
        console.log("Task-" + id + " done");

        //strikeout the task
        taskbox.style.textDecoration = "line-through";
    }
    else {
        taskObject.status = false;
        console.log("Task-" + id + " Undone");
        //remove sriking from the task
        taskbox.style.textDecoration = "none";
    }

    let index = getIndexByTaskId(id);
    //update taskList
    taskList[index] = JSON.stringify(taskObject);

    //update file
    writeDataToFile()
}


//-----------------------------------------------------
// load all tasks in todos file on load
loadDataFromFile();

//-----------------------------------------------------


