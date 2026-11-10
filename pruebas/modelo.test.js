import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { validarProductos, crearLinea, calcularLinea, calcularTotales, normalizarCarrito, validarCliente, validarCombinacion, crearResumenPedido } from '../js/cart.js';
import { crearResumenSolicitud } from '../js/solicitud.js';

const catalogo = JSON.parse(readFileSync(new URL('../data/productos.json',import.meta.url)));
const productos = validarProductos(catalogo);
const buffet = productos.find(p => p.id === 'buffet-empresarial');
function linea(comida='ALMUERZO', extras=[], id='prueba') {
  const oferta=buffet.ofertas.find(o => o.tipoComida===comida);
  return crearLinea(buffet,{tipoComida:comida,personas:10,menuId:oferta.menus[0].id,extrasIds:extras},id);
}

test('se conservan los seis paquetes y cada oferta identifica su comida e imagen',() => {
  assert.equal(productos.length,6);
  const servicios=JSON.parse(readFileSync(new URL('../data/servicios.json',import.meta.url))).servicios;
  for (const p of productos) {
    assert.ok(Object.hasOwn(servicios,p.servicioId));
    assert.ok(existsSync(fileURLToPath(new URL('../'+p.imagen,import.meta.url))));
    for(const o of p.ofertas) {
      const l=crearLinea(p,{tipoComida:o.tipoComida,personas:o.minPersonas,menuId:o.menus[0].id,extrasIds:o.extras.map(e=>e.id)});
      assert.ok(calcularLinea(l,productos).subtotalCentavos>0);
    }
  }
});

test('el precio base cambia entre desayuno y almuerzo del mismo paquete',() => {
  assert.equal(calcularLinea(linea('DESAYUNO'),productos).subtotalCentavos,6500);
  assert.equal(calcularLinea(linea(),productos).subtotalCentavos,12500);
});

test('los complementos se cobran por persona y el envío una sola vez',() => {
  const extra=buffet.ofertas.find(o=>o.tipoComida==='ALMUERZO').extras[0];
  const a=linea('ALMUERZO',[extra.id],'a'), b=linea('ALMUERZO',[],'b');
  const total=calcularTotales([a,b],productos,'domicilio');
  assert.equal(total.subtotalCentavos,27000);
  assert.equal(total.entregaCentavos,800);
  assert.equal(total.totalCentavos,27800);
  assert.equal(calcularTotales([a,b],productos,'retiro').entregaCentavos,0);
});

test('no se admite un menú de otra comida',() => {
  assert.throws(()=>crearLinea(buffet,{...linea(),tipoComida:'DESAYUNO'}),/menú de este tipo/);
});

test('no se admiten extras de otra comida ni extras repetidos',() => {
  const otro=buffet.ofertas.find(o=>o.tipoComida==='DESAYUNO').extras[0].id;
  assert.throws(()=>linea('ALMUERZO',[otro]),/misma comida/);
  const extra=buffet.ofertas.find(o=>o.tipoComida==='ALMUERZO').extras[0].id;
  assert.throws(()=>linea('ALMUERZO',[extra,extra]),/sin repetir/);
});

test('un pedido no mezcla desayunos y almuerzos con una única hora',() => {
  assert.throws(()=>validarCombinacion([linea('DESAYUNO',[],'a'),linea('ALMUERZO',[],'b')]),/tipo de comida y horario/);
});

test('los límites de personas proceden de la oferta, sin fijar 10 a 200 en la lógica',() => {
  const datos=structuredClone(catalogo);
  datos.productos[0].ofertas[0].minPersonas=1;
  datos.productos[0].ofertas[0].maxPersonas=500;
  const p=validarProductos(datos)[0];
  const l=crearLinea(p,{tipoComida:p.ofertas[0].tipoComida,personas:500,menuId:p.ofertas[0].menus[0].id});
  assert.equal(l.personas,500);
  assert.throws(()=>crearLinea(p,{...l,personas:501}),/entre 1 y 500/);
  assert.throws(()=>crearLinea(p,{...l,personas:1.5}),/sin decimales/);
});

