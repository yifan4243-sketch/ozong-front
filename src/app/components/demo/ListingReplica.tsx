import { useState } from "react";
import { DemoToast } from "./ReplicaCommon";
import "./listing-replica.css";

type Status="上架中"|"上架成功"|"上架失败";
type Row={id:number;job:string;sku:string;offer:string;name:string;store:string;status:Status;result:string;created:string;icon:string;productId?:string};
const INITIAL:Row[]=[
{id:1,job:"job-001",sku:"1499571731",offer:"ozg-260916-571731-01",name:"Тактический костюм, Мужской рыболовный костюм",store:"测试",status:"上架失败",result:"商品校验失败；商品校验失败；商品校验失败",created:"2026-09-16 22:51:29",icon:"🧥"},
{id:2,job:"job-002",sku:"3846746552",offer:"ozg-260915-746552-01",name:"Сумка школьная",store:"测试",status:"上架失败",result:"商品校验失败；商品校验失败",created:"2026-09-15 23:25:28",icon:"🔎"},
{id:3,job:"job-003",sku:"2503913780",offer:"ozg-260915-913780-01",name:"Сумка школьная",store:"测试",status:"上架失败",result:"商品校验失败；商品校验失败",created:"2026-09-15 23:24:10",icon:"🔎"},
{id:4,job:"job-004",sku:"4242256029",offer:"ozg-260915-256029-01",name:"Сумка школьная",store:"测试",status:"上架成功",result:"Ozon 商品 ID 6340878236",created:"2026-09-15 14:57:22",icon:"🔎",productId:"6340878236"},
{id:5,job:"job-005",sku:"2874504253",offer:"ozg-260915-504253-01",name:"Миска для домашних животных с защитой",store:"测试",status:"上架成功",result:"Ozon 商品 ID 6340389617",created:"2026-09-15 14:31:28",icon:"🔎",productId:"6340389617"},
];
export function ListingReplica(){
 const [rows,setRows]=useState(INITIAL);
 const [loading,setLoading]=useState(false);
 const [more,setMore]=useState(true);
 const [retrying,setRetrying]=useState("");
 const [toast,setToast]=useState("");
 const flash=(t:string)=>{setToast(t);setTimeout(()=>setToast(""),1400)};
 const refresh=()=>{setLoading(true);setTimeout(()=>{setRows(INITIAL);setLoading(false);flash("上架记录已刷新")},650)};
 const retry=(job:string)=>{setRetrying(job);setRows(v=>v.map(r=>r.job===job?{...r,status:"上架中",result:"正在后台处理"}:r));setTimeout(()=>{setRows(v=>v.map(r=>r.job===job?{...r,status:"上架成功",result:"Ozon 商品 ID 6340992026",productId:"6340992026"}:r));setRetrying("");flash("已重新加入上架队列")},1200)};
 const loadMore=()=>{setLoading(true);setTimeout(()=>{setRows(v=>[...v,{id:6,job:"job-006",sku:"3925506108",offer:"ozg-260914-506108-01",name:"Органайзер для кухни",store:"测试",status:"上架成功",result:"Ozon 商品 ID 6339884102",created:"2026-09-14 20:16:04",icon:"📦",productId:"6339884102"}]);setMore(false);setLoading(false)},600)};
 return <div className="listing-page-source"><DemoToast text={toast}/>
  <section className="listing-head-source"><div><h1>上架记录</h1><p>一键上架与编辑上架共用同一任务队列；离开页面不会中断处理。</p></div><button onClick={refresh} disabled={loading}>{loading?"刷新中…":"刷新"}</button></section>
  <section className="listing-card-source">
   <div className="listing-table-source">
    <div className="listing-row-source head"><span>主图</span><span>商品</span><span>店铺</span><span>状态</span><span>结果</span><span>创建时间</span><span>操作</span></div>
    <div className="listing-scroll-source">
     {rows.map((r,i)=><div className={`listing-row-source ${i===1?"highlight":""}`} key={r.id}><span><i className="listing-img">{r.icon}</i></span><span><b>{r.name}</b><small>SKU {r.sku} · 货号 {r.offer}</small></span><span>{r.store}</span><span><em className={`listing-tag ${r.status==="上架成功"?"success":r.status==="上架失败"?"failed":"pending"}`}>{r.status}</em></span><span className={r.status==="上架失败"?"error":r.status==="上架成功"?"success-text":"pending-text"}>{r.result}</span><span>{r.created}</span><span>{r.status==="上架失败"&&<button className="retry" disabled={retrying===r.job} onClick={()=>retry(r.job)}>{retrying===r.job?"重试中…":"重试"}</button>}</span></div>)}
    </div>
   </div>
   {more&&<div className="listing-load-more-source"><button disabled={loading} onClick={loadMore}>{loading?"加载中…":"加载更多"}</button></div>}
  </section>
 </div>
}
