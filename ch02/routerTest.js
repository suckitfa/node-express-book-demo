const http = require('http')
http.createServer(function(req,res) {
    // 提取URL中的path部分
    var path = req.url.replace(/\/?(?:\?.*)?$/,'').toLowerCase()
    switch(path) {
        case '':
            res.writeHead(200,{'Content-Type':'text/plain'});
            res.end('HomePage');
            break;
        case '/about':
            res.writeHead(200,{'Content-Type':'text/html'});
            res.end('About');
            break;
        default:
            res.writeHead(404,{'Content-Type':'text/plain'})
            res.end('Not Found')
            break;
    }
}).listen(3000)

console.log('http server: http://localhost:3000')