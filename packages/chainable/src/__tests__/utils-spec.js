import { getPixelsFromImage, getDomElement } from '../utils';

describe('#getPixelsFromImage()', () => {
    describe('when element tagName is not image', () => {
        it('should throw error', () => {
            expect(() => getPixelsFromImage({}, {}, {})).toThrow(
                'lens-chainable:: invalid origin'
            );
        });
    });

    describe('when tagName is image', () => {
        let result;
        let mockCanvas;
        let mockContext;
        let mockElement;

        beforeAll(() => {
            mockCanvas = { width: 'DUMMY-WIDTH', height: 'DUMMY-HEIGHT' };
            mockContext = {
                drawImage: jest.fn(),
                getImageData: jest.fn().mockReturnValue('GET-IMAGE-DATA')
            };
            mockElement = { tagName: 'IMG' };

            result = getPixelsFromImage(mockCanvas, mockContext, mockElement);
        });

        it('should call context drawImage', () => {
            expect(mockContext.drawImage).toHaveBeenCalledWith(
                mockElement,
                0,
                0
            );
        });

        it('should call getImageData', () => {
            expect(mockContext.getImageData).toHaveBeenCalledWith(
                0,
                0,
                'DUMMY-WIDTH',
                'DUMMY-HEIGHT'
            );
        });

        it('should return the result of getImageData', () => {
            expect(result).toEqual('GET-IMAGE-DATA');
        });
    });
});

describe('#getDomElement()', () => {
    describe('when selector is not defined', () => {
        it('should throw error', () => {
            expect(() => getDomElement()).toThrow(
                'lens-chainable:: no selector provided'
            );
        });
    });

    describe('when target is not found', () => {
        it('should throw error', () => {
            global.document.querySelectorAll = jest.fn().mockReturnValue([]);
            expect(() => getDomElement('#not-found')).toThrow(
                'lens-chainable:: no "to" element found'
            );
        });
    });

    describe('when target is found', () => {
        let result;

        beforeAll(() => {
            global.document.querySelectorAll = jest
                .fn()
                .mockReturnValue(['DUMMY-TARGET']);
            result = getDomElement('#target');
        });

        it('should call document.querySelectorAll', () => {
            expect(global.document.querySelectorAll).toHaveBeenCalledWith(
                '#target'
            );
        });

        it('should return the target', () => {
            expect(result).toEqual('DUMMY-TARGET');
        });
    });
});
