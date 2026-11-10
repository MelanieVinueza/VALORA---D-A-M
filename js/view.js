/* Vista: crea elementos y presenta datos; las reglas de precio viven en cart.js. */
import { calcularLinea, calcularTotales, formatoMoneda, nombreComida, obtenerOferta, TIPOS_COMIDA } from "./cart.js";

export function mostrarServicios(servicios) {
  const tarjetas = Object.entries(servicios).map(([id, servicio], indice) => {
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta-servicio";
    tarjeta.dataset.category = servicio.categoria;

    const visual = document.createElement("div");
    visual.className = `servicio-visual ${servicio.estilo}`;
    const numero = document.createElement("span");
    numero.className = "numero-servicio";
    numero.textContent = servicio.etiqueta || `0${indice + 1}`;
    const icono = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icono.setAttribute("aria-hidden", "true");
    const uso = document.createElementNS("http://www.w3.org/2000/svg", "use");
    uso.setAttribute("href", `#${servicio.icono}`);
    icono.append(uso);
    const etiqueta = document.createElement("span");
    etiqueta.className = "servicio-chip";
    etiqueta.textContent = servicio.frase;
    visual.append(numero, icono, etiqueta);

    const contenido = document.createElement("div");
    contenido.className = "servicio-contenido";
    const titulo = document.createElement("h3");
    titulo.textContent = servicio.nombre;
    const resumen = document.createElement("p");
    resumen.textContent = servicio.resumen;
    const enlace = document.createElement("a");
    enlace.className = "enlace-flecha detalle-servicio";
    enlace.href = "#contacto";
    enlace.dataset.service = id;
    enlace.setAttribute("role", "button");
    enlace.setAttribute("aria-label", `Consultar esta solución: ${servicio.nombre}`);
    enlace.setAttribute("aria-haspopup", "dialog");
    enlace.setAttribute("aria-controls", "dialogo-servicio");
    enlace.append("Consultar esta solución ");
    const flecha = document.createElement("span");
    flecha.setAttribute("aria-hidden", "true");
    flecha.textContent = "↗";
    enlace.append(flecha);
    contenido.append(titulo, resumen, enlace);
    tarjeta.append(visual, contenido);
    return tarjeta;
  });
  document.querySelector(".grid-servicios")?.replaceChildren(...tarjetas);
}

export function mostrarProductos(productos, tipoComida = "TODOS") {
  const fragmento = document.createDocumentFragment();
  const plantilla = document.getElementById("plantilla-paquete");
  const visibles = productos.filter(producto => tipoComida === "TODOS" || producto.ofertas.some(oferta => oferta.tipoComida === tipoComida));
  visibles.forEach((producto, indice) => {
    const ofertas = producto.ofertas.filter(oferta => tipoComida === "TODOS" || oferta.tipoComida === tipoComida);
    const tarjeta = plantilla.content.firstElementChild.cloneNode(true);
    tarjeta.querySelector("img").src = producto.imagen;
    tarjeta.querySelector("img").alt = producto.imagenAlt;
    tarjeta.querySelector(".paquete-ordinal").textContent = `0${indice + 1}`;
    tarjeta.querySelector(".paquete-nombre").textContent = producto.nombre;
    tarjeta.querySelector(".paquete-etiqueta").textContent = producto.etiqueta;
    tarjeta.querySelector(".paquete-descripcion").textContent = producto.descripcion;
    tarjeta.querySelector(".paquete-comidas").textContent = ofertas.map(oferta => nombreComida(oferta.tipoComida)).join(" · ");
    tarjeta.querySelector(".paquete-variedad").textContent = ofertas.length === 1
      ? `${ofertas[0].menus.length} menús · ${ofertas[0].extras.length} complementos`
      : "Menús y complementos según el tipo de comida";
    tarjeta.querySelector(".paquete-precio strong").textContent = formatoMoneda(Math.min(...ofertas.map(oferta => oferta.precioCentavos)));
    tarjeta.querySelector(".paquete-minimo").textContent = ofertas.length === 1
      ? `De ${ofertas[0].minPersonas} a ${ofertas[0].maxPersonas} personas por paquete.`
      : `Desde ${Math.min(...ofertas.map(oferta => oferta.minPersonas))} personas. Consulta las condiciones de cada comida.`;
    for (const texto of producto.incluye) {
      const item = document.createElement("li");
      item.textContent = texto;
      tarjeta.querySelector(".paquete-incluye").append(item);
    }
    const boton = tarjeta.querySelector("button");
    boton.dataset.producto = producto.id;
    boton.setAttribute("aria-label", `Personalizar y agregar ${producto.nombre}`);
    boton.setAttribute("aria-haspopup", "dialog");
    boton.setAttribute("aria-controls", "configurar-paquete");
    fragmento.append(tarjeta);
  });
  document.getElementById("catalogo-productos").replaceChildren(fragmento);
  return visibles.length;
}

