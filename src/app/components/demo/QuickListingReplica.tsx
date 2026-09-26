import { useEffect, useMemo, useRef, useState } from "react";
import type { CollectionItem } from "./CollectionReplica";
import "./quick-listing-replica.css";

type ListingRow={
  id:number;
  sku:string;
  title:string;
  relation:string;
  icon:string;
  sourcePrice:number;
  selected:boolean;
  offer:string;
  price:string;
  oldPrice:string;
};

const STORE_OPTIONS=[
  {id:1,name:"星桥家居",currency:"CNY",warehouses:["星桥家居默认仓","华东备用仓"]},
  {id:2,name:"远航百货",currency:"CNY",warehouses:["远航百货默认仓","义乌仓"]},
  {id:3,name:"北辰数码",currency:"CNY",warehouses:["北辰数码默认仓"]},
];

type QuickSelectOption={value:string;label:string;disabled?:boolean};
function QuickListingSelect({
  value,
  options,
  onChange,
  disabled=false,
  placeholder="请选择",
  className="",
}:{
  value:string;
  options:QuickSelectOption[];
  onChange:(value:string)=>void;
  disabled?:boolean;
  placeholder?:string;
  className?:string;
}){
  const [open,setOpen]=useState(false);
  const rootRef=useRef<HTMLDivElement|null>(null);
  useEffect(()=>{
    const onPointer=(event:MouseEvent)=>{
      if(rootRef.current&&!rootRef.current.contains(event.target as Node))setOpen(false);
    };
    document.addEventListener("mousedown",onPointer);
    return()=>document.removeEventListener("mousedown",onPointer);
  },[]);
  const selected=options.find(option=>option.value===value);
  const choose=(option:QuickSelectOption)=>{
    if(option.disabled)return;
    onChange(option.value);
    setOpen(false);
  };
  return <div ref={rootRef} className={`quick-select-source ${open?"open":""} ${disabled?"disabled":""} ${className}`}>
    <button type="button" className="quick-select-trigger-source" disabled={disabled} onClick={()=>!disabled&&setOpen(v=>!v)} aria-haspopup="listbox" aria-expanded={open}>
      <span className={selected?"":"placeholder"}>{selected?.label||placeholder}</span>
      <i className="quick-select-arrow-source">⌄</i>
    </button>
    {open&&!disabled&&<div className="quick-select-menu-source" role="listbox">
      {options.map(option=><button
        type="button"
        key={option.value}
        className={(option.value===value?"selected ":"")+(option.disabled?"disabled":"")}
        disabled={option.disabled}
        role="option"
        aria-selected={option.value===value}
        onClick={()=>choose(option)}
      ><span>{option.label}</span>{option.value===value&&<b>✓</b>}</button>)}
    </div>}
  </div>;
}

function buildRows(item:CollectionItem):ListingRow[]{
  const source=Number(item.price.replace(/[^\d,.]/g,"").replace(",", "."))||0;
  const labels=["当前商品","颜色：白色","规格：升级款","组合：2件装"];
  return labels.map((relation,index)=>({
    id:index+1,
    sku:index===0?item.sku:String(Number(item.sku)+index),
    title:item.title,
    relation,
    icon:item.icon,
    sourcePrice:Number((source+index*7.4).toFixed(2)),
    selected:index===0,
    offer:`ozg-${item.sku.slice(-6)}-${String(index+1).padStart(2,"0")}`,
    price:"",
    oldPrice:"",
  }));
}

