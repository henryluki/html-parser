function makeMap(str) {
  return str.split(",").reduce((map, cur) => {
    map[cur] = true
    return map
  }, {})
}

const REGEXP = {
  startTag: /^<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/,
  endTag: /^<\/([-A-Za-z0-9_]+)[^>]*>/,
  attr: /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g
}

const MAKER = {
  empty: makeMap("area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr"),
  block: makeMap("a,address,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video"),
  inline: makeMap("abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var"),
  closeSelf: makeMap("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr"),
  fillAttrs: makeMap("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected"),
  special: makeMap("script,style")
}

function getAttributes(str) {
  let attrsMap = {}
  str.replace(REGEXP.attr, function(match, name) {
    const value = arguments[2] ? arguments[2] :
      arguments[3] ? arguments[3] :
      arguments[4] ? arguments[4] :
      MAKER.fillAttrs[name] ? name : ""

    attrsMap[name] = value.replace(/(^|[^\\])"/g, '$1\\\"')
  })
  return attrsMap
}

function lex(html) {
  let string = html
  let tokens = []

  while (string) {
    if (string.indexOf("</") === 0) {
      const match = string.match(REGEXP.endTag)
      if (!match) continue
      string = string.substring(match[0].length)
      tokens.push({
        tag: match[1],
        type: 'tag-end',
      })
      continue
    }
    if (string.indexOf("<") === 0) {
      const match = string.match(REGEXP.startTag)
      if (!match) continue
      string = string.substring(match[0].length)
      const tag = match[1]
      const isEmpty = !!MAKER.empty[tag]
      const type = isEmpty ? 'tag-empty' : 'tag-start'
      const attributes = getAttributes(match[2])

      tokens.push({
        tag,
        type,
        attributes
      })
      continue
    }

    const index = string.indexOf('<')
    const text = index < 0 ? string : string.substring(0, index)

    string = index < 0 ? "" : string.substring(index)
    tokens.push({
      type: "text",
      text
    })
  }
  return tokens
}

function parse(tokens) {
  let root = {
    tag: "root",
    children: []
  }
  let tagArray = [root]
  tagArray.last = () => tagArray[tagArray.length - 1]

  for (var i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    if (token.type === 'tag-start') {
      const node = {
        type: "Element",
        tagName: token.tag,
        attributes: token.attributes,
        children: []
      }
      tagArray.push(node)
      continue
    }
    if (token.type === 'tag-end') {
      let parent = tagArray[tagArray.length - 2]
      let node = tagArray.pop()
      parent.children.push(node)
      continue
    }
    if (token.type === 'text') {
      tagArray.last().children.push({
        type: 'text',
        content: token.text
      })
      continue
    }
    if (token.type === 'tag-empty') {
      tagArray.last().children.push({
        type: "Element",
        tagName: token.tag,
        attributes: token.attributes
      })
      continue
    }
  }
  return root
}

export default function htmlParser(html) {
  return parse(lex(html))
}