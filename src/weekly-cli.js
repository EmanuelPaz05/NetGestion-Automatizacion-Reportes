'use strict';
const fs=require('node:fs');
const path=require('node:path');
const {weeklySummary,weeklyHTML}=require('./weekly');
const {deliver}=require('./transport');
const from=process.argv.find(x=>x.startsWith('--from='))?.split('=')[1] || '2026-11-09';
const to=process.argv.find(x=>x.startsWith('--to='))?.split('=')[1] || '2026-11-15';
(async()=>{
 try{
 const sales=require('../data/operaciones-semana.json');
 const report=weeklySummary(sales,from,to);
 const html=weeklyHTML(report);
 const dir=path.resolve(__dirname,'..','output');
 fs.mkdirSync(dir,{recursive:true});
 fs.writeFileSync(path.join(dir,'resumen-semanal.json'),JSON.stringify(report,null,2));
 fs.writeFileSync(path.join(dir,'resumen-semanal.html'),html);
 console.log('Resumen '+from+' a '+to+' | Operaciones: '+report.operaciones+' | Total ARS '+report.total);
 console.log('Transferencias: ARS '+report.medios.transferencia+' | Comprobantes emitidos (ficticios): '+report.comprobantes.emitidas);
 console.log('Ver output/resumen-semanal.html y output/resumen-semanal.json');
 await deliver({subject:'NetGestión DEMO | Resumen semanal '+from+' a '+to,html,text:JSON.stringify(report,null,2)},{send:process.argv.includes('--send')});
 }catch(e){console.error('Error:',e.message);process.exitCode=1;}
})();
