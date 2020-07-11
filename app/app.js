const express = require('express');
const path = require('path');
const mime = require('mime');
const urlUtils = require("url");
const bodyParser = require('body-parser')
const fs = require('fs')
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('static'));

app.get('/download', function (req, res) {
	const file = `${__dirname}/documents/semantic_versioning.pdf`;
	const pathParams = urlUtils.parse(req.url, true).query;
	if (pathParams.octetStream === 'true') {
		const filename = path.basename(file);
		res.setHeader('Content-disposition', 'attachment; filename=' + filename);
		res.setHeader('Content-Type', 'application/octet-stream');
		res.send(file);
	} else {
		res.download(file);
	}
});

app.post('/log', function (req, res) {
	const file = `${__dirname}/logs/terminal-log.txt`;
	fs.appendFile(file, req.body.terminalLog, function (error) {
		if (error) {
			throw error;
		}
		res.status(200).json({message: "File successfully written"});
	});
});

app.get('*', function (req, res, error) {
	res.send('index.html');
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))