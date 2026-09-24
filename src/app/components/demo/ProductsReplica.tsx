import { useEffect, useMemo, useRef, useState } from "react";
import { AppstoreOutlined, CheckOutlined, DeleteOutlined, DollarCircleOutlined, DownOutlined, EditOutlined, InboxOutlined, MoreOutlined, PictureOutlined, PlusOutlined, ReloadOutlined, SyncOutlined, TagOutlined, ToolOutlined } from "@ant-design/icons";
import { DemoModal, DemoToast } from "./ReplicaCommon";
import "./products-replica.css";

type Status="销售中"|"准备出售"|"错误"|"已下架"|"已归档";
type Product={id:number;name:string;offer:string;sku:string;commission:number;shop:string;status:Status;price:number;old:number;stock:number;weight:string;updated:string;icon:string};
const SEED_PRODUCTS:Product[]=[
{id:1,name:"Органайзер для кухни многоярусный",offer:"DEMO-HOME-001",sku:"7714205101",commission:14,shop:"星桥家居",status:"销售中",price:899,old:1199,stock:42,weight:"620g",updated:"2026-09-24 10:42:18",icon:"🧺"},
{id:2,name:"Набор вакуумных пакетов для хранения, 12 шт.",offer:"DEMO-HOME-002",sku:"7714205102",commission:14,shop:"星桥家居",status:"销售中",price:549,old:749,stock:76,weight:"380g",updated:"2026-09-24 10:35:06",icon:"📦"},
{id:3,name:"Светодиодная настольная лампа с регулировкой",offer:"DEMO-DIGI-001",sku:"7714205201",commission:12,shop:"北辰数码",status:"销售中",price:1299,old:1599,stock:33,weight:"890g",updated:"2026-09-24 09:58:41",icon:"💡"},
{id:4,name:"Автомобильный держатель телефона 360°",offer:"DEMO-DIGI-002",sku:"7714205202",commission:13,shop:"北辰数码",status:"准备出售",price:459,old:599,stock:58,weight:"210g",updated:"2026-09-24 09:46:20",icon:"🚗"},
{id:5,name:"Набор цветных маркеров для творчества, 24 цвета",offer:"DEMO-STORE-001",sku:"7714205301",commission:14,shop:"远航百货",status:"准备出售",price:679,old:899,stock:91,weight:"460g",updated:"2026-09-24 09:21:54",icon:"🖍️"},
{id:6,name:"Корзина для белья складная с ручками",offer:"DEMO-HOME-003",sku:"7714205103",commission:14,shop:"星桥家居",status:"错误",price:1099,old:1399,stock:12,weight:"740g",updated:"2026-09-23 18:17:33",icon:"🧺"},
{id:7,name:"Электрический вспениватель молока USB",offer:"DEMO-STORE-002",sku:"7714205302",commission:12,shop:"远航百货",status:"已归档",price:389,old:499,stock:0,weight:"180g",updated:"2026-09-23 16:08:11",icon:"🥛"},
{id:8,name:"Портативный увлажнитель воздуха USB",offer:"DEMO-STORE-003",sku:"7714205303",commission:13,shop:"远航百货",status:"已下架",price:599,old:799,stock:0,weight:"260g",updated:"2026-09-23 14:42:36",icon:"💧"}
];

const PRODUCT_TARGETS:Record<Status,number>={"销售中":186,"准备出售":144,"错误":27,"已下架":31,"已归档":40};
const PRODUCT_TEMPLATES=[
  ["Настенная полка для ванной без сверления","🧴",14,799,999,46,"480g"],
  ["Складной органайзер для одежды","📦",14,629,829,73,"520g"],
  ["Ночник с датчиком движения USB","💡",12,429,569,55,"190g"],
  ["Набор кухонных контейнеров, 6 шт.","🥡",14,949,1199,61,"760g"],
  ["Автомобильный органайзер на сиденье","🚘",13,719,899,38,"430g"],
  ["Набор кистей для рисования, 12 шт.","🖌️",14,359,459,84,"160g"],
  ["Подставка для ноутбука складная","💻",12,1099,1399,27,"690g"],
  ["Многоразовый ролик для удаления шерсти","🐾",14,329,449,96,"220g"],
  ["Комплект дорожных косметичек","🧳",14,589,759,64,"310g"],
  ["Настольный увлажнитель воздуха","💧",13,649,849,44,"280g"],
  ["Набор силиконовых кухонных принадлежностей","🍳",14,879,1099,52,"830g"],
  ["Органайзер для кабелей и зарядок","🔌",12,399,529,88,"170g"],
] as const;
const DEMO_SHOPS=["星桥家居","远航百货","北辰数码"] as const;

