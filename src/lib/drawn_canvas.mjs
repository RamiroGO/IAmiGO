function IsDentro(CoordElement, CoordArea, SizeArea) {
    if (CoordElement[0] < CoordArea[0] + SizeArea[0] && CoordElement[0] > CoordArea[0] - SizeArea[0] &&
        CoordElement[1] < CoordArea[1] + SizeArea[1] && CoordElement[1] > CoordArea[1] - SizeArea[1]) {
        return true;
    }
    else {
        return false;
    }
}

/**
 * Función de Gráficos
 */
function Graficar(sel_canvas, datosShow) {
    const
        canvas_raw = document.getElementById(sel_canvas),
        ctx_canvasRaw = canvas_raw.getContext('2d'),
        x_txt = 10,
        x_ini = 35,
        y_fin = 10,
        y_ini = canvas_raw.clientHeight - y_fin,
        x_fin = canvas_raw.clientWidth - x_txt,
        x_rngCanvas = canvas_raw.clientWidth - x_ini - x_txt,
        y_rngCanvas = canvas_raw.clientHeight - (2 * y_fin),

        max_datos = Math.max(...datosShow),
        min_datos = Math.min(...datosShow),
        x_inc = datosShow.length > 1 ? x_rngCanvas / (datosShow.length - 1) : 1;

    // Controlar Eje Y:
    let
        y_iniData = 0, y_inc_CanvData = y_rngCanvas / max_datos, cantMax_y_label = 10, rng_datos = max_datos - min_datos, y_inc_label;

    // Controlar los labels del eje 'y' de la gráfica.
    // Si solo hay un solo dato.
    if (rng_datos == 0) {
        rng_datos = max_datos;
        cantMax_y_label = 1;
    } else if (rng_datos < min_datos) {
        // Si el rango de los datos es inferior a su escala => ajustar el origen del eje 'y' de la gráfica al valor mínimo de los datos.
        y_iniData = min_datos;
    }
    else {
        // Visualizar todo el rango del eje y.
        rng_datos = max_datos;
    }
    // Primera Graficación
    _Graficar_();

    // Eventos del Mouse
    canvas_raw.addEventListener('mouseleave', () => _Graficar_());
    canvas_raw.addEventListener('mousemove', (event_canvas) => {
        // Inicializar Canvas con datos estadísticos.
        _Graficar_();
        // Obtener la posición relativa del cursor a partir de las posiciones absolutas del cursor con respecto al navegador y la posición de elemento canvas que contiene al cursor.  
        const
            posX_mouse_canvas = window.event.x + document.body.scrollLeft - event_canvas.target.offsetLeft,
            posY_mouse_canvas = window.event.y + document.body.scrollTop - event_canvas.target.offsetTop;

        if (IsDentro([posX_mouse_canvas, posY_mouse_canvas], [x_ini, y_fin], [x_rngCanvas, y_rngCanvas])) {
            // Calcular el elemento-dato mas cercano al cursor.
            const
                sel_dato = Math.round((posX_mouse_canvas - x_ini) * (datosShow.length - 1) / x_rngCanvas);
            let
                posX_card_mouse_canvas = x_ini,
                posY_card_mouse_canvas;

            if (datosShow.length != 1) {
                posX_card_mouse_canvas += sel_dato * x_rngCanvas / (datosShow.length - 1);
                // La tarjeta del último dato necesita un corrimiento a la izquierda para verse completa.
                if (sel_dato == datosShow.length - 1)
                    posX_card_mouse_canvas -= x_ini;

            } else {
                posX_card_mouse_canvas += x_ini;
            }

            posY_card_mouse_canvas = canvas_raw.clientHeight - ((datosShow[sel_dato] - y_iniData) * y_rngCanvas / rng_datos);
            if (posY_card_mouse_canvas > canvas_raw.clientHeight - 12) posY_card_mouse_canvas = canvas_raw.clientHeight - 12;

            // Insertar texto sobre el cursor.// Create gradient
            let gradient = ctx_canvasRaw.createLinearGradient(0, 0, 160, 0);
            gradient.addColorStop("0", " magenta");
            gradient.addColorStop("0.5", "blue");
            gradient.addColorStop("1.0", "red");
            // Fill with gradient
            ctx_canvasRaw.fillStyle = gradient;
            ctx_canvasRaw.font = "10px Verdana";
            ctx_canvasRaw.fillText(datosShow[sel_dato], posX_card_mouse_canvas, posY_card_mouse_canvas);
        }
    });

    function _Graficar_() {
        y_inc_CanvData = y_rngCanvas / rng_datos;
        y_inc_label = y_rngCanvas / cantMax_y_label;

        // Comenzar Dibujado del BackGround.
        ctx_canvasRaw.beginPath();
        ctx_canvasRaw.fillStyle = "aqua";
        ctx_canvasRaw.fillRect(0, 0, canvas_raw.clientWidth, canvas_raw.clientHeight);

        // Establecer área para la Gráfica.
        ctx_canvasRaw.beginPath();
        ctx_canvasRaw.fillStyle = "#FFFFFF";
        ctx_canvasRaw.fillRect(x_ini, y_fin, x_rngCanvas, y_rngCanvas);

        // Dibujar figura cerrada como Marco del Área de Trabajo del Canvas.
        ctx_canvasRaw.moveTo(x_ini, y_ini);
        ctx_canvasRaw.lineTo(x_fin, y_ini);
        ctx_canvasRaw.lineTo(x_fin, y_fin);
        ctx_canvasRaw.lineTo(x_ini, y_fin);
        ctx_canvasRaw.closePath(); // Regresar el trazo al moveTo

        // Escribir valores de referencia.
        // set line color
        ctx_canvasRaw.lineWidth = 1.5;
        ctx_canvasRaw.strokeStyle = '#000000';

        // Ejecutar dibujo
        ctx_canvasRaw.stroke();

        // Comenzar Dibujado + Label de ejes.
        ctx_canvasRaw.beginPath();
        // Color, Tamaño y Tipo de letra en valores de referencia en los ejes.
        ctx_canvasRaw.fillStyle = 'black';
        ctx_canvasRaw.font = "8px Arial";

        // Dibujar primera línea desde el origen.
        ctx_canvasRaw.moveTo(x_ini, y_ini);

        // Dibujar Información del vector 'datos'
        const y_ref = y_ini + y_iniData * y_inc_CanvData;
        for (let index = 0, x_pos_data, y_pos_data; index != datosShow.length; index++) {
            x_pos_data = x_ini + (index * x_inc);
            y_pos_data = y_ref - (datosShow[index] * y_inc_CanvData);
            ctx_canvasRaw.lineTo(x_pos_data, y_pos_data);
            // texto de referencia en 'x'
            ctx_canvasRaw.fillText(index, x_pos_data - 3, y_ini + 8);

            // Escribir cada dato presente en el arreglo como parte del label del eje 'y'.
            ctx_canvasRaw.fillText(
                (typeof datosShow[index] != 'number' ? datosShow[0][0] : datosShow[index]).toFixed(2),
                x_txt - 7,
                y_pos_data + 3.3
            );
        }

        // En caso de no ser suficientes datos => Dibujar una última línea.
        if (datosShow.length < 2) {
            // Última línea de referencia en 'x'
            ctx_canvasRaw.lineTo(x_fin, y_ini - datosShow[0] * y_inc_CanvData);
            // ctx_canvasRaw.lineTo(x_fin, y_fin);
            // Último texto de referencia en 'x'
            ctx_canvasRaw.fillText(datosShow.length, x_fin - x_txt + 8, y_ini + 8);

            // Escribir el cero '0' en el eje 'y'
            ctx_canvasRaw.fillText((0).toFixed(2), x_txt - 7, y_ini + 3);
        }

        // set line color
        ctx_canvasRaw.lineWidth = 1;
        ctx_canvasRaw.strokeStyle = '#ff0000';

        // Dibujar valores de referencia en el eje 'y'
        for (let index = 0; index != cantMax_y_label + 1; index++) {
            // texto de referencia en 'y'
            ctx_canvasRaw.fillText(
                (y_iniData + (index * rng_datos / cantMax_y_label)).toFixed(2),
                x_txt - 7,
                y_ini - (index * y_inc_label) + 3
            );
        }

        // Ejecutar dibujo
        ctx_canvasRaw.stroke();
        
    }
}

