import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  User,
  X,
} from "lucide-react";
import "./ozon-plugin-home-demo.css";

type DemoFieldKey=
  |"category"|"commission"|"sku"|"brand"|"monthlySales"|"monthlyGmv"|"salesDynamics"
  |"dailySales"|"dailyRevenue"|"averagePrice"|"adRate"|"promoDays"|"promoDiscount"
  |"promoConversion"|"paidPromotionDays"|"paidBuyers"|"productCardViews"|"productCardCart"
  |"searchViews"|"searchCart"|"displayConversion"|"clickThroughRate"|"delivery"|"returnRate"
  |"dimensions"|"weight"|"createDate"|"sellerCount"|"followMinPrice"|"followMaxPrice";

type DemoProduct={
  id:number;
  title:string;
  price:number;
  oldPrice:number;
  discount:number;
  rating:number;
  reviews:number;
  imageTone:string;
  imageEmoji:string;
  imageLabel:string;
  data:Record<DemoFieldKey,string>;
  status:"full"|"partial"|"empty";
  sellerCount:number|null;
};

const FIELD_LABELS:Array<[DemoFieldKey,string]>= [
  ["category","类目"],["commission","销售佣金"],["sku","SKU"],["brand","品牌"],
  ["monthlySales","月销量"],["monthlyGmv","月销售额"],["salesDynamics","销售变化"],
  ["dailySales","近30天日均销量"],["dailyRevenue","近30天日均销售额"],["averagePrice","均价"],
  ["adRate","推广费占比"],["promoDays","参与促销天数"],["promoDiscount","参与促销的折扣"],
  ["promoConversion","促销活动转化率"],["paidPromotionDays","付费推广天数"],["paidBuyers","付费买家"],
  ["productCardViews","商品卡浏览量"],["productCardCart","商品卡加购率"],["searchViews","搜索目录浏览量"],
  ["searchCart","搜索目录加购率"],["displayConversion","展示转化率"],["clickThroughRate","商品点击率"],
  ["delivery","发货模式"],["returnRate","退货取消率"],["dimensions","长 × 宽 × 高"],["weight","重量"],
  ["createDate","上架时间"],["sellerCount","跟卖列表"],["followMinPrice","跟卖最低价"],["followMaxPrice","跟卖最高价"]
];

const CATEGORIES=["个人护理","家居用品","数码配件","办公用品","厨房用品","汽车用品","宠物用品","服装","园艺工具","运动户外"];
const BRANDS=["Old Spice","Gillette","Comus","Brauberg","IntelliLabel","No name","Revol","Calligrata","OBESTDA","Pilot"];
const NAMES=[
  "Гель для душа мужской 3в1 1000 мл",
  "Кофе в зернах для эспрессо, 1 кг",
  "Набор мужских бритвенных кассет 5 шт.",
  "Дезодорант спрей мужской 150 мл",
  "Ламинатор A4 для дома и офиса",
  "Клейкая лента малярная 48 мм × 25 м",
  "Кисти щетина набор №14, 5 шт.",
  "Самоклеящаяся бумага A4, 50 листов",
  "Термoэтикетки 40×30 мм, 1000 шт.",
  "Пакет для заморозки и хранения, 50 шт.",
  "Органайзер настенный для ванной",
  "Светодиодный ночник с датчиком движения",
  "Автомобильный держатель телефона 360°",
  "Набор маркеров для творчества, 24 цвета",
  "Корзина для белья складная с ручками",
  "Увлажнитель воздуха USB портативный",
  "Коврик для мыши большой игровой",
  "Миска дорожная складная для питомцев",
  "Перчатки садовые усиленные, 2 пары",
  "Фонарь кемпинговый аккумуляторный",
  "Подставка для ноутбука алюминиевая",
  "Набор контейнеров для хранения, 6 шт.",
  "Щетка для обуви с натуральной щетиной",
  "Кабель USB-C 100W, 2 метра",
  "Чехол для хранения одежды прозрачный",
  "Ручки шариковые синие, набор 10 шт.",
  "Ножницы кухонные универсальные",
  "Ролик для чистки одежды многоразовый",
  "Органайзер багажника автомобиля",
  "Лента измерительная портновская 150 см"
];
const EMOJIS=["🧴","☕","🪒","🧯","📄","🧻","🖌️","📃","🏷️","🧊","🧴","💡","🚗","🖍️","🧺","💧","🖱️","🐶","🧤","🔦","💻","📦","👞","🔌","👕","🖊️","✂️","🧹","🚙","📏"];
const TONES=["#fbe3e8","#efe8df","#dce8ff","#fde6d1","#e7f6ed","#fff2c9","#e9e5ff","#e2f1f7","#f7dfd5","#e5efe7"];

function rub(value:number){return new Intl.NumberFormat("ru-RU").format(Math.round(value))+" ₽";}
function cny(valueRub:number){return "¥"+new Intl.NumberFormat("zh-CN").format(Math.round(valueRub*.087));}
function pct(value:number){return (Math.round(value*100)/100).toFixed(value%1?2:0)+"%";}

