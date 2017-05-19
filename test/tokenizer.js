import { tokenize } from '../src/tokenizer/index'
import { TagStart, TagEmpty, TagEnd, Text } from '../src/tokenizer/types'
import test from 'ava'

test('tokenize() should return tokens', t => {
  const html = "<div>a</div>"
  const tokens = tokenize(html)

  t.true(tokens.length == 3)
  t.true(tokens[0] instanceof TagStart)
  t.true(tokens[1] instanceof Text)
  t.true(tokens[2] instanceof TagEnd)

})

test('a instanceof TagStart should have property: name, attributes', t=> {
  const tag = new TagStart("div", "href='' style='width:100px'")
  const obj = {
    name: "div",
    attributes: {
      href: '',
      style: 'width:100px'
    }
  }

  t.deepEqual(tag.name, obj.name)
  t.deepEqual(tag.attributes, obj.attributes)
})

test('a instanceof TagEmpty should have property: name, attributes', t=> {
  const tag = new TagEmpty("div", "href='' style='width:100px'")
  const obj = {
    name: "div",
    attributes: {
      href: '',
      style: 'width:100px'
    }
  }
  t.deepEqual(tag.name, obj.name)
  t.deepEqual(tag.attributes, obj.attributes)
})

test('a instanceof TagEnd should have property: name', t=> {
  t.deepEqual(new TagEnd("div").name, "div")

})

test('a instanceof Text should have property: text', t=> {
  t.deepEqual(new Text("aaa").text, "aaa")
})