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
	},
	{
        "element": "Vacío Falso y Vacío Verdadero",
        "context": "Teoría cuántica de campos",
        "level": "Existencial",
        "description": "Un universo en un estado metastable que podría colapsar hacia un estado de energía más baja.",
        "potentialThreat": "Aniquilación de toda la materia existente."
    },
    {
        "element": "Strangelets",
        "context": "Física de partículas",
        "level": "Cataclísmico",
        "description": "Hipotéticas partículas de materia extraña que podrían convertir la materia ordinaria en materia extraña.",
        "potentialThreat": "Reacción en cadena devastadora."
    },
    {
        "element": "Entidades Cósmicas Incomprensibles",
        "context": "Mitología cósmica",
        "level": "Existencial",
        "description": "Seres o deidades que desafían las leyes de la realidad y la lógica.",
        "potentialThreat": "Acciones impredecibles y devastadoras."
    },
    {
        "element": "Energía Oscura y Materia Oscura",
        "context": "Cosmología",
        "level": "Misterioso",
        "description": "Fuerzas que componen la mayor parte del universo, cuya naturaleza es desconocida.",
        "potentialThreat": "Efectos desconocidos y potencialmente peligrosos."
    },
    {
        "element": "Fluctuaciones Cuánticas",
        "context": "Física cuántica",
        "level": "Cataclísmico",
        "description": "Fenómenos aleatorios a nivel subatómico que podrían desencadenar eventos catastróficos.",
        "potentialThreat": "Creación de agujeros negros microscópicos."
    },
    {
        "element": "Agujeros Negros",
        "context": "Astrofísica",
        "level": "Existencial",
        "description": "Regiones del espacio donde la gravedad es tan intensa que nada puede escapar.",
        "potentialThreat": "Horizontes de eventos que representan fronteras de lo desconocido."
    },
    {
        "element": "Multiverso y Universos Paralelos",
        "context": "Teoría de cuerdas",
        "level": "Existencial",
        "description": "Múltiples universos con diferentes leyes físicas.",
        "potentialThreat": "Infiltración de horrores inimaginables en nuestro universo."
    },
    {
        "element": "Rupturas en el Espacio-Tiempo",
        "context": "Relatividad general",
        "level": "Existencial",
        "description": "Anomalías y singularidades que distorsionan la realidad.",
        "potentialThreat": "Zonas donde las leyes del espacio y el tiempo no se aplican convencionalmente."
    },
    {
        "element": "Nanotecnología Descontrolada",
        "context": "Tecnología",
        "level": "Cataclísmico",
        "description": "Micromáquinas autoreplicantes que podrían consumir toda la materia.",
        "potentialThreat": "Escenario de la plaga gris."
    },
    {
        "element": "Catástrofes Existenciales",
        "context": "Astronomía",
        "level": "Apocalíptico",
        "description": "Eventos como supernovas y explosiones de rayos gamma que podrían borrar toda forma de vida.",
        "potentialThreat": "Aniquilación total."
    },
    {
        "element": "Civilizaciones Extraterrestres Hostiles",
        "context": "Exobiología",
        "level": "Existencial",
        "description": "Inteligencias alienígenas avanzadas con tecnologías incomprensibles.",
        "potentialThreat": "Motivaciones inescrutables y potencialmente peligrosas."
    },
    {
        "element": "Realidades Alternas",
        "context": "Física teórica",
        "level": "Misterioso",
        "description": "Dimensiones paralelas con leyes físicas diferentes.",
        "potentialThreat": "Infiltración de entidades o fenómenos peligrosos."
    },
    {
        "element": "Paradojas Temporales",
        "context": "Física cuántica",
        "level": "Existencial",
        "description": "Anomalías en el flujo del tiempo que crean eventos contradictorios.",
        "potentialThreat": "Desaparición de la realidad tal como la conocemos."
    },
    {
        "element": "Inteligencias Artificiales Superiores",
        "context": "Tecnología",
        "level": "Existencial",
        "description": "Máquinas con capacidades mucho más allá de las humanas.",
        "potentialThreat": "Decisiones y acciones incomprensibles y peligrosas."
    },
    {
        "element": "Virus y Patógenos Cósmicos",
        "context": "Exobiología",
        "level": "Biológico",
        "description": "Enfermedades del espacio profundo con efectos devastadores.",
        "potentialThreat": "Incurabilidad para la vida terrestre."
    },
    {
        "element": "Anomalías Energéticas",
        "context": "Física teórica",
        "level": "Cataclísmico",
        "description": "Fenómenos de energía pura que desintegran la materia.",
        "potentialThreat": "Zonas de distorsión espacial."
    },
    {
        "element": "Psicosis Colectiva",
        "context": "Psicología",
        "level": "Mental",
        "description": "Influencias que inducen locura masiva y alucinaciones colectivas.",
        "potentialThreat": "Comportamientos irracionales y peligrosos."
    },
    {
        "element": "Artefactos Alienígenas",
        "context": "Arqueología cósmica",
        "level": "Misterioso",
        "description": "Objetos de origen desconocido con poderes inexplicables.",
        "potentialThreat": "Alteración de la realidad y control mental."
    },
    {
        "element": "Ecosistemas Alienígenas",
        "context": "Exobiología",
        "level": "Biológico",
        "description": "Mundos con formas de vida y ecologías hostiles a la vida terrestre.",
        "potentialThreat": "Peligro para exploradores humanos."
    },
    {
        "element": "Parásitos Dimensionales",
        "context": "Exobiología",
        "level": "Existencial",
        "description": "Entidades que existen en dimensiones paralelas y pueden infectar seres vivos.",
        "potentialThreat": "Infecciones incomprensibles y aterradoras."
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