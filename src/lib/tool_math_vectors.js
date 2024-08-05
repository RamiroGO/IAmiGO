import { tree2chain, chain2tree } from "./tool_javascript.js";

function round_math(coords = [0.0, 0.0]) {
    let result = []
    for (let scan_coords = 0; scan_coords != coords.length; scan_coords++) {
        result.push(Math.round(coords[scan_coords]));
    }
    return result;
}

function desplazar_vector(matriz = [], despla = 1) {
    let
        result = [],
        scan_matriz = 0
    result.length = matriz.length;
    if (typeof (despla) != "number")
        console.alert("el desplazamiento en un vector debe ser numérico");

    // Llenar los primeros con los últimos
    for (; scan_matriz != matriz.length - despla; scan_matriz++)
        result[scan_matriz] = matriz[scan_matriz + despla];
    // Llenar los últimos con los primeros
    for (; scan_matriz != matriz.length; scan_matriz++)
        result[scan_matriz] = matriz[scan_matriz - matriz.length + 1];

    return result;
}

function desplazar_matriz(matriz, desplamientos) {
    let tree2 = chain2tree(tree2chain(matriz, "branch"));
    return tree2;
}

// Ejemplo de uso:
const matriz = [
    [[1, 2, 3], [4, 5, 6]],
    [[7, 8, 9], [10, 11, 12]],
    [[13, 14, 15], [16, 17, 18]]
];

const desplazar = [1, 1, 1];
const resultado = desplazar_matriz(matriz, desplazar);
console.log(JSON.stringify(resultado, null, 2));


// Código para el desplazamiento de una matriz con n-dimensiones.
// function desplazamiento(matriz = [], despla = 1) {
//     const result = new Array(matriz.length);
//     const len = matriz.length;
//
//     // Llenar los primeros con los últimos
//     for (let i = 0; i < len; i++) {
//         result[i] = matriz[(i + despla) % len];
//     }
//
//     return result;
// }
//
// function desplazar_matriz(matriz = [[]], despla = []) {
//     // Función recursiva para desplazamiento de submatrices
//     function desplazarNivel(submatriz, nivel) {
//         if (nivel === despla.length) {
//             return submatriz;
//         }
//
//         // Desplazar en el nivel actual
//         const desplazado = desplazamiento(submatriz, despla[nivel]);
//
//         // Desplazar recursivamente las submatrices
//         return desplazado.map(sm => Array.isArray(sm) ? desplazarNivel(sm, nivel + 1) : sm);
//     }
//
//     return desplazarNivel(matriz, 0);
// }
//
// // Ejemplo de uso:
// const matriz = [
//     [[1, 2, 3], [4, 5, 6]],
//     [[7, 8, 9], [10, 11, 12]],
//     [[13, 14, 15], [16, 17, 18]]
// ];
// const desplazar = [1, 1, 1];
// const resultado = desplazar_matriz(matriz, desplazar);
// console.log(JSON.stringify(resultado, null, 2));
