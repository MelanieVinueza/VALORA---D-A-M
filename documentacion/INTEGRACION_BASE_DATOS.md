# Correspondencia del frontend con el modelo de Oracle

Esta guía prepara la siguiente etapa; esta entrega no implementa base de datos ni backend. Referencia: modelo de 29 tablas, 210 atributos y 47 FK entregado por el usuario. El PDF no se incluye ni modifica en esta carpeta.

## Catálogo local versión 2

El sitio conserva seis paquetes. Cada paquete tiene `ofertas`, una lista de combinaciones de paquete y tipo de comida. Cada combinación tiene sus propios precios, límites, menús y extras. No se copian los mismos platos automáticamente a los tres tipos: solo se muestran las ofertas definidas en el JSON.

Los datos son ejemplos. La clasificación de los paquetes, los desayunos añadidos, las recetas y los precios comerciales requieren validación con Válora.

| Dato de la interfaz | Tabla / atributo de referencia |
| --- | --- |
| Servicio: ID y textos | `SERVICIO` |
| Lista de elementos incluidos en un servicio | `SERVICIO_INCLUYE`, ordenados por `orden` |
| Paquete: ID, nombre, descripción, imagen, texto alternativo y etiqueta | `PAQUETE` |
| `servicioId` | `PAQUETE.id_servicio` |
| Elementos incluidos del paquete | `PAQUETE_INCLUYE`, ordenados por `orden` |
| `ofertas[].tipoComida` | `TIPO_COMIDA.codigo` (DESAYUNO / ALMUERZO / MERIENDA) |
| Precio base y límites de cada oferta | `PAQUETE_TIPO_COMIDA` |
| Menús y complementos de cada oferta | `OPCION_PAQUETE`, tipos MENU y EXTRA |
| `codigo` de menú o extra | `OPCION_PAQUETE.codigo`, identificador local |
| `id` global de menú o extra | `OPCION_PAQUETE.id_opcion` |
| Nombre, correo y teléfono del formulario | `CLIENTE` |
| Fecha, hora, forma de entrega y notas generales | `SOLICITUD` de tipo PEDIDO |
| Menú, personas y notas de una línea del carrito | `DETALLE_SOLICITUD` |
| Complementos de la línea | `EXTRA_SOLICITUD` |

El código de comida es una clave de catálogo de la interfaz, no un ID numérico inventado. El backend resolverá `TIPO_COMIDA.id_tipo_comida` y el cliente real. La base obtiene el paquete y la comida de cada detalle mediante su menú, tal como establece el diagrama.

Ejemplo de selección guardada:

```json
{
  "id": "identificador-local-de-la-linea",
  "productoId": "buffet-empresarial",
  "tipoComida": "ALMUERZO",
  "personas": 20,
  "menuId": "buffet-empresarial/ALMUERZO/MENU/pollo",
  "extrasIds": ["buffet-empresarial/ALMUERZO/EXTRA/postre"],
  "notas": "Presentación individual"
}
```

El ID de línea es del navegador; no es `id_detalle` de Oracle. Los ID numéricos de Oracle deben conservarse sin pérdida de precisión cuando se diseñe el transporte JSON.

## Una comida y un horario por pedido

`SOLICITUD` tiene una fecha y una hora. Por eso este prototipo admite varios paquetes y menús del mismo tipo de comida en un carrito. Desayuno y almuerzo se preparan como pedidos separados. No hace falta cambiar el modelo para esta decisión de interfaz.

El esquema actual calcula extras por persona: si se selecciona un postre para 20 personas, son 20 postres. La venta de cantidades independientes de bocaditos no forma parte de este recorrido.

## Puntos de integración futura

1. Sustituir la carga local en `js/repo.js` y `js/catalogo.js` por las consultas del backend. La API puede devolver la misma estructura de presentación; las listas normalizadas se reconstruyen como arrays JSON.
2. El backend debe devolver ofertas vigentes y activas. Validará precios, cantidades, pertenencia del menú y extras, y disponibilidad de nuevo al recibir el pedido. La copia local de catálogo no autoriza una compra.
3. Sustituir la preparación de demostración en el listener de `#datos-pedido` de `js/tienda.js` por un envío al backend. Vaciar el carrito solo después de confirmar la transacción. Ante un fallo, conservar sus líneas y datos.
4. El backend identificará al cliente, generará las PK y registrará cabecera, detalles, extras y precios históricos. No confiará en precios ni roles enviados por el navegador.
5. Incorporar después la autenticación, permisos y administración que se acuerden. Ninguna pantalla simula un inicio de sesión o un panel administrativo en esta entrega.
6. El consumo se registrará al preparar un pedido confirmado, mediante las recetas y `KARDEX`; crear una selección o resumen en el navegador no consumirá inventario.

El cargo local de domicilio de USD 8 es de demostración y se concentra en `PRECIO_ENTREGA_CENTAVOS`. Su cálculo comercial corresponde al backend. Los precios de ofertas y opciones están en centavos enteros; los costos de compra del modelo tienen otra unidad y no se utilizan en este frontend.

## Recuperación y caché

El formato actual de carrito es versión 2. Se conserva la clave de almacenamiento anterior para migrar selecciones compatibles. Si un carrito antiguo mezcla comidas que ahora necesitan pedidos separados, se conservan las líneas compatibles con la primera comida recuperada y se muestra un aviso por los descartes; nunca se presentan como pedidos registrados.

La caché del catálogo usa una clave nueva para evitar mezclar el JSON anterior con las ofertas por comida. Preparar el resumen limpia el carrito y los datos del formulario, siguiendo el recorrido local anterior. El resumen no se guarda como un pedido ni acredita un pago.

## Verificación y límites

Se incluyen pruebas de selección, cálculos por oferta, extras, límites, migración, almacenamiento, edición, filtros y preparación del resumen. No prueban Oracle, API, inventario ni autenticación porque esos componentes todavía no existen. Tampoco garantizan la disponibilidad o exactitud comercial de los datos de ejemplo.
