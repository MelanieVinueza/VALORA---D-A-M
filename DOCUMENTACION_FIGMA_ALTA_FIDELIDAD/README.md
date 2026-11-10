# Documentación Figma de Válora

Generada desde la web existente, sin alterar su código funcional. Las capturas se tomaron en Edge headless contra `http://127.0.0.1:8765/` y las páginas HTML legales, viewport 1440×900 y 390×844. Las imágenes de la carpeta conservan el PNG capturado; las capturas de sección completa tienen altura propia.

## Entregables

1. `01_Capturas/` — 49 PNG numerados: pantallas, estados y dispositivos.
2. `02_Recursos_Originales/` — logotipos, imágenes, fuente y licencia; también `productos.json` / `servicios.json` para reconstrucción fiel.
3. `03_Guia_Visual_Figma.pdf` — guía visual con todas las capturas, tokens, componentes, breakpoints y recursos.
4. `04_Mapa_Navegacion_Figma.pdf` — flujos de navegación, rutas de compra/cotización, diálogos, errores y retorno.
5. `05_Especificacion_Funcional.md` — comportamiento, reglas y cálculos.
6. `06_Evaluacion_Usabilidad_WCAG.md` — matrices y evidencia, con niveles A/AA/AAA diferenciados.
7. `07_Instrucciones_Para_Figma_IA.md` — prompt de reconstrucción, componentes y enlaces.
8. `08_Pruebas_Prototipo.md` — pasos de comprobación manual para los dos recorridos y estados complementarios.

### Limitaciones observadas

- Pedido y cotización son demos locales; no existe envío ni pago en backend. La finalización solo prepara un resumen.
- Los precios y menús del catálogo están marcados como demostración. La fuente de verdad entregada es el JSON.
- Edge headless estuvo disponible; Playwright se instaló en directorio temporal ajeno al proyecto. No se instalaron dependencias dentro del sitio.
- WCAG es inspección experta parcial, no certificación de conformidad. Contraste mejorado 1.4.6 es AAA; algunos pares de texto secundario/acento medidos cumplen AA y no AAA.
