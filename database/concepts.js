let concepts = [
	{
		"text": ["Hola"],
		"type": type_neuron["concepto"],
		"function": [
			{
				"cause":[{}],
				"efect": [
					{
						"type": type_relation["operacion"],
						"operator": operators["responder"],
						"root": ["Hola"]
					}
				]
			}
		]
	},
	{
		"text": ["dificultades"],
		"type": type_neuron["atributo"],
		"function": [
			{
				"cause": [
					{
						"type": type_relation["condición"],
						"operator": operators["pertenece"],
						"root": ["situación"]
					}
				],
				"efect": [{
					"type":type_relation[""]
				}]
			}
		]
	},
	{

		// PENDIENTE: Implementar invocaciones del tipo POO sobre las variables que contien a otras variables, para que sea posible hacer validaciones.
		"text": ["progreso"],
		"type": type_neuron["atributo"],
		"functions": [
			{
				"cause": [
					{
						"type": type_relation["condición"],
						"operator": operators["contiene"],
						"roots": ["rendimiento"]
					},
					{
						"type": type_relation["condición"],
						"operator": operators["pertenece"],
						"roots": ["cambio"]
					},
					{
						"type": type_relation["condición"],
						"operator": operators["pertenece"],
						"roots": ["ente"]
					}
				],
				"efect": [{}]
			},
			{
				"definition": [{}],
				"efect": [{}]
			}
		]
	},
	{
		"text": "Inteligencia Artificial",
		"context": ["progreso"],
		"type": ["concept"]
	},
	{
		"text": "Perceptrón (1957)",
		"context": ["dificultades", "historia", "perceptrón"],
		"type": ["concept"]
	},
	{
		"text": "Frank Rosenblatt (1928-1971)",
		"context": ["historia", "personaje", "perceptrón"],
		"type": ["concept"]
	},
	{
		"text": "Alan Turing (1936)",
		"context": ["historia", "personaje", "Alan Turing"],
		"type": ["concept"]
	},
	{
		"text": ["Fake News"],
		"context": ["Riesgos de la informática"],
		"type": ["concept"]
	},
	{
		"text": ["Vanidad"],
		"context": ["Riesgos de la informática"],
		"type": ["concept"]
	},
	{
		"text": ["Depresión"],
		"context": ["Riesgos de la informática"],
		"type": ["concept"]
	}
]


// Partes de la Dialéctica.
/**
 * Lista de afirmaciones como un Chat
 */
let affirma_chat_list = [

];
/**
 * Contexto de cada afirmación en el chat
 */
let context_chat_list = [

];

// Partes de una Neurona 
/** Lista de nombre de Conceptos */
const concept_neuro_list = [
	"Disciplina",
	"Ciencia",
	"Pseudo-Ciencia"
];
/** Lista de Etiquetas de los conceptos */
const tag_neuro_list = [

];

/** Lista de Contextos-Etiquetas de los conceptos */
const context_neuro_list = [
	"Programación-HTML"
];

/** Lista de Relaciones de los conceptos */
const react_neuro_list = [

];

// Partes de un Fundamento
/** Tipos de Contextos */
const type_context_list = [
	"Contexto Analítico",
	"Contexto Ontológico",
	"Contexto Representativo"
];

const elements_proyect = [
	"Base de Datos",
	"Interfaz",
	"Funciones",
	"Servidor",
	"Tecnologías",
	"Cálculos"
];

const pendiente_list = [
	"baile+comida=conteo de calorías",
	"article",
	"aside",
	"section",
	"insertBefore",
	"document.createDocumentFragment()",
	"https://aprende-web.net/librerias/",
	"Hacer las cosas ahora y no dejarlas para mañana porque no sabes que calamidades vendrán.",
	"En presencia de la gente tóxica, el carisma se convierte en una fuente de torpeza.",
	["intuición", "Se debe creer en tu propia experiencia, en la intuición que ya se posee, mientras se perfecciona para engendrar una nueva intuición; Debemos cortar los lazos con los pensamientos inútiles que surgen de manera natural-intrínseco del cuerpo y que no son necesarios para alcanzar el objetivo planteado ni las condiciones y criterios que se requieren para superar los problemas."],
]