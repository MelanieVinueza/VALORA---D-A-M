export const TIPOS_COMIDA = Object.freeze({ DESAYUNO: "Desayuno", ALMUERZO: "Almuerzo", MERIENDA: "Merienda" });
export const MAX_LINEAS = 12;
export const PRECIO_ENTREGA_CENTAVOS = 800;
const MAX_PRECIO_CENTAVOS = 10000000;
const identificadorValido = valor => typeof valor === "string" && /^[a-zA-Z0-9_-]{1,80}$/u.test(valor);
const textoValido = (valor, maximo) => typeof valor === "string" && valor.trim().length > 0 && valor.length <= maximo;
const centavosValidos = valor => Number.isSafeInteger(valor) && valor >= 0 && valor <= MAX_PRECIO_CENTAVOS;
const moneda = new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" });

function exigir(condicion, mensaje) { if (!condicion) throw new TypeError(mensaje); }
export function nombreComida(codigo) { return TIPOS_COMIDA[codigo] ?? "Comida"; }

function validarOpciones(opciones, tipo, paqueteId, comida) {
  exigir(Array.isArray(opciones) && opciones.length <= 50, "La lista de opciones no es válida.");
  if (tipo === "MENU") exigir(opciones.length > 0, "Cada oferta necesita al menos un menú.");
  const identificadores = new Set();
  return opciones.map(opcion => {
    exigir(opcion && identificadorValido(opcion.codigo), "El código de la opción no es válido.");
    const idEsperado = `${paqueteId}/${comida}/${tipo}/${opcion.codigo}`;
    exigir(opcion.id === idEsperado && opcion.id.length <= 200 && !identificadores.has(opcion.id), "Hay una opción repetida o de otra oferta.");
    exigir(textoValido(opcion.nombre, 180), "El nombre de la opción no es válido.");
    const clavePrecio = tipo === "MENU" ? "extraCentavos" : "precioCentavos";
    exigir(centavosValidos(opcion[clavePrecio]), "El precio de la opción no es válido.");
    identificadores.add(opcion.id);
    return { id: opcion.id, codigo: opcion.codigo, nombre: opcion.nombre.trim(), [clavePrecio]: opcion[clavePrecio] };
  });
}

/** Vista del catálogo: PAQUETE > PAQUETE_TIPO_COMIDA > OPCION_PAQUETE. */
export function validarProductos(datos) {
  exigir(datos && datos.version === 2 && datos.moneda === "USD" && typeof datos.demostracion === "boolean", "El formato del catálogo no es válido.");
  exigir(Array.isArray(datos.productos) && datos.productos.length > 0 && datos.productos.length <= 100, "El catálogo no contiene paquetes válidos.");
  const identificadores = new Set();
  return datos.productos.map(producto => {
    exigir(producto && identificadorValido(producto.id) && !identificadores.has(producto.id), "Hay un identificador de paquete inválido o repetido.");
    exigir(identificadorValido(producto.servicioId), "El servicio del paquete no es válido.");
    exigir(textoValido(producto.nombre, 160) && textoValido(producto.descripcion, 20000), "El nombre o la descripción del paquete no es válido.");
    exigir(typeof producto.imagen === "string" && /^assets\/[a-zA-Z0-9_./-]+\.(?:avif|webp|png|jpe?g|svg)$/iu.test(producto.imagen) && !producto.imagen.includes(".."), "La imagen debe ser un recurso local de assets.");
    exigir(textoValido(producto.imagenAlt, 240) && textoValido(producto.etiqueta, 80), "La imagen o la etiqueta necesitan un texto descriptivo.");
    exigir(Array.isArray(producto.incluye) && producto.incluye.length > 0 && producto.incluye.length <= 20 && producto.incluye.every(texto => textoValido(texto, 500)), "La lista de servicios incluidos no es válida.");
    exigir(Array.isArray(producto.ofertas) && producto.ofertas.length > 0 && producto.ofertas.length <= 3, "El paquete necesita ofertas por tipo de comida.");
    const comidas = new Set();
    const ofertas = producto.ofertas.map(oferta => {
      exigir(oferta && Object.hasOwn(TIPOS_COMIDA, oferta.tipoComida) && !comidas.has(oferta.tipoComida), "Hay un tipo de comida inválido o repetido.");
      exigir(centavosValidos(oferta.precioCentavos), "El precio de la oferta no es válido.");
      exigir(Number.isInteger(oferta.minPersonas) && Number.isInteger(oferta.maxPersonas) && oferta.minPersonas >= 1 && oferta.maxPersonas <= 100000 && oferta.minPersonas <= oferta.maxPersonas, "Revisa los límites de personas de la oferta.");
      comidas.add(oferta.tipoComida);
      return {
        tipoComida: oferta.tipoComida, precioCentavos: oferta.precioCentavos,
        minPersonas: oferta.minPersonas, maxPersonas: oferta.maxPersonas,
        menus: validarOpciones(oferta.menus, "MENU", producto.id, oferta.tipoComida),
        extras: validarOpciones(oferta.extras, "EXTRA", producto.id, oferta.tipoComida),
      };
    });
    identificadores.add(producto.id);
    return {
      id: producto.id, servicioId: producto.servicioId, nombre: producto.nombre.trim(),
      descripcion: producto.descripcion.trim(), imagen: producto.imagen, imagenAlt: producto.imagenAlt.trim(),
      etiqueta: producto.etiqueta.trim(), incluye: producto.incluye.map(texto => texto.trim()), ofertas,
    };
  });
}