function buildProduct(index:number):DemoProduct{
  const id=index+1;
  const mode=index%6;
  const price=129+(index*83)%1280;
  const oldPrice=Math.round(price*(1.18+(index%5)*.08));
  const monthlySales=mode===3?0:64+(index*137)%1320;
  const monthlyGmv=monthlySales*price;
  const sellerCount=mode===1?0:mode===0?28+(index%8):mode===3?null:mode===4?12+(index%11):2+(index%5);
  const isEmpty=mode===3;
  const partial=mode===2||mode===5;
  const unavailable="暂无数据";
  const maybe=(value:string,slot:number)=>partial&&((index+slot)%4===0)?unavailable:value;
  const category=CATEGORIES[index%CATEGORIES.length];
  const brand=BRANDS[index%BRANDS.length];
  const commissionA=10+(index%5)*2;
  const commissionB=12+(index%4)*2;
  const commissionC=14+(index%3)*2;
  const minFollow=sellerCount&&sellerCount>0?Math.max(79,Math.round(price*.82)):"—";
  const maxFollow=sellerCount&&sellerCount>0?Math.round(price*1.24):"—";
  const createDays=24+index*7;
  const data:Record<DemoFieldKey,string>={
    category:isEmpty?unavailable:category,
    commission:isEmpty?unavailable:`${commissionA}% · ${commissionB}% · ${commissionC}%`,
    sku:isEmpty?String(119820000+index*913):String(119820000+index*913),
    brand:isEmpty?unavailable:brand,
    monthlySales:isEmpty?unavailable:maybe(new Intl.NumberFormat("zh-CN").format(monthlySales)+" 件",1),
    monthlyGmv:isEmpty?unavailable:maybe(cny(monthlyGmv),2),
    salesDynamics:isEmpty?unavailable:maybe((index%3===0?"+":"-")+pct(2.4+(index%9)*4.15),3),
    dailySales:isEmpty?unavailable:maybe((monthlySales/30).toFixed(1),4),
    dailyRevenue:isEmpty?unavailable:maybe(cny(monthlyGmv/30),5),
    averagePrice:isEmpty?unavailable:maybe(cny(price+((index%4)-2)*17),6),
    adRate:isEmpty?unavailable:maybe(pct(1.5+(index%8)*3.11),7),
    promoDays:isEmpty?unavailable:maybe(String(index%29),8),
    promoDiscount:isEmpty?unavailable:maybe(pct(5+(index%7)*6.8),9),
    promoConversion:isEmpty?unavailable:maybe(pct(4.2+(index%6)*3.17),10),
    paidPromotionDays:isEmpty?unavailable:maybe(String(index%28),11),
    paidBuyers:isEmpty?unavailable:maybe(new Intl.NumberFormat("ru-RU").format((index*431)%142000),12),
    productCardViews:isEmpty?unavailable:maybe(new Intl.NumberFormat("ru-RU").format(8200+(index*6731)%420000),13),
    productCardCart:isEmpty?unavailable:maybe(pct(3.2+(index%8)*1.93),14),
    searchViews:isEmpty?unavailable:maybe(new Intl.NumberFormat("ru-RU").format(11000+(index*4339)%160000),15),
    searchCart:isEmpty?unavailable:maybe(pct(2.1+(index%7)*1.42),16),
    displayConversion:isEmpty?unavailable:maybe(pct(7.4+(index%6)*4.38),17),
    clickThroughRate:isEmpty?unavailable:maybe(pct(.12+(index%8)*.47),18),
    delivery:isEmpty?unavailable:(index%7===0?"FBO,FBS":index%4===0?"FBO":"FBS"),
    returnRate:isEmpty?unavailable:maybe(pct(.3+(index%7)*.58),19),
    dimensions:isEmpty?unavailable:maybe(`${120+(index%6)*18} × ${80+(index%5)*14} × ${30+(index%8)*9}mm`,20),
    weight:isEmpty?unavailable:maybe(`${52+(index*47)%1180} g`,21),
    createDate:isEmpty?unavailable:maybe(`2026-${String(1+(index%8)).padStart(2,"0")}-${String(5+(index*3)%24).padStart(2,"0")}（${createDays}天）`,22),
    sellerCount:sellerCount===null?unavailable:sellerCount===0?"无跟卖":String(sellerCount),
    followMinPrice:sellerCount===null?unavailable:sellerCount===0?"—":cny(Number(minFollow)),
    followMaxPrice:sellerCount===null?unavailable:sellerCount===0?"—":cny(Number(maxFollow)),
  };
  return {
    id,title:NAMES[index],price,oldPrice,discount:Math.round((1-price/oldPrice)*100),
    rating:Number((4.5+(index%6)*.1).toFixed(1)),reviews:132+(index*927)%92000,
    imageTone:TONES[index%TONES.length],imageEmoji:EMOJIS[index],imageLabel:brand,
    data,status:isEmpty?"empty":partial?"partial":"full",sellerCount,
  };
}
const PRODUCTS=Array.from({length:30},(_,index)=>buildProduct(index));

function OzonHeader(){
  return <div className="ozon-home-header">
    <div className="ozon-home-topbar">
      <div className="ozon-wordmark">OZON</div>
      <button className="ozon-catalog"><Menu size={17}/> Каталог</button>
      <div className="ozon-search"><button>Везде <ChevronDown size={13}/></button><input placeholder="Искать на Ozon"/><Search size={18}/></div>
      <div className="ozon-header-icons"><span><User/>Войти</span><span><Box/>Заказы</span><span><Heart/>Избранное</span><span><ShoppingCart/>Корзина</span></div>
    </div>
    <div className="ozon-home-nav">
      <span>Ozon fresh</span><span>Ozon Банк</span><span>Билеты, отели</span><span>Для бизнеса</span><span>Скидки на летнее</span><span>Одежда</span><span>Электроника</span><span>Товары за 1₽</span><span>Склад для Ozon</span>
      <b>Москва · Укажите адрес</b>
    </div>
  </div>;
}

function ProductVisual({product}:{product:DemoProduct}){
  return <div className="ozon-product-image" style={{background:product.imageTone}}>
    <div className="ozon-product-image-badge">{product.imageLabel}</div>
    <div className="ozon-product-emoji">{product.imageEmoji}</div>
    <button title="加入收藏"><Heart size={18}/></button>
  </div>;
}

function intelTone(key:DemoFieldKey,value:string){
  if(value==="暂无数据"||value==="—"||value==="无跟卖") return "tone-muted";
  if(["sku","brand","monthlySales","monthlyGmv","dailySales","dailyRevenue","promoConversion","paidPromotionDays","paidBuyers","delivery","sellerCount"].includes(key)) return "tone-primary";
  if(["followMinPrice","followMaxPrice"].includes(key)) return "tone-negative";
  if(key==="salesDynamics") return value.startsWith("+")?"tone-positive":value.startsWith("-")?"tone-negative":"tone-muted";
  if(key==="adRate"){
    const n=Number.parseFloat(value);
    return Number.isFinite(n)&&n>15?"tone-negative":"tone-positive";
  }
  if(key==="returnRate"){
    const n=Number.parseFloat(value);
    return Number.isFinite(n)&&n>10?"tone-negative":"tone-positive";
  }
  if(key==="clickThroughRate"){
    const n=Number.parseFloat(value);
    return Number.isFinite(n)&&n>3?"tone-positive":"tone-negative";
  }
  if(key==="createDate") return "tone-positive";
  return "";
}

