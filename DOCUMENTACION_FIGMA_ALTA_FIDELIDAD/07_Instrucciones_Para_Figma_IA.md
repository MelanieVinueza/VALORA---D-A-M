# 07 · Instrucciones para Figma IA — reconstrucción fiel de Válora

## Objetivo y fuentes

Crear un prototipo editable de alta fidelidad, no un rediseño. Las capturas numeradas en `01_Capturas` son evidencia del sitio real ejecutado con Edge: escritorio viewport 1440×900 y móvil 390×844; algunas son capturas de sección completa para lectura detallada. Importar los recursos originales de `02_Recursos_Originales`, especialmente logotipo SVG, fuente Manrope, fotografías y JSON. No usar fotografías genéricas ni reescribir contenidos. El catálogo declara precios de demostración e imágenes ilustrativas.

## Frames

Crear frames base **Desktop 1440×900** y **Mobile 390×844**; páginas legales adicionales; variantes de diálogo/estado como frames o componentes. Configurar scroll vertical en landing, panel de carrito, configuración y legales. Mantener la cabecera sticky. Usar constraints responsive basados en la web: contenedor máx. 1280 px; 2 columnas de hero desde 992 px; tarjetas de servicios en 4 columnas desde 1200 px; beneficios/proceso en 3 columnas desde 600 px; en móvil todo apila y menú colapsa bajo 992 px. Aplicar imagen hero móvil `catering-hero-small.jpg` y desktop `catering-hero.jpg`.

## Sistema visual que debe copiarse

- Fuente local Manrope variable 200–800; el diseño mezcla titulares serif editoriales en `em` con sans Manrope para UI/cuerpo. Cargar fuente original.
- Variables base: oro `#c59b4e`, oro suave `#deb875`, oro claro `#ebd19c`, oro oscuro `#835f22`, bronce `#1f1913` / `#2b221a`, papel `#fffdf9`, fondo `#f7f1e8`, fondo cálido `#f2e9dc`, texto `#4e4438`, título `#1e1812`, borde `#e3d6c5`, campo `#fffefa`, secundario `#756959`, error `#b42336`. Dark: papel `#16120e`, fondo `#1b1612`, fondo cálido `#221c16`, texto `#d8cebf`, título `#f7f1e6`, borde `#382e23`, campo `#1d1813`, secundario `#aba092`, error `#ff9ba7`, foco `#deb875`.
- Espaciado base 8 / 16 / 24 / 32 / 48 px. Radio base 0.8rem (12.8 px). Sombra base `0 15px 50px rgba(31,25,19,.08)`. Transición UI 180 ms ease. Anchura de contenedor min(1280px, 100% - 64 px) desde 600 px y gutters móvil 40 px totales. Las reglas particulares de CSS prevalecen si el valor discrepa.
- Botones oro sólido con texto bronce para acción principal, acción secundaria borde/ghost, controles de icono circulares; tarjetas con bordes cálidos, imagen arriba, contenido en columna y etiqueta oro. Mantener la apariencia de los screenshots, incluido panel carrito lateral claro y scrim.

## Componentes editables

