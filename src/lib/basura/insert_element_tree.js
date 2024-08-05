/**
 * Función que inserta un elemento en el árbol reconstruido.
 * @param {Array} tree - El árbol en el que se insertará el elemento.
 * @param {Object} element - El elemento a insertar, con valor y escaneos.
 * @returns {Array} - Árbol con el nuevo elemento insertado.
 */
function insert_element_tree(tree = [], element = { value: [], scans: { level: 0, register: [], scan: [] } }) {
    let branch = tree;
    const { value, scans: { level, scan, register } } = element;

    for (let i = 0; i < level; i++) {
        let idx = scan[i];
        if (!branch[idx]) {
            branch[idx] = Array.isArray(register[i]) ? [] : {};
        }
        branch = branch[idx];
    }

    branch[scan[level]] = value;
    return tree;
}
// 
// /**
//  * Función que inserta un elemento en el árbol reconstruido.
//  * @param {Array} tree - El árbol en el que se insertará el elemento.
//  * @param {Object} element - El elemento a insertar, con valor y escaneos.
//  * @returns {Array} - Árbol con el nuevo elemento insertado.
//  */
// function insert_element_tree(tree = [], element = { value: [], scans: { level: 0, register: [], scan: [] } }) {
//     let branch = tree;
//     const scans = {
//         scan: Array(element.scans.scan.length).fill(0),
//         level: 0,
//         isBusy: true
//     };
// 
//     while (scans.isBusy) {
//         // Se compara la cantidad de elementos, para validar que se trata de un elemento que contendrá a otros elementos.
//         if (scans.level < element.scans.level) {
//             const index = element.scans.scan[scans.level];
//             if (branch[index] === undefined) {
//                 branch[index] = [];
//             }
//             branch = branch[index];
//             scans.level++;
//         } else {
//             const index = element.scans.scan[element.scans.level];
//             branch[index] = element.value;
//             scans.isBusy = false;
//         }
//     }
// 
//     return tree;
// }