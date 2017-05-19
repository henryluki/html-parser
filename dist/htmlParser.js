(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.htmlParser = factory());
}(this, (function () { 'use strict';

var STARTTAG_REX = /^<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/;
var ENDTAG_REX = /^<\/([-A-Za-z0-9_]+)[^>]*>/;
var ATTR_REX = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;

function makeMap(str) {
  return str.split(",").reduce(function (map, cur) {
    map[cur] = true;
    return map;
  }, {});
}
var EMPTY_MAKER = makeMap("area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr");
var FILLATTRS_MAKER = makeMap("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected");

function isEmptyMaker(tag) {
  return !!EMPTY_MAKER[tag];
}

function isFillattrsMaker(attr) {
  return !!FILLATTRS_MAKER[attr];
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var TagStart = function () {
  function TagStart(name, tag) {
    classCallCheck(this, TagStart);

    this.name = name;
    this.attributes = this.getAttributes(tag);
  }

  createClass(TagStart, [{
    key: 'getAttributes',
    value: function getAttributes(str) {
      var attrsMap = {};
      str.replace(ATTR_REX, function (match, name) {
        var args = Array.prototype.slice.call(arguments);
        var value = args[2] ? args[2] : args[3] ? args[3] : args[4] ? args[4] : isFillattrsMaker(name) ? name : "";

        attrsMap[name] = value.replace(/(^|[^\\])"/g, '$1\\\"');
      });
      return attrsMap;
    }
  }]);
  return TagStart;
}();

var TagEmpty = function (_TagStart) {
  inherits(TagEmpty, _TagStart);

  function TagEmpty(name, tag) {
    classCallCheck(this, TagEmpty);
    return possibleConstructorReturn(this, (TagEmpty.__proto__ || Object.getPrototypeOf(TagEmpty)).call(this, name, tag));
  }

  return TagEmpty;
}(TagStart);

var TagEnd = function TagEnd(name) {
  classCallCheck(this, TagEnd);

  this.name = name;
};

var Text = function Text(text) {
  classCallCheck(this, Text);

  this.text = text;
};

var ElEMENT_TYPE = "Element";
var TEXT_TYPE = "Text";

function createElement(token) {
  var tagName = token.name;
  var attributes = token.attributes;
  if (token instanceof TagEmpty) {
    return {
      type: ElEMENT_TYPE,
      tagName: tagName,
      attributes: attributes
    };
  }
  return {
    type: ElEMENT_TYPE,
    tagName: tagName,
    attributes: attributes,
    children: []
  };
}

function createText(token) {
  var content = token.text;
  return {
    type: TEXT_TYPE,
    content: content
  };
}

function createNodeFactory(type, token) {
  switch (type) {
    case ElEMENT_TYPE:
      return createElement(token);
    case TEXT_TYPE:
      return createText(token);
    default:
      break;
  }
}

function parse(tokens) {
  var root = {
    tag: "root",
    children: []
  };
  var tagArray = [root];
  tagArray.last = function () {
    return tagArray[tagArray.length - 1];
  };

  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];
    if (token instanceof TagStart) {
      var node = createNodeFactory(ElEMENT_TYPE, token);
      if (node.children) {
        tagArray.push(node);
      } else {
        tagArray.last().children.push(node);
      }
      continue;
    }
    if (token instanceof TagEnd) {
      var parent = tagArray[tagArray.length - 2];
      var _node = tagArray.pop();
      parent.children.push(_node);
      continue;
    }
    if (token instanceof Text) {
      tagArray.last().children.push(createNodeFactory(TEXT_TYPE, token));
      continue;
    }
  }

  return root;
}

function tokenize(html) {
  var string = html;
  var tokens = [];
  var maxTime = Date.now() + 1000;

  while (string) {
    if (string.indexOf("<!--") === 0) {
      var lastIndex = string.indexOf("-->") + 3;
      string = string.substring(lastIndex);
      continue;
    }
    if (string.indexOf("</") === 0) {
      var match = string.match(ENDTAG_REX);
      if (!match) continue;
      string = string.substring(match[0].length);
      var name = match[1];
      if (isEmptyMaker(name)) continue;

      tokens.push(new TagEnd(name));
      continue;
    }
    if (string.indexOf("<") === 0) {
      var _match = string.match(STARTTAG_REX);
      if (!_match) continue;
      string = string.substring(_match[0].length);
      var _name = _match[1];
      var attrs = _match[2];
      var token = isEmptyMaker(_name) ? new TagEmpty(_name, attrs) : new TagStart(_name, attrs);

      tokens.push(token);
      continue;
    }

    var index = string.indexOf('<');
    var text = index < 0 ? string : string.substring(0, index);

    string = index < 0 ? "" : string.substring(index);
    tokens.push(new Text(text));

    if (Date.now() >= maxTime) break;
  }
  return tokens;
}

function htmlParser(html) {
  return parse(tokenize(html));
}

return htmlParser;

})));
