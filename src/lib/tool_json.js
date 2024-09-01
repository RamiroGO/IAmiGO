import { getIndex, isContain } from "./tool_javascript.js";

function copy_data(data = {}, configs_exception_keys = [{ keys: [""], level: 0, fcn: (() => { }), parameter_fcn: [] }], __cicles = { level: 0, keys: [[]], fcn: [[]], parameter_fcn: [] }) {
	let result, value_data, scan_data;

	// Si no se había hecho antes => Buscar todos los keys correspondientes con este level:
	if (__cicles.keys[__cicles.level].length === 0) {
		while (__cicles.keys.length <= __cicles.level) {
			__cicles.keys[__cicles.level] = [];
			__cicles.fcn[__cicles.level] = [];
		}

		for (let scan_configs_exception_keys = 0; scan_configs_exception_keys != configs_exception_keys.length; scan_configs_exception_keys++) {
			if (configs_exception_keys[scan_configs_exception_keys].level == __cicles.level) {
				for (let scan_keys_excep = 0; scan_keys_excep < configs_exception_keys[scan_configs_exception_keys].keys.length; scan_keys_excep++) {
					const key_exception = configs_exception_keys[scan_configs_exception_keys].keys[scan_keys_excep];

					if (!isContain(__cicles.keys, key_exception)) {
						__cicles.keys[__cicles.level].push(key_exception);
						__cicles.fcn[__cicles.level].push(configs_exception_keys[scan_configs_exception_keys].fcn)
						__cicles.parameter_fcn = configs_exception_keys[scan_configs_exception_keys].parameter_fcn;
					}
				}
			}
		}
	}

	if (Array.isArray(data)) {
		result = [];
		result.length = data.length;
		// En los Array no hay keys para comparar excepciones
		for (scan_data = 0; scan_data != data.length; scan_data++) {
			// Recursividad por objeto
			value_data = data[scan_data];

			if (Array.isArray(value_data))
				// guardar dato
				result[scan_data] = copy_data(value_data, configs_exception_keys, __cicles);
			else if (typeof (value_data) == "object")
				// guardar dato
				result[scan_data] = copy_data(value_data, configs_exception_keys, __cicles);
			else
				// guardar dato
				result[scan_data] = value_data;
		}
	}
	else if (typeof (data) == "object") {
		result = {};
		let keys_data = Object.keys(data), key_data;

		for (scan_data = 0; scan_data != keys_data.length; scan_data++) {
			key_data = keys_data[scan_data];

			if (isContain(__cicles.keys[__cicles.level], key_data)) {
				const fcn_ = __cicles.fcn[__cicles.level][getIndex(__cicles.keys[__cicles.level], key_data)]
				result[key_data] = fcn_(data[key_data], __cicles.parameter_fcn);
			}
			else {
				// Recursividad por objeto
				value_data = data[key_data];
				if (Array.isArray(value_data))
					// guardar dato
					result[key_data] = copy_data(value_data, configs_exception_keys, __cicles);
				else if (typeof (value_data) == "object")
					// guardar dato
					result[key_data] = copy_data(value_data, configs_exception_keys, __cicles);
				else
					// guardar dato
					result[key_data] = value_data
			}
		}
	}
	else
		result = data;
	return result;
}

// Puede comparar dos arrays simples.
function isEqual(object1 = { "key1": 0, "key2": 0 }, object2 = { "key1": 0, "key2": 0 }) {
	let is_equal, scan;
	if (Array.isArray(object1) == true && Array.isArray(object2) == true) {
		// ambos son arrays
		// Si tienen la misma longitud. true
		is_equal = object1.length == object2.length;
		for (scan = 0; scan != object1.length && scan != object2.length && is_equal; scan++) {
			if (object1[scan] != object2[scan]) {
				is_equal = false;
			}
		}
	}
	else {
		is_equal = false;
	}
	return is_equal;
}

// Puede comparar dos arrays simples.
function notEqual(object1 = { "key1": 0, "key2": 0 }, object2 = { "key1": 0, "key2": 0 }) {
	let not_equal, scan;
	if (Array.isArray(object1) == true && Array.isArray(object2) == true) {

		// ambos son arrays
		// Si tienen la misma longitud. false
		not_equal = object1.length != object2.length;
		for (scan = 0; scan != object1.length && not_equal; scan++) {
			if (object1[scan] == object2[scan]) {
				not_equal = false;
			}
		}
	}
	else {
		not_equal = false;
	}

	return not_equal;
}

