import { useMemo, useState } from "react";
import { AppstoreOutlined, DeleteOutlined, DownOutlined, EditOutlined, InboxOutlined, MoreOutlined, PrinterOutlined, SyncOutlined } from "@ant-design/icons";
import { DemoModal, DemoToast } from "./ReplicaCommon";
import "./orders-replica.css";

type Status="awaiting_packaging"|"awaiting_deliver"|"delivering"|"delivered"|"cancelled";
type Order={id:number;name:string;offer:string;sku:string;orderNo:string;warehouse:string;provider:string;shop:string;total:string;status:Status;date:string;clock:string;icon:string;source?:string};
const SEED_ORDERS:Order[]=[
{id:1,name:"Органайзер для кухни многоярусный",offer:"DEMO-HOME-001",sku:"7714205101",orderNo:"DEMO-240924-1001",warehouse:"CEL 华南仓",provider:"CEL Standard Small",shop:"星桥家居",total:"₽899.00",status:"awaiting_packaging",date:"2026-09-24",clock:"10:18:42",icon:"🧺"},
{id:2,name:"Светодиодная настольная лампа с регулировкой",offer:"DEMO-DIGI-001",sku:"7714205201",orderNo:"DEMO-240924-1002",warehouse:"CEL 华东仓",provider:"CEL Standard Medium",shop:"北辰数码",total:"₽1299.00",status:"awaiting_deliver",date:"2026-09-24",clock:"09:52:10",icon:"💡"},
{id:3,name:"Набор цветных маркеров для творчества, 24 цвета",offer:"DEMO-STORE-001",sku:"7714205301",orderNo:"DEMO-240923-1003",warehouse:"CEL 华南仓",provider:"CEL Standard Extra Small",shop:"远航百货",total:"₽679.00",status:"delivering",date:"2026-09-23",clock:"21:36:05",icon:"🖍️"},
{id:4,name:"Набор вакуумных пакетов для хранения, 12 шт.",offer:"DEMO-HOME-002",sku:"7714205102",orderNo:"DEMO-240923-1004",warehouse:"CEL 华南仓",provider:"CEL Standard Small",shop:"星桥家居",total:"₽549.00",status:"delivered",date:"2026-09-23",clock:"17:20:44",icon:"📦"},
{id:5,name:"Автомобильный держатель телефона 360°",offer:"DEMO-DIGI-002",sku:"7714205202",orderNo:"DEMO-240922-1005",warehouse:"CEL 华东仓",provider:"CEL Standard Small",shop:"北辰数码",total:"₽459.00",status:"cancelled",date:"2026-09-22",clock:"16:08:19",icon:"🚗"},
{id:6,name:"Электрический вспениватель молока USB",offer:"DEMO-STORE-002",sku:"7714205302",orderNo:"DEMO-240922-1006",warehouse:"CEL 华南仓",provider:"CEL Standard Extra Small",shop:"远航百货",total:"₽389.00",status:"delivered",date:"2026-09-22",clock:"11:47:33",icon:"🥛"},
{id:7,name:"Корзина для белья складная с ручками",offer:"DEMO-HOME-003",sku:"7714205103",orderNo:"DEMO-240921-1007",warehouse:"CEL 华南仓",provider:"CEL Standard Medium",shop:"星桥家居",total:"₽1099.00",status:"delivering",date:"2026-09-21",clock:"14:25:17",icon:"🧺"},
{id:8,name:"Портативный увлажнитель воздуха USB",offer:"DEMO-STORE-003",sku:"7714205303",orderNo:"DEMO-240921-1008",warehouse:"CEL 华东仓",provider:"CEL Standard Small",shop:"远航百货",total:"₽599.00",status:"awaiting_packaging",date:"2026-09-21",clock:"09:14:02",icon:"💧"},
];

const ORDER_TARGETS:Record<Status,number>={awaiting_packaging:24,awaiting_deliver:17,delivering:63,delivered:251,cancelled:29};
const ORDER_TEMPLATES=[
 ["Настенная полка для ванной без сверления","DEMO-GEN-0001","7714210001","🧴",799],
 ["Складной органайзер для одежды","DEMO-GEN-0002","7714210002","📦",629],
 ["Ночник с датчиком движения USB","DEMO-GEN-0003","7714210003","💡",429],
 ["Набор кухонных контейнеров, 6 шт.","DEMO-GEN-0004","7714210004","🥡",949],
 ["Автомобильный органайзер на сиденье","DEMO-GEN-0005","7714210005","🚘",719],
 ["Набор кистей для рисования, 12 шт.","DEMO-GEN-0006","7714210006","🖌️",359],
 ["Подставка для ноутбука складная","DEMO-GEN-0007","7714210007","💻",1099],
 ["Многоразовый ролик для удаления шерсти","DEMO-GEN-0008","7714210008","🐾",329],
 ["Комплект дорожных косметичек","DEMO-GEN-0009","7714210009","🧳",589],
 ["Настольный увлажнитель воздуха","DEMO-GEN-0010","7714210010","💧",649],
] as const;
const ORDER_SHOPS=["星桥家居","远航百货","北辰数码"] as const;
const ORDER_WAREHOUSES=["CEL 华南仓","CEL 华东仓","CEL 华北仓"] as const;
const ORDER_PROVIDERS=["CEL Standard Extra Small","CEL Standard Small","CEL Standard Medium"] as const;

