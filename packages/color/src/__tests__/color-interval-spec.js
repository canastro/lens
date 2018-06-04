import ColorInterval from '../color-interval';

describe('color-interval', function() {
    describe('when no match/noMatch is provided', function() {
        it('should create a valid ColorInterval', function() {
            function fn() {
                new ColorInterval({
                    from: { r: 10, g: 10, b: 10 },
                    to: { r: 255, g: 255, b: 255 }
                });
            }

            expect(fn).toThrowError(
                'lens-filter-color:: Invalid ColorInterval => no match or noMatch provided'
            );
        });
    });

    describe('when no from is provided', function() {
        it('should throw error by invalid ColorInterval', function() {
            function fn() {
                new ColorInterval({
                    to: 'DUMMY',
                    match: { r: null, g: null, b: null, a: 0 },
                    noMatch: { r: null, g: null, b: null, a: 255 }
                });
            }

            expect(fn).toThrowError(
                'lens-filter-color:: Invalid ColorInterval'
            );
        });
    });

    describe('when no to is provided', function() {
        it('should throw error by invalid ColorInterval', function() {
            function fn() {
                new ColorInterval({
                    from: 'DUMMY',
                    match: { r: null, g: null, b: null, a: 0 },
                    noMatch: { r: null, g: null, b: null, a: 255 }
                });
            }

            expect(fn).toThrowError(
                'lens-filter-color:: Invalid ColorInterval'
            );
        });
    });

    describe('when red color is invalid', function() {
        describe('when from is undefined', function() {
            it('should throw error by invalid Color red', function() {
                function fn() {
                    new ColorInterval({
                        from: {},
                        to: { r: 255 },
                        match: { r: null, g: null, b: null, a: 0 },
                        noMatch: { r: null, g: null, b: null, a: 255 }
                    });
                }

                expect(fn).toThrowError(
                    'lens-filter-color:: Invalid ColorInterval => red color'
                );
            });
        });

        describe('when to is undefined', function() {
            it('should throw error by invalid Color red', function() {
                function fn() {
                    new ColorInterval({
                        from: { r: 255 },
                        to: {},
                        match: { r: null, g: null, b: null, a: 0 },
                        noMatch: { r: null, g: null, b: null, a: 255 }
                    });
                }

                expect(fn).toThrowError(
                    'lens-filter-color:: Invalid ColorInterval => red color'
                );
            });
        });

        describe('when from is bigger then to', function() {
            it('should throw error by invalid Color red', function() {
                function fn() {
                    new ColorInterval({
                        from: { r: 255 },
                        to: { r: 200 },
                        match: { r: null, g: null, b: null, a: 0 },
                        noMatch: { r: null, g: null, b: null, a: 255 }
                    });
                }

                expect(fn).toThrowError(
                    'lens-filter-color:: Invalid ColorInterval => red color'
                );
            });
        });
    });

    describe('when green color is invalid', function() {
        describe('when from is undefined', function() {
            it('should throw error by invalid Color green', function() {
                function fn() {
                    new ColorInterval({
                        from: { r: 10 },
                        to: { r: 255, g: 255 },
                        match: { r: null, g: null, b: null, a: 0 },
                        noMatch: { r: null, g: null, b: null, a: 255 }
                    });
                }

                expect(fn).toThrowError(
                    'lens-filter-color:: Invalid ColorInterval => green color'
                );
            });
        });

        describe('when to is undefined', function() {
            it('should throw error by invalid Color green', function() {
                function fn() {
                    new ColorInterval({
                        from: { r: 10, g: 255 },
                        to: { r: 255 },
                        match: { r: null, g: null, b: null, a: 0 },
                        noMatch: { r: null, g: null, b: null, a: 255 }
                    });
                }

                expect(fn).toThrowError(
                    'lens-filter-color:: Invalid ColorInterval => green color'
                );
            });
        });

        describe('when from is bigger then to', function() {
            it('should throw error by invalid Color green', function() {
                function fn() {
                    new ColorInterval({
                        from: { r: 10, g: 255 },
                        to: { r: 255, g: 200 },
                        match: { r: null, g: null, b: null, a: 0 },
                        noMatch: { r: null, g: null, b: null, a: 255 }
                    });
                }

                expect(fn).toThrowError(
                    'lens-filter-color:: Invalid ColorInterval => green color'
                );
            });
        });
    });

    describe('when blue color is invalid', function() {
        describe('when from is undefined', function() {
            it('should throw error by invalid Color blue', function() {
                function fn() {
                    new ColorInterval({
                        from: { r: 10, g: 10 },
                        to: { r: 255, g: 255, b: 255 },
                        match: { r: null, g: null, b: null, a: 0 },
                        noMatch: { r: null, g: null, b: null, a: 255 }
                    });
                }

                expect(fn).toThrowError(
                    'lens-filter-color:: Invalid ColorInterval => blue color'
                );
            });
        });

        describe('when to is undefined', function() {
            it('should throw error by invalid Color blue', function() {
                function fn() {
                    new ColorInterval({
                        from: { r: 10, g: 10, b: 255 },
                        to: { r: 255, g: 255 },
                        match: { r: null, g: null, b: null, a: 0 },
                        noMatch: { r: null, g: null, b: null, a: 255 }
                    });
                }

                expect(fn).toThrowError(
                    'lens-filter-color:: Invalid ColorInterval => blue color'
                );
            });
        });

        describe('when from is bigger then to', function() {
            it('should throw error by invalid Color blue', function() {
                function fn() {
                    new ColorInterval({
                        from: { r: 10, g: 10, b: 255 },
                        to: { r: 255, g: 255, b: 200 },
                        match: { r: null, g: null, b: null, a: 0 },
                        noMatch: { r: null, g: null, b: null, a: 255 }
                    });
                }

                expect(fn).toThrowError(
                    'lens-filter-color:: Invalid ColorInterval => blue color'
                );
            });
        });
    });

    describe('when is valid', function() {
        it('should create a valid ColorInterval', function() {
            var colorInterval = new ColorInterval({
                from: { r: 10, g: 10, b: 10 },
                to: { r: 255, g: 255, b: 255 },
                match: { r: null, g: null, b: null, a: 0 },
                noMatch: { r: null, g: null, b: null, a: 255 }
            });

            expect(colorInterval instanceof ColorInterval).toEqual(true);
        });
    });
});
