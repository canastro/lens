const expect = require('chai').expect;
const transform = require('../src/transform');

describe('transform', function () {
    it('should apply transformation and return as imageData', function () {
        const data = [
            193,
            219,
            242,
            255,
            193,
            219,
            242,
            255
        ];

        const expectedData = [
            63.33238209903888,
            119.1406190826259,
            196.29810549179535,
            255,
            193,
            219,
            242,
            255
        ];

        transform(data, 4, { adjustment: 5 });
        expect(data).to.deep.equal(expectedData);
    });
});
