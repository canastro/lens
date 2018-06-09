import LensChainable from '../src/index';

window.onload = function() {
    new LensChainable({ url: 'dummy.jpg' })
        .brightness({ level: 10 })
        .colorize({ color: '#000000', level: 50 })
        .sepia()
        .append('#target-1');

    new LensChainable({ url: 'dummy.jpg' })
        .brightness({ level: 50 })
        .colorize({ color: '#000000', level: 50 })
        .sepia()
        .append('#target-2');
};
