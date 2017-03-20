# html-parser
Simple HTML to JSON parser use Regexp and String.indexOf

## Basic usage

```javascript

var html = "<div style='height:10rpx;width: 20rpx;'>1<p>2<br/><a href='http://www.baidu.com'>3</a></p><p>2</p></div>"
htmlParser(html)

```
### Output
```javascript

{
  "tag": "root",
  "children": [{
    "type": "Element",
    "tagName": "div",
    "attributes": {
      "style": "height:10rpx;width: 20rpx;"
    },
    "children": [{
      "type": "text",
      "content": "1"
    }, {
      "type": "Element",
      "tagName": "p",
      "attributes": {},
      "children": [{
        "type": "text",
        "content": "2"
      }, {
        "type": "Element",
        "tagName": "br"
      }, {
        "type": "Element",
        "tagName": "a",
        "attributes": {
          "href": "http://www.baidu.com"
        },
        "children": [{
          "type": "text",
          "content": "3"
        }]
      }]
    }, {
      "type": "Element",
      "tagName": "p",
      "attributes": {},
      "children": [{
        "type": "text",
        "content": "2"
      }]
    }]
  }]
}
```
