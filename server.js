const express = require('express')
const path = require('path')
const app = express()
const PORT = 3000
const tasksFilePath = path.join(__dirname, 'tasks.json')


// Get tasks
app.get('/api/tasks', (req, res) => {
    res.sendFile(tasksFilePath)
})

// Add task
app.post('/api/tasks', (req, res) => {

})

// Update task
app.put('/api/tasks', (req, res) => {

})

// Delete task
app.delete('/api/tasks', (req, res) => {

})

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})