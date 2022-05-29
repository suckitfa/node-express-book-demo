const http = require('http')
const handleHttp = function(req,res) {
    res.writeHead(200,{'Content-Type':'text/html'})
    res.end(`<h1>Hello World!</h1>`)
}

http.createServer(handleHttp).listen(3000)

console.log('Server started on http://localhost:3000; press Ctrl-C to terminate')