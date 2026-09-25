import { useMemo, useState } from "react";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { DemoModal, DemoToast } from "./ReplicaCommon";
import type { Product } from "./ProductsReplica";
import "./promotion-replica.css";

type P={id:number;name:string;offer:string;sku:string;price:number;actionPrice:number;stock:number;icon:string;mode?:"AUTO"|"MANUAL"};
const CANDIDATES:P[]=[
{id:1,name:"Органайзер для кухни многоярусный",offer:"DEMO-HOME-001",sku:"7714205101",price:899,actionPrice:719,stock:42,icon:"🧺"},
{id:2,name:"Автомобильный держатель телефона 360°",offer:"DEMO-DIGI-002",sku:"7714205202",price:459,actionPrice:369,stock:58,icon:"🚗"},
{id:3,name:"Набор цветных маркеров для творчества, 24 цвета",offer:"DEMO-STORE-001",sku:"7714205301",price:679,actionPrice:539,stock:91,icon:"🖍️"},
{id:4,name:"Набор вакуумных пакетов для хранения, 12 шт.",offer:"DEMO-HOME-002",sku:"7714205102",price:549,actionPrice:439,stock:76,icon:"📦"},
{id:5,name:"Портативный увлажнитель воздуха USB",offer:"DEMO-STORE-003",sku:"7714205303",price:599,actionPrice:469,stock:37,icon:"💧"},
];
const PARTICIPATING:P[]=[
{id:11,name:"Светодиодная настольная лампа с регулировкой",offer:"DEMO-DIGI-001",sku:"7714205201",price:1299,actionPrice:999,stock:33,icon:"💡",mode:"MANUAL"},
{id:12,name:"Электрический вспениватель молока USB",offer:"DEMO-STORE-002",sku:"7714205302",price:389,actionPrice:299,stock:64,icon:"🥛",mode:"AUTO"},
{id:13,name:"Корзина для белья складная с ручками",offer:"DEMO-HOME-003",sku:"7714205103",price:1099,actionPrice:849,stock:12,icon:"🧺",mode:"AUTO"},
];

