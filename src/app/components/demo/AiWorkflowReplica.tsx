import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, WheelEvent as ReactWheelEvent } from "react";
import { DemoToast } from "./ReplicaCommon";
import "./ai-workflow-replica.css";

type Point={x:number;y:number};
type NodeKey="product"|"style"|"brief"|"plan"|"main"|"scene"|"detail"|"benefit1"|"benefit2"|"spec"|"package"|"marketing";
type ImagesState={product:string[];style:string[]};
type SlotStatus="idle"|"running"|"succeeded";

const DEFAULT_POSITIONS:Record<NodeKey,Point>={
  product:{x:80,y:90},style:{x:80,y:390},brief:{x:80,y:670},plan:{x:520,y:330},
  main:{x:1040,y:40},scene:{x:1040,y:310},detail:{x:1040,y:580},benefit1:{x:1040,y:850},
  benefit2:{x:1380,y:40},spec:{x:1380,y:310},package:{x:1380,y:580},marketing:{x:1380,y:850},
};
const SLOT_META=[
  ["main","5","Ozon 主图","#6366f1","建立商品主视觉"],
  ["scene","6","使用场景图","#10b981","展示可使用场景"],
  ["detail","7","商品细节图","#0ea5e9","只展示可看到的材质与细节"],
  ["benefit1","8","核心卖点图 1","#8b5cf6","一个卖点一个中心价值"],
  ["benefit2","9","核心卖点图 2","#f97316","表达第二个场景卖点"],
  ["spec","10","参数信息图","#64748b","只展示可证实参数"],
  ["package","11","包装清单图","#d97706","只展示真实包装与配件"],
  ["marketing","12","营销卖点图","#ec4899","收口并强化购买价值"],
] as const;
const SIZE:Record<NodeKey,{w:number;h:number}>={
  product:{w:300,h:242},style:{w:300,h:242},brief:{w:320,h:218},plan:{w:360,h:154},
  main:{w:280,h:250},scene:{w:280,h:250},detail:{w:280,h:250},benefit1:{w:280,h:250},
  benefit2:{w:280,h:250},spec:{w:280,h:250},package:{w:280,h:250},marketing:{w:280,h:250},
};

function clamp(v:number,min:number,max:number){return Math.max(min,Math.min(max,v))}
function cloneDefault(){return Object.fromEntries(Object.entries(DEFAULT_POSITIONS).map(([k,v])=>[k,{...v}])) as Record<NodeKey,Point>}

