import { useMemo, useState } from "react";
import { AppstoreOutlined, DeleteOutlined, DollarCircleOutlined, DownOutlined, EditOutlined, InboxOutlined, MoreOutlined, PictureOutlined, PlusOutlined, ReloadOutlined, SyncOutlined, TagOutlined, ToolOutlined } from "@ant-design/icons";
import { DemoModal, DemoToast } from "./ReplicaCommon";
import "./products-replica.css";

type Status="销售中"|"准备出售"|"错误"|"已下架"|"已归档";
type Product={id:number;name:string;offer:string;sku:string;commission:number;shop:string;status:Status;price:number;old:number;stock:number;weight:string;updated:string;icon:string};
const INITIAL:Product[]=[
{id:1,name:"Органайзер для кухни многоярусный",offer:"DEMO-HOME-001",sku:"7714205101",commission:14,shop:"星桥家居",status:"销售中",price:899,old:1199,stock:42,weight:"620g",updated:"2026-09-24 10:42:18",icon:"🧺"},
{id:2,name:"Набор вакуумных пакетов для хранения, 12 шт.",offer:"DEMO-HOME-002",sku:"7714205102",commission:14,shop:"星桥家居",status:"销售中",price:549,old:749,stock:76,weight:"380g",updated:"2026-09-24 10:35:06",icon:"📦"},
{id:3,name:"Светодиодная настольная лампа с регулировкой",offer:"DEMO-DIGI-001",sku:"7714205201",commission:12,shop:"北辰数码",status:"销售中",price:1299,old:1599,stock:33,weight:"890g",updated:"2026-09-24 09:58:41",icon:"💡"},
{id:4,name:"Автомобильный держатель телефона 360°",offer:"DEMO-DIGI-002",sku:"7714205202",commission:13,shop:"北辰数码",status:"准备出售",price:459,old:599,stock:58,weight:"210g",updated:"2026-09-24 09:46:20",icon:"🚗"},
{id:5,name:"Набор цветных маркеров для творчества, 24 цвета",offer:"DEMO-STORE-001",sku:"7714205301",commission:14,shop:"远航百货",status:"准备出售",price:679,old:899,stock:91,weight:"460g",updated:"2026-09-24 09:21:54",icon:"🖍️"},
{id:6,name:"Корзина для белья складная с ручками",offer:"DEMO-HOME-003",sku:"7714205103",commission:14,shop:"星桥家居",status:"错误",price:1099,old:1399,stock:12,weight:"740g",updated:"2026-09-23 18:17:33",icon:"🧺"},
{id:7,name:"Электрический вспениватель молока USB",offer:"DEMO-STORE-002",sku:"7714205302",commission:12,shop:"远航百货",status:"已归档",price:389,old:499,stock:0,weight:"180g",updated:"2026-09-23 16:08:11",icon:"🥛"}
];
type ModalKind="sync"|"price"|"stock"|"promotion"|"repair"|"archive"|null;

