
function scan_subContext() {
	let list_subcontext = ["sdasd"];

	let nameProyect2subContext_proyect = [

	];

	for (let index = 0; index < nameProyect2subContext_proyect.length; index++) {
		const element = nameProyect2subContext_proyect[index];

	}

	return list_subcontext;
}

/**
 * Eliminar Tag de la lista que el usuario generó y reincorporarlo a la lista de select-options
 * @param {*} sel_row_tag
 */
function delParameter($list_tags, sel_row_tag, list_tag_user) {
	if ($list_tags) {
		// Eliminar Row que representa el Tag previamente insertado por el usuario de la tabla de etiquetas en el HTML
		// El button tiene que subir dos niveles entre las etiquetas del HTML para que se pueda determinar cual fue el Row seleccionado
		$list_tags.deleteRow(sel_row_tag.parentNode.parentNode.rowIndex);

		// En caso de no tenerse etiquetas del usuario visibles => ocultar cuadro de lista de etiquetas del usuario
		if ($list_tags.childElementCount === 0) {
			document.getElementById("div_hidden_list_atrib").hidden = true;
			document.getElementById('btn_get_tag').hidden = true;
		}
	}
	// Eliminar elemento en el array
	list_tag_user.splice(sel_row_tag);

	// Actualizar la lista de select-options reincorporando los tags que le corresponde al usuario escoger
	insert_optionSelect();
}

/**
 * Mostrar la lista de tags seleccionados por el usuario en su panel correspondiente
 * @param {string} text valor que se quiere introducir como una fila con sus propios comandos para trabajar sobre el mismo.
 * @param {string} text_roots valores que se mostrarán en un menú desplegable que estará contenido dentro de la fila
 */
function make_rowTagHTML(text, text_roots) {
	let $td_nameTag, $td_botnDel, $label_param_newRow;

	// Cargar texto del elemento seleccionado por el usuario en un label.
	$label_param_newRow = document.createElement("label");
	$label_param_newRow.textContent = text;

	// Cargar label en un dato de columna
	$td_nameTag = document.createElement('td');
	$td_nameTag.appendChild($label_param_newRow);

	// Comandos del Parámetro
	// - Configurar el button para eliminar tag
	const $btn_tagDel = document.createElement('input');
	$btn_tagDel.type = 'submit'
	$btn_tagDel.classList.add("smallBtn");
	$btn_tagDel.value = "x";
	$btn_tagDel.onclick = function () { delParameter($list_tags, this, list_tag_user); };

	// Permitir al usuario ser mas específico en su Tag.
	const $select_subTag = document.createElement('select');

	// '$options2Select': Variable que contendrá los options previamente a cargarlos en el HTML: Mejora el Rendimiento
	let $options_subTag_noDOM = document.createDocumentFragment();
	const $option_subTag = document.createElement('option');
	$option_subTag.text = "--Seleccionar--";
	$options_subTag_noDOM.appendChild($option_subTag);
	text_roots.forEach(element => {
		const $option_subTag = document.createElement('option');
		$option_subTag.text = element;
		$options_subTag_noDOM.appendChild($option_subTag);
	});

	// Cargar los options en el select.
	$select_subTag.appendChild($options_subTag_noDOM);

	// Cargar Botón en una nueva celda.
	$td_botnDel = document.createElement("td");
	$td_botnDel.appendChild($btn_tagDel);

	// Cargar dato en un nuevo Row
	// Darle Estructura a los Elementos de la Lista de Etiquetas del Usuario
	const $_row = document.createElement('tr');
	$_row.appendChild($td_nameTag);
	// Cargar select-options para precisar información del Tag 
	$_row.appendChild($select_subTag);
	// Cargar celda con el botón de eliminar Tag en el mismo Row
	$_row.appendChild($td_botnDel);

	// Cargar Intencion-Row a la Tabla con la lista de Elementos del usuario en la vista del HTML
	return $_row;
}

function write_structHTML(select_contents, values) {
	// Establecer el estilo del texto "value" dependiendo de su "type"
	let structHTML = "";
	if (typeof (values) == "string")
		structHTML = "<p class='" + select_contents[0] + "'>" + "*" + values + "</p>";
	else if (typeof (values) == "object") {
		if (values.length > 0) {
			for (let scan_values = 0; scan_values != values.length; scan_values += 1) {
				const value = values[scan_values];

				if ("text" in value) {
					if (typeof (value["text"]) == "object") {
						// El primer elemento llevará un asterisco '*'
						structHTML += "<p class='" + select_contents[0] + "'> *" + value["text"][0] + "</p>";

						// comienza con el segundo elemento '1'.
						for (let scan_text_value = 1; scan_text_value != value["text"].length; scan_text_value++)
							if (typeof (value["text"][scan_text_value]) == "string")
								structHTML += "<p class='" + select_contents[0] + "'>" + value["text"][scan_text_value] + "</p>";
					}
					else structHTML = structHTML.concat("<p class='" + select_contents[0] + "'>" + "*" + value["text"] + "</p>");
				}
				else {
					value.forEach(_value => {
						if (typeof (_value["text"]) == "object") {
							// El primer elemento llevará un asterisco '*'
							structHTML += "<p class='" + select_contents[0] + "'> *" + _value["text"][0] + "</p>";

							// comienza con el segundo elemento '1'.
							for (let scan_text_value = 1; scan_text_value != _value["text"].length; scan_text_value++)
								if (typeof (_value["text"][scan_text_value]) == "string")
									structHTML += "<p class='" + select_contents[0] + "'>" + _value["text"][scan_text_value] + "</p>";
						}
						else structHTML += "<p class='" + select_contents[0] + "'>" + "*" + _value["text"] + "</p>";
					});
				}

				if ("img" in value)
					if (value["img"].length != 0) {
						value["img"].forEach(img_new_text => {
							structHTML = structHTML.concat("<img src='" + img_new_text + "' class='imagen_pequeña' alt='imagen'></img>");
						});
					}
			}
		}
	}
	return structHTML;
}

function edit_structHTML(structHTML, newText, select_contents) {
	if (typeof (newText) == "object") {
		// Lo que se desea insertar posee varios elementos.
		//#region Inicializar "value_text"
		if (typeof (structHTML) == "string") {
			if (structHTML == "")
				structHTML = []
			else
				structHTML = [structHTML];
		}
		//#endregion

		// Convertir el conjunto de la información requerida en HTML
		structHTML = structHTML.concat(write_structHTML(select_contents, newText));
	}

	return structHTML;
}

function showHTML(structHTML) {
	// Imprimir
	document.getElementById("texto").innerHTML = "";
	if (typeof (structHTML) == "string") {
		// Imprimir texto singular
		document.getElementById("texto").innerHTML = structHTML;
	}
	else if (typeof (structHTML) == "object") {
		// Imprimir múltiples líneas o elementos
		structHTML.forEach(parrafo_valueText => {
			document.getElementById("texto").innerHTML += parrafo_valueText;
		});
	}
}