function IntelCard({
  product,
  visibleFields,
  onSettings,
}:{
  product:DemoProduct;
  visibleFields:Set<DemoFieldKey>;
  onSettings:()=>void;
}){
  const [selected,setSelected]=useState(false);
  const [highlight,setHighlight]=useState(false);
  const [showSellers,setShowSellers]=useState(false);

  return <section className={"auto-ozon-intel-card "+(highlight?"highlighted ":"")+(product.status==="empty"?"empty":"")}>
    <div className="auto-ozon-head">
      <span className="auto-ozon-brand-logo" aria-label="Auto OZON">
        <span className="auto-ozon-brand-mark-frame"><img className="auto-ozon-brand-mark" src="/auto-ozon/Auto_ozon2.png" alt=""/></span>
        <span className="auto-ozon-brand-word-frame"><img className="auto-ozon-brand-word" src="/auto-ozon/Auto_ozon1.png" alt="Auto OZON"/></span>
      </span>
      <span className="auto-ozon-actions">
        {product.status==="partial"&&<span className="intel-badge tone-warning">部分数据</span>}
        {product.status==="empty"&&<span className="intel-badge tone-muted">暂无数据</span>}
        <button className={"tool-button selection-button "+(selected?"done":"")} title="加入 ERP 选品池" onClick={()=>setSelected(v=>!v)}>{selected?"✓":"＋"}</button>
        <button className={"tool-button rule-button "+(highlight?"active":"")} title="设置卡片高亮条件" onClick={()=>setHighlight(v=>!v)}>⚠</button>
        <button className="tool-button settings-button" title="选择显示字段" onClick={onSettings}>⚙</button>
      </span>
    </div>

    <div className="auto-ozon-rows">
      {FIELD_LABELS.filter(([key])=>visibleFields.has(key)).map(([key,label])=>{
        const value=product.data[key];
        const missing=value==="暂无数据"||value==="—";
        const isCommission=key==="commission"&&!missing;
        if(key==="sellerCount"&&product.sellerCount&&product.sellerCount>0){
          return <div className="intel-row" key={key}>
            <span className="intel-label">{label}</span>
            <button className="seller-list-trigger" onClick={()=>setShowSellers(true)}>{value} 个卖家</button>
          </div>;
        }
        return <div className="intel-row" key={key}>
          <span className="intel-label">{label}</span>
          {isCommission
            ? <span className="commission-chips">{value.split(" · ").map((v,i)=><b key={v} className={"metric-chip "+(i===0?"tone-primary":i===1?"tone-warning":"tone-negative")}>{v}</b>)}</span>
            : <span className={"intel-value "+intelTone(key,value)}>{value}</span>}
        </div>;
      })}
    </div>

    <div className="intel-updated">数据截至：2026-09-25 04:{String(20+product.id).padStart(2,"0")}:01</div>

    {showSellers&&<div className="seller-popover-demo">
      <div className="seller-popover-head"><b>跟卖列表 · {product.sellerCount} 家</b><button onClick={()=>setShowSellers(false)}><X size={14}/></button></div>
      {Array.from({length:Math.min(product.sellerCount||0,6)},(_,i)=><div className="seller-line" key={i}><span className="seller-avatar">{String.fromCharCode(65+i)}</span><span>Seller {i+1}</span><strong>{cny(product.price-35+i*11)}</strong><em>★ {(4.5+(i%5)*.1).toFixed(1)}</em></div>)}
      {(product.sellerCount||0)>6&&<div className="seller-more">还有 {(product.sellerCount||0)-6} 家跟卖...</div>}
    </div>}
  </section>;
}

type AutoNumericKey=
  |"monthlySales"|"monthlyGmv"|"averagePrice"|"packagingWeight"|"listingDays"|"salesDynamics"
  |"adRate"|"promoDays"|"promoDiscount"|"promoConversion"|"paidPromotionDays"
  |"productCardViews"|"productCardCart"|"searchViews"|"searchCart"|"displayConversion"
  |"clickThroughRate"|"returnRate"|"sellerCount"|"followMinPrice";

const AUTO_NUMERIC_FIELDS:Array<{key:AutoNumericKey;label:string;unit:string}>=[
  {key:"monthlySales",label:"月销量",unit:"件"},
  {key:"monthlyGmv",label:"月销售额",unit:"¥"},
  {key:"averagePrice",label:"均价",unit:"¥"},
  {key:"packagingWeight",label:"重量",unit:"g"},
  {key:"listingDays",label:"上架天数",unit:"天"},
  {key:"salesDynamics",label:"销售变化",unit:"%"},
  {key:"adRate",label:"推广费占比",unit:"%"},
  {key:"promoDays",label:"参与促销天数",unit:"天"},
  {key:"promoDiscount",label:"参与促销的折扣",unit:"%"},
  {key:"promoConversion",label:"促销活动转化率",unit:"%"},
  {key:"paidPromotionDays",label:"付费推广天数",unit:"天"},
  {key:"productCardViews",label:"商品卡浏览量",unit:""},
  {key:"productCardCart",label:"商品卡加购率",unit:"%"},
  {key:"searchViews",label:"搜索目录浏览量",unit:""},
  {key:"searchCart",label:"搜索目录加购率",unit:"%"},
  {key:"displayConversion",label:"展示转化率",unit:"%"},
  {key:"clickThroughRate",label:"商品点击率",unit:"%"},
  {key:"returnRate",label:"退货取消率",unit:"%"},
  {key:"sellerCount",label:"跟卖人数",unit:"人"},
  {key:"followMinPrice",label:"跟卖最低价",unit:"¥"},
];

