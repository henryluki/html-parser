import { TagEmpty } from '../tokenizer/types'

export const ElEMENT_TYPE = "node"
export const TEXT_TYPE = "text"

function createElement(token){
  const name = token.name
  const attrs = token.attrs
  if(attrs['class']){
    attrs['class'] += ' parse-' + name
  } else {
    attrs['class'] = ' parse-' + name
  }
  if (token instanceof TagEmpty) {
    return {
      type: ElEMENT_TYPE,
      name,
      attrs
    }
  }
  return {
    type: ElEMENT_TYPE,
    name,
    attrs,
    children: []
  }
}

function createText(token){
  const text = token.text
  return {
    type: TEXT_TYPE,
    text
  }
}

export function createNodeFactory(type, token){
  switch(type){
    case ElEMENT_TYPE: return createElement(token)
    case TEXT_TYPE: return createText(token)
    default: break
  }
}