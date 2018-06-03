import core from 'image-filter-core';
import victim, { transform } from '../index';

jest.mock('image-filter-core');

describe('invert', () => {
    describe('when data is not defined', () => {
        it('should throw error', () => {
            expect(() => victim()).toThrowError(
                'image-filter-invert:: invalid options provided'
            );
        });
    });

    describe('when has all paramters', () => {
        let result;
        const data = 'DATA';

        beforeAll(() => {
            core.applyFilter = jest.fn().mockReturnValue('MOCK-VALUE');
            result = victim(data, {}, 4);
        });

        it('should call applyFilter', () => {
            expect(core.applyFilter).toHaveBeenCalledWith(
                data,
                expect.anything(),
                null,
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

        const expectedData = [62, 36, 13, 255, 193, 219, 242, 255];

        transform(data, 4);
        expect(data).toEqual(expectedData);
    });
});