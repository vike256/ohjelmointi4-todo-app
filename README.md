TODO app created for Programming 4 -course  

Test the server with curl:  

Adding a task:  
`curl http://localhost:3000/api/tasks -X POST -H "Content-Type: application/json" -d '{"name":"testi","category":0,"priority":1,"date":"2025-05-30"}'`

Updating a task (replace [ID] with the task's id):  
`curl http://localhost:3000/api/tasks/[ID] -X PUT -H "Content-Type: application/json" -d '{"name":"testi2","category":0}'`

Deleting a task (replace [ID] with the task's id):  
`curl http://localhost:3000/api/tasks/[ID] -X DELETE`

Throw an error with invalid Content-Type:  
`curl http://localhost:3000/api/tasks -X POST -d '{"name":"testi","category":0,"priority":1,"date":"2025-05-30"}'`