function make_array_empty(_length, _type) {
	let new_array = []
	for (let index = 0; index != _length; index++) {
		switch (_type) {
			case "int":
				new_array.push(0);
				break;
			case "string":
				new_array.push("");
				break;
			case "array":
				new_array.push([]);
				break;
			default:
				new_array.push(_type);
				break;
		}
	}

	return new_array;
}


// Función para obtener el valor anidado
function getNestedValue(obj, path) {
	return path.reduce((acc, key) => (acc && acc[key] !== undefined) ? acc[key] : undefined, obj);
}

// Función Avanzada para comparar dos arrays bajo una configuración preestablecida.

// función para obtener el elemento contenido en una estructura object bajo una configuración preestablecida.
function get_next_element(scans = { "step": 0, "scan": [0], "action_branch": "avanzar", "register": [], "isChange": true }, branch = [[], "type"], configKey = [0]) {
	// Inicializar con asumir que no hay cambios.
	let isBusy = true;
	scans["isChange"] = false;

	// Proceso previo al ciclo
	switch (scans["action_branch"]) {
		case "encontrado":
			scans["action_branch"] = "retroceder";
			break;
		default:
			// No acceder a mas niveles que los predefinidos
			if (scans["step"] == scans["scan"].length)
				scans["action_branch"] = "encontrado";

			if (scans["action_branch"].slice(0, 5) == "error")
				scans["action_branch"] = "avanzar";
			break;
	}

	// Ciclo de Escaneo
	while (isBusy && scans["action_branch"] != "encontrado") {
		switch (scans["action_branch"]) {
			case "avanzar":
				if (typeof (configKey) == "number") {
					if (configKey >= 0 && configKey < branch.length) {
						// Guardar un registro
						scans["register"].push(branch);

						// Dar salto hacia un número
						branch = branch[configKey];

						// Hacer el incremento
						scans["scan"][scans["step"]] += 1;

						// Avisar que se dió un cambio
						scans["isChange"] = true;

						// Dar paso adelante
						if (scans["step"] != configKey.length - 1)
							scans["step"] += 1;
						scans["action_branch"] = "encontrado";
					}
					else {
						// No se puede proseguir => Cerrado abrupto de la exploración.
						scans["action_branch"] = "error no está " + configKey + " en '" + branch.text + "'";
						scans["isChange"] = false;
						isBusy = false;
					}
				}
				else if (typeof (configKey) == "string") {
					if (configKey in branch) {
						// Guardar un registro
						scans["register"].push(branch);

						// Dar salto hacia una key
						branch = branch[configKey];

						// Hacer el incremento
						scans["scan"][scans["step"]] += 1;

						// Avisar que se dió un cambio
						scans["isChange"] = true;

						// Dar paso adelante
						if (scans["step"] != configKey.length - 1)
							scans["step"] += 1;
						scans["action_branch"] = "encontrado";
					}
					else {
						// No se puede proseguir => Cerrado abrupto de la exploración.
						scans["action_branch"] = "error no está " + configKey + " en '" + branch.text + "'";
						scans["isChange"] = false;
						isBusy = false;
					}
				}
				else if (Array.isArray(configKey)) {
					if (isEqual(configKey, [])) {
						// No hay que hacer nada
						scans["action_branch"] = "encontrado";
					}
					else if (isEqual(configKey[scans["step"]], [])) {
						// Guardar un registro
						scans["register"].push(branch);

						// Dar salto hacia un paso numérico.
						branch = branch[scans["scan"][scans["step"]]]

						// Hacer el incremento
						scans["scan"][scans["step"]] += 1;

						// avisar que se dió un cambio
						scans["isChange"] = true;

						// Dar paso adelante
						if (scans["step"] != configKey.length - 1)
							scans["step"] += 1;
						else
							scans["action_branch"] = "encontrado";
					}
					else if (isContain(["string", "number"], typeof (configKey[scans["step"]]))) {
						if (configKey[scans["step"]] in branch) {
							if (Array.isArray(branch) && (scans["scan"][scans["step"]] == branch.length)) {
								scans["action_branch"] = "retroceder";
							}
							else if (typeof (branch) == "string") {
								scans["action_branch"] = "encontrado";

								// Avisar que se dió un cambio
								scans["isChange"] = true;
							}
							else {
								// Guardar un registro
								scans["register"].push(branch);

								// Dar salto hacia adelante en el key predefinido.
								branch = branch[configKey[scans["step"]]];

								// Hacer el incremento: Se presume que solo hay un elemento
								scans["scan"][scans["step"]] += 1;

								// Avisar que se dió un cambio
								scans["isChange"] = true;

								// Dar paso adelante
								// - Aunque exista un solo elemento, no significa que se deba retroceder siempre que aparezca este tipo de keys
								if (scans["step"] != configKey.length - 1)
									scans["step"] += 1;
								else
									scans["action_branch"] = "encontrado";
							}
						}
						else {
							// No se puede proseguir => Cerrado abrupto de la exploración.
							scans["action_branch"] = "error no está " + configKey[scans["step"]] + " en '" + branch.text + "'";

							// Hacer el incremento
							scans["scan"][scans["step"]] += 1;

							// scans["action_branch"] = "encontrado";
							scans["action_branch"] = "retroceder"

							// Decir que se dió un cambio
							scans["isChange"] = true;
							isBusy = false;
						}
					}
					else if (typeof (configKey[scans["step"]]) == "undefined") {
						// En este caso, se debe recorrer la chingada de manera numérica
						// Guardar un registro
						scans["register"].push(branch)

						// Dar salto hacia una key; pero la key es numérica y está inventada
						// porque no está explícita en ninguna parte, por lo que se implementará el mismo scans["step"] para contabilizar los tramos
						branch = branch[scans["scan"][scans["step"]]];

						// Hacer el incremento
						scans["scan"][scans["step"]] += 1;
						if (scans["scan"][scans["step"]] == scans["register"][scans["register"].length - 1].length) {
							scans["action_branch"] = "retroceder";
						}

						// Avisar que se dió un cambio
						scans["isChange"] = true;

						// Dar paso adelante
						if (scans["step"] != configKey.length)
							scans["step"] += 1;
						else
							scans["action_branch"] = "encontrado";
					}
				}
				break;
			case "retroceder":
				// dar un paso atrás, o finalizar si ya se ha recorrido todo.
				if (scans["step"] == 0)
					scans["action_branch"] = "finalizar";
				else {
					// establecer que se dió un cambio (A menos que se vaya a finalizar)
					scans["isChange"] = true;

					// Proceso de retroceso cíclico
					let isBusy_retro = true
					do {
						// Dependiendo del caso, la condicional de retroceso es diferente.
						if (isEqual(configKey[scans["step"]], [])) {
							// Caso de que el config sea vacio, es un caso numérico, dependerá de una evaluación especial.
							if (scans["scan"][scans["step"]] != scans["register"][scans["register"].length - 1].length) {
								isBusy_retro = false;
							}
							else {
								// reiniciar el step presente
								scans["scan"][scans["step"]] = 0;
								// Hacer el decremento
								if (scans["step"] != 0)
									scans["step"] -= 1;
								else {
									isBusy_retro = false;
									isBusy = false;
									scans["action_branch"] = "finalizar";
									scans["isChange"] = false;
								}
							}
						}
						else if (typeof (configKey[scans["step"]]) == "undefined") {
							// Caso de que el config sea "undefined", es un caso numérico, dependerá de una evaluación especial sobre el branch.
							if (typeof (branch) == "string") {
								// Solo hay un elemento => Hay que retroceder
								// reiniciar el step presente	
								scans["scan"][scans["step"]] = 0;
								// Hacer el decremento
								if (scans["step"] != 0)
									scans["step"] -= 1;
								else {
									isBusy_retro = false;
									isBusy = false;
									scans["action_branch"] = "finalizar";
									scans["isChange"] = false;
								}
							}
							else if (Array.isArray(branch)) {
								if (scans["scan"][scans["step"]] != branch.length) {
									isBusy_retro = false;
								}
								else {
									// reiniciar el step presente
									scans["scan"][scans["step"]] = 0;
									// Hacer el decremento
									if (scans["step"] != 0)
										scans["step"] -= 1;
									else {
										isBusy_retro = false;
										isBusy = false;
										scans["action_branch"] = "finalizar";
										scans["isChange"] = false;
									}
								}
							}
						}
						else if (isContain(["string", "number"], typeof (configKey[scans["step"]]))) {
							// Validar el tipo de "branch"
							if (isContain(["string", "number"], typeof (branch))) {
								// El branch es un texto o un número concreto => Retroceder
								// reiniciar el step presente
								scans["scan"][scans["step"]] = 0;
								// Hacer el decremento
								if (scans["step"] != 0)
									scans["step"] -= 1;
								else {
									isBusy_retro = false;
									isBusy = false;
									scans["action_branch"] = "finalizar";
									scans["isChange"] = false;
								}
							}
							else if (Array.isArray(branch[configKey[scans["step"]]])) {
								// Caso en que sea una key concreta, de tipo numérico o texto, la cantidad de elementos se define por el mismo
								if (scans["scan"][scans["step"]] != 1) {
									isBusy_retro = false;
								}
								else {
									// reiniciar el step presente
									scans["scan"][scans["step"]] = 0;
									// Hacer el decremento
									if (scans["step"] != 0)
										scans["step"] -= 1;
									else {
										isBusy_retro = false;
										isBusy = false;
										scans["action_branch"] = "finalizar";
										scans["isChange"] = false;
									}
								}
							}
							else {
								// La key es un texto o un número concreto => Retroceder
								// reiniciar el step presente
								scans["scan"][scans["step"]] = 0;
								// Hacer el decremento
								if (scans["step"] != 0)
									scans["step"] -= 1;
								else {
									isBusy_retro = false;
									isBusy = false;
									scans["action_branch"] = "finalizar";
									scans["isChange"] = false;
								}
							}
						}

						// Si hay retroceso en curso => reiniciar el scan presente
						if (isBusy_retro) {
							// Retroceder el branch
							branch = scans["register"].pop();
						}
					} while (isBusy_retro);
				}
				// Avanzar para que no siga retrocediendo por su cuenta
				scans["action_branch"] = "avanzar";
				break;
			case "encontrado":
				scans["action_branch"] = "retroceder";
				break;
		}
	}

	return [scans, branch];
}

