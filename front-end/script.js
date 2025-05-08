let tasks = null;

const nav = document.getElementById("navigation")
const taskForm = document.getElementById("taskForm")
const taskList = document.getElementById("taskList")
const sortButton = document.getElementById("sortButton")
const plusButton = document.getElementById("plusButton")
const sendNewButton = document.getElementById("sendNewBtn")
const sendEditedButton = document.getElementById("sendEditedBtn")
const deleteButton = document.getElementById("deleteBtn")
const cancelButton = document.getElementById("cancelBtn")
const tab0Button = document.getElementById("tab0")
const tab1Button = document.getElementById("tab1")
const date = document.getElementById("date")
const taskNameInput = document.getElementById("name")

const today = new Date().toISOString().split("T")[0]

let currentTab = 0
let currentTaskId = null
let sorting = "date"
let tab0_name = "Opinnot"
let tab1_name = "Arki"

async function loadTasks() {
    try {
        const response = await fetch(apiUrl)

        if (!response.ok) {
            console.log(response.status)
        }

        tasks = await response.json()
        console.log("Tasks loaded", tasks)
        displayTaskList(tasks)
    } catch (error) {
        console.log(error.message)
    }
}

async function sendNewTask(data) {
    try {
        const response = await fetch(
            apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            console.log(response.status)
        }

        loadTasks()
    } catch (error) {
        console.log(error.message)
    }
}

async function sendEditedTask(data) {
    try {
        const response = await fetch(
            "".concat(apiUrl, "/", data.id), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            console.log(response.status)
        }

        loadTasks()
    } catch (error) {
        console.log(error.message)
    }
}

async function deleteTask(id = currentTaskId) {
    try {
        const response = await fetch(
            "".concat(apiUrl, "/", id), {
            method: "DELETE"
        })

        if (!response.ok) {
            console.log(response.status)
        }

        loadTasks()
    } catch (error) {
        console.log(error.message)
    }
}

function hide(element) {
    element.classList.add("hidden")
}

function show(element) {
    element.classList.remove("hidden")
}

function updateSendButtonActivity() {
    if (taskNameInput.value.trim() !== "") {
        sendNewButton.classList.add("green")
        sendEditedButton.classList.add("green")
    } else {
        sendNewButton.classList.remove("green")
        sendEditedButton.classList.remove("green")
    }
}

function displayTaskList(tasks) {
    // Show
    show(taskList)
    show(plusButton)
    
    // Hide
    hide(taskForm)

    // Generate HTML
    taskList.innerHTML = ""
    tasks.filter(function(task) { 
        return task.category === currentTab 
    }).sort(function(a, b) {
        if (sorting === "date") {
            if (typeof a.date == 'undefined') {
                return 1
            } else if (typeof b.date == 'undefined') {
                return -1
            }

            return new Date(a.date) - new Date(b.date)
        } else {
            return b.priority - a.priority
        }
    }).forEach(task => {
        const { id, name, date, priority } = task
        let displayDate = date
        let priorityClass = "priority1"

        if (priority === 2) {
            priorityClass = "priority2"
        } else if (priority == 3) {
            priorityClass = "priority3"
        }

        if (!date) {
            displayDate = ""
        }

        taskList.innerHTML += `
            <div class="task" id="${id}">
                <button id="${id}-markAsDoneButton" class="markAsDoneButton ${priorityClass}">✓</button>
                <div id="${id}-taskDetails" class="taskDetails">
                    <p id="${id}-taskName" class="taskName">${name}</p>
                    <p id="${id}-taskDate" class="taskDate">${displayDate}</p>
                </div>
            </div>
        `
    })

    // Add event listeners
    tasks.filter(function(task) { return task.category === currentTab })
        .forEach(task => {
            const { id } = task

            const markAsDoneButton = document.getElementById("".concat(id, "-markAsDoneButton"))
            markAsDoneButton.addEventListener("click", event => {
                event.preventDefault()
                deleteTask(id)
            })

            const taskName = document.getElementById("".concat(id, "-taskDetails"))
            taskName.addEventListener("click", event => {
                event.preventDefault()

                currentTaskId = id
                displayEditTask(task)
            })
        })
        
    updateSendButtonActivity()
}

function displayEditTask(task) {
    // Show
    show(taskForm)
    show(deleteButton)
    show(sendEditedButton)

    // Hide
    hide(sendNewButton)
    hide(taskList)
    hide(plusButton)

    // Display task values
    taskNameInput.value = task.name
    document.getElementById("priority").value = task.priority
    document.getElementById("date").value = task.date
    
    updateSendButtonActivity()
}

function displayAddTask() {
    taskForm.reset()

    // Show task form
    show(taskForm)
    show(sendNewButton)

    // Hide
    hide(sendEditedButton)
    hide(deleteButton)
    hide(taskList)
    hide(plusButton)

    sendNewButton.classList.remove("green")
}

// Main

loadTasks()

date.setAttribute("min", today)

sendNewButton.addEventListener("click", event => {
    event.preventDefault()

    if (taskNameInput.value.trim() === "") {
        alert('Enter task name')
        return
    }

    const formData = new FormData(taskForm)
    const data = Object.fromEntries(formData)

    if (typeof data.name !== "string" || data.name === "") {
        alert("Anna tehtävälle nimi")
    } else {
        data["category"] = currentTab;
        const response = sendNewTask(data)
        console.log(response)
    }
})

sendEditedButton.addEventListener("click", event => {
    event.preventDefault()

    if (taskNameInput.value.trim() === "") {
        alert('Enter task name')
        return
    }

    const formData = new FormData(taskForm)
    const data = Object.fromEntries(formData)
    data["category"] = currentTab;
    data["id"] = currentTaskId
    const response = sendEditedTask(data)
    console.log(response)
})

plusButton.addEventListener("click", event => {
    event.preventDefault()

    displayAddTask()
})

cancelButton.addEventListener("click", event => {
    event.preventDefault()
    loadTasks()
})

deleteButton.addEventListener("click", event => {
    event.preventDefault()
    deleteTask()
})

tab0Button.addEventListener("click", event => {
    currentTab = 0
    tab0Button.classList.add("activeTab")
    tab1Button.classList.remove("activeTab")
    loadTasks()
})

tab1Button.addEventListener("click", event => {
    currentTab = 1
    tab1Button.classList.add("activeTab")
    tab0Button.classList.remove("activeTab")
    loadTasks()
})

sortButton.addEventListener("click", event => {
    let sortingText = null
    if (sorting === "date") {
        sorting = "priority"
        sortingText = "Prioriteetti"
    } else {
        sorting = "date"
        sortingText = "Määräaika"
    }
    console.log("Sorting based on", sortingText)
    sortButton.innerText = "⇅\n" + sortingText
    loadTasks()
})

taskNameInput.addEventListener("input", event => {
    updateSendButtonActivity()
})