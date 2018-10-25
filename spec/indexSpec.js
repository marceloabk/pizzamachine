const request = require('request');

const endpoint = 'http://localhost:5000/';


describe("GET /", () => {
    var server;
    beforeAll(() => {
        server = require("../index");
    });
    afterAll(() => {
        server.close();
    });
    it('should return 200 response code', function (done) {
        request.get(endpoint, function (error, response) {
            expect(response.statusCode).toEqual(200);
            done();
        });
    });

    it('should fail on POST', function (done) {
        request.post(endpoint, {json: true, body: {}}, function (error, response) {
            expect(response.statusCode).toEqual(404);
            done();
        });
    });
});
