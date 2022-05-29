const express = require('express')
const app = express()
const handlebars = require('express-handlebars').create({defaultLayout:'main'})
// 设置视图引擎
app.engine('handlebars',handlebars.engine)
app.set('view engine','handlebars')
app.set('port', process.env.PORT || 3000)

app.get('/', function(req,res) {
    // res.type('text/plain');
    // res.send('Meadownlark Travel')
    res.render('home')
})

app.get('/about', function(req,res) {
    // res.type('text/plain');
    // res.send('About Meadowlark Travel');
    res.render('about')
})

// 定制 404页面
app.use(function(req,res) {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
})

// 定制 500页面
app.use(function(err,req,res,next) {
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
})

app.listen(app.get('port'), function() {
    console.log(' Express started on http://localhost:'+app.get('port'))
})