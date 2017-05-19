import { parse } from './parser/index'
import { tokenize } from './tokenizer/index'

export default function htmlParser(html) {
  return parse(tokenize(html))
}