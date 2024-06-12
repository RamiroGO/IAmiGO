function filter_select_concepts(database_concepts, select_contents) {
	//#region Buscar la información deseada a partir de lo solicitado
	let
		concept,
		filter_concepts = [],
		// Se hace dos types que se van a comparar
		scan_type1 = 0,
		isBusy_type1 = true,
		scan_concepts = 0,
		isBusy_concepts = true;

	//#region Buscar el contexto solicitado
	// Recorrer concepts
	while (isBusy_concepts) {
		concept = database_concepts[scan_concepts];

		const elementSame = filterCompare(concept, select_contents, ["type"], [0], "Element1");
		// Usar el filtro avanzado para filtrar lo solicitado
		if(elementSame.length != 0)
			filter_concepts.push(elementSame);

		// Control de Ciclo Concepts
		scan_concepts += 1;
		if (scan_concepts == database_concepts.length)
			isBusy_concepts = false;
	}
	//#endregion

	// Filtrar el concepto deseado:
	return filter_concepts[select_contents[1]]

	//#endregion
}
