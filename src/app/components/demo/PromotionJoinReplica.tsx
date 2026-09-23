import { useMemo, useState } from "react";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { DemoModal, DemoToast } from "./ReplicaCommon";
import "./promotion-replica.css";

type P={id:number;name:string;offer:string;sku:string;price:number;actionPrice:number;stock:number;icon:string;mode?:"AUTO"|"MANUAL"};
const CANDIDATES:P[]=[
{id:1,name:"Складная детская ванночка и подстав...",offer:"C-133-284.2",sku:"3617646423",price:399.8,actionPrice:324,stock:0,icon:"🛁"},
{id:2,name:"Селфи-монитор мобильного телефон...",offer:"C-89-114.34",sku:"3621328314",price:125,actionPrice:94,stock:0,icon:"📱"},
{id:3,name:"Селфи-монитор мобильного телефон...",offer:"C-89-114.34A",sku:"3621335285",price:122,actionPrice:92,stock:0,icon:"📱"},
{id:4,name:"ДЖИП на радиоуправлении LC 80",offer:"C-287-456.52",sku:"3630010217",price:507.77,actionPrice:399,stock:0,icon:"🚙"},
{id:5,name:"Набор шариковых ручек",offer:"Q-12-38.46",sku:"4486313693",price:189,actionPrice:149,stock:30,icon:"🖊️"},
];
const PARTICIPATING:P[]=[
{id:11,name:"Органайзер для кухни",offer:"OZG-2609-01",sku:"5743990011",price:699,actionPrice:549,stock:42,icon:"🧺",mode:"MANUAL"},
{id:12,name:"Автомобильный держатель",offer:"OZG-2609-02",sku:"5743990012",price:399,actionPrice:319,stock:68,icon:"🚗",mode:"AUTO"},
];

export function PromotionJoinReplica(){
 const [tab,setTab]=useState<"candidates"|"participating">("candidates");
 const [keyword,setKeyword]=useState("");
 const [applied,setApplied]=useState("");
 const [selected,setSelected]=useState<number[]>([]);
 const [candidates,setCandidates]=useState(CANDIDATES);
 const [participating,setParticipating]=useState(PARTICIPATING);
 const [joinOpen,setJoinOpen]=useState(false);
 const [edit,setEdit]=useState<P|null>(null);
 const [jobOpen,setJobOpen]=useState(false);
 const [jobPercent,setJobPercent]=useState(0);
 const [toast,setToast]=useState("");
 const [syncing,setSyncing]=useState(false);
 const flash=(t:string)=>{setToast(t);setTimeout(()=>setToast(""),1500)};
 const rows=tab==="candidates"?candidates:participating;
 const visible=useMemo(()=>{const q=applied.toLowerCase();return !q?rows:rows.filter(r=>[r.name,r.offer,r.sku].some(x=>x.toLowerCase().includes(q)))},[rows,applied]);
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
    <div className="promo-filter-source"><select><option>测试</option></select><select className="action"><option>Эластичный бустинг. Без ограничения срока действия</option><option>秋季超级大促</option></select><input value={keyword} onChange={e=>setKeyword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&setApplied(keyword)} placeholder="商品名称 / 货号 / SKU"/><button className="primary" onClick={()=>setApplied(keyword)}><SearchOutlined/> 查询</button><button disabled={syncing} onClick={()=>{setSyncing(true);setTimeout(()=>{setSyncing(false);flash("促销活动已同步")},700)}}><ReloadOutlined/> {syncing?"同步中…":"同步活动"}</button></div>
    <div className="promo-tabs-source"><button className={tab==="candidates"?"active":""} onClick={()=>{setTab("candidates");setSelected([])}}>可参加商品</button><button className={tab==="participating"?"active":""} onClick={()=>{setTab("participating");setSelected([])}}>已参加商品</button></div>
    <div className="promo-actions-source"><span>已选 {selected.length} 项</span>{tab==="candidates"&&<button className="primary" disabled={!selected.length} onClick={()=>setJoinOpen(true)}>批量参加</button>}</div>
    <div className="promo-table-source"><div className={"promo-row-source head "+(tab==="participating"?"participating":"")}><span>{tab==="candidates"?<input type="checkbox" checked={all} onChange={()=>setSelected(all?[]:visible.map(r=>r.id))}/>:null}</span><span>商品</span><span>原价</span><span>{tab==="candidates"?"建议活动价":"活动价"}</span><span>库存</span>{tab==="participating"&&<span>加入方式</span>}<span>操作</span></div>
      {visible.map(r=><div className={"promo-row-source "+(tab==="participating"?"participating":"")} key={r.id}><span>{tab==="candidates"?<input type="checkbox" checked={selected.includes(r.id)} onChange={()=>setSelected(v=>v.includes(r.id)?v.filter(x=>x!==r.id):[...v,r.id])}/>:null}</span><span className="promo-product-source"><i>{r.icon}</i><b>{r.name}</b><small>货号 {r.offer} · SKU {r.sku}</small></span><span>₽ {r.price.toFixed(2)}</span><span>₽ {r.actionPrice.toFixed(2)}</span><span>{r.stock}</span>{tab==="participating"&&<span><i className={"add-mode "+(r.mode==="AUTO"?"auto":"manual")}>{r.mode==="AUTO"?"自动加入":"手工加入"}</i></span>}<span>{tab==="participating"&&<><button className="link" onClick={()=>setEdit({...r})}>修改</button><button className="link danger" onClick={()=>submitJob("exit",r)}>退出</button></>}</span></div>)}
    </div>
    <div className="promo-load-more-source"><button onClick={()=>flash("已加载更多促销商品示例")}>加载更多</button></div>
  </section>
  <DemoModal open={joinOpen} title="批量参加促销" width={760} onClose={()=>setJoinOpen(false)} onOk={()=>submitJob("join")} okText="提交任务"><div className="promo-info-source">ⓘ 活动价与库存按商品填写，任务提交后可查看逐项结果。</div><div className="promo-edit-list-source">{selectedRows.map(r=><div key={r.id}><span><b>{r.name}</b><small>SKU {r.sku}</small></span><label>活动价<input type="number" defaultValue={r.actionPrice}/></label><label>库存<input type="number" defaultValue={r.stock}/></label></div>)}</div></DemoModal>
  <DemoModal open={!!edit} title="修改促销参数" onClose={()=>setEdit(null)} onOk={()=>edit&&submitJob("update",edit)} okText="确认退出并重加">{edit&&<div className="promo-edit-form-source"><div className="promo-warning-source">⚠ 系统将先退出原活动，再用新参数重新加入；失败时会尝试恢复原参数。</div><label>活动价<input type="number" value={edit.actionPrice} onChange={e=>setEdit({...edit,actionPrice:Number(e.target.value)})}/></label><label>活动库存<input type="number" value={edit.stock} onChange={e=>setEdit({...edit,stock:Number(e.target.value)})}/></label></div>}</DemoModal>
  <DemoModal open={jobOpen} title="促销任务进度" width={760} onClose={()=>jobPercent>=100&&setJobOpen(false)}><div className="job-progress-source"><div><i style={{width:jobPercent+"%"}}></i></div><b>{jobPercent}%</b><p>成功 {jobPercent>=100?Math.max(1,selectedRows.length):0} · 失败 0 · 跳过 0 · 共 {Math.max(1,selectedRows.length||1)}</p><div className="job-row-source"><span>任务状态</span><i className={jobPercent>=100?"success":"running"}>{jobPercent>=100?"成功":"执行中"}</i></div>{jobPercent>=100&&<button onClick={()=>setJobOpen(false)}>完成</button>}</div></DemoModal>
 </div>
}
