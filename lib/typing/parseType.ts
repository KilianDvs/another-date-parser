export function parseType(type: string): any {
	if (type.endsWith("[]") && !type.startsWith("(")) {
		return [type.replace("[", "").replace("]", "")]
	}
	let typesArray: any[] = []
	let regex = /^(\()(.+)(\)\[\])$/
	if (!type.match(regex)) {
		if (type.includes("{") && type.includes("}")) {
			type = type.replace("{", "").replace("}", "")
			return Object.fromEntries(
				type.split(",").map((entry) => entry.split(":"))
			)
		} else return type
	} else {
		let captured = type.match(regex)![2]
		let join: boolean = false
		let subGroup: string[] = []
		captured.split("|").forEach((val: string) => {
			if (!val.startsWith("(") && !join) typesArray.push(val)
			else {
				join = true
				subGroup.push(val)
			}
		})
		let subGroupJoined: string = subGroup.join("|")
		if (subGroupJoined) typesArray.push(parseType(subGroupJoined))
		typesArray.forEach((val: string, index: number) => {
			if (val.includes("{") && val.includes("}")) {
				val = val.replace("{", "").replace("}", "")
				typesArray[index] = Object.fromEntries(
					val.split(",").map((entry) => entry.split(":"))
				)
			}
		})

		return typesArray.sort()
	}
}

export function parseTypeForString(type: any): string {
	let parsedType: any
	if (typeof type !== "string") {
		type = JSON.stringify(type)
		parsedType = JSON.parse(type)
	} else parsedType = type
	if (Array.isArray(parsedType)) {
		if (parsedType.length === 1)
			return `${parsedType
				.map((row) => parseTypeForString(row))
				.sort()
				.join("|")}[]`
		else
			return `(${parsedType
				.map((row) => parseTypeForString(row))
				.sort()
				.join("|")})[]`
	} else {
		if (typeof parsedType === "object" && parsedType) {
			return JSON.stringify(parsedType).replaceAll('"', "")
		} else {
			return parsedType
		}
	}
}
