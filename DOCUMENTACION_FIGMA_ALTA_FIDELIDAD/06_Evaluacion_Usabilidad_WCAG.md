# 06 · Evaluación heurística y WCAG 2.2

## Método y alcance

Inspección estática de HTML/CSS/JS, revisión visual de capturas a 1440×900 y 390×844, y recorrido manual automatizado de controles principales en Microsoft Edge headless con preferencias clara y oscura. Es una revisión experta de prototipo; no equivale a auditoría certificada, prueba con usuarios, lector de pantalla ni verificación exhaustiva de cada combinación de contenido/contraste.

En WCAG 2.2 el nivel A es base, AA es el objetivo normal de conformidad, y AAA es más exigente y no se presupone como requisito global. El criterio 1.4.6 Contraste mejorado es **AAA**, mientras 1.4.3 y 1.4.11 son AA, y 1.4.1 es A. Un contraste aislado calculado no demuestra cumplimiento de toda una página.

## Matriz de heurísticas de Nielsen

| Heurística | Evidencia y juicio | Recomendación para el prototipo |
|---|---|---|
| 1. Visibilidad del estado | Conteo, estados live, total dinámico, filtro activo, aria-pressed y estados de carga/error hacen visible el sistema. En compra el resumen especifica “demostración”. | Mantener cada estado y presentar cambios de total/validación de inmediato y con texto. |
| 2. Correspondencia con el mundo real | Nombres familiares (desayuno, menú, retiro/domicilio), moneda USD; los menús y precios son explícitamente de demostración. | Preservar lenguaje y caveat de demostración en catálogo y resumen. |
| 3. Control y libertad | Cerrar/volver, editar, quitar línea, cancelar vaciado, preparar otro pedido y editar cotización. | Conectar X/Escape, cancelar y volver al punto origen; conservar foco y datos según comportamiento real. |
| 4. Consistencia y estándares | Botones, campos etiquetados, modales, anclas, detalles FAQ y diálogos siguen patrones web; carrito es panel modal ancho. | Componentes Figma compartidos con mismos nombres/estados y convenciones en todos los frames. |
| 5. Prevención de errores | Selectores limitan oferta real, cantidades min/max, misma comida por pedido, fecha mínima y confirmación de vaciado. | Mostrar regla junto a selección antes del error; no habilitar estados incompatibles. |
| 6. Reconocimiento mejor que recuerdo | Selección visible en la tarjeta/carrito, menús y extras se presentan nombrados; JSON específico. | En edición mostrar valores ya seleccionados, comida y subtotal; evitar opciones inventadas. |
| 7. Flexibilidad y eficiencia | Filtros, atajos de +/- y edición rápida, borradores optativos, preferencias persistentes. | Mantener teclado y controles de cantidad junto al campo numérico. |
| 8. Diseño estético y minimalista | Espacios amplios, jerarquía tipográfica Manrope y titulares serif; landing larga y el panel carrito extenso pueden aumentar el desplazamiento. | Reproducir fidelidad primero; para prueba, revisar scroll del diálogo y asegurar que cierre/acciones críticas sean accesibles. |
| 9. Ayudar a reconocer/recuperarse de errores | Error asociado por aria-describedby, resumen role=alert, foco en primer inválido; mensajes conservan cantidad válida o explican regla. | Mostrar estado rojo más mensaje legible y verificar cada ruta inválida de modo y foco. |
| 10. Ayuda y documentación | Ayudas de datos, textos de precios demo, privacidad y condiciones; FAQ y contactos visibles. | Conservar textos legales/enlaces y aclaración de que compartir/enviar es decisión externa. |

## Principios de Norman (interpretación de cuatro principios de diseño)

| Principio | Evidencia | Indicación Figma |
|---|---|---|
| Affordances y signifiers | Botones con verbo, etiquetas de campo, iconos acompañados por nombres accesibles; filtros con texto. | El control visual debe parecer accionable y mantener su etiqueta/texto, no depender de icono solo. |
| Modelo conceptual | Paquete → tipo de comida → menú/extras → personas → línea → evento y total. | Replicar esa jerarquía de datos; el total sube con extras/personas y entrega fija. |
| Mapping (relación control/resultado) | +/− modifica personas; elegir domicilio revela dirección y añade 8 USD. | Conectar estos cambios en prototipo inmediatamente, respetar límites y mostrar total consecuente. |
| Feedback | Total en vivo, mensajes de estado, validación inline, contador y resumen preparado. | Prototipar error, carga, éxito local, selección y disabled como componentes separados. |

