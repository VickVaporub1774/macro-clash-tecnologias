'use strict';
/* js/data.js : Catalogos: metas, alimentos, eventos, habilidades, fuentes */

/* =====================================================================
   2. DATOS DEL JUEGO
   ===================================================================== */
const GOALS={
 mus:{n:'Ganancia muscular',i:'💪',k:2300,p:160,c:290,f:70,d:'Más carbohidratos y calorías para construir fuerza.'},
 rec:{n:'Recomposición corporal',i:'⚖️',k:1700,p:150,c:170,f:55,d:'Proteína alta y calorías moderadas: más músculo, menos grasa.'},
 res:{n:'Resistencia atlética',i:'🏃',k:2100,p:110,c:330,f:60,d:'Muchos carbohidratos para aguantar rondas largas.'}
};
/* [emoji, nombre, kcal, proteína, carbos, grasa, ultraprocesado, descripción] */
const FOODS=[
 ['🍗','Pechuga de pollo 300 g',495,93,0,11,0,'Proteína magra completa para reparar músculo.'],
 ['🍚','Arroz integral 2 tazas',430,10,90,4,0,'Carbo complejo con fibra: energía sostenida.'],
 ['🍳','Huevos revueltos (5)',460,32,3,34,0,'Proteína de alta calidad; aporta bastante grasa.'],
 ['🥣','Avena con plátano grande',520,15,95,9,0,'Carbos y fibra ideales antes de entrenar.'],
 ['🥑','Aguacate (2)',480,6,26,44,0,'Grasas monoinsaturadas y potasio. Muy denso.'],
 ['🐟','Salmón 250 g',520,56,0,30,0,'Proteína más omega-3.'],
 ['🍕','Pizza grasosa (4 reb.)',1000,38,115,45,1,'Mucha grasa saturada y sodio.'],
 ['🥤','Refresco 1 L',420,0,106,0,1,'Azúcar añadida sin fibra ni nutrientes.'],
 ['⚡','Bebida energética (2)',440,0,110,0,1,'Azúcar y cafeína: afecta el sueño.'],
 ['🥗','Ensalada mixta con aceite',180,4,18,11,0,'Fibra y micronutrientes; pocas calorías.'],
 ['🫘','Frijoles con tortillas',560,22,100,7,0,'Combo mexicano: proteína vegetal, fibra y carbos.'],
 ['🥛','Yogur griego con fruta',380,24,50,9,0,'Proteína láctea y calcio, buen post-entreno.'],
 ['🥔','Papa al horno (3)',480,12,108,0,0,'Carbo saciante con potasio.'],
 ['🥫','Atún (3 latas) con pan',520,60,40,9,0,'Mucha proteína práctica y económica.'],
 ['🍔','Hamburguesa doble + papas',1150,50,100,62,1,'Exceso de grasa y sodio en una sola comida.'],
 ['🥩','Carne molida magra 250 g',440,50,0,25,0,'Proteína, hierro y vitamina B12.'],
 ['🧊','Tofu firme 400 g',280,32,8,17,0,'Proteína vegetal completa.'],
 ['🍙','Arroz blanco cocido 2 tazas',520,11,113,1,0,'Carbo de digestión rápida para recargar glucógeno.'],
 ['🍌','Plátano (3)',267,3,68,1,0,'Fruta práctica con potasio.'],
 ['🍝','Pasta cocida 400 g',632,23,124,4,0,'Gran recarga de glucógeno.'],
 ['🌮','Tortillas de maíz (6)',327,9,67,4,0,'Carbo nixtamalizado con calcio.'],
 ['🫒','Aceite de oliva 2 cdas',265,0,0,30,0,'Grasa saludable: pequeña porción, muchas kcal.'],
 ['🌰','Almendras 80 g',463,17,17,40,0,'Vitamina E, magnesio y grasas buenas.'],
 ['🥜','Crema de cacahuate 4 cdas',376,16,13,32,0,'Densa en energía; algo de proteína.'],
 ['🧠','Nueces 80 g',523,12,11,52,0,'Omega-3 vegetal; muy calóricas.'],
 ['🍲','Lentejas guisadas 2 tazas',460,36,80,2,0,'Proteína vegetal, hierro y mucha fibra.'],
 ['🧀','Queso panela con nopales',320,28,12,18,0,'Proteína y calcio, con fibra del nopal.'],
 ['🍠','Camote cocido 400 g',345,6,80,0,0,'Carbo con fibra y betacarotenos.'],
 ['🥪','Sándwiches integrales de pavo (2)',520,36,60,14,0,'Comida equilibrada y portátil.'],
 ['🥦','Verduras al vapor y quinoa',360,13,60,8,0,'Fibra, hierro y vitaminas.'],
 ['🥛','Leche (500 ml) con cacao natural',320,18,30,14,0,'Líquido, proteína y carbos para recuperarte.'],
 ['🍩','Donas glaseadas (3)',780,9,90,42,1,'Azúcar y grasa con casi cero saciedad.'],
 ['🍜','Sopa instantánea (2)',760,16,102,32,1,'Altísima en sodio y baja en proteína.'],
 ['🍟','Nuggets fritos + catsup',690,28,58,38,1,'Rebozado y fritura: poca proteína por caloría.'],
 ['🌯','Burrito de frijol y pollo',640,40,72,18,0,'Comida completa: proteína, carbos y fibra en una tortilla.'],
 ['🥚','Claras (8) con espinacas',150,29,4,1,0,'Proteína casi pura con muy pocas calorías.'],
 ['🍓','Fresas y arándanos 2 tazas',133,2,33,1,0,'Carbo ligero con antioxidantes y fibra.'],
 ['🍎','Manzanas (2)',190,1,50,0,0,'Fruta con fibra: saciante y portátil.'],
 ['🌽','Elote con queso y limón',280,9,42,10,0,'Carbo de antojito mexicano; modera la mayonesa.'],
 ['🥞','Hotcakes de avena (4)',420,22,58,10,0,'Desayuno con proteína y carbos de absorción lenta.'],
 ['🍤','Camarones a la plancha 250 g',255,58,2,3,0,'Proteína muy magra con yodo y selenio.'],
 ['🍖','Muslos de pollo sin piel (3)',480,58,0,26,0,'Proteína jugosa con más grasa que la pechuga.'],
 ['🧋','Licuado de proteína con leche',300,34,18,9,0,'Práctico después de entrenar.'],
 ['🍫','Barra de proteína comercial',220,20,22,7,1,'Cómoda, pero casi siempre ultraprocesada: no sustituye comida.'],
 ['🥬','Sopa de verduras con pollo',320,28,30,8,0,'Hidrata, aporta fibra y proteína con pocas kcal.'],
 ['🧆','Garbanzos cocidos 2 tazas',540,29,90,8,0,'Proteína vegetal, carbos lentos, hierro y fibra.'],
 ['🍨','Helado de crema 2 tazas',540,9,64,28,1,'Azúcar y grasa saturada con poca saciedad.'],
 ['🍪','Galletas rellenas (10)',490,5,70,22,1,'Calorías vacías: azúcar, harina refinada y grasa.']
];
/* Se muestran de 0 a 100 */
const STATS=[['STR','Fuerza','#A855F7'],['STA','Resistencia','#22D3EE'],['REC','Recuperación','#818CF8'],['ENG','Energía','#C084FC'],['HP','Salud metab.','#22C55E']];
const EVENT_DAYS=[2,3,5,6,8,10,11,13];
/* e: emoji+título, q: dilema, o: [texto, efectos, ¿acierto?, explicación] */
const EVENTS=[
 {t:'📱 El polvo mágico del influencer',q:'Un influencer jura que su polvo te marca el abdomen en 3 días. Cuesta $900.',o:[
  ['Comprarlo',{HP:-6,ENG:-5},0,'No existe la pérdida de grasa localizada ni un abdomen en 3 días. Muchos de esos polvos son diuréticos, laxantes o estimulantes: pierdes agua, no grasa.'],
  ['Ignorarlo y seguir tu plan',{HP:5,REC:3},1,'La grasa abdominal baja con déficit calórico sostenido, proteína suficiente, fuerza y sueño. Ningún polvo lo reemplaza.'],
  ['Consultar a un nutriólogo certificado',{HP:4,STR:2,REC:2},1,'Un profesional ajusta el plan a tu cuerpo y evita que gastes en promesas sin evidencia.']]},
 {t:'📚 Examen mañana',q:'Tienes examen y quieres tomar 3 bebidas energéticas sin dormir.',o:[
  ['Tomarlas y estudiar toda la noche',{REC:-8,HP:-5,ENG:-8},0,'La cafeína no sustituye al sueño: sin dormir se consolida peor la memoria y empeora la recuperación.'],
  ['Dormir 7-8 h y repasar temprano',{REC:7,HP:3,ENG:5},1,'Dormir consolida lo aprendido y favorece la reparación muscular.'],
  ['Una bebida y dormir 4 h',{REC:-3,ENG:-2},0,'Es un punto medio, pero dormir tan poco sigue afectando recuperación y rendimiento.']]},
 {t:'🥩 "Solo proteína, cero carbos"',q:'Un amigo presume su dieta sin carbohidratos y te reta a imitarla.',o:[
  ['Aceptar el reto',{STA:-5,ENG:-10},0,'Con muy pocos carbohidratos bajan tus reservas de glucógeno: suele caer el rendimiento en entrenamientos intensos.'],
  ['Explicarle que los carbos son combustible',{STA:3,ENG:5,HP:2},1,'Los carbohidratos reponen glucógeno muscular. La proteína repara; no es tu fuente principal de energía.']]},
 {t:'🎂 Cumpleaños con pizza y refresco',q:'Hay pizza, pastel y refresco ilimitado.',o:[
  ['Comer sin control',{HP:-5,STA:-4},0,'Un día no arruina tu progreso, pero el atracón de grasa y azúcar genera pesadez y picos de glucosa.'],
  ['Porción moderada y a bailar',{HP:3,STA:2},1,'Disfrutas sin culpa y mantienes el hábito. La constancia importa más que la perfección.'],
  ['No comer en todo el día para compensar',{ENG:-8,HP:-3},0,'Saltarte comidas suele acabar en atracones y te deja sin energía para entrenar.']]},
 {t:'🦵 Agujetas fuertes',q:'Te duelen muchísimo las piernas y quieres entrenarlas igual.',o:[
  ['Entrenar al límite de todos modos',{REC:-6,STR:-2},0,'Castigar un músculo sin recuperar acumula fatiga y aumenta el riesgo de lesión.'],
  ['Descanso activo, proteína y sueño',{REC:7,HP:2},1,'Caminar suave, comer proteína y dormir bien ayudan a recuperarte.'],
  ['Antiinflamatorio todos los días',{HP:-5,REC:-2},0,'Abusar de antiinflamatorios puede dañar estómago y riñón. No los uses a diario sin indicación médica.']]},
 {t:'🧪 "La creatina destruye riñones"',q:'Un compañero te advierte que ni se te ocurra probar creatina.',o:[
  ['Creerle y difundirlo',{STR:-1},0,'La creatina monohidratada es de los suplementos más estudiados. En personas sanas y a dosis habituales (3-5 g/día) no se ha demostrado daño renal.'],
  ['Revisar evidencia y preguntar a un profesional',{STR:4,HP:2},1,'Correcto: es útil para fuerza en muchas personas, pero con enfermedad renal, o si eres menor de edad, primero consulta.'],
  ['Tomar 25 g diarios "para que pegue"',{HP:-5,ENG:-2},0,'Más no es mejor: dosis altas sin necesidad causan molestias digestivas y gasto inútil.']]},
 {t:'🥵 Calor de 35 °C',q:'Toca entrenar al mediodía y casi no has tomado agua.',o:[
  ['Entrenar con sudadera para sudar más',{HP:-7,STA:-3},0,'Sudar más no quema más grasa: pierdes agua y te arriesgas a un golpe de calor.'],
  ['Hidratarte y bajar la intensidad',{STA:4,HP:3},1,'Beber antes, durante y después y evitar las horas de más calor protege tu rendimiento y tu salud.'],
  ['Esperar a tener muchísima sed',{ENG:-6,STA:-2},0,'Llegar deshidratado ya reduce tu rendimiento. Empieza hidratado.']]},
 {t:'📵 Scroll a las 2 a.m.',q:'Llevas una hora viendo videos en la cama y mañana entrenas.',o:[
  ['"Uno más" hasta que me dé sueño',{REC:-6,ENG:-6},0,'La pantalla retrasa tu hora de dormir. Poco sueño aumenta el apetito y reduce la fuerza.'],
  ['Dejar el celular fuera y apagar la luz',{REC:6,ENG:4},1,'Un horario regular y un cuarto oscuro mejoran la calidad del sueño.'],
  ['Tomar pastillas de dormir de un familiar',{HP:-8},0,'Nunca uses medicamentos sin receta ajena: pueden ser peligrosos.']]},
 {t:'💉 "Un ciclo y listo"',q:'En el vestidor te ofrecen anabólicos "para llegar fuerte a la competencia".',o:[
  ['Aceptar solo esta vez',{HP:-14,REC:-4,STR:3},0,'Sin control médico alteran hormonas, corazón, hígado y estado de ánimo; además el producto clandestino puede estar contaminado.'],
  ['Decir que no y seguir tu proceso',{HP:6,STR:2},1,'El progreso con entrenamiento, comida y sueño es más lento, pero es tuyo y es seguro.']]},
 {t:'⏱️ La "ventana anabólica"',q:'No hay tu batido y alguien dice que si no tomas proteína en 30 min pierdes el entreno.',o:[
  ['Entrar en pánico y comprar el más caro',{ENG:-3},0,'La ventana es mucho más amplia de lo que dice el mito.'],
  ['Comer bien en las siguientes horas',{REC:4,STR:2},1,'Importa más el total diario de proteína, repartido en varias comidas, que el minuto exacto.'],
  ['No comer nada hasta mañana',{REC:-5,ENG:-6},0,'Tampoco: tu cuerpo necesita proteína y carbohidratos para recuperarse.']]},
 {t:'🧃 Detox de jugos',q:'Tu prima propone 3 días de puro jugo verde para "limpiar toxinas".',o:[
  ['Hacerlo con ella',{ENG:-10,STR:-3,HP:-2},0,'Hígado y riñones ya hacen esa limpieza. Con puro jugo te faltan proteína y energía.'],
  ['Comer verduras enteras en tus comidas',{HP:5,REC:2},1,'La verdura entera conserva fibra y sacia más. Sin necesidad de ayunos extremos.']]},
 {t:'🔥 Fajas "quema grasa"',q:'Venden una faja térmica que promete derretir la cintura mientras entrenas.',o:[
  ['Usarla apretada',{HP:-4,STA:-2},0,'Solo te hace sudar esa zona: el peso vuelve al beber agua y puede dificultar la respiración.'],
  ['Ahorrar y enfocarte en constancia',{HP:3,STA:2},1,'La grasa se usa de todo el cuerpo según tu balance energético total.']]},
 {t:'🤒 Amaneciste con fiebre',q:'Hoy tocaba tu entrenamiento más pesado.',o:[
  ['"Sudar la fiebre" entrenando',{HP:-9,REC:-5},0,'Entrenar con fiebre es riesgoso para el corazón y prolonga la enfermedad.'],
  ['Descansar, hidratarte y consultar si empeora',{HP:5,REC:5},1,'Un descanso a tiempo cuesta menos que una recaída.']]},
 {t:'🍻 Fiesta tras entrenar',q:'Después de una gran sesión te invitan a "celebrar" toda la noche.',o:[
  ['Desvelarte y beber alcohol',{REC:-8,HP:-5,ENG:-6},0,'El alcohol y el desvelo frenan la recuperación y la síntesis de músculo. Y en menores, no hay cantidad segura.'],
  ['Ir un rato, sin alcohol, y dormir',{REC:3,HP:2},1,'Puedes convivir sin sacrificar tu recuperación.']]},
 {t:'🌅 Entrenar en ayunas',q:'Leíste que entrenar sin desayunar "quema el doble de grasa".',o:[
  ['Hacer la sesión más pesada sin comer nada',{ENG:-8,STR:-2},0,'Con el mismo balance calórico, el ayuno no ofrece ventaja clara para perder grasa y puede bajar tu rendimiento.'],
  ['Comer algo ligero con carbos antes',{ENG:6,STA:3},1,'Un plátano o avena te da combustible para rendir mejor.']]}
];
const SKILLS=[
 ['🏋️ Repetición Pesada','Daño según tu Fuerza',10],
 ['🏃 Sprint Metabólico','Resistencia + Energía; le quita aire a Braulio',15],
 ['🧘 Respiración y Técnica','Recupera HP según Salud Metabólica',6],
 ['⚡ Golpe de Glucógeno','Definitivo: exige 8 días con buenos carbos',30]
];
const BRO_QUIPS=['¡Los carbos de noche engordan!','¡Cardio mata las ganancias!','¡Sin dolor no hay músculo!','¡Dormir es para débiles!','¡500 g de proteína o nada!','¡Hoy no toca pierna!'];
const SOURCES=[
 ['ISSN: proteína y ejercicio (2017)','https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0177-8'],
 ['ISSN: creatina (2017)','https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0173-z'],
 ['ACSM/AND: nutrición y rendimiento (2016)','https://pubmed.ncbi.nlm.nih.gov/26917108/']
];

