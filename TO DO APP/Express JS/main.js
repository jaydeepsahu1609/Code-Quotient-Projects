const express = require('express');
const { json } = require('express/lib/response');
const fs = require('fs');

const app = express();
app.use(express.json());

const port = 3000;


function sendFile(res, filename)
{
	fs.readFile(filename, "utf-8", (err, data)=>{
		if(err)
		{
			res.redirect('/errorPage');
		}
		else{
			res.end(data);
		}
	})	
}

function writeToFile(res, filename, data)
{
	fs.writeFile(filename, data, (err)=>{
		if(err)
			res.redirect('/errorPage');
	})
}

app.get('/', (req, res) => {
	console.log(req.url);
	sendFile(res, "index.html");
})

app.get('/errorPage', (req, res) => {
	console.log(req.url);
	sendFile(res, "error.html");
})

app.get('/index.js', (req, res) => {
	console.log(req.url);
	sendFile(res, "index.js");
})

app.get('/index.css', (req, res) => {
	console.log(req.url);
	sendFile(res, "index.css");
})

app.get('/getNotes', (req, res) => {
	console.log(req.url);
	sendFile(res, "todos.json");
})

app.post('/saveNotes', (req, res) => {
	console.log(req.url);
	console.log(req.body);
	writeToFile(res, "todos.json", JSON.stringify(req.body));
})

app.listen(port, () => {
	console.log(`server listening at http://localhost:${port}/`)
})