type AutoFilters={
  brandMode:"any"|"brand"|"noBrand";
  delivery:"any"|"FBO"|"FBS"|"FBO,FBS";
  numeric:Record<string,{min:string;max:string}>;
};

const EMPTY_AUTO_FILTERS:AutoFilters={brandMode:"any",delivery:"any",numeric:{}};
const DEMO_EXISTING_SELECTION_IDS=new Set([2,12,22]);
const DEMO_FAILED_SELECTION_IDS=new Set([27]);

function readDemoNumber(product:DemoProduct,key:AutoNumericKey){
  if(key==="packagingWeight"){
    const source=product.data.weight;
    if(!source||source==="暂无数据") return null;
    const match=source.replace(/,/g,"").match(/-?\d+(?:\.\d+)?/);
    return match?Number(match[0]):null;
  }
  if(key==="listingDays"){
    const match=product.data.createDate.match(/（(\d+)天）/);
    return match?Number(match[1]):null;
  }
  if(key==="sellerCount") return product.sellerCount===null?null:product.sellerCount;
  const source=product.data[key as DemoFieldKey];
  if(!source||source==="暂无数据"||source==="—"||source==="无跟卖") return source==="无跟卖"?0:null;
  const normalized=source.replace(/[¥￥,%\s件g]/gi,"").replace(/,/g,"");
  const match=normalized.match(/-?\d+(?:\.\d+)?/);
  return match?Number(match[0]):null;
}

function autoSettingCount(filters:AutoFilters){
  return (filters.brandMode!=="any"?1:0)
    +(filters.delivery!=="any"?1:0)
    +Object.values(filters.numeric).filter(range=>range.min!==""||range.max!=="").length;
}

type DemoFilterEvaluation={status:"pass"|"reject"|"error";field?:string};

function evaluateDemoProduct(product:DemoProduct,filters:AutoFilters):DemoFilterEvaluation{
  if(filters.brandMode==="brand"||filters.brandMode==="noBrand"){
    const brand=product.data.brand;
    if(brand==="暂无数据") return {status:"error",field:"品牌"};
    const hasBrand=brand!=="No name"&&brand!=="无品牌";
    if((filters.brandMode==="brand"&&!hasBrand)||(filters.brandMode==="noBrand"&&hasBrand)) return {status:"reject",field:"品牌"};
  }
  if(filters.delivery!=="any"){
    const delivery=product.data.delivery;
    if(delivery==="暂无数据") return {status:"error",field:"发货模式"};
    if(delivery!==filters.delivery) return {status:"reject",field:"发货模式"};
  }
  for(const field of AUTO_NUMERIC_FIELDS){
    const range=filters.numeric[field.key];
    if(!range||(range.min===""&&range.max==="")) continue;
    const value=readDemoNumber(product,field.key);
    if(value===null) return {status:product.status==="empty"?"error":"reject",field:field.label};
    const min=range.min===""?null:Number(range.min);
    const max=range.max===""?null:Number(range.max);
    if(min!==null&&Number.isFinite(min)&&value<min) return {status:"reject",field:field.label};
    if(max!==null&&Number.isFinite(max)&&value>max) return {status:"reject",field:field.label};
  }
  return {status:"pass"};
}

function matchesAutoFilters(product:DemoProduct,filters:AutoFilters){
  return evaluateDemoProduct(product,filters).status==="pass";
}

function AutoSelectionSettings({
  value,
  onCancel,
  onSave,
  initialError="",
}:{
  value:AutoFilters;
  onCancel:()=>void;
  onSave:(next:AutoFilters)=>void;
  initialError?:string;
}){
  const [draft,setDraft]=useState<AutoFilters>(()=>({
    brandMode:value.brandMode,
    delivery:value.delivery,
    numeric:Object.fromEntries(Object.entries(value.numeric).map(([key,range])=>[key,{...range}])),
  }));
  const [error,setError]=useState(initialError);

  const updateRange=(key:AutoNumericKey,side:"min"|"max",nextValue:string)=>{
    const currentRange=draft.numeric[key]||{min:"",max:""};
    setDraft({...draft,numeric:{...draft.numeric,[key]:{...currentRange,[side]:nextValue}}});
  };

  const save=()=>{
    for(const field of AUTO_NUMERIC_FIELDS){
      const range=draft.numeric[field.key];
      if(!range) continue;
      const min=range.min===""?null:Number(range.min);
      const max=range.max===""?null:Number(range.max);
      if((min!==null&&!Number.isFinite(min))||(max!==null&&!Number.isFinite(max))||(min!==null&&max!==null&&min>max)){
        setError(field.label+"的范围无效。");
        return;
      }
    }
    setError("");
    onSave(draft);
  };

  useEffect(()=>{
    const handleEscape=(event:KeyboardEvent)=>{
      if(event.key!=="Escape") return;
      event.preventDefault();
      save();
    };
    document.addEventListener("keydown",handleEscape,true);
    return()=>document.removeEventListener("keydown",handleEscape,true);
  });

  return <div className="auto-settings-overlay" onMouseDown={event=>{if(event.target===event.currentTarget) save()}}>
    <section className="auto-settings-dialog">
      <header>
        <div><h2>选品筛选条件</h2><p>条件全部选填；留空表示不限制该项。</p></div>
        <button onClick={save}>×</button>
      </header>
      <div className="auto-settings-body">
        <div className="auto-settings-top">
          <label><span>品牌选项</span><select value={draft.brandMode} onChange={e=>setDraft({...draft,brandMode:e.target.value as AutoFilters["brandMode"]})}><option value="any">不限</option><option value="brand">有品牌</option><option value="noBrand">无品牌</option></select></label>
          <label><span>发货模式</span><select value={draft.delivery} onChange={e=>setDraft({...draft,delivery:e.target.value as AutoFilters["delivery"]})}><option value="any">不限</option><option value="FBO">FBO</option><option value="FBS">FBS</option><option value="FBO,FBS">FBO + FBS</option></select></label>
        </div>
        <div className="auto-settings-section-title"><strong>数值条件</strong><span>最小值和最大值均可单独填写</span></div>
        <div className="auto-settings-grid">
          {AUTO_NUMERIC_FIELDS.map(field=>{
            const range=draft.numeric[field.key]||{min:"",max:""};
            return <div className="auto-settings-range" key={field.key}>
              <label>{field.label}</label>
              <input type="number" value={range.min} placeholder="最小值" onChange={e=>updateRange(field.key,"min",e.target.value)}/>
              <span>至</span>
              <input type="number" value={range.max} placeholder="最大值" onChange={e=>updateRange(field.key,"max",e.target.value)}/>
              <em>{field.unit}</em>
            </div>;
          })}
        </div>
        <div className="auto-settings-error">{error}</div>
      </div>
      <footer><button onClick={onCancel}>取消</button><button className="primary" onClick={save}>保存条件</button></footer>
    </section>
  </div>;
}

