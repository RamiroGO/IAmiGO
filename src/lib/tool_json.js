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
			default:
				break;
		}
	}

	return new_array;
}

// función para obtener el elemento contenido en una estructura object bajo una configuración preestablecida.
function get_next_element(scans = { "step": 0, "scan": [0], "action_branch": "avanzar", "register": [], "isChange": true }, branch = [[], "type"], configKey = [0]) {
	// Inicializar con asumir que no hay cambios.
	let isBusy = true;
	scans["isChange"] = false;
	while (isBusy && scans["action_branch"] != "encontrado") {
		switch (scans["action_branch"]) {
			case "avanzar":
				if (typeof (configKey) == "number") {
					if (configKey >= 0 && configKey < branch.length) {
						// Guardar un registro
						scans["register"].push(branch);

						// Dar salto hacia un número
						branch = branch[configKey];
						scans["scan"][scans["step"]] += 1;

						// Avisar que se dió un cambio
						scans["isChange"] = true;

						// Dar paso adelante
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
						scans["scan"][scans["step"]] += 1;

						// Avisar que se dió un cambio
						scans["isChange"] = true;

						// Dar paso adelante
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
				else if (isEqual(configKey, [])) {
					// No hay que hacer nada
					scans["action_branch"] = "encontrado";
				}
				else if (isEqual(configKey[scans["step"]], [])) {
					// Guardar un registro
					scans["register"].push(branch);

					// Dar salto hacia un paso numérico.
					branch = branch[scans["scan"][scans["step"]]]
					scans["scan"][scans["step"]] += 1;

					// avisar que se dió un cambio
					scans["isChange"] = true;

					// Dar paso adelante
					scans["step"] += 1;
					if (scans["step"] == configKey.length) {
						scans["action_branch"] = "encontrado";
					}
				}
				else if (typeof (configKey[scans["step"]]) == "string" || typeof (configKey[scans["step"]]) == "number") {
					if (configKey[scans["step"]] in branch) {
						// Guardar un registro
						scans["register"].push(branch);

						// Dar salto hacia una key
						branch = branch[configKey[scans["step"]]];
						scans["scan"][scans["step"]] += 1;

						// Avisar que se dió un cambio
						scans["isChange"] = true;

						// Dar paso adelante
						scans["step"] += 1;
						if (scans["step"] == configKey.length) {
							scans["action_branch"] = "encontrado";
						}
					}
					else {
						// No se puede proseguir => Cerrado abrupto de la exploración.
						scans["action_branch"] = "error no está " + configKey[scans["step"]] + " en '" + branch.text + "'";
						scans["isChange"] = false;
						isBusy = false;
					}
				}
				break;
			case "retroceder":
				// reiniciar el step presente
				scans["scan"][scans["step"]] = 0;
				// dar un paso atrás, o finalizar si ya se ha recorrido todo.
				if (scans["step"] == 0)
					scans["action_branch"] = "finalizar";
				else {
					// Retroceder el branch
					branch = scans["register"].pop();
					scans["step"] -= 1;

					// avisar que se dió un cambio
					scans["isChange"] = true;
				}
				scans["action_branch"] = "avanzar";
				break;
			case "encontrado":
				scans["action_branch"] = "retroceder";
				break;
		}
	}

	return [scans, branch];
}

// Función Avanzada para comparar dos arrays bajo una configuración preestablecida.
function filterCompare(array1, array2, configKey1 = [0], configKey2 = [0], configInsert = "Element2") {
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
		filter_concepts = [];

	// Los datos que ingresan a la función son de tipo array, deberán de recorrerse porque hay que explorar cada una de las posibilidades, a menos que el configKey pida ingreso para acotar búsqueda
	// PENDIENTE: Hacer el proceso de ingreso con las configKeys.
	scan_array1 = 0;
	do {
		// Obtener los elementos de comparación
		// Hay que decir que hay cambio en el otro, para que se evaluen al comenzar, y decir que ya se usó al ponerlo en false.
		if (!scans2["isChange"] || scans1["isChange"] == 0) {
			[scans1, branch1] = get_next_element(scans1, branch1, configKey1);
		}
		if (!scans1["isChange"] || scans2["isChange"] == 0) {
			[scans2, branch2] = get_next_element(scans2, branch2, configKey2);
		}

		// Si hubo algún cambio en alguno de los elementos a comparar => compare.
		if (scans1["action_branch"].slice(0, 5) != "error" && (scans1["isChange"] || scans2["isChange"])) {
			// Realizar comparación
			isFound = false;
			if (typeof (branch2) == "number") {
				if (branch2 >= 0 && branch2 < branch1.length) {
					// Marcar como encontrado
					isFound = true;
					// anexar el concepto encontrado a la lista
					filter_concepts.push(insert_data(configInsert));
				}
			}
			else if (typeof (branch2) == "string") {
				for (scan_element1 = 0; scan_element1 != branch1.length && !isFound; scan_element1++) {
					if (branch2 == branch1[scan_element1]) {
						// Marcar como encontrado
						isFound = true;
						// anexar el concepto encontrado a la lista
						filter_concepts.push(insert_data(configInsert));
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
							filter_concepts.push(insert_data(configInsert));
						}
					}
				}
			}
		}
		else {
			// ya que putas => acabar
			scans1["action_branch"] = "finalizar";
			scans2["action_branch"] = "finalizar";;
		}
	}
	while (scans1["action_branch"] != "finalizar" || scans2["action_branch"] != "finalizar" || scans1["isChange"] || scans2["isChange"]);

	return filter_concepts;

	function insert_data(configInsert) {
		// anexar el concepto encontrado a la lista
		switch (configInsert) {
			case "Element1":
				return array1;
			case "Element2":
				return array2;
			default:
				return configInsert;
		}
	}
}