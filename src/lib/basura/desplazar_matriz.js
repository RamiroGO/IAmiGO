

function desplazar_matriz(matriz = [[]], despla = []) {
    let result = matriz, level_objetivo,
        scans_max = make_array_empty(despla.length + 1, "int"),
        scans = {
            patch: make_array_empty(despla.length + 1, "int"),
            scan: make_array_empty(despla.length + 1, "int"),
            level: 0,
            register: [],
            isBusy: true
        };

    scans_max[0] = 1;
    level_objetivo = 0
    scans.level = 0
    while (scans.isBusy) {
        if (scans.patch[scans.level] + 1 == scans_max[scans.level]) {
            // Desarrollar el desplazamiento en el nivel presente
            result = desplazar_vector(result, despla[scans.level]);

            // // Marcar como realizado => cambiar de objetivo
            // scans.patch[scans.level] += 1;
            if (scans.patch[scans.level] == scans_max[scans.level] - 1 && scans.level == level_objetivo) {
                // Ya desplazados los elementos del nivel => vamos al siguiente.
                level_objetivo++;
                // Identificar la cantidad de elementos que hay en el siguiente 'level'.
                scans_max[level_objetivo] = result.length;
            }
            // Marcar como realizado => cambiar de objetivo
            scans.patch[scans.level] += 1;
        }
        else {
            // Desplazar todos los elementos de este nivel
            while (scans.patch[scans.level] != scans_max[scans.level]) {
                // Efectuar desplazamiento
                result[scans.patch[scans.level]] = desplazar_vector(result[scans.patch[scans.level]], despla[scans.level]);

                // // Marcar como realizado
                // scans.patch[scans.level] += 1;
                // Cambiar de objetivo
                if (scans.patch[scans.level] == scans_max[scans.level] - 1 && scans.level == level_objetivo) {
                    if (level_objetivo != despla.length - 1) {
                        level_objetivo++;

                        // Identificar la cantidad de elementos que hay en el siguiente 'level'.
                        scans_max[level_objetivo] = result[scans.level].length;

                        // Guardar Registro, Dar paso al frente
                        scans.register.push(result);
                        result = result[scans.patch[level_objetivo]];
                    }
                }
                // Marcar como realizado => cambiar de objetivo
                scans.patch[scans.level] += 1;
            }

            // Establecer a que nivel se va a entrar
            if (scans.level == despla.length - 1) {
                scans.scan[scans.level]++;

                if (scans.scan[scans.level] == scans_max[scans.level]) {
                    // Retroceso
                    level_objetivo--;
                    if (level_objetivo == 0) {
                        scans.isBusy = false;
                    }
                    else {
                        result = scans.register.pop();
                        scans.level -= 1;
                    }
                }
            }
            else {
                scans.level++;
            }
        }
    }

    return result;
}