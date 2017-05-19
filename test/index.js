import htmlParser from '../src/index'
import test from 'ava'

test('should pass the Hello World case', t=> {
  const html = "<div>hello world</div>"
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
  t.deepEqual(htmlParser(html), tree)
})

test('should pass the attributes case',  t=> {
  const html = "<div style='width:100px'>hello world </div>"
  const attributes = {
    style: "width:100px"
  }
  const div = htmlParser(html).children[0]
  t.deepEqual(div.attributes, attributes)
})

test('should pass the empty tag case', t=> {
  const html = "<div><br/></div>"
  const div = htmlParser(html).children[0]
  const br = {
    type: "Element",
    tagName: "br",
    attributes: {}
  }
  t.deepEqual(div.children[0], br)
})

test('should pass the comment case', t=> {
  const html = "<div><!-- hahha--></div>"
  const div = htmlParser(html).children[0]
  t.deepEqual(div.children.length, 0)
})

test('should pass the nested element case', t=> {
  const html = "<div>a<p>b<span>c</span></p></div>"
  const tree = {
    tag: "root",
    children: [{
      type: "Element",
      tagName: "div",
      attributes: {},
      children: [{
        type: "Text",
        content: "a"
      }, {
        type: "Element",
        tagName: "p",
        attributes: {},
        children: [{
          type: "Text",
          content: "b"
        }, {
          type: "Element",
          tagName: "span",
          attributes: {},
          children: [{
            type: "Text",
            content: "c"
          }]
        }]
      }]
    }]
  }
  t.deepEqual(htmlParser(html), tree)
})