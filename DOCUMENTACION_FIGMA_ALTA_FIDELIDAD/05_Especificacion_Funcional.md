# 05 · Especificación funcional — Válora Catering Empresarial

## Alcance verificado

Lectura del sitio estático en `index.html`, `privacidad.html`, `condiciones.html`, hojas de estilo, módulos de `js/`, y JSON de `data/`. La página tiene una sola landing con anclas, dos diálogos nativos y páginas legales separadas. No hay backend ni procesamiento de pago. La acción final solo prepara un resumen de demostración local; la cotización se prepara y el usuario elige si la comparte externamente.

## Pantallas, secciones y origen de datos

| Pantalla / región | Contenido y componentes | Fuente |
|---|---|---|
| Inicio | Cabecera fija, anclas, tema, carrito, hero editorial con imagen, propuesta y llamadas a acción | `index.html`, CSS e imagen hero |
| Servicios | 4 tarjetas, filtros por categoría, diálogo de detalle con lista y CTA de cotización | `data/servicios.json`, render en `view.js`, diálogo en `app.js` |
| Paquetes | 6 tarjetas, filtros desayuno/almuerzo/merienda, precio mínimo, contenido incluido | `data/productos.json`, `view.js` |
| Configurar paquete | Diálogo: comida, personas, menú, extras, preferencias y subtotal | oferta por paquete/comida; `tienda.js`, `cart.js` |
| Carrito | Diálogo ancho con líneas, cantidades, editar/quitar/vaciar, subtotal, entrega, evento y resumen | estado validado por `cart.js`, presentación en `view.js` |
| Nosotros / beneficios / proceso / FAQ | Narrativa, beneficios, 3 pasos y preguntas expandibles | HTML fijo |
| Contacto | Datos, formulario de cotización y estado de solicitud preparada | HTML, `solicitud.js`, `app.js` |
| Privacidad / condiciones | Documentos de contenido en página propia | `privacidad.html`, `condiciones.html` |

### Catálogo real del prototipo

| Buffet empresarial | Almuerzo, Merienda, Desayuno | 10–200, 10–200, 10–200 | Almuerzo: 8 menús / 8 extras<br>Merienda: 8 menús / 8 extras<br>Desayuno: 4 menús / 4 extras |
| Coffee break para reuniones | Desayuno, Merienda | 10–200, 10–200 | Desayuno: 8 menús / 8 extras<br>Merienda: 8 menús / 8 extras |
| Menú bienestar | Almuerzo, Merienda, Desayuno | 10–200, 10–200, 10–200 | Almuerzo: 8 menús / 8 extras<br>Merienda: 8 menús / 8 extras<br>Desayuno: 3 menús / 4 extras |
| Parrillada para compartir | Almuerzo, Merienda | 10–200, 10–200 | Almuerzo: 8 menús / 8 extras<br>Merienda: 8 menús / 8 extras |
| Sabores del Ecuador | Almuerzo, Merienda | 10–200, 10–200 | Almuerzo: 8 menús / 8 extras<br>Merienda: 8 menús / 8 extras |
| Pastas y cocina italiana | Almuerzo, Merienda | 10–200, 10–200 | Almuerzo: 8 menús / 8 extras<br>Merienda: 8 menús / 8 extras |

Los seis nombres, textos, fotografías, listas `incluye`, menús, adicionales y centavos exactos están en `02_Recursos_Originales/data/productos.json`; no transcribirlos desde esta tabla resumida. Cuatro servicios y sus descripciones están en `data/servicios.json`. El catálogo indica `demostracion: true`; la web aclara que precios y menús son de demostración y que las imágenes de productos son ilustrativas generadas con IA. No son precios comerciales verificados.

## Recorrido A — pedido de demostración

1. Desde Inicio, “Arma tu pedido” lleva a `#paquetes`; el menú Paquetes hace el mismo salto.
2. Filtrar paquetes solo cambia qué tarjetas están visibles. Cada paquete conserva sus ofertas y datos originales.
3. “Personalizar y agregar” abre `#configurar-paquete`. La comida inicial toma el filtro activo; si no hay filtro, intenta mantener la comida de las líneas actuales; si no, usa la primera oferta del paquete.
4. Escoger comida vuelve a cargar sus menús, extras, precio base y límites de personas. El formulario de configuración arranca en el mínimo real de esa oferta.
5. Seleccionar un menú y cualquier conjunto de extras, indicar entero entre `minPersonas` y `maxPersonas`, y opcionalmente anotar preferencia (máximo 180 caracteres). Cada ajuste recalcula el subtotal.
6. “Agregar al carrito” crea una línea. Se admiten hasta 12 líneas. Todas las líneas de un pedido deben usar el mismo tipo de comida; para cambiar de desayuno a almuerzo hay que preparar o vaciar el pedido actual. Una segunda línea compatible, como buffet + menú bienestar en almuerzo, sí cabe en un mismo pedido.
7. Cálculo por línea: `personas × (precio base de la oferta + adicional del menú + suma de precios de extras)`. Los precios son enteros en centavos y se obtienen del catálogo, no del estado guardado.
8. “Ver carrito” abre el diálogo lateral. Los botones +/− y el campo numérico cambian personas dentro de los límites; el precio y totales se actualizan. Un valor inválido mantiene el último número válido y muestra el error. “Editar paquete” conserva ID, comida, menú, extras y notas mientras reabre el diálogo. “Quitar” borra una línea. “Vaciar carrito” presenta una confirmación con conservar/cancelar o confirmar; los datos ya escritos del evento se conservan al vaciar.
9. Retiro coordinado cuesta USD 0. Entrega en Quito cuesta USD 8,00 por pedido con líneas, no por persona. Domicilio revela la dirección obligatoria. Se recuerda la preferencia en cookie por 30 días.
10. Datos obligatorios: nombre (3–80, letras/espacios/apóstrofo/guion), email válido (≤120), teléfono 9–15 dígitos (se admite prefijo y separadores), fecha válida hoy o posterior, hora 24 h futura respecto al momento actual, entrega válida y dirección 8–180 si es domicilio. Indicaciones generales opcionales hasta 300 caracteres. Los errores se enlazan a cada control y el primer campo inválido recibe foco.
11. “Preparar pedido” limpia el carrito persistido, borra campos del evento en la interfaz y presenta un resumen local con datos, menú, extras, subtotales, entrega y total de referencia. No reserva, envía, cobra ni crea pedido en servidor. “Preparar otro pedido” vuelve al catálogo.

