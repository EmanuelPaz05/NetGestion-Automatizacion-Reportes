'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {weeklySummary,weeklyHTML}=require('../src/weekly');
const rows=require('../data/operaciones-semana.json');
test('calcula resumen de una semana con pagos mixtos',()=>{const r=weeklySummary(rows,'2026-11-09','2026-11-15');assert.equal(r.operaciones,6);assert.equal(r.total,154000);assert.equal(r.medios.transferencia,50500);assert.equal(r.comprobantes.emitidas,3);});
test('no contabiliza ventas fuera del rango',()=>{const r=weeklySummary(rows,'2026-11-09','2026-11-09');assert.equal(r.operaciones,1);assert.equal(r.total,18500);});
test('detecta descuadre entre venta y cobros',()=>assert.throws(()=>weeklySummary([{fecha:'2026-11-09',id:'A',unidades:1,total:10,cobros:[{medio:'efectivo',importe:9}],factura:'emitidas'}],'2026-11-09','2026-11-15'),/no coinciden/));
test('genera HTML del reporte',()=>assert.match(weeklyHTML(weeklySummary(rows,'2026-11-09','2026-11-15')),/Transferencias registradas/));
