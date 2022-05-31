const http = require('http')
const express = require('express')
const app = express()
// 使用模板的模板
const handlebars = require('express-handlebars').create({
    defaultLayout:'main',
    helpers: {
        section: function(name,options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
})
const fortune = require('./lib/fortune')
const weather = require('./lib/weather')
const formidable = require('formidable')
const jqupload = require('jquery-file-upload-middleware');
const credentials = require('./credentials.js')
app.use(require('cookie-parser')(credentials.cookieSecret))

// app.use(require('morgan')('dev'))

// 禁用响应头字段
app.disable('x-powered-by')

// 设置视图引擎
app.engine('handlebars',handlebars.engine)
app.set('view engine','handlebars')
app.set('port', process.env.PORT || 3000)

// 静态文件
app.use(express.static(__dirname + '/public'));

// 使用body-parser
// app.use(require('body-parser')());

// 加载测试中间件
app.use(function(req,res,next) {
    res.locals.showTests = app.get('env') !== 'production'&&
    req.query.test === '1';
    next();
})


// // jquery文件上传中间件的使用
// app.use('/upload', function(req,res,next) {
//     const now = Date.now()
//     jqupload.fileHandler({
//         uploadDir: function() {
//             return __dirname + '/public/uploads/'+now;
//         },
//         uploadUrl:function() {
//             return '/uploads/'+now;
//         }
//     })(req,res,next)
//     next();
// })

// 将中间件比作管道
// app.use(function(req,res,next) {
//     console.log("processing request for:  " + req.url + ".....")
//     next();
// })

// home page
app.get('/', function(req,res) {
    // 设置两个cookie
    const monster = req.cookies.monster || 'test'
    const signedMonster = req.signedCookies.monster || 'test'
    console.log(`monster = ${monster}, signedMonster = ${signedMonster}`)
    res.cookie('monster','nom nom')
    res.cookie('signed_monster','nom nom',{signed:true})
    res.render('home',{
        pageTestScript:'/qa/global-tests.js'
    })
})

app.get('/test-async-error', function(req,res) {
    process.nextTick(function() {
        throw new Error('Async Error')
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

app.get('/block', function(req,res) {
    const data = {
        currency: { 
            name: 'United States dollars', 
            abbrev: 'USD', 
        },
        tours: [
            { 
                name: 'Hood River', price: '$99.95' 
            }, 
            { 
                name: 'Oregon Coast', 
                price:'$159.95' 
            }
        ],
        specialsUrl: '/january-specials',
        currencies: [ 'USD', 'GBP', 'BTC' ], 
    }
    res.render('block',{
        ...data
    });
})
app.get('/thank-you', function(req,res) {
    res.type('html')
    res.send('<h1>Thank You!</h1>')
})

app.get('/newsletter', function(req,res) {
    res.render('newsletter', {csrf:"CSRF token goes here"})
})

app.post('/process', function(req,res) {
    if (req.xhr || req.accepts('json,html') === 'json') {
        res.send({success:true})
    } else {
        res.redirect(303,'thank-you')
    }
})

// 处理表单和图片上传
app.get('/contest/vacation-photo', function(req,res) {
    var now = new Date()
    res.render('contest/vacation-photo',{
        year:now.getFullYear(),
        month:now.getMonth()
    })
})
app.post('/contest/vacation-photo/:year/:month', function(req,res) {
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files) {
        if (err) return res.redirect(303,'/error')
        console.log('received fileds: ')
        console.log(fields)
        console.log('receive files: ')
        console.log(files)
        res.redirect(303,'/thank-you')
    });
})
app.use(function(req,res,next) {
    if (!res.locals.partials) res.locals.partials = {};
    res.locals.partials.weather = weather.getWeatherData()
    next();
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
    res.render('500')
})

// app.listen(app.get('port'), function() {
//     console.log(' Express started on http://localhost:'+app.get('port'))
// })

function startServer() { 
    http.createServer(app).listen(app.get('port'), function(){ 
            console.log( 'Express started in ' + app.get('env') + ' mode on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.' );
    }); 
}

if(require.main === module){ 
    // 应用程序直接运行；启动应用服务器 
    startServer(); 
} else {
     // 应用程序作为一个模块通过 "require" 引入 : 导出函数 // 创建服务器 
     module.exports = startServer; 
}