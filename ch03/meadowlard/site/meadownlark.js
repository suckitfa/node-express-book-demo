const express = require('express')
const app = express()
const handlebars = require('express-handlebars').create({defaultLayout:'main'})
// 设置视图引擎
app.engine('handlebars',handlebars.engine)
app.set('view engine','handlebars')
app.set('port', process.env.PORT || 3000)

// 静态文件
app.use(express.static(__dirname + '/public'));

app.get('/', function(req,res) {
    // res.type('text/plain');
    // res.send('Meadownlark Travel')
    res.render('home')
})

app.get('/about', function(req,res) {
    const fortunes = [
        "Conquer your fears or they will conquer you.", 
        "Rivers need springs.", 
        "Do not fear what you don't know.", 
        "You will have a pleasant surprise.", 
        "Whenever possible, keep it simple.",
    ]
    // 随机取出
    const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    console.log("fuck you")
    res.render('about',{fortune:randomFortune})
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