import core from 'lens-core';
import victim, { transform } from '../index';

jest.mock('lens-core');

describe('colorize', () => {
    describe('when data is not defined', () => {
        it('should throw error', () => {
            expect(() => victim()).toThrowError(
                'lens-filter-colorize:: invalid options provided'
            );
        });
    });

    describe('when options is not defined', () => {
        it('should throw error', () => {
            expect(() => victim({})).toThrowError(
                'lens-filter-colorize:: invalid options provided'
            );
        });
    });

    describe('when color is not defined', () => {
        it('should throw error', () => {
            expect(() => victim({}, {})).toThrowError(
                'lens-filter-colorize:: invalid options provided'
            );
        });
    });

    describe('when level is not defined', () => {
        it('should throw error', () => {
            expect(() => victim({}, { color: '#FFF' })).toThrowError(
                'lens-filter-colorize:: invalid options provided'
            );
        });
    });

    describe('when has all paramters', () => {
        let result;
        const data = 'DATA';
        const options = { color: '#FFF', level: 50 };

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
    it('should apply transformation and return as imageData', function() {
        const data = [193, 219, 242, 255, 193, 219, 242, 255];
        const expectedData = [96.5, 173.5, 185, 255, 193, 219, 242, 255];

        transform(data, 4, { color: '#008080', level: 50 });
        expect(data).toEqual(expectedData);
    });
});
