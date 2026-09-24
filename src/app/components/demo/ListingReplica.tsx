import { useState } from "react";
import { DemoToast } from "./ReplicaCommon";
import "./listing-replica.css";

type Status="上架中"|"上架成功"|"上架失败";
type Row={id:number;job:string;sku:string;offer:string;name:string;store:string;status:Status;result:string;created:string;icon:string;productId?:string};
const INITIAL:Row[]=[
{id:1,job:"demo-job-101",sku:"7714205101",offer:"DEMO-HOME-001",name:"Органайзер для кухни многоярусный",store:"星桥家居",status:"上架成功",result:"Ozon 商品 ID 7819004101",created:"2026-09-24 10:52:31",icon:"🧺",productId:"7819004101"},
{id:2,job:"demo-job-102",sku:"7714205202",offer:"DEMO-DIGI-002",name:"Автомобильный держатель телефона 360°",store:"北辰数码",status:"上架失败",result:"商品属性校验失败：缺少材质字段",created:"2026-09-24 10:41:08",icon:"🚗"},
{id:3,job:"demo-job-103",sku:"7714205301",offer:"DEMO-STORE-001",name:"Набор цветных маркеров для творчества, 24 цвета",store:"远航百货",status:"上架中",result:"正在生成并提交商品资料",created:"2026-09-24 10:33:46",icon:"🖍️"},
{id:4,job:"demo-job-104",sku:"7714205102",offer:"DEMO-HOME-002",name:"Набор вакуумных пакетов для хранения, 12 шт.",store:"星桥家居",status:"上架成功",result:"Ozon 商品 ID 7819004102",created:"2026-09-24 09:58:15",icon:"📦",productId:"7819004102"},
{id:5,job:"demo-job-105",sku:"7714205302",offer:"DEMO-STORE-002",name:"Электрический вспениватель молока USB",store:"远航百货",status:"上架失败",result:"主图尺寸不符合当前类目要求",created:"2026-09-23 18:26:54",icon:"🥛"},
];
export function ListingReplica(){
 const [rows,setRows]=useState(INITIAL);
 const [loading,setLoading]=useState(false);
 const [more,setMore]=useState(true);
 const [retrying,setRetrying]=useState("");
 const [toast,setToast]=useState("");
 const flash=(t:string)=>{setToast(t);setTimeout(()=>setToast(""),1400)};
 const refresh=()=>{setLoading(true);setTimeout(()=>{setRows(INITIAL);setLoading(false);flash("上架记录已刷新")},650)};
 const retry=(job:string)=>{setRetrying(job);setRows(v=>v.map(r=>r.job===job?{...r,status:"上架中",result:"正在后台处理"}:r));setTimeout(()=>{setRows(v=>v.map(r=>r.job===job?{...r,status:"上架成功",result:"Ozon 商品 ID 7819004199",productId:"7819004199"}:r));setRetrying("");flash("已重新加入上架队列")},1200)};
 const loadMore=()=>{setLoading(true);setTimeout(()=>{setRows(v=>[...v,{id:6,job:"demo-job-106",sku:"7714205201",offer:"DEMO-DIGI-001",name:"Светодиодная настольная лампа с регулировкой",store:"北辰数码",status:"上架成功",result:"Ozon 商品 ID 7819004201",created:"2026-09-23 17:44:20",icon:"💡",productId:"7819004201"}]);setMore(false);setLoading(false)},600)};
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
