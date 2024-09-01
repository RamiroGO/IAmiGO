import { append_register, isContain, isEqual, expand_arrays } from "../tool_javascript.js";
import { copy_data, getConsecutiveMatches, make_array_empty, into_branch_scans } from "../tool_json.js";

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

	return result.slice(-1);
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

function copy_tree(tree, path_root = ["value"]) {
	// La cantidad de anidamientos en el resultado será diferente al original
	// Estructura de control para el árbol original
	let scans_tree = {
		branch: tree, // El nodo actual del árbol que se está explorando
		register: [], // Pila para guardar estados anteriores de branch
		scan: new Array(1), // Array que guarda los índices de escaneo por nivel
		level: 0 // Cantidad de anidamientos que se han desarrollado para consebir el branch
	};

	// Estructura de control para el árbol resultante
	let scans_result = {
		branch: [], // El nodo actual del resultado que se está construyendo
		register: [], // Pila para guardar estados anteriores de branch
		scan: new Array(1), // Array que guarda los índices de escaneo por nivel
		level: 0 // Cantidad de anidamientos que se han desarrollado para consebir el branch
	};

	// Control general de la exploración
	let scans = {
		action: "avanzar", // Acción actual: avanzar o retroceder
		isBusy: true, // Control del ciclo principal
		path_root: 0, // Nivel de la ruta dentro de path_root
	};
	let value_branch_tree, scan_value_branch_tree, isRetro;

	while (scans.isBusy) {
		// Si el branch actual es un array, exploramos los elementos
		if (Array.isArray(scans_tree.branch)) {
			// Extender el array de scan si es necesario para el nivel actual
			[scans_result, scans_tree] = expand_arrays([scans_result, scans_tree], 0, 0);

			// Si el scan para el nivel actual no ha sido inicializado, iniciarlo
			if (scans_tree.scan[scans_tree.level] === undefined) {
				scans_tree.scan[scans_tree.level] = 0;
				scans_result.scan[scans_result.level] = 0;
			}

			// Verificar el tipo de contenido del siguiente nodo en el árbol original
			if (Array.isArray(scans_tree.branch[scans_tree.scan[scans_tree.level]])) {
				// Establecer la longitud en el nodo resultado
				scans_result.branch.length = scans_tree.branch.length;

				value_branch_tree = scans_tree.branch[scans_tree.scan[scans_tree.level]][path_root[scans.path_root]];

				// No se puede dejar los Array contenidos dentro de "scans_result.branch" como "undefined"
				for (scan_value_branch_tree = 0; scan_value_branch_tree != value_branch_tree.length; scan_value_branch_tree++) {
					if (Array.isArray(value_branch_tree[scan_value_branch_tree])) {
						scans_result.branch[scans_result.scan[scans_result.level]][scan_value_branch_tree] = [];
					}
					else if (typeof value_branch_tree[scan_value_branch_tree] == "object") {
						if (path_root[scans.path_root] in value_branch_tree[scan_value_branch_tree])
							scans_result.branch[scans_result.scan[scans_result.level]][scan_value_branch_tree] = [];
						else
							scans_result.branch[scans_result.scan[scans_result.level]][scan_value_branch_tree] = {};
					}
					else {
						scans_result.branch[scans_result.scan[scans_result.level]][scan_value_branch_tree] = value_branch_tree[scan_value_branch_tree];
					}
				}
			}
			else if (typeof scans_tree.branch[scans_tree.scan[scans_tree.level]] === "object") {
				// Si el elemento actual es un objeto, verificamos si tiene la key path_root
				if (path_root[scans.path_root] in scans_tree.branch[scans_tree.scan[scans_tree.level]]) {
					// 
					value_branch_tree = scans_tree.branch[scans_tree.scan[scans_tree.level]][path_root[scans.path_root]];

					// Extender el array de scan si es necesario para el nivel actual
					[scans_result, scans_tree] = expand_arrays([scans_result, scans_tree], 1, 0);

					// Si no está definido => Definirlo
					if (scans_result.branch[scans_result.scan[scans_result.level]] === undefined) {
						scans_result.branch[scans_result.scan[scans_result.level]] = [];

						// Establecer la longitud en el nodo resultado
						scans_result.branch[scans_result.scan[scans_result.level]].length = value_branch_tree.length;
					}
				}
				else {
					scans_result.branch[scans_result.scan[scans_result.level]] = {};
				}
			}
			else
				// No es algo a lo cual se pueda entrar para avanzar => copiar como un nodo hoja
				scans_result.branch[scans_result.scan[scans_result.level]] = scans_tree.branch[scans_tree.scan[scans_tree.level]];

			// Ingresar al siguiente branch y actualizar los scans
			scans_tree = into_branch_scans(scans_tree);
			scans_result = into_branch_scans(scans_result);
		}
		else if (typeof scans_tree.branch === "object") {
			const keys_branch_tree = Object.keys(scans_tree.branch);

			// Establecer el scan actual basado en path_root
			scans_tree.scan[scans_tree.level] = path_root[scans.path_root];

			// Validar la existencia del "path_value"
			if (keys_branch_tree.includes(scans_tree.scan[scans_tree.level])) {
				// Si es un array, copiar su contenido
				value_branch_tree = scans_tree.branch[scans_tree.scan[scans_tree.level]];
				if (Array.isArray(value_branch_tree)) {
					// El tree tiene un doble avance en una anidación, que por cuestión del key, se pretende omitir en el resultado.
					// Avanzar al siguiente nivel
					// - Dado que existe una key que se desea tratar como un avance que no se registra, por causa del path_root => incrementar scans_tree.level
					scans_tree.level++;

					// Extender el array de scan si es necesario para el nivel actual
					[scans_result, scans_tree] = expand_arrays([scans_result, scans_tree], 0, 0);

					// Replicar el tipo de variable del value_branch_tree en el scans_result.branch
					const data_value_branch_tree = value_branch_tree[scans_tree.scan[scans_tree.level]];
					if (Array.isArray(data_value_branch_tree)) {
						scans_result.branch[scans_tree.scan[scans_tree.level]] = [];
					}
					else if (typeof data_value_branch_tree === "object") {
						// Para llenar el branch_result
						// No basta con discernir para "scans_tree.branch[scans_tree.scan[scans.level + 1]]" el entre array y object
						// Si es un object, hay que discernir si se copiará todo el object o si se trata de una copia de uno de sus parámetro en específicos
						if (path_root[scans.path_root] in data_value_branch_tree) {
							// Establecer la longitud en el nodo resultado
							scans_result.branch.length = value_branch_tree.length;

							// Se define el tipo de 2 niveles de anidamiento del branch presente
							if (Array.isArray(data_value_branch_tree[path_root[scans.path_root]])) {
								scans_result.branch[scans_result.scan[scans_result.level]] = [];
							}
							else if (typeof (data_value_branch_tree[path_root[scans.path_root]]) == "object") {
								// Si el que está adentro también tiene a path_key
								// valdría la pena hacer recursividad o seguir dando pasos adelante en los anidamientos, pero realmente, solo nos interesa el anidamiento inmediato al array de "scans_result.branch"
								if (path_root[scans.path_root] in data_value_branch_tree[path_root[scans.path_root]])
									scans_result.branch[scans_result.scan[scans_result.level]][scans_tree.scan[scans_tree.level]] = [];
								else {
									scans_result.branch[scans_result.scan[scans_result.level]][scans_tree.scan[scans_tree.level]] = {};
								}
							}
							else {
								// Copiar valor como nodo hoja
								scans_result.branch[scans_result.scan[scans_result.level]][scans_tree.scan[scans_tree.level]] = data_value_branch_tree[path_root[scans.path_root]];
							}
						}
						else if (typeof (data_value_branch_tree[path_root[scans.path_root]][path_root[scans.path_root]]) == "object") {
							scans_result.branch[scans_result.scan[scans_result.level]][scans_tree.scan[scans_tree.level]] = {};
						}
						else {
							// Asegurarse que la longitud del array de los nodos hojas sea correcta
							scans_result.branch[scans_result.scan[scans_result.level]].length = Object.keys(data_value_branch_tree).length;
						}
					}
					else {
						// Asegurarse que la longitud del array de los nodos hojas sea correcta
						scans_result.branch.length = value_branch_tree.length;

						// Copiar valor
						// - No se puede dejar los Array de "scans_result.branch" como "undefined"
						// - Se requiere un valor al cual ingresar, el siguiente nodo no puede ser "undefined" o el scans_result.branch presente perderá su información objeto al tratar de dar el siguiente paso.
						scans_result.branch[scans_tree.scan[scans_tree.level]] = data_value_branch_tree;
					}

					// Ingresar al siguiente branch y actualizar los scans
					scans_tree = into_branch_scans(scans_tree, scans_tree.scan[scans_tree.level - 1]);
					scans_result = into_branch_scans(scans_result);
				}
				else if (typeof value_branch_tree === "object") {
					scans_result.branch = { ...value_branch_tree };
				}
				else {
					scans_result.branch = value_branch_tree;
				}
			} else if (typeof scans_tree.branch[scans_tree.scan[scans_tree.level]] === "object") {
				scans_result.branch = {};
			}
			else {
				scans_result.branch = scans_tree.branch[scans_tree.scan[scans_tree.level]];
			}
		}
		else {
			// Copiar nodo hoja
			scans_result.branch = scans_tree.branch;

			// Extender el array de scan si es necesario para el nivel actual
			[scans_result, scans_tree] = expand_arrays([scans_result, scans_tree], 0, 1);

			// En todo nodo hoja hay que retroceder
			scans.action = "retroceder";
		}

		// Control de Ciclos
		if (scans.action === "retroceder") {
			isRetro = true;
			do {
				// Proceso de retroceso:
				// - Reiniciar los índices de un camino que ya se recorrió
				scans_result.scan.fill(0, scans_result.level);
				scans_tree.scan.fill(0, scans_tree.level);

				// Retroceder el "level" de los anidamientos
				scans_result.level--;
				scans_tree.level--;

				// - Por cada retroceso del level => retroceder en el branch con el register
				if (scans_tree.level != -1) {
					// retroceder el branch
					scans_result.branch = scans_result.register.pop();
					scans_tree.branch = scans_tree.register.pop();

					if (Array.isArray(scans_tree.branch)) {
						if (scans_tree.branch.length === scans_tree.scan[scans_tree.level - 1])
							scans_tree.level--;
						else {
							value_branch_tree = scans_tree.branch[scans_tree.scan[scans_tree.level - 1]];
							if (Array.isArray(value_branch_tree)) {
							}
							else if (typeof (value_branch_tree) == "object") {
								if (path_root[scans.path_root] in value_branch_tree)
									scans_tree.level--;
							}
							else {

							}
						}
					}
					else if (typeof (scans_tree.branch) == "object")
						if (path_root[scans.path_root] in scans_tree.branch)
							scans_tree.level--;

					// Si ya se alcanzó el máximo de branch recorridas para este nodo previamente registrado => Se seguirá retrocediendo
					if (Array.isArray(scans_tree.branch)) {
						if (scans_result.scan[scans_result.level] !== scans_tree.branch.length) {
							// Todavía faltan ramas por recorrer en este nodo => Avanzar
							scans.action = "avanzar";
							isRetro = false;
						}
					}
					else if (typeof scans_tree.branch == "object") {
						if (path_root[scans.path_root] in scans_tree.branch) {
							isRetro = false;
						}
					}
				}
				else {
					isRetro = false;
					scans.isBusy = false;
				}
			} while (isRetro);
		}
	}
	return scans_result.branch[0];
}

export { tree2chain, chain2tree, copy_tree };