function demoOrderDate(offset:number){
  const d=new Date(Date.UTC(2026,8,24));
  d.setUTCDate(d.getUTCDate()-offset);
  return d.toISOString().slice(0,10);
}
function buildDemoOrders():Order[]{
  const result=[...SEED_ORDERS];
  let serial=1;
  (Object.keys(ORDER_TARGETS) as Status[]).forEach(status=>{
    const existing=result.filter(r=>r.status===status).length;
    for(let i=existing;i<ORDER_TARGETS[status];i++){
      const tpl=ORDER_TEMPLATES[(serial-1)%ORDER_TEMPLATES.length];
      const price=tpl[4]+((serial%7)*20);
      const dateOffset=serial<=106?0:1+((serial-107)%71);
      result.push({
        id:SEED_ORDERS.length+serial,
        name:tpl[0],
        offer:`DEMO-ORD-${String(serial).padStart(4,"0")}`,
        sku:String(7714220000+serial),
        orderNo:`DEMO-${demoOrderDate(dateOffset).replaceAll("-","")}-${String(2000+serial)}`,
        warehouse:ORDER_WAREHOUSES[(serial-1)%ORDER_WAREHOUSES.length],
        provider:ORDER_PROVIDERS[(serial-1)%ORDER_PROVIDERS.length],
        shop:ORDER_SHOPS[(serial-1)%ORDER_SHOPS.length],
        total:`₽${price.toFixed(2)}`,
        status,
        date:demoOrderDate(dateOffset),
        clock:`${String(8+(serial*3)%14).padStart(2,"0")}:${String((serial*7)%60).padStart(2,"0")}:${String((serial*11)%60).padStart(2,"0")}`,
        icon:tpl[3],
      });
      serial++;
    }
  });
  return result;
}
const INITIAL:Order[]=buildDemoOrders();

