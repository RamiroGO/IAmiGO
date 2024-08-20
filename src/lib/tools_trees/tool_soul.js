import { tree2chain, chain2tree } from "./tool_tree.js";
import { desplazar_vector } from "../tool_vector_js.js";
import { copy_data } from "../tool_json.js";

function desplazar_vector_soul(vector_soul = { value: [], soul: { id: 0, level: 0, keys: [] } }, despla = 1) {
    let result = { value: [], soul: { tree: [], level: 0, keys: [] } };
    if (Array.isArray(vector_soul)) {
        result = desplazar_vector(vector_soul, despla);
    }
    else if (typeof (vector_soul) == "object") {
        result = copy_data(vector_soul, [{
            fcn: ((vector, despla) => desplazar_vector(vector, despla)),
            keys: ["roots", "value"],
            level: 0,
            parameter_fcn: despla
        }]);
    }

    return result;
}


function desplazar_matriz_soul(matriz, desplamientos) {
    const chain = tree2chain(matriz, "branch", (value, scans) => {
        return {
            value: value,
            soul: scans
        }
    });

    const desplazado_values_chain = chain.map(
        function (select_chain) {
            const newLocal = desplazar_vector_soul(select_chain, desplamientos[select_chain.soul.level]);
            return newLocal;
        }
    );

    // const chain_desplazada = desplazar_vector(values_chain, desplamientos);
    let tree2 = chain2tree(desplazado_values_chain);
    return tree2;
}


export { desplazar_vector_soul, desplazar_matriz_soul }
