import { useMemo, useState } from "react";
import { DownOutlined, ReloadOutlined } from "@ant-design/icons";
import { DemoModal, DemoToast } from "./ReplicaCommon";
import "./source1688-replica.css";

type Item={id:number;title:string;sourceId:string;icon:string;images:number;skus:number;status:"idle"|"processing"|"published"};
const INITIAL:Item[]=[
{id:1,title:"多功能厨房分层收纳架免打孔台面置物架",sourceId:"DEMO1688-240901",icon:"🧺",images:6,skus:3,status:"published"},
{id:2,title:"USB充电感应夜灯卧室走廊人体感应小夜灯",sourceId:"DEMO1688-240902",icon:"💡",images:8,skus:4,status:"idle"},
{id:3,title:"车载椅背收纳袋多功能汽车后座置物袋",sourceId:"DEMO1688-240903",icon:"🚘",images:7,skus:5,status:"idle"},
{id:4,title:"透明真空压缩袋旅行衣物棉被收纳袋组合装",sourceId:"DEMO1688-240904",icon:"📦",images:9,skus:6,status:"published"},
{id:5,title:"便携式USB迷你加湿器办公室桌面静音补水",sourceId:"DEMO1688-240905",icon:"💧",images:5,skus:2,status:"idle"},
];
export function Source1688Replica(){
 const [items,setItems]=useState(INITIAL);
 const [selected,setSelected]=useState<number[]>([]);
 const [media,setMedia]=useState(false);
 const [store,setStore]=useState("1");
 const [settings,setSettings]=useState(false);
 const [deleteOpen,setDeleteOpen]=useState(false);
 const [toast,setToast]=useState("");
 const [loading,setLoading]=useState(false);
 const [profit,setProfit]=useState(20);
 const [labelFee,setLabelFee]=useState(2);
 const [ad,setAd]=useState(0);
 const [other,setOther]=useState(2);
 const all=items.length>0&&items.every(x=>selected.includes(x.id));
 const some=selected.length>0&&!all;
 const flash=(t:string)=>{setToast(t);setTimeout(()=>setToast(""),1500)};
 const toggle=(id:number)=>setSelected(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id]);
 const publish=(ids:number[])=>{
   if(!ids.length)return;
   setItems(v=>v.map(x=>ids.includes(x.id)&&x.status!=="published"?{...x,status:"processing"}:x));
   setTimeout(()=>{setItems(v=>v.map(x=>ids.includes(x.id)?{...x,status:"published"}:x));flash(`已完成 ${ids.length} 个商品的示例上架`)},1200);
 };
 const remove=()=>{setItems(v=>v.filter(x=>!selected.includes(x.id)));setSelected([]);setDeleteOpen(false);flash("已删除选中货源商品")};
 const refresh=()=>{setLoading(true);setTimeout(()=>{setLoading(false);flash("1688 货源列表已刷新")},600)};
 return <div className="source-page-source"><DemoToast text={toast}/>
   <section className="source-hero-source">
    <div><div className="source-kicker-source">货源采集工作台</div><h1><span>1688</span><i>→</i><b>Ozon</b></h1><p>浏览器插件采集的 1688 商品统一进入这里，和 Ozon 在线商品分开管理。</p></div>
    <div className="source-hero-actions">
      <div className={`media-toggle-source ${media?"active":""}`}><div><span>生成图/视频封面</span><small>8 张图 · 24 点 · 16s MP4</small></div><button className={`mini-switch ${media?"on":""}`} onClick={()=>setMedia(!media)}><i></i></button></div>
      <label>上架店铺<select value={store} onChange={e=>setStore(e.target.value)}><option value="1">星桥家居（默认）</option><option value="2">远航百货</option><option value="3">北辰数码</option></select></label>
      <button onClick={()=>setSettings(true)}>上架设置</button><button onClick={refresh}><ReloadOutlined/> {loading?"刷新中":"刷新"}</button><button className="primary" onClick={()=>window.open("https://www.1688.com","_blank","noopener,noreferrer")}>打开 1688</button>
    </div>
   </section>
   <section className="source-summary-source"><article><span>已采集商品</span><strong>{items.length}</strong></article><article><span>来源平台</span><strong>1688</strong></article></section>
   <section className="source-list-source">
    <div className="source-list-head-source"><div><h2>1688 商品</h2><p>SKU 已在采集阶段完成筛选；类目、必填项、包装估算、定价和 Ozon JSON 由系统自动处理。</p></div><div><label><input type="checkbox" checked={all} ref={el=>{if(el)el.indeterminate=some}} onChange={()=>setSelected(all?[]:items.map(x=>x.id))}/> 全选</label><span>已选 {selected.length} 项</span><button className="danger" disabled={!selected.length} onClick={()=>setDeleteOpen(true)}>删除</button><button className="primary" disabled={!selected.length} onClick={()=>publish(selected)}>批量上架至 Ozon</button></div></div>
    {!items.length?<div className="source-empty-source"><b>1688 → Ozon</b><strong>还没有采集商品</strong><span>打开 1688 商品详情页，使用 Auto OZON 点击“采集到 OzonG”。</span></div>:<div className="source-product-grid-source">{items.map(item=><article className={`source-card-source ${selected.includes(item.id)?"selected":""}`} key={item.id}>
      <div className={`source-image-source ${item.status==="processing"?"processing":""}`}><span>{item.icon}</span>{item.status==="processing"&&<div className="source-processing"><i></i><b>正在准备上架</b><small>生成 Ozon 商品数据…</small></div>}<label><input type="checkbox" checked={selected.includes(item.id)} onChange={()=>toggle(item.id)}/></label><em>1688</em></div>
      <div className="source-card-body-source"><h3 title={item.title}>{item.title}</h3><small>货源 ID：{item.sourceId}</small><div className="source-metrics-source"><span>价格<b>—</b></span><span>图片<b>{item.images} 张</b></span><span>SKU<b>{item.skus}</b></span></div><time>09-24 {item.id===1?"11:28":item.id===2?"10:46":"09:35"}</time><footer><button onClick={()=>window.open("https://detail.1688.com","_blank","noopener,noreferrer")}>查看货源</button><button className="primary" disabled={item.status!=="idle"} onClick={()=>publish([item.id])}>{item.status==="published"?"已上架 Ozon":item.status==="processing"?"上架中…":"上架至 Ozon"}</button></footer></div>
    </article>)}</div>}
   </section>
   <DemoModal open={deleteOpen} title={`确认删除已选的 ${selected.length} 个货源商品？`} onClose={()=>setDeleteOpen(false)} onOk={remove} okText="确认删除" danger><p className="source-modal-copy">仅删除 ERP 中的 1688 货源记录，不会修改原 1688 商品。</p></DemoModal>
   <DemoModal open={settings} title="上架设置" width={720} onClose={()=>setSettings(false)} onOk={()=>{setSettings(false);flash("上架价格设置已保存")}} okText="保存设置">
    <div className="listing-settings-source"><aside><div>上架价格设置</div></aside><section><h3>上架价格设置</h3><p>这些设置按当前 ERP 账号保存。后续每次 1688 → Ozon 上架都会自动使用，无需重复填写。</p><div className="settings-grid-source">
      <label>目标利润率<input type="number" value={profit} onChange={e=>setProfit(Number(e.target.value))}/><small>按 1688 SKU 采购成本计算目标利润，默认 20%。</small></label>
      <label>贴单费<input type="number" value={labelFee} onChange={e=>setLabelFee(Number(e.target.value))}/><small>每个 SKU 的固定贴单成本，默认 ¥2。</small></label>
      <label>广告费率<input type="number" value={ad} onChange={e=>setAd(Number(e.target.value))}/><small>按最终售价预留，默认 0%。</small></label>
      <label>其他费用率<input type="number" value={other} onChange={e=>setOther(Number(e.target.value))}/><small>按最终售价预留的其他成本，默认 2%。</small></label>
    </div><div className="auto-box-source"><b>以下基础项由系统自动处理</b><span>Ozon 类目三档佣金 · 1% 平台服务费 · CEL Economy/Pickup 物流 · CNY→RUB 汇率 · 包装重量/长宽高</span><span>1688 有真实包装数据时直接使用；缺失字段才交给 DeepSeek 估算，真实值不会被 AI 覆盖。</span></div></section></div>
   </DemoModal>
 </div>
}