// Comparación Avanzada de Arrays
function filterCompare(array1, array2, configKey1 = [0], configKey2 = [0], configInsert = { "select": "array2", "config_select": ["*", ""] }) {
	let
		branch1 = array1,
		branch2 = array2,
		scans1 = {
			"step": 0,
			"scan": Array.isArray(configKey1) ? make_array_empty(configKey1.length, "int") : [0],
			"action_branch": "avanzar",
			"register": [],
			"isChange": 0
		},
		scans2 = {
			"step": 0,
			"scan": Array.isArray(configKey2) ? make_array_empty(configKey2.length, "int") : [0],
			"action_branch": "avanzar",
			"register": [],
			"isChange": 0
		},
		isFound,
		scan_element1,
		scan_element2,
		filter_concepts = [],
		data_insert,
		initialice = true;

	// Los datos que ingresan a la función son de tipo array, deberán de recorrerse porque hay que explorar cada una de las posibilidades, a menos que el configKey pida ingreso para acotar búsqueda
	// PENDIENTE: Hacer el proceso de ingreso con las configKeys.
	scan_array1 = 0;
	do {
		// Obtener los elementos de comparación
		// Hay que decir que hay cambio en el otro, para que se evaluen al comenzar, y decir que ya se usó al ponerlo en false.
		if (!scans2["isChange"] || initialice) {
			[scans1, branch1] = get_next_element(scans1, branch1, configKey1);
		}
		if (!scans1["isChange"] || initialice) {
			[scans2, branch2] = get_next_element(scans2, branch2, configKey2);
		}
		initialice = false;

		// Si hubo algún cambio en alguno de los elementos a comparar => compare.
		// -- Aún cuando existan errores, hay que seguir adelante, el show debe continuar.
		// ---- if (scans1["action_branch"].slice(0, 5) != "error" && (scans1["isChange"] || scans2["isChange"])) {

		if (scans1["isChange"] || scans2["isChange"]) {
			// Realizar comparación
			isFound = false;
			if (typeof (branch2) == "number") {
				if (branch2 >= 0 && branch2 < branch1.length) {
					// Marcar como encontrado
					isFound = true;
					// anexar el concepto encontrado a la lista
					data_insert = insert_data(configInsert, scans1["register"], scans2["register"]);
					filter_concepts.push(data_insert);
				}
			}
			else if (typeof (branch2) == "string") {
				if (typeof (branch1) == "string") {
					if (branch2 == branch1) {
						// Marcar como encontrado
						isFound = true;
						// anexar el concepto encontrado a la lista
						data_insert = insert_data(configInsert, scans1["register"], scans2["register"]);
						filter_concepts.push(data_insert);
					}
				}
				else if (Array.isArray(branch1)) {
					for (scan_element1 = 0; scan_element1 != branch1.length && !isFound; scan_element1++) {
						if (branch2 == branch1[scan_element1]) {
							// Marcar como encontrado
							isFound = true;
							// anexar el concepto encontrado a la lista
							data_insert = insert_data(configInsert, scans1["register"], scans2["register"]);
							filter_concepts.push(data_insert);
						}
					}
				}
			}
			else if (Array.isArray(branch2)) {
				for (scan_element1 = 0; scan_element1 != branch1.length && !isFound; scan_element1++) {
					for (scan_element2 = 0; scan_element2 != branch2.length && !isFound; scan_element2++) {
						if (branch1[scan_element1] == branch2[scan_element2]) {
							// Marcar como encontrado
							isFound = true;
							// anexar el concepto encontrado a la lista
							data_insert = insert_data(configInsert, scans1["register"], scans2["register"]);
							filter_concepts.push(data_insert);
						}
					}
				}
			}
		}
		else {
			// ya que putas => acabar
			scans1["action_branch"] = "finalizar";
			scans2["action_branch"] = "finalizar";
		}
	}
	while (scans1["action_branch"] != "finalizar" || scans2["action_branch"] != "finalizar" || scans1["isChange"] || scans2["isChange"]);

	return filter_concepts;
}


