function clean_canvas(imgData_ctxCanvas) {
	for (let i = 0; i != imgData_ctxCanvas.data.length; i += 4) {
		imgData_ctxCanvas.data[i + 0] = 0;
		imgData_ctxCanvas.data[i + 1] = 0;
		imgData_ctxCanvas.data[i + 2] = 0;
		imgData_ctxCanvas.data[i + 3] = 255;
	}
	return imgData_ctxCanvas;
}

function Dibujar_Figur2D(imgData_ctxCanvas=[[]], forma = "linea", vertices2D = {coords: [[0,0], [100,100]], pos_ini_correct: [0,0]}, colorsRGBA = [[0,255,255,255], [255,0,255,255]]) {
	switch (forma) {
		case "linea":
			let teta;
			let dib_vert1, dib_vert2, inc_ang = [0, 0];
			let despla = [0, 0];
			let old_ref;

			// Proceso para aceptar posiciones negativas en el primer vértice
			dib_vert1 = [vertices2D.coords[0][0] - vertices2D.pos_ini_correct[0], vertices2D.coords[0][1] - vertices2D.pos_ini_correct[1]];
			despla = [0, 0];

			if (dib_vert1[0] < 0 || dib_vert1[1] < 0) {
				if (dib_vert1[0] < 0) {
					old_ref = round_math(vertices2D.pos_ini_correct[0]); // para conocer el desplazamiento, se debe conocer la variación entre la vieja referencia y la nueva.
					vertices2D.pos_ini_correct[0] = vertices2D.coords[0][0]; // se actualiza la referencia con el valor más negativo.
					despla[0] = round_math(vertices2D.pos_ini_correct[0]) - old_ref; // calcular el desplazamiento.
				}
				if (dib_vert1[1] < 0) {
					old_ref = round_math(vertices2D.pos_ini_correct[1]); // para conocer el desplazamiento, se debe conocer la variación entre la vieja referencia y la nueva.
					vertices2D.pos_ini_correct[1] = vertices2D.coords[0][1]; // se actualiza la referencia con el valor más negativo.
					despla[1] = round_math(vertices2D.pos_ini_correct[1]) - old_ref; // calcular el desplazamiento.
				}
				Matriz_RGB_Values = desplazar_matriz(Matriz_RGB_Values, despla, 4);
			}

			// Proceso para aceptar posiciones negativas en el segundo vértice
			dib_vert2 = [vertices2D.coords[1][0] - vertices2D.pos_ini_correct[0], vertices2D.coords[1][1] - vertices2D.pos_ini_correct[1]];
			despla = [0, 0];

			if (dib_vert2[0] < 0 || dib_vert2[1] < 0) {
				if (dib_vert2[0] < 0) {
					old_ref = round_math(vertices2D.pos_ini_correct[0]); // para conocer el desplazamiento, se debe conocer la variación entre la vieja referencia y la nueva.
					vertices2D.pos_ini_correct[0] = vertices2D.coords[1][0]; // se actualiza la referencia con el valor más negativo.
					despla[0] = round_math(vertices2D.pos_ini_correct[0]) - old_ref; // calcular el desplazamiento.
				}
				if (dib_vert2[1] < 0) {
					old_ref = round_math(vertices2D.pos_ini_correct[1]); // para conocer el desplazamiento, se debe conocer la variación entre la vieja referencia y la nueva.
					vertices2D.pos_ini_correct[1] = vertices2D.coords[1][1]; // se actualiza la referencia con el valor más negativo.
					despla[1] = round_math(vertices2D.pos_ini_correct[1]) - old_ref; // calcular el desplazamiento.
				}
				Matriz_RGB_Values = desplazar_matriz(Matriz_RGB_Values, despla);
			}

			// Recalcular ambos vértices con sus debidas correcciones tras las expansiones.
			dib_vert1[0] = vertices2D.coords[0][0] - vertices2D.pos_ini_correct[0];
			dib_vert1[1] = vertices2D.coords[0][1] - vertices2D.pos_ini_correct[1];
			dib_vert2[0] = vertices2D.coords[1][0] - vertices2D.pos_ini_correct[0];
			dib_vert2[1] = vertices2D.coords[1][1] - vertices2D.pos_ini_correct[1];

			// Expandir las dimensiones de la matriz, para contener ambos vértices.
			RGB_Expand_Linea(dib_vert1, dib_vert2);

			// Proceso de dibujar una línea
			teta = Math.atan2(dib_vert2[1] - dib_vert1[1], dib_vert2[0] - dib_vert1[0]);
			inc_ang[0] = Math.cos(teta);
			inc_ang[1] = Math.sin(teta);

			let distancia = Math.sqrt(Math.pow(dib_vert2[0] - dib_vert1[0], 2) + Math.pow(dib_vert2[1] - dib_vert1[1], 2));
			let color1 = [(coloRGB1 & 0xFF0000) >> 16, (coloRGB1 & 0x00FF00) >> 8, coloRGB1 & 0x0000FF];
			let color2 = [(coloRGB2 & 0xFF0000) >> 16, (coloRGB2 & 0x00FF00) >> 8, coloRGB2 & 0x0000FF];
			let pendColor = [
				(color2[0] - color1[0]) / distancia,
				(color2[1] - color1[1]) / distancia,
				(color2[2] - color1[2]) / distancia
			];

			let dist_max = 500, corre_dist = 0;
			while (corre_dist != dist_max && !(
				dib_vert1[0] < dib_vert2[0] - 1.5 && dib_vert1[0] > dib_vert2[0] - 1.5 &&
				dib_vert1[1] < dib_vert2[1] - 1.5 && dib_vert1[1] > dib_vert2[1] - 1.5
			)) {
				if (0 <= dib_vert1[0]) {
					if (Matriz_RGB_Values.length > dib_vert1[0]) {
						if (Matriz_RGB_Values[Math.floor(dib_vert1[0])] !== null) {
							if (0 <= dib_vert1[1]) {
								if (Matriz_RGB_Values[Math.floor(dib_vert1[0])].length > dib_vert1[1]) {
									Matriz_RGB_Values[Math.floor(dib_vert1[0])][Math.floor(dib_vert1[1])] =
										((color1[0] & 0xFF) << 16) | ((color1[1] & 0xFF) << 8) | (color1[2] & 0xFF);
								}
							}
						}
					}
				}

				corre_dist++;
				dib_vert1[0] += inc_ang[0];
				dib_vert1[1] += inc_ang[1];
				color1[0] += pendColor[0];
				color1[1] += pendColor[1];
				color1[2] += pendColor[2];
			}

			break;

		default:
			break;
	}
	
	return imgData_ctxCanvas;
}