const express = require('express')
const app = express()
const handlebars = require('express-handlebars').create({defaultLayout:'main'})
const fortune = require('./lib/fortune')
app.disable('x-powered-by')
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

    res.render('about',{fortune:fortune.getFortune(),pageTestScript:'/qa/tests-about.js'})
})

app.get('/tours/hood-river',function(req,res) {
    res.render('tours/hood-river')
})

app.get('/tours/request-group-rate',function(req,res) {
    res.render('tours/requests-group-rate')
})

app.get('/headers', function(req,res) {
    res.set('Content-Type','text/plain')
    var s = ''
    for(var name in req.headers) {
        s += name + ':' + req.headers[name] + '\n';
    }
    s += `ip:${req.ip}\n`
    s += `req.ip = ${req.ip}`
    console.log(req.headers)
    res.send(s);
})

app.get('/better', function(req,res) {
    res.render('better', {
        "today":"fuck you"
    })
})

// 定制 404页面
app.use(function(req,res) {
    res.type('text/html');
    res.status(404).render('404')
})

// 定制 500页面: 程序出现错误的时候调用
// 错误处理程序
app.use(function(err,req,res,next) {
    console.error(err.stack);
    res.type('text/html');
    res.status(500);
    res.send('500');
})

app.listen(app.get('port'), function() {
    console.log(' Express started on http://localhost:'+app.get('port'))
})