export function PromotionJoinReplica({prefillProducts=[]}:{prefillProducts?:Product[]}={}){
 const prefillRows:P[]=prefillProducts.map((item,index)=>({id:10000+item.id,name:item.name,offer:item.offer,sku:item.sku,price:item.price,actionPrice:Math.max(1,Math.round(item.price*.8)),stock:item.stock,icon:item.icon}));
 const prefillIds=prefillRows.map(item=>item.id);
 const initialCandidates=[...prefillRows,...CANDIDATES.filter(row=>!prefillRows.some(prefill=>prefill.offer===row.offer))];
 const [tab,setTab]=useState<"candidates"|"participating">("candidates");
 const [keyword,setKeyword]=useState("");
 const [applied,setApplied]=useState("");
 const [selected,setSelected]=useState<number[]>(prefillIds);
 const [candidates,setCandidates]=useState(initialCandidates);
 const [participating,setParticipating]=useState(PARTICIPATING);
 const [joinOpen,setJoinOpen]=useState(false);
 const [edit,setEdit]=useState<P|null>(null);
 const [jobOpen,setJobOpen]=useState(false);
 const [jobPercent,setJobPercent]=useState(0);
 const [toast,setToast]=useState("");
 const [syncing,setSyncing]=useState(false); const [limit,setLimit]=useState(Math.max(4,prefillIds.length));
 const flash=(t:string)=>{setToast(t);setTimeout(()=>setToast(""),1500)};
 const rows=tab==="candidates"?candidates:participating;
 const filtered=useMemo(()=>{const q=applied.toLowerCase();return !q?rows:rows.filter(r=>[r.name,r.offer,r.sku].some(x=>x.toLowerCase().includes(q)))},[rows,applied]);
 const visible=filtered.slice(0,limit); const hasMore=filtered.length>visible.length;
 const all=visible.length>0&&visible.every(r=>selected.includes(r.id));
 const selectedRows=candidates.filter(r=>selected.includes(r.id));
 const submitJob=(kind:"join"|"update"|"exit",row?:P)=>{
  setJoinOpen(false);setEdit(null);setJobPercent(18);setJobOpen(true);
  const timer=setInterval(()=>setJobPercent(v=>{if(v>=100){clearInterval(timer);return 100}return Math.min(100,v+27)}),350);
  setTimeout(()=>{
    if(kind==="join"){const moving=candidates.filter(r=>selected.includes(r.id)).map(r=>({...r,mode:"MANUAL" as const}));setParticipating(v=>[...moving,...v]);setCandidates(v=>v.filter(r=>!selected.includes(r.id)));setSelected([])}
    if(kind==="update"&&row)setParticipating(v=>v.map(r=>r.id===row.id?row:r));
    if(kind==="exit"&&row){setParticipating(v=>v.filter(r=>r.id!==row.id));setCandidates(v=>[{...row,mode:undefined},...v])}
  },900);
 };
 return <div className="promotion-page-source"><DemoToast text={toast}/>
  <section className="promotion-panel-source">
    <header><h1>参加促销</h1><p>管理商品参加 Ozon 活动的关系；修改会先退出旧关系，再按新参数重新加入。</p></header>
    <div className="promo-filter-source"><select defaultValue={prefillProducts[0]?.shop||"星桥家居"}><option>星桥家居</option><option>远航百货</option><option>北辰数码</option></select><select className="action"><option>Осенний буст продаж · DEMO</option><option>家居焕新周 · 演示活动</option></select><input value={keyword} onChange={e=>setKeyword(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){setApplied(keyword);setLimit(4)}}} placeholder="商品名称 / 货号 / SKU"/><button className="primary" onClick={()=>{setApplied(keyword);setLimit(4)}}><SearchOutlined/> 查询</button><button disabled={syncing} onClick={()=>{setSyncing(true);setTimeout(()=>{setSyncing(false);flash("促销活动已同步")},700)}}><ReloadOutlined/> {syncing?"同步中…":"同步活动"}</button></div>
    <div className="promo-tabs-source"><button className={tab==="candidates"?"active":""} onClick={()=>{setTab("candidates");setSelected([]);setLimit(4)}}>可参加商品</button><button className={tab==="participating"?"active":""} onClick={()=>{setTab("participating");setSelected([]);setLimit(4)}}>已参加商品</button></div>
    <div className="promo-actions-source"><span>已选 {selected.length} 项</span>{tab==="candidates"&&<button className="primary" disabled={!selected.length} onClick={()=>setJoinOpen(true)}>批量参加</button>}</div>
    <div className="promo-table-source"><div className={"promo-row-source head "+(tab==="participating"?"participating":"")}><span>{tab==="candidates"?<input type="checkbox" checked={all} onChange={()=>setSelected(all?[]:visible.map(r=>r.id))}/>:null}</span><span>商品</span><span>原价</span><span>{tab==="candidates"?"建议活动价":"活动价"}</span><span>库存</span>{tab==="participating"&&<span>加入方式</span>}<span>操作</span></div>
      {visible.map(r=><div className={"promo-row-source "+(tab==="participating"?"participating":"")} key={r.id}><span>{tab==="candidates"?<input type="checkbox" checked={selected.includes(r.id)} onChange={()=>setSelected(v=>v.includes(r.id)?v.filter(x=>x!==r.id):[...v,r.id])}/>:null}</span><span className="promo-product-source"><i>{r.icon}</i><b>{r.name}</b><small>货号 {r.offer} · SKU {r.sku}</small></span><span>₽ {r.price.toFixed(2)}</span><span>₽ {r.actionPrice.toFixed(2)}</span><span>{r.stock}</span>{tab==="participating"&&<span><i className={"add-mode "+(r.mode==="AUTO"?"auto":"manual")}>{r.mode==="AUTO"?"自动加入":"手工加入"}</i></span>}<span>{tab==="participating"&&<><button className="link" onClick={()=>setEdit({...r})}>修改</button><button className="link danger" onClick={()=>submitJob("exit",r)}>退出</button></>}</span></div>)}
    </div>
    {hasMore&&<div className="promo-load-more-source"><button onClick={()=>setLimit(v=>Math.min(filtered.length,v+4))}>加载更多</button></div>}
  </section>
  <DemoModal open={joinOpen} title="批量参加促销" width={760} onClose={()=>setJoinOpen(false)} onOk={()=>submitJob("join")} okText="提交任务"><div className="promo-info-source">ⓘ 活动价与库存按商品填写，任务提交后可查看逐项结果。</div><div className="promo-edit-list-source">{selectedRows.map(r=><div key={r.id}><span><b>{r.name}</b><small>SKU {r.sku}</small></span><label>活动价<input type="number" defaultValue={r.actionPrice}/></label><label>库存<input type="number" defaultValue={r.stock}/></label></div>)}</div></DemoModal>
  <DemoModal open={!!edit} title="修改促销参数" onClose={()=>setEdit(null)} onOk={()=>edit&&submitJob("update",edit)} okText="确认退出并重加">{edit&&<div className="promo-edit-form-source"><div className="promo-warning-source">⚠ 系统将先退出原活动，再用新参数重新加入；失败时会尝试恢复原参数。</div><label>活动价<input type="number" value={edit.actionPrice} onChange={e=>setEdit({...edit,actionPrice:Number(e.target.value)})}/></label><label>活动库存<input type="number" value={edit.stock} onChange={e=>setEdit({...edit,stock:Number(e.target.value)})}/></label></div>}</DemoModal>
  <DemoModal open={jobOpen} title="促销任务进度" width={760} onClose={()=>jobPercent>=100&&setJobOpen(false)}><div className="job-progress-source"><div><i style={{width:jobPercent+"%"}}></i></div><b>{jobPercent}%</b><p>成功 {jobPercent>=100?Math.max(1,selectedRows.length):0} · 失败 0 · 跳过 0 · 共 {Math.max(1,selectedRows.length||1)}</p><div className="job-row-source"><span>任务状态</span><i className={jobPercent>=100?"success":"running"}>{jobPercent>=100?"成功":"执行中"}</i></div>{jobPercent>=100&&<button onClick={()=>setJobOpen(false)}>完成</button>}</div></DemoModal>
 </div>
}
