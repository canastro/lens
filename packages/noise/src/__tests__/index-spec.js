import core from 'lens-core';
import victim, { transform } from '../index';

jest.mock('lens-core');

describe('noise', () => {
    describe('when data is not defined', () => {
        it('should throw error', () => {
            expect(() => victim()).toThrowError(
                'lens-filter-noise:: invalid options provided'
            );
        });
    });

    describe('when options is not defined', () => {
        it('should throw error', () => {
            expect(() => victim({})).toThrowError(
                'lens-filter-noise:: invalid options provided'
            );
        });
    });

    describe('when adjust is not defined', () => {
        it('should throw error', () => {
            expect(() => victim({}, {})).toThrowError(
                'lens-filter-noise:: invalid options provided'
            );
        });
    });

    describe('when has all paramters', () => {
        let result;
        const data = 'DATA';
        const options = { adjust: 50 };

        beforeAll(() => {
            core.applyFilter = jest.fn().mockReturnValue('MOCK-VALUE');
            result = victim({ data, options, nWorkers: 4 });
        });

        it('should call applyFilter', () => {
            expect(core.applyFilter).toHaveBeenCalledWith({
                data,
                transform: expect.anything(),
                options,
                nWorkers: 4
            });
        });

        it('should return the applyFilter result', () => {
            expect(result).toEqual('MOCK-VALUE');
        });
    });
});

describe('#transform()', function() {
    it('should apply transformation and return as imageData', function() {
        const data = [1, 250, 1, 255, 255, 255, 255, 255];
        const original = data.slice();
        const adjust = 50;

        Math.random = jest
            .fn()
            .mockReturnValueOnce(-0.5)
            .mockReturnValueOnce(-1)
            .mockReturnValueOnce(0.5)
            .mockReturnValueOnce(1);

        const result = transform({
            data,
            length: 8,
            options: { adjust: adjust }
        });

        result.forEach(function(item, index) {
            const range = adjust * 2.55;
            const isInRange =
                item > original[index] - range &&
                item < original[index] + range;

            expect(isInRange).toEqual(true);
        });
    });
});
