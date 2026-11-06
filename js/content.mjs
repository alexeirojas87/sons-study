export const profiles = [
  { id: 'learner-a', name: 'Alessandro', grade: '6.º grado', subjects: ['math6', 'science6', 'geo6', 'english6'] },
  { id: 'learner-b', name: 'Adriano', grade: '3.º grado', subjects: ['math3', 'english3'] }
];

export const units = {
  math6: {
    title: 'Matemática', unit: 'Operaciones para decidir', mark: '×',
    roadmap: 'Misión disponible: operaciones con números naturales. Después: fracciones y decimales (libro, pp. 1–64). Más contenido próximamente.',
    scenario: 'La biblioteca recibe 6 cajas con 24 libros cada una. Quiere guardar 18 para otra sede y repartir el resto en 3 aulas. ¿Cuántos libros recibe cada aula?',
    why: 'Una operación no es solo una cuenta: representa una acción. Primero agrupamos lo recibido, luego retiramos la reserva y al final repartimos en partes iguales.',
    example: '6 × 24 = 144; 144 − 18 = 126; 126 ÷ 3 = 42 libros por aula. Comprobación: 42 × 3 + 18 = 144.',
    practice: [
      { id: 'm6-p1', question: '¿Cuántos libros llegan en total?', choices: ['30', '144', '126'], answer: 1, hint: 'Multiplica cajas por libros en cada caja.', explain: '6 × 24 = 144.' },
      { id: 'm6-p2', question: '¿Cuántos quedan para repartir después de la reserva?', choices: ['126', '42', '162'], answer: 0, hint: 'Resta los 18 que se guardan.', explain: '144 − 18 = 126.' },
      { id: 'm6-p3', question: '¿Qué cálculo comprueba el reparto?', choices: ['42 + 3 + 18', '42 × 3 + 18', '144 ÷ 18'], answer: 1, hint: 'Deshaz el reparto y luego sumá la reserva.', explain: '42 × 3 + 18 = 144, el total inicial.' }
    ],
    challenge: { id: 'm6-ch', question: 'Si se abre una cuarta aula y la reserva sigue siendo 18, ¿se puede repartir el resto en partes iguales sin libros sueltos?', choices: ['Sí, 31 por aula', 'No, sobran 2 libros', 'Sí, 32 por aula'], answer: 1, hint: 'Divide 126 entre 4 y mira el residuo.', explain: '126 = 4 × 31 + 2; sobran 2.' },
    extension: 'Diseña otro reparto justo: cambia SOLO el tamaño de la reserva para que 4 aulas reciban igual cantidad y no sobre ningún libro. Explica por qué tu nueva reserva funciona.',
    extensionCriteria: 'Comprueba que el total tras la reserva sea divisible entre cuatro.',
    reflection: 'Escribe qué operación elegiste primero y por qué. Rúbrica: nombrá las tres acciones, comprobá con la operación inversa y explicá el residuo del desafío.'
  },
  math3: {
    title: 'Matemática', unit: 'El valor de cada cifra', mark: '◇',
    roadmap: 'Misión disponible: números naturales hasta 10 000. Después: comparación, cálculos y problemas (libro, pp. 1–94). Más contenido próximamente.',
    scenario: 'En una feria se contaron 3 428 entradas. ¿Qué nos dice cada cifra sobre la cantidad?',
    why: 'Una cifra cambia de valor según el lugar donde está. Separar millares, centenas, decenas y unidades ayuda a leer, comparar y construir números.',
    example: '3 428 = 3 000 + 400 + 20 + 8. El 4 vale 400 porque está en las centenas, no 4.',
    practice: [
      { id: 'm3-p1', question: '¿Cuánto vale el 4 en 3 428?', choices: ['4', '40', '400'], answer: 2, hint: 'Mira la segunda posición desde la izquierda.', explain: 'El 4 está en las centenas: vale 400.' },
      { id: 'm3-p2', question: '¿Qué número forma 5 000 + 200 + 70 + 6?', choices: ['5 276', '5 726', '5 207'], answer: 0, hint: 'Ordena millares, centenas, decenas y unidades.', explain: '5 000 + 200 + 70 + 6 = 5 276.' },
      { id: 'm3-p3', question: '¿Cuál es mayor?', choices: ['3 428', '3 482', 'Son iguales'], answer: 1, hint: 'Compara de izquierda a derecha hasta hallar una diferencia.', explain: 'Los millares y centenas coinciden; 8 decenas es mayor que 2.' }
    ],
    challenge: { id: 'm3-ch', question: 'Con 2, 0, 7 y 4, sin repetir, ¿cuál es el mayor número de cuatro cifras?', choices: ['7 420', '7 402', '4 720'], answer: 0, hint: 'Pon la cifra mayor en el lugar de más valor.', explain: '7 420 pone las cifras mayores primero.' },
    extension: 'Construye el número MENOR de cuatro cifras con esas mismas cifras. Explica por qué el cero no puede ir primero y cómo elegiste cada lugar.',
    extensionCriteria: 'El primer dígito no puede ser cero; compara los valores posicionales.',
    reflection: 'Explica con tus palabras por qué el 2 vale diferente en 2 407 y 4 207. Rúbrica: mencioná la posición y el valor de cada 2.'
  },
  science6: {
    title: 'Ciencias Naturales', unit: 'Preguntar y probar', mark: '✳',
    roadmap: 'Misión disponible: investigación y pruebas justas. Después: observación y explicación de fenómenos (libro, pp. 1–24). Más contenido próximamente.',
    scenario: 'Dos semillas iguales brotan en vasos distintos. Una recibe mucha luz; la otra, poca. Queremos saber si la luz cambia su crecimiento.',
    why: 'Para investigar una causa cambiamos una sola condición y mantenemos las demás lo más iguales posible. Medimos y anotamos, en vez de adivinar.',
    example: 'Pon semillas del mismo tipo en vasos iguales, con la misma tierra y agua. Cambiá solo la luz. Medí la altura cada dos días durante dos semanas.',
    practice: [
      { id: 's6-p1', question: '¿Qué condición debemos cambiar?', choices: ['La luz', 'La luz y el agua', 'El tipo de semilla'], answer: 0, hint: 'La pregunta es sobre la luz.', explain: 'La luz es la variable que investigamos.' },
      { id: 's6-p2', question: '¿Qué conviene mantener igual?', choices: ['Solo el color del vaso', 'Semilla, tierra y agua', 'La altura final'], answer: 1, hint: 'Piensa qué otras causas podrían alterar el crecimiento.', explain: 'Mantener iguales semilla, tierra y agua hace la comparación más justa.' },
      { id: 's6-p3', question: '¿Cuál registro ayuda más?', choices: ['Me parece más alta', 'Altura en cm cada dos días', 'Una foto sin fecha'], answer: 1, hint: 'Busca una medida repetida con fecha.', explain: 'Las medidas periódicas permiten comparar cambios.' }
    ],
    challenge: { id: 's6-ch', question: 'Si un vaso recibió más agua, ¿podemos concluir que la luz causó toda la diferencia?', choices: ['Sí', 'No, el agua también cambió', 'Solo si el vaso era azul'], answer: 1, hint: '¿Cambió más de una condición?', explain: 'No: al cambiar también el agua, no podemos separar las causas.' },
    extension: 'Propón cómo repetirías la prueba si una semilla no brota. ¿Cuántos vasos usarías por condición y por qué?',
    extensionCriteria: 'Explica por qué repetir reduce el peso de un resultado aislado.',
    reflection: 'Escribe una predicción y una forma de comprobarla. Rúbrica: indicá qué cambias, qué mantenés y qué medís.'
  },
  geo6: {
    title: 'Geografía de Cuba', unit: 'Ubicar un lugar', mark: '⌖',
    roadmap: 'Misión disponible: localidad y orientación en mapas. Después: posición de Cuba y regiones (libro, pp. 1 y 10 en adelante). Más contenido próximamente.',
    scenario: 'En un plano sencillo, la escuela está al norte del parque y la biblioteca está al este del parque. Queremos indicar una ruta sin confundir posiciones.',
    why: 'Un mapa representa lugares desde arriba. La orientación y los puntos de referencia permiten describir una posición de forma que otra persona pueda seguirla.',
    example: 'Si arriba del plano es norte, desde el parque se llega a la escuela moviéndose al norte. Para llegar a la biblioteca se avanza al este.',
    practice: [
      { id: 'g6-p1', question: 'La escuela está al norte del parque. ¿En qué dirección está el parque desde la escuela?', choices: ['Norte', 'Sur', 'Este'], answer: 1, hint: 'Invertí la dirección.', explain: 'Desde la escuela, el parque queda al sur.' },
      { id: 'g6-p2', question: 'La biblioteca está al este del parque. ¿Dónde queda el parque desde la biblioteca?', choices: ['Oeste', 'Este', 'Norte'], answer: 0, hint: 'La dirección opuesta al este es...', explain: 'El parque queda al oeste de la biblioteca.' },
      { id: 'g6-p3', question: '¿Qué hace útil una leyenda?', choices: ['Decora el mapa', 'Explica los símbolos', 'Cambia el norte'], answer: 1, hint: 'Piensa en el significado de los dibujos del plano.', explain: 'La leyenda explica qué representa cada símbolo.' }
    ],
    challenge: { id: 'g6-ch', question: 'Desde la escuela, vas al parque y luego a la biblioteca. ¿Qué dos direcciones seguís?', choices: ['Sur y este', 'Norte y oeste', 'Este y sur'], answer: 0, hint: 'Recorré cada tramo por separado.', explain: 'Escuela → parque: sur; parque → biblioteca: este.' },
    extension: 'Dibuja un plano de tres lugares reales de tu localidad. Agrega una flecha norte y una leyenda; explicá qué información NO muestra tu plano.',
    extensionCriteria: 'Comprueba que el norte, los símbolos y la ruta sean coherentes.',
    reflection: 'Describe una ruta de dos tramos usando puntos cardinales y referencias. Rúbrica: origen, destino, dos direcciones y una referencia clara.'
  },
  english6: {
    title: 'Inglés', unit: 'Hi, friends!', mark: 'Hi',
    roadmap: 'Misión disponible: saludar y presentar a un amigo. Después: conversaciones de clase (libro, p. 1 en adelante). Más contenido próximamente.',
    scenario: 'Un estudiante nuevo llega a tu clase. Quieres saludarlo y presentarle a tu amigo.',
    why: '“This is…” sirve para presentar a otra persona. “Nice to meet you” es una respuesta amable al conocer a alguien.',
    example: 'A: Hi! I’m Alex. This is my friend Sam. B: Hello, Alex and Sam. Nice to meet you! A: Nice to meet you too.',
    practice: [
      { id: 'e6-p1', question: '¿Cómo presentas a un amigo?', choices: ['I am Sam friend.', 'This is my friend Sam.', 'Sam is this my.'], answer: 1, hint: 'Elige la frase que presenta a otra persona.', explain: '“This is my friend Sam” presenta a Sam.' },
      { id: 'e6-p2', question: '¿Qué respuesta es natural para “Nice to meet you”?', choices: ['Meet you nice too.', 'Nice meet you too.', 'Nice to meet you too.'], answer: 2, hint: 'Responde al saludo amable.', explain: '“Nice to meet you too” es una respuesta natural.' },
      { id: 'e6-p3', question: '¿Qué frase pregunta el nombre?', choices: ['What is your name?', 'What name your is?', 'Your name what is?'], answer: 0, hint: 'Busca “name”.', explain: '“What is your name?” pregunta el nombre.' }
    ],
    challenge: { id: 'e6-ch', question: 'No escuchaste el nombre del estudiante nuevo. ¿Qué dices con cortesía?', choices: ['Say your name again.', 'Could you say your name again, please?', 'What your name again?'], answer: 1, hint: 'Pide que repita su nombre con amabilidad.', explain: 'Una petición amable evita adivinar el nombre.' },
    extension: 'Escribe un diálogo de cuatro líneas para presentar a dos amigos. Incluye una petición amable para repetir un nombre y una despedida.',
    extensionCriteria: 'Verifica saludo, presentación, petición amable y despedida.',
    reflection: 'Escribe una frase para conocer a alguien y explica cuándo la usarías. Rúbrica: saludo, presentación y respuesta amable.'
  },
  english3: {
    title: 'Inglés', unit: 'Hello, classroom!', mark: 'Hi',
    roadmap: 'Misión disponible: saludos y presentación en clase. Después: preguntas y respuestas cortas (libro, pp. 1 y 11 en adelante). Más contenido próximamente.',
    scenario: 'Te encuentras con un compañero por la mañana. Quieres saludarlo y decirle tu nombre.',
    why: '“Good morning” es un saludo de la mañana. “My name is…” sirve para decir tu nombre.',
    example: 'A: Good morning! My name is Ana. B: Good morning, Ana! My name is Leo.',
    practice: [
      { id: 'e3-p1', question: '¿Qué puedes decir por la mañana?', choices: ['Good night!', 'Good morning!', 'Goodbye!'], answer: 1, hint: 'Elige el saludo para comenzar el día.', explain: '“Good morning” se usa por la mañana.' },
      { id: 'e3-p2', question: '¿Cómo puedes decir tu nombre?', choices: ['Name is my Leo.', 'I name Leo.', 'My name is Leo.'], answer: 2, hint: 'Comienza con “My name is…”', explain: '“My name is Leo” es una presentación completa.' },
      { id: 'e3-p3', question: 'Tu amigo dice “Hello!”. ¿Qué puedes responder?', choices: ['Hello!', 'Hellos!', 'I hello!'], answer: 0, hint: 'Return the greeting.', explain: '“Hello!” es una respuesta amable.' }
    ],
    challenge: { id: 'e3-ch', question: '¿Qué dices al salir del aula?', choices: ['Good morning!', 'Goodbye!', 'Hello!'], answer: 1, hint: 'Elige una despedida, no un saludo.', explain: '“Goodbye!” se usa al salir.' },
    extension: 'Dibuja dos compañeros y escribe un saludo corto para cada uno. Añade una despedida.',
    extensionCriteria: 'Verifica un saludo, una presentación con nombre y una despedida.',
    reflection: 'Escribe un saludo y tu presentación. Rúbrica: un saludo apropiado y “My name is…” con un nombre.'
  }
};
