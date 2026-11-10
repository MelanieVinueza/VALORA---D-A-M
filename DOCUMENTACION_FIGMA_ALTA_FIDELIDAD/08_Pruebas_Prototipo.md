# 08 · Casos de prueba del prototipo Figma

Use escritorio 1440×900 y móvil 390×844. Verifique contenido, transición, foco visible y total en cada paso. Los datos de menú/precio son demostrativos.

## Recorrido A — pedido simulado

### A1. Paquete compatible con extras y cálculo
1. Inicio → “Arma tu pedido”.
2. Mantener Ver todos; abrir Buffet empresarial. Confirmar que lista la oferta y el precio demo por persona.
3. Dejar Almuerzo, seleccionar menú incluido o uno con recargo; elegir Postre individual; indicar 20 personas.
4. Confirmar subtotal en vivo = 20 × (base + recargo de menú + extra). Agregar.
5. Abrir carrito. Confirmar nombre, comida, menú, extra, precio por persona, línea y total.
6. Resultado esperado: una línea; campos conservan los valores; no se presenta pago.

### A2. Variantes reales de oferta
1. Abrir coffee break y seleccionar Desayuno; observar su menú y extras.
2. Cambiar a Merienda; verificar que opciones y total se refrescan.
3. Intentar un tipo no disponible para ese paquete (no debe aparecer).
4. Probar Buffet, Menú bienestar, Parrillada, Sabores del Ecuador y Pastas; contrastar comidas/min/max con `productos.json`.
5. Resultado esperado: nunca mostrar una oferta inventada; breakfast ausente en parrillada y lunch ausente en coffee break.

### A3. Dos líneas compatibles y restricción de mezcla
1. Agregar buffet de Almuerzo.
2. Agregar Menú bienestar de Almuerzo.
3. Abrir carrito; comprobar dos líneas y suma de subtotales.
4. Abrir coffee break y observar que no puede añadirse a pedido de Almuerzo (solo ofrece desayuno/merienda); confirmar mensaje y que las dos líneas existentes continúan.
5. Resultado esperado: líneas compatibles coexisten; tipo de comida diferente se rechaza; máximo 12 líneas.

### A4. Edición, cantidad y eliminación
1. En carrito + una persona; comprobar total sube por precio por persona.
2. Cambiar campo numérico por una cantidad válida; comprobar total.
3. Probar menor al mínimo / mayor al máximo / decimal; verificar error y último total válido retenido.
4. Editar paquete, cambiar extra o preferencia y guardar; comprobar que misma línea se actualiza.
5. Quitar una línea; comprobar foco próximo y total recalculado.

### A5. Vaciar con cancelación y confirmación
1. Desde carrito con dos líneas, activar Vaciar carrito.
2. Seleccionar Conservar paquetes; verificar que siguen ambas líneas y evento intactos.
3. Volver a activar y confirmar Sí, vaciar carrito.
4. Resultado esperado: carrito vacío; formulario del evento sigue con lo que se había ingresado.

### A6. Entrega, errores y resumen preparado
1. Agregar paquete; elegir Domicilio en Quito. Confirmar que aparece dirección y entrega USD 8,00.
2. Enviar vacío; verificar resumen, errores junto a campos y foco al primer inválido.
3. Completar nombre, correo inválido y luego válido; teléfono, fecha futura, hora futura, dirección ≥8 caracteres.
4. Confirmar total = paquetes + tarifa fija; cambiar a Retiro y comprobar USD 0/dirección oculta.
5. Seleccionar Domicilio de nuevo, completar campos y Preparar pedido.
6. Resultado esperado: resumen con contacto, evento, líneas, extras, subtotales y total; carrito se limpia; mensaje declara demostración. No se envía ni cobra.
7. “Preparar otro pedido” vuelve al catálogo y permite otro horario por separado.

## Recorrido B — cotización

### B1. Servicio a cotización
1. Inicio → Servicios; usar filtro Eventos. Confirmar solo tarjetas de esa categoría.
2. “Consultar esta solución”; verificar nombre, descripción e incluye correctos del JSON.
3. Cerrar con X y comprobar retorno a la tarjeta. Repetir cierre con Escape y fondo.
4. Abrir detalle y seleccionar Me interesa este servicio.
5. Resultado esperado: formulario visible con el servicio preseleccionado y foco en nombre.

### B2. Validación y resumen preparado
1. Enviar vacío. Ver errores inline, resumen de errores y primer campo con foco.
2. Probar nombre corto, email incorrecto, teléfono inválido y mensaje de 19 caracteres; corregirlos y confirmar que cada mensaje desaparece.
3. Completar nombre ≥3, empresa ≥2, email/teléfono válidos, servicio, mensaje ≥20; dejar comida, personas y fecha sin valor (opcionales).
4. Preparar mi solicitud.
5. Resultado esperado: resumen con campos correctos y la aclaración **Aún no se ha enviado**.

### B3. Compartir, copiar, editar
1. Confirmar WhatsApp/email abren afuera y tienen resumen prellenado; ningún canal se abre sin clic.
2. Copiar; verificar estado copiado o mensaje si el clipboard no está disponible.
3. Editar mis datos; verificar que valores previos se conservan.

## Navegación, accesibilidad y contenido

### C1. Teclado y foco
1. Recorrer header, filtros, tarjetas, dialog, inputs, confirmación, formularios y footer solo con Tab/Shift+Tab/Enter/Espacio.
2. Abrir cada dialog, usar Escape, verificar cierre y retorno de foco.
3. Abrir menú móvil con botón; navegar con teclado; cerrar por Escape y seleccionar ancla.
4. Confirmar foco visible, orden lógico, etiquetas, errores asociados y que selección/error no dependen solo de color.

### C2. Responsive y tema
1. Verificar frames Desktop 1440×900 y Mobile 390×844; hero, cards, filtros, forms, carrito y dialog no se cortan horizontalmente.
2. En móvil, abrir/cerrar navegación y configurar paquete; usar scroll interno para alcanzar campos y cierre.
3. Alternar claro/oscuro en hero, tarjetas, dialog, carrito, errores, formulario, foco y footer.
4. Revisar contraste texto normal ≥4.5:1 y UI esencial ≥3:1 para AA; si se busca AAA, texto normal ≥7:1. Revisar texto sobre foto con overlay incluido.

### C3. FAQ, enlaces y legales
1. Abrir/cerrar preguntas con teclado y puntero.
2. Navegar privacidad/condiciones y regresar a Inicio.
3. Activar teléfono/correo y enlaces del footer; verificar el destino correcto sin inventar formularios.
4. Revisar textos de precios demo e imágenes ilustrativas junto al catálogo.