export function obtenerOferta(producto, tipoComida) {
  const oferta = producto?.ofertas.find(actual => actual.tipoComida === tipoComida);
  exigir(oferta, "Selecciona un tipo de comida disponible para este paquete.");
  return oferta;
}

function nuevoId() {
  return globalThis.crypto?.randomUUID?.() ?? `linea-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

/** La selección conserva la oferta y los IDs globales; nunca guarda precios en el carrito. */
export function crearLinea(producto, opciones, id = nuevoId()) {
  exigir(producto && identificadorValido(producto.id) && opciones && identificadorValido(id), "No se pudo identificar el paquete.");
  const oferta = obtenerOferta(producto, opciones.tipoComida);
  exigir(Number.isInteger(opciones.personas) && opciones.personas >= oferta.minPersonas && opciones.personas <= oferta.maxPersonas, `Indica entre ${oferta.minPersonas} y ${oferta.maxPersonas} personas, sin decimales.`);
  exigir(oferta.menus.some(menu => menu.id === opciones.menuId), "Selecciona un menú de este tipo de comida.");
  const extrasIds = opciones.extrasIds ?? [];
  exigir(Array.isArray(extrasIds) && extrasIds.length <= oferta.extras.length && new Set(extrasIds).size === extrasIds.length && extrasIds.every(idExtra => oferta.extras.some(extra => extra.id === idExtra)), "Selecciona complementos de la misma comida, sin repetirlos.");
  const notas = opciones.notas ?? "";
  exigir(typeof notas === "string" && notas.length <= 180, "Las indicaciones del paquete admiten hasta 180 caracteres.");
  return { id, productoId: producto.id, tipoComida: oferta.tipoComida, personas: opciones.personas, menuId: opciones.menuId, extrasIds: [...extrasIds], notas: notas.trim() };
}

/** Un pedido comparte tipo de comida, fecha y hora; los otros turnos se preparan aparte. */
export function validarCombinacion(lineas) {
  exigir(Array.isArray(lineas) && lineas.length <= MAX_LINEAS, "El carrito admite hasta 12 paquetes.");
  const tipos = new Set(lineas.map(linea => linea.tipoComida));
  exigir(tipos.size <= 1, "Cada pedido corresponde a un tipo de comida y horario. Prepara o vacía el pedido actual antes de agregar otra comida.");
}

export function normalizarCarrito(datos, productos) {
  const carrito = { version: 2, actualizadoEn: null, lineas: [] };
  if (!datos || ![1,2].includes(datos.version) || !Array.isArray(datos.lineas) || !Array.isArray(productos)) return carrito;
  if (typeof datos.actualizadoEn === "string" && /^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{3})?Z$/u.test(datos.actualizadoEn) && fechaValida(datos.actualizadoEn.slice(0,10))) carrito.actualizadoEn = new Date(datos.actualizadoEn).toISOString();
  const identificadores = new Set();
  for (const linea of datos.lineas.slice(0,100)) {
    if (carrito.lineas.length === MAX_LINEAS) break;
    if (!linea || !identificadorValido(linea.id) || identificadores.has(linea.id)) continue;
    const producto = productos.find(actual => actual.id === linea.productoId);
    if (!producto) continue;
    try {
      let opciones = linea;
      if (datos.version === 1) {
        // Migra los IDs locales del prototipo anterior a una oferta conocida.
        const comidaAnterior = carrito.lineas[0]?.tipoComida;
        const oferta = producto.ofertas.find(actual => (!comidaAnterior || actual.tipoComida === comidaAnterior) && actual.menus.some(menu => menu.codigo === linea.menuId));
        exigir(oferta, "El paquete anterior necesita una nueva selección.");
        exigir(Array.isArray(linea.extrasIds ?? []), "Complementos anteriores no válidos.");
        opciones = { ...linea, tipoComida: oferta.tipoComida,
          menuId: oferta.menus.find(menu => menu.codigo === linea.menuId).id,
          extrasIds: (linea.extrasIds ?? []).map(codigo => {
            const extra = oferta.extras.find(actual => actual.codigo === codigo);
            exigir(extra, "El complemento anterior ya no está disponible."); return extra.id;
          }),
        };
      }
      const nueva = crearLinea(producto, opciones, linea.id);
      validarCombinacion([...carrito.lineas,nueva]);
      carrito.lineas.push(nueva); identificadores.add(linea.id);
    } catch { /* Se recuperan las líneas válidas; la vista avisa de cualquier descarte. */ }
  }
  return carrito;
}

export function calcularLinea(linea, productos) {
  const producto = productos.find(actual => actual.id === linea?.productoId);
  exigir(producto, "El paquete ya no está disponible.");
  const opciones = crearLinea(producto, linea, linea.id);
  const oferta = obtenerOferta(producto, opciones.tipoComida);
  const menu = oferta.menus.find(actual => actual.id === opciones.menuId);
  const extras = opciones.extrasIds.map(id => oferta.extras.find(actual => actual.id === id));
  const precioPersonaCentavos = oferta.precioCentavos + menu.extraCentavos + extras.reduce((suma,extra) => suma+extra.precioCentavos,0);
  const subtotalCentavos = precioPersonaCentavos * opciones.personas;
  exigir(Number.isSafeInteger(subtotalCentavos), "El importe supera el límite permitido.");
  return { producto, oferta, menu, extras, precioPersonaCentavos, subtotalCentavos };
}

export function calcularTotales(lineas, productos, entrega = "retiro") {
  validarCombinacion(lineas);
  exigir(entrega === "retiro" || entrega === "domicilio", "Selecciona una forma de entrega válida.");
  const identificadores = new Set();
  const subtotalCentavos = lineas.reduce((suma,linea) => {
    exigir(!identificadores.has(linea.id), "El carrito contiene una línea repetida.");
    identificadores.add(linea.id);
    return suma + calcularLinea(linea,productos).subtotalCentavos;
  },0);
  const entregaCentavos = lineas.length > 0 && entrega === "domicilio" ? PRECIO_ENTREGA_CENTAVOS : 0;
  const totalCentavos = subtotalCentavos + entregaCentavos;
  exigir(Number.isSafeInteger(totalCentavos), "El total supera el límite permitido.");
  return { subtotalCentavos, entregaCentavos, totalCentavos, personas: lineas.reduce((suma,linea) => suma+linea.personas,0), tipoComida: lineas[0]?.tipoComida ?? null };
}

export function formatoMoneda(centavos) {
  exigir(Number.isSafeInteger(centavos) && centavos >= 0, "El importe debe expresarse en centavos enteros.");
  return moneda.format(centavos/100);
}

/** Resumen visible de demostración. No envía, cobra ni registra pedidos. */
export function crearResumenPedido(lineas, productos, contacto) {
  const totales = calcularTotales(lineas, productos, contacto.entrega);
  exigir(lineas.length > 0, "Agrega al menos un paquete.");
  return [
    `${nombreComida(totales.tipoComida)} · ${contacto.fecha} · ${contacto.hora}`,
    `A nombre de: ${contacto.nombre}`, `Correo: ${contacto.correo}`, `Teléfono: ${contacto.telefono}`,
    `Entrega: ${contacto.entrega === "domicilio" ? contacto.direccion : "Retiro coordinado"}`,
    "",
    ...lineas.flatMap((linea,indice) => {
      const detalle = calcularLinea(linea,productos);
      return [ `${indice+1}. ${detalle.producto.nombre} · ${linea.personas} personas`,
        `Menú: ${detalle.menu.nombre}`, `Complementos: ${detalle.extras.map(extra => extra.nombre).join(", ") || "Sin complementos"}`,
        ...(linea.notas ? [`Preferencias: ${linea.notas}`] : []), `Subtotal: ${formatoMoneda(detalle.subtotalCentavos)}`, "" ];
    }),
    `Paquetes: ${formatoMoneda(totales.subtotalCentavos)}`, `Entrega: ${formatoMoneda(totales.entregaCentavos)}`,
    `Total de referencia: ${formatoMoneda(totales.totalCentavos)}`,
    ...(contacto.notas ? ["",`Indicaciones: ${contacto.notas}`] : []),
  ].join("\n");
}

function fechaLocal() {
  const ahora = new Date();
  return `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, "0")}-${String(ahora.getDate()).padStart(2, "0")}`;
}

function fechaValida(fecha) {
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(fecha)) return false;
  const [anio, mes, dia] = fecha.split("-").map(Number);
  const fechaUTC = new Date(`${fecha}T12:00:00Z`);
  return anio >= 1900 && fechaUTC.getUTCFullYear() === anio && fechaUTC.getUTCMonth() + 1 === mes && fechaUTC.getUTCDate() === dia;
}

/** Los textos de este mapa se relacionan con cada campo mediante aria-describedby. */
export function validarCliente(valores, hoy = fechaLocal()) {
  const errores = {};
  const texto = (clave) => typeof valores?.[clave] === "string" ? valores[clave].trim() : "";
  const nombre = texto("nombre");
  if (nombre.length < 3 || nombre.length > 80 || !/^[\p{L}\p{M}][\p{L}\p{M} '\u2019-]*[\p{L}\p{M}]$/u.test(nombre)) errores.nombre = "Escribe tu nombre: entre 3 y 80 caracteres, sin números.";
  const correo = texto("correo");
  if (correo.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(correo)) errores.correo = "Escribe un correo válido, por ejemplo nombre@correo.com.";
  const telefono = texto("telefono");
  if (telefono.length > 30 || !/^\+?[\d ()-]+$/u.test(telefono) || !/^\d{9,15}$/u.test(telefono.replace(/\D/gu, ""))) errores.telefono = "Escribe un teléfono de 9 a 15 dígitos; puedes incluir el código de país.";
  const fecha = texto("fecha");
  if (!fechaValida(fecha) || !fechaValida(hoy) || fecha < hoy) errores.fecha = "Elige una fecha válida a partir de hoy.";
  if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/u.test(texto("hora"))) errores.hora = "Elige la hora del evento en formato de 24 horas.";
  const entrega = texto("entrega");
  if (entrega !== "retiro" && entrega !== "domicilio") errores.entrega = "Elige retiro o entrega a domicilio.";
  const direccion = texto("direccion");
  if ((entrega === "domicilio" && direccion.length < 8) || direccion.length > 180) errores.direccion = "Para domicilio, escribe una dirección de entre 8 y 180 caracteres.";
  if (texto("notas").length > 300) errores.notas = "Las indicaciones generales admiten hasta 300 caracteres.";
  return errores;
}
