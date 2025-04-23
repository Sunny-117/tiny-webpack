import { resolve } from 'path';
import { bundle } from '../lib/index.js';

// https://stackoverflow.com/questions/46745014/alternative-for-dirname-in-node-js-when-using-es6-modules
const __dirname = import.meta.dirname;
const input = resolve(__dirname, './src/index.js');
const output = resolve(__dirname, './dist/bundle.js');
bundle(input, output)
