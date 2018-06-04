import core from 'lens-core';
import victim, { transform } from '../index';

jest.mock('lens-core');

describe('contrast', () => {
    describe('when data is not defined', () => {
        it('should throw error', () => {
            expect(() => victim()).toThrowError(
                'lens-filter-contrast:: invalid options provided'
            );
        });
    });

    describe('when options is not defined', () => {
        it('should throw error', () => {
            expect(() => victim({})).toThrowError(
                'lens-filter-contrast:: invalid options provided'
            );
        });
    });

    describe('when contrast is not defined', () => {
        it('should throw error', () => {
            expect(() => victim({}, {})).toThrowError(
                'lens-filter-contrast:: invalid options provided'
            );
        });
    });

    describe('when has all paramters', () => {
        let result;
        const data = 'DATA';
        const options = { contrast: 50 };

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
        const data = [193, 219, 242, 255, 193, 219, 242, 255];
        const expectedData = [
            241.52578068264341,
            286.9360929557008,
            327.10675381263616,
            255,
            193,
            219,
            242,
            255
        ];

        const result = transform({
            data,
            length: 4,
            options: { contrast: 70 }
        });
        expect(result).toEqual(expectedData);
    });
});
