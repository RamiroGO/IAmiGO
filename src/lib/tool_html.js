/**
 *  Poblar las opciones del select 'id_sel_tag', excepto aquellos tags que ya están siendo usados en la 'list_tag_user'
 * @param {HTMLSelectElement} $selectHTML Elemento de tipo select en el html en el cual se insertarán los datos
 */
function $insert_optionSelect($selectHTML, list_option, cleanOptions = true, excludes_option = []) {
	let $newOptionTag;

	if (cleanOptions)
		// Borrar elementos pre-existentes en la lista
		// excepto el elemento por defecto "--Seleccionar--". porque es bueno tenerlo.
		$selectHTML.options.length = 1;

	// Solo por optimizar un ciclo for, se implementa un if que diferencia cuando se excluyen y cuando no se van a excluir los options
	if (notEqual(excludes_option, []))
		// Recorrer la lista de proyectos que quieres mostrar para que pueda accionar el usuario.
		list_option.forEach(_option => {
			// Si el tag no ha sido introducido, insertelo como una opción para el usuario en el $select_tag. 
			if (!isContain(excludes_option, _option)) {
				// Generar un nuevo elemento 'option' para el 'select'
				$newOptionTag = document.createElement('option');

				// Darle un texto al elemento 'option' correspondiente con la información recibida de la petición.
				$newOptionTag.text = _option;

				// Añadir el nuevo elemento 'option' al elemento 'select'
				$selectHTML.options.add($newOptionTag);
			}
		});
	else
		// Recorrer la lista de proyectos que quieres mostrar para que pueda accionar el usuario.
		list_option.forEach(_option => {
			// Generar un nuevo elemento 'option' para el 'select'
			$newOptionTag = document.createElement('option');

			// Darle un texto al elemento 'option' correspondiente con la información recibida de la petición.
			$newOptionTag.text = _option;

			// Añadir el nuevo elemento 'option' al elemento 'select'
			$selectHTML.options.add($newOptionTag);
		});
}
