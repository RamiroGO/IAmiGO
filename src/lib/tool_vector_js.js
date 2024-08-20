
function get_max_scans(tree_soul, keys_position = []) {
	let result = [], branch = tree_soul, index = 0;
	result.length = keys_position.length;

	while (index != keys_position.length && keys_position[index] != branch.length) {
		result[index] = branch.length;
		branch = branch[keys_position[index]];
		index++;
	}

	if (index != keys_position.length)
		result[index] = branch.length;

	return result;
}

function desplazar_vector(vector = [], despla = 1) {
	let
		result = [], scan_matriz = 0, position;
	result.length = vector.length;
	if (typeof (despla) != "number")
		console.alert("el desplazamiento en un vector debe ser numérico");

	// Llenar los primeros con los últimos
	if (vector.length != 0) {
		for (; scan_matriz != vector.length - despla; scan_matriz++) {
			position = scan_matriz + despla;
			while (position >= vector.length) position -= vector.length;
			result[scan_matriz] = vector[position];
		}
		// Llenar los últimos con los primeros
		for (; scan_matriz != vector.length; scan_matriz++) {
			position = scan_matriz - vector.length + 1;
			while (position >= vector.length) position -= vector.length;
			result[scan_matriz] = vector[position];
		}
	}
	return result;
}

function findMatches(array1 = [], array2 = [], fcn_compare = (value1, value2) => value1 === value2) {
	let matches = [], index;

	// Verifica si ambos arrays tienen la misma longitud
	if (array1.length !== array2.length)
		throw new Error("Arrays must have the same length");

	// Itera sobre los arrays para encontrar coincidencias
	for (index = 0; index !== array1.length; index++)
		if (fcn_compare(array1[index], array2[index]))
			matches.push(index);

	return matches;
}

export { get_max_scans, findMatches, desplazar_vector }