function buildDemoProducts():Product[]{
  const result=[...SEED_PRODUCTS];
  let serial=1;
  (Object.keys(PRODUCT_TARGETS) as Status[]).forEach(status=>{
    const existing=result.filter(r=>r.status===status).length;
    for(let i=existing;i<PRODUCT_TARGETS[status];i++){
      const tpl=PRODUCT_TEMPLATES[(serial-1)%PRODUCT_TEMPLATES.length];
      const variant=Math.floor((serial-1)/PRODUCT_TEMPLATES.length)+1;
      const shop=DEMO_SHOPS[(serial-1)%DEMO_SHOPS.length];
      const day=24-((serial-1)%20);
      const hour=8+((serial*3)%11);
      const minute=(serial*7)%60;
      const price=tpl[3]+(variant%5)*30;
      result.push({
        id:SEED_PRODUCTS.length+serial,
        name:`${tpl[0]} · вариант ${variant}`,
        offer:`DEMO-GEN-${String(serial).padStart(4,"0")}`,
        sku:String(7714210000+serial),
        commission:tpl[2],
        shop,
        status,
        price,
        old:tpl[4]+(variant%4)*40,
        stock:status==="已下架"||status==="已归档"?0:Math.max(1,tpl[5]-((serial*5)%31)),
        weight:tpl[6],
        updated:`2026-09-${String(day).padStart(2,"0")} ${String(hour).padStart(2,"0")}:${String(minute).padStart(2,"0")}:00`,
        icon:tpl[1],
      });
      serial++;
    }
  });
  return result;
}
const INITIAL:Product[]=buildDemoProducts();

function pageItems(total:number,current:number):(number|"…")[]{
  if(total<=7)return Array.from({length:total},(_,i)=>i+1);
  if(current<=4)return [1,2,3,4,5,"…",total];
  if(current>=total-3)return [1,"…",total-4,total-3,total-2,total-1,total];
  return [1,"…",current-1,current,current+1,"…",total];
}
const PRODUCT_SHOPS=[
  {value:"星桥家居",label:"星桥家居"},
  {value:"远航百货",label:"远航百货"},
  {value:"北辰数码",label:"北辰数码"},
] as const;