## Recorrido B — cotización

1. Desde Inicio o navegación, Servicios ancla a las cuatro tarjetas; los filtros son Ver todas, Alimentación diaria, Eventos, Bienestar y Abastecimiento.
2. “Consultar esta solución” abre el diálogo de detalle. Escape, X o clic en el fondo cierra y devuelve foco al enlace que lo abrió. La carga usa JSON local/cache; ante fallo hay reintento.
3. “Me interesa este servicio” cierra el diálogo, lleva foco a Nombre, abre el formulario y selecciona ese servicio en el desplegable.
4. Campos requeridos: nombre (3–100), empresa (2–120), correo, teléfono (9–25 con patrón), servicio, mensaje (20–1200). Tipo de comida es opcional (desayuno, almuerzo, merienda); personas opcional, entero 1–100000; fecha opcional hoy o posterior.
5. Errores aparecen junto al campo, se actualizan al corregir, el resumen de errores usa alert y el foco pasa al primer inválido. Contador de caracteres muestra mensaje / 1200.
6. Al validar, formulario se reemplaza por resumen de texto escapado y botones para WhatsApp, correo, copiar o editar. Se declara explícitamente que aún no se ha enviado. WhatsApp y correo abren enlaces externos con mensaje prellenado; el botón copiar puede reportar falta de contexto seguro/permiso.
7. Editar devuelve al formulario con valores conservados. Cambiar servicio dentro del formulario es posible sin reiniciar la solicitud.

## Otras interacciones y persistencia

- Navegación ancla: enlaces internos actualizan el estado activo según sección. En móvil, el botón menú alterna mostrar/ocultar, se cierra al navegar, al Escape, al clic fuera o al perder foco.
- Tema: alterna claro/oscuro, atributo accesible `aria-pressed` y preferencia `valora-theme` en localStorage; si no hay elección respeta preferencia del sistema.
- FAQ: elemento nativo `details/summary`, abre/cierra cada respuesta.
- Carrito en localStorage, con copia de catálogo en IndexedDB; carrito compatible previo se normaliza, las líneas inválidas se descartan con aviso. La preferencia de entrega usa cookie. Borradores de cotización/pedido se guardan en sessionStorage si está marcada su casilla; se recuperan en esa pestaña y se pueden borrar.
- Estado de sistema: fallo de catálogo presenta texto y botón reintentar; el servicio usa cache IndexedDB de hasta siete días para permitir lectura. No hay stock, autenticación, base de datos de pedidos ni transacción comercial.

## Correspondencia de pantallas/acciones

| Origen | Control | Resultado / destino | Conserva |
|---|---|---|---|
| Header | Inicio / Paquetes / Nosotros / Servicios / Beneficios / Contacto | Ancla en landing; cierra menú móvil | Tema y carrito |
| Servicios | Ver todas / filtros | Filtra tarjetas y anuncia conteo | No borra datos |
| Servicio | Consultar solución | Abre detalle modal; X/Escape/fondo cierra | Foco de origen |
| Detalle | Me interesa | Cierra modal, rellena servicio y enfoca Nombre | Servicio elegido |
| Paquete | Personalizar | Abre configuración modal | Comida activa compatible |
| Configuración | Cambiar comida | Refresca menú, extras, base y rangos | Personas si siguen válidas |
| Configuración | Agregar | Guarda línea y actualiza contador/totales | Selección completa |
| Carrito | Editar / quitar / + / − | Reabre o cambia/borrar la línea | Otras líneas y evento |
| Carrito | Vaciar | Confirmación; conservar o borrar todas las líneas | Evento al vaciar |
| Pedido | Entrega | Recalcula USD 0 / USD 8, revela dirección | Preferencia en cookie |
| Pedido | Preparar | Error enfocado o resumen local preparado | Se limpia carrito solo tras preparación completa |
| Cotización | Preparar solicitud | Error enfocado o pantalla de resumen sin enviar | Datos del formulario |
| Solicitud | Editar / compartir | Formulario conservado / app externa | Mensaje hasta edición |
| FAQ / tema / legales | Activar | Expandir, cambiar tema o abrir HTML legal | Navegación / preferencia |

## Límites que el prototipo debe representar

- Seis paquetes, cuatro servicios; los cuatro servicios no son productos del carrito.
- El paquete coffee break solo tiene desayuno y merienda; no simular almuerzo. Parrillada tiene almuerzo/merienda. Respetar oferta por producto.
- Las listas de menú, extras, precios extra y mínimos/máximos cambian por paquete y comida. Importar el JSON dado como única fuente de textos y valores.
- Un pedido agrupa una comida y un mismo evento/horario; otros turnos se preparan por separado. Sin pagos ni envío.
- La solicitud de cotización se comparte solo por decisión del usuario. Nada queda enviado en la pantalla “Solicitud lista”.
