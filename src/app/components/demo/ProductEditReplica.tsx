import { useState } from "react";
import { CheckCircleOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import type { Product } from "./ProductsReplica";
import "./product-edit-replica.css";

const DEFAULT_TAGS=["#органайзер","#для_дома","#удобное_хранение","#товары_для_дома","#порядок"];

export function ProductEditReplica({
  product,
  onCancel,
  onSave,
}:{
  product:Product|null;
  onCancel:()=>void;
  onSave:(patch:Partial<Product>)=>void;
}){
  const [title,setTitle]=useState(product?.name||"");
  const [brand,setBrand]=useState("NO NAME");
  const [model,setModel]=useState(product?.offer||"");
  const [weight,setWeight]=useState(product?parseInt(product.weight)||0:0);
  const [depth,setDepth]=useState(340);
  const [width,setWidth]=useState(270);
  const [height,setHeight]=useState(50);
  const [description,setDescription]=useState("");
  const [tags,setTags]=useState(DEFAULT_TAGS);
  const [tagDraft,setTagDraft]=useState("");
  const [price,setPrice]=useState(product?.price||0);
  const [oldPrice,setOldPrice]=useState(product?.old||0);
  const [stock,setStock]=useState(product?.stock||0);
  const [saved,setSaved]=useState(false);
  const [rating,setRating]=useState(69.5);
  const [openGroup,setOpenGroup]=useState<number|null>(null);

  const ratingGroups=[
    {name:"媒体",score:27,max:45,tone:"amber"},
    {name:"文本描述",score:12.5,max:25,tone:"amber"},
    {name:"其他属性",score:30,max:30,tone:"green"},
  ];
  const next=Math.max(0,80-rating);

  if(!product){
    return <div className="ai-edit-replica-source empty"><div className="ai-edit-empty-source"><b>未找到商品资料</b><button onClick={onCancel}>返回商品列表</button></div></div>;
  }

  const flash=()=>{setSaved(true);window.setTimeout(()=>setSaved(false),1200)};
  const generateTitle=()=>setTitle(title.includes("Ozon")?title:`${title} Ozon`);
  const generateModel=()=>setModel(`OZG-${product.sku.slice(-6)}`);
  const generateDescription=()=>setDescription("Практичный и удобный товар для повседневного использования. Продуманная конструкция, аккуратная обработка и универсальный дизайн делают его подходящим для дома и повседневных задач.");
  const generateTags=()=>setTags(["#товары_для_дома","#удобство","#организация","#практичный_товар","#ozon"]);
  const generateAll=()=>{generateTitle();generateDescription();generateTags();flash()};
  const submit=()=>{
    onSave({
      name:title.trim()||product.name,
      price:Number(price)||product.price,
      old:Number(oldPrice)||0,
      stock:Number(stock)||0,
      weight:`${Number(weight)||0}g`,
      updated:"2026-09-25 15:31:00",
    });
  };
  const addTag=()=>{
    const value=tagDraft.trim();
    if(!value)return;
    const normalized=value.startsWith("#")?value:"#"+value;
    if(!tags.includes(normalized))setTags(v=>[...v,normalized]);
    setTagDraft("");
  };

  return <div className="ai-edit-replica-source">
    {saved&&<div className="ai-edit-toast-source"><CheckCircleOutlined/> 草稿已保存</div>}
    <div className="ai-edit-body-source">
      <div className="ai-edit-columns-source">
        <aside className="ai-edit-left-source">
          <section className="ai-info-card-source">
            <div className="ai-info-image-source"><span>{product.icon}</span></div>
            <div className="ai-info-detail-source">
              <div><span>货号</span><b>{product.offer}</b></div>
              <div><span>SKU</span><b>{product.sku}</b></div>
              <div><span>店铺</span><b>{product.shop}</b></div>
              <div><span>价格</span><b>¥{product.price.toFixed(2)}</b></div>
            </div>
          </section>
          {product.status==="错误"&&<section className="ai-error-card-source">
            <header><span>错误诊断</span><b>1项</b></header>
            <div><strong>商品属性需要修正</strong><p>部分 Ozon 必填属性不完整，请补全后重新提交。</p><small>建议检查品牌、型号名称、包装重量与类目必填属性。</small></div>
          </section>}
        </aside>

        <main className="ai-edit-center-source">
          <section className="ai-form-card-source">
            <h3>📦 商品信息</h3>
            <div className="ai-form-grid-source">
              <label className="full">商品标题 <em>*</em>
                <div className="ai-field-actions-source"><input value={title} onChange={e=>setTitle(e.target.value)}/><button className="plus">＋</button><button className="ai" onClick={generateTitle}>✦</button></div>
              </label>
              <label>品牌 <em>*</em>
                <div className="ai-field-actions-source"><input value={brand} onChange={e=>setBrand(e.target.value)} placeholder="输入品牌名，点搜索"/><button className="search" onClick={()=>setBrand(brand.trim()||"NO NAME")}><SearchOutlined/></button><button className="plus">＋</button></div>
              </label>
              <label>型号名称 <em>*</em>
                <div className="ai-field-actions-source"><input value={model} onChange={e=>setModel(e.target.value)} placeholder="型号名称"/><button className="plus">＋</button><button className="ai" onClick={generateModel}>✦</button></div>
              </label>
              <label>含包装重量（克） <span className="unit-warning">注意单位是克(g)</span>
                <div className="ai-field-actions-source"><input type="number" value={weight} onChange={e=>setWeight(Number(e.target.value))}/><button className="plus">＋</button></div>
              </label>
              <label>包装尺寸（mm） <span className="unit-warning">注意单位是毫米(mm)</span>
                <div className="ai-dimensions-source">
                  <div><input type="number" value={depth} onChange={e=>setDepth(Number(e.target.value))}/><span>长</span><button>＋</button></div><i>×</i>
                  <div><input type="number" value={width} onChange={e=>setWidth(Number(e.target.value))}/><span>宽</span><button>＋</button></div><i>×</i>
                  <div><input type="number" value={height} onChange={e=>setHeight(Number(e.target.value))}/><span>高</span><button>＋</button></div>
                </div>
              </label>
            </div>
          </section>

          <section className="ai-form-card-source">
            <h3>📝 产品描述</h3>
            <div className="ai-description-grid-source">
              <label>简介/描述
                <div className="ai-textarea-source"><textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="商品描述"/><button className="plus">＋</button><button className="ai" onClick={generateDescription}>✦</button></div>
              </label>
              <label>#主题标签
                <div className="ai-tags-source">
                  <div className="ai-tags-scroll-source">{tags.map(tag=><span key={tag}>{tag}<button onClick={()=>setTags(v=>v.filter(x=>x!==tag))}>×</button></span>)}
                    <input value={tagDraft} onChange={e=>setTagDraft(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();addTag()}}} onBlur={addTag} placeholder="+ 添加标签"/>
                  </div>
                  <button className="plus">＋</button><button className="ai" onClick={generateTags}>✦</button>
                </div>
              </label>
            </div>
          </section>

          <section className="ai-form-card-source ai-variant-card-source">
            <h3>📦 变体设置</h3>
            <div className="ai-variant-row-source head"><span>上架</span><span>SKU 名称</span><span>货号</span><span>售价</span><span>划线价</span><span>库存</span></div>
            <div className="ai-variant-row-source"><span><input type="checkbox" defaultChecked/></span><span>{title}</span><span>{product.offer}</span><span><input type="number" value={price} onChange={e=>setPrice(Number(e.target.value))}/></span><span><input type="number" value={oldPrice} onChange={e=>setOldPrice(Number(e.target.value))}/></span><span><input type="number" value={stock} onChange={e=>setStock(Number(e.target.value))}/></span></div>
          </section>
        </main>

        <aside className="ai-edit-right-source">
          <section className="ai-rating-card-source">
            <header><span>内容评级</span><div><b>基础</b><button title="刷新评分" onClick={()=>{setRating(v=>v===69.5?70:v);flash()}}><ReloadOutlined/></button></div></header>
            <div className="ai-rating-gauge-source">
              <svg width="140" height="100" viewBox="0 0 140 100" aria-label={`内容评级 ${rating.toFixed(1)}`}>
                <defs><linearGradient id="rating-gradient-demo" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#ef4444"/><stop offset="30%" stopColor="#f59e0b"/><stop offset="70%" stopColor="#10b981"/><stop offset="100%" stopColor="#6c5ce7"/></linearGradient></defs>
                <path d="M 20 80 A 50 50 0 1 1 120 80" fill="none" stroke="#f3f4f6" strokeWidth="12" strokeLinecap="round"/>
                <path d="M 20 80 A 50 50 0 1 1 120 80" fill="none" stroke="url(#rating-gradient-demo)" strokeWidth="12" strokeLinecap="round" strokeDasharray="157" strokeDashoffset={157-157*Math.min(rating,100)/100}/>
                <line x1="70" y1="80" x2={70+40*Math.cos(Math.PI*(1-rating/100))} y2={80-40*Math.sin(Math.PI*(1-rating/100))} stroke="#1f2937" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="70" cy="80" r="4" fill="#1f2937"/>
              </svg>
              <strong>{rating.toFixed(1)}</strong>
            </div>
            <div className="ai-rating-next-source">{next.toFixed(1)}分到高等级</div>
            <div className="ai-rating-groups-source">
              {ratingGroups.map((group,index)=><div className="ai-rating-group-source" key={group.name}>
                <button onClick={()=>setOpenGroup(openGroup===index?null:index)}><span>{group.name}</span><strong>{group.score.toFixed(group.score%1?1:0)}<small>从{group.max}分</small></strong><i>{openGroup===index?"▲":"▶"}</i></button>
                <div><span className={group.tone} style={{width:`${group.score/group.max*100}%`}}></span></div>
                {openGroup===index&&<p>{group.name==="媒体"?"补充高质量主图、视频与媒体信息可继续提升评分。":group.name==="文本描述"?"完善简介与主题标签可继续提升评分。":"当前主要属性完整度较高。"}</p>}
              </div>)}
            </div>
            <div className="ai-rating-average-source">该类目商品的平均内容评级：<strong>66.2</strong>分</div>
          </section>
        </aside>
      </div>
      <div className="ai-edit-bottom-space-source"></div>
    </div>

    <div className="ai-edit-bottom-source">
      <button className="ai-edit-generate-source" onClick={generateAll}>✦ AI 一键生成标题、#主题标签、描述等信息</button>
      <div><button className="outline" onClick={onCancel}>取消并关闭</button><button className="outline purple" onClick={flash}>保存草稿</button><button className="primary" onClick={submit}>确定编辑</button></div>
    </div>
  </div>;
}
