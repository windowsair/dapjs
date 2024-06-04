import del from 'rollup-plugin-delete';
import eslint from '@rollup/plugin-eslint';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import typescript from 'rollup-plugin-typescript2';
import terser from '@rollup/plugin-terser';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const name = 'DAPjs';
const watch = process.env.ROLLUP_WATCH;

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/dap.umd.js',
            format: 'umd',
            sourcemap: true,
            name
        },
        {
            file: 'dist/dap.esm.js',
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
        nodePolyfills(),
        typescript({
            useTsconfigDeclarationDir: true
        }),
        terser(),
        watch && serve({
            contentBase: '.',
            open: true,
            openPage: '/examples/daplink-flash/web.html',
        }),
        watch && livereload()
    ]
};
