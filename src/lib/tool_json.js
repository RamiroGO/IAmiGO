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

// Función Avanzada para comparar dos arrays bajo una configuración preestablecida.
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
		if (scans1["action_branch"].slice(0, 5) != "error" && (scans1["isChange"] || scans2["isChange"])) {
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
	let _value, select_level, simbol_config_select;
	switch (configInsert["select"]) {
		case "1":
			_value = register_scans1;
			break;
		case "2":
			_value = register_scans2;
			break;
		default:
			_value = configInsert["select"];
			break;
	}

	select_level = _value.length;
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
	}

	// Ya conocido el select_level, obtener el valor que se desea retornar
	return _value[select_level];
}