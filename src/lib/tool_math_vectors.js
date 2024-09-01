import { desplazar_matriz_soul } from "./tools_trees/tool_soul.js";
import { isContain } from "./tool_javascript.js";

function round_math(coords = [0.0, 0.0]) {
    let result = []
    for (let scan_coords = 0; scan_coords != coords.length; scan_coords++) {
        result.push(Math.round(coords[scan_coords]));
    }
    return result;
}

function increment_vector(vector = [], increment = 1, mode = "end2ini single truncate wrap_around", range_vector = [], exclude_indices = []) {
    let result = [], index, carry, single_done = false;
    result.length = vector.length;

    if (typeof (mode) == "string")
        mode = mode.split(" ");

    switch (mode[0]) {
        case "independent":
            for (index = 0; index != vector.length; index++) {
                if (!exclude_indices.includes(index)) {
                    if (isContain(mode, "wrap_around")) {
                        result[index] = (vector[index] + increment) % range_vector[index];
                    } else {
                        result[i] = Math.min(vector[i] + inc_vector[i], range_vector[i] - 1);
                    }
                    // Si hay single => Cerrar ciclo
                    if (isContain(mode, "single"))
                        index = vector.length - 1;
                } else {
                    result[index] = vector[index];
                }
            }
            break;

        case "end2ini":
            carry = increment;
            for (index = vector.length - 1; index != -1; index--) {
                if (!exclude_indices.includes(index) && !single_done) {
                    result[index] = vector[index] + carry;
                    carry = Math.floor(result[index] / range_vector[index]);
                    if (isContain(mode, "wrap_around")) {
                        result[index] = result[index] % range_vector[index];
                        if (isContain(mode, "single"))
                            single_done = true;
                    }
                    else {
                        result[index] = Math.min(result[index], range_vector[index] - 1);
                    }
                }
                else {
                    result[index] = vector[index];
                }
            }

            if (carry != 0 && !isContain(mode, "truncate"))
                result.unshift(carry);
            break;

        case "ini2end":
            carry = increment;
            for (index = 0; index != vector.length; index++) {
                if (!exclude_indices.includes(index) && !single_done) {
                    result[index] = vector[index] + carry;
                    carry = Math.floor(result[index] / range_vector[index]);
                    if (isContain(mode, "wrap_around")) {
                        result[index] = result[index] % range_vector[index];
                        if (isContain(mode, "single"))
                            single_done = true;
                    }
                    else {
                        result[index] = Math.min(result[index], range_vector[index] - 1);
                    }
                } else {
                    result[index] = vector[index];
                }
            }

            if (carry != 0 && !isContain(mode, "truncate"))
                result.push(carry);
            break;
    }

    return result;
}

// Código para el desplazamiento de una matriz con n-dimensiones.
function desplazamiento(matriz = [], despla = 1) {
    const result = new Array(matriz.length);
    const len = matriz.length;
    
    // Llenar los primeros con los últimos
    for (let i = 0; i < len; i++) {
        result[i] = matriz[(i + despla) % len];
    }
    
    return result;
}

function desplazar_matriz(matriz = [[]], despla = []) {
    // Función recursiva para desplazamiento de submatrices
    function desplazarNivel(submatriz, nivel) {
        if (nivel === despla.length) {
            return submatriz;
        }
        
        // Desplazar en el nivel actual
        const desplazado = desplazamiento(submatriz, despla[nivel]);
        
        // Desplazar recursivamente las submatrices
        return desplazado.map(sm => Array.isArray(sm) ? desplazarNivel(sm, nivel + 1) : sm);
    }
    
    return desplazarNivel(matriz, 0);
}

// Ejemplo de uso:
const matriz = [
    [[1, 2, 3], [4, 5, 6]],
    [[7, 8, 9], [10, 11, 12]],
    [[13, 14, 15], [16, 17, 18]]
];

const desplazar = [1, 1, 1];
const resultado1 = desplazar_matriz_soul(matriz, desplazar);
const resultado2 = desplazar_matriz(matriz, desplazar);

console.log(JSON.stringify(resultado1, null, 2));
console.log(JSON.stringify(resultado2, null, 2));

export { round_math, increment_vector, desplazamiento, desplazar_matriz }