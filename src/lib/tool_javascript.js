import { copy_data, make_array_empty } from "./tool_json.js";
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

/**
 * Función que convierte una cadena de datos de vuelta en un árbol anidado.
 * @param {Array} chain - Array de objetos con valor y escaneos.
 * @returns {Array} - Árbol reconstruido a partir de la cadena.
 */
function chain2tree(chain = [{ value: [], scans: { level: 0, register: [], scan: [] } }]) {
    let result = [];

    if (Array.isArray(chain)) {
        chain.forEach(element => {
            // Proceso de decidir donde poner el eslabón
            result = insert_element_tree(result, element);
        });
    } else {
        console.error("Solo se aceptan valores de tipo Array, cuyos elementos poseen un formato muy concreto.");
    }

    return result;
}

function insert_element_tree(tree = [], element = { value: [], scans: { level: 0, register: [], scan: [] } }) {
    let
        branch = tree,
        scans = {
            scan: make_array_empty(element.scans.scan.length, 0),
            level: 0,
            isBusy: true
        },
        _key1, _key2;

    while (scans.isBusy) {
        // Dado que en el scans.scan se encuentran valores que se generaron a posteriori de la inserción de los elementos en la cadena,
        // este tiene el defecto de que refleja valores ya incrementados con respecto a la verdadera posición del elemento en cuestión.
        // por ejemplo, el elemento tipo hoja encontrado posee un scans.scan de [1, 1, 3]
        // - Se compara la cantidad de elementos, para validar que se trata de un elemento que contendrá a otros elementos.
        if (element.scans.scan[element.scans.level] == element.value.length) {
            // Hay que llegar al nivel presentado por el elemento
            while (scans.level != element.scans.level) {
                // Depender de "register" para reconstruir las keys del árbol presente.
                _key1 = element.scans.register[scans.level];

                if (!isContain(branch, _key1)) {
                    // Si no existe => Crearlo
                    // Se sabe que el branch es de tipo Array porque las _key son de tio Array
                    if (Array.isArray(_key1)) {
                        branch.push(..._key1);
                        // Para ingresar al branch, se debe realizar una corrección de -1, la cual solo es necesaria para los branch de tipo Array
                        _key2 = element.scans.scan[scans.level] - 1;

                        // Ingresar
                        branch = branch[_key2];

                        // Subir de nivel
                        scans.level++;
                    }
                    else {
                        branch.push(_key1);
                        // Ingresar
                        branch = branch[_key1];

                        // Subir de nivel
                        scans.level++;
                    }
                }
                else {
                    // La key ya existe => Ingresar
                    // Para ingresar al branch, se debe realizar una corrección de -1, la cual solo es necesaria para los branch de tipo Array
                    _key2 = element.scans.scan[scans.level] - 1;

                    // Ingresar
                    branch = branch[_key2];

                    // Subir de nivel
                    scans.level++;
                }
            }
        }
    }

    return tree;
}

/**
 * Función que convierte una matriz de datos anidados en una cadena recorrida con alguna teoría para recorrer un árbol.
 * @param {Array} matriz matriz de datos anidados
 * @param {String} mode establece que se desea en los resultados "branch" y "leaf"
 * @param {Function} callback función que se ejecuta al encontrar cada resultado deseado, implementando los parámetros:
 * * value,
 * * scans:
 * * *   level: int,
 * * *   max: Array,
 * * *   register: Array
 * * *   scan: Array
 * @returns Arra y de los elementos recorridos en el árbol.
 */
function tree2chain(matriz, mode = ["branch", "leaf"], callback = (value, scans) => { }) {
    let
        result = [], branch = matriz, copy_scans,
        scans_max = new Array(0),
        scans = {
            scan: new Array(0),
            level: -1,
            register: []
        };

    if (typeof (mode) == "string")
        mode = mode.split(" ");

    // Diferenciar nodo rama de nodo hoja
    if (Array.isArray(branch)) {
        // Avanzar de nivel
        scans.level++;
        if (scans_max.length < scans.level + 1) {
            scans_max.push(branch.length);
            scans.scan.push(0);
        } else
            scans_max[scans.level] = branch.length;
    }

    while (scans.level != -1) {
        // Proceso de avance en el árbol
        if (scans.scan[scans.level] != scans_max[scans.level]) {
            // Guardar registro
            scans.register.push(branch);
            // Diferenciar nodo rama de nodo hoja
            if (Array.isArray(branch)) {
                // Dar paso adelante
                branch = branch[scans.scan[scans.level]];

                // Marcar como avanzado
                scans.scan[scans.level]++;
                // Avanzar de nivel
                scans.level++;

                // Diferenciar nodo rama de nodo hoja
                if (Array.isArray(branch)) {
                    if (scans.level == scans_max.length) {
                        scans_max.push(branch.length);
                        scans.scan.push(0);
                    } else scans_max[scans.level] = branch.length;
                }
                else {
                    if (scans.level == scans_max.length) {
                        //#region CallBack
                        // Implementar el callback con una copia del scan corregida
                        copy_scans = copy_data(scans);

                        callback(branch, copy_scans);

                        // Guardar nodo hoja
                        if (isContain(mode, "leaf"))
                            result.push({ value: branch, scans: copy_scans });
                        //#endregion

                        // Retroceder
                        scans.level--;
                        branch = scans.register.pop();
                    }
                }
            }
        } else {
            // Implementar el callback con una copia del scan corregida
            copy_scans = copy_data(scans);

            // Implementar el callback
            callback(branch, copy_scans);
            // Diferenciar nodo rama de nodo hoja
            if (Array.isArray(branch) && isContain(mode, "branch"))
                result.push({ value: branch, scans: copy_scans });

            // Reiniciar el conteo por el camino ya recorrido
            scans.scan[scans.level] = 0;

            // Retroceder
            scans.level--;
            branch = scans.register.pop();
        }
    }

    return result;
}

export { tree2chain, chain2tree, isContain, delElementArray }