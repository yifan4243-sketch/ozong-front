import { useMemo, useState } from "react";
import { ArrowLeftOutlined, CheckCircleOutlined, PictureOutlined, RobotOutlined, SaveOutlined } from "@ant-design/icons";
import type { Product } from "./ProductsReplica";
import "./product-edit-replica.css";

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
  const [model,setModel]=useState(product?."offer"||"");
  const [weight,setWeight]=useState(product?parseInt(product.weight)||0:0);
  const [length,setLength]=useState(240);
  const [width,setWidth]=useState(180);
  const [height,setHeight]=useState(90);
  const [price,setPrice]=useState(product?.price||0);
  const [oldPrice,setOldPrice]=useState(product?.old||0);
  const [description,setDescription]=useState("Компактный и практичный товар для ежедневного использования. Подходит для дома, офиса и поездок.");
  const [saved,setSaved]=useState(false);

  const completion=useMemo(()=>{
    const fields=[title,brand,model,weight,length,width,height,price,description];
    return Math.round(fields.filter(Boolean).length/fields.length*100);
  },[title,brand,model,weight,length,width,height,price,description]);

  if(!product){
    return <div className="product-edit-replica empty">
      <div className="product-edit-empty-card">
        <b>未找到商品</b>
        <button onClick={onCancel}>返回商品列表</button>
      </div>
    </div>;
  }

  const submit=()=>{
    onSave({
      name:title.trim()||product.name,
      price:Number(price)||product.price,
      old:Number(oldPrice)||0,
      weight:`${Number(weight)||0}g`,
      updated:"2026-09-25 15:31:00",
    });
    setSaved(true);
    setTimeout(()=>setSaved(false),1200);
  };

  return <div className="product-edit-replica">
    {saved&&<div className="product-edit-save-toast"><CheckCircleOutlined/> 商品资料已保存</div>}
    <div className="product-edit-body-source">
      <aside className="product-edit-left-source">
        <button className="product-edit-back-source" onClick={onCancel}><ArrowLeftOutlined/> 返回商品列表</button>
        <section className="product-edit-info-card-source">
          <div className="product-edit-image-source"><span>{product.icon}</span></div>
          <div className="product-edit-info-row-source"><span>货号</span><b>{product.offer}</b></div>
          <div className="product-edit-info-row-source"><span>SKU</span><b>{product.sku}</b></div>
          <div className="product-edit-info-row-source"><span>店铺</span><b>{product.shop}</b></div>
          <div className="product-edit-info-row-source"><span>价格</span><b>¥{product.price.toFixed(2)}</b></div>
        </section>
        {product.status==="错误"&&<section className="product-edit-error-source">
          <header><b>错误诊断</b><span>1项</span></header>
          <strong>商品属性校验失败</strong>
          <p>部分必填属性缺失，请补全后再次提交。</p>
          <small>建议：检查品牌、型号、包装尺寸和类目必填属性。</small>
        </section>}
      </aside>

      <main className="product-edit-center-source">
        <section className="product-edit-form-card-source">
          <h3>📦 商品信息</h3>
          <div className="product-edit-grid-source">
            <label className="full">商品标题 <em>*</em><div className="product-edit-ai-field-source"><input value={title} onChange={e=>setTitle(e.target.value)}/><button onClick={()=>setTitle(title+" Ozon")}>✦ AI</button></div></label>
            <label>品牌 <em>*</em><select value={brand} onChange={e=>setBrand(e.target.value)}><option>NO NAME</option><option>Demo Home</option><option>Demo Store</option></select></label>
            <label>型号名称 <em>*</em><div className="product-edit-ai-field-source"><input value={model} onChange={e=>setModel(e.target.value)}/><button onClick={()=>setModel("MODEL-"+String(product.id).padStart(4,"0"))}>✦ AI</button></div></label>
            <label>含包装重量（克）<span className="unit-warning">注意单位是克(g)</span><input type="number" value={weight} onChange={e=>setWeight(Number(e.target.value))}/></label>
            <label>包装尺寸（mm）<span className="unit-warning">注意单位是毫米(mm)</span><div className="product-edit-dimensions-source"><input type="number" value={length} onChange={e=>setLength(Number(e.target.value))}/><i>×</i><input type="number" value={width} onChange={e=>setWidth(Number(e.target.value))}/><i>×</i><input type="number" value={height} onChange={e=>setHeight(Number(e.target.value))}/></div></label>
            <label>您的价格 (¥) <em>*</em><input type="number" value={price} onChange={e=>setPrice(Number(e.target.value))}/></label>
            <label>折扣前价格 (¥)<input type="number" value={oldPrice} onChange={e=>setOldPrice(Number(e.target.value))}/></label>
          </div>
        </section>

        <section className="product-edit-form-card-source">
          <h3>媒体</h3>
          <div className="product-edit-media-source">
            <div className="product-edit-media-main-source"><span>{product.icon}</span><b>主图</b></div>
            <button><PictureOutlined/> 添加图片</button>
            <button><PictureOutlined/> 管理图片</button>
          </div>
        </section>

        <section className="product-edit-form-card-source">
          <h3>文本描述</h3>
          <label className="product-edit-description-source">商品描述<textarea rows={7} value={description} onChange={e=>setDescription(e.target.value)}/><button onClick={()=>setDescription("Практичный товар для повседневного использования. Качественные материалы, удобная конструкция и современный внешний вид.")}><RobotOutlined/> AI 优化描述</button></label>
        </section>
      </main>

      <aside className="product-edit-right-source">
        <section>
          <h4>资料完整度</h4>
          <strong>{completion}%</strong>
          <div><i style={{width:`${completion}%`}}></i></div>
          <p>主要信息、价格、尺寸和描述已填写。</p>
        </section>
        <section>
          <h4>商品状态</h4>
          <span className={"product-edit-state-source "+(product.status==="错误"?"error":"ok")}>{product.status}</span>
          <p>保存后将更新 Demo 商品资料。</p>
        </section>
      </aside>
    </div>

    <div className="product-edit-bottom-source">
      <button className="product-edit-ai-generate-source" onClick={()=>setDescription(description+" Подходит для подарка и личного использования.")}>✦ AI 一键生成标题、#主题标签、描述等信息</button>
      <div>
        <button className="outline" onClick={onCancel}>取消并关闭</button>
        <button className="outline" onClick={()=>setSaved(true)}><SaveOutlined/> 保存草稿</button>
        <button className="primary" onClick={submit}>确定编辑</button>
      </div>
    </div>
  </div>;
}
