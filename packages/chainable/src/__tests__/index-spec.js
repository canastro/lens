import Chainable from '../index';
import * as utils from '../utils';

import core from 'lens-core';
import brightness from 'lens-filter-brightness';
import sepia from 'lens-filter-sepia';

jest.mock('lens-core');
jest.mock('lens-filter-brightness');
jest.mock('lens-filter-sepia');
jest.mock('../utils');

let mockCanvas;
let mockGetContext;
let mockContext;
let mockElement;

beforeEach(() => {
    mockContext = { drawImage: jest.fn(), getImageData: jest.fn() };
    mockGetContext = jest.fn().mockReturnValue(mockContext);

    mockCanvas = { getContext: mockGetContext };
    core.getCanvas = jest.fn().mockReturnValue(mockCanvas);
    core.convertImageDataToCanvasURL = jest
        .fn()
        .mockReturnValue('CONVERT-IMAGE-DATA');

    mockElement = {
        appendChild: jest.fn(),
        setAttribute: jest.fn(),
        width: 'DUMMY-WIDTH',
        height: 'DUMMY-HEIGHT'
    };
    global.document.createElement = jest.fn().mockReturnValue(mockElement);

    utils.getDomElement = jest.fn().mockReturnValue(mockElement);
    utils.getPixelsFromImage = jest
        .fn()
        .mockReturnValue('GET-PIXELS-FROM-IMAGE');
});

describe('constructor', () => {
    describe('when no options are provided', () => {
        it('should throw error', () => {
            expect(() => new Chainable()).toThrow(
                'lens-chainable:: invalid options object'
            );
        });
    });

    describe('when url is provided', () => {
        let lensChainable;
        beforeEach(() => {
            lensChainable = new Chainable({ url: 'dummy.jpg' });
        });

        it('should create a img element and set the src', () => {
            expect(global.document.createElement).toHaveBeenCalledWith('img');
            expect(mockElement.setAttribute).toHaveBeenCalledWith(
                'src',
                'dummy.jpg'
            );
        });

        it('should call getCanvas', () => {
            expect(core.getCanvas).toHaveBeenCalledWith(
                'DUMMY-WIDTH',
                'DUMMY-HEIGHT'
            );
        });

        it('should call canvas.getContext', () => {
            expect(mockGetContext).toHaveBeenCalledWith('2d');
        });

        it('should call getPixelsFromImage', () => {
            expect(utils.getPixelsFromImage).toHaveBeenCalledWith(
                mockCanvas,
                mockContext,
                mockElement
            );
        });

        it('should set data', () => {
            expect(lensChainable.data).toEqual('GET-PIXELS-FROM-IMAGE');
        });
    });

    describe('when data is provided', () => {
        let lensChainable;
        beforeEach(() => {
            lensChainable = new Chainable({ data: 'DUMMY-DATA' });
        });

        it('should set data', () => {
            expect(lensChainable.data).toEqual('DUMMY-DATA');
        });
    });

    describe('when from is provided', () => {
        let lensChainable;
        beforeEach(() => {
            lensChainable = new Chainable({ from: '#dummy' });
        });

        it('should call getDomElement', () => {
            expect(utils.getDomElement).toHaveBeenCalledWith('#dummy');
        });

        it('should call getCanvas', () => {
            expect(core.getCanvas).toHaveBeenCalledWith(
                'DUMMY-WIDTH',
                'DUMMY-HEIGHT'
            );
        });

        it('should call canvas.getContext', () => {
            expect(mockGetContext).toHaveBeenCalledWith('2d');
        });

        it('should call getPixelsFromImage', () => {
            expect(utils.getPixelsFromImage).toHaveBeenCalledWith(
                mockCanvas,
                mockContext,
                mockElement
            );
        });

        it('should set data', () => {
            expect(lensChainable.data).toEqual('GET-PIXELS-FROM-IMAGE');
        });
    });
});

describe('#<filter>()', () => {
    let lensChainable;
    let result;

    beforeEach(() => {
        lensChainable = new Chainable({ from: '#dummy' });
        result = lensChainable.brightness({ adjustment: 50 });
    });

    it('should add filter', () => {
        expect(lensChainable.filters).toEqual([
            { filter: 'brightness', options: { adjustment: 50 } }
        ]);
    });

    it('should return the instance', () => {
        expect(result).toEqual(lensChainable);
    });
});

