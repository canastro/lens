const expect = require('chai').expect;
const ColorInterval = require('../src/color-interval');
const transform = require('../src/transform');

describe('transform', function () {
    var originalData = [
        193,
        219,
        242,
        255,

        113,
        119,
        142,
        255,

        100,
        119,
        142,
        255
    ];

    context('when all of the colors are full defined', function () {
        it('should apply transformation and return as imageData', function () {
            var colorInterval = new ColorInterval({
                from: { r: 190, g: 200, b: 240, a: 255 },
                to: { r: 195, g: 220, b: 250, a: 255 },
                match: { r: null, g: null, b: null, a: 0 },
                noMatch: { r: null, g: null, b: null, a: 100 }
            });

            var options = {
                colorsInterval: [colorInterval]
            };

            const data = originalData.slice();

            const expectedData = [
                193,
                219,
                242,
                0,

                113,
                119,
                142,
                100,

                100,
                119,
                142,
                255
            ];

            transform(data, 8, options);
            expect(data).to.deep.equal(expectedData);
        });
    });

    context('when match or no match color only define the transformation part of the color', function () {
        context('when only alpha is defined', function () {
            it('should apply transformation and return as imageData', function () {
                var colorInterval = new ColorInterval({
                    from: { r: 190, g: 200, b: 240, a: 255 },
                    to: { r: 195, g: 220, b: 250, a: 255 },
                    match: { a: 0 },
                    noMatch: { a: 100 }
                });

                var options = {
                    colorsInterval: [colorInterval]
                };

                const data = originalData.slice();

                const expectedData = [
                    193,
                    219,
                    242,
                    0,

                    113,
                    119,
                    142,
                    100,

                    100,
                    119,
                    142,
                    255
                ];

                transform(data, 8, options);
                expect(data).to.deep.equal(expectedData);
            });
        });

        context('when only red is defined', function () {
            it('should apply transformation and return as imageData', function () {
                var colorInterval = new ColorInterval({
                    from: { r: 190, g: 200, b: 240, a: 255 },
                    to: { r: 195, g: 220, b: 250, a: 255 },
                    match: { r: 0 },
                    noMatch: { r: 100 }
                });

                var options = {
                    colorsInterval: [colorInterval]
                };

                const data = originalData.slice();

                const expectedData = [
                    0,
                    219,
                    242,
                    255,

                    100,
                    119,
                    142,
                    255,

                    100,
                    119,
                    142,
                    255
                ];

                transform(data, 8, options);
                expect(data).to.deep.equal(expectedData);
            });
        });

        context('when only green is defined', function () {
            it('should apply transformation and return as imageData', function () {
                var colorInterval = new ColorInterval({
                    from: { r: 190, g: 200, b: 240, a: 255 },
                    to: { r: 195, g: 220, b: 250, a: 255 },
                    match: { g: 0 },
                    noMatch: { g: 100 }
                });

                var options = {
                    colorsInterval: [colorInterval]
                };

                const data = originalData.slice();

                const expectedData = [
                    193,
                    0,
                    242,
                    255,

                    113,
                    100,
                    142,
                    255,

                    100,
                    119,
                    142,
                    255
                ];

                transform(data, 8, options);
                expect(data).to.deep.equal(expectedData);
            });
        });

        context('when only blue is defined', function () {
            it('should apply transformation and return as imageData', function () {
                var colorInterval = new ColorInterval({
                    from: { r: 190, g: 200, b: 240, a: 255 },
                    to: { r: 195, g: 220, b: 250, a: 255 },
                    match: { b: 0 },
                    noMatch: { b: 100 }
                });

                var options = {
                    colorsInterval: [colorInterval]
                };

                const data = originalData.slice();

                const expectedData = [
                    193,
                    219,
                    0,
                    255,

                    113,
                    119,
                    100,
                    255,

                    100,
                    119,
                    142,
                    255
                ];

                transform(data, 8, options);
                expect(data).to.deep.equal(expectedData);
            });
        });
    });

    context('when noMatch is not defined', function () {
        it('should apply transformation and return as imageData', function () {
            var colorInterval = new ColorInterval({
                from: { r: 190, g: 200, b: 240, a: 255 },
                to: { r: 195, g: 220, b: 250, a: 255 },
                match: { r: null, g: null, b: null, a: 0 }
            });

            var options = {
                colorsInterval: [colorInterval]
            };

            const data = originalData.slice();

            const expectedData = [
                193,
                219,
                242,
                0,

                113,
                119,
                142,
                255,

                100,
                119,
                142,
                255
            ];

            transform(data, 8, options);
            expect(data).to.deep.equal(expectedData);
        });
    });
});
