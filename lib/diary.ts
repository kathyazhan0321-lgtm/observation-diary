export type Metrics={mood?:number;energy?:number;coffee?:number;sleep?:number;focus?:number};
export type Entry={date:string;content:string;metrics:Metrics;revision:number;updatedAt:string};
export const fields=[{key:"mood",label:"心情",unit:"/ 5",max:5},{key:"energy",label:"精力",unit:"/ 5",max:5},{key:"coffee",label:"咖啡",unit:"杯",max:20},{key:"sleep",label:"睡眠",unit:"小时",max:24},{key:"focus",label:"有效专注",unit:"小时",max:24}] as const;
export function dateKey(d:Date){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
export function shift(s:string,n:number){const d=new Date(s+"T12:00:00");d.setDate(d.getDate()+n);return dateKey(d)}
export function monday(s:string){const d=new Date(s+"T12:00:00");return shift(s,-((d.getDay()+6)%7))}
export function validDate(s:unknown):s is string{return typeof s==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&dateKey(new Date(s+"T12:00:00"))===s}
export function summarize(entries:Entry[],start:string){const days=Array.from({length:7},(_,i)=>entries.find(e=>e.date===shift(start,i)));const metrics=Object.fromEntries(fields.map(f=>{const vals=days.flatMap(d=>typeof d?.metrics[f.key]==="number"?[d.metrics[f.key]!]:[]);return [f.key,{count:vals.length,value:vals.length?(f.key==="coffee"||f.key==="focus"?vals.reduce((a,b)=>a+b,0):vals.reduce((a,b)=>a+b,0)/vals.length):null}]}));return {days,metrics,count:days.filter(Boolean).length}}
