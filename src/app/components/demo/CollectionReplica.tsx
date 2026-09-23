import { useMemo, useState } from "react";
import { DeleteOutlined, LinkOutlined, ReloadOutlined, UploadOutlined } from "@ant-design/icons";
import { DemoModal, DemoToast } from "./ReplicaCommon";
import "./collection-replica.css";

type Item={id:number;market:"ru"|"kz";sku:string;title:string;price:string;time:string;icon:string};
const INITIAL:Item[]=[
{id:1,market:"ru",sku:"5367925035",title:"Фотобумага A6, 36 лист., шт",price:"83,17 ¥",time:"2026-09-23 11:47:13",icon:"📄"},
{id:2,market:"ru",sku:"5416727378",title:"Дождевик Спецодежда / Плащи и дождевики рабочие",price:"103,28 ¥",time:"2026-09-23 11:46:35",icon:"🧥"},
{id:3,market:"ru",sku:"4993872000",title:"Игровые беспроводные контроллеры 2,4G 2 шт.",price:"37,94 ¥",time:"2026-09-22 22:12:06",icon:"🎮"},
{id:4,market:"ru",sku:"5422524861",title:"Дождевик Костюм рабочий, Дождевик-костюм",price:"103,31 ¥",time:"2026-09-22 22:11:47",icon:"🧥"},
{id:5,market:"ru",sku:"5699627526",title:"Кемпинговый фонарь аккумуляторный с зарядкой",price:"86,17 ¥",time:"2026-09-22 22:11:16",icon:"🔦"},
{id:6,market:"ru",sku:"5743999143",title:"Набор шариковых ручек, 4 штуки, синие",price:"42,60 ¥",time:"2026-09-21 19:42:08",icon:"🖊️"},
];

export function CollectionReplica(){
 const [items,setItems]=useState(INITIAL);
 const [selected,setSelected]=useState<number[]>([]);
 const [deleteOpen,setDeleteOpen]=useState(false);
 const [opening,setOpening]=useState<number|null>(null);
 const [toast,setToast]=useState("");
 const all=items.length>0&&items.every(x=>selected.includes(x.id));
 const total=19-(INITIAL.length-items.length);
 const flash=(t:string)=>{setToast(t);window.setTimeout(()=>setToast(""),1400)};
 const toggle=(id:number)=>setSelected(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id]);
 const remove=()=>{setItems(v=>v.filter(x=>!selected.includes(x.id)));setSelected([]);setDeleteOpen(false);flash("已删除采集箱记录")};
 const refresh=()=>{setItems(INITIAL);setSelected([]);flash("采集箱已刷新")};
 const listing=(id:number)=>{if(opening!==null)return;setOpening(id);window.setTimeout(()=>{setOpening(null);flash("已向 OzonG 插件发送上架请求")},900)};
 return <div className="collection-page-source">
  <DemoToast text={toast}/>
  <section className="collection-panel-source">
   <header className="collection-toolbar-source">
    <div className="collection-heading-source"><div><h1>采集箱</h1><span>{total} 件</span></div><p>核对采集的商品信息，选择需要上架的商品，或进行批量删除。</p></div>
    <div className="collection-actions-source">
      <label className="checkbox-label"><input type="checkbox" checked={all} onChange={()=>setSelected(all?[]:items.map(x=>x.id))}/> 全选</label><i></i>
      <span>已选 <strong>{selected.length}</strong> 项</span>
      <button className="delete" disabled={!selected.length} onClick={()=>setDeleteOpen(true)}><DeleteOutlined/> 删除</button>
      <button onClick={refresh}><ReloadOutlined/> 刷新</button>
    </div>
   </header>
   <div className="collection-table-source">
    <div className="collection-grid-source head"><span><input type="checkbox" checked={all} onChange={()=>setSelected(all?[]:items.map(x=>x.id))}/></span><span>商品信息</span><span>SKU</span><span>来源平台</span><span>采集时间 ↓</span><span>价格</span><span>操作</span></div>
    {items.map(item=><div className={`collection-grid-source row ${selected.includes(item.id)?"selected":""}`} key={item.id}>
      <span><input type="checkbox" checked={selected.includes(item.id)} onChange={()=>toggle(item.id)}/></span>
      <span className="product"><i>{item.icon}</i><b title={item.title}>{item.title}</b></span>
      <span>{item.sku}</span><span className="source">OZON <small>{item.market.toUpperCase()}</small></span><span>{item.time}</span><span className="price">{item.price}</span>
      <span className="ops"><button onClick={()=>window.open(`https://www.ozon.ru/product/${item.sku}/`,"_blank","noopener,noreferrer")}><LinkOutlined/> 原链接</button><button className="primary" disabled={opening===item.id} onClick={()=>listing(item.id)}><UploadOutlined/> {opening===item.id?"打开中…":"上架"}</button></span>
    </div>)}
   </div>
   {total>24&&<div className="collection-pagination"><button className="active">1</button><button onClick={()=>flash("已切换到第 2 页示例")}>2</button><button onClick={()=>flash("已切换到第 3 页示例")}>3</button></div>}
  </section>
  <DemoModal open={deleteOpen} title={`确认删除已选的 ${selected.length} 个采集商品？`} onClose={()=>setDeleteOpen(false)} onOk={remove} okText="确认删除" danger>
    <p className="collection-confirm-copy">只会删除 ERP 采集箱记录，不会影响 OZON 原商品或在线商品。</p>
  </DemoModal>
 </div>
}
