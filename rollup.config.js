import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

const isProduction = process.env.NODE_ENV === 'production'

export default {
  entry: 'src/index.js',
  moduleName: "htmlParser",
  format: 'umd',
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**'
    }),
    ( isProduction && uglify())
  ],
  dest: isProduction ? 'dist/htmlParser.min.js' : 'dist/htmlParser.js'
};