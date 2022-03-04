import { ADP } from "./modules/adp.js"
import getType from "./modules/typing/getType.js"
import { parseType, parseTypeForString } from "./modules/typing/parseType.js"

let obj = ["o", "m", "g"]
let objType = ["string", "string", "number"]

console.log("test result :", new ADP().t(obj, objType))
