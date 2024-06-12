
function make_structHTML(select_contents, values) {
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
					else structHTML = "<p class='" + select_contents[0] + "'>" + "*" + value["text"] + "</p>";
				}
				else { }

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
		structHTML = structHTML.concat(make_structHTML(select_contents, newText));
	}

	return structHTML;
}