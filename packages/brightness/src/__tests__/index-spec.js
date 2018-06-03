import core from 'image-filter-core';
import victim, { transform } from '../index';

jest.mock('image-filter-core');

describe('brightness', () => {
    describe('when data is not defined', () => {
        it('should throw error', () => {
            expect(() => victim()).toThrowError(
                'image-filter-brightness:: invalid options provided'
            );
        });
    });

    describe('when options is not defined', () => {
        it('should throw error', () => {
            expect(() => victim({})).toThrowError(
                'image-filter-brightness:: invalid options provided'
            );
        });
    });

    describe('when adjustment is not defined', () => {
        it('should throw error', () => {
            expect(() => victim({}, {})).toThrowError(
                'image-filter-brightness:: invalid options provided'
            );
        });
    });

    describe('when has all paramters', () => {
        let result;
        const data = 'DATA';
        const options = { adjustment: 'ADJUSTMENT' };

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

        const expectedData = [198, 224, 247, 255, 193, 219, 242, 255];

        transform(data, 4, { adjustment: 5 });
        expect(data).toEqual(expectedData);
    });
});