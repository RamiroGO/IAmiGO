// ts -estrict

// Variables Globales
// Invocar al elemento de selección en el HTML
const $select_tag = document.getElementById('id_sel_tag');
const $btn_set_tag = document.getElementById('btn_set_tag');
const $btn_get_tag = document.getElementById('btn_get_tag');
const $list_atrib = document.getElementById('list_atrib');
const $list_tags = document.getElementById('list_tags');

///////////////////////////////
// Lista-registro de tags que ha intruducido el usuario
let list_tag_user = [];

let cant_tags = 0;
// Funciones Globales

// Funciones de Eventos:
/**
 * EVENTO: Después de cargar la página.
 * Poblar los tags en el select-option, a partir de las opciones que ofrece la base de datos con todos los nombres de los Proyectos presentes para el accionar del Usuario.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Cargar el $select_tag con los posibles tipos de neuronas que se requerirían para hacer una solicitud.
  const keys_type_neuron = Object.keys(type_neuron);
  $insert_optionSelect($select_tag, keys_type_neuron);
});

/**
 * EVENTO: Una vez seleccionada la intención => Hacer visibles los botones para aceptarla
 */
$select_tag.addEventListener('change', function () {
  document.getElementById('btn_set_tag').hidden = false;
});

/**
 * EVENTO: Una vez establecida la intención => Hacer visibles el botón para aceptar y realizar consulta con los tags establecidos
 */
$btn_set_tag.addEventListener('click', function () {

  if ($select_tag.value != "--Seleccionar--") {
    let is_exist_tag;
    // Hacer Visible el Botón para hacer petición al servidor.
    document.getElementById('btn_get_tag').hidden = false;
    // Hacer visible el div de la tabla de atributos del usuario
    document.getElementById('div_hidden_list_atrib').hidden = false;

    // Revisar si el tag ya se encontraba repetido
    is_exist_tag = isContain(list_tag_user, $select_tag.value);

    // Insertar etiqueta en la lista del usuario.
    if (!is_exist_tag) {
      list_tag_user.push($select_tag.value);

      let subcontext = ["asd", "das"]
      // Mostrar la lista de Tags que ha seleccionado el usuario
      $list_tags.appendChild(make_rowTagHTML($select_tag.value, subcontext));

      const keys_type_neuron = Object.keys(type_neuron);
      
      // Modificar la lista de tags principal-inicial en el select-option del usuario
      $insert_optionSelect($select_tag, keys_type_neuron);
    }
    else {
      alert('ya existe');
    }
  }
});

/**
 * EVENTO: Después de seleccionar una de las opciones en el select.
 * Generar una tabla con los parámetros correspondientes al tipo de tag que se ha seleccionado, según lo establezca la definición del servidor para tal Tag
 */

$btn_get_tag.addEventListener('click', function () {

  if (list_tag_user.length != 0) {

    // Capturamos el elemento de listas de parámetros
    let
      $new_row, $new_td, $new_btn, $label_param_newRow, $value_param_newRow,
      $list_tags = document.getElementById("list_tags");

    // Hacer visible el div de la tabla de parámetros
    document.getElementById('div_hidden_list_param').hidden = false;

    // Obtener la lista de los nombres de los parámetros para el Tag seleccionado.
    list_paramsTag = process_tags(list_tag_user);

    list_paramsTag.forEach(parameterTag => {
      if (parameterTag != "") {
        // Visualizar datos en tabla
        $new_row = document.createElement('tr');

        // Nombre del Parámetro
        $label_param_newRow = document.createElement("label");
        $label_param_newRow.textContent = parameterTag;
        $new_td = document.createElement("td");
        $new_td.appendChild($label_param_newRow);
        $new_row.appendChild($new_td);

        // Valor del Parámetro
        $value_param_newRow = document.createElement("input");
        $value_param_newRow.placeholder = "Ingresar Valor";
        $new_td = document.createElement("td");
        $new_td.appendChild($value_param_newRow);
        $new_row.appendChild($new_td);

        // Comandos del Parámetro
        // - Configurar el button
        $new_btn = document.createElement("button");
        $new_btn.textContent = "Eliminar Campo";
        $new_btn.classList.add("smallBtn");
        $new_btn.onclick = function () { delParameter($list_tags, this); };
        $new_td = document.createElement("td");
        $new_td.appendChild($new_btn);
        $new_row.appendChild($new_td);

        // Cargar Row del Parámetro en la vista del HTML
        $list_atrib.appendChild($new_row);
        cant_tags++;
      };
    });

    function process_tags() {
      let list_paramsTag = ["Hi1", "Hi2", "Hi3"];
      return list_paramsTag;
    }
  };
});
