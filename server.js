const express = require('express')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')  // Used to create UUIDs for tasks

const app = express()
const PORT = 3000
const tasks = require('./tasks.json')

// Write updated tasks to tasks.json
function updateTasksFile() {
    fs.writeFile(
        'tasks.json',
        JSON.stringify(tasks, null, 4),
        err => {
            if (err) throw err
            
            console.log('tasks.json file updated')
        }
    )
}

// Return true if valid. Return error message as string if not.
function checkTaskValidity(name, category) {
    // Only accept tasks with a name and category
    if (!name) {
        return 'Task has no name'
    } else if (category !== 0 && category !== 1) {
        return 'Category must be 0 or 1'
    } else {
        return true
    }
}

app.use(express.json())

// Get tasks
app.get('/api/tasks', (req, res) => {
    res.send(tasks)
})

// Add task
app.post('/api/tasks', (req, res) => {
    // Only accept the request if the Content-Type is JSON
    if (!req.is('application/json')) {
        res.status(415).json({ error: "Content-Type must be application/json" })
        return
    }

    // Define variables for checks
    const { name, category, date } = req.body

    const taskValidity = checkTaskValidity(name, category)
    if (taskValidity !== true) {
        res.status(400).json({ error: taskValidity })
        return
    }

    let newTask = {
        id: crypto.randomUUID(),
        name: name,
        category: category,
        priority: req.body.priority || 1,
        ...(date && { date })  // Only add date if it exists
    }

    tasks.push(newTask)
    updateTasksFile()

    res.status(201).json({ message: "Task added" })
})

// Update task
app.put('/api/tasks/:id', (req, res) => {
    const id = req.params.id

    // Only accept the request if the Content-Type is JSON
    if (!req.is('application/json')) {
        res.status(415).json({ error: "Content-Type must be application/json" })
        return
    }

    const index = tasks.findIndex(obj => obj.id === id)
    if (index == -1) {
        res.status(400).json({ error: "Task not found" })
        return
    }

    const { name, category, date } = req.body

    const taskValidity = checkTaskValidity(name, category)
    if (taskValidity !== true) {
        res.status(400).json({ error: taskValidity })
        return
    }

    tasks[index] = {
        id: id,
        name: name,
        category: category,
        priority: req.body.priority || tasks[index.priority],
        ...(date && { date })
    }
    
    updateTasksFile()
    res.status(200).json({ message: "Task updated" })
})

// Delete task
app.delete('/api/tasks/:id', (req, res) => {
    const index = tasks.findIndex(obj => obj.id === req.params.id)
    if (index == -1) {
        res.status(400).json({ error: "Task not found" })
        return
    }
    
    tasks.splice(index, 1)
    updateTasksFile()

    res.status(200).json({ message: "Task deleted" })
})

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT} \nhttp://localhost:${PORT}/api/tasks`)
})