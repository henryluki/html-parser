import { TagStart, TagEnd, Text } from '../tokenizer/types'
import { ElEMENT_TYPE, TEXT_TYPE, createNodeFactory } from './nodes'

export function parse(tokens) {
  let root = {
    tag: "root",
    children: []
  }
  let tagArray = [root]
  tagArray.last = () => tagArray[tagArray.length - 1]

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    if (token instanceof TagStart) {
      const node = createNodeFactory(ElEMENT_TYPE, token)
      if (node.children) {
        tagArray.push(node)
      } else {
        tagArray.last().children.push(node)
      }
      continue
    }
    if (token instanceof TagEnd) {
      let parent = tagArray[tagArray.length - 2]
      let node = tagArray.pop()
      parent.children.push(node)
      continue
    }
    if (token instanceof Text) {
      tagArray.last().children.push(createNodeFactory(TEXT_TYPE, token))
      continue
    }
  }

  return root
}