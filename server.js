const express = require('express')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')

const app = express()
const PORT = 3000
const tasks = require('./tasks.json')


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

app.use(express.json())

// Get tasks
app.get('/api/tasks', (req, res) => {
    res.send(tasks)
})

// Add task
app.post('/api/tasks', (req, res) => {
    if (!req.is('application/json')) {
        res.status(415).json({ error: "Content-Type must be application/json" })
        return
    }

    const { name, category, date } = req.body

    if (!name) {
        res.status(400).json({ error: "Task has no name" })
        return
    }

    if (category !== 0 && category !== 1) {
        res.status(400).json({ error: "Category must be 0 or 1" })
        return
    }

    let newTask = {
        id: crypto.randomUUID(),
        name: name,
        category: category,
        priority: req.body.priority || 1,
        ...(date && { date })
    }

    tasks.push(newTask)
    updateTasksFile()

    res.status(200).json({ message: "Task added" })
})

// Update task
app.put('/api/tasks', (req, res) => {

})

// Delete task
app.delete('/api/tasks', (req, res) => {

})

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT} \nhttp://localhost:${PORT}/api/tasks`)
})