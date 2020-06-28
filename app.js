const express = require('express')
const app = express()
const port = 8000

app.use(express.static(__dirname));
app.get('/', (req, res) => res.sendFile('index.html', { root: __dirname }))
app.get('/home', (req, res) => res.sendFile('index.html', { root: __dirname }))
app.get('/projectTarget', (req, res) => res.sendFile('game.html', { root: __dirname }))

app.use(function(req, res) {
 	res.sendFile('index.html', { root: __dirname });
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))