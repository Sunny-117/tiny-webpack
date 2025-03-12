import type { Compiler } from '../Compiler'
import type { JsPackOptions } from '..'
import { EntryOptionPlugin } from './EntryOptionPlugin'

/**
 * mount inner plugins
 * 挂载内部插件
 */
export class JsPackOptionsApply {
  constructor() {}
  process(options: JsPackOptions, compiler: Compiler) {
    new EntryOptionPlugin().apply(compiler)
    compiler.hooks.entryOption.call(options.context, options.entry)
  }
}
