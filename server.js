const express = require('express')
const fs = require('fs')
const crypto = require('crypto')  // Used to create UUIDs for tasks
const path = require('path')

const app = express()
const PORT = 3256
const tasks = require('./tasks.json')

// Write updated tasks to tasks.json
function updateTasksFile() {
    fs.writeFile(
        'tasks.json',
        JSON.stringify(tasks, null, 4),
        err => {
            if (err) {
                console.log(err)
            }
            
            console.log('tasks.json file updated')
        }
    )
}

// Return true if valid. Return error message as string if not.
function checkTaskValidity(req, res) {
    let error_message = ""
    const { name, category } = req.body

    if (!name || typeof name !== 'string') {
        error_message = { error: 'Task name invalid or non-existent' }
    } else if (typeof category !== 'number' || category !== 0 && category !== 1) {
        error_message = { error: 'Category must be 0 or 1' }
    } else {
        return true
    }

    console.log(error_message)
    res.status(400).json(error_message)
    return false
}

// Only accept the request if the Content-Type is JSON
function checkContentType(req, res) {
    if (!req.is('application/json')) {
        const error_message = { error: "Content-Type must be application/json" }
        console.log(error_message)
        res.status(415).json(error_message)
        return false
    } else {
        return true
    }
}

app.use(express.json())

// Frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'front-end', 'index.html'))
})

app.get('/styles.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'front-end', 'styles.css'))
})

app.get('/config.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'front-end', 'config.js'))
})

app.get('/script.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'front-end', 'script.js'))
})

// Get tasks
app.get('/api/tasks', (req, res) => {
    res.send(tasks)
})

// Add task
app.post('/api/tasks', (req, res) => {
    if (!checkContentType(req, res)) return
    if (!checkTaskValidity(req, res)) return

    const { date } = req.body
    const newUUID = crypto.randomUUID()
    let newTask = {
        id: newUUID,
        name: req.body.name,
        category: req.body.category,
        priority: req.body.priority || 1,
        ...(date && { date })  // Only add date if it exists
    }

    tasks.push(newTask)
    updateTasksFile()

    const message = { message: `Task named ${newTask.name} added with id ${newUUID}` }
    console.log(message)
    res.status(201).json(message)
})

// Update task
app.put('/api/tasks/:id', (req, res) => {
    if (!checkContentType(req, res)) return
    if (!checkTaskValidity(req, res)) return

    const id = req.params.id

    const index = tasks.findIndex(obj => obj.id === id)
    if (index == -1) {
        const error_message = { error: "Task not found" }
        console.log(error_message)
        res.status(404).json(error_message)
        return
    }

    const { date } = req.body
    tasks[index] = {
        id: id,
        name: req.body.name,
        category: req.body.category,
        priority: req.body.priority || tasks[index].priority,
        ...(date && { date })
    }
    
    updateTasksFile()

    const message = { message: `Task with id ${id} updated` }
    console.log(message)
    res.status(200).json(message)
})

// Delete task
app.delete('/api/tasks/:id', (req, res) => {
    const id = req.params.id

    const index = tasks.findIndex(obj => obj.id === id)

    if (index == -1) {
        const error_message = { error: `Task with id ${id} not found` }
        console.log(error_message)
        res.status(404).json(error_message)
        return
    }
    
    tasks.splice(index, 1)
    updateTasksFile()

    const message = { message: `Task with id ${id} deleted` }
    console.log(message)
    res.status(200).json(message)
})

app.listen(process.env.PORT || PORT, () => {
    console.log(`http://localhost:${PORT} \nhttp://localhost:${PORT}/api/tasks`)
})