import workerize from 'workerize';
import * as victim from '../index';

jest.mock('workerize');

describe('index', () => {
    describe('#getCanvas()', () => {
        it('should return a canvas of 100 x 100', () => {
            const element = victim.getCanvas(100, 100);

            expect(element.tagName).toEqual('CANVAS');
            expect(element.height).toEqual(100);
            expect(element.width).toEqual(100);
        });
    });

    describe('#convertImageDataToCanvasURL()', () => {
        it('should create canvas and call toDataURL', () => {
            const expectedResult = 'TEST';

            const mockCtx = { putImageData: jest.fn() };
            const mockCanvas = {
                getContext: jest.fn().mockReturnValue(mockCtx),
                toDataURL: jest.fn().mockReturnValue(expectedResult)
            };
            window.document.createElement = jest
                .fn()
                .mockReturnValue(mockCanvas);

            const imageData = { width: 100, height: 150 };
            const result = victim.convertImageDataToCanvasURL(imageData);

            expect(document.createElement).toHaveBeenCalledWith('canvas');
            expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
            expect(mockCanvas.width).toEqual(imageData.width);
            expect(mockCanvas.height).toEqual(imageData.height);
            expect(mockCtx.putImageData).toHaveBeenCalledWith(imageData, 0, 0);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('#applyFilter()', () => {
        let mockExecute;
        let result;
        let mockCtx;

        beforeAll(async () => {
            mockExecute = jest.fn().mockImplementation((canvasData, index) =>
                Promise.resolve({
                    result: 'TEST-IMAGE-DATA',
                    index
                })
            );

            workerize.mockImplementation(() => ({ execute: mockExecute }));

            mockCtx = {
                putImageData: jest.fn(),
                getImageData: jest.fn().mockReturnValue('IMAGE-DATA')
            };
            const mockCanvas = {
                getContext: jest.fn().mockReturnValue(mockCtx),
                toDataURL: jest.fn().mockReturnValue()
            };
            window.document.createElement = jest
                .fn()
                .mockReturnValue(mockCanvas);

            const data = { width: 100, height: 200 };
            const mockTransform = jest.fn();
            const options = { test: 'DUMMY-OPTION' };
            const nWorkers = 4;

            result = await victim.applyFilter({
                data,
                transform: mockTransform,
                options,
                nWorkers
            });
        });

        it('should call workerize', () => {
            expect(workerize).toHaveBeenCalledTimes(1);
        });

        it('should context.getImageData as many times as workers + 1', () => {
            expect(mockCtx.getImageData).toHaveBeenCalledTimes(5);
            expect(mockCtx.getImageData).toHaveBeenCalledWith(0, 0, 100, 200);
            expect(mockCtx.getImageData).toHaveBeenCalledWith(0, 50, 100, 50);
            expect(mockCtx.getImageData).toHaveBeenCalledWith(0, 100, 100, 50);
            expect(mockCtx.getImageData).toHaveBeenCalledWith(0, 150, 100, 50);
        });

        it('should call workerize.execute as many times as workers', () => {
            expect(mockExecute).toHaveBeenCalledTimes(4);
            expect(mockExecute).toHaveBeenCalledWith('IMAGE-DATA', 0, 20000, {
                test: 'DUMMY-OPTION'
            });
            expect(mockExecute).toHaveBeenCalledWith('IMAGE-DATA', 1, 20000, {
                test: 'DUMMY-OPTION'
            });
            expect(mockExecute).toHaveBeenCalledWith('IMAGE-DATA', 2, 20000, {
                test: 'DUMMY-OPTION'
            });
            expect(mockExecute).toHaveBeenCalledWith('IMAGE-DATA', 3, 20000, {
                test: 'DUMMY-OPTION'
            });
        });

        it('should context.putImageData as many times as workers + 1', () => {
            expect(mockCtx.putImageData).toHaveBeenCalledTimes(5);
            expect(mockCtx.putImageData).toHaveBeenCalledWith(
                'TEST-IMAGE-DATA',
                0,
                0
            );
            expect(mockCtx.putImageData).toHaveBeenCalledWith(
                'TEST-IMAGE-DATA',
                0,
                50
            );
            expect(mockCtx.putImageData).toHaveBeenCalledWith(
                'TEST-IMAGE-DATA',
                0,
                100
            );
            expect(mockCtx.putImageData).toHaveBeenCalledWith(
                'TEST-IMAGE-DATA',
                0,
                150
            );
        });

        it('should resolve with the output of the last call to getImageData', () => {
            expect(result).toEqual('IMAGE-DATA');
        });
    });
});