type DemoScanRow={product:DemoProduct;status:"pending"|"pass"|"reject"|"error";field?:string};
type DemoQueueRow={product:DemoProduct;state:"running"|"completed"|"existing"|"failed";error?:string};

function AutoSelectionModal({
  products,
  filters,
  quantity,
  onFiltersChange,
  onQuantityChange,
  onScanningChange,
  onClose,
  onComplete,
}:{
  products:DemoProduct[];
  filters:AutoFilters;
  quantity:string;
  onFiltersChange:(next:AutoFilters)=>void;
  onQuantityChange:(next:string)=>void;
  onScanningChange:(next:boolean)=>void;
  onClose:()=>void;
  onComplete:(ids:number[],summary:{scanned:number;qualified:number;added:number;existing:number;failed:number})=>void;
}){
  const [settingsOpen,setSettingsOpen]=useState(false);
  const [settingsError,setSettingsError]=useState("");
  const [running,setRunning]=useState(false);
  const [scanRows,setScanRows]=useState<DemoScanRow[]>([]);
  const [queueRows,setQueueRows]=useState<DemoQueueRow[]>([]);
  const [scanStatus,setScanStatus]=useState("等待开始扫描");
  const [summary,setSummary]=useState<{scanned:number;qualified:number;added:number;existing:number;failed:number}|null>(null);
  const runToken=useRef(0);
  const scanBodyRef=useRef<HTMLDivElement|null>(null);
  const queueBodyRef=useRef<HTMLDivElement|null>(null);
  const settingsCount=autoSettingCount(filters);

  useEffect(()=>()=>{
    runToken.current+=1;
    onScanningChange(false);
  },[onScanningChange]);

  useEffect(()=>{
    if(scanBodyRef.current) scanBodyRef.current.scrollTop=scanBodyRef.current.scrollHeight;
  },[scanRows.length]);

  useEffect(()=>{
    if(queueBodyRef.current) queueBodyRef.current.scrollTop=queueBodyRef.current.scrollHeight;
  },[queueRows.length]);

  const stopAndClose=()=>{
    runToken.current+=1;
    onScanningChange(false);
    onClose();
  };

  const start=async()=>{
    const amount=Number(quantity);
    if(running||!Number.isInteger(amount)||amount<1) return;
    if(settingsCount<1){
      setSettingsError("请至少设置一项筛选条件后再开始选品。");
      setScanStatus("等待设置筛选条件");
      setSettingsOpen(true);
      return;
    }

    const token=++runToken.current;
    setRunning(true);
    setSummary(null);
    setScanRows([]);
    setQueueRows([]);
    setScanStatus("正在恢复扫描进度并读取 SKU…");
    onScanningChange(true);

    const scroller=document.querySelector(".ozon-plugin-home-demo .ozon-home-scroll") as HTMLElement|null;
    if(scroller) scroller.scrollTop=0;
    let scrollTimer:number|undefined;

    let scanned=0;
    let qualified=0;
    let added=0;
    let existing=0;
    let failed=0;
    const addedIds:number[]=[];
    const scanBuffer:DemoScanRow[]=[];
    const queueBuffer:DemoQueueRow[]=[];
    const sleep=(ms:number)=>new Promise(resolve=>window.setTimeout(resolve,ms));

    try{
      await sleep(320);
      if(runToken.current!==token) return;
      setScanStatus("商品顺序已确认，准备自动下滑扫描");
      scrollTimer=window.setInterval(()=>{
        if(runToken.current!==token||!scroller) return;
        const max=Math.max(0,scroller.scrollHeight-scroller.clientHeight);
        scroller.scrollTop=Math.min(max,scroller.scrollTop+12);
      },50);

      for(const product of products){
        if(runToken.current!==token||added>=amount) break;
        scanned+=1;
        scanBuffer.push({product,status:"pending"});
        setScanRows([...scanBuffer]);
        setScanStatus("自动下滑扫描中 · 240px/s");
        await sleep(150);
        if(runToken.current!==token) return;

        const evaluation=evaluateDemoProduct(product,filters);
        scanBuffer[scanBuffer.length-1]={product,status:evaluation.status,field:evaluation.field};
        setScanRows([...scanBuffer]);

        if(evaluation.status==="pass"){
          qualified+=1;
          const queueEntry:DemoQueueRow={product,state:"running"};
          queueBuffer.push(queueEntry);
          setQueueRows([...queueBuffer]);
          await sleep(130);
          if(runToken.current!==token) return;

          if(DEMO_EXISTING_SELECTION_IDS.has(product.id)){
            existing+=1;
            queueEntry.state="existing";
          }else if(DEMO_FAILED_SELECTION_IDS.has(product.id)){
            failed+=1;
            queueEntry.state="failed";
            queueEntry.error="示例：保存到采集箱失败";
          }else{
            added+=1;
            addedIds.push(product.id);
            queueEntry.state="completed";
          }
          setQueueRows([...queueBuffer]);
        }

        await sleep(110);
      }

      if(runToken.current!==token) return;
      const next={scanned,qualified,added,existing,failed};
      setSummary(next);
      setScanStatus(
        added>=amount
          ?"扫描完成 · 已找到 "+qualified+" 个合格 SKU，达到目标 "+amount
          :"扫描完成 · 目标 "+amount+"，实际新增 "+added
      );
      onComplete(addedIds,next);
    }finally{
      if(scrollTimer!==undefined) window.clearInterval(scrollTimer);
      if(runToken.current===token) setRunning(false);
    }
  };

  const showWorkspace=running||scanRows.length>0||summary!==null;
  return <div className="auto-listing-overlay">
    <section className="auto-listing-dialog">
      <header className="auto-listing-header">
        <div className="auto-listing-brand">
          <img src="/auto-ozon/auto-ozon-logo.png" alt="OzonG"/>
          <div>
            <small>AUTO PRODUCT SELECTION</small>
            <strong className={showWorkspace?"scan-summary":""}>
              {showWorkspace?<><span>已扫描</span><b>{scanRows.length}</b><span>个SKU，</span><b>{queueRows.length}</b><span>个符合条件SKU</span></>:"自动选品工作台"}
            </strong>
          </div>
        </div>
        <div className="auto-listing-header-actions">
          <label><span>筛选条件</span><button disabled={running} onClick={()=>{setSettingsError("");setSettingsOpen(true)}}>{settingsCount?"已设 "+settingsCount+" 项":"设置条件"}</button></label>
          <label><span>选品数量</span><input disabled={running} type="number" min="1" step="1" value={quantity} onChange={e=>onQuantityChange(e.target.value)}/></label>
          <label><span>执行</span><button className="start" disabled={running||!Number.isInteger(Number(quantity))||Number(quantity)<1} onClick={start}>{running?"选品中":"开始选品"}</button></label>
        </div>
        <button className="auto-listing-close" onClick={stopAndClose}>关闭</button>
      </header>

      <div className="auto-listing-content">
        <section className="auto-listing-stage">
          {!showWorkspace?<>
            <div className="auto-listing-stage-label">PRODUCT SELECTION QUEUE</div>
            <h3>筛选合格商品，统一进入采集箱</h3>
            <p>设置筛选条件和选品数量；合格 SKU 只保存到 ERP 采集箱，不会自动执行上架。</p>
            <div className="auto-listing-ready">
              <strong>已准备开始选品</strong>
              <span>重复商品会跳过且不计入目标数量。店铺和正式上架设置请在采集箱点击“上架”后选择。</span>
            </div>
          </>:<div className="auto-scan-results">
            <section className="auto-scan-pane is-scan">
              <header><div><h3>扫描列表</h3><p>{scanStatus}</p></div><b>{scanRows.length}</b></header>
              <div className="auto-scan-pane-body" ref={scanBodyRef}>
                {running&&scanRows.length===0?<div className="auto-scan-loading"><i/><span>正在恢复扫描进度并读取 SKU…</span></div>:scanRows.length===0?<div className="auto-scan-empty">当前主商品区暂未发现可用 SKU</div>:<div className="auto-scan-grid">
                  {scanRows.map((row,index)=><div className="auto-scan-item" key={row.product.id}>
                    <span className="auto-scan-index">{index+1}</span>
                    <span className="auto-scan-sku">{row.product.data.sku}</span>
                    <span className={"auto-scan-status is-"+row.status}>
                      {row.status==="pending"?"判断中":row.status==="pass"?"符合条件":row.status==="reject"?"不符合条件":"数据失败"+(row.field?"："+row.field:"")}
                    </span>
                  </div>)}
                </div>}
              </div>
            </section>

            <section className="auto-scan-pane is-queue">
              <header><div><h3>合格列表</h3><p>符合条件的 SKU 将依次保存到 ERP 采集箱</p></div><b>{queueRows.length}</b></header>
              <div className="auto-scan-pane-body" ref={queueBodyRef}>
                {queueRows.length===0?<div className="auto-scan-empty">符合条件的 SKU 将依次保存到 ERP 采集箱</div>:<div className="auto-scan-grid">
                  {queueRows.map((row,index)=><div className={"auto-scan-item is-candidate is-"+row.state} key={row.product.id}>
                    <span className="auto-scan-index">{index+1}</span>
                    <span className="auto-scan-sku">{row.product.data.sku}</span>
                    <span className="auto-queue-status">{row.state==="running"?"采集中":row.state==="completed"?"已采集":row.state==="existing"?"已在采集箱":"采集失败"}</span>
                  </div>)}
                </div>}
              </div>
            </section>
          </div>}
        </section>
      </div>
    </section>

    {settingsOpen&&<AutoSelectionSettings
      value={filters}
      initialError={settingsError}
      onCancel={()=>setSettingsOpen(false)}
      onSave={next=>{onFiltersChange(next);setSettingsOpen(false);setSettingsError("")}}
    />}
  </div>;
}

