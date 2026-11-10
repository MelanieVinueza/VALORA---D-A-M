import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { inicializarTienda } from '../js/tienda.js';
import { inicializarBorrador } from '../js/borrador.js';
import { mostrarServicios } from '../js/view.js';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const catalogo=JSON.parse(readFileSync(new URL('../data/productos.json',import.meta.url)));
const servicios=JSON.parse(readFileSync(new URL('../data/servicios.json',import.meta.url))).servicios;

async function entorno(guardado=null) {
  const dom=new JSDOM(html,{url:'http://localhost/',pretendToBeVisual:true});
  const w=dom.window;
  for(const clave of ['window','document','localStorage','sessionStorage','location','Option','Event']) Object.defineProperty(globalThis,clave,{configurable:true,writable:true,value:clave==='window'?w:w[clave]});
  w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};
  w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'));};
  globalThis.fetch=async()=>new Response(JSON.stringify(catalogo),{status:200,headers:{'Content-Type':'application/json'}});
  if(guardado) w.localStorage.setItem('valora-carrito-v1',JSON.stringify(guardado));
  mostrarServicios(servicios);
  await inicializarTienda();
  const $=selector=>w.document.querySelector(selector);
  const cambiar=(selector,valor)=>{const e=$(selector);e.value=valor;e.dispatchEvent(new w.Event('change',{bubbles:true}));};
  const enviar=selector=>$(selector).dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
  const cerrar=()=>{
    $('#recordar-pedido').checked=false;
    $('#recordar-pedido').dispatchEvent(new w.Event('change'));
    dom.window.close();
  };
  return {dom,w,$,cambiar,enviar,cerrar};
}

test('filtros por comida, configuración, cálculo, guardado y edición mantienen la selección',async()=>{
  const e=await entorno();
  try {
    assert.equal(e.w.document.querySelectorAll('.tarjeta-servicio').length,4);
    assert.equal(e.w.document.querySelectorAll('.tarjeta-paquete').length,6);
    e.$('[data-comida="DESAYUNO"]').click();
    assert.equal(e.w.document.querySelectorAll('.tarjeta-paquete').length,3);
    e.$('[data-producto="buffet-empresarial"]').click();
    assert.equal(e.$('#paquete-tipo-comida').value,'DESAYUNO');
    assert.equal(e.$('#paquete-menu').options.length,4);
    e.$('#opciones-extras input').checked=true;
    e.$('#opciones-extras input').dispatchEvent(new e.w.Event('change',{bubbles:true}));
    assert.ok(e.$('#precio-configuracion').textContent.includes('80'));
    e.enviar('#formulario-paquete');
    assert.equal(e.$('.linea-comida').textContent,'Desayuno');
    let carrito=JSON.parse(e.w.localStorage.getItem('valora-carrito-v1'));
    assert.equal(carrito.lineas[0].tipoComida,'DESAYUNO');
    assert.equal(carrito.lineas[0].extrasIds.length,1);
    e.$('[data-accion="editar"]').click();
    assert.equal(e.$('#paquete-tipo-comida').value,'DESAYUNO');
    assert.equal(e.$('#opciones-extras input').checked,true);
    e.cambiar('#paquete-tipo-comida','ALMUERZO');
    assert.equal(e.$('#paquete-menu').options.length,8);
    assert.equal(e.w.document.querySelectorAll('#opciones-extras input:checked').length,0);
    assert.ok(e.$('#paquete-menu').value.includes('/ALMUERZO/'));
    e.enviar('#formulario-paquete');
    carrito=JSON.parse(e.w.localStorage.getItem('valora-carrito-v1'));
    assert.equal(carrito.lineas[0].tipoComida,'ALMUERZO');
    assert.equal(e.$('.linea-comida').textContent,'Almuerzo');
  } finally {e.cerrar();}
});

test('impide mezclar otra comida y conserva el pedido existente',async()=>{
  const e=await entorno();
  try {
    e.$('[data-producto="buffet-empresarial"]').click(); e.enviar('#formulario-paquete');
    e.$('[data-comida="DESAYUNO"]').click();
    e.$('[data-producto="bienestar"]').click(); e.enviar('#formulario-paquete');
    assert.equal(JSON.parse(e.w.localStorage.getItem('valora-carrito-v1')).lineas.length,1);
    assert.equal(e.$('#configurar-paquete').open,true);
    assert.ok(e.$('#error-configuracion').textContent.includes('tipo de comida y horario'));
  } finally {e.cerrar();}
});