1. **Header**: marca SVG + wordmark, enlaces Inicio/Paquetes/Nosotros/Servicios/Beneficios/Contacto; toggle tema; carrito con badge contador; menú hamburger solo móvil. Variantes escritorio/móvil y menú abierto.
2. **Hero**: etiqueta ubicación/servicio, H1, descripción, 3 soluciones con icono, botón Arma tu pedido, enlace Explorar servicios, nota de propósito, foto exacta, overlay/etiqueta y tarjeta flotante.
3. **ServiceCard**: visual de color e icono, ordinal, chip, nombre, resumen, CTA. Cuatro instancias desde `servicios.json`. Service detail modal con descripción, incluye, estado loading/error/retry y CTA.
4. **PackageCard**: imagen exacta `assets/paquetes/{id}.jpg`, ordinal, etiqueta, nombre, texto íntegro, comidas disponibles, “desde”, mínimos/rangos, lista incluye, CTA. Seis instancias desde `productos.json`.
5. **Filtros**: servicios (5 chips incluyendo ver todos) y comida (4 chips incluyendo todos); activo con fill oro y aria-pressed modelado visualmente; resultados anunciados textualmente.
6. **Dialog Configurar paquete**: heading nombre actual; close X; campos comida/personas/menú; opciones de comida como checkbox extras; campo notas; ayuda límite; total reactivo; error; CTA. Al cambiar comida, reemplazar menú y extras conforme al JSON. Variantes válidas por oferta; estado error (p.ej. comida incompatible con otras líneas), focus y disabled.
7. **CartLine**: nombre, comida, menú, extra/notas, total a la derecha, personas con −/input/+, precio persona, acciones editar/quitar y error de rango. Repetir 1–12 líneas.
8. **CartDialog**: empty state con volver al catálogo; estado lleno con líneas, aviso vaciar confirmable/cancelable, bloque total (subtotal/entrega/total), link a datos del evento y formulario. Scroll del diálogo. Cerrar devuelve al foco anterior.
9. **Event Form**: contacto, fecha/hora, select retiro/domicilio, dirección condicional, notas, borrador de pestaña, errores asociados, submit. Variante error y comprobante preparado con pre legible.
10. **Quote form / prepared summary**: campos requeridos y opcionales, contador texto; borrador optativo; error summary; screen resumen con WhatsApp/email/copiar/editar. No animar “enviado”.
11. **Beneficios/proceso/FAQ/contact/footer**: copiar texto e imágenes desde HTML/capturas; FAQ usa disclosure; footer incluye contacto, legales y volver arriba.
12. **LegalPage**: marco común, cabecera y texto completo de privacidad/condiciones desde HTML fuente.

## Conexiones obligatorias del prototipo

- Anclas del header y hero a secciones. Menú móvil abierto/cerrado; cada enlace navega y cierra el menú. Tema cambia entre variantes claro y oscuro.
- Tarjeta servicio → dialog detalle; X/Escape/cancel → servicio con foco visual al origen. CTA me interesa → formulario con servicio preseleccionado.
- Filtros → variantes filtradas existentes; no ocultar comidas/productos donde el JSON no contiene oferta.
- Tarjeta paquete → diálogo configuración específica. Comida cambia lista de menú, extras, precio y límites reales; total = cantidad × (base + recargo menú + extras). Agregar crea línea.
- Carrito vacío/1 línea/2 líneas; las líneas de un pedido tienen mismo tipo de comida. Configuración incompatible produce el texto de error del sitio; máximo 12.
- Controles cantidad actualizan subtotal; editar reabre con datos; quitar elimina; vaciar abre confirmación y conservar cancela; confirmación vacía las líneas y conserva campos de evento.
- Select de entrega: retiro USD 0; domicilio USD 8 por pedido, abre campo dirección. Total reacciona al instante.
- Submit de pedido: estado inválido (asociar errores), estado válido → “Tu pedido está preparado” con resumen de demostración y CTA preparar otro pedido. Nunca crear pago ni confirmación comercial.
- Cotización inválida → campo primero inválido + errores. Válida → pantalla solicitud lista, canales con mensajes prellenados, copiar muestra copiado/no disponible, editar conserva valores.
- FAQ abre/cierra, legales son navegables y todos los estados vuelven a un frame alcanzable.

## Datos y fidelidad de texto

La fuente de verdad es el HTML/JSON incluido y capturas. Usar cadenas literales de la fuente; JSON contiene menús, extras, min/max, ids y centavos de cada comida. La tabla abreviada del PDF no reemplaza JSON. Reproducir el nombre “Menú bienestar”, si corresponde, y todos los nombres exactos en el dataset. No hacer desayuno en parrillada ni almuerzo en coffee break.

## Accesibilidad y prototipado