type CalculatorMode="profit"|"pricing";

function CalculatorDemoDrawer({
  initialMode,
  onClose,
}:{
  initialMode:CalculatorMode;
  onClose:()=>void;
}){
  const [mode,setMode]=useState<CalculatorMode>(initialMode);
  const [sellPrice,setSellPrice]=useState("199");
  const [cost,setCost]=useState("45");
  const [weight,setWeight]=useState("500");
  const [length,setLength]=useState("25");
  const [width,setWidth]=useState("18");
  const [height,setHeight]=useState("8");
  const [commission,setCommission]=useState("16");
  const [targetProfit,setTargetProfit]=useState("20");
  const [discount,setDiscount]=useState("50");
  const [domestic,setDomestic]=useState("3");
  const [adRate,setAdRate]=useState("8");
  const [otherRate,setOtherRate]=useState("1");
  const [result,setResult]=useState<{sell:number;profit:number;margin:number;oldPrice:number;logistics:number;platform:number}|null>(null);

  const calculate=()=>{
    const purchase=Math.max(0,Number(cost)||0);
    const kg=Math.max(0,Number(weight)||0)/1000;
    const volume=Math.max(0,(Number(length)||0)*(Number(width)||0)*(Number(height)||0))/6000;
    const chargeable=Math.max(kg,volume);
    const logistics=Number((8.5+chargeable*13.5).toFixed(2));
    const fixed=purchase+(Number(domestic)||0)+logistics;
    const commissionRate=(Number(commission)||0)/100;
    const variable=((Number(adRate)||0)+(Number(otherRate)||0))/100;
    let price=Number(sellPrice)||0;
    if(mode==="pricing"){
      const desired=(Number(targetProfit)||0)/100;
      const denom=1-commissionRate-variable-desired;
      price=denom>0?fixed/denom:0;
    }
    const platform=price*commissionRate;
    const profit=price-fixed-platform-price*variable;
    const margin=price>0?profit/price*100:0;
    const oldPrice=mode==="pricing"&&Number(discount)<100?price/(1-(Number(discount)||0)/100):price;
    setResult({sell:price,profit,margin,oldPrice,logistics,platform});
  };

  return <div className="calculator-demo-root">
    <button className="calculator-backdrop" aria-label="关闭计算器" onClick={onClose}/>
    <aside className="calculator-drawer">
      <header><button onClick={onClose}>×</button><strong>定价工具&利润计算器</strong></header>
      <div className="calculator-body">
        <div className="calculator-notice"><b>i</b><span>官网交互 Demo 使用本地示例参数，不调用真实店铺、物流或计费接口。</span></div>
        <div className="calculator-tabs"><button className={mode==="pricing"?"active":""} onClick={()=>{setMode("pricing");setResult(null)}}>OZON跨境定价工具</button><button className={mode==="profit"?"active":""} onClick={()=>{setMode("profit");setResult(null)}}>OZON跨境利润计算器</button></div>
        <h2>{mode==="pricing"?"OZON跨境定价工具":"OZON跨境利润计算器"}</h2>
        <div className="calculator-form">
          <div className="calculator-section-title"><i/>基础设置</div>
          {mode==="profit"&&<label><span><em>*</em>售价</span><div><input type="number" value={sellPrice} onChange={e=>setSellPrice(e.target.value)}/><b>元</b></div></label>}
          <label><span><em>*</em>类目佣金</span><select value={commission} onChange={e=>setCommission(e.target.value)}><option value="10">个人护理 · 10%</option><option value="12">办公用品 · 12%</option><option value="14">数码配件 · 14%</option><option value="16">家居用品 · 16%</option><option value="18">厨房用品 · 18%</option></select></label>
          <label><span><em>*</em>采购成本</span><div><input type="number" value={cost} onChange={e=>setCost(e.target.value)}/><b>元</b></div></label>
          <label><span><em>*</em>包裹重量</span><div><input type="number" value={weight} onChange={e=>setWeight(e.target.value)}/><b>g</b></div></label>
          <label><span><em>*</em>包裹体积</span><div className="calculator-dimensions"><input type="number" value={length} onChange={e=>setLength(e.target.value)} placeholder="长"/><input type="number" value={width} onChange={e=>setWidth(e.target.value)} placeholder="宽"/><input type="number" value={height} onChange={e=>setHeight(e.target.value)} placeholder="高"/></div></label>
          {mode==="pricing"&&<><label><span>期望利润</span><div><input type="number" value={targetProfit} onChange={e=>setTargetProfit(e.target.value)}/><b>%</b></div></label><label><span>划线折扣</span><div><input type="number" value={discount} onChange={e=>setDiscount(e.target.value)}/><b>%</b></div></label></>}
          <label><span><em>*</em>跨境物流商</span><select><option>CEL（演示）</option></select></label>
          <div className="calculator-section-title"><i/>其它设置</div>
          <label><span>国内运费+代贴单</span><div><input type="number" value={domestic} onChange={e=>setDomestic(e.target.value)}/><b>元</b></div></label>
          <label><span>广告费占比</span><div><input type="number" value={adRate} onChange={e=>setAdRate(e.target.value)}/><b>%</b></div></label>
          <label><span>其他(提现、货损等)</span><div><input type="number" value={otherRate} onChange={e=>setOtherRate(e.target.value)}/><b>%</b></div></label>
          <button className="calculator-submit" onClick={calculate}>开始计算</button>
        </div>
        <div className="calculator-result">
          {result?<><div className="calculator-result-head"><i/>计算结果</div><div className="calculator-summary"><span><small>{mode==="pricing"?"建议售价":"预计利润"}</small><strong>{mode==="pricing"?"¥"+result.sell.toFixed(2):"¥"+result.profit.toFixed(2)}</strong></span><span><small>利润率</small><strong className={result.margin>=0?"green":"red"}>{result.margin.toFixed(2)}%</strong></span></div><div className="calculator-detail"><span>平台佣金 <b>¥{result.platform.toFixed(2)}</b></span><span>物流估算 <b>¥{result.logistics.toFixed(2)}</b></span><span>预计利润 <b className={result.profit>=0?"green":"red"}>¥{result.profit.toFixed(2)}</b></span>{mode==="pricing"&&<span>建议划线价 <b>¥{result.oldPrice.toFixed(2)}</b></span>}</div></>:<div className="calculator-empty">⌁<span>填写参数后点击“开始计算”</span></div>}
        </div>
      </div>
    </aside>
  </div>;
}

