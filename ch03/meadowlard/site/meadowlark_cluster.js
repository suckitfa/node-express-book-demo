const cluster = require('cluster')

function startWorker() {
    const worker = cluster.fork()
    console.log("CLUSTER: Worker %d started",worker.id)
}

if (cluster.isMaster) {
    require('os').cpus().forEach(function() {
        startWorker();
    });

    // 纪录所有断开的工作线程
    cluster.on('disconnect', function(worker) {
        console.log('CLUSTER: Worker %d disconnected from the cluster. ', worker.id)
    })

    // 当有工作线程死掉，创建一个工作线程代替
    cluster.on('exit', function(worker, code, signal) {
        console.log('CLUSTER: Worker %d died with exit code %d (%s)', worker.id, code, signal); 
        startWorker();
    })
} else {
    // 在这个工作线程上启动服务器
    require('./meadownlark.js')()
}