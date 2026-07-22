# Modelo de Negocio (Asesorías) — notas para el equipo

Este documento es un resumen de lo que hice en el feature de "Modelo de negocio" dentro de Asesorías, para que cualquiera del equipo entienda rápido el estado real sin tener que leerse el código completo.

## Qué construí

Es el wizard de 16 pasos que sigue la maqueta que me pasaron (Ficha, Introducción, Antecedentes, Justificación, Objetivos, los 9 bloques del Canvas y el cierre con Conclusiones y FODA). Los 16 pasos están terminados: validan campos obligatorios, tienen navegación de Anterior/Siguiente, guardan borrador, y en el paso de costos calculé la proyección financiera a 5 años igual que en la maqueta original.

También agregué algo que no estaba en la maqueta pero que hacía falta: un listado en `/asesorias/modelo-negocio` que muestra los modelos guardados por emprendedor, con su estado (Borrador o Completado). Al terminar el wizard te manda directo a ese listado.

Reutilicé en todo momento los patrones que ya existían en `registro-emprendedor` (mismo estilo de store con Zustand, mismos componentes de formulario, misma forma de armar los pasos), no inventé nada nuevo a propósito.

Un detalle técnico que vale la pena que sepan: el store de este wizard es uno solo (global), no uno por emprendedor. Probé primero tener un store separado por cada id y me dio problemas raros de que la pantalla no se actualizaba aunque el dato sí cambiaba internamente (algo del entorno con Turbopack/React 19, no logré aislar la causa exacta). Terminé usando un solo store que cambia de "sesión" según el id activo, y así dejó de fallar. Si en algún momento alguien quiere volver a separar por id, ojo con ese patrón.

## Cosas temporales por el tema del login

El backend ahora exige autenticación y todavía no tengo el login implementado en el frontend, así que cualquier llamada real (traer los datos del emprendedor) devuelve 401. Para no quedarme bloqueado y poder seguir probando/mostrando el wizard, dejé un respaldo: si la petición real falla, se muestra un caso de ejemplo fijo (el emprendedor "Chullabolo" del documento de referencia) con un aviso visible en pantalla de que son datos de referencia, no reales.

Cuando el login ya esté implementado, esto hay que quitarlo para que no quede como residuo: el respaldo que agregué en el servicio que trae los datos de la ficha, el aviso amarillo que aparece en pantalla, y el campo que marca que los datos son simulados. Avísame cuando el login esté listo y lo saco yo, o si alguien más lo hace, que sepa que existe este parche.

De paso, encontré que `/emprendedores` (el listado general) también se cae con el mismo error 401 hoy — no es algo que yo haya tocado ni arreglado, decidí dejarlo así porque no es parte de este feature y debería arreglarse solo en cuanto el login esté funcionando.

## Qué le falta al backend

Revisé el backend buscando endpoints relacionados a este feature y no encontré nada de canvas, foda, propuesta, segmentos, canales, costos, inversión, proyección, ni nada parecido. Tampoco existe una entidad de "Emprendimiento" o "Modelo de negocio", solo "Emprendedor". O sea que hoy, todo lo que se llena del paso 2 al 16 vive únicamente en el navegador (localStorage) y nunca se envía a ningún lado.

Para que esto deje de ser una maqueta funcional y sea el feature real, me haría falta que backend defina tablas/endpoints para guardar el documento (introducción, antecedentes, etc.), los 9 bloques del canvas, los costos y la proyección, y el cierre. También un endpoint para listar y guardar los modelos por emprendedor, para reemplazar el listado que hoy vive solo en mi navegador. Y definir de dónde sale el campo "analista" del primer paso — hoy es un texto libre, pero lo lógico sería que se autocomplete con el usuario que inició sesión una vez haya login.

## Qué más falta para dar esto por terminado al 100%

- No genera ningún documento (Word/PDF) al finalizar, solo guarda el estado y te manda al listado. Ese era el objetivo final de la maqueta ("generar documento"), pero no lo implementé todavía porque me enfoqué primero en dejar completo el llenado de los 16 pasos — queda como el hueco más grande del feature.
- No hay forma de borrar un modelo desde el listado, solo de continuar editándolo. Es porque hoy el listado no es una gestión real, es solo una interfaz local para comprobar que el flujo completo funciona mientras no hay backend; con endpoints reales sí tendría sentido agregar el borrado.
- Todo el guardado es manual, no hay autoguardado.
- Cada vez que guardas se sobreescribe lo anterior, no queda historial de versiones.

## Ideas a futuro (nada confirmado, solo para evaluar)

Pensé en la idea de poder subir un Word o PDF con un modelo de negocio ya redactado, para que el sistema lo lea solo y llene los 16 pasos automáticamente. Es viable — se puede extraer el texto del archivo y separarlo por secciones ya conocidas, o mandarlo a un modelo de lenguaje para que lo estructure directamente en el formato que ya uso. Y en el sentido contrario, tendría sentido generar el documento final descargable cuando el analista termina el wizard, ya que era justamente el propósito original de la maqueta. Ninguna de las dos cosas está hecha, son solo ideas para decidir si vale la pena priorizarlas.

## Cómo probarlo

Entrando a `http://localhost:3000/asesorias/modelo-negocio?id=1` se ve el wizard completo. Entrando a `/asesorias/modelo-negocio` sin id se ve el listado de lo que se haya guardado.
