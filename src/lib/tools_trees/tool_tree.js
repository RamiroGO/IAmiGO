import { append_register, isContain, isEqual } from "../tool_javascript.js";
import { copy_data, getConsecutiveMatches, make_array_empty } from "../tool_json.js";

/**
 * Función que convierte una cadena de datos de vuelta en un árbol anidado.
 * @param {Array} chain - Array de objetos con valor y escaneos.
 * @returns {Array} - Árbol reconstruido a partir de la cadena.
 */
function chain2tree(chain = [{ value: [], roots: [], soul: { id: 0, level: 0, keys: [] } }]) {
	let result = [], nodo1 = { value: [], roots: [], soul: { id: 0, level: 0, keys: [] } },
		nodo2 = { value: [], roots: [], soul: { id: 0, level: 0, keys: [] } },
		nodes_id = {}, id_root_nodo1 = 0, isFound;

	if (Array.isArray(chain)) {
		for (let scan_chain1 = 0; scan_chain1 != chain.length; scan_chain1++) {
			nodo1 = chain[scan_chain1];

			// Revisar si se conoce su Id
			if (!nodes_id.hasOwnProperty(nodo1.soul.id))
				nodes_id[nodo1.soul.id] = nodo1;

			// Si hay roots => reiniciar value
			if (nodo1.roots.length !== 0) {
				nodo1.value = [];
				isFound = false;
				
				// Buscar roots
				for (let scan_roots_nodo1 = 0; scan_roots_nodo1 != nodo1.roots.length; scan_roots_nodo1++) {
					id_root_nodo1 = nodo1.roots[scan_roots_nodo1];

					if (!nodes_id.hasOwnProperty(id_root_nodo1)) {
						// Si no hay memoria del root => buscar y guardar
						// Buscar root
						for (let scan_chain2 = 0; scan_chain2 != chain.length && !isFound; scan_chain2++) {
							// Validar chain[scan_chain2]: Revisar si se conoce su Id
							if (!nodes_id.hasOwnProperty(chain[scan_chain2].soul.id))
								nodes_id[chain[scan_chain2].soul.id] = chain[scan_chain2];

							if (chain[scan_chain2].soul.id === id_root_nodo1) {
								isFound = true;
								nodo2 = chain[scan_chain2];
							}
						}
					}
					else {
						// Si hay memoria del root => Guardar donde corresponde
						isFound = true;
						nodo2 = nodes_id[id_root_nodo1];
					}

					if (isFound && nodo2.soul.id === nodo1.roots[scan_roots_nodo1]) {
						nodo1.value.push(nodo2);
						isFound = false;
					}
				}

				result.push(nodo1);
			}
		}
	} else {
		console.error("Solo se aceptan valores de tipo Array, cuyos elementos poseen un formato muy concreto.");
	}

	return result;
}

function insert_element_tree(tree = [], element = { value: [], soul: { id: 0, level: 0, keys: [] } }) {
	let
		scans = {
			branch: tree,
			register: [],
			scan: make_array_empty(element.soul.keys.length, 0),
			level: 0
		},
		branch_soul_element = element.soul.tree,
		index;

	// - Se compara la cantidad de elementos, para validar que se trata de un elemento que contendrá a otros elementos.

	// Hay que llegar al nivel presentado por el elemento
	while (scans.level != element.soul.level) {
		// Si no existe => Crear todas las keys y su contenido
		if (scans.branch.length < branch_soul_element.length)
			for (index = 0; index != branch_soul_element.length; index++)
				scans.branch.push(branch_soul_element[index]);

		// Dar paso adelante
		// Registrar para retroceder (Solo útil para casos de múltiples inserciones)
		scans.register.push(scans.branch);

		scans.branch = scans.branch[element.soul.keys[scans.level]];
		branch_soul_element = branch_soul_element[element.soul.keys[scans.level]];

		// Subir de nivel
		scans.level++;
	}

	// Guardar el "element.value": Tiene que hacerse uno por uno, de lo contrario, no se cargará en el tree
	for (index = 0; index != element.value.length; index++)
		scans.branch[index] = element.value[index];

	return tree;
}

