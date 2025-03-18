// Import the built-in HTTP module to create a server
const http = require('http');

// A sample array to store student data
// Consider this as database for now
const students = [
    { id: 1, name: "Lhuendupa", age: 7},
    { id: 2, name: "Sherab", age: 102},
];

// create an http server
const server = http.createServer((req, res) => {
    // set response header to JSON format
    res.setHeader('content-Type', 'application/json');

     // check if the request is the GET request to the home page "/"
     if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, {'Content-Type': 'text/plain' }); // reponse type is plain text
        res.end("Welcome to our API"); // send respond text
     }

     //Check if the request is GET request to "/students"
     else if (res.method === 'GET' && req.url === '/students') {
        res.writeHead(200); // Set status code 200 (OK)
        res.end(JSON.stingyfy(students)); // Convert students array to JSON and send it
     }

     // If the request doesnt match any of the above routes, retuen 404 Not Found
     else{
        res.writeHead(404);
        res.end(JSON.strigyfy({error: "Route not found" }));
     } 
});

//start the server and listen on port 3000
server.listen(2000, () => {
    console.log('Server running on http://localhost:2000');
});