export function ProductsReplica(){
 const [rows,setRows]=useState(INITIAL);
 const [status,setStatus]=useState("所有");
 const [shop,setShop]=useState("all");
 const [search,setSearch]=useState("");
 const [offer,setOffer]=useState("");
 const [applied,setApplied]=useState({shop:"all",search:"",offer:""});
 const [selected,setSelected]=useState<number[]>([]);
 const [syncMenu,setSyncMenu]=useState(false);
 const [batchMenu,setBatchMenu]=useState(false);
 const [moreId,setMoreId]=useState<number|null>(null);
 const [modal,setModal]=useState<ModalKind>(null);
 const [editTarget,setEditTarget]=useState<number|null>(null);
 const [price,setPrice]=useState(0);
 const [oldPrice,setOldPrice]=useState(0);
 const [stockValue,setStockValue]=useState(100);
 const [syncStores,setSyncStores]=useState<number[]>([]);
 const [toast,setToast]=useState("");
 const [page,setPage]=useState(1);
 const [pageSize,setPageSize]=useState(10);
 const [autoAction,setAutoAction]=useState(true);
 const flash=(t:string)=>{setToast(t);setTimeout(()=>setToast(""),1500)};
 const counts:Record<string,number>={所有:428,销售中:186,准备出售:144,错误:27,已下架:31,已归档:40};
 const visible=useMemo(()=>rows.filter(r=>{
   if(status!=="所有"&&r.status!==status)return false;
   if(applied.shop!=="all"&&r.shop!==applied.shop)return false;
   const q=applied.search.trim().toLowerCase();if(q&&!r.name.toLowerCase().includes(q))return false;
   const o=applied.offer.trim().toLowerCase();if(o&&!r.offer.toLowerCase().includes(o)&&!r.sku.toLowerCase().includes(o))return false;
   return true;
 }),[rows,status,applied]);
 const all=visible.length>0&&visible.every(r=>selected.includes(r.id));
 const openPrice=(id:number)=>{const r=rows.find(x=>x.id===id)!;setEditTarget(id);setPrice(r.price);setOldPrice(r.old);setModal("price")};
 const openStock=(id:number)=>{const r=rows.find(x=>x.id===id)!;setEditTarget(id);setStockValue(r.stock);setModal("stock")};
 const applyPrice=()=>{setRows(v=>v.map(r=>(editTarget?r.id===editTarget:selected.includes(r.id))?{...r,price,old:oldPrice}:r));setModal(null);setEditTarget(null);flash("价格修改已应用")};
 const applyStock=()=>{setRows(v=>v.map(r=>(editTarget?r.id===editTarget:selected.includes(r.id))?{...r,stock:stockValue}:r));setModal(null);setEditTarget(null);flash("库存修改已应用")};
 const archive=(ids:number[])=>{setRows(v=>v.map(r=>ids.includes(r.id)?{...r,status:"已归档"}:r));setSelected([]);setModal(null);flash("商品已归档")};
 const restore=(id:number)=>{setRows(v=>v.map(r=>r.id===id?{...r,status:"准备出售"}:r));setMoreId(null);flash("商品已恢复")};
 const doRepair=()=>{setModal(null);flash("已创建商品修复任务")};
 const refresh=()=>{setRows(INITIAL);setSelected([]);flash("在线商品已刷新")};
 return <div className="products-page-source"><DemoToast text={toast}/>
  <section className="products-shell-source">
   <div className="product-filter-source">
    <select value={shop} onChange={e=>setShop(e.target.value)}><option value="all">全部店铺</option><option value="星桥家居">星桥家居</option><option value="远航百货">远航百货</option><option value="北辰数码">北辰数码</option></select>
    <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="搜索商品名称"/>
    <input value={offer} onChange={e=>setOffer(e.target.value)} placeholder="输入货号或 SKU"/>
    <span></span>
    <button className="primary" onClick={()=>{setApplied({shop,search,offer});setPage(1)}}>查询</button>
    <button className="create" onClick={()=>flash("已打开新建商品示例")}><PlusOutlined/> 新建商品</button>
    <div className="dropdown-wrap"><button onClick={()=>setSyncMenu(!syncMenu)}><SyncOutlined/> 同步操作 <DownOutlined/></button>{syncMenu&&<div className="dropdown-menu-source"><button onClick={()=>{setSyncMenu(false);setModal("sync")}}>同步所有商品</button><button disabled={!selected.length} onClick={()=>{setSyncMenu(false);flash("已同步所选 "+selected.length+" 个商品")}}>同步所选商品</button></div>}</div>
    <div className="dropdown-wrap"><button disabled={!selected.length} onClick={()=>setBatchMenu(!batchMenu)}><AppstoreOutlined/> 批量操作 {selected.length?"("+selected.length+")":""} <DownOutlined/></button>{batchMenu&&selected.length>0&&<div className="dropdown-menu-source batch"><button onClick={()=>{setBatchMenu(false);setEditTarget(null);setPrice(200);setOldPrice(400);setModal("price")}}><DollarCircleOutlined/>批量改价</button><button onClick={()=>{setBatchMenu(false);setEditTarget(null);setStockValue(100);setModal("stock")}}><InboxOutlined/>批量改库存</button><button onClick={()=>{setBatchMenu(false);setModal("promotion")}}><TagOutlined/>批量促销</button><button onClick={()=>{setBatchMenu(false);setModal("archive")}}><InboxOutlined/>批量归档</button><button onClick={()=>{setBatchMenu(false);setModal("repair")}}><PictureOutlined/>修复图片</button><button onClick={()=>{setBatchMenu(false);setModal("repair")}}><ToolOutlined/>修复禁止复制</button></div>}</div>
    <button className="square" onClick={refresh}><ReloadOutlined/></button>
   </div>
   <div className="product-status-source">{Object.entries(counts).map(([k,v])=><button key={k} className={status===k?"active":""} onClick={()=>{setStatus(k);setSelected([]);setPage(1)}}><span>{k}</span><b>{v}</b></button>)}</div>
   <div className="products-table-scroll-source"><div className="products-table-source">
    <div className="products-row-source head"><span><input type="checkbox" checked={all} onChange={()=>setSelected(all?[]:visible.map(r=>r.id))}/></span><span>商品信息</span><span>类目佣金</span><span>店铺</span><span>状态</span><span>价格</span><span>库存</span><span>重量</span><span>更新时间</span><span>操作</span></div>
    {visible.map(r=><div className={"products-row-source "+(selected.includes(r.id)?"selected":"")} key={r.id}>
      <span><input type="checkbox" checked={selected.includes(r.id)} onChange={()=>setSelected(v=>v.includes(r.id)?v.filter(x=>x!==r.id):[...v,r.id])}/></span>
      <span className="pi-source"><i>{r.icon}</i><b>{r.name}</b><small>货号 {r.offer}　·　SKU {r.sku}</small></span>
      <span className="commission-source"><em>佣金率:{r.commission}%</em><em>佣金:{(r.price*r.commission/100).toFixed(2)}元</em><em>收单:{(r.price*.01).toFixed(2)}元</em></span><span>{r.shop}</span>
      <span><i className={"product-status-chip "+(r.status==="销售中"?"green":r.status==="错误"?"red":"gray")}>{r.status}</i></span>
      <span className="price-source"><b>{r.price.toFixed(2)}元 <button onClick={()=>openPrice(r.id)}><EditOutlined/></button></b>{r.old>0&&<s>{r.old.toFixed(2)}元</s>}<em>不利价格指数</em></span>
      <span>{r.stock} <button className="inline" onClick={()=>openStock(r.id)}><EditOutlined/></button></span><span><b>{r.weight}</b></span><span>{r.updated.slice(0,10)}<small>{r.updated.slice(11)}</small></span>
      <span className="row-actions-source"><button className="edit" onClick={()=>openPrice(r.id)}>编辑</button><div className="dropdown-wrap"><button className="more" onClick={()=>setMoreId(moreId===r.id?null:r.id)}><MoreOutlined/></button>{moreId===r.id&&<div className="dropdown-menu-source row-menu">{r.status==="已归档"?<button onClick={()=>restore(r.id)}>恢复商品</button>:<button onClick={()=>{setMoreId(null);setSelected([r.id]);setModal("archive")}}>归档商品</button>}</div>}</div></span>
    </div>)}
   </div></div>
   <footer className="products-pagination-source"><strong>共 {counts[status]||0} 条记录，当前页 {visible.length} 条记录</strong><div><button disabled={page<=1} onClick={()=>setPage(Math.max(1,page-1))}>‹</button>{[1,2,3,4,5].map(p=><button key={p} className={page===p?"active":""} onClick={()=>setPage(p)}>{p}</button>)}<span>…</span><button className={page===37?"active":""} onClick={()=>setPage(37)}>37</button><button disabled={page>=37} onClick={()=>setPage(Math.min(37,page+1))}>›</button><select value={pageSize} onChange={e=>{setPageSize(Number(e.target.value));setPage(1)}}><option value={10}>10 条/页</option><option value={20}>20 条/页</option><option value={50}>50 条/页</option></select></div></footer>
  </section>
  <DemoModal open={modal==="sync"} title="选择同步店铺" width={420} onClose={()=>setModal(null)} onOk={()=>{setModal(null);flash("已提交 "+syncStores.length+" 个店铺同步任务")}} okText="确定同步"><div className="sync-store-list-source">{[{id:1,name:"星桥家居"},{id:2,name:"远航百货"},{id:3,name:"北辰数码"}].map(store=><label className={syncStores.includes(store.id)?"active":""} key={store.id}><input type="checkbox" checked={syncStores.includes(store.id)} onChange={()=>setSyncStores(v=>v.includes(store.id)?v.filter(x=>x!==store.id):[...v,store.id])}/><span><b>{store.name}</b><small>ozon</small></span></label>)}</div></DemoModal>
  <DemoModal open={modal==="price"} title="批量改价" width={520} onClose={()=>{setModal(null);setEditTarget(null)}} onOk={applyPrice} okText="确定修改"><div className="edit-grid-source"><label>售价<input type="number" value={price} onChange={e=>setPrice(Number(e.target.value))}/></label><label>划线价<input type="number" value={oldPrice} onChange={e=>setOldPrice(Number(e.target.value))}/></label><label>最低价<input placeholder="未设置"/></label><label>自动应用活动<button className={"mini-toggle "+(autoAction?"on":"")} onClick={()=>setAutoAction(!autoAction)}><i></i></button></label></div></DemoModal>
  <DemoModal open={modal==="stock"} title="批量修改库存" width={650} onClose={()=>{setModal(null);setEditTarget(null)}} onOk={applyStock} okText="确定"><div className="stock-toolbar-source"><select><option>星桥家居默认仓</option><option>远航百货默认仓</option><option>北辰数码默认仓</option></select><input type="number" min="0" value={stockValue} onChange={e=>setStockValue(Number(e.target.value))}/><span>件</span></div></DemoModal>
  <DemoModal open={modal==="promotion"} title="批量促销" width={620} onClose={()=>setModal(null)} onOk={()=>{setModal(null);flash("已进入促销参数设置")}} okText="下一步"><p className="modal-copy-source">已选 {selected.length} 个商品。选择活动后可继续填写活动价与库存。</p><select className="modal-select-source"><option>秋季超级大促</option><option>弹性促销</option></select></DemoModal>
  <DemoModal open={modal==="archive"} title={"确认归档 "+selected.length+" 个商品？"} onClose={()=>setModal(null)} onOk={()=>archive(selected)} okText="确认归档" danger><p className="modal-copy-source">归档后商品将从当前销售列表移出，可在“已归档”状态中恢复。</p></DemoModal>
  <DemoModal open={modal==="repair"} title="批量修复图片" width={700} onClose={()=>setModal(null)} onOk={doRepair} okText="确定修复"><p className="modal-copy-source">将对勾选的 {selected.length} 个商品执行修复任务。示例模式不会调用真实 Ozon API。</p></DemoModal>
 </div>
}
