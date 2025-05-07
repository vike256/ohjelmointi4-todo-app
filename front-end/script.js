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

const today = new Date().toISOString().split("T")[0]

let currentTab = 0
let currentTaskId = null
let sorting = "date"
let tab1_name = "Opinnot"
let tab2_name = "Arki"

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
            return new Date(a.date) - new Date(b.date)
        } else {
            return a.priority - b.priority
        }
    }).forEach(task => {
        const { id, name } = task

        taskList.innerHTML += `
            <div class="task" id="${id}">
                <button id="${id}-markAsDoneButton" class="markAsDoneButton">✓</button>
                <p id="${id}-taskName" class="taskName">${name}</p>
            </div>
        `
    })

    // Add event listeners
    tasks.filter(function(task) { return task.category === currentTab })
        .forEach(task => {
            const { id, name } = task

            const markAsDoneButton = document.getElementById("".concat(id, "-markAsDoneButton"))
            markAsDoneButton.addEventListener("click", event => {
                event.preventDefault()
                deleteTask(id)
            })

            const taskName = document.getElementById("".concat(id, "-taskName"))
            taskName.addEventListener("click", event => {
                event.preventDefault()

                currentTaskId = id
                displayEditTask(task)
            })
        })
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
    document.getElementById("name").value = task.name
    document.getElementById("priority").value = task.priority
    document.getElementById("date").value = task.date
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
}

// Main

loadTasks()

date.setAttribute("min", today)

sendNewButton.addEventListener("click", event => {
    event.preventDefault()

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
    if (sorting === "date") {
        sorting = "priority"
    } else {
        sorting = "date"
    }
    console.log("Sorting based on", sorting)
    sortButton.innerText = "⇅\n" + sorting
    loadTasks()
})