// La clave mental está en la invocación
// Se debe separar la variable del operador de las variables de entradas de dicho operador.
// "biscecleteando" es solo una palabra compuesta.
// Lo cierto es que no vas a saber que operación será la que necesitas, dicha operación es una deducción intuitiva - heurístico.

function operation(sel_operation, inputs) {
	let result;
	switch (sel_operation) {
		case "+":
			result = 0
			inputs.forEach(element => {
				result += element;
			});
			break;
		default:
			break;
	}
	return result;
}


function decimal2baseArray(value, base_new = 2, length_Array = 0) {
	let
		result = [],
		cifra,
		temp_value = value,
		scanArray = 0;

	while (temp_value != 0) {
		cifra = temp_value % base_new;
		result.push(cifra);
		temp_value = (temp_value - cifra) / base_new;
		scanArray += 1;
	}

	// Rellenar espacios vacios
	if (length_Array > result.length) {
		while (scanArray != length_Array) {
			result.push(0);
			scanArray += 1;
		}
	}

	return result;
}

function truthTable2synapticWeight(truthTable) {
	
}