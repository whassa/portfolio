const express = require('express')
const sprightly = require('sprightly');
const app = express()
const port = ( process.env.PORT || 8000 )


app.engine('spy', sprightly); // The one line you have to add
app.set('view engine', 'spy'); // register the template engine


app.use(express.static(__dirname));
app.get('/', (req, res) => res.render('index.spy'));
app.get('/home', (req, res) => res.render('index.spy'))
app.get('/works', (req, res) => res.render('works.spy'))

app.get('/projectTarget', (req, res) => res.render('game.spy'))
app.use(function(req, res) {
	res.render('index.spy');
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))