La terminología “cuatro principios” varía entre fuentes y cursos; esta matriz expresa los principios observables solicitados y no atribuye una clasificación única a Norman.

## Ocho reglas de oro de Shneiderman

| Regla | Observación y recomendación |
|---|---|
| Consistencia | Misma tipografía, familia de botones, filtros y estado activo; crea variantes Figma por tamaño y estado. |
| Atajos para usuarios frecuentes | Filtros, +/- y editar son atajos; añadir tab order limpio y conexiones directas. |
| Feedback informativo | Mensajes live anuncian cantidad/errores y el total se actualiza; representar texto exacto. |
| Diálogo con cierre | Solicitud y pedido concluyen en resumen “preparado”, con editar/otro pedido; no presentarlo como venta completada. |
| Prevención y manejo simple de errores | Validaciones y confirmación de vaciado; mostrar condición en selección/confirmación. |
| Permitir deshacer | Editar, quitar, cancelar vaciado y regresar; “quitar” no usa una confirmación individual en sitio. |
| Control interno | El usuario elige canal, fecha, comida, entrega, menús y momento de compartir; no autosubmite. |
| Reducir carga de memoria | Resumen, subtotales, etiqueta de comida y preferencias se mantienen visibles; reflejar selecciones en resumen. |

## Matriz WCAG 2.2 solicitada

| Criterio / nivel | Evidencia observada | Riesgo o estado | Recomendación verificable |
|---|---|---|---|
| 1.4.1 Uso del color — A | Filtros tienen texto y `aria-pressed`; error tiene mensaje además de color y `aria-invalid`; precio/estado usa texto. | Buen indicio en controles inspeccionados; falta revisar todos los gráficos/estados y el mapa de color completo. | Mantener texto, forma/borde/atributo activo y mensaje; no expresar error solo en rojo. |
| 1.4.3 Contraste mínimo — AA | Cálculo de pares CSS sólidos: `#4e4438` sobre `#fffdf9` ≈ **9.36:1**; sobre `#f7f1e8` ≈ **8.47:1**. `#756959` sobre `#fffdf9` ≈ **5.27:1**. `#835f22` sobre blanco cálido ≈ **5.70:1**. En oscuro `#d8cebf` sobre `#16120e` es elevado. | Estos pares pasan 4.5:1 para texto normal. No se midieron todas las etiquetas, opacidades, texto sobre fotografía, hover ni gradientes. | Medir cada token y estado real (incluido overlay y placeholder) y dejar margen de contraste en textos sobre imágenes. |
| 1.4.6 Contraste mejorado — AAA | Es AAA. `#756959` / `#fffdf9` ≈ **5.27:1** y `#835f22` / `#fffdf9` ≈ **5.70:1**; ambos bajo 7:1 para texto de tamaño normal. | **No alcanza AAA** para estos pares normales aunque superan 4.5:1 de AA. Texto grande tiene umbral 4.5:1, pero no se extrapola a texto pequeño. | Si el curso exige AAA, oscurecer tokens de texto normal afectados o usar fondo/tono que dé ≥7:1 y volver a medir. Es recomendación de prototipo, no cambio web. |
| 1.4.11 Contraste no textual — AA | Foco se define como dorado oscuro `#835f22` en claro y dorado `#deb875` en oscuro; contra fondos de tarjeta claros/oscuros supera el orden de 3:1. Inputs definen borde `#958068` (claro) / `#96816a` (oscuro). | Los ratios de borde de campo y de iconos se deben evaluar por componente: una línea sutil puede fallar frente al campo aunque haya foco; no se midió cada par. | Calcular color del borde contra relleno inmediato, iconos, estados activos y foco con sus fondos; exigir ≥3:1 a componentes necesarios para identificar estado/operación. |

## Hallazgos de accesibilidad con evidencia

