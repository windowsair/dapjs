import del from 'rollup-plugin-delete';
import commonjs from '@rollup/plugin-commonjs';
import eslint from '@rollup/plugin-eslint';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import fs from 'fs/promises';

const name = 'DAPjs';
const pkg = JSON.parse(await fs.readFile('./package.json'));
const nodeEsmPath = pkg['exports']['.']['import'];
const nodeUmdPath = pkg['exports']['.']['require'];
const browserEsmPath = pkg['exports']['.']['browser'];
const watch = process.env.ROLLUP_WATCH;

export default [{
    /* browser */
    input: 'src/index.ts',
    output: [
        {
            file: browserEsmPath,
            format: 'esm',
            sourcemap: true
        }
    ],
    plugins: [
        !watch && del({
            targets: [
                'dist/*',
                'types/*'
            ]
        }),
        eslint({
            throwOnError: true
        }),
        commonjs(),
        nodeResolve({
            browser: true,
        }),
        nodePolyfills({
        }),
        typescript({
            useTsconfigDeclarationDir: true
        }),
        terser()
    ]
}, {
    /* node */
    input: 'src/index.ts',
    output: [
        {
            file: nodeUmdPath,
            format: 'umd',
            sourcemap: true,
            name
        },
        {
            file: nodeEsmPath,
            format: 'esm',
            sourcemap: true
        }
    ],
    plugins: [
        eslint({
            throwOnError: true
        }),
        commonjs(),
        nodeResolve({
            preferBuiltins: true,
        }),
        // Not poly fills for node runtime
        // nodePolyfills({
        // }),
        typescript({
            useTsconfigDeclarationDir: true
        }),
        terser()
    ]
}];
