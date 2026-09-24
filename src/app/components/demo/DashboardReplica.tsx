import { useMemo, useState } from "react";
import type { UIEvent } from "react";
import {
  BarChartOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  ExclamationCircleOutlined,
  FileDoneOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
  SendOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  SyncOutlined,
  ThunderboltOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import "./dashboard-replica.css";

type TrendKey = "7d" | "30d" | "90d";
type Notice = { id:number; title:string; body:string; time:string; type:"success"|"warning"; read:boolean };
type Alert = { id:number; title:string; count:number; type:"warning"|"danger" };


function beijingDateParts(offsetDays=0){
  const now=new Date();
  const bj=new Date(now.toLocaleString("en-US",{timeZone:"Asia/Shanghai"}));
  bj.setDate(bj.getDate()+offsetDays);
  return bj;
}
function makeLabels(days:number){
  return Array.from({length:days},(_,i)=>{
    const d=beijingDateParts(-(days-i-1));
    const m=String(d.getMonth()+1).padStart(2,"0");
    const day=String(d.getDate()).padStart(2,"0");
    return `${m}-${day}`;
  });
}
function dashboardDateText(){
  const d=beijingDateParts();
  const weekdays=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
  return `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日${weekdays[d.getDay()]}`;
}
const demoSeries=(days:number,base:number,step:number,wave:number)=>Array.from({length:days},(_,i)=>Math.round(base+i*step+Math.sin(i*.72)*wave+Math.cos(i*.23)*wave*.35));
const TREND:Record<TrendKey,{sales:number[];orders:number[];labels:string[]}>={
  "7d":{sales:[12840,14620,13980,17150,16240,19860,22490],orders:[61,73,68,84,79,96,108],labels:makeLabels(7)},
  "30d":{sales:demoSeries(30,8200,470,1550),orders:demoSeries(30,38,2.05,8),labels:makeLabels(30)},
  "90d":{sales:demoSeries(90,6100,235,2250),orders:demoSeries(90,29,.92,11),labels:makeLabels(90)},
};

function fmt(n:number){return new Intl.NumberFormat("zh-CN").format(Math.round(n))}
function sparkPath(values:number[],width=150,height=42){
  if(values.length<2)return"";
  const max=Math.max(...values),min=Math.min(...values),range=max-min||1;
  return values.map((v,i)=>{
    const x=(i/(values.length-1))*width;
    const y=height-4-((v-min)/range)*(height-10);
    return `${i===0?"M":"L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
}
function chartPoints(values:number[]){
  const left=54,right=616,top=28,bottom=282;
  const max=Math.max(...values,1),min=Math.min(...values,0),range=max-min||1;
  return values.map((v,i)=>({
    index:i,
    x:left+(i/Math.max(1,values.length-1))*(right-left),
    y:bottom-((v-min)/range)*(bottom-top),
    value:v,
  }));
}
function linePath(points:{x:number;y:number;index:number}[]){
  return points.map(p=>`${p.index===0?"M":"L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
}
function areaPath(points:{x:number;y:number;index:number}[]){
  if(!points.length)return"";
  const line=linePath(points),first=points[0],last=points[points.length-1];
  return `${line} L${last.x.toFixed(1)} 282 L${first.x.toFixed(1)} 282 Z`;
}
function tickIndexes(length:number){
  const step=Math.max(1,Math.ceil(length/7));
  return Array.from({length},(_,i)=>i).filter((i)=>i%step===0||i===length-1);
}

function DemoSelect<T extends string|number>({
  value,options,onChange,className=""
}:{value:T;options:Array<{value:T;label:string}>;onChange:(value:T)=>void;className?:string}){
  const [open,setOpen]=useState(false);
  const selected=options.find(o=>o.value===value)?.label ?? String(value);
  return <div className={`dash-select ${className}`} tabIndex={0} onBlur={()=>setOpen(false)}>
    <button type="button" className={open?"open":""} onClick={()=>setOpen(v=>!v)}>
      <span>{selected}</span><i>⌄</i>
    </button>
    {open&&<div className="dash-select-menu">
      {options.map(o=><button
        type="button"
        key={String(o.value)}
        className={o.value===value?"active":""}
        onMouseDown={e=>e.preventDefault()}
        onClick={()=>{onChange(o.value);setOpen(false)}}
      >{o.label}</button>)}
    </div>}
  </div>;
}

function TrendPlot({range,shop}:{range:TrendKey;shop:string}){
  const [hovered,setHovered]=useState<number|null>(null);
  const base=TREND[range];
  const factor = shop === "1" ? 0.42 : shop === "2" ? 0.34 : shop === "3" ? 0.24 : 1;
  const d={labels:base.labels,sales:base.sales.map(v=>Math.round(v*factor)),orders:base.orders.map(v=>Math.round(v*factor))};
  const sales=chartPoints(d.sales),orders=chartPoints(d.orders);
  const ticks=tickIndexes(d.sales.length);
  const active=hovered==null?null:{
    label:d.labels[hovered],
    sales:d.sales[hovered],
    orders:d.orders[hovered],
    p:sales[hovered],
  };
  return <div className="dash-trend-plot" onMouseLeave={()=>setHovered(null)}>
    <svg viewBox="0 0 640 320" preserveAspectRatio="none">
      <g className="grid">
        {[4,3,2,1,0].map((row)=>{
          const y=28+((4-row)/4)*(282-28);
          return <g key={row}><line x1="54" x2="616" y1={y} y2={y}/>{row===0&&<text x="12" y={y+4}>0</text>}</g>;
        })}
      </g>
      <path d={areaPath(sales)} className="area sales"/>
      <path d={areaPath(orders)} className="area orders"/>
      <path d={linePath(sales)} className="line sales"/>
      <path d={linePath(orders)} className="line orders"/>
      {sales.map(p=><circle key={p.index} cx={p.x} cy={p.y} r="13" className="hit" onMouseEnter={()=>setHovered(p.index)}/>)}
      <g className="xaxis">
        {ticks.map((idx)=>{
          const p=sales[idx];
          return <text key={idx} x={p.x} y="306" textAnchor="middle">{d.labels[idx]}</text>;
        })}
      </g>
    </svg>
    {active&&<div className="dash-tooltip" style={{left:`${Math.min(84,Math.max(8,(active.p.x/640)*100))}%`,top:`${Math.max(4,(active.p.y/320)*100-10)}%`}}>
      <b>{active.label}</b>
      <span><i className="sales"></i>销售额(¥): {fmt(active.sales)}</span>
      <span><i className="orders"></i>订单数: {fmt(active.orders)}</span>
    </div>}
  </div>;
}

export function DashboardReplica({go}:{go:(v:any)=>void}){
  const [range,setRange]=useState<TrendKey>("7d");
  const [shop,setShop]=useState("0");
  const [rankingDays,setRankingDays]=useState(7);
  const [notices,setNotices]=useState<Notice[]>([
    {id:1,title:"订单同步完成",body:"星桥家居新增 18 笔订单，已写入订单中心。",time:"18 分钟前",type:"success",read:false},
    {id:2,title:"商品同步完成",body:"远航百货已同步 126 个在线商品。",time:"1 小时前",type:"success",read:false},
    {id:3,title:"财务同步完成",body:"已匹配 42 笔订单财务流水。",time:"3 小时前",type:"success",read:false},
    {id:4,title:"库存预警",body:"北辰数码有 6 个商品低于安全库存。",time:"昨天",type:"warning",read:false},
    {id:5,title:"商品资料待完善",body:"检测到 9 个商品缺少必要属性。",time:"2 天前",type:"warning",read:false},
  ]);
  const unreadCount=notices.filter(n=>!n.read).length;
  const [loadedOlder,setLoadedOlder]=useState(false);
  const [toast,setToast]=useState("");
  const [alerts,setAlerts]=useState<Alert[]>([
    {id:1,title:"商品库存偏低",count:6,type:"warning"},
    {id:2,title:"商品图片异常",count:11,type:"warning"},
    {id:3,title:"商品资料缺失",count:23,type:"warning"},
    {id:4,title:"商品存在 Ozon 错误",count:4,type:"danger"},
  ]);
  const [settingsOpen,setSettingsOpen]=useState(false);
  const [stockThreshold,setStockThreshold]=useState(5);

  const showToast=(text:string)=>{
    setToast(text);
    window.setTimeout(()=>setToast(""),1600);
  };
  const markNotice=(id:number)=>{
    const current=notices.find(n=>n.id===id);
    setNotices(ns=>ns.map(n=>n.id===id?{...n,read:true}:n));
  };
  const markAllNotices=()=>{
    setNotices(ns=>ns.map(n=>({...n,read:true})));
  };
  const loadOlderNotices=(event:UIEvent<HTMLDivElement>)=>{
    if(loadedOlder)return;
    const el=event.currentTarget;
    if(el.scrollTop+el.clientHeight<el.scrollHeight-12)return;
    setLoadedOlder(true);
    setNotices(ns=>[...ns,
      {id:6,title:"促销活动同步完成",body:"已刷新 7 个可参加活动。",time:"4 天前",type:"success",read:true},
      {id:7,title:"店铺授权检查完成",body:"3 个演示店铺授权状态正常。",time:"6 天前",type:"success",read:true},
    ]);
  };

  const ranking=useMemo(()=>{
    const factor=rankingDays===7?1:rankingDays===30?3.7:11.4;
    return [
      {name:"星桥家居",sales:Math.round(86420.5*factor),orders:Math.round(312*factor)},
      {name:"远航百货",sales:Math.round(63908.2*factor),orders:Math.round(241*factor)},
      {name:"北辰数码",sales:Math.round(41275*factor),orders:Math.round(168*factor)},
    ];
  },[rankingDays]);

  const stats=[
    ["今日销售额","¥ 22,490.36","↑ 14.2%","较昨日","blue",<DollarOutlined/>,"#3b82f6",[12840,14620,13980,17150,16240,19860,22490]],
    ["本月销售额","¥ 438,726.80","↑ 21.6%","较上月同期","purple",<ShoppingCartOutlined/>,"#8b5cf6",[248000,271000,296000,318000,351000,392000,438727]],
    ["今日订单数","108","↑ 12.5%","较昨日","green",<FileTextOutlined/>,"#34d399",[61,73,68,84,79,96,108]],
    ["待发货订单","41","↓ 6.8%","较昨日","orange",<SendOutlined/>,"#fb923c",[53,50,48,46,45,44,41]],
    ["店铺数量","3","↑ 0.0%","总数","blue",<ShopOutlined/>,"#ef4444",[3,3,3,3,3,3,3]],
  ] as const;

  return <div className="dash-source-page">
      {toast&&<div className="dash-message-toast">{toast}</div>}
      <div className="dash-source-shell">
        <section className="dash-hero-grid">
          <div className="dash-welcome">
            <div><h1>欢迎回来，演示账号 A01</h1><p>今天是 {dashboardDateText()}，祝您工作顺利！</p></div>
            <div className="dash-cubes"><i className="main"></i><i className="a"></i><i className="b"></i><i className="shadow"></i></div>
          </div>
          <button className="dash-ai" onClick={()=>go("aiImage")}>
            <div><b>AI 商品图生成</b><span>一键生成高质量商品图，提升转化率</span><em>立即生成 →</em></div>
            <i><ThunderboltOutlined/></i>
          </button>
        </section>

        <section className="dash-stat-grid" aria-label="核心指标">
          {stats.map((s,i)=><article className="stat-card" key={s[0]}>
            <div className="stat-main">
              <div>
                <div className="stat-label">{s[0]}</div>
                <div className="stat-value">{s[1]}</div>
              </div>
              <div className={`stat-icon ${s[4]}`}>{s[5]}</div>
            </div>
            <div className="stat-meta">
              <span className="stat-change">{s[2]}</span>
              <span>{s[3]}</span>
            </div>
            {i===4&&<div className="stat-extra">正常 3 / 异常 0</div>}
            <svg className="mini-chart" viewBox="0 0 150 42" preserveAspectRatio="none" aria-hidden="true">
              <path d={sparkPath([...s[7]])} fill="none" stroke={s[6]} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </article>)}
        </section>

        <section className="dash-insight-grid">
          <article className="dash-card trend-card">
            <div className="section-head">
              <div>
                <h2>销售趋势</h2>
                <div className="legend">
                  <span className="sales">销售额(¥)</span>
                  <span className="orders">订单数</span>
                  <DemoSelect
                    value={shop}
                    options={[{value:"0",label:"全部店铺"},{value:"1",label:"星桥家居"},{value:"2",label:"远航百货"},{value:"3",label:"北辰数码"}]}
                    onChange={setShop}
                    className="trend-shop-select"
                  />
                </div>
              </div>
              <div className="trend-tabs">
                {(["7d","30d","90d"] as TrendKey[]).map(k=><button type="button" className={range===k?"active":""} onClick={()=>setRange(k)} key={k}>{k==="7d"?"近7天":k==="30d"?"近30天":"近90天"}</button>)}
              </div>
            </div>
            <TrendPlot range={range} shop={shop}/>
          </article>

          <article className="dash-card quick-card">
            <div className="section-head single"><h2>快捷入口</h2></div>
            <div className="quick-list">
              {[
                ["同步商品","从 Ozon 同步商品",<SyncOutlined/>,"blue","products"],
                ["AI 生成商品图","批量生成高质量图",<ThunderboltOutlined/>,"purple","aiImage"],
                ["店铺授权","管理店铺授权状态",<SafetyCertificateOutlined/>,"green","shops"],
                ["发布商品","发布到 Ozon 平台",<SendOutlined/>,"orange","products"],
                ["生成记录","查看历史生成记录",<FileDoneOutlined/>,"blue","coming"],
                ["成本统计","查看成本消耗情况",<BarChartOutlined/>,"purple","coming"],
              ].map((x:any)=><button type="button" onClick={()=>x[4]==="coming"?showToast(`${x[0]} 功能建设中`):go(x[4])} key={x[0]}><span className={x[3]}>{x[2]}</span><i><b>{x[0]}</b><em>{x[1]}</em></i></button>)}
            </div>
          </article>

          <article className="dash-card notice-card">
            <div className="section-head"><h2>系统通知 {unreadCount>0&&<small>{unreadCount} 条未读</small>}</h2><button type="button" disabled={!unreadCount} onClick={markAllNotices}>全部已读</button></div>
            <div className="notice-list" onScroll={loadOlderNotices}>
              {notices.map(n=><button type="button" className={n.read?"notice":"notice unread"} key={n.id} onClick={()=>markNotice(n.id)}>
                <span className={n.type}>{n.type==="success"?<CheckCircleOutlined/>:<WarningOutlined/>}</span>
                <i><b>{n.title}</b><em>{n.body}</em></i><time>{n.time}</time>
              </button>)}
            </div>
          </article>
        </section>

        <section className="dash-bottom-grid">
          <article className="dash-card ranking-card">
            <div className="section-head">
              <h2>店铺销售排行</h2>
              <DemoSelect
                value={rankingDays}
                options={[{value:7,label:"近7天"},{value:30,label:"近30天"},{value:100,label:"近100天"}]}
                onChange={setRankingDays}
                className="ranking-range-select"
              />
            </div>
            <div className="ranking-table">
              <div className="ranking-row head"><span>排名</span><span>店铺名称</span><span>销售额(¥)</span><span>订单数</span><span>操作</span></div>
              {ranking.map((r,i)=><div className="ranking-row" key={r.name}><span>{i+1}</span><span className="shop"><i>ozon</i>{r.name}</span><span>¥ {r.sales.toLocaleString("zh-CN",{minimumFractionDigits:2})}</span><span>{r.orders}</span><button onClick={()=>go("orders")}>查看</button></div>)}
            </div>
          </article>

          <article className="dash-card alert-card">
            <div className="section-head"><h2>异常提醒</h2><button onClick={()=>setSettingsOpen(true)}>预警设置</button></div>
            <div className="alert-list">
              {alerts.length?alerts.map(a=><div className="alert" key={a.id}>
                <span className={a.type}><ExclamationCircleOutlined/></span>
                <i><b>{a.title}</b><em>当前影响 {a.count} 项</em></i>
                <div><button onClick={()=>go("products")}>查看</button><button onClick={()=>{setAlerts(v=>v.filter(x=>x.id!==a.id));showToast("该提醒将在 24 小时后再次显示")}}>24小时后提醒</button></div>
              </div>):<p className="empty">暂无待处理异常</p>}
            </div>
          </article>
        </section>

        {settingsOpen&&<div className="dash-modal-mask" onMouseDown={()=>setSettingsOpen(false)}>
          <div className="dash-modal" onMouseDown={e=>e.stopPropagation()}>
            <header><b>预警设置</b><button onClick={()=>setSettingsOpen(false)}>×</button></header>
            <p>低库存商品的库存量为 1 至安全库存线；售罄商品始终单独提醒。</p>
            <label>安全库存线<div><input type="number" min="0" max="100000" value={stockThreshold} onChange={e=>setStockThreshold(Number(e.target.value))}/><span>件</span></div></label>
            <footer><button onClick={()=>setSettingsOpen(false)}>取消</button><button className="primary" onClick={()=>setSettingsOpen(false)}>确定</button></footer>
          </div>
        </div>}
      </div>
    </div>;
}
