import core from 'lens-core';
import victim, { transform } from '../index';

jest.mock('lens-core');

describe('grayscale', () => {
    describe('when data is not defined', () => {
        it('should throw error', () => {
            expect(() => victim()).toThrowError(
                'lens-filter-grayscale:: invalid options provided'
            );
        });
    });

    describe('when has all paramters', () => {
        let result;
        const data = 'DATA';

        beforeAll(() => {
            core.applyFilter = jest.fn().mockReturnValue('MOCK-VALUE');
            result = victim({ data, nWorkers: 4 });
        });

        it('should call applyFilter', () => {
            expect(core.applyFilter).toHaveBeenCalledWith({
                data,
                transform: expect.anything(),
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
        const data = [193, 219, 242, 255, 193, 219, 242, 255];

        const expectedData = [
            215.13299999999998,
            215.13299999999998,
            215.13299999999998,
            255,
            193,
            219,
            242,
            255
        ];

        const result = transform({ data, length: 4 });
        expect(result).toEqual(expectedData);
    });
});