function ProductShopSelect({value,onChange}:{value:string;onChange:(value:string)=>void}){
  const [open,setOpen]=useState(false);
  const rootRef=useRef<HTMLDivElement|null>(null);
  useEffect(()=>{
    const close=(event:MouseEvent)=>{
      if(rootRef.current&&!rootRef.current.contains(event.target as Node))setOpen(false);
    };
    document.addEventListener("mousedown",close);
    return ()=>document.removeEventListener("mousedown",close);
  },[]);
  const selected=PRODUCT_SHOPS.find(item=>item.value===value);
  const choose=(next:string)=>{onChange(next);setOpen(false)};
  return <div ref={rootRef} className={"product-shop-select-source "+(open?"open":"")}>
    <button type="button" className="product-shop-select-trigger-source" aria-haspopup="listbox" aria-expanded={open} onClick={()=>setOpen(v=>!v)}>
      <span className={selected?"":"placeholder"}>{selected?.label||"全部店铺"}</span>
      <span className="product-shop-select-actions-source">
        {selected&&<span className="product-shop-select-clear-source" title="清除" onMouseDown={e=>e.preventDefault()} onClick={e=>{e.stopPropagation();choose("all")}}>×</span>}
        <DownOutlined className="product-shop-select-arrow-source"/>
      </span>
    </button>
    {open&&<div className="product-shop-select-dropdown-source" role="listbox">
      {PRODUCT_SHOPS.map(item=><button type="button" role="option" aria-selected={value===item.value} className={value===item.value?"selected":""} key={item.value} onClick={()=>choose(item.value)}>
        <span>{item.label}</span>{value===item.value&&<CheckOutlined/>}
      </button>)}
    </div>}
  </div>;
}

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
 const onShopChange=(next:string)=>{
   setShop(next);
   setApplied({shop:next,search,offer});
   setPage(1);
   setSelected([]);
   setMoreId(null);
 };
 const shopRows=useMemo(()=>rows.filter(r=>applied.shop==="all"||r.shop===applied.shop),[rows,applied.shop]);
 const scoped=useMemo(()=>shopRows.filter(r=>{
   const q=applied.search.trim().toLowerCase();if(q&&!r.name.toLowerCase().includes(q))return false;
   const o=applied.offer.trim().toLowerCase();if(o&&!r.offer.toLowerCase().includes(o)&&!r.sku.toLowerCase().includes(o))return false;
   return true;
 }),[shopRows,applied.search,applied.offer]);
 const counts=useMemo<Record<string,number>>(()=>{
   const out:Record<string,number>={所有:shopRows.length,销售中:0,准备出售:0,错误:0,已下架:0,已归档:0};
   shopRows.forEach(r=>{out[r.status]=(out[r.status]||0)+1});
   return out;
 },[shopRows]);
 const visible=useMemo(()=>status==="所有"?scoped:scoped.filter(r=>r.status===status),[scoped,status]);
 const totalPages=Math.max(1,Math.ceil(visible.length/pageSize));
 const safePage=Math.min(page,totalPages);
 const pagedRows=useMemo(()=>visible.slice((safePage-1)*pageSize,safePage*pageSize),[visible,safePage,pageSize]);
 const pages=pageItems(totalPages,safePage);
 const all=pagedRows.length>0&&pagedRows.every(r=>selected.includes(r.id));
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
    <ProductShopSelect value={shop} onChange={onShopChange}/>
    <input className="product-search-input-source" value={search} onChange={e=>setSearch(e.target.value)} placeholder="搜索商品名称"/>
    <input className="product-offer-input-source" value={offer} onChange={e=>setOffer(e.target.value)} placeholder="输入货号或 SKU"/>
    <span></span>
    <button className="primary" onClick={()=>{setApplied({shop,search,offer});setPage(1)}}>查询</button>
    <button className="create" onClick={()=>flash("已打开新建商品示例")}><PlusOutlined/> 新建商品</button>
    <div className="dropdown-wrap"><button onClick={()=>setSyncMenu(!syncMenu)}><SyncOutlined/> 同步操作 <DownOutlined/></button>{syncMenu&&<div className="dropdown-menu-source"><button onClick={()=>{setSyncMenu(false);setModal("sync")}}>同步所有商品</button><button disabled={!selected.length} onClick={()=>{setSyncMenu(false);flash("已同步所选 "+selected.length+" 个商品")}}>同步所选商品</button></div>}</div>
    <div className="dropdown-wrap"><button disabled={!selected.length} onClick={()=>setBatchMenu(!batchMenu)}><AppstoreOutlined/> 批量操作 {selected.length?"("+selected.length+")":""} <DownOutlined/></button>{batchMenu&&selected.length>0&&<div className="dropdown-menu-source batch"><button onClick={()=>{setBatchMenu(false);setEditTarget(null);setPrice(200);setOldPrice(400);setModal("price")}}><DollarCircleOutlined/>批量改价</button><button onClick={()=>{setBatchMenu(false);setEditTarget(null);setStockValue(100);setModal("stock")}}><InboxOutlined/>批量改库存</button><button onClick={()=>{setBatchMenu(false);setModal("promotion")}}><TagOutlined/>批量促销</button><button onClick={()=>{setBatchMenu(false);setModal("archive")}}><InboxOutlined/>批量归档</button><button onClick={()=>{setBatchMenu(false);setModal("repair")}}><PictureOutlined/>修复图片</button><button onClick={()=>{setBatchMenu(false);setModal("repair")}}><ToolOutlined/>修复禁止复制</button></div>}</div>
    <button className="square" onClick={refresh}><ReloadOutlined/></button>
   </div>
   <div className="product-status-source">{Object.entries(counts).map(([k,v])=><button key={k} className={status===k?"active":""} onClick={()=>{setStatus(k);setSelected([]);setPage(1)}}><span>{k}</span><b>{v}</b></button>)}</div>
   <div className="products-table-scroll-source"><div className="products-table-source">
    <div className="products-row-source head"><span><input type="checkbox" checked={all} onChange={()=>setSelected(all?selected.filter(id=>!pagedRows.some(r=>r.id===id)):[...new Set([...selected,...pagedRows.map(r=>r.id)])])}/></span><span>商品信息</span><span>类目佣金</span><span>店铺</span><span>状态</span><span>价格</span><span>库存</span><span>重量</span><span>更新时间</span><span>操作</span></div>
    {pagedRows.map(r=><div className={"products-row-source "+(selected.includes(r.id)?"selected":"")} key={r.id}>
      <span><input type="checkbox" checked={selected.includes(r.id)} onChange={()=>setSelected(v=>v.includes(r.id)?v.filter(x=>x!==r.id):[...v,r.id])}/></span>
      <span className="pi-source"><i>{r.icon}</i><b>{r.name}</b><small>货号 {r.offer}　·　SKU {r.sku}</small></span>
      <span className="commission-source"><em>佣金率:{r.commission}%</em><em>佣金:{(r.price*r.commission/100).toFixed(2)}元</em><em>收单:{(r.price*.01).toFixed(2)}元</em></span><span>{r.shop}</span>
      <span><i className={"product-status-chip "+(r.status==="销售中"?"green":r.status==="错误"?"red":"gray")}>{r.status}</i></span>
      <span className="price-source"><b>{r.price.toFixed(2)}元 <button onClick={()=>openPrice(r.id)}><EditOutlined/></button></b>{r.old>0&&<s>{r.old.toFixed(2)}元</s>}<em>不利价格指数</em></span>
      <span>{r.stock} <button className="inline" onClick={()=>openStock(r.id)}><EditOutlined/></button></span><span><b>{r.weight}</b></span><span>{r.updated.slice(0,10)}<small>{r.updated.slice(11)}</small></span>
      <span className="row-actions-source"><button className="edit" onClick={()=>openPrice(r.id)}>编辑</button><div className="dropdown-wrap"><button className="more" onClick={()=>setMoreId(moreId===r.id?null:r.id)}><MoreOutlined/></button>{moreId===r.id&&<div className="dropdown-menu-source row-menu">{r.status==="已归档"?<button onClick={()=>restore(r.id)}>恢复商品</button>:<button onClick={()=>{setMoreId(null);setSelected([r.id]);setModal("archive")}}>归档商品</button>}</div>}</div></span>
    </div>)}
   </div></div>
   <footer className="products-pagination-source"><strong>共 {visible.length} 条记录，当前页 {pagedRows.length} 条记录</strong><div><button disabled={safePage<=1} onClick={()=>setPage(Math.max(1,safePage-1))}>‹</button>{pages.map((p,i)=>p==="…"?<span key={"dots-"+i}>…</span>:<button key={p} className={safePage===p?"active":""} onClick={()=>setPage(p)}>{p}</button>)}<button disabled={safePage>=totalPages} onClick={()=>setPage(Math.min(totalPages,safePage+1))}>›</button><select value={pageSize} onChange={e=>{setPageSize(Number(e.target.value));setPage(1)}}><option value={10}>10 条/页</option><option value={20}>20 条/页</option><option value={50}>50 条/页</option></select></div></footer>
  </section>
  <DemoModal open={modal==="sync"} title="选择同步店铺" width={420} onClose={()=>setModal(null)} onOk={()=>{setModal(null);flash("已提交 "+syncStores.length+" 个店铺同步任务")}} okText="确定同步"><div className="sync-store-list-source">{[{id:1,name:"星桥家居"},{id:2,name:"远航百货"},{id:3,name:"北辰数码"}].map(store=><label className={syncStores.includes(store.id)?"active":""} key={store.id}><input type="checkbox" checked={syncStores.includes(store.id)} onChange={()=>setSyncStores(v=>v.includes(store.id)?v.filter(x=>x!==store.id):[...v,store.id])}/><span><b>{store.name}</b><small>ozon</small></span></label>)}</div></DemoModal>
  <DemoModal open={modal==="price"} title="批量改价" width={520} onClose={()=>{setModal(null);setEditTarget(null)}} onOk={applyPrice} okText="确定修改"><div className="edit-grid-source"><label>售价<input type="number" value={price} onChange={e=>setPrice(Number(e.target.value))}/></label><label>划线价<input type="number" value={oldPrice} onChange={e=>setOldPrice(Number(e.target.value))}/></label><label>最低价<input placeholder="未设置"/></label><label>自动应用活动<button className={"mini-toggle "+(autoAction?"on":"")} onClick={()=>setAutoAction(!autoAction)}><i></i></button></label></div></DemoModal>
  <DemoModal open={modal==="stock"} title="批量修改库存" width={650} onClose={()=>{setModal(null);setEditTarget(null)}} onOk={applyStock} okText="确定"><div className="stock-toolbar-source"><select><option>星桥家居默认仓</option><option>远航百货默认仓</option><option>北辰数码默认仓</option></select><input type="number" min="0" value={stockValue} onChange={e=>setStockValue(Number(e.target.value))}/><span>件</span></div></DemoModal>
  <DemoModal open={modal==="promotion"} title="批量促销" width={620} onClose={()=>setModal(null)} onOk={()=>{setModal(null);flash("已进入促销参数设置")}} okText="下一步"><p className="modal-copy-source">已选 {selected.length} 个商品。选择活动后可继续填写活动价与库存。</p><select className="modal-select-source"><option>秋季超级大促</option><option>弹性促销</option></select></DemoModal>
  <DemoModal open={modal==="archive"} title={"确认归档 "+selected.length+" 个商品？"} onClose={()=>setModal(null)} onOk={()=>archive(selected)} okText="确认归档" danger><p className="modal-copy-source">归档后商品将从当前销售列表移出，可在“已归档”状态中恢复。</p></DemoModal>
  <DemoModal open={modal==="repair"} title="批量修复图片" width={700} onClose={()=>setModal(null)} onOk={doRepair} okText="确定修复"><p className="modal-copy-source">将对勾选的 {selected.length} 个商品执行修复任务。示例模式不会调用真实 Ozon API。</p></DemoModal>
 </div>
}
