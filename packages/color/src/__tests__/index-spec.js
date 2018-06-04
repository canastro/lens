import core from 'lens-core';
import ColorInterval from '../color-interval';
import victim, { transform } from '../index';

jest.mock('lens-core');

describe('color', function() {
    describe('when data is not defined', () => {
        it('should throw error', () => {
            expect(() => victim()).toThrowError(
                'lens-filter-color:: invalid options provided'
            );
        });
    });

    describe('when options is not defined', () => {
        it('should throw error', () => {
            expect(() => victim({})).toThrowError(
                'lens-filter-color:: invalid options provided'
            );
        });
    });

    describe('when colorsInterval is not a array', () => {
        it('should throw error', () => {
            expect(() => victim({}, { colorsInterval: {} })).toThrowError(
                'lens-filter-color:: invalid options provided'
            );
        });
    });

    describe('when has all paramters', () => {
        let result;
        const data = 'DATA';
        const options = { colorsInterval: [1, 2] };

        beforeAll(() => {
            core.applyFilter = jest.fn().mockReturnValue('MOCK-VALUE');
            result = victim(data, options, 4);
        });

        it('should call applyFilter', () => {
            expect(core.applyFilter).toHaveBeenCalledWith(
                data,
                expect.anything(),
                options,
                4
            );
        });

        it('should return the applyFilter result', () => {
            expect(result).toEqual('MOCK-VALUE');
        });
    });
});

describe('#transform()', function() {
    const originalData = [
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

    describe('when all of the colors are full defined', function() {
        it('should apply transformation and return as imageData', function() {
            const colorInterval = new ColorInterval({
                from: { r: 190, g: 200, b: 240, a: 255 },
                to: { r: 195, g: 220, b: 250, a: 255 },
                match: { r: null, g: null, b: null, a: 0 },
                noMatch: { r: null, g: null, b: null, a: 100 }
            });

            const options = {
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
            expect(data).toEqual(expectedData);
        });
    });

    describe('when match or no match color only define the transformation part of the color', function() {
        describe('when only alpha is defined', function() {
            it('should apply transformation and return as imageData', function() {
                const colorInterval = new ColorInterval({
                    from: { r: 190, g: 200, b: 240, a: 255 },
                    to: { r: 195, g: 220, b: 250, a: 255 },
                    match: { a: 0 },
                    noMatch: { a: 100 }
                });

                const options = {
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
                expect(data).toEqual(expectedData);
            });
        });

        describe('when only red is defined', function() {
            it('should apply transformation and return as imageData', function() {
                const colorInterval = new ColorInterval({
                    from: { r: 190, g: 200, b: 240, a: 255 },
                    to: { r: 195, g: 220, b: 250, a: 255 },
                    match: { r: 0 },
                    noMatch: { r: 100 }
                });

                const options = {
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
                expect(data).toEqual(expectedData);
            });
        });

        describe('when only green is defined', function() {
            it('should apply transformation and return as imageData', function() {
                const colorInterval = new ColorInterval({
                    from: { r: 190, g: 200, b: 240, a: 255 },
                    to: { r: 195, g: 220, b: 250, a: 255 },
                    match: { g: 0 },
                    noMatch: { g: 100 }
                });

                const options = {
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
                expect(data).toEqual(expectedData);
            });
        });

        describe('when only blue is defined', function() {
            it('should apply transformation and return as imageData', function() {
                const colorInterval = new ColorInterval({
                    from: { r: 190, g: 200, b: 240, a: 255 },
                    to: { r: 195, g: 220, b: 250, a: 255 },
                    match: { b: 0 },
                    noMatch: { b: 100 }
                });

                const options = {
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
                expect(data).toEqual(expectedData);
            });
        });
    });

    describe('when noMatch is not defined', function() {
        it('should apply transformation and return as imageData', function() {
            const colorInterval = new ColorInterval({
                from: { r: 190, g: 200, b: 240, a: 255 },
                to: { r: 195, g: 220, b: 250, a: 255 },
                match: { r: null, g: null, b: null, a: 0 }
            });

            const options = {
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
            expect(data).toEqual(expectedData);
        });
    });
});