function orderPageItems(total:number,current:number):(number|"…")[]{
  if(total<=7)return Array.from({length:total},(_,i)=>i+1);
  if(current<=4)return [1,2,3,4,5,"…",total];
  if(current>=total-3)return [1,"…",total-4,total-3,total-2,total-1,total];
  return [1,"…",current-1,current,current+1,"…",total];
}
const statusText:Record<Status,string>={awaiting_packaging:"等待备货",awaiting_deliver:"等待发运",delivering:"运输中",delivered:"已签收",cancelled:"已取消"};
export function OrdersReplica(){
 const [orders,setOrders]=useState(INITIAL);
 const [shop,setShop]=useState("all");
 const [statusFilter,setStatusFilter]=useState("");
 const [orderNo,setOrderNo]=useState("");
 const [search,setSearch]=useState("");
 const [applied,setApplied]=useState({shop:"all",status:"",orderNo:"",search:""});
 const [activeStatus,setActiveStatus]=useState("all");
 const [selected,setSelected]=useState<number[]>([]);
 const [dateOpen,setDateOpen]=useState(false);
 const [dateRange,setDateRange]=useState("2026-07-01 → 2026-09-24");
 const [pullOpen,setPullOpen]=useState(false);
 const [syncOpen,setSyncOpen]=useState(false);
 const [selectedStores,setSelectedStores]=useState<number[]>([]);
 const [moreOpen,setMoreOpen]=useState(false);
 const [batchOpen,setBatchOpen]=useState(false);
 const [detail,setDetail]=useState<Order|null>(null);
 const [source,setSource]=useState<Order|null>(null);
 const [cancelOpen,setCancelOpen]=useState(false);
 const [toast,setToast]=useState("");
 const [calendarMonth,setCalendarMonth]=useState(9);
 const [page,setPage]=useState(1);
 const [pageSize,setPageSize]=useState(10);
 const [moreOrderId,setMoreOrderId]=useState<number|null>(null);
 const flash=(t:string)=>{setToast(t);setTimeout(()=>setToast(""),1500)};
 const scoped=useMemo(()=>orders.filter(r=>{
  if(applied.shop!=="all"&&r.shop!==applied.shop)return false;
  if(applied.orderNo&&!r.orderNo.includes(applied.orderNo))return false;
  const q=applied.search.toLowerCase();if(q&&!r.name.toLowerCase().includes(q)&&!r.offer.toLowerCase().includes(q)&&!r.sku.includes(q))return false;
  const parts=dateRange.split(" → ");
  if(parts.length===2&&parts[0]&&parts[1]&&(r.date<parts[0]||r.date>parts[1]))return false;
  return true;
 }),[orders,applied,dateRange]);
 const metricCounts=useMemo(()=>{
   const out:Record<string,number>={all:scoped.length,awaiting_packaging:0,awaiting_deliver:0,delivering:0,delivered:0,cancelled:0};
   scoped.forEach(r=>{out[r.status]=(out[r.status]||0)+1});
   return out;
 },[scoped]);
 const metrics=[["all","所有订单",metricCounts.all],["awaiting_packaging","等待备货",metricCounts.awaiting_packaging],["awaiting_deliver","等待发运",metricCounts.awaiting_deliver],["delivering","运输中",metricCounts.delivering],["delivered","已签收",metricCounts.delivered],["cancelled","已取消",metricCounts.cancelled]] as const;
 const visible=useMemo(()=>activeStatus==="all"?scoped:scoped.filter(r=>r.status===activeStatus),[scoped,activeStatus]);
 const totalPages=Math.max(1,Math.ceil(visible.length/pageSize));
 const safePage=Math.min(page,totalPages);
 const pagedRows=useMemo(()=>visible.slice((safePage-1)*pageSize,safePage*pageSize),[visible,safePage,pageSize]);
 const pages=orderPageItems(totalPages,safePage);
 const all=pagedRows.length>0&&pagedRows.every(r=>selected.includes(r.id));
 const applySearch=()=>{setApplied({shop,status:statusFilter,orderNo,search});setActiveStatus(statusFilter||"all");setSelected([])};
 const setMetric=(key:string)=>{setActiveStatus(key);setStatusFilter(key==="all"?"":key);setSelected([])};
 const batch=(type:string)=>{if(type==="cancel"){setBatchOpen(false);setCancelOpen(true);return}flash(type==="prepare"?"已提交批量备货任务":type==="print"?"已打开批量面单打印预览":"已批量标记发货");setBatchOpen(false)};
 const cancelSelected=()=>{setOrders(v=>v.map(r=>selected.includes(r.id)?{...r,status:"cancelled"}:r));setSelected([]);setCancelOpen(false);flash("已取消所选订单")};
 const exportOrders=()=>flash("已生成订单导出文件（演示）");
 const doStoreAction=(kind:"pull"|"sync")=>{if(!selectedStores.length)return;kind==="pull"?setPullOpen(false):setSyncOpen(false);flash(kind==="pull"?"已提交拉取新订单任务":"已提交订单同步任务");setSelectedStores([])};
 return <div className="orders-page-source"><DemoToast text={toast}/>
  <section className="orders-filter-source">
    <select value={shop} onChange={e=>setShop(e.target.value)}><option value="all">全部店铺</option><option value="星桥家居">星桥家居</option><option value="远航百货">远航百货</option><option value="北辰数码">北辰数码</option></select>
    <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option value="">全部状态</option>{Object.entries(statusText).map(([k,v])=><option value={k} key={k}>{v}</option>)}</select>
    <div className="clear-input"><input value={orderNo} onChange={e=>setOrderNo(e.target.value)} placeholder="请输入订单号"/>{orderNo&&<button onClick={()=>setOrderNo("")}>×</button>}</div>
    <div className="clear-input wide"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="搜索商品、货号、SKU"/>{search&&<button onClick={()=>setSearch("")}>×</button>}</div>
    <div className="date-wrap"><button className="date-trigger" onClick={()=>setDateOpen(!dateOpen)}><span>{dateRange||"选择日期范围"}</span>{dateRange&&<i onClick={e=>{e.stopPropagation();setDateRange("")}}>×</i>}</button>{dateOpen&&<div className="date-pop-source"><header><button onClick={()=>setCalendarMonth(m=>m<=1?12:m-1)}>‹</button><b>2026年{calendarMonth}月</b><button onClick={()=>setCalendarMonth(m=>m>=12?1:m+1)}>›</button></header><div className="week"><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span><span>日</span></div><div className="days">{Array.from({length:30},(_,i)=><button className={i===22?"selected":i>=16&&i<=22?"inrange":""} key={i} onClick={()=>setDateRange("2026-"+String(calendarMonth).padStart(2,"0")+"-"+String(i+1).padStart(2,"0")+" → 2026-"+String(calendarMonth).padStart(2,"0")+"-"+String(i+1).padStart(2,"0"))}>{i+1}</button>)}</div><footer><button onClick={()=>setDateRange("2026-09-01 → 2026-09-23")}>本月</button><button onClick={()=>setDateRange("2026-08-01 → 2026-08-31")}>上月</button><button onClick={()=>setDateRange("2026-01-01 → 2026-09-23")}>今年</button><button className="confirm" onClick={()=>setDateOpen(false)}>确定</button></footer></div>}</div>
    <div className="order-action-group"><button className="primary" onClick={applySearch}>查询</button><button className="green" onClick={()=>setPullOpen(true)}>拉取新订单</button><div className="dropdown-wrap"><button onClick={()=>setMoreOpen(!moreOpen)}>更多操作 <DownOutlined/></button>{moreOpen&&<div className="dropdown-menu-source"><button onClick={()=>{setMoreOpen(false);setSyncOpen(true)}}><SyncOutlined/> 同步订单</button><button onClick={()=>{setMoreOpen(false);exportOrders()}}>导出订单</button></div>}</div><div className="dropdown-wrap"><button disabled={!selected.length} onClick={()=>setBatchOpen(!batchOpen)}>批量操作 {selected.length?"("+selected.length+")":""} <DownOutlined/></button>{batchOpen&&<div className="dropdown-menu-source batch-order-menu"><button onClick={()=>batch("prepare")}><AppstoreOutlined/>批量备货</button><button onClick={()=>batch("print")}><PrinterOutlined/>批量打印面单</button><button onClick={()=>batch("ship")}><InboxOutlined/>批量标记发货</button><button className="danger" onClick={()=>batch("cancel")}><DeleteOutlined/>批量取消</button></div>}</div></div>
  </section>
  <section className="order-metrics-source">{metrics.map(m=><button key={m[0]} className={activeStatus===m[0]?"active":""} onClick={()=>setMetric(m[0])}><span>{m[1]}</span><b>{m[2]}</b></button>)}</section>
  <section className="orders-table-card-source"><div className="orders-scroll-source"><div className="orders-table-source">
   <div className="orders-row-source head"><span><input type="checkbox" checked={all} onChange={()=>setSelected(all?selected.filter(id=>!pagedRows.some(r=>r.id===id)):[...new Set([...selected,...pagedRows.map(r=>r.id)])])}/></span><span>商品信息</span><span>订单信息</span><span>店铺</span><span>订单金额</span><span>履约状态</span><span>下单时间</span><span>操作</span></div>
   {pagedRows.map((r,i)=><div className={"orders-row-source "+(selected.includes(r.id)?"selected":"")} key={r.id}><span><input type="checkbox" checked={selected.includes(r.id)} onChange={()=>setSelected(v=>v.includes(r.id)?v.filter(x=>x!==r.id):[...v,r.id])}/></span>
    <span className="order-product-source"><i>{r.icon}</i><b>{r.name}</b><small>货号：{r.offer}　SKU：{r.sku}　 <strong>数量 1</strong></small><button onClick={()=>setSource(r)}><EditOutlined/> {r.source||"补充货源信息"}</button></span>
    <span className="order-info-source"><b>{r.orderNo}</b><small>仓库：{r.warehouse}</small><small>发运方式：{r.provider}</small></span><span><b>{r.shop}</b></span><span><b>{r.total}</b></span><span><i className={"order-status-source "+(r.status==="delivered"?"teal":r.status==="cancelled"?"gray":"orange")}>{statusText[r.status]}</i>{r.status==="cancelled"&&<small>卖家未按时发货</small>}</span><span>{r.date}<small>{r.clock}</small></span><span className="order-row-actions"><button className="detail-btn" onClick={()=>setDetail(r)}>查看详情</button><div className="dropdown-wrap"><button className="row-more" onClick={()=>setMoreOrderId(moreOrderId===r.id?null:r.id)}><MoreOutlined/></button>{moreOrderId===r.id&&<div className="dropdown-menu-source order-row-menu"><button onClick={()=>{setMoreOrderId(null);setDetail(r)}}>订单详情</button><button onClick={()=>{setMoreOrderId(null);flash("已打开标签打印预览")}}>打印标签</button>{r.status!=="cancelled"&&<button className="danger" onClick={()=>{setSelected([r.id]);setMoreOrderId(null);setCancelOpen(true)}}>取消货件</button>}</div>}</div></span>
   </div>)}
  </div></div><footer className="orders-pagination-source"><span>共 {visible.length} 条记录，当前页 {pagedRows.length} 条记录</span><div><button disabled={safePage<=1} onClick={()=>setPage(Math.max(1,safePage-1))}>‹</button>{pages.map((p,i)=>p==="…"?<span key={"dots-"+i}>…</span>:<button key={p} className={safePage===p?"active":""} onClick={()=>setPage(p)}>{p}</button>)}<button disabled={safePage>=totalPages} onClick={()=>setPage(Math.min(totalPages,safePage+1))}>›</button><select value={pageSize} onChange={e=>{setPageSize(Number(e.target.value));setPage(1)}}><option value={10}>10 条/页</option><option value={20}>20 条/页</option><option value={50}>50 条/页</option></select></div></footer></section>
  <DemoModal open={pullOpen} title="选择拉取店铺" width={420} onClose={()=>setPullOpen(false)} onOk={()=>doStoreAction("pull")} okText="开始拉取"><StorePicker selected={selectedStores} setSelected={setSelectedStores} pull/></DemoModal>
  <DemoModal open={syncOpen} title="选择同步店铺" width={420} onClose={()=>setSyncOpen(false)} onOk={()=>doStoreAction("sync")} okText="确定同步"><StorePicker selected={selectedStores} setSelected={setSelectedStores}/></DemoModal>
  <DemoModal open={!!source} title="货源采购档案" width={760} onClose={()=>setSource(null)} onOk={()=>{setSource(null);flash("货源采购档案已保存")}} okText="保存档案">{source&&<div className="source-order-modal"><aside><i>{source.icon}</i><b>{source.name}</b><span>货号 {source.offer}</span><span>SKU {source.sku}</span></aside><section><h3>采购来源</h3><label>货源地址<input defaultValue="https://detail.1688.com/offer/..." /></label><div><label>货源价格<input defaultValue="28.80"/></label><label>采购单号<input placeholder="采购订单编号"/></label></div><h3>履约备注</h3><div><label>采购快递<input placeholder="采购快递单号"/></label><label>货源备注<textarea placeholder="货源备注信息"/></label></div></section></div>}</DemoModal>
  <DemoModal open={!!detail} title="订单详情" width={920} onClose={()=>setDetail(null)}>{detail&&<div className="order-detail-source"><section><header><b>订单概况</b><i className="order-status-source teal">{statusText[detail.status]}</i></header><div><span>Ozon 订单号<b>{detail.orderNo}</b></span><span>平台订单号<b>{detail.orderNo}</b></span><span>店铺<b>{detail.shop}</b></span><span>配送方式<b>{detail.provider}</b></span></div></section><section><header><b>物流与时间</b></header><div><span>仓库<b>{detail.warehouse}</b></span><span>物流商<b>{detail.provider}</b></span><span>跟踪号<b>DEMO-CEL-240924-01</b></span><span>下单时间<b>{detail.date} {detail.clock}</b></span></div></section><section><header><b>全部商品</b><em>1 件商品</em></header><div className="detail-product"><b>{detail.name}</b><span>SKU：{detail.sku} · 货号：{detail.offer}</span><strong>×1　{detail.total}</strong></div></section></div>}</DemoModal>
  <DemoModal open={cancelOpen} title="取消货件" onClose={()=>setCancelOpen(false)} onOk={cancelSelected} okText="确认取消" danger><label className="replica-field"><span>* 取消原因</span><select><option>无法按时发货</option><option>商品缺货</option><option>其他</option></select></label><label className="replica-field"><span>取消原因说明</span><textarea placeholder="请输入说明（可选）"/></label></DemoModal>
 </div>
}
function StorePicker({selected,setSelected,pull=false}:{selected:number[];setSelected:(v:number[])=>void;pull?:boolean}){
 const stores=[{id:1,name:"星桥家居"},{id:2,name:"远航百货"},{id:3,name:"北辰数码"}];const all=stores.every(s=>selected.includes(s.id));
 return <div className="order-store-picker-source"><header><label><input type="checkbox" checked={all} onChange={()=>setSelected(all?[]:stores.map(s=>s.id))}/> 全选</label><span>已选择 {selected.length} 个店铺</span></header><div>{stores.map(s=><button className={selected.includes(s.id)?"active":""} key={s.id} onClick={()=>setSelected(selected.includes(s.id)?selected.filter(x=>x!==s.id):[...selected,s.id])}><input readOnly type="checkbox" checked={selected.includes(s.id)}/><span><b>{s.name}</b><small>{pull?"只检查等待备货新单":"ozon"}</small></span></button>)}</div></div>
}
