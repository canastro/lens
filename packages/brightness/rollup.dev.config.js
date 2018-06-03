import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';

export default {
    input: 'sandbox/sandbox.js',
    output: {
        name: 'sandbox',
        file: 'sandbox/bundle.js',
        format: 'umd',
        sourcemap: true
    },
    plugins: [
        resolve({ jsnext: true, main: true, browser: true }),
        commonjs(),
        babel({
            externalHelpers: false,
            runtimeHelpers: true,
            exclude: 'node_modules/**'
        }),
        serve('sandbox')
    ]
};
