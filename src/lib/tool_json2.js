
// función para obtener el elemento contenido en una estructura object bajo una configuración preestablecida.
function get_next_element(scans = { "step": 0, "scan": [0], "action_branch": "avanzar", "register": [], "isChange": true }, branch = [[], "type"], configKey = [0]) {
	// Inicializar con asumir que no hay cambios.
	let isBusy = true;
	scans["isChange"] = false;
	switch (scans["action_branch"]) {
		case "encontrado":
			scans["action_branch"] = "retroceder";
			break;
		default:
			break;
	}

	while (isBusy && scans["action_branch"] != "encontrado") {
		switch (scans["action_branch"]) {
			case "avanzar":
				if (typeof (configKey) == "number") {
					if (configKey >= 0 && configKey < branch.length) {
						// Guardar un registro
						scans["register"].push(branch);

						// Dar salto hacia un número
						branch = branch[configKey];
						scans["scan"][scans["step"]] += 1;

						// Avisar que se dió un cambio
						scans["isChange"] = true;

						// Dar paso adelante
						scans["step"] += 1;
						scans["action_branch"] = "encontrado";
					}
					else {
						// No se puede proseguir => Cerrado abrupto de la exploración.
						scans["action_branch"] = "error no está " + configKey + " en '" + branch.text + "'";
						scans["isChange"] = false;
						isBusy = false;
					}
				}
				else if (typeof (configKey) == "string") {
					if (configKey in branch) {
						// Guardar un registro
						scans["register"].push(branch);

						// Dar salto hacia una key
						branch = branch[configKey];
						scans["scan"][scans["step"]] += 1;

						// Avisar que se dió un cambio
						scans["isChange"] = true;

						// Dar paso adelante
						scans["step"] += 1;
						scans["action_branch"] = "encontrado";
					}
					else {
						// No se puede proseguir => Cerrado abrupto de la exploración.
						scans["action_branch"] = "error no está " + configKey + " en '" + branch.text + "'";
						scans["isChange"] = false;
						isBusy = false;
					}
				}
				else if (Array.isArray(configKey)) {
					if (isEqual(configKey, [])) {
						// No hay que hacer nada
						scans["action_branch"] = "encontrado";
					}
					else if (isEqual(configKey[scans["step"]], [])) {
						// Guardar un registro
						scans["register"].push(branch);

						// Dar salto hacia un paso numérico.
						branch = branch[scans["scan"][scans["step"]]]
						scans["scan"][scans["step"]] += 1;

						// avisar que se dió un cambio
						scans["isChange"] = true;

						// Dar paso adelante
						scans["step"] += 1;
						if (scans["step"] == configKey.length) {
							scans["action_branch"] = "encontrado";
						}
					}
					else if (typeof (configKey[scans["step"]]) == "string" || typeof (configKey[scans["step"]]) == "number") {
						if (configKey[scans["step"]] in branch) {
							if (Array.isArray(branch) && (scans["scan"][scans["step"]] == branch.length)) {
								scans["action_branch"] = "retroceder";
							}
							else if (typeof (branch) == "string") {
								scans["action_branch"] = "encontrado";
								
								// Avisar que se dió un cambio
								scans["isChange"] = true;
							}
							else {
								// Avisar que se dió un cambio
								scans["isChange"] = true;

								// Dar paso adelante
								scans["step"] += 1;
								if (scans["step"] == configKey.length) {
									scans["action_branch"] = "encontrado";
								}
							}
						}
						else {
							// No se puede proseguir => Cerrado abrupto de la exploración.
							scans["action_branch"] = "error no está " + configKey[scans["step"]] + " en '" + branch.text + "'";
							scans["isChange"] = false;
							isBusy = false;
						}
					}
					else if (typeof (configKey[scans["step"]]) == "undefined") {
						// En este caso, se debe recorrer la chingada de manera numérica
						// Guardar un registro
						scans["register"].push(branch)

						// Dar salto hacia una key; pero la key es numérica y está inventada
						// porque no está explícita en ninguna parte, por lo que se implementará el mismo scans["step"] para contabilizar los tramos
						branch = branch[scans["step"]];
						scans["scan"][scans["step"]] += 1;

						// Avisar que se dió un cambio
						scans["isChange"] = true;

						// Dar paso adelante
						scans["step"] += 1;
						if (scans["step"] == configKey.length) {
							scans["action_branch"] = "encontrado";
						}
					}
				}
				break;
			case "retroceder":
				// reiniciar el step presente
				scans["scan"][scans["step"]] = 0;
				// dar un paso atrás, o finalizar si ya se ha recorrido todo.
				if (scans["step"] == 0)
					scans["action_branch"] = "finalizar";
				else {
					// Retroceder el branch
					branch = scans["register"].pop();
					scans["step"] -= 1;

					// avisar que se dió un cambio
					scans["isChange"] = true;
				}
				scans["action_branch"] = "avanzar";
				break;
			case "encontrado":
				scans["action_branch"] = "retroceder";
				break;
		}
	}

	return [scans, branch];
}