Usar componentes con estados default/hover/focus/active/disabled/error; contraste claro/oscuro medido; texto no solo color; nombres accesibles visibles para iconos; foco visible; etiquetas y error conectados; navegación tab lógica; cerrar modales con Escape/X y volver foco; estados anunciado como texto. Asegurar targets al menos WCAG 2.2 AA (mínimo 24 CSS px sujeto a excepciones; buscar 44 px en móvil). Representar 1.4.6 como objetivo AAA únicamente si se elevan pares insuficientes, no afirmar conformidad basada en la maqueta.

## Referencias de captura

- 01_escritorio_inicio_1440x900.png
- 02_escritorio_servicios_1440x900.png
- 03_escritorio_detalle_servicio_1440x900.png
- 04_escritorio_catalogo_seis_paquetes_1440x900.png
- 05_escritorio_personalizar_buffet_almuerzo_1440x900.png
- 06_escritorio_personalizar_buffet_merienda_1440x900.png
- 07_escritorio_personalizar_con_extra_y_total_1440x900.png
- 07b_escritorio_coffee_break_desayuno_1440x900.png
- 07c_escritorio_coffee_break_merienda_1440x900.png
- 08_escritorio_carrito_vacio_1440x900.png
- 09_escritorio_carrito_dos_paquetes_1440x900.png
- 10_escritorio_editar_paquete_carrito_1440x900.png
- 11_escritorio_confirmar_vaciar_carrito_1440x900.png
- 12_escritorio_datos_evento_error_validacion_1440x900.png
- 13_escritorio_pedido_preparado_confirmacion_simulada_1440x900.png
- 14_escritorio_nosotros_beneficios_1440x900.png
- 15_escritorio_proceso_1440x900.png
- 15b_escritorio_preguntas_1440x900.png
- 16_escritorio_contacto_formulario_1440x900.png
- 17_escritorio_solicitud_preparada_1440x900.png
- 18_escritorio_cotizacion_validacion_error_1440x900.png
- 19_escritorio_privacidad_1440x900.png
- 20_escritorio_condiciones_1440x900.png
- 21_escritorio_modo_oscuro_1440x900.png
- 22_movil_inicio_390x844.png
- 23_movil_menu_navegacion_abierto_390x844.png
- 24_movil_catalogo_paquetes_390x844.png
- 25_movil_dialogo_personalizacion_390x844.png
- 26_movil_modo_oscuro_390x844.png
- 27_escritorio_servicios_filtros_1440x900.png
- 28_escritorio_servicios_filtro_eventos_1440x900.png
- 29_escritorio_paquetes_filtro_desayuno_1440x900.png
- 30_escritorio_beneficios_1440x900.png
- 31_escritorio_preguntas_frecuentes_1440x900.png
- 32_escritorio_detalle_servicio_1_1440x900.png
- 32_escritorio_detalle_servicio_2_1440x900.png
- 32_escritorio_detalle_servicio_3_1440x900.png
- 32_escritorio_detalle_servicio_4_1440x900.png
- 33_escritorio_configurar_paquete_1_1440x900.png
- 33_escritorio_configurar_paquete_2_1440x900.png
- 33_escritorio_configurar_paquete_3_1440x900.png
- 33_escritorio_configurar_paquete_4_1440x900.png
- 33_escritorio_configurar_paquete_5_1440x900.png
- 33_escritorio_configurar_paquete_6_1440x900.png
- 34_escritorio_configuracion_modo_oscuro_1440x900.png
- 35_escritorio_carrito_modo_oscuro_1440x900.png
- 36_movil_carrito_con_paquete_390x844.png
- 37_movil_datos_evento_validacion_390x844.png
- 38_escritorio_faq_abierto_1440x900.png

Al crear un estado que no aparece en el código o JSON, marcarlo como **no existe**; no añadir pago, backend, reserva, stock, varios menús simultáneos, ni confirmación de envío. Una línea tiene un menú seleccionado y una lista de complementos seleccionados.