function FieldSettings({
  visibleFields,
  onClose,
  onApply,
}:{
  visibleFields:Set<DemoFieldKey>;
  onClose:()=>void;
  onApply:(next:Set<DemoFieldKey>)=>void;
}){
  const [draft,setDraft]=useState(()=>new Set(visibleFields));
  const all=draft.size===FIELD_LABELS.length;
  return <div className="plugin-modal-backdrop">
    <section className="plugin-field-modal">
      <header><h3>选择需要展示的数据</h3><button onClick={onClose}><X size={18}/></button></header>
      <label className="field-select-all"><input type="checkbox" checked={all} onChange={e=>setDraft(new Set(e.target.checked?FIELD_LABELS.map(([key])=>key):[]))}/> 全选</label>
      <div className="field-grid-demo">{FIELD_LABELS.map(([key,label])=><label key={key}><input type="checkbox" checked={draft.has(key)} onChange={e=>{const next=new Set(draft);if(e.target.checked)next.add(key);else next.delete(key);setDraft(next)}}/>{label}</label>)}</div>
      <footer><span>已选择 {draft.size} / {FIELD_LABELS.length} 个字段</span><div><button onClick={onClose}>取消</button><button className="primary" onClick={()=>onApply(draft)}>确定</button></div></footer>
    </section>
  </div>;
}