export function mostrarConfiguracion(producto, linea, comidaInicial = null) {
  document.getElementById("titulo-configuracion").textContent = producto.nombre;
  const tipo = document.getElementById("paquete-tipo-comida");
  tipo.replaceChildren(...Object.keys(TIPOS_COMIDA)
    .filter(codigo => producto.ofertas.some(oferta => oferta.tipoComida === codigo))
    .map(codigo => new Option(nombreComida(codigo), codigo)));
  tipo.value = linea?.tipoComida ?? (producto.ofertas.some(oferta => oferta.tipoComida === comidaInicial) ? comidaInicial : producto.ofertas[0].tipoComida);
  document.getElementById("paquete-personas").value = linea?.personas ?? obtenerOferta(producto, tipo.value).minPersonas;
  mostrarOpcionesComida(producto, linea);
  document.getElementById("paquete-notas").value = linea?.notas ?? "";
  document.getElementById("guardar-paquete").textContent = linea ? "Guardar cambios del paquete" : "Agregar al carrito";
  const error = document.getElementById("error-configuracion");
  error.hidden = true;
  error.textContent = "";
  for (const campo of document.querySelectorAll('#formulario-paquete input, #formulario-paquete select, #formulario-paquete textarea')) {
    campo.setCustomValidity("");
    campo.removeAttribute("aria-invalid");
  }
}

export function mostrarOpcionesComida(producto, linea = null) {
  const oferta = obtenerOferta(producto, document.getElementById("paquete-tipo-comida").value);
  const personas = document.getElementById("paquete-personas");
  const cantidadActual = linea?.personas ?? Number(personas.value);
  personas.min = oferta.minPersonas;
  personas.max = oferta.maxPersonas;
  personas.value = Number.isInteger(cantidadActual) && cantidadActual >= oferta.minPersonas && cantidadActual <= oferta.maxPersonas ? cantidadActual : oferta.minPersonas;
  document.getElementById("ayuda-personas").textContent = `Entre ${oferta.minPersonas} y ${oferta.maxPersonas}, en números enteros.`;
  document.getElementById("precio-base-comida").textContent = `${nombreComida(oferta.tipoComida)} desde ${formatoMoneda(oferta.precioCentavos)} por persona, más los adicionales seleccionados.`;
  const menu = document.getElementById("paquete-menu");
  menu.replaceChildren(...oferta.menus.map(opcion => new Option(
    `${opcion.nombre}${opcion.extraCentavos ? ` (+${formatoMoneda(opcion.extraCentavos)} / persona)` : " (incluido)"}`,
    opcion.id,
  )));
  menu.value = linea?.menuId ?? oferta.menus[0].id;
  const opciones = document.createDocumentFragment();
  for (const extra of oferta.extras) {
    const label = document.createElement("label");
    label.className = "opcion-extra";
    const casilla = document.createElement("input");
    casilla.type = "checkbox";
    casilla.name = "extras";
    casilla.value = extra.id;
    casilla.checked = linea?.extrasIds.includes(extra.id) ?? false;
    const texto = document.createElement("span");
    texto.textContent = `${extra.nombre} · +${formatoMoneda(extra.precioCentavos)} por persona`;
    label.append(casilla, texto);
    opciones.append(label);
  }
  document.getElementById("opciones-extras").replaceChildren(opciones);
}

export function mostrarTotales(lineas, productos, entrega) {
  const total = calcularTotales(lineas, productos, entrega);
  document.getElementById("subtotal-carrito").textContent = formatoMoneda(total.subtotalCentavos);
  document.getElementById("entrega-carrito").textContent = formatoMoneda(total.entregaCentavos);
  document.getElementById("total-carrito").textContent = formatoMoneda(total.totalCentavos);
  document.getElementById("pedido-tipo-comida").textContent = total.tipoComida ? `${nombreComida(total.tipoComida)} · un mismo horario de entrega` : "";
  return total;
}

