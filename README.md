# html-parser
Simple HTML to JSON parser use Regexp and String.indexOf

## Update
微信建议nodes属性绑定数组，所以htmlParse(html)返回值改成数组
旧版本输出属性名根据微信文档改变：
微信文档地址： https://mp.weixin.qq.com/debug/wxadoc/dev/component/rich-text.html
```
"tag":"root" => "name": "div"
"type": "Element" || "Text" => type: "node" || "text"
"attributes": {} => attrs: {"class": "parse-*"} // 增加默认class（parse-div,parse-img, parse-a...），可外部修改转换后元素的样式
"content": "content..." => "text": "text..." // 文本节点内容
```

## Install

```shell
npm install htmlstr-parser

```
## Basic usage

```javascript
import htmlParser from "htmlParser"
data: {
 nodes: []
}

var html = "<div style='height:10rpx;width: 20rpx;'>1<p>2<br/><a href='http://www.baidu.com'>3</a></p><p>2</p></div>"
this.setData({
  nodes: htmlParser(this.data.html)
})

```
```wxml
<rich-text class="rich-text" nodes="{{nodes}}"></rich-text>
```
### Output
```javascript

[{
  "name": "div",
  "children": [{
    "type": "node",
    "name": "div",
    "attrs": {
      "class": "parse-div",
      "style": "height:10rpx;width: 20rpx;"
    },
    "children": [{
      "type": "text",
      "text": "1"
    }, {
      "type": "node",
      "name": "p",
      "attrs": {"class": "parse-p"},
      "children": [{
        "type": "text",
        "text": "2"
      }, {
        "type": "node",
        "name": "br"
      }, {
        "type": "node",
        "name": "a",
        "attrs": {
	  "class": "parse-a",
          "href": "http://www.baidu.com"
        },
        "children": [{
          "type": "text",
          "text": "3"
        }]
      }]
    }, {
      "type": "node",
      "name": "p",
      "attrs": {"class": "parse-p"},
      "children": [{
        "type": "text",
        "text": "2"
      }]
    }]
  }]
}]
```