export function AiWorkflowReplica(){
  const canvasRef=useRef<HTMLDivElement|null>(null);
  const [positions,setPositions]=useState<Record<NodeKey,Point>>(()=>cloneDefault());
  const [viewport,setViewport]=useState({x:110,y:8,zoom:.55});
  const [generationKind,setGenerationKind]=useState<"main"|"set">("set");
  const [images,setImages]=useState<ImagesState>({product:[],style:[]});
  const [prompt,setPrompt]=useState("补充商品事实、核心卖点或希望强调的场景…");
  const [slotStatus,setSlotStatus]=useState<Record<string,SlotStatus>>({});
  const [historyOpen,setHistoryOpen]=useState(false);
  const [planOpen,setPlanOpen]=useState(false);
  const [notice,setNotice]=useState("");
  const dragRef=useRef<({kind:"canvas";pointerId:number;startX:number;startY:number;baseX:number;baseY:number}|{kind:"node";pointerId:number;key:NodeKey;startX:number;startY:number;base:Point})|null>(null);
  const [dragKind,setDragKind]=useState<"canvas"|"node"|null>(null);
  const running=Object.values(slotStatus).some(v=>v==="running");
  const enabledSlots=generationKind==="main"?["main"]:SLOT_META.map(x=>x[0]);
  const completed=enabledSlots.every(k=>slotStatus[k]==="succeeded");
  const estimate=generationKind==="main"?3:24;

  useEffect(()=>{
    try{
      const raw=localStorage.getItem("ozong-ai-workflow-layout-demo-v1");
      if(raw){
        const parsed=JSON.parse(raw);
        setPositions(prev=>{
          const next={...prev};
          (Object.keys(prev) as NodeKey[]).forEach(k=>{
            if(parsed?.[k]&&Number.isFinite(parsed[k].x)&&Number.isFinite(parsed[k].y)) next[k]={x:parsed[k].x,y:parsed[k].y};
          });
          return next;
        });
      }
    }catch{}
  },[]);
  useEffect(()=>{
    const timer=window.setTimeout(()=>{
      try{localStorage.setItem("ozong-ai-workflow-layout-demo-v1",JSON.stringify(positions))}catch{}
    },300);
    return()=>window.clearTimeout(timer);
  },[positions]);


  function fitPositions(pos:Record<NodeKey,Point>){
    const el=canvasRef.current;if(!el)return;
    const keys=Object.keys(pos) as NodeKey[];
    const minX=Math.min(...keys.map(k=>pos[k].x));
    const minY=Math.min(...keys.map(k=>pos[k].y));
    const maxX=Math.max(...keys.map(k=>pos[k].x+SIZE[k].w));
    const maxY=Math.max(...keys.map(k=>pos[k].y+SIZE[k].h));
    const pad=34;
    const z=clamp(Math.min((el.clientWidth-pad*2)/(maxX-minX),(el.clientHeight-pad*2)/(maxY-minY)),.45,1.5);
    setViewport({zoom:z,x:(el.clientWidth-(maxX-minX)*z)/2-minX*z,y:(el.clientHeight-(maxY-minY)*z)/2-minY*z});
  }
  function fitView(){fitPositions(positions)}
  function resetLayout(){
    const defaults=cloneDefault();
    setPositions(defaults);
    try{localStorage.removeItem("ozong-ai-workflow-layout-demo-v1")}catch{}
    window.setTimeout(()=>fitPositions(defaults),20);
  }
  function zoomBy(delta:number,center?:{x:number;y:number}){
    const el=canvasRef.current;if(!el)return;
    const rect=el.getBoundingClientRect();
    const cx=(center?.x??rect.left+rect.width/2)-rect.left;
    const cy=(center?.y??rect.top+rect.height/2)-rect.top;
    setViewport(v=>{
      const nz=clamp(v.zoom+delta,.45,1.5);
      const wx=(cx-v.x)/v.zoom,wy=(cy-v.y)/v.zoom;
      return{zoom:nz,x:cx-wx*nz,y:cy-wy*nz};
    });
  }
  function onWheel(e:ReactWheelEvent<HTMLDivElement>){
    e.preventDefault();
    zoomBy(e.deltaY>0?-.08:.08,{x:e.clientX,y:e.clientY});
  }
  function canvasPointerDown(e:ReactPointerEvent<HTMLDivElement>){
    if(e.button!==0)return;
    if((e.target as HTMLElement).closest(".demo-flow-node"))return;
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    dragRef.current={kind:"canvas",pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,baseX:viewport.x,baseY:viewport.y};
    setDragKind("canvas");
  }
  function nodePointerDown(key:NodeKey,e:ReactPointerEvent){
    if(e.button!==0)return;
    const target=e.target as HTMLElement;
    if(target.closest("button,input,textarea"))return;
    e.preventDefault();
    e.stopPropagation();
    canvasRef.current?.setPointerCapture?.(e.pointerId);
    dragRef.current={kind:"node",pointerId:e.pointerId,key,startX:e.clientX,startY:e.clientY,base:{...positions[key]}};
    setDragKind("node");
  }
  function canvasPointerMove(e:ReactPointerEvent<HTMLDivElement>){
    const drag=dragRef.current;
    if(!drag||drag.pointerId!==e.pointerId)return;
    e.preventDefault();
    if(drag.kind==="canvas"){
      setViewport(v=>({...v,x:drag.baseX+(e.clientX-drag.startX),y:drag.baseY+(e.clientY-drag.startY)}));
    }else{
      const dx=(e.clientX-drag.startX)/viewport.zoom;
      const dy=(e.clientY-drag.startY)/viewport.zoom;
      setPositions(p=>({...p,[drag.key]:{x:drag.base.x+dx,y:drag.base.y+dy}}));
    }
  }
  function canvasPointerUp(e:ReactPointerEvent<HTMLDivElement>){
    const drag=dragRef.current;
    if(!drag||drag.pointerId!==e.pointerId)return;
    try{e.currentTarget.releasePointerCapture?.(e.pointerId)}catch{}
    dragRef.current=null;
    setDragKind(null);
  }
  function addFiles(kind:keyof ImagesState,files:FileList|File[]){
    const valid=Array.from(files).filter(f=>f.type.startsWith("image/")).slice(0,5);
    const urls=valid.map(f=>URL.createObjectURL(f));
    setImages(s=>({...s,[kind]:[...s[kind],...urls].slice(0,5)}));
  }
  function runMock(){
    if(!images.product.length||running)return;
    const initial:Record<string,SlotStatus>={};
    enabledSlots.forEach(k=>initial[k]="running");
    setSlotStatus(initial);
    window.setTimeout(()=>{
      const done:Record<string,SlotStatus>={};
      enabledSlots.forEach(k=>done[k]="succeeded");
      setSlotStatus(done);
    },1100);
  }
  function flash(text:string){setNotice(text);window.setTimeout(()=>setNotice(""),1400)}
  function redoSlot(key:string){
    setSlotStatus(v=>({...v,[key]:"running"}));
    window.setTimeout(()=>{setSlotStatus(v=>({...v,[key]:"succeeded"}));flash("该槽位已重新生成示例结果")},850);
  }
  function downloadMock(key:string,title:string){
    const svg='<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#eef2ff"/><stop offset="1" stop-color="#ddd6fe"/></linearGradient></defs><rect width="900" height="1200" fill="url(#g)"/><rect x="90" y="130" width="720" height="820" rx="40" fill="white" opacity=".9"/><text x="450" y="535" text-anchor="middle" font-family="Arial" font-size="54" fill="#5b4bff">OzonG ERP</text><text x="450" y="615" text-anchor="middle" font-family="Arial" font-size="36" fill="#334155">'+title+'</text><text x="450" y="1060" text-anchor="middle" font-family="Arial" font-size="24" fill="#94a3b8">Demo generated result</text></svg>';
    const url=URL.createObjectURL(new Blob([svg],{type:"image/svg+xml"}));const a=document.createElement("a");a.href=url;a.download="ozong-"+key+"-demo.svg";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);flash("示例结果已下载");
  }
  function downloadAll(){SLOT_META.filter(m=>enabledSlots.includes(m[0])).forEach((m,i)=>window.setTimeout(()=>downloadMock(m[0],m[2]),i*80))}
  function newConversation(){
    setImages({product:[],style:[]});setPrompt("补充商品事实、核心卖点或希望强调的场景…");setSlotStatus({});
  }
  useEffect(()=>{const timer=window.setTimeout(()=>fitPositions(positions),30);return()=>window.clearTimeout(timer)},[]);

  function handleUpload(kind:keyof ImagesState){
    const input=document.createElement("input");input.type="file";input.accept="image/jpeg,image/jpg,image/png,image/webp";input.multiple=true;
    input.onchange=()=>input.files&&addFiles(kind,input.files);input.click();
  }

  const edges=useMemo(()=>{
    const centerY=(k:NodeKey)=>positions[k].y+SIZE[k].h/2;
    const rightX=(k:NodeKey)=>positions[k].x+SIZE[k].w;
    const leftX=(k:NodeKey)=>positions[k].x;
    const path=(s:NodeKey,t:NodeKey,offset=0)=>{const x1=rightX(s),y1=centerY(s)+offset,x2=leftX(t),y2=centerY(t);const mx=(x1+x2)/2;return`M${x1} ${y1} C${mx} ${y1},${mx} ${y2},${x2} ${y2}`};
    return[
      ["product","plan","#3B82F6",-35],["style","plan","#EC4899",0],["brief","plan","#F59E0B",35],
      ...SLOT_META.map(m=>["plan",m[0],"#B8AEF8",0]),
    ].map((e:any)=>({d:path(e[0],e[1],e[3]),color:e[2]}));
  },[positions]);

  function InputNode({kind,title,accent,note,optional}:{kind:"product"|"style";title:string;accent:string;note:string;optional?:boolean}){
    const list=images[kind];
    return <article className="demo-flow-node input-node" style={{left:positions[kind].x,top:positions[kind].y,width:SIZE[kind].w}} onPointerDown={e=>nodePointerDown(kind,e)}>
      <span className="demo-port right" style={{color:accent}}></span>
      <header className="demo-node-header"><span style={{color:accent}}>{kind==="product"?"▣":"✦"}</span><b>{title}</b><em>{list.length} / 5</em></header>
      <div className="demo-node-body">
        {!list.length?<button className={kind==="product"?"demo-upload product":"demo-upload style"} onClick={()=>handleUpload(kind)} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();addFiles(kind,e.dataTransfer.files)}}>
          <strong>＋</strong><b>{kind==="product"?"上传商品源图":"上传风格参考"}</b><small>{optional?"可选 · 最多5张":"最多5张 · JPG PNG WEBP · 10MB"}</small>
        </button>:<div className="demo-thumb-grid">{list.map((url,i)=><span className="demo-thumb" key={url}><img src={url}/><button onClick={()=>setImages(s=>({...s,[kind]:s[kind].filter((_,idx)=>idx!==i)}))}>×</button>{kind==="product"&&i===0&&<em>主参考</em>}</span>)}{list.length<5&&<button className="demo-thumb-add" onClick={()=>handleUpload(kind)}>+</button>}</div>}
        <div className={kind==="product"?"demo-note product":"demo-note style"}>{note}</div>
      </div>
    </article>
  }

  return <div className="demo-ai-workflow-page">
    <div className="demo-wf-toolbar">
      <div className="demo-tb-left"><span className="demo-tb-title">OzonG AI Workflow</span><span className="demo-tb-sub">统一生图</span><span className="demo-tb-save">● {running?"生成中":"已保存"}</span></div>
      <div className="demo-tb-mid">
        <button onClick={newConversation}>＋ 新建</button><button onClick={()=>setHistoryOpen(true)}>历史记录</button><button onClick={resetLayout}>自动布局</button><i></i>
        <button className="ico" onClick={()=>zoomBy(-.1)}>−</button><span className="zoom">{Math.round(viewport.zoom*100)}%</span><button className="ico" onClick={()=>zoomBy(.1)}>＋</button><button onClick={()=>fitView()}>适应画布</button>
      </div>
      <div className="demo-tb-right">
        <div className="demo-kind-toggle"><button className={generationKind==="main"?"active":""} disabled={running} onClick={()=>setGenerationKind("main")}>单主图</button><button className={generationKind==="set"?"active":""} disabled={running} onClick={()=>setGenerationKind("set")}>8图套图</button></div>
        <span>生图点数：<b>956</b></span><span>预计消耗：{estimate}点</span><button disabled={!completed} onClick={downloadAll}>↓ 下载全部</button>
        {!running?<button className="run" disabled={!images.product.length} onClick={runMock}>▶ 运行工作流</button>:<button className="cancel" onClick={()=>setSlotStatus({})}>■ 取消任务</button>}
      </div>
    </div>
    <DemoToast text={notice}/><div className={`demo-ai-canvas ${dragKind?"is-dragging":""}`} ref={canvasRef} onPointerDown={canvasPointerDown} onPointerMove={canvasPointerMove} onPointerUp={canvasPointerUp} onPointerCancel={canvasPointerUp} onWheel={onWheel} style={{backgroundSize:`${22*viewport.zoom}px ${22*viewport.zoom}px`,backgroundPosition:`${viewport.x}px ${viewport.y}px`}}>
      <div className="demo-world" style={{transform:`translate(${viewport.x}px,${viewport.y}px) scale(${viewport.zoom})`}}>
        <svg className="demo-edge-layer" width="1900" height="1200">{edges.map((e,i)=><path key={i} d={e.d} stroke={e.color}/>)}</svg>
        <InputNode kind="product" title="商品源图" accent="#3b82f6" note="🔒 商品身份来源 · 决定商品本体、包装、Logo 与真实文字"/>
        <InputNode kind="style" title="风格参考" accent="#ec4899" note="仅控制：构图 / 灯光 / 配色 / 版式 · 不会改变商品本体" optional/>
        <article className="demo-flow-node brief-node" style={{left:positions.brief.x,top:positions.brief.y,width:SIZE.brief.w}} onPointerDown={e=>nodePointerDown("brief",e)}>
          <span className="demo-port right" style={{color:"#f59e0b"}}></span><header className="demo-node-header"><span style={{color:"#f59e0b"}}>✎</span><b>创作要求</b></header>
          <div className="demo-node-body"><label>创作要求</label><textarea value={prompt} onChange={e=>setPrompt(e.target.value)}/><div className="demo-brief-row"><span><label>输出语言</label><b>俄语</b></span><span><label>比例</label><b>3:4</b></span></div></div>
        </article>
        <article className="demo-flow-node plan-node" style={{left:positions.plan.x,top:positions.plan.y,width:SIZE.plan.w}} onPointerDown={e=>nodePointerDown("plan",e)} onDoubleClick={()=>setPlanOpen(true)}>
          <span className="demo-port left p1" style={{color:"#3b82f6"}}></span><span className="demo-port left p2" style={{color:"#ec4899"}}></span><span className="demo-port left p3" style={{color:"#f59e0b"}}></span><span className="demo-port right" style={{color:"#8b5cf6"}}></span>
          <header className="demo-node-header plan"><span>✦</span><b>PromptPlan v3</b><em>统一规划引擎</em></header><div className="demo-node-body"><div className="demo-plan-grid"><span><small>模式</small><b>{generationKind==="main"?"单主图":"8图套图"}</b></span><span><small>任务</small><b>{generationKind==="main"?1:8} 个</b></span><span><small>商品保真</small><b className="locked">已锁定 ✓</b></span></div><button className="plan-detail" onClick={()=>setPlanOpen(true)}>查看计划详情 →</button></div>
        </article>
        {SLOT_META.map(([key,order,title,accent,purpose])=>{
          const enabled=key==="main"||generationKind==="set";const status=slotStatus[key]||"idle";
          return <article className={`demo-flow-node slot-node ${enabled?"":"disabled"}`} key={key} style={{left:positions[key as NodeKey].x,top:positions[key as NodeKey].y,width:SIZE[key as NodeKey].w}} onPointerDown={e=>nodePointerDown(key as NodeKey,e)}>
            <span className="demo-port left center" style={{color:accent}}></span><header className="demo-node-header"><span style={{color:accent}}>{order}</span><b>{title}</b><i style={{background:!enabled?"#e2e8f0":status==="running"?"#8b5cf6":status==="succeeded"?"#22c55e":"#cbd5e1"}}></i></header>
            <div className="demo-node-body"><p>{purpose}</p><div className="demo-slot-stage">{!enabled?"本次单主图模式不生成此槽位":status==="running"?"◌ 生成中…":status==="succeeded"?"✓ 示例结果已生成":"○ 等待工作流运行"}</div>{status==="succeeded"&&<div className="demo-slot-actions"><button onClick={()=>downloadMock(key,title)}>下载</button><button onClick={()=>redoSlot(key)}>重做</button></div>}<footer>{!enabled?"本模式不扣点":status==="running"?"冻结 3 点":status==="succeeded"?"已消耗 3 点":"预计 3 点"}</footer></div>
          </article>
        })}
      </div>
      <div className="demo-canvas-hint">拖动画布 · 拖动节点 · 滚轮缩放</div>
    </div>
    {historyOpen&&<div className="demo-drawer"><header><b>历史记录</b><button onClick={()=>setHistoryOpen(false)}>×</button></header><div className="demo-drawer-body"><article><b>今天 14:26 · 8图套图</b><span>已完成 · 24 点</span></article><article><b>昨天 19:08 · 单主图</b><span>已完成 · 3 点</span></article></div></div>}
    {planOpen&&<div className="demo-drawer"><header><b>PromptPlan v3 计划详情</b><button onClick={()=>setPlanOpen(false)}>×</button></header><div className="demo-drawer-body"><h4>规划引擎</h4><p>模式 <b>{generationKind==="main"?"Ozon 单主图":"Ozon 8图套图"}</b></p><p>任务 <b>{generationKind==="main"?1:8} 个</b></p><p>商品保真 <b className="green">已锁定 ✓</b></p></div></div>}
  </div>
}
