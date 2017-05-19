import { parse } from '../src/parser/index'
import { ElEMENT_TYPE, TEXT_TYPE, createNodeFactory } from '../src/parser/nodes'
import { tokenize } from '../src/tokenizer/index'
import { TagStart, TagEmpty, Text } from '../src/tokenizer/types'
import test from 'ava'

test('parse() should return json tree', t => {
  const html = "<div>hello world</div>"
  const tokens = tokenize(html)
  const tree = {
    tag: "root",
    children: [{
      type: "Element",
      tagName: "div",
      attributes: {},
      children: [{
        type: "Text",
        content: "hello world"
      }]
    }]
  }

  t.deepEqual(parse(tokens), tree)
})

test("createNodeFactory() should return different nodes", t => {
  t.deepEqual(createNodeFactory(ElEMENT_TYPE, new TagStart("div", "style='width:100px'")), {
    type: ElEMENT_TYPE,
    tagName: "div",
    attributes: {
      style: "width:100px"
    },
    children: []
  })

  t.deepEqual(createNodeFactory(ElEMENT_TYPE, new TagEmpty("div", "style='width:100px'")), {
    type: ElEMENT_TYPE,
    tagName: "div",
    attributes: {
      style: "width:100px"
    },
  })

  t.deepEqual(createNodeFactory(TEXT_TYPE, new Text("aaa")), {
    type: TEXT_TYPE,
    content: "aaa"
  })
})