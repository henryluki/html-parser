import { ATTR_REX } from './regexp'
import { isFillattrsMaker } from './makers'

export class TagStart {
  constructor(name, tag){
    this.name = name
    this.attributes = this.getAttributes(tag)
  }
  getAttributes(str) {
    let attrsMap = {}
    str.replace(ATTR_REX, function(match, name){
      const args = Array.prototype.slice.call(arguments)
      const value = args[2] ? args[2] :
        args[3] ? args[3] :
        args[4] ? args[4] :
        isFillattrsMaker(name) ? name : ""

      attrsMap[name] = value.replace(/(^|[^\\])"/g, '$1\\\"')
    })
    return attrsMap
  }
}

export class TagEmpty extends TagStart {
  constructor(name, tag){
    super(name, tag)
  }
}

export class TagEnd {
  constructor(name) {
    this.name = name
  }
}

export class Text {
  constructor(text) {
    this.text = text
  }
}