export function OzonPluginHomeDemo({onEnterErp}:{onEnterErp?:()=>void}){
  const [visibleFields,setVisibleFields]=useState<Set<DemoFieldKey>>(()=>new Set(FIELD_LABELS.map(([key])=>key)));
  const [settingsOpen,setSettingsOpen]=useState(false);
  const [panelOpen,setPanelOpen]=useState(true);
  const [cardsHidden,setCardsHidden]=useState(false);
  const [autoSelectionOpen,setAutoSelectionOpen]=useState(false);
  const [autoFilters,setAutoFilters]=useState<AutoFilters>(EMPTY_AUTO_FILTERS);
  const [autoQuantity,setAutoQuantity]=useState("5");
  const [autoScanning,setAutoScanning]=useState(false);
  const [calculatorMode,setCalculatorMode]=useState<CalculatorMode|null>(null);
  const [autoSelectedIds,setAutoSelectedIds]=useState<number[]>([]);
  const [notice,setNotice]=useState("");
  const [query,setQuery]=useState("");
  const displayed=useMemo(()=>PRODUCTS.filter(p=>!query||p.title.toLowerCase().includes(query.toLowerCase())||p.data.sku.includes(query)),[query]);
  const autoSelectedSet=useMemo(()=>new Set(autoSelectedIds),[autoSelectedIds]);

  return <div className="ozon-plugin-home-demo">
    <div className="ozon-home-scroll">
      <OzonHeader/>
      <div className="ozon-demo-banner">
        <div><span>OzonG · Demo</span><h2>Дом, техника и товары на каждый день</h2><p>30 个示例商品 · 插件商品情报卡已加载</p></div>
        <Sparkles/>
      </div>
      <div className="ozon-demo-toolbar">
        <div><SlidersHorizontal size={16}/><span>商品列表</span><b>{displayed.length}</b></div>
        <label><Search size={15}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="搜索商品标题或 SKU"/></label>
      </div>
      <div className="ozon-product-grid">
        {displayed.map(product=><article className={"ozon-product-card "+(autoSelectedSet.has(product.id)?"auto-selected":"")} key={product.id}>
          {autoSelectedSet.has(product.id)&&<div className="auto-selected-badge">已选入采集箱</div>}
          <ProductVisual product={product}/>
          <div className="ozon-product-price"><b>{rub(product.price)}</b><s>{rub(product.oldPrice)}</s><em>-{product.discount}%</em></div>
          <div className="ozon-product-title">{product.title}</div>
          <div className="ozon-product-rating">★ {product.rating.toFixed(1)} <span>{new Intl.NumberFormat("ru-RU").format(product.reviews)} отзывов</span></div>
          {!cardsHidden&&!autoScanning&&<IntelCard product={product} visibleFields={visibleFields} onSettings={()=>setSettingsOpen(true)}/>}
        </article>)}
      </div>
      <div className="ozon-demo-end">已展示 30 个插件主页示例商品</div>
    </div>

    <button className="ozong-float-button" onClick={()=>setPanelOpen(v=>!v)}><img src="/auto-ozon/auto-ozon-logo.png" alt="OzonG"/></button>
    {panelOpen&&<aside className="ozong-control-demo">
      <header><div><img src="/auto-ozon/auto-ozon-logo.png" alt="OzonG"/><span><b>OzonG</b><small>控制中心</small></span></div><div className="ozong-drawer-actions"><button onClick={()=>setPanelOpen(false)}>—</button><button onClick={()=>setPanelOpen(false)}>×</button></div></header>
      <div className="ozong-control-body">
        <button className="primary" onClick={()=>setNotice("官网 Demo：真实插件会在新标签页打开 Ozon Seller。")}>打开 Ozon Seller</button>
        <button onClick={()=>setNotice("官网 Demo 不读取浏览器 Cookie；真实插件会检测当前 Ozon Seller 登录态后执行绑定。")}>绑定 Cookie</button>
        <small>效率工具</small>
        <button className="auto-listing-control" onClick={()=>setAutoSelectionOpen(true)}><span>自动选品</span></button>
        <div className="two"><button onClick={()=>setCalculatorMode("profit")}>计算利润</button><button className="orange" onClick={()=>setCalculatorMode("pricing")}>定价工具</button></div>
        <small>快捷设置</small>
        <button onClick={()=>setCardsHidden(v=>!v)}>{cardsHidden?"显示商品卡":"隐藏商品卡"}</button>
        <button onClick={()=>{setPanelOpen(false);onEnterErp?.()}}>进入 OzonG ERP</button>
      </div>
    </aside>}

    {settingsOpen&&<FieldSettings visibleFields={visibleFields} onClose={()=>setSettingsOpen(false)} onApply={next=>{setVisibleFields(next);setSettingsOpen(false)}}/>}
    {autoSelectionOpen&&<AutoSelectionModal
      products={PRODUCTS}
      filters={autoFilters}
      quantity={autoQuantity}
      onFiltersChange={setAutoFilters}
      onQuantityChange={setAutoQuantity}
      onScanningChange={setAutoScanning}
      onClose={()=>setAutoSelectionOpen(false)}
      onComplete={(ids)=>{
        setAutoSelectedIds(current=>[...new Set([...current,...ids])]);
      }}
    />}
    {calculatorMode&&<CalculatorDemoDrawer initialMode={calculatorMode} onClose={()=>setCalculatorMode(null)}/>}
    {notice&&<div className="ozong-demo-toast"><span>{notice}</span><button onClick={()=>setNotice("")}>×</button></div>}
  </div>;
}
