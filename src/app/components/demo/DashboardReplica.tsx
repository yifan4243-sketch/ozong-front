import { useEffect, useMemo, useRef, useState } from "react";
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

const DESIGN_WIDTH = 1760;

function makeLabels(days:number){
  const end = new Date("2026-09-24T12:00:00+08:00");
  return Array.from({length:days},(_,i)=>{
    const d=new Date(end.getTime()-(days-i-1)*86400000);
    const m=String(d.getMonth()+1).padStart(2,"0");
    const day=String(d.getDate()).padStart(2,"0");
    return `${m}-${day}`;
  });
}
const TREND:Record<TrendKey,{sales:number[];orders:number[];labels:string[]}>={
  "7d":{sales:Array(7).fill(0),orders:Array(7).fill(0),labels:makeLabels(7)},
  "30d":{sales:Array(30).fill(0),orders:Array(30).fill(0),labels:makeLabels(30)},
  "90d":{sales:Array(90).fill(0),orders:Array(90).fill(0),labels:makeLabels(90)},
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
  if(length<=7)return Array.from({length},(_,i)=>i);
  return Array.from({length:7},(_,i)=>Math.round(i*(length-1)/6));
}

function TrendPlot({range}:{range:TrendKey}){
  const [hovered,setHovered]=useState<number|null>(null);
  const d=TREND[range];
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
  const viewportRef=useRef<HTMLDivElement|null>(null);
  const [scale,setScale]=useState(.8);
  const [range,setRange]=useState<TrendKey>("7d");
  const [shop,setShop]=useState("0");
  const [rankingDays,setRankingDays]=useState(7);
  const [notices,setNotices]=useState<Notice[]>([
    {id:1,title:"财务同步完成",body:"已同步 0 笔订单、0 条财务流水。",time:"11 小时前",type:"success",read:false},
    {id:2,title:"财务同步完成",body:"已同步 0 笔订单、0 条财务流水。",time:"11 小时前",type:"success",read:false},
    {id:3,title:"财务同步完成",body:"已同步 0 笔订单、0 条财务流水。",time:"7 天前",type:"success",read:false},
    {id:4,title:"财务同步完成",body:"已同步 0 笔订单、20 条财务流水。",time:"9 天前",type:"success",read:false},
    {id:5,title:"财务同步完成，存在异常",body:"已同步 0 笔订单、0 条财务流水。",time:"10 天前",type:"warning",read:false},
  ]);
  const [alerts,setAlerts]=useState<Alert[]>([
    {id:1,title:"商品库存偏低",count:1,type:"warning"},
    {id:2,title:"商品图片异常",count:18,type:"warning"},
    {id:3,title:"商品资料缺失",count:138,type:"warning"},
    {id:4,title:"商品存在 Ozon 错误",count:6,type:"danger"},
  ]);
  const [settingsOpen,setSettingsOpen]=useState(false);
  const [stockThreshold,setStockThreshold]=useState(5);

  useEffect(()=>{
    const el=viewportRef.current;
    if(!el)return;
    const update=()=>setScale(Math.min(1,Math.max(.55,el.clientWidth/DESIGN_WIDTH)));
    update();
    const ro=new ResizeObserver(update);
    ro.observe(el);
    return()=>ro.disconnect();
  },[]);

  const unread=notices.filter(n=>!n.read).length;
  const ranking=useMemo(()=>[
    {name:"测试",sales:0,orders:0},
  ],[rankingDays]);

  const stats=[
    ["今日销售额","¥ 0.00","↑ 0.0%","较昨日","blue",<DollarOutlined/>,"#3b82f6",Array(7).fill(0)],
    ["本月销售额","¥ 0.00","↑ 0.0%","较上月同期","purple",<ShoppingCartOutlined/>,"#8b5cf6",Array(7).fill(0)],
    ["今日订单数","0","↑ 0.0%","较昨日","green",<FileTextOutlined/>,"#34d399",Array(7).fill(0)],
    ["待发货订单","0","↑ 0.0%","较昨日","orange",<SendOutlined/>,"#fb923c",Array(7).fill(0)],
    ["店铺数量","1","↑ 0.0%","总数","blue",<ShopOutlined/>,"#ef4444",Array(7).fill(1)],
  ] as const;

  return <div className="dash-scale-viewport" ref={viewportRef}>
    <div className="dash-source-page" style={{width:DESIGN_WIDTH,zoom:scale} as any}>
      <div className="dash-source-shell">
        <section className="dash-hero-grid">
          <div className="dash-welcome">
            <div><h1>欢迎回来，1234</h1><p>今天是 2026年9月24日星期四，祝您工作顺利！</p></div>
            <div className="dash-cubes"><i className="main"></i><i className="a"></i><i className="b"></i><i className="shadow"></i></div>
          </div>
          <button className="dash-ai" onClick={()=>go("aiImage")}>
            <div><b>AI 商品图生成</b><span>一键生成高质量商品图，提升转化率</span><em>立即生成 →</em></div>
            <i><ThunderboltOutlined/></i>
          </button>
        </section>

        <section className="dash-stat-grid">
          {stats.map((s,i)=><article key={s[0]}>
            <div className="stat-main"><div><label>{s[0]}</label><strong>{s[1]}</strong></div><span className={s[4]}>{s[5]}</span></div>
            <div className="stat-meta"><b>{s[2]}</b><span>{s[3]}</span></div>
            {i===4&&<div className="stat-extra">正常 1 / 异常 0</div>}
            <svg viewBox="0 0 150 42" preserveAspectRatio="none"><path d={sparkPath([...s[7]])} fill="none" stroke={s[6]} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
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
                  <select value={shop} onChange={e=>setShop(e.target.value)}>
                    <option value="0">全部店铺</option>
                    <option value="1">测试</option>
                  </select>
                </div>
              </div>
              <div className="trend-tabs">
                {(["7d","30d","90d"] as TrendKey[]).map(k=><button type="button" className={range===k?"active":""} onClick={()=>setRange(k)} key={k}>{k==="7d"?"近7天":k==="30d"?"近30天":"近90天"}</button>)}
              </div>
            </div>
            <TrendPlot range={range}/>
          </article>

          <article className="dash-card quick-card">
            <div className="section-head single"><h2>快捷入口</h2></div>
            <div className="quick-list">
              {[
                ["同步商品","从 Ozon 同步商品",<SyncOutlined/>,"blue","products"],
                ["AI 生成商品图","批量生成高质量图",<ThunderboltOutlined/>,"purple","aiImage"],
                ["店铺授权","管理店铺授权状态",<SafetyCertificateOutlined/>,"green","shops"],
                ["发布商品","发布到 Ozon 平台",<SendOutlined/>,"orange","products"],
                ["生成记录","查看历史生成记录",<FileDoneOutlined/>,"blue","listing"],
                ["成本统计","查看成本消耗情况",<BarChartOutlined/>,"purple","finance"],
              ].map((x:any)=><button type="button" onClick={()=>go(x[4])} key={x[0]}><span className={x[3]}>{x[2]}</span><i><b>{x[0]}</b><em>{x[1]}</em></i></button>)}
            </div>
          </article>

          <article className="dash-card notice-card">
            <div className="section-head"><h2>系统通知 {unread>0&&<small>{44+unread} 条未读</small>}</h2><button type="button" disabled={!unread} onClick={()=>setNotices(ns=>ns.map(n=>({...n,read:true})))}>全部已读</button></div>
            <div className="notice-list">
              {notices.map(n=><button type="button" className={n.read?"notice":"notice unread"} key={n.id} onClick={()=>setNotices(ns=>ns.map(x=>x.id===n.id?{...x,read:true}:x))}>
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
              <select value={rankingDays} onChange={e=>setRankingDays(Number(e.target.value))}>
                <option value="7">近7天</option><option value="30">近30天</option><option value="100">近100天</option>
              </select>
            </div>
            <div className="ranking-table">
              <div className="ranking-row head"><span>排名</span><span>店铺名称</span><span>销售额(¥)</span><span>订单数</span><span>操作</span></div>
              {ranking.map((r,i)=><div className="ranking-row" key={r.name}><span>{i+1}</span><span className="shop"><i>ozon</i>{r.name}</span><span>¥ 0.00</span><span>{r.orders}</span><button onClick={()=>go("orders")}>查看</button></div>)}
            </div>
          </article>

          <article className="dash-card alert-card">
            <div className="section-head"><h2>异常提醒</h2><button onClick={()=>setSettingsOpen(true)}>预警设置</button></div>
            <div className="alert-list">
              {alerts.length?alerts.map(a=><div className="alert" key={a.id}>
                <span className={a.type}><ExclamationCircleOutlined/></span>
                <i><b>{a.title}</b><em>当前影响 {a.count} 项</em></i>
                <div><button onClick={()=>go("products")}>查看</button><button onClick={()=>setAlerts(v=>v.filter(x=>x.id!==a.id))}>24小时后提醒</button></div>
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
    </div>
  </div>;
}
