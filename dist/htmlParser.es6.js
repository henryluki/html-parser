'use strict';

const STARTTAG_REX = /^<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/;
const ENDTAG_REX = /^<\/([-A-Za-z0-9_]+)[^>]*>/;
const ATTR_REX = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;

function makeMap(str) {
  return str.split(",").reduce((map, cur) => {
    map[cur] = true;
    return map
  }, {})
}
const EMPTY_MAKER = makeMap("area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr");
const FILLATTRS_MAKER = makeMap("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected");

function isEmptyMaker(tag){
  return !!EMPTY_MAKER[tag]
}

function isFillattrsMaker(attr){
  return !!FILLATTRS_MAKER[attr]
}

class TagStart {
  constructor(name, tag){
    this.name = name;
    this.attributes = this.getAttributes(tag);
  }
  getAttributes(str) {
    let attrsMap = {};
    str.replace(ATTR_REX, function(match, name){
      const args = Array.prototype.slice.call(arguments);
      const value = args[2] ? args[2] :
        args[3] ? args[3] :
        args[4] ? args[4] :
        isFillattrsMaker(name) ? name : "";

      attrsMap[name] = value.replace(/(^|[^\\])"/g, '$1\\\"');
    });
    return attrsMap
  }
}

class TagEmpty extends TagStart {
  constructor(name, tag){
    super(name, tag);
  }
}

class TagEnd {
  constructor(name) {
    this.name = name;
  }
}

class Text {
  constructor(text) {
    this.text = text;
  }
}

const ElEMENT_TYPE = "Element";
const TEXT_TYPE = "Text";

function createElement(token){
  const tagName = token.name;
  const attributes = token.attributes;
  if (token instanceof TagEmpty) {
    return {
      type: ElEMENT_TYPE,
      tagName,
      attributes
    }
  }
  return {
    type: ElEMENT_TYPE,
    tagName,
    attributes,
    children: []
  }
}

function createText(token){
  const content = token.text;
  return {
    type: TEXT_TYPE,
    content
  }
}

function createNodeFactory(type, token){
  switch(type){
    case ElEMENT_TYPE: return createElement(token)
    case TEXT_TYPE: return createText(token)
    default: break
  }
}

function parse(tokens) {
  let root = {
    tag: "root",
    children: []
  };
  let tagArray = [root];
  tagArray.last = () => tagArray[tagArray.length - 1];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token instanceof TagStart) {
      const node = createNodeFactory(ElEMENT_TYPE, token);
      if (node.children) {
        tagArray.push(node);
      } else {
        tagArray.last().children.push(node);
      }
      continue
    }
    if (token instanceof TagEnd) {
      let parent = tagArray[tagArray.length - 2];
      let node = tagArray.pop();
      parent.children.push(node);
      continue
    }
    if (token instanceof Text) {
      tagArray.last().children.push(createNodeFactory(TEXT_TYPE, token));
      continue
    }
  }

  return root
}

function tokenize(html) {
  let string = html;
  let tokens = [];
  const maxTime = Date.now() + 1000;

  while (string) {
    if (string.indexOf("<!--") === 0) {
      const lastIndex = string.indexOf("-->") + 3;
      string = string.substring(lastIndex);
      continue
    }
    if (string.indexOf("</") === 0) {
      const match = string.match(ENDTAG_REX);
      if (!match) continue
      string = string.substring(match[0].length);
      const name = match[1];
      if (isEmptyMaker(name)) continue

      tokens.push(new TagEnd(name));
      continue
    }
    if (string.indexOf("<") === 0) {
      const match = string.match(STARTTAG_REX);
      if (!match) continue
      string = string.substring(match[0].length);
      const name = match[1];
      const attrs = match[2];
      const token = isEmptyMaker(name) ? new TagEmpty(name, attrs) : new TagStart(name, attrs);

      tokens.push(token);
      continue
    }

    const index = string.indexOf('<');
    const text = index < 0 ? string : string.substring(0, index);

    string = index < 0 ? "" : string.substring(index);
    tokens.push(new Text(text));

    if (Date.now() >= maxTime) break
  }
  return tokens
}

function htmlParser(html) {
  return parse(tokenize(html))
}

module.exports = htmlParser;
