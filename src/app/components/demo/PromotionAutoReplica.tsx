import { useState } from "react";
import { DemoToast } from "./ReplicaCommon";
import "./promotion-auto-replica.css";

export function PromotionAutoReplica(){
 const [stores,setStores]=useState([{id:1,name:"测试",enabled:false}]);
 const [pending,setPending]=useState<number|null>(null);
 const [toast,setToast]=useState("");
 const toggle=(id:number)=>{
   const current=stores.find(s=>s.id===id)!;const next=!current.enabled;
   setPending(id);
   setTimeout(()=>{setStores(v=>v.map(s=>s.id===id?{...s,enabled:next}:s));setPending(null);setToast(next?"已开启，首次扫描将在 2 小时后执行":"已关闭自动踢促销");setTimeout(()=>setToast(""),1500)},500);
 };
 return <div className="auto-kick-page-source"><DemoToast text={toast}/><section className="auto-kick-panel-source"><header><h1>自动踢促销</h1><p>开启后首次扫描在 2 小时后执行，之后每 2 小时扫描一次；系统只处理 Ozon 标记为自动加入的商品。</p></header><div className="auto-store-list-source"><div className="auto-store-head-source"><span>店铺名称</span><span>启用状态</span></div>{stores.map(s=><div className="auto-store-row-source" key={s.id}><strong>{s.name}</strong><button className={"auto-switch-source "+(s.enabled?"on":"")} disabled={pending===s.id} onClick={()=>toggle(s.id)}><i></i><span>{pending===s.id?"…":s.enabled?"开启":"关闭"}</span></button></div>)}</div></section></div>
}