/**
 * Función que convierte una matriz de datos anidados en una cadena recorrida con alguna teoría para recorrer un árbol.
 * @param {Array} tree matriz de datos anidados
 * @param {String} mode establece que se desea en los resultados "branch" y "leaf"
 * @param {Function} callback función que se ejecuta al encontrar cada resultado deseado, implementando los parámetros:
 * * value,
 * * scans:
 * * *   level: int,
 * * *   keys: Array
 * * *   scan: Array
 * @returns Arra y de los elementos recorridos en el árbol.
 */
function tree2chain(tree, mode = ["branch", "leaf"], callback = (value, scans) => { }) {
	let
		result = [], branch = tree, copy_scans, id = 0,
		scans_max = new Array(0),
		scans = {
			id: 0,
			scan: new Array(0),
			level: -1,
			keys: new Array(0),
			skipIgnore: new Array(0)
		},
		register = [];

	if (typeof (mode) == "string")
		mode = mode.split(" ");

	// Diferenciar nodo rama de nodo hoja
	if (Array.isArray(branch)) {
		// Avanzar de nivel
		scans.level++;
		if (scans_max.length < scans.level + 1) {
			scans_max.push(branch.length);
			scans.scan.push(0);
			scans.keys.push(0);
		} else
			scans_max[scans.level] = branch.length;
	}

	while (scans.level != -1) {
		// Proceso de avance en el árbol
		if (scans.scan[scans.level] != scans_max[scans.level]) {
			// Guardar registro
			register.push(branch);

			scans.keys[scans.level] = scans.scan[scans.level];

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
						scans.keys.push(0);
					} else scans_max[scans.level] = branch.length;
				}
				else {
					if (scans.level == scans_max.length) {
						//#region CallBack
						// Implementar el callback con una copia del scan corregida
						// Guardar nodo hoja
						if (isContain(mode, "leaf")) {
							result.push(callback(branch, copy_data(scans)));
							id++;
						}
						//#endregion

						// Retroceder
						scans.level--;
						branch = register.pop();

						scans.keys[scans.level] = scans.scan[scans.level];

						// Cuando se retrocede => se reinicia el refereniador de la cantidad de nodos hijos entre un nodo padre y otro.
						while (scans.skipIgnore.length < scans.level)
							scans.skipIgnore.push(0);
						scans.skipIgnore[scans.level] = 0;
					}
				}
			}
		} else {
			// Implementar el callback con una copia del scan corregida
			copy_scans = copy_data(scans);

			// Implementar el callback
			callback(branch, copy_scans);
			// Diferenciar nodo rama de nodo hoja
			if (Array.isArray(branch) && isContain(mode, "branch")) {
				// Por cada elemento añadido, el incremento de todos los nodos inferiores aumenta
				for (let scan_level = 0; scan_level <= scans.level - 2; scan_level++)
					scans.skipIgnore[scan_level]++;

				result = append_register(result,
					{
						value: branch,
						roots: getConsecutiveMatches(result, ["soul", "level"], scans.skipIgnore[scans.level],
							copy_scans.level + 1, true, ["soul", "id"]),
						soul: { id: id, level: copy_scans.level, keys: copy_scans.keys }
					},
					(value1, value2) => isEqual(value1.soul, value2.soul)
				);

				id++;
			}

			// Reiniciar el conteo por el camino ya recorrido
			scans.scan[scans.level] = 0;

			// Cuando se retrocede => se reinicia el refereniador de la cantidad de nodos hijos entre un nodo padre y otro.
			while (scans.skipIgnore.length < scans.level)
				scans.skipIgnore.push(0);
			scans.skipIgnore[scans.level] = 0;

			// Retroceder
			scans.level--;
			branch = register.pop();

			scans.keys[scans.level] = scans.scan[scans.level];
		}
	}

	return result;
}

export { tree2chain, chain2tree };
