const expect = require('chai').expect;
const sinon = require('sinon');
const transform = require('../src/transform');

describe('noise', function() {
    it('should apply transformation and return as imageData', function() {
        const data = [1, 250, 1, 255, 255, 255, 255, 255];
        const original = data.slice();
        const adjust = 50;

        const stub = sinon.stub(Math, 'random');
        stub.onCall(0).returns(-0.5);
        stub.onCall(1).returns(-1);
        stub.onCall(2).returns(0.5);
        stub.onCall(3).returns(1);

        transform(data, 8, { adjust: adjust });

        data.forEach(function(item, index) {
            var range = adjust * 2.55;
            var isInRange = item > (original[index] - range) && item < (original[index] + range);

            expect(isInRange).to.equal(true);
        });
    });
});
