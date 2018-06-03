import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';

export default [
    // browser-friendly UMD build
    {
        input: 'sandbox/sandbox.js',
        output: {
            name: 'sandbox',
            file: 'sandbox/bundle.js',
            format: 'umd',
            sourcemap: true
        },
        plugins: [
            resolve(), // so Rollup can find `ms`
            commonjs(), // so Rollup can convert `ms` to an ES module
            babel({ exclude: ['node_modules/**'] }),
            serve('sandbox')
        ]
    }
];
