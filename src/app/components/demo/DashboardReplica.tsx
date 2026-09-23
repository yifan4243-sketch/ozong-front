import { useMemo, useState } from "react";
import { BarChartOutlined, CheckCircleOutlined, DollarOutlined, ExclamationCircleOutlined, FileDoneOutlined, FileTextOutlined, RocketOutlined, SafetyCertificateOutlined, SendOutlined, ShopOutlined, ShoppingCartOutlined, SyncOutlined, ThunderboltOutlined, WarningOutlined } from "@ant-design/icons";
import "./dashboard-replica.css";

type TrendKey="7d"|"30d"|"90d";
type Notice={id:number;title:string;body:string;time:string;type:"success"|"warning";read:boolean};
type Alert={id:number;title:string,count:number,type:"warning"|"danger"};

const TREND:Record<TrendKey,{sales:number[];orders:number[];labels:string[]}>={
  "7d":{sales:[8420,11280,9680,15120,13860,18640,21280],orders:[72,94,81,116,108,139,151],labels:["09-17","09-18","09-19","09-20","09-21","09-22","09-23"]},
  "30d":{sales:[6200,7800,9300,8700,12100,11000,13800,15200,14400,16000,18500,17100,19600,20800,18900,22400,21600,23800,25100,24300,26700,25900,28100,29300,27600,30500,31800,29600,33400,34800],orders:[54,61,74,70,88,83,96,102,98,107,116,112,124,131,119,138,135,146,153,149,161,157,169,176,168,183,190,181,197,205],labels:["08-25","08-30","09-04","09-09","09-14","09-19","09-23"]},
  "90d":{sales:Array.from({length:90},(_,i)=>6500+i*310+Math.sin(i/3)*3500+(i%11)*260),orders:Array.from({length:90},(_,i)=>48+i*1.5+Math.sin(i/4)*18+(i%9)),labels:["06-26","07-10","07-24","08-07","08-21","09-04","09-23"]},
};

