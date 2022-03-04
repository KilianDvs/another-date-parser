type options = {
	object: "strict" | "default"
}

export default function getType(
	val: any,
	options: options = { object: "default" }
) {
	if (Array.isArray(val)) {
		// the value is an array
		let types: any[] = []
		val.forEach((row) => {
			types.push(getType(row, options))
		})
		let typesUnique = [...new Set(types)].sort()
		return typesUnique
	} else {
		if (options.object === "strict") {
			if (typeof val === "object") {
				return getObjectType(val, options)
			}
			return typeof val
		} else {
			return typeof val
		}
	}
}

function getObjectType(
	o: any,
	options: options = { object: "default" }
): string {
	if (o === null) {
		return "null"
	} else {
		let oType: any = {}
		for (let k in o) {
			oType[k] = getType(o[k], options)
		}
		return oType
	}
}
