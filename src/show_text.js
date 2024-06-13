
// PENDIENTE: Generar imágenes y contenido con IA ChatGPT para la presentación e implementar código para ilustrarlas.

function showContent(selects_contents) {
	// selects_contents: [sel_type, sel_text, sel_parraf]

	// interpretar el contenido del texto para definir su valor.
	let
		structHTML = "",
		database_concepts = load_concepts_database(),
		newConcept = [];

	// Analizar la petición
	if (typeof (selects_contents[0]) == "object")
		selects_contents.forEach(select_contents => {
			newConcept = filter_select_concepts(database_concepts, select_contents, ["type", "context"]);
			structHTML = edit_structHTML(structHTML, newConcept, select_contents)
		});
	else {
		newConcept = filter_select_concepts(database_concepts, selects_contents, ["type", "context"]);
		structHTML = edit_structHTML(structHTML, newConcept, selects_contents);
	}
	
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

// 			<h2>Introducción a la IA</h2>
/* <p>Texto sobre la introducción a la IA...</p>
<img src="ruta/a/imagen_intro.jpg" alt="Imagen de Introducción">
</div>
<div id="desarrolladores" class="hidden">
<h2>IA y Desarrolladores</h2>
<p>Texto sobre IA y desarrolladores...</p>
<img src="ruta/a/imagen_desarrolladores.jpg" alt="Imagen de Desarrolladores">
</div>

<div id="empresas" class="hidden">
<h2>IA y Empresas</h2>
<p>Texto sobre IA y empresas...</p>
<img src="ruta/a/imagen_empresas.jpg" alt="Imagen de Empresas">
</div>

<div id="consumidores" class="hidden">
<h2>IA y Consumidores</h2>
<p>Texto sobre IA y consumidores...</p>
<div id="riesgos_consumidores" class="">
	<h2>Riesgos de la IA en los Consumidores</h2>
	<p>* Fake News</p>
	<p>* Vanidad</p>
	<p>* Depresión</p>
	<img src="ruta/a/imagen_consumidores.jpg" alt="Imagen de Consumidores">
</div>
<img src="ruta/a/imagen_consumidores.jpg" alt="Imagen de Consumidores">
</div>
<div>
Formatos: markdown y markmap */
