const express = require('express')
const app = express()
const handlebars = require('express-handlebars').create({defaultLayout:'main'})
const getRandomFortunes = require('./lib/fortune')
// 设置视图引擎
app.engine('handlebars',handlebars.engine)
app.set('view engine','handlebars')
app.set('port', process.env.PORT || 3000)

// 静态文件
app.use(express.static(__dirname + '/public'));

// 加载测试中间件
app.use(function(req,res,next) {
    res.locals.showTests = app.get('env') !== 'production'&&
    req.query.test === '1';
    next();
})
app.get('/', function(req,res) {
    // res.type('text/plain');
    // res.send('Meadownlark Travel')
    res.render('home',{
        pageTestScript:'/qa/global-tests.js'
    })
})

app.get('/about', function(req,res) {

    res.render('about',{fortune:getRandomFortunes(),pageTestScript:'/qa/tests-about.js'})
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