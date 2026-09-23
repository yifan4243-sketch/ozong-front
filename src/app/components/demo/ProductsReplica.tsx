import { useMemo, useState } from "react";
import { AppstoreOutlined, DeleteOutlined, DollarCircleOutlined, DownOutlined, EditOutlined, InboxOutlined, MoreOutlined, PictureOutlined, PlusOutlined, ReloadOutlined, SyncOutlined, TagOutlined, ToolOutlined } from "@ant-design/icons";
import { DemoModal, DemoToast } from "./ReplicaCommon";
import "./products-replica.css";

type Status="销售中"|"准备出售"|"错误"|"已下架"|"已归档";
type Product={id:number;name:string;offer:string;sku:string;commission:number;shop:string;status:Status;price:number;old:number;stock:number;weight:string;updated:string;icon:string};
const INITIAL:Product[]=[
{id:1,name:"Джинсы Для Мальчиков",offer:"ozg-260909-779620-01",sku:"5744100236",commission:14,shop:"测试",status:"销售中",price:300,old:600,stock:100,weight:"515g",updated:"2026-09-10 13:35:41",icon:"👖"},
{id:2,name:"Набор шариковых ручек, 4 штуки, синие, 0.7 мм",offer:"ozg-260909-519098-03",sku:"5743999143",commission:14,shop:"测试",status:"销售中",price:200,old:400,stock:100,weight:"13g",updated:"2026-09-10 13:35:41",icon:"🖊️"},
{id:3,name:"Ручки шариковые синие 10 шт 0.7 мм",offer:"ozg-260909-511678-04",sku:"5743996564",commission:14,shop:"测试",status:"销售中",price:200,old:400,stock:100,weight:"40g",updated:"2026-09-10 13:35:41",icon:"🖊️"},
{id:4,name:"Набор цветных шариковых ручек 10 цветов",offer:"ozg-260909-509462-02",sku:"5743990580",commission:14,shop:"测试",status:"销售中",price:200,old:400,stock:100,weight:"50g",updated:"2026-09-10 13:35:41",icon:"🖊️"},
{id:5,name:"Набор ручек шариковых 4 цвета, стержень 1,0 мм",offer:"ozg-260909-522083-01",sku:"5743258656",commission:12,shop:"测试",status:"准备出售",price:20,old:0,stock:100,weight:"15g",updated:"2026-09-10 13:35:41",icon:"🖊️"},
{id:6,name:"Комплект одежды школьный для детей",offer:"ozg-260908-567901-10",sku:"5736228976",commission:14,shop:"测试",status:"错误",price:300,old:600,stock:100,weight:"645g",updated:"2026-09-10 13:35:41",icon:"👕"},
{id:7,name:"Комплект одежды школьный для мальчиков",offer:"ozg-260908-571731-01",sku:"5736189291",commission:14,shop:"测试",status:"已归档",price:300,old:600,stock:0,weight:"680g",updated:"2026-09-09 18:21:14",icon:"🧥"}
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
 const flash=(t:string)=>{setToast(t);setTimeout(()=>setToast(""),1500)};
 const counts:Record<string,number>={所有:366,销售中:29,准备出售:248,错误:299,已下架:0,已归档:1382};
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
    <select value={shop} onChange={e=>setShop(e.target.value)}><option value="all">全部店铺</option><option value="测试">测试</option></select>
    <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="搜索商品名称"/>
    <input value={offer} onChange={e=>setOffer(e.target.value)} placeholder="输入货号或 SKU"/>
    <span></span>
    <button className="primary" onClick={()=>setApplied({shop,search,offer})}>查询</button>
    <button className="create" onClick={()=>flash("已打开新建商品示例")}><PlusOutlined/> 新建商品</button>
    <div className="dropdown-wrap"><button onClick={()=>setSyncMenu(!syncMenu)}><SyncOutlined/> 同步操作 <DownOutlined/></button>{syncMenu&&<div className="dropdown-menu-source"><button onClick={()=>{setSyncMenu(false);setModal("sync")}}>同步所有商品</button><button disabled={!selected.length} onClick={()=>{setSyncMenu(false);flash("已同步所选 "+selected.length+" 个商品")}}>同步所选商品</button></div>}</div>
    <div className="dropdown-wrap"><button disabled={!selected.length} onClick={()=>setBatchMenu(!batchMenu)}><AppstoreOutlined/> 批量操作 {selected.length?"("+selected.length+")":""} <DownOutlined/></button>{batchMenu&&selected.length>0&&<div className="dropdown-menu-source batch"><button onClick={()=>{setBatchMenu(false);setEditTarget(null);setPrice(200);setOldPrice(400);setModal("price")}}><DollarCircleOutlined/>批量改价</button><button onClick={()=>{setBatchMenu(false);setEditTarget(null);setStockValue(100);setModal("stock")}}><InboxOutlined/>批量改库存</button><button onClick={()=>{setBatchMenu(false);setModal("promotion")}}><TagOutlined/>批量促销</button><button onClick={()=>{setBatchMenu(false);setModal("archive")}}><InboxOutlined/>批量归档</button><button onClick={()=>{setBatchMenu(false);setModal("repair")}}><PictureOutlined/>修复图片</button><button onClick={()=>{setBatchMenu(false);setModal("repair")}}><ToolOutlined/>修复禁止复制</button></div>}</div>
    <button className="square" onClick={refresh}><ReloadOutlined/></button>
   </div>
   <div className="product-status-source">{Object.entries(counts).map(([k,v])=><button key={k} className={status===k?"active":""} onClick={()=>{setStatus(k);setSelected([])}}><span>{k}</span><b>{v}</b></button>)}</div>
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
   <footer className="products-pagination-source"><strong>共 {counts[status]||0} 条记录，当前页 {visible.length} 条记录</strong><div><button disabled>‹</button><button className="active">1</button><button onClick={()=>flash("已切换至第 2 页示例")}>2</button><button onClick={()=>flash("已切换至第 3 页示例")}>3</button><button>4</button><button>5</button><span>…</span><button>37</button><button>›</button><select><option>10 条/页</option><option>20 条/页</option><option>50 条/页</option></select></div></footer>
  </section>
  <DemoModal open={modal==="sync"} title="选择同步店铺" width={420} onClose={()=>setModal(null)} onOk={()=>{setModal(null);flash("已提交 "+syncStores.length+" 个店铺同步任务")}} okText="确定同步"><div className="sync-store-list-source">{[1,2].map(id=><label className={syncStores.includes(id)?"active":""} key={id}><input type="checkbox" checked={syncStores.includes(id)} onChange={()=>setSyncStores(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id])}/><span><b>{id===1?"测试":"UyutHome 家居"}</b><small>ozon</small></span></label>)}</div></DemoModal>
  <DemoModal open={modal==="price"} title="批量改价" width={520} onClose={()=>{setModal(null);setEditTarget(null)}} onOk={applyPrice} okText="确定修改"><div className="edit-grid-source"><label>售价<input type="number" value={price} onChange={e=>setPrice(Number(e.target.value))}/></label><label>划线价<input type="number" value={oldPrice} onChange={e=>setOldPrice(Number(e.target.value))}/></label><label>最低价<input placeholder="未设置"/></label><label>自动应用活动<button className="mini-toggle on"><i></i></button></label></div></DemoModal>
  <DemoModal open={modal==="stock"} title="批量修改库存" width={650} onClose={()=>{setModal(null);setEditTarget(null)}} onOk={applyStock} okText="确定"><div className="stock-toolbar-source"><select><option>测试仓库</option><option>默认仓库</option></select><input type="number" min="0" value={stockValue} onChange={e=>setStockValue(Number(e.target.value))}/><span>件</span></div></DemoModal>
  <DemoModal open={modal==="promotion"} title="批量促销" width={620} onClose={()=>setModal(null)} onOk={()=>{setModal(null);flash("已进入促销参数设置")}} okText="下一步"><p className="modal-copy-source">已选 {selected.length} 个商品。选择活动后可继续填写活动价与库存。</p><select className="modal-select-source"><option>秋季超级大促</option><option>弹性促销</option></select></DemoModal>
  <DemoModal open={modal==="archive"} title={"确认归档 "+selected.length+" 个商品？"} onClose={()=>setModal(null)} onOk={()=>archive(selected)} okText="确认归档" danger><p className="modal-copy-source">归档后商品将从当前销售列表移出，可在“已归档”状态中恢复。</p></DemoModal>
  <DemoModal open={modal==="repair"} title="批量修复图片" width={700} onClose={()=>setModal(null)} onOk={doRepair} okText="确定修复"><p className="modal-copy-source">将对勾选的 {selected.length} 个商品执行修复任务。示例模式不会调用真实 Ozon API。</p></DemoModal>
 </div>
}
