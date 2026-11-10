# Válora · Catálogo y carrito por tipo de comida

Proyecto académico de Joel Robalino, paralelo 2. Adaptación del frontend original de MelanieVinueza/RETO1--VALORA-CATERING, commit `928c3eb456703dbb0941917e7d385220c3726738`.

Esta entrega conserva la presentación, tipografías, colores, imágenes, navegación, modo claro/oscuro, cuatro servicios y seis paquetes de la página original. Solo adapta el catálogo, los formularios y el carrito al modelo de datos propuesto.

## Abrir la página

1. Descomprimir la carpeta `valora-web`.
2. Abrir esa carpeta en VS Code.
3. Abrir `index.html` con la extensión **Live Server**.

También se puede iniciar un servidor estático desde esa carpeta con `python -m http.server 8000` y abrir `http://localhost:8000/`. Según la instalación, el comando puede ser `python3` o `py`.

No abrir el HTML con doble clic: los catálogos JSON necesitan un servidor HTTP. La página funciona sin instalar paquetes de Node.

## Qué cambió

- Filtros de desayuno, almuerzo y merienda, integrados con los controles originales.
- Cada paquete contiene ofertas por tipo de comida, con sus propios menús, extras, precio y límites de personas.
- La personalización actualiza los menús y complementos al cambiar la comida.
- El carrito conserva el tipo de comida y los identificadores globales del menú y de los extras.
- Los límites de personas se leen de la oferta; no están fijados en la lógica a 10–200.
- Cada pedido corresponde a una comida, fecha y hora. Para otro turno se prepara otro pedido.
- Se recuperan los carritos anteriores compatibles y se avisa cuando alguna selección necesita revisión.
- La cotización puede indicar el tipo de comida y conserva las opciones para compartir por WhatsApp o correo.
- El cierre muestra un resumen de demostración con los menús, cantidades y total de referencia.

Los desayunos añadidos y la asignación de paquetes a comidas son ejemplos para demostrar la interfaz. Todos los precios y menús deben validarse con Válora antes de usar el sitio comercialmente.

## Alcance de esta entrega

**Solo frontend estático.** No contiene API, servidor de negocio, base de datos, autenticación, panel administrativo ni procesamiento de pagos. Preparar el pedido no lo envía al negocio ni descuenta ingredientes. La preferencia de entrega y el carrito se conservan en este navegador; los borradores de contacto usan la sesión de la pestaña.

La adaptación facilita la futura integración, pero no reemplaza la implementación y las pruebas del backend y de Oracle. El inventario, contratos y permisos se implementarán en esa etapa.

## Archivos principales

| Archivo | Función |
| --- | --- |
| `index.html` | Página original con los campos y controles adaptados. |
| `data/servicios.json` | Los cuatro servicios generales. |
| `data/productos.json` | Catálogo de demostración, versión 2, por paquete y comida. |
| `js/cart.js` | Validación, selección, cálculos, recuperación y resumen local. |
| `js/view.js` | Presentación de servicios, ofertas y carrito. |
| `js/tienda.js` | Eventos de personalización, filtros y recorrido del pedido. |
| `js/repo.js` | Carga de JSON y almacenamiento local. |
| `js/solicitud.js` | Validación y resumen de cotizaciones. |
| `documentacion/INTEGRACION_BASE_DATOS.md` | Correspondencia con el modelo de Oracle y límites de la entrega. |
| `pruebas/` | Pruebas de la lógica y de las interacciones del DOM. |

Los informes de auditorías y semanas anteriores en `documentacion/` se conservan como antecedentes. Para esta versión prevalecen este README y la guía de integración.

## Ejecutar las pruebas (opcional)

Con Node.js 24 o superior:

```bash
npm ci
npm test
```

`jsdom` es una dependencia de desarrollo utilizada por las pruebas; no se carga en la página. Las pruebas del DOM no sustituyen una revisión visual en navegadores reales. Antes de publicar, revisar también el sitio en escritorio y móvil, y probar los permisos y la integración cuando exista el backend.

Las licencias de fuentes y recursos se mantienen en sus carpetas originales.

## Publicación en GitHub Pages

El workflow `.github/workflows/ci-cd.yml` ejecuta las pruebas del proyecto y las verificaciones HTML, de accesibilidad y de diseño adaptable en cada cambio a `main` y en las solicitudes de cambio dirigidas a esa rama. Si las verificaciones pasan, prepara el sitio estático y lo publica automáticamente en GitHub Pages.

En el repositorio, configura **Settings → Pages → Build and deployment → Source: GitHub Actions**. Después de integrar cambios en `main`, el sitio estará disponible en:

<https://melanievinueza.github.io/VALORA---D-A-M/>
