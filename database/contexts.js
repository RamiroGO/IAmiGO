// Operadores:
// * Son los que determinan la forma de la sitaxis
// * le darán la forma a la manera en la que se procesarán los datos.

const
	type_neuron = {
		"contexto": "contexto",
		"concepto": "concepto",
		"frase": "frase",
		"relacion": "relacion",
		"atributo": "atributo"
	},
	// Diferentes tipos de relaciones tendrían diferentes propósitos en un campo lógico deóntico.
	// Los contextos se relacionan entre sí, así como espacios que comparten una puerta.
	type_relation = {
		"operacion": "operacion",
		"causal": "causal",
		"condición": "condición"
	},
	operators = {
		"=": "=",
		"equivalente": "equivalente",
		"!=": "!=",
		"<=": "<=",
		"<": "<",
		">": ">",
		">=": ">=",
		"pertenece": "pertenece",
		"no pertenece": "no pertenece",
		"contiene": "contiene"
	},
	name_context_list = [
	/* 00  */  "Científico",
	/* 01  */  "Matemáticas",
	/* 02  */  "Geometría",
	/* 03  */  "Física",
	/* 04  */  "Química",
	/* 05  */  "Biología",
	/* 06  */  "Medicina",
	/* 07  */  "Psicología",
	/* 08  */  "Filosofía",
	/* 09  */  "Economía",
	/* 10  */  "Gastronomía"
];;

let db_contexts = [
	{
		"text": ["Científico"],
		"type": ["context", "contexto"]
	},
	{
		"text": ["historia"],
		"type": ["context", "contexto"],
		"topics": [""],
	},
	{
		"text": ["política"],
		"type": ["context", "contexto"],
		"topics": ["comportamiento humano", "constructo"],
	},
	{
		"text": ["frases"],
		"type": ["context", "contexto"],
		"topics": ["comportamiento humano", "constructo"],
	},
	{
		"text": ["constructo"],
		"type": ["context", "contexto"],
		"topics": ["comportamiento humano", "constructo"],
	}
];

/** Tipos de Fundamentos */
const type_fundament_list = [
	"Inmaterial",
	"Material"
];

/** Lista de Nombres de Fundamentos */
const fundament_list = [
	"Suma",
	"Resta",
	"Multiplicación",
	"División"
];

// Lógica de Etiquetas
const rel_context = [
	[1, 0], // Matemáticas: Ciencia
	[2, 1]  // Geometría: Matemáticas
	[3, 1]  // Física: Matemáticas
];

const type_razonamiento = [
	"inductivo",
	"deductivo",
	"abductivo"
];
