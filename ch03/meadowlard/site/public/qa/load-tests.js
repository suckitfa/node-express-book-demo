const LoadTest = require('load-test');
const expect = require('chai').expect;
// const suite = require('c')
suite('Stress test', function() {
    test('HomePage should handle 100 requests in a second', function(done){
        var options = {
            url:"http://localhost:3000",
            concurrency:4,
            maxRequests:100,
        };

        LoadTest(options,function(err,result) {
            expect(!err);
            expect(result.totalTimeSeconds < 1);
            done();
        });
    });
});