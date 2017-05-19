function makeMap(str) {
  return str.split(",").reduce((map, cur) => {
    map[cur] = true
    return map
  }, {})
}
export const EMPTY_MAKER = makeMap("area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr")
export const FILLATTRS_MAKER = makeMap("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected")

export function isEmptyMaker(tag){
  return !!EMPTY_MAKER[tag]
}

export function isFillattrsMaker(attr){
  return !!FILLATTRS_MAKER[attr]
}