function insert_data(configInsert = { "select": "branch1", "config_select": ["^"] }, register_scans1, register_scans2) {
	// anexar el concepto encontrado a la lista
	let _register, select_level, simbol_config_select, result;
	switch (configInsert["select"]) {
		case "1":
			_register = register_scans1;
			break;
		case "2":
			_register = register_scans2;
			break;
		default:
			_register = configInsert["select"];
			break;
	}

	select_level = _register.length;
	result = _register;
	// código de configuración para saber cual valor retornar
	for (let scan_config_select = 0; scan_config_select != configInsert["config_select"].length; scan_config_select++) {
		simbol_config_select = configInsert["config_select"][scan_config_select];
		if (simbol_config_select == "^") {
			// seleccionar el que se encuentra un nivel por encima de lo encontrado
			select_level -= 1;
		}
		else if (simbol_config_select == "*") {
			// No se me ocurre nada para este símbolo :/
		}
		else if (simbol_config_select in _register[select_level]) {
			result = _register[select_level][simbol_config_select];
		}
	}

	// Ya conocido el select_level, obtener el valor que se desea retornar
	return result;
}

function getConsecutiveMatches(array, propertyPath, max_skipIgnore=0, targetValue, searchFromEnd = true, resultProperty = null) {
	if (!Array.isArray(array) || array.length === 0) return [];

	let result = [];
	let startIndex, endIndex, increment_step, cant_skipIgnore=0;

	// Definir índices y pasos según la dirección de búsqueda
	if (searchFromEnd) {
		startIndex = array.length - 1;
		endIndex = -1;
		increment_step = -1;
	} else {
		startIndex = 0;
		endIndex = array.length;
		increment_step = 1;
	}

	// Recorre el array y busca elementos consecutivos que coincidan
	for (let i = startIndex; i !== endIndex; i += increment_step) {
		let valueToCompare = getNestedValue(array[i], propertyPath);
		if (valueToCompare === targetValue) {
			if (resultProperty) {
				// Extrae el valor del resultProperty
				let extractedValue = getNestedValue(array[i], resultProperty);
				if (extractedValue !== undefined) {
					result.push(extractedValue);
				}
			} else {
				result.push(array[i]);
			}
		}
		else if (cant_skipIgnore !== max_skipIgnore) {
			cant_skipIgnore++;
		}
		else {
			break;
		}
	}

	// Devuelve el resultado; si se buscó desde el final, invierte el array para mantener el orden
	return searchFromEnd ? result.reverse() : result;
}


function into_branch_scans(scans, path_key = "") {
	if (path_key != "") {
		// Añadir al Registro
		scans.register.push(scans.branch[path_key]);
		// Avanzar al branch avisado como un primer nivel de key por el path_root, dado es de tipo Array.
		scans.branch = scans.branch[path_key];
	}
	else {
		// Añadir al Registro
		// - Se registra el branch actual para retroceder más tarde
		scans.register.push(scans.branch);
	}
	
	// Avanzar al siguiente level de anidamiento
	scans.branch = scans.branch[scans.scan[scans.level]];
	// Incrementar el índice de escaneo y el nivel:
	// - Incrementar el contador de branchs recorridas en el scan[level]
	// - Se realizan los incrementos para indicar en donde se debe ingresar en la próxima iteración que se regrese al presente branch/nodo
	scans.scan[scans.level]++;
	
	// No hay análisis de desbordamiento (de desbordarse el índice => saber que se deberá de dar la orden de retroceder)
	// - Dado el ingreso al elemento anidado => Incrementar el level
	scans.level++;
	
	return scans;
}

export { make_array_empty, copy_data, getNestedValue, getConsecutiveMatches, into_branch_scans };