| Ref. | Pantalla y evidencia | Criterio/principio | Hallazgo | Recomendación para prototipo |
|---|---|---|---|---|
| A1 | Formularios de pedido/cotización y capturas 12, 18 | 3.3.1 A, 3.3.2 A, 3.3.3 AA | Hay etiquetas explícitas, asociación de errores, alert/resumen, foco inicial y explicaciones; buena base, pero prototipo debe hacer esas conexiones funcionales. | Probar requerido vacío, email/teléfono inválido, fecha pasada, dirección ausente y texto corto; conectar campo-error, alerta y foco. |
| A2 | Diálogo de configuración / screenshot 05, 10, 25 | 2.1.1 A, 2.4.7 AA, 2.4.11 AA | Usa dialog nativo, botón X; la captura de vista móvil muestra panel alto con scroll. No se completó un ciclo lector de pantalla/teclado automatizado. | Figma debe ofrecer foco inicial, Escape, X, fondo/cancelar, retorno de foco y scroll alcanzable; no cubrir permanentemente cierre. |
| A3 | Carrito y entrega / screenshot 09, 12 | 1.4.1 A, 1.4.11 AA, 2.5.8 AA | +/- es menor que el campo principal y botones secundarios; targets precisos deben comprobar tamaño CSS real. El campo numérico ofrece alternativa. | Mantener nombre accesible, campo numérico y blancos táctiles de ≥24 CSS px según 2.5.8 AA, considerando excepciones y separación; sugerible ≥44 px móvil. |
| A4 | Texto secundario dorado, etiquetas y fotos hero | 1.4.3 AA, 1.4.6 AAA | Pares sólidos indicados cumplen AA; los pares medidos de #756959 y #835f22 fallan texto normal AAA. Sobre imagen/overlay no se valida con esos tokens. | Crear estilos por nivel; medir título, caption, etiquetas y hover contra el píxel compuesto de cada imagen. |
| A5 | Navegación móvil / screenshot 23 | 2.1.1 A, 2.4.7 AA | Botón anuncia expandido/cerrado y navegación se cierra con Escape, clic externo, navegación y blur en código. | Incluir estados menú abierto/cerrado, atributo y secuencia de foco completa; verificar orientación móvil. |
| A6 | Solicitud preparada / screenshot 17 | 3.3.1 A, 3.3.3 AA, 4.1.3 AA | El resumen comunica que no se envió y ofrece editar/canales/copiar; clipboard puede fallar fuera de contexto seguro, existe mensaje. | Modelar dos estados al copiar (copiado / permiso no disponible) y navegación externa con aviso. |
| A7 | Preferencia clara/oscura / screenshots 21 y 26 | 1.4.3 AA, 1.4.11 AA | CSS ofrece tema guardado o sistema y tokens distintos; se necesita contraste por estado activo, hover, disabled, dialog y formularios. | No reutilizar literal el color claro en la variante oscura: enlazar componentes a tokens semánticos. |

## Niveles WCAG incluidos en esta revisión

- **A (base):** 1.4.1 Uso del color; 2.1.1 Teclado; 3.3.1 Identificación de errores; 3.3.2 Etiquetas o instrucciones.
- **AA (objetivo habitual):** 1.4.3 Contraste mínimo; 1.4.11 Contraste no textual; 2.4.7 Foco visible; 2.4.11 Foco no oculto (mínimo); 2.5.8 Tamaño del objetivo (mínimo); 3.3.3 Sugerencias ante errores; 4.1.3 Mensajes de estado.
- **AAA (mejora opcional/curso):** 1.4.6 Contraste mejorado (7:1 para texto normal, 4.5:1 para texto grande). No es el objetivo general AA y no queda satisfecho de forma global por esta revisión.

## Límites / asuntos que requieren verificación de prueba

No se midieron con instrumento todos los pares de color o tamaños reales de target; no se probó lector de pantalla real, zoom al 200/400%, reflow por ancho, voz, browser distinto ni reconocimiento humano de textos generados por imagen. WCAG no se declara “cumplido”. Las capturas demuestran estados visuales seleccionados y los módulos ofrecen evidencia de comportamiento, pero la conformidad debe verificarse sobre el prototipo interactivo construido en Figma y su presentación/exportación.