export function QuickListingReplica({
  item,
  onClose,
  onEdit,
  onSubmitted,
}:{
  item:CollectionItem;
  onClose:()=>void;
  onEdit:(item:CollectionItem)=>void;
  onSubmitted:()=>void;
}){
  const [tab,setTab]=useState<"stores"|"groups">("stores");
  const [storeIds,setStoreIds]=useState<number[]>([1]);
  const [warehouses,setWarehouses]=useState<Record<number,string>>({1:"星桥家居默认仓"});
  const [stocks,setStocks]=useState<Record<number,number>>({1:100,2:100,3:100});
  const [brand,setBrand]=useState("none");
  const [imageOrder,setImageOrder]=useState("source");
  const [watermark,setWatermark]=useState("");
  const [rows,setRows]=useState<ListingRow[]>(()=>buildRows(item));
  const [batchPrice,setBatchPrice]=useState("");
  const [batchOldPrice,setBatchOldPrice]=useState("");
  const [multiplier,setMultiplier]=useState("");
  const [result,setResult]=useState<{text:string;tone:"error"|"loading"|"success"}|null>(null);
  const [submitting,setSubmitting]=useState(false);

  const selectedRows=useMemo(()=>rows.filter(row=>row.selected),[rows]);

  const toggleStore=(id:number)=>{
    setStoreIds(current=>current.includes(id)?current.filter(x=>x!==id):[...current,id]);
    if(!warehouses[id]){
      const store=STORE_OPTIONS.find(s=>s.id===id);
      if(store?.warehouses[0])setWarehouses(v=>({...v,[id]:store.warehouses[0]}));
    }
  };
  const patchRow=(id:number,patch:Partial<ListingRow>)=>setRows(current=>current.map(row=>row.id===id?{...row,...patch}:row));
  const applyPrice=(kind:"price"|"old")=>{
    const value=Number(kind==="price"?batchPrice:batchOldPrice);
    if(!(value>0)){setResult({text:"批量价格必须大于 0",tone:"error"});return}
    setRows(current=>current.map(row=>row.selected?{...row,[kind==="price"?"price":"oldPrice"]:value.toFixed(1)}:row));
    setResult(null);
  };
  const applyMultiplier=()=>{
    const value=Number(multiplier);
    if(!(value>0)){setResult({text:"价格倍数必须大于 0",tone:"error"});return}
    setRows(current=>current.map(row=>row.selected?{...row,price:(row.sourcePrice*value).toFixed(1),oldPrice:(row.sourcePrice*value*2).toFixed(1)}:row));
    setResult(null);
  };
  const submit=()=>{
    if(!storeIds.length){setResult({text:"请至少选择一个已配置 Ozon API 的上架店铺",tone:"error"});return}
    if(storeIds.some(id=>!warehouses[id])){setResult({text:"每个上架店铺都必须选择对应的 Ozon 仓库",tone:"error"});return}
    if(!selectedRows.length){setResult({text:"请至少选择一个 SKU",tone:"error"});return}
    if(selectedRows.some(row=>!(Number(row.price)>0))){setResult({text:"已勾选 SKU 需要填写售价",tone:"error"});return}
    if(selectedRows.some(row=>Number(row.oldPrice)>0&&Number(row.oldPrice)<=Number(row.price))){
      setResult({text:"划线价必须大于实际售价，或留空",tone:"error"});return;
    }
    setSubmitting(true);
    setResult({text:"正在创建后台上架任务…",tone:"loading"});
    window.setTimeout(()=>{
      setResult({text:"上架任务已创建",tone:"success"});
      window.setTimeout(()=>{onSubmitted();onClose()},650);
    },700);
  };

  return <div className="quick-listing-backdrop-source">
    <section className="quick-listing-modal-source" role="dialog" aria-modal="true" aria-label="一键上架到OZON">
      <header><h2>一键上架到 OZON</h2><button className="quick-listing-close-source" onClick={onClose}>×</button></header>
      <div className="quick-listing-layout-source">
        <aside className="quick-listing-stores-source">
          <div className="quick-listing-tabs-source">
            <button className={tab==="stores"?"active":""} onClick={()=>setTab("stores")}>选择店铺</button>
            <button className={tab==="groups"?"active":""} onClick={()=>setTab("groups")}>店铺分组</button>
          </div>
          <div className="quick-listing-store-title-source"><span>{tab==="stores"?"目标店铺":"店铺分组"}</span><button onClick={()=>setResult({text:"Ozon 仓库已刷新。",tone:"success"})}>刷新仓库</button></div>
          {tab==="stores"?<div className="quick-listing-store-list-source">
            {STORE_OPTIONS.map(store=>{
              const selected=storeIds.includes(store.id);
              return <div key={store.id} className={"quick-listing-store-card-source "+(selected?"selected":"")}>
                <label className="quick-listing-store-head-source"><input type="checkbox" checked={selected} onChange={()=>toggleStore(store.id)}/><span><strong>{store.name}</strong><small>Ozon API 已配置 · {store.currency}</small></span></label>
                <div className="quick-listing-store-config-source">
                  <QuickListingSelect
                    disabled={!selected}
                    value={warehouses[store.id]||""}
                    placeholder="选择仓库"
                    options={[{value:"",label:"选择仓库"},...store.warehouses.map(w=>({value:w,label:w}))]}
                    onChange={value=>setWarehouses(v=>({...v,[store.id]:value}))}
                  />
                  <label><span>库存</span><input disabled={!selected} type="number" min="0" value={stocks[store.id]||0} onChange={e=>setStocks(v=>({...v,[store.id]:Number(e.target.value)}))}/></label>
                </div>
              </div>
            })}
          </div>:<div className="quick-listing-group-list-source">
            <label><input type="checkbox" checked={storeIds.length===3} onChange={e=>setStoreIds(e.target.checked?[1,2,3]:[])}/><span><strong>全部演示店铺</strong><small>3 家店铺 · 3 家 API 可用</small></span></label>
            <label><input type="checkbox" checked={storeIds.includes(1)&&storeIds.includes(2)} onChange={e=>setStoreIds(e.target.checked?[...new Set([...storeIds,1,2])]:storeIds.filter(id=>![1,2].includes(id)))}/><span><strong>日用百货组</strong><small>2 家店铺 · 2 家 API 可用</small></span></label>
          </div>}
        </aside>

        <main className="quick-listing-content-source">
          <div className="quick-listing-settings-source">
            <label><span>品牌</span><QuickListingSelect value={brand} options={[{value:"none",label:"无品牌"},{value:"source",label:"沿用当前品牌"}]} onChange={setBrand}/></label>
            <label><span>图片顺序</span><QuickListingSelect value={imageOrder} options={[{value:"source",label:"按来源顺序"},{value:"reverse",label:"倒序"}]} onChange={setImageOrder}/></label>
            <label><span>水印</span><QuickListingSelect value={watermark} options={[{value:"",label:"不使用"},{value:"wm1",label:"OzonG 默认水印"}]} onChange={setWatermark}/></label>
            <label><span>上架币种</span><QuickListingSelect disabled value="cny" options={[{value:"cny",label:"人民币 CNY"}]} onChange={()=>{}}/></label>
          </div>

          <div className="quick-listing-batch-source">
            <span>批量设置</span>
            <div className="quick-money-source compact"><span>¥</span><input value={batchPrice} onChange={e=>setBatchPrice(e.target.value)} placeholder="售价"/></div><button onClick={()=>applyPrice("price")}>应用售价</button>
            <div className="quick-money-source compact"><span>¥</span><input value={batchOldPrice} onChange={e=>setBatchOldPrice(e.target.value)} placeholder="划线价"/></div><button onClick={()=>applyPrice("old")}>应用划线价</button>
            <i></i><span>约合人民币 ×</span>
            <div className="quick-ratio-source"><input value={multiplier} onChange={e=>setMultiplier(e.target.value)} placeholder="倍数"/></div><button onClick={applyMultiplier}>应用倍数</button>
          </div>

          <div className="quick-listing-table-wrap-source">
            <table>
              <thead><tr><th><input type="checkbox" checked={rows.every(r=>r.selected)} onChange={e=>setRows(v=>v.map(r=>({...r,selected:e.target.checked})))}/></th><th>序号</th><th>主图</th><th>商品 / 关联属性</th><th>SKU</th><th>货号</th><th>原售价</th><th>我的售价</th><th>我的划线价</th></tr></thead>
              <tbody>{rows.map((row,index)=><tr key={row.id}>
                <td><input type="checkbox" checked={row.selected} onChange={e=>patchRow(row.id,{selected:e.target.checked})}/></td>
                <td className="seq">{index+1}</td>
                <td><div className="quick-thumb-source">{row.icon}</div></td>
                <td className="quick-relation-source"><strong>{row.title}</strong><span>{row.relation}</span></td>
                <td className="quick-mono-source">{row.sku}</td>
                <td><input className="quick-input-source offer" value={row.offer} onChange={e=>patchRow(row.id,{offer:e.target.value})}/></td>
                <td className="quick-price-source"><strong>{index===0?item.price:`${row.sourcePrice.toFixed(2)} ¥`}</strong></td>
                <td><div className="quick-money-source"><span>¥</span><input value={row.price} onChange={e=>patchRow(row.id,{price:e.target.value,oldPrice:row.oldPrice||(Number(e.target.value)>0?(Number(e.target.value)*2).toFixed(1):"")})} placeholder="售价"/></div></td>
                <td><div className="quick-money-source"><span>¥</span><input value={row.oldPrice} onChange={e=>patchRow(row.id,{oldPrice:e.target.value})} placeholder="默认售价 × 2"/></div></td>
              </tr>)}</tbody>
            </table>
          </div>

          <div className="quick-listing-pagination-source"><button disabled>上一页</button><span>第 1 / 1 页</span><button disabled>下一页</button></div>
          <div className="quick-listing-footer-fields-source">
            <label>来源链接 <input value={`https://www.ozon.ru/product/${item.sku}/`} readOnly/></label>
            <label>货源备注 <input placeholder="可选"/></label>
          </div>
        </main>
      </div>
      <footer><div><button className="secondary" onClick={()=>onEdit(item)}>转编辑上架</button><button className="primary" disabled={submitting} onClick={submit}>{submitting?"正在提交…":"一键上架到 OZON"}</button></div></footer>
      {result&&<div className={"quick-listing-result-source "+result.tone}>{result.text}</div>}
    </section>
  </div>;
}
