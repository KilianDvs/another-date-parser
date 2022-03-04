export function parseType(type) {
    if (type.endsWith("[]") && !type.startsWith("(")) {
        return [type.replace("[", "").replace("]", "")];
    }
    let typesArray = [];
    let regex = /^(\()(.+)(\)\[\])$/;
    if (!type.match(regex)) {
        if (type.includes("{") && type.includes("}")) {
            type = type.replace("{", "").replace("}", "");
            return Object.fromEntries(type.split(",").map((entry) => entry.split(":")));
        }
        else
            return type;
    }
    else {
        let captured = type.match(regex)[2];
        let join = false;
        let subGroup = [];
        captured.split("|").forEach((val) => {
            if (!val.startsWith("(") && !join)
                typesArray.push(val);
            else {
                join = true;
                subGroup.push(val);
            }
        });
        let subGroupJoined = subGroup.join("|");
        if (subGroupJoined)
            typesArray.push(parseType(subGroupJoined));
        typesArray.forEach((val, index) => {
            if (val.includes("{") && val.includes("}")) {
                val = val.replace("{", "").replace("}", "");
                typesArray[index] = Object.fromEntries(val.split(",").map((entry) => entry.split(":")));
            }
        });
        return typesArray.sort();
    }
}
export function parseTypeForString(type) {
    let parsedType;
    if (typeof type !== "string") {
        type = JSON.stringify(type);
        parsedType = JSON.parse(type);
    }
    else
        parsedType = type;
    if (Array.isArray(parsedType)) {
        if (parsedType.length === 1)
            return `${parsedType
                .map((row) => parseTypeForString(row))
                .sort()
                .join("|")}[]`;
        else
            return `(${parsedType
                .map((row) => parseTypeForString(row))
                .sort()
                .join("|")})[]`;
    }
    else {
        if (typeof parsedType === "object" && parsedType) {
            return JSON.stringify(parsedType).replaceAll('"', "");
        }
        else {
            return parsedType;
        }
    }
}
