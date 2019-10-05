import resolve from 'rollup-plugin-node-resolve';
import copy from 'rollup-plugin-copy';

export default {
  // If using any exports from a symlinked project, uncomment the following:
  // preserveSymlinks: true,
    input: ['frog-lit.js'],
    output: {
        file: 'dist/index.js',
        format: 'es',
        sourcemap: false
    },
    plugins: [
      resolve(),
      copy({
        targets: [
          {src: 'deploy/*', dest: 'dist'},
          {src: 'images/*', dest: 'dist/images'},
        ]
      })
    ]
};