test('el recorrido termina en un resumen local y limpia el carrito sin enviar pedidos',async()=>{
  const e=await entorno();
  let envios=0;
  globalThis.fetch=async()=>{envios++;throw new Error('No debe enviarse un pedido sin backend');};
  try {
    e.$('[data-producto="buffet-empresarial"]').click(); e.enviar('#formulario-paquete');
    const fecha=new Date(Date.now()+3*86400000).toISOString().slice(0,10);
    for(const [campo,valor] of Object.entries({nombre:'Cliente de prueba',correo:'prueba@example.com',telefono:'0991234567',fecha,hora:'13:00',entrega:'retiro',notas:'Entrada principal'})) e.cambiar('#pedido-'+campo,valor);
    e.enviar('#datos-pedido');
    assert.equal(e.$('#comprobante-pedido').hidden,false);
    assert.ok(e.$('#resumen-pedido-preparado').textContent.includes('Almuerzo'));
    assert.ok(e.$('#resumen-pedido-preparado').textContent.includes('Entrada principal'));
    assert.equal(JSON.parse(e.w.localStorage.getItem('valora-carrito-v1')).lineas.length,0);
    assert.equal(e.$('#pedido-nombre').value,'');
    assert.equal(envios,0);
    e.$('#seguir-comprando').click();
    assert.equal(e.$('#resumen-pedido-preparado').textContent,'');
  } finally {e.cerrar();}
});

test('recupera carritos anteriores y muestra sus notas como texto',async()=>{
  const e=await entorno({version:1,lineas:[{id:'antigua',productoId:'buffet-empresarial',menuId:'pollo',personas:20,extrasIds:[],notas:'<img src=x onerror=alert(1)>'}]});
  try {
    assert.equal(e.$('.cantidad-personas').value,'20');
    assert.equal(e.$('.linea-notas img'),null);
    assert.ok(e.$('.linea-notas').textContent.includes('<img'));
    assert.equal(e.$('.linea-comida').textContent,'Almuerzo');
    assert.equal(e.$('#aviso-almacenamiento').hidden,false);
  } finally {e.cerrar();}
});

test('un cambio en otra pestaña actualiza la comida y las cantidades',async()=>{
  const e=await entorno();
  try {
    const oferta=catalogo.productos[0].ofertas.find(o=>o.tipoComida==='MERIENDA');
    e.w.localStorage.setItem('valora-carrito-v1',JSON.stringify({version:2,lineas:[{id:'otra',productoId:'buffet-empresarial',tipoComida:'MERIENDA',menuId:oferta.menus[0].id,personas:15,extrasIds:[],notas:''}]}));
    e.w.dispatchEvent(new e.w.StorageEvent('storage',{key:'valora-carrito-v1'}));
    assert.equal(e.$('.linea-comida').textContent,'Merienda');
    assert.equal(e.$('.cantidad-personas').value,'15');
  } finally {e.cerrar();}
});

test('el borrador de cotización anterior admite el nuevo campo opcional',async()=>{
  const e=await entorno();
  try {
    const form=e.$('#formulario-cotizacion'), campos=[...form.querySelectorAll('[name]')];
    const valores=Object.fromEntries(campos.filter(c=>c.name!=='tipoComida').map(c=>[c.name,c.name==='nombre'?'Cliente de prueba':'']));
    e.w.sessionStorage.setItem('valora-borrador-v1',JSON.stringify({version:1,valores}));
    inicializarBorrador(form,campos,()=>{});
    assert.equal(e.$('#nombre').value,'Cliente de prueba');
    assert.equal(e.$('#tipo-comida').value,'');
  } finally {e.cerrar();}
});

test('no existen IDs HTML duplicados y los servicios seleccionables existen en el catálogo',async()=>{
  const e=await entorno();
  try {
    const ids=[...e.w.document.querySelectorAll('[id]')].map(el=>el.id);
    assert.equal(new Set(ids).size,ids.length);
    for(const opcion of e.$('#servicio').options) if(opcion.value) assert.ok(Object.hasOwn(servicios,opcion.value));
    assert.equal(e.w.document.querySelector('input[type=password]'),null);
  } finally {e.cerrar();}
});
