import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';

import pkg from './package.json';

export default {
    input: 'src/index.js',
    output: {
        name: 'lensFilterBrightness',
        file: pkg.main,
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
        uglify()
    ]
};