test('el carrito conserva comida e IDs globales sin guardar precios',() => {
  const l=linea();
  const recuperado=normalizarCarrito(JSON.parse(JSON.stringify({version:2,lineas:[{...l,precioCentavos:1}]})),productos);
  assert.equal(recuperado.lineas[0].tipoComida,'ALMUERZO');
  assert.equal(recuperado.lineas[0].menuId,'buffet-empresarial/ALMUERZO/MENU/pollo');
  assert.equal(Object.hasOwn(recuperado.lineas[0],'precioCentavos'),false);
});

test('migra un carrito anterior con códigos locales sin perder sus cantidades',() => {
  const recuperado=normalizarCarrito({version:1,lineas:[{id:'antiguo',productoId:'buffet-empresarial',personas:25,menuId:'pollo',extrasIds:['postre'],notas:'Sin azúcar'}]},productos);
  assert.equal(recuperado.version,2);
  assert.equal(recuperado.lineas[0].personas,25);
  assert.equal(recuperado.lineas[0].extrasIds[0],'buffet-empresarial/ALMUERZO/EXTRA/postre');
});

test('recupera las líneas válidas y descarta IDs desconocidos o duplicados',() => {
  const l=linea();
  const recuperado=normalizarCarrito({version:2,lineas:[{...l,id:'invalido',menuId:'inventado'},l,l]},productos);
  assert.deepEqual(recuperado.lineas,[l]);
});

test('el total se recalcula desde el catálogo actualizado',() => {
  const l=linea();
  const nuevos=structuredClone(productos);
  nuevos[0].ofertas.find(o=>o.tipoComida==='ALMUERZO').precioCentavos=1500;
  assert.equal(calcularLinea(l,nuevos).subtotalCentavos,15000);
});

test('el catálogo rechaza ofertas repetidas, referencias cruzadas y precios negativos',() => {
  const repetido=structuredClone(catalogo); repetido.productos[0].ofertas.push(repetido.productos[0].ofertas[0]);
  assert.throws(()=>validarProductos(repetido));
  const cruzado=structuredClone(catalogo); cruzado.productos[0].ofertas[0].menus[0].id='otro/ALMUERZO/MENU/pollo';
  assert.throws(()=>validarProductos(cruzado));
  const negativo=structuredClone(catalogo); negativo.productos[0].ofertas[0].precioCentavos=-1;
  assert.throws(()=>validarProductos(negativo));
});

test('el resumen incluye menú, comida, cantidades, extras y total',() => {
  const texto=crearResumenPedido([linea()],productos,{nombre:'Cliente de prueba',correo:'prueba@example.com',telefono:'0991234567',fecha:'2026-12-01',hora:'13:00',entrega:'retiro',notas:'Acceso principal'});
  for (const parte of ['Almuerzo','10 personas','Pollo con arroz','Total de referencia','Acceso principal']) assert.ok(texto.includes(parte));
});

test('la cotización conserva el tipo de comida y los datos requeridos',() => {
  const texto=crearResumenSolicitud({nombre:'Prueba',empresa:'Empresa',correo:'prueba@example.com',telefono:'0991234567',tipoComida:'MERIENDA',mensaje:'Servicio para la empresa'},'Alimentación para equipos');
  assert.ok(texto.includes('Tipo de comida: Merienda'));
});

test('el contacto exige fecha válida, hora, teléfono y dirección para domicilio',() => {
  const contacto={nombre:'Cliente de prueba',correo:'prueba@example.com',telefono:'0991234567',fecha:'2026-12-01',hora:'13:00',entrega:'retiro',direccion:''};
  assert.deepEqual(validarCliente(contacto,'2026-11-01'),{});
  assert.ok(validarCliente({...contacto,entrega:'domicilio'},'2026-11-01').direccion);
  assert.ok(validarCliente({...contacto,fecha:'2026-02-30'},'2026-01-01').fecha);
});