describe('#applyFilters()', () => {
    let lensChainable;
    let result;

    beforeEach(() => {
        sepia.mockImplementation(() => 'DUMMY-SEPIA-DATA');
        brightness.mockImplementation(() => 'DUMMY-BRIGHTNESS-DATA');

        lensChainable = new Chainable({ from: '#dummy', nWorkers: 4 });
        return lensChainable
            .brightness({ adjustment: 50 })
            .sepia()
            .applyFilters()
            .then(data => (result = data));
    });

    it('should have both filters', () => {
        expect(lensChainable.filters).toEqual([
            { filter: 'brightness', options: { adjustment: 50 } },
            { filter: 'sepia' }
        ]);
    });

    it('should call brightness with the initial data', () => {
        expect(brightness).toHaveBeenCalledWith({
            data: 'GET-PIXELS-FROM-IMAGE',
            nWorkers: 4,
            options: { adjustment: 50 }
        });
    });

    it('should call sepia with the data returned from brightness', () => {
        expect(sepia).toHaveBeenCalledWith({
            data: 'DUMMY-BRIGHTNESS-DATA',
            nWorkers: 4,
            options: undefined
        });
    });

    it('should set data with the return from sepia', () => {
        expect(lensChainable.data).toEqual('DUMMY-SEPIA-DATA');
        expect(result).toEqual('DUMMY-SEPIA-DATA');
    });
});

describe('#append()', () => {
    let lensChainable;

    beforeEach(() => {
        sepia.mockImplementation(() => 'DUMMY-SEPIA-DATA');
        brightness.mockImplementation(() => 'DUMMY-BRIGHTNESS-DATA');

        lensChainable = new Chainable({ from: '#dummy', nWorkers: 4 });
        return lensChainable
            .brightness({ adjustment: 50 })
            .sepia()
            .append('#target');
    });

    it('should have both filters', () => {
        expect(lensChainable.filters).toEqual([
            { filter: 'brightness', options: { adjustment: 50 } },
            { filter: 'sepia' }
        ]);
    });

    it('should call brightness with the initial data', () => {
        expect(brightness).toHaveBeenCalledWith({
            data: 'GET-PIXELS-FROM-IMAGE',
            nWorkers: 4,
            options: { adjustment: 50 }
        });
    });

    it('should call sepia with the data returned from brightness', () => {
        expect(sepia).toHaveBeenCalledWith({
            data: 'DUMMY-BRIGHTNESS-DATA',
            nWorkers: 4,
            options: undefined
        });
    });

    it('should set data with the return from sepia', () => {
        expect(lensChainable.data).toEqual('DUMMY-SEPIA-DATA');
    });

    it('should call convertImageDataToCanvasURL', () => {
        expect(core.convertImageDataToCanvasURL).toHaveBeenCalledWith(
            'DUMMY-SEPIA-DATA'
        );
    });

    it('should call appendChild on the target element', () => {
        expect(mockElement.appendChild).toHaveBeenCalledWith(mockElement);
    });
});

describe('#update()', () => {
    let lensChainable;

    beforeEach(() => {
        sepia.mockImplementation(() => 'DUMMY-SEPIA-DATA');
        brightness.mockImplementation(() => 'DUMMY-BRIGHTNESS-DATA');

        lensChainable = new Chainable({ from: '#dummy', nWorkers: 4 });
        return lensChainable
            .brightness({ adjustment: 50 })
            .sepia()
            .update('#target');
    });

    it('should have both filters', () => {
        expect(lensChainable.filters).toEqual([
            { filter: 'brightness', options: { adjustment: 50 } },
            { filter: 'sepia' }
        ]);
    });

    it('should call brightness with the initial data', () => {
        expect(brightness).toHaveBeenCalledWith({
            data: 'GET-PIXELS-FROM-IMAGE',
            nWorkers: 4,
            options: { adjustment: 50 }
        });
    });

    it('should call sepia with the data returned from brightness', () => {
        expect(sepia).toHaveBeenCalledWith({
            data: 'DUMMY-BRIGHTNESS-DATA',
            nWorkers: 4,
            options: undefined
        });
    });

    it('should set data with the return from sepia', () => {
        expect(lensChainable.data).toEqual('DUMMY-SEPIA-DATA');
    });

    it('should call convertImageDataToCanvasURL', () => {
        expect(core.convertImageDataToCanvasURL).toHaveBeenCalledWith(
            'DUMMY-SEPIA-DATA'
        );
    });

    it('should call appendChild on the target element', () => {
        expect(mockElement.setAttribute).toHaveBeenCalledWith(
            'src',
            'CONVERT-IMAGE-DATA'
        );
    });
});

describe('#getDataURL()', () => {
    let result;

    beforeEach(() => {
        const lensChainable = new Chainable({ from: '#dummy', nWorkers: 4 });
        result = lensChainable.getDataURL();
    });

    it('should call convertImageDataToCanvasURL', () => {
        expect(core.convertImageDataToCanvasURL).toHaveBeenCalledWith(
            'GET-PIXELS-FROM-IMAGE'
        );
    });

    it('should return the result of convertImageDataToCanvasURL', () => {
        expect(result).toEqual('CONVERT-IMAGE-DATA');
    });
});