function fmt(n:number){return new Intl.NumberFormat("zh-CN").format(Math.round(n))}
function pathFor(values:number[],max:number,w=640,h=320){
  const left=54,right=616,top=28,bottom=282;
  return values.map((v,i)=>{const x=left+(i/Math.max(1,values.length-1))*(right-left);const y=bottom-(v/Math.max(max,1))*(bottom-top);return{x,y,index:i,value:v}}); 
}
function pathString(points:{x:number;y:number}[]){return points.map((p,i)=>`${i?"L":"M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ")}
function areaString(points:{x:number;y:number}[]){if(!points.length)return"";return `${pathString(points)} L${points[points.length-1].x} 282 L${points[0].x} 282 Z`}

function TrendPlot({range}:{range:TrendKey}){
  const [hovered,setHovered]=useState<number|null>(null);
  const d=TREND[range],max=Math.max(...d.sales,...d.orders,1);
  const sales=pathFor(d.sales,max),orders=pathFor(d.orders,max);
  const tickIndexes=range==="7d"?d.labels.map((_,i)=>i):d.labels.map((_,i)=>Math.round(i*(d.sales.length-1)/(d.labels.length-1)));
  const active=hovered==null?null:{label:range==="7d"?d.labels[hovered]:(d.labels[Math.round(hovered*(d.labels.length-1)/(d.sales.length-1))]||d.labels.at(-1)!),sales:d.sales[hovered],orders:d.orders[hovered],p:sales[hovered]};
  return <div className="dash-trend-plot" onMouseLeave={()=>setHovered(null)}>
    <svg viewBox="0 0 640 320" preserveAspectRatio="none">
      <g className="grid">{[0,1,2,3,4].map(row=>{const y=28+(row/4)*(282-28);const value=(max/4)*(4-row);return <g key={row}><line x1="54" x2="616" y1={y} y2={y}/><text x="12" y={y+4}>{value>=1000?`${Math.round(value/1000)}K`:Math.round(value)}</text></g>})}</g>
      <path d={areaString(sales)} className="area sales"/><path d={areaString(orders)} className="area orders"/>
      <path d={pathString(sales)} className="line sales"/><path d={pathString(orders)} className="line orders"/>
      {sales.map(p=><circle key={p.index} cx={p.x} cy={p.y} r="13" className="hit" onMouseEnter={()=>setHovered(p.index)}/>)}
      <g className="xaxis">{tickIndexes.map((idx,i)=>{const p=sales[idx];return <text key={i} x={p?.x||54} y="306" textAnchor="middle">{d.labels[i]}</text>})}</g>
    </svg>
    {active&&<div className="dash-tooltip" style={{left:`${Math.min(84,Math.max(8,(active.p.x/640)*100))}%`,top:`${Math.max(4,(active.p.y/320)*100-10)}%`}}><b>{active.label}</b><span><i className="sales"></i>销售额(¥): {fmt(active.sales)}</span><span><i className="orders"></i>订单数: {fmt(active.orders)}</span></div>}
  </div>
}

export function DashboardReplica({go}:{go:(v:any)=>void}){
  const [range,setRange]=useState<TrendKey>("7d");
  const [shop,setShop]=useState("0");
  const [rankingDays,setRankingDays]=useState(7);
  const [notices,setNotices]=useState<Notice[]>([
    {id:1,title:"财务同步完成",body:"已同步 0 笔订单、0 条财务流水。",time:"7 天前",type:"success",read:false},
    {id:2,title:"财务同步完成",body:"已同步 0 笔订单、20 条财务流水。",time:"9 天前",type:"success",read:false},
    {id:3,title:"财务同步完成，存在异常",body:"已同步 0 笔订单、0 条财务流水。",time:"10 天前",type:"warning",read:false},
    {id:4,title:"财务同步完成，存在异常",body:"已同步 0 笔订单、0 条财务流水。",time:"10 天前",type:"warning",read:false},
  ]);
  const [alerts,setAlerts]=useState<Alert[]>([
    {id:1,title:"商品库存偏低",count:1,type:"warning"},{id:2,title:"商品图片异常",count:18,type:"warning"},{id:3,title:"商品资料缺失",count:138,type:"warning"},{id:4,title:"商品存在 Ozon 错误",count:6,type:"danger"},
  ]);
  const [settingsOpen,setSettingsOpen]=useState(false);
  const [stockThreshold,setStockThreshold]=useState(5);
  const unread=notices.filter(n=>!n.read).length;
  const ranking=useMemo(()=>{const k=rankingDays===7?1:rankingDays===30?3.6:11.7;return [{name:"测试",sales:0*k,orders:0},{name:"UyutHome 家居",sales:12460*k,orders:82},{name:"北极星百货",sales:9860*k,orders:63}]},[rankingDays]);
  const stats=[
    ["今日销售额","¥ 12,486.32","↑ 12.8%","较昨日","blue",<DollarOutlined/>,"#3b82f6"],
    ["本月销售额","¥ 286,940.10","↑ 18.5%","较上月同期","purple",<ShoppingCartOutlined/>,"#8b5cf6"],
    ["今日订单数","137","↑ 9.6%","较昨日","green",<FileTextOutlined/>,"#10b981"],
    ["待发货订单","26","↓ 3.2%","较昨日","orange",<SendOutlined/>,"#f97316"],
    ["店铺数量","6","↑ 0.0%","总数","blue",<ShopOutlined/>,"#ef4444"],
  ] as const;
  return <div className="dash-source-page"><div className="dash-source-shell">
    <section className="dash-hero-grid"><div className="dash-welcome"><div><h1>欢迎回来，1234</h1><p>今天是 2026年9月23日星期三，祝您工作顺利！</p></div><div className="dash-cubes"><i className="main"></i><i className="a"></i><i className="b"></i><i className="shadow"></i></div></div><button className="dash-ai" onClick={()=>go("aiImage")}><div><b>AI 商品图生成</b><span>一键生成高质量商品图，提升转化率</span><em>立即生成 →</em></div><i><ThunderboltOutlined/></i></button></section>
    <section className="dash-stat-grid">{stats.map((s,i)=><article key={s[0]}><div className="stat-main"><div><label>{s[0]}</label><strong>{s[1]}</strong></div><span className={s[4]}>{s[5]}</span></div><div className="stat-meta"><b className={String(s[2]).includes("↓")?"down":""}>{s[2]}</b><span>{s[3]}</span></div>{i===4&&<div className="stat-extra">正常 6 / 异常 0</div>}<svg viewBox="0 0 150 42"><path d="M4 36 L30 31 L54 33 L78 20 L102 24 L126 12 L146 14" fill="none" stroke={s[6]} strokeWidth="2.4"/></svg></article>)}</section>
    <section className="dash-insight-grid">
      <article className="dash-card trend-card"><div className="section-head"><div><h2>销售趋势</h2><div className="legend"><span className="sales">销售额(¥)</span><span className="orders">订单数</span><select value={shop} onChange={e=>setShop(e.target.value)}><option value="0">全部店铺</option><option value="1">测试</option><option value="2">UyutHome 家居</option></select></div></div><div className="trend-tabs">{(["7d","30d","90d"] as TrendKey[]).map(k=><button className={range===k?"active":""} onClick={()=>setRange(k)} key={k}>{k==="7d"?"近7天":k==="30d"?"近30天":"近90天"}</button>)}</div></div><TrendPlot range={range}/></article>
      <article className="dash-card quick-card"><div className="section-head single"><h2>快捷入口</h2></div><div className="quick-list">{[
        ["同步商品","从 Ozon 同步商品",<SyncOutlined/>,"blue","products"],["AI 生成商品图","批量生成高质量图",<ThunderboltOutlined/>,"purple","aiImage"],["店铺授权","管理店铺授权状态",<SafetyCertificateOutlined/>,"green","shops"],["发布商品","发布到 Ozon 平台",<RocketOutlined/>,"orange","products"],["生成记录","查看历史生成记录",<FileDoneOutlined/>,"blue","listing"],["成本统计","查看成本消耗情况",<BarChartOutlined/>,"purple","finance"],
      ].map((x:any)=><button onClick={()=>go(x[4])} key={x[0]}><span className={x[3]}>{x[2]}</span><i><b>{x[0]}</b><em>{x[1]}</em></i></button>)}</div></article>
      <article className="dash-card notice-card"><div className="section-head"><h2>系统通知 {unread>0&&<small>{unread} 条未读</small>}</h2><button disabled={!unread} onClick={()=>setNotices(ns=>ns.map(n=>({...n,read:true})))}>全部已读</button></div><div className="notice-list">{notices.map(n=><button className={n.read?"notice":"notice unread"} key={n.id} onClick={()=>setNotices(ns=>ns.map(x=>x.id===n.id?{...x,read:true}:x))}><span className={n.type}>{n.type==="success"?<CheckCircleOutlined/>:<WarningOutlined/>}</span><i><b>{n.title}</b><em>{n.body}</em></i><time>{n.time}</time></button>)}</div></article>
    </section>
    <section className="dash-bottom-grid">
      <article className="dash-card ranking-card"><div className="section-head"><h2>店铺销售排行</h2><select value={rankingDays} onChange={e=>setRankingDays(Number(e.target.value))}><option value="7">近7天</option><option value="30">近30天</option><option value="100">近100天</option></select></div><div className="ranking-table"><div className="ranking-row head"><span>排名</span><span>店铺名称</span><span>销售额(¥)</span><span>订单数</span><span>操作</span></div>{ranking.map((r,i)=><div className="ranking-row" key={r.name}><span>{i+1}</span><span className="shop"><i>ozon</i>{r.name}</span><span>¥ {fmt(r.sales)}</span><span>{r.orders}</span><button onClick={()=>go("orders")}>查看</button></div>)}</div></article>
      <article className="dash-card alert-card"><div className="section-head"><h2>异常提醒</h2><button onClick={()=>setSettingsOpen(true)}>预警设置</button></div><div className="alert-list">{alerts.length?alerts.map(a=><div className="alert" key={a.id}><span className={a.type}><ExclamationCircleOutlined/></span><i><b>{a.title}</b><em>当前影响 {a.count} 项</em></i><div><button onClick={()=>go("products")}>查看</button><button onClick={()=>setAlerts(v=>v.filter(x=>x.id!==a.id))}>24小时后提醒</button></div></div>):<p className="empty">暂无待处理异常</p>}</div></article>
    </section>
    {settingsOpen&&<div className="dash-modal-mask" onMouseDown={()=>setSettingsOpen(false)}><div className="dash-modal" onMouseDown={e=>e.stopPropagation()}><header><b>预警设置</b><button onClick={()=>setSettingsOpen(false)}>×</button></header><p>低库存商品的库存量为 1 至安全库存线；售罄商品始终单独提醒。</p><label>安全库存线<div><input type="number" min="0" max="100000" value={stockThreshold} onChange={e=>setStockThreshold(Number(e.target.value))}/><span>件</span></div></label><footer><button onClick={()=>setSettingsOpen(false)}>取消</button><button className="primary" onClick={()=>setSettingsOpen(false)}>确定</button></footer></div></div>}
  </div></div>
}