// Una cantidad cambia importes, no la identidad de los controles: conserva el foco y el clic.
export function actualizarLineaCarrito(linea, productos) {
  const tarjeta = document.querySelector(`#lineas-carrito [data-linea="${linea.id}"]`);
  if (!tarjeta) return;
  const detalle = calcularLinea(linea, productos);
  tarjeta.querySelector(".linea-total").textContent = formatoMoneda(detalle.subtotalCentavos);
  tarjeta.querySelector(".linea-precio-persona").textContent = `${formatoMoneda(detalle.precioPersonaCentavos)} por persona`;
  const cantidad = tarjeta.querySelector("input");
  cantidad.value = linea.personas;
  cantidad.removeAttribute("aria-invalid");
  tarjeta.querySelector(".linea-error").hidden = true;
  tarjeta.querySelector('[data-accion="menos"]').setAttribute("aria-disabled", String(linea.personas === detalle.oferta.minPersonas));
  tarjeta.querySelector('[data-accion="mas"]').setAttribute("aria-disabled", String(linea.personas === detalle.oferta.maxPersonas));
}

export function mostrarActualizacion(carrito) {
  const actualizado = document.getElementById("actualizacion-carrito");
  actualizado.replaceChildren();
  if (carrito.actualizadoEn) {
    const tiempo = document.createElement("time");
    tiempo.dateTime = carrito.actualizadoEn;
    tiempo.textContent = new Intl.DateTimeFormat("es-EC", { dateStyle: "medium", timeStyle: "short" }).format(new Date(carrito.actualizadoEn));
    actualizado.append("Última actualización: ", tiempo);
  }
}

export function mostrarCarrito(carrito, productos, entrega) {
  const plantilla = document.getElementById("plantilla-linea");
  const fragmento = document.createDocumentFragment();
  carrito.lineas.forEach((linea, indice) => {
    const detalle = calcularLinea(linea, productos);
    const tarjeta = plantilla.content.firstElementChild.cloneNode(true);
    tarjeta.dataset.linea = linea.id;
    tarjeta.querySelector(".linea-nombre").textContent = `${indice + 1}. ${detalle.producto.nombre}`;
    tarjeta.querySelector(".linea-comida").textContent = nombreComida(linea.tipoComida);
    tarjeta.querySelector(".linea-menu").textContent = detalle.menu.nombre;
    tarjeta.querySelector(".linea-total").textContent = formatoMoneda(detalle.subtotalCentavos);
    tarjeta.querySelector(".linea-extras").textContent = `Extras: ${detalle.extras.map(extra => extra.nombre).join(", ") || "sin extras"}.`;
    const notas = tarjeta.querySelector(".linea-notas");
    notas.textContent = linea.notas;
    notas.hidden = !linea.notas;
    tarjeta.querySelector(".linea-precio-persona").textContent = `${formatoMoneda(detalle.precioPersonaCentavos)} por persona`;
    const cantidad = tarjeta.querySelector("input");
    cantidad.value = linea.personas;
    cantidad.min = detalle.oferta.minPersonas;
    cantidad.max = detalle.oferta.maxPersonas;
    cantidad.id = `cantidad-${linea.id}`;
    cantidad.setAttribute("aria-label", `Personas para ${detalle.producto.nombre}, paquete ${indice + 1}`);
    cantidad.setAttribute("aria-describedby", `error-${linea.id}`);
    tarjeta.querySelector("label").htmlFor = cantidad.id;
    tarjeta.querySelector(".linea-error").id = `error-${linea.id}`;
    const etiquetas = { menos: "Quitar una persona de", mas: "Añadir una persona a", editar: "Editar paquete", eliminar: "Quitar paquete" };
    for (const boton of tarjeta.querySelectorAll("[data-accion]")) {
      boton.setAttribute("aria-label", `${etiquetas[boton.dataset.accion]} ${indice + 1}, ${detalle.producto.nombre}`);
    }
    tarjeta.querySelector('[data-accion="menos"]').setAttribute("aria-disabled", String(linea.personas === detalle.oferta.minPersonas));
    tarjeta.querySelector('[data-accion="mas"]').setAttribute("aria-disabled", String(linea.personas === detalle.oferta.maxPersonas));
    fragmento.append(tarjeta);
  });
  document.getElementById("lineas-carrito").replaceChildren(fragmento);
  document.getElementById("cuenta-carrito").textContent = String(carrito.lineas.length);
  document.querySelector(".acceso-carrito").setAttribute("aria-label", `Ver carrito, ${carrito.lineas.length} ${carrito.lineas.length === 1 ? "paquete" : "paquetes"}`);
  mostrarActualizacion(carrito);
  mostrarTotales(carrito.lineas, productos, entrega);
}
