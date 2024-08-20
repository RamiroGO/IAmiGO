import { copy_data, make_array_empty } from "./tool_json.js";
import { getConsecutiveMatches } from "./tool_json.js";

/**
 * Compara dos valores para determinar si son profundamente iguales.
 * 
 * @param {any} value1 - El primer valor a comparar.
 * @param {any} value2 - El segundo valor a comparar.
 * @returns {boolean} - Retorna true si los valores son iguales, false en caso contrario.
 */
function isEqual(value1, value2) {
    // Compara tipos directamente
    if (typeof value1 !== typeof value2) return false;

    // Compara arrays
    if (Array.isArray(value1) && Array.isArray(value2)) {
        if (value1.length !== value2.length)
            return false;
        else
            return value1.every((element, idx) => isEqual(element, value2[idx]));
    }

    // Si uno es array y el otro no
    if (Array.isArray(value1) !== Array.isArray(value2)) return false;

    // Compara objetos
    if (typeof value1 === 'object' && value1 !== null && value2 !== null) {
        const keys1 = Object.keys(value1);
        const keys2 = Object.keys(value2);
        if (keys1.length !== keys2.length)
            return false;
        else
            return keys1.every(key => isEqual(value1[key], value2[key]));
    }

    // Compara valores primitivos
    return value1 === value2;
}

/**
 * Verifica si un valor está contenido en una lista usando una comparación profunda.
 * 
 * @param {Array} list_value - La lista en la que se buscará el valor.
 * @param {any} value - El valor a buscar en la lista.
 * @returns {boolean} - Retorna true si el valor está contenido en la lista, false en caso contrario.
 */
function isContain(list_value, value) {
    // Usa el método some para verificar si algún elemento en list_value es igual a value
    return list_value.some(item => isEqual(item, value));
}

function getIndex(list_value, value) {
    let result = -1, scan_list_value = 0, isFound = false;
    do
        if (isEqual(list_value[scan_list_value], value)) {
            result = scan_list_value;
            isFound = true;
        }
        else
            scan_list_value++;
    while (scan_list_value != list_value.length && !isFound);

    return result;
}

/**
 * Eliminar el elemento _value de la lista _array
 * @param {Array} _array array para filtrar
 * @param {string} _value elemento a eliminar
 * */
function delElementArray(_array, _value) {
    let new_array = [];
    _array.forEach(element => {
        if (element != _value)
            new_array.push(element);
    });
    return new_array;
}

function append_register(register = [{ value: 0, soul: { keys: [], level: 0 } }], element, fcn_compare = (value1, value2) => isEqual(value1, value2)) {
    // Si no existía previamente => Añadir
    let scan_register_soul = 0, isBusy = true, isFound = false;
    if (register.length != 0)
        while (isBusy) {
            // 
            if (fcn_compare(register[scan_register_soul], element)) {
                isFound = true;
                isBusy = false;
            }
            else if (scan_register_soul == register.length - 1)
                isBusy = false;
            else scan_register_soul++;
        }

    if (!isFound)
        register.push(element);

    return register;
}

export { isContain, delElementArray, isEqual, getIndex, append_register }
