
function filter_arrays_byConfigs(database_concepts, select_contents, key_selects_contents) {
	let filter_concepts = [];
	for (scan_concepts = 0; scan_concepts != database_concepts.length; scan_concepts++) {
		const coincidences = filterCompare(database_concepts[scan_concepts], select_contents, key_selects_contents, [], "Element1");
		// Usar el filtro avanzado para filtrar lo solicitado
		if (coincidences.length != 0)
			filter_concepts.push(...coincidences);
	}
	return filter_concepts;
}

function filter_select_concepts(database_concepts, selects_contents, keys_selects_contents = ["type", "context"]) {
	//#region Buscar la información deseada a partir de lo solicitado
	let filter_concepts = database_concepts;

	for (let scan_selects_contents = 0; scan_selects_contents != selects_contents.length; scan_selects_contents++)
		filter_concepts = filter_arrays_byConfigs(
			filter_concepts,
			selects_contents[scan_selects_contents],
			keys_selects_contents[scan_selects_contents]
		);
	
	return filter_concepts;
}
