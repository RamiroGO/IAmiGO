function matrix_make(lengthArray, value_fill = 0) {
    let matrix_return = new Array(lengthArray);
    for (let index = 0; index != matrix_return.length; index++)
        matrix_return[index] = value_fill;

    return matrix_return;
}

/**
 * Promedio
 * @param {*} datos arreglo de datos a promediar
 * @returns promedio de arreglo de datos
 */
function promedio(datos) {
    let promedio_return = 0;
    for (let index = 0; index != datos.length; index++) {
        promedio_return += datos[index];
    }
    return promedio_return / datos.length;
}
/**
 * Sumatoria
 * @param {*} datos Arreglo de datos
 * @returns Sumatoria del arreglo de datos
 */
function sumatoria(datos) {
    let suma = 0;
    // Método 1
    for (const valor of datos) {
        suma += valor;
    }
    return suma;

    // // Método 2
    // datos.reduce(function (a, b) {
    //     return a + b;
    // }, 0);
}

/**
 * Reescalar arreglo de números.
 * @param {*} datos Array de números
 * @param {*} min_value Valor mínimo deseado
 * @param {*} max_value Valor máximo deseado
 * @returns Array de valores que representan las nuevas medidas de los datos
 */
function reescalar(datos, min_value = 0, max_value = 1) {
    let
        index,
        reescal_return = [];
    const rango_value = max_value - min_value;
    const reescale = rango_value / sumatoria(datos);

    reescal_return.length = datos.length;

    for (index = 0; index != datos.length; index++) {
        reescal_return[index] = datos[index] * reescale;
    }

    if (min_value != 0)
        for (index = 0; index != reescal_return.length; index++)
            reescal_return[index] += min_value;

    /* // Mejorar precisión
    let precision = 0;
    for (let index = 0; index != datos.length; index++) {
        precision += reescale;
    }
    precision = 1 + rango_value - precision;

    for (index = 0; index != datos.length; index++) {
        reescal_return[index] *= precision;
    } */

    return reescal_return;
}


/**
 * Normalizar arreglo de números.
 * @param {*} datos Array de números
 * @param {*} min_value Valor mínimo deseado
 * @param {*} max_value Valor máximo deseado
 * @returns Array de valores que representan las nuevas medidas de los datos
 */
function normalizar(datos, min_value = 0, max_value = 1) {
    let
        index,
        norma_return = [];
    const reescale = (max_value - min_value) / sumatoria(datos);

    norma_return.length = datos.length;

    for (index = 0; index != datos.length; index++) {
        norma_return[index] = datos[index] * reescale;
    }

    if (min_value != 0)
        for (index = 0; index != norma_return.length; index++)
            norma_return[index] += min_value;

    return norma_return;
}

/**
 * Promedio Ponderado.
 * @param {*} datos Array de numeros
 * @param {*} relevancia Valoración de cada número en los datos.
 * @returns Promedio ponderado.
 */
function ponderacion(datos, relevancia) {
    let
        ponder_return = 0,
        // preparación de pesos
        pesos = reescalar(relevancia);

    for (let index = 0; index != datos.length; index++) {
        ponder_return += datos[index] * pesos[index];
    }

    return ponder_return;
}

// /**
//  * Dispersión/Desviación Estandar.
//  * @param {*} sel_data Parámetro común entre los elementos que componen la población con los que se va a trabajar.
//  * @param {*} value_ref Valor referencial sobre el cual se comprenderá la dispersión, sea el promedio.
//  * @returns Dispersión de datos en 'datos_users'.
//  */
// function dispersion(sel_data, value_ref) {
//     let return_dispersion = 0;

//     for (let corre_user = 0; corre_user != dataBase.datos_users.length; corre_user++) {
//         const diferencia = dataBase.datos_users[corre_user][sel_data] - value_ref;
//         // const
//     }


//     return return_dispersion;
// }

/**
 * Estimar valores de los datos a partir de los que ya se dispone.
 * @param {*} tengo_soporte Vector con los index de los datos con los que si se cuenta.
 * @param {*} tengo_dataBase Vector con los valores de los datos con los que si se cuenta.
 * @param {*} buscar_fromDataBase Vector con los index de los datos que se desean estimar.
 * @returns Vector con los valores de los datos que se desean estimar.
 */
function estimar(tengo_soporte, tengo_dataBase, buscar_fromDataBase, dataBase, pesos = matrix_make(dataBase.datos.length, 1)) {
    // Variables Locales
    let
        rows_dataBase = [],
        estimacion_return = [];

    // Inicializar arrays
    rows_dataBase.length = dataBase.datos.length;
    estimacion_return.length = buscar_fromDataBase.length;

    // 
    for (let corre_soporte_estimar = 0; corre_soporte_estimar != buscar_fromDataBase.length; corre_soporte_estimar++) {
        const soporte_buscado = buscar_fromDataBase[corre_soporte_estimar];

        // Inicializar sub_arrays
        rows_dataBase[corre_soporte_estimar] = [];
        rows_dataBase[corre_soporte_estimar].length = dataBase.datos.length;

        /**
         * Invertir la estructuración en el arreglo de la base de datos.
         * Convertir un array con [usuarios][parámetros] => [parámetros][usuarios]
         * Dado que lo que nos interesa es el arreglo de datos y no los usuarios.
         */
        for (let corre_row = 0; corre_row != dataBase.datos.length; corre_row++) {
            rows_dataBase[corre_soporte_estimar][corre_row] = dataBase.datos[corre_row][soporte_buscado]
        }

        // Promedio de la lista de parámetros.
        estimacion_return[corre_soporte_estimar] = Math.round(ponderacion(rows_dataBase[corre_soporte_estimar], pesos));
    }

    return estimacion_return;
}

// export {
//     estimar
// }