const sinon = require('sinon');
const expect = require('chai').expect;
const imageFilterCore = require('image-filter-core');
const imageFilterColorize = require('../src/index');

describe('index', function() {
    var sandbox;
    var canvas;
    var ctx;

    beforeEach(function() {
        // Create a sandbox for the test
        sandbox = sinon.sandbox.create();
    });

    afterEach(function() {
        // Restore all the things made through the sandbox
        sandbox.restore();
    });

    beforeEach(function() {
        ctx = {
            getImageData: sandbox.stub(),
            putImageData: sandbox.stub()
        };

        canvas = {
            width: 100,
            height: 150,
            getContext: sandbox.stub().returns(ctx)
        };

        sandbox.stub(imageFilterCore, 'getCanvas').returns(canvas);
    });

    context('when no data is provided', function () {
        it('should throw error by missing parameters', function () {
            function fn() {
                imageFilterColorize();
            };

            expect(fn).to.throw(/image-filter-colorize:: invalid options provided/);
        });
    });


    context('when no options are provided', function () {
        it('should throw error by missing parameters', function () {
            function fn() {
                imageFilterColorize({});
            };

            expect(fn).to.throw(/image-filter-colorize:: invalid options provided/);
        });
    });

    context('when no color is provided', function () {
        it('should throw error by missing parameters', function () {
            function fn() {
                imageFilterColorize({}, {});
            };

            expect(fn).to.throw(/image-filter-colorize:: invalid options provided/);
        });
    });

    context('when no level is provided', function () {
        it('should throw error by missing parameters', function () {
            function fn() {
                imageFilterColorize({}, { color: 'DUMMY' });
            };

            expect(fn).to.throw(/image-filter-colorize:: invalid options provided/);
        });
    });

    context('when all required parameters are provided', function () {
        it('should apply transformation and return as imageData', function (done) {
            var imageData = {
                data: [193, 219, 242, 255]
            };

            sandbox.stub(imageFilterCore, 'apply', function () { return Promise.resolve(); });

            imageFilterColorize(imageData, { color: '#000000', level: 50 }, 4)
                .then(function (result) {
                    expect(imageFilterCore.apply.calledOnce).to.equal(true);
                    done();
                });
        });
    });
});
