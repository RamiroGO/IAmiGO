
function isContain(list_tag, value) {
	let is_exist = false;
	// - Recorrer la lista de tags ya insertada por el usuario
	for (let scan_tags = 0; scan_tags != list_tag.length && !is_exist; scan_tags++)
		if (list_tag[scan_tags] == value)
			is_exist = true;
	return is_exist;
}

/**
 * Eliminar el elemento _value de la lista _array
 * @param {Array} _array array para filtrar
 * @param {string} _value elemento a eliminar
 * */
function delElementArray(_array, _value) {
	let new_array = [];
	_array.forEach(element => {
		if (element != _value)
			new_array.push(element);
	});
	return new_array;
}
