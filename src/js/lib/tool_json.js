function filterCompare(array1, array2, configKey1 = [0], configKey2 = [0], configInsert = "Element2") {
	let
		scan_array1 = 0, scan_array2 = 0, isBusy_array1 = true, isBusy_array2 = true, filter_concepts = [],
		key1, key2,
		element1, element2;

	//#region Establecer cuales serán los elementos de comparación
	// PENDIENTE: aplicar función para ir dentro de una cadena de keys en el archivo "tool_json"
	if (configKey1 == [])
		element1 = array1[scan_array1];
	else {
		element1 = array1[configKey1[0]]; //[configKey1[1]];
	}

	if (configKey2 == [])
		element2 = array2[scan_array2];
	else {
		element2 = array2[configKey2[0]];
	}
	//#endregion

	// Realizar comparación
	if (typeof (element1) == "object" && typeof (typeof (element2) == "string"))
		for (let scan_element1 = 0; scan_element1 != element1.length; scan_element1++) {
			const _element1 = element1[scan_element1];
			if (_element1 == element2) {
				// anexar el concepto encontrado a la lista
				switch (configInsert) {
					case "Element1":
						filter_concepts.push(array1);
						break;
					case "Element2":
						filter_concepts.push(array2);
						break;
					default:
						filter_concepts.push(configInsert);
						break;
				}
			}
		}
	
	return filter_concepts;
}
