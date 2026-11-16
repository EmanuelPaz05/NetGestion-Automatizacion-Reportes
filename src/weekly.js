'use strict';
// Datos ficticios para el coloquio. No hay conexión a ARCA ni a bancos.
const normalize = value => Math.round(Number(value) * 100) / 100;
const isDate = value => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value + 'T00:00:00Z'));
function weeklySummary(operations, start, end) {
 if (!isDate(start) || !isDate(end) || start > end) throw new Error('Rango de fechas inválido');
 if (!Array.isArray(operations)) throw new Error('Operaciones inválidas');
 const selected = operations.filter(x => x.fecha >= start && x.fecha <= end);
 const byMethod = { efectivo:0, transferencia:0, debito:0, credito:0, cuenta_corriente:0 };
 const transfers = [];
 const invoices = { emitidas:0, pendientes:0, sin_factura:0 };
 let gross=0, units=0;
 for (const op of selected) {
   const qty=Number(op.unidades), amount=Number(op.total);
   if(!Number.isSafeInteger(qty) || qty<1 || !Number.isFinite(amount) || amount<0)throw new Error('Operación con valores inválidos');
   if(!Array.isArray(op.cobros) || op.cobros.length===0)throw new Error('Faltan medios de cobro');
   let paymentTotal=0;
   for(const pay of op.cobros){
     if(!Object.hasOwn(byMethod,pay.medio))throw new Error('Medio de cobro desconocido');
     const p=Number(pay.importe);
     if(!Number.isFinite(p)||p<0)throw new Error('Importe de cobro inválido');
     byMethod[pay.medio]=normalize(byMethod[pay.medio]+p);
     paymentTotal=normalize(paymentTotal+p);
     if(pay.medio==='transferencia')transfers.push({fecha:op.fecha,venta:op.id,importe:p,referencia:String(pay.referencia||'Sin referencia')});
   }
   if(Math.abs(paymentTotal-amount)>0.009)throw new Error('Cobros y total de venta no coinciden');
   if(!Object.hasOwn(invoices,op.factura))throw new Error('Estado de factura desconocido');
   invoices[op.factura]++;
   gross=normalize(gross+amount);units+=qty;
 }
 return {desde:start,hasta:end,operaciones:selected.length,unidades:units,total:normalize(gross),medios:byMethod,transferencias:transfers,comprobantes:invoices,nota:'Ejemplo ficticio. Los estados de factura no se consultan a ARCA y las transferencias no se concilian con el banco.'};
}
function weeklyHTML(r) {
 const fmt=x=>new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS'}).format(x);
 const esc=x=>String(x).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
 const payments=Object.entries(r.medios).map(([name,amount])=>'<tr><td>'+esc(name.replaceAll('_',' '))+'</td><td>'+fmt(amount)+'</td></tr>').join('');
 const transferList=r.transferencias.map(t=>'<li>'+esc(t.fecha)+' · venta '+esc(t.venta)+' · '+fmt(t.importe)+' · referencia: '+esc(t.referencia)+'</li>').join('');
 return '<!doctype html><html lang="es"><meta charset="utf-8"><title>Resumen semanal Net-Gestión DEMO</title><body style="font:16px Arial,sans-serif;max-width:650px;margin:30px auto;color:#18332b"><h1>Resumen semanal · Demo</h1><p><strong>'+esc(r.desde)+' al '+esc(r.hasta)+'</strong></p><p>Operaciones: '+r.operaciones+' · Unidades: '+r.unidades+' · Total: <strong>'+fmt(r.total)+'</strong></p><h2>Medios de cobro</h2><table border="1" cellpadding="8" cellspacing="0"><tr><th>Medio</th><th>Total</th></tr>'+payments+'</table><h2>Transferencias registradas</h2><ul>'+transferList+'</ul><h2>Estados de comprobantes</h2><p>Emitidas: '+r.comprobantes.emitidas+' · Pendientes: '+r.comprobantes.pendientes+' · Sin factura: '+r.comprobantes.sin_factura+'</p><p><em>'+esc(r.nota)+'</em></p></body></html>';
}
module.exports={weeklySummary,weeklyHTML};
