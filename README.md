TODO app API for a university course project  
Just run `node server.js`  

## The database

The database is just a JSON-file.  
The tasks.json file has 3 tasks already in it so you can check what the data looks like.  

A task has 5 potential key-value pairs:
- id | UUID, created by the server  
- name | string, required  
- category | 0 or 1, required, the app has 2 different tabs so you can (read: have to) specify where to put the task  
- priority | 1-3, defaults to 1 if not specified
- date  

## Testing

Test the server with curl:  

Get tasks:  
`curl -X GET http://localhost:3000/api/tasks`

Adding a task:  
`curl http://localhost:3000/api/tasks -X POST -H "Content-Type: application/json" -d '{"name":"testi","category":0,"priority":1,"date":"2025-05-30"}'`

Updating a task (replace [ID] with the task's id):  
`curl http://localhost:3000/api/tasks/[ID] -X PUT -H "Content-Type: application/json" -d '{"name":"testi2","category":0}'`

Deleting a task (replace [ID] with the task's id):  
`curl http://localhost:3000/api/tasks/[ID] -X DELETE`

Throw an error with invalid Content-Type:  
`curl http://localhost:3000/api/tasks -X POST -d '{"name":"testi","category":0,"priority":1,"date":"2025-05-30"}'`