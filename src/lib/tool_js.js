
function isContain(list_tag, value) {
	let is_exist = false;
	// - Recorrer la lista de tags ya insertada por el usuario
	for (let scan_tags = 0; scan_tags != list_tag.length && !is_exist; scan_tags++)
		if (list_tag[scan_tags] == value)
			is_exist = true;
	return is_exist;
}
