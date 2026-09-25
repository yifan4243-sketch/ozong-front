import { useState } from "react";
import { DeleteOutlined, LinkOutlined, ReloadOutlined, UploadOutlined } from "@ant-design/icons";
import { DemoModal, DemoToast } from "./ReplicaCommon";
import { QuickListingReplica } from "./QuickListingReplica";
import "./collection-replica.css";

export type CollectionItem={id:number;market:"ru"|"kz";sku:string;title:string;price:string;time:string;icon:string};
const COLLECTION_SEEDS:CollectionItem[]=[
{id:1,market:"ru",sku:"7815306101",title:"Органайзер для ванной настенный без сверления",price:"112,40 ¥",time:"2026-09-24 11:18:42",icon:"🧴"},
{id:2,market:"ru",sku:"7815306102",title:"Ночник светодиодный с датчиком движения",price:"68,90 ¥",time:"2026-09-24 10:56:13",icon:"💡"},
{id:3,market:"ru",sku:"7815306103",title:"Набор контейнеров для хранения продуктов, 6 шт.",price:"95,60 ¥",time:"2026-09-24 09:43:26",icon:"🥡"},
{id:4,market:"ru",sku:"7815306104",title:"Автомобильный органайзер на спинку сиденья",price:"79,30 ¥",time:"2026-09-23 21:15:08",icon:"🚘"},
{id:5,market:"ru",sku:"7815306105",title:"Набор кистей для рисования, 12 размеров",price:"46,80 ¥",time:"2026-09-23 18:37:55",icon:"🖌️"},
{id:6,market:"kz",sku:"7815306106",title:"Портативный увлажнитель воздуха USB",price:"88,20 ¥",time:"2026-09-23 16:22:40",icon:"💧"},
];
const COLLECTION_TITLES=[
"Складной органайзер для одежды и белья",
"Подставка для ноутбука алюминиевая складная",
"Многоразовый ролик для удаления шерсти",
"Комплект дорожных косметичек, 3 шт.",
"Набор силиконовых кухонных принадлежностей",
"Органайзер для кабелей и зарядных устройств",
] as const;
function buildCollectionItems():CollectionItem[]{
  const result=[...COLLECTION_SEEDS];
  for(let i=7;i<=24;i++){
    const idx=i-7;
    const title=COLLECTION_TITLES[idx%COLLECTION_TITLES.length];
    const day=23-Math.floor(idx/6);
    result.push({
      id:i,
      market:i%5===0?"kz":"ru",
      sku:String(7815306100+i),
      title:`${title} · ${Math.floor(idx/COLLECTION_TITLES.length)+1}`,
      price:`${(52.4+(i*7.35)%94).toFixed(2).replace(".",",")} ¥`,
      time:`2026-09-${String(day).padStart(2,"0")} ${String(8+(i%11)).padStart(2,"0")}:${String((i*9)%60).padStart(2,"0")}:00`,
      icon:["📦","💻","🐾","🧳","🍳","🔌"][idx%6],
    });
  }
  return result;
}
const INITIAL:CollectionItem[]=buildCollectionItems();

export function CollectionReplica({onEditListing}:{onEditListing?:(item:CollectionItem)=>void}={}){
 const [items,setItems]=useState(INITIAL);
 const [selected,setSelected]=useState<number[]>([]);
 const [deleteOpen,setDeleteOpen]=useState(false);
 const [opening,setOpening]=useState<number|null>(null);
 const [listingItem,setListingItem]=useState<CollectionItem|null>(null);
 const [toast,setToast]=useState("");
 const all=items.length>0&&items.every(x=>selected.includes(x.id));
 const total=items.length;
 const flash=(t:string)=>{setToast(t);window.setTimeout(()=>setToast(""),1400)};
 const toggle=(id:number)=>setSelected(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id]);
 const remove=()=>{setItems(v=>v.filter(x=>!selected.includes(x.id)));setSelected([]);setDeleteOpen(false);flash("已删除采集箱记录")};
 const refresh=()=>{setItems(INITIAL);setSelected([]);flash("采集箱已刷新")};
 const listing=(item:CollectionItem)=>{
   if(opening!==null)return;
   setOpening(item.id);
   window.setTimeout(()=>{
     setOpening(null);
     setListingItem(item);
   },320);
 };
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
      <span className="ops"><button onClick={()=>window.open(`https://www.ozon.ru/product/${item.sku}/`,"_blank","noopener,noreferrer")}><LinkOutlined/> 原链接</button><button className="primary" disabled={opening===item.id} onClick={()=>listing(item)}><UploadOutlined/> {opening===item.id?"打开中…":"上架"}</button></span>
    </div>)}
   </div>
   
  </section>
  {listingItem&&<QuickListingReplica
    item={listingItem}
    onClose={()=>setListingItem(null)}
    onEdit={(item)=>{setListingItem(null);onEditListing?.(item)}}
    onSubmitted={()=>flash("上架任务已创建")}
  />}
  <DemoModal open={deleteOpen} title={`确认删除已选的 ${selected.length} 个采集商品？`} onClose={()=>setDeleteOpen(false)} onOk={remove} okText="确认删除" danger>
    <p className="collection-confirm-copy">只会删除 ERP 采集箱记录，不会影响 OZON 原商品或在线商品。</p>
  </DemoModal>
 </div>
}