function Tabla_canvasHTML(sel_canvas, soportes) {
    const
        canvas_raw = document.getElementById(sel_canvas),
        ctx = canvas_raw.getContext('2d');
    let data = "<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>" +
        "<foreignObject width='100%' height='100%'>" +
        "<div xmlns='http://www.w3.org/1999/xhtml' style='font-size:40px'>" +
        "<table border='1'><tr><td>row 1, cell 1</td><td>row 1, cell 2</td></tr><tr><td>row 2, cell 1</td><td>row 2, cell 2</td></tr></table>" +
        "</div>" +
        "</foreignObject>" +
        "</svg>";

    var DOMURL = self.URL || self.webkitURL || self;
    var img = new Image();
    var svg = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
    var url = DOMURL.createObjectURL(svg);
    img.onload = function () {
        ctx.drawImage(img, 0, 0);
        DOMURL.revokeObjectURL(url);
    };
    img.src = url;
}
function Tabla_HTML(sel_table, dataBase) {
    // Variable Locales
    const
        table = document.getElementById(sel_table);

    let
        head_table = document.createElement('thead'),
        row_head,
        row_head_fragment,
        dat_rowHead,
        body_table = document.createElement('tbody'),
        body_table_fragment,
        row_bodyTable_fragment,
        cell_rowBody,
        tfoot_new = document.createElement('tfoot');

    // 'row_head_fragment' para la inserción de datos en la fila.
    row_head_fragment = document.createDocumentFragment();

    // Recorrer Soportes para el row del BodyTable.
    dataBase.soportes.forEach(soporte => {
        dat_rowHead = document.createElement('th');
        dat_rowHead.appendChild(document.createTextNode(soporte));

        // Insertar celda en la fila
        row_head_fragment.appendChild(dat_rowHead);
    });

    // Solo se requiere de una fila en el thead
    row_head = document.createElement('tr');
    // Cargar los soportes en una fila
    row_head.appendChild(row_head_fragment);
    // Cargar la fila en el head.
    head_table.appendChild(row_head);

    // 'body_table_fragment' para la inserción de filas en el tbody
    body_table_fragment = document.createDocumentFragment();

    // Recorrer filas para el BodyTable
    for (let corre_row = 0; corre_row != dataBase.datos.length; corre_row++) {
        // 'row_bodyTable_fragment' para la inserción de datos en cada fila en el tbody
        row_bodyTable_fragment = document.createDocumentFragment();

        // Generar nueva fila de datos
        row_bodyTable_fragment = document.createElement('tr');

        for (let corre_col = 0; corre_col != dataBase.datos[corre_row].length; corre_col++) {
            const _info = document.createTextNode(dataBase.datos[corre_row][corre_col]);

            // Generar nueva celda-columna
            cell_rowBody = document.createElement('td');
            cell_rowBody.appendChild(_info);
            cell_rowBody.index_table = [corre_col, corre_row];

            // Evento de Interrupción por pasar el mouse sobre la tabla
            // - Colorear celdas verticales
            cell_rowBody.addEventListener('mouseenter', (event_cell) => style_column(event_cell.target, 'yellowgreen', 'green'));
            cell_rowBody.addEventListener('mouseleave', (event_cell) => style_column(event_cell.target));

            // Insertar dato en la fila
            row_bodyTable_fragment.appendChild(cell_rowBody);
        }

        // Insertar fila en el 'body-table'
        body_table_fragment.appendChild(row_bodyTable_fragment);
    }

    // Cargar las filas en el body
    body_table.appendChild(body_table_fragment);

    // Cargar los elementos head y body en la tabla.
    table.appendChild(head_table);
    table.appendChild(body_table);

    function style_column(target_event_cell, color_column = '', color_cell = '') {
        // Color de la columna seleccionada.
        const $body_table = body_table.getElementsByTagName('tr');
        for (let index_row = 0; index_row != $body_table.length; index_row++)
            $body_table[index_row]
                .getElementsByTagName('td')[target_event_cell.index_table[0]]
                .style.backgroundColor = color_column;

        // Color del elemento seleccionado.
        target_event_cell.style.backgroundColor = color_cell;
    }
}

let drawn_canvas = { Graficar, Tabla_HTML, Tabla_canvasHTML };

// export { drawn_canvas };