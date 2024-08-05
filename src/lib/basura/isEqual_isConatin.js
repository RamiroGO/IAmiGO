
function isEqual(value1, value2) {
    // Comparar tipos
    if (typeof value1 !== typeof value2) return false;

    // Comparar arrays
    if (Array.isArray(value1) && Array.isArray(value2)) {
        if (value1.length !== value2.length) return false;
        for (let i = 0; i < value1.length; i++) {
            if (!isEqual(value1[i], value2[i])) return false;
        }
        return true;
    }

    // Si uno es array y el otro no
    if (Array.isArray(value1) !== Array.isArray(value2)) return false;

    // Comparar objetos
    if (typeof value1 === 'object' && value1 !== null && value2 !== null) {
        const keys1 = Object.keys(value1);
        const keys2 = Object.keys(value2);
        if (keys1.length !== keys2.length) return false;
        for (let key of keys1) {
            if (!isEqual(value1[key], value2[key])) return false;
        }
        return true;
    }

    // Comparar valores primitivos y casos especiales
    return value1 === value2;
}

function isContain(list_value, value) {
    let is_exist = false, scan_listValue, scan_value;
    if (typeof (value) != "object") {
        // - Recorrer la lista de tags ya insertada por el usuario
        for (scan_listValue = 0; scan_listValue != list_value.length && !is_exist; scan_listValue++)
            if (isEqual(list_value[scan_listValue], value))
                is_exist = true;
    }
    else {
        for (scan_listValue = 0; scan_listValue != list_value.length && !is_exist; scan_listValue++) {
            if (isEqual(list_value[scan_listValue], value)) {
                for (scan_value = 0; scan_value != value.length; scan_value++) {
                    const element = value[scan_value];
                    if (isEqual(list_value[scan_listValue], value))
                        is_exist = true;
                }
            }
        }
    }

    return is_exist;
}