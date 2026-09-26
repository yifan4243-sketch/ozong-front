import { useMemo, useState } from "react";
import {
  Bell,
  Box,
  ChevronDown,
  Heart,
  Home,
  Menu,
  Search,
  Settings,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Store,
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
    monthlySales:isEmpty?unavailable:maybe(new Intl.NumberFormat("ru-RU").format(monthlySales),1),
    monthlyGmv:isEmpty?unavailable:maybe(rub(monthlyGmv),2),
    salesDynamics:isEmpty?unavailable:maybe((index%3===0?"+":"-")+pct(2.4+(index%9)*4.15),3),
    dailySales:isEmpty?unavailable:maybe((monthlySales/30).toFixed(1),4),
    dailyRevenue:isEmpty?unavailable:maybe(rub(monthlyGmv/30),5),
    averagePrice:isEmpty?unavailable:maybe(rub(price+((index%4)-2)*17),6),
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
    delivery:isEmpty?unavailable:(index%4===0?"FBO":"FBS"),
    returnRate:isEmpty?unavailable:maybe(pct(.3+(index%7)*.58),19),
    dimensions:isEmpty?unavailable:maybe(`${120+(index%6)*18} × ${80+(index%5)*14} × ${30+(index%8)*9}mm`,20),
    weight:isEmpty?unavailable:maybe(`${52+(index*47)%1180} g`,21),
    createDate:isEmpty?unavailable:maybe(`2026-${String(1+(index%8)).padStart(2,"0")}-${String(5+(index*3)%24).padStart(2,"0")}（${createDays}天）`,22),
    sellerCount:sellerCount===null?unavailable:sellerCount===0?"无跟卖":String(sellerCount),
    followMinPrice:sellerCount===null?unavailable:sellerCount===0?"—":rub(Number(minFollow)),
    followMaxPrice:sellerCount===null?unavailable:sellerCount===0?"—":rub(Number(maxFollow)),
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

  return <div className={"auto-ozon-intel-card "+(highlight?"highlighted ":"")+(product.status==="empty"?"empty":"")}>
    <div className="auto-ozon-head">
      <div className="auto-ozon-brand"><span>✦</span><strong>Auto OZON</strong></div>
      <div className="auto-ozon-actions">
        {product.status==="partial"&&<em>部分数据</em>}
        {product.status==="empty"&&<em>暂无数据</em>}
        <button className={selected?"done":""} title="加入 ERP 选品池" onClick={()=>setSelected(v=>!v)}>{selected?"✓":"＋"}</button>
        <button className={highlight?"active":""} title="设置卡片高亮条件" onClick={()=>setHighlight(v=>!v)}>⚠</button>
        <button title="选择显示字段" onClick={onSettings}><Settings size={12}/></button>
      </div>
    </div>
    <div className="auto-ozon-rows">
      {FIELD_LABELS.filter(([key])=>visibleFields.has(key)).map(([key,label])=>{
        const value=product.data[key];
        const missing=value==="暂无数据"||value==="—";
        const positive=["monthlySales","monthlyGmv","dailySales","dailyRevenue"].includes(key)&&!missing;
        const negative=["adRate","returnRate"].includes(key)&&!missing;
        const isCommission=key==="commission"&&!missing;
        if(key==="sellerCount"&&product.sellerCount&&product.sellerCount>0){
          return <div className="intel-row" key={key}><span>{label}：</span><button className="seller-trigger" onClick={()=>setShowSellers(true)}>{value} 个卖家</button></div>;
        }
        return <div className="intel-row" key={key}>
          <span>{label}：</span>
          {isCommission?<span className="commission-chips">{value.split(" · ").map((v,i)=><b key={v} className={i===0?"blue":i===1?"orange":"pink"}>{v}</b>)}</span>:
          <strong className={missing?"muted":positive?"positive":negative?"negative":key==="sku"?"primary":""}>{value}</strong>}
        </div>;
      })}
    </div>
    <div className="intel-updated">数据更新：2026-09-25 04:{String(20+product.id).padStart(2,"0")}:01</div>

    {showSellers&&<div className="seller-popover-demo">
      <div className="seller-popover-head"><b>跟卖列表 · {product.sellerCount} 家</b><button onClick={()=>setShowSellers(false)}><X size={14}/></button></div>
      {Array.from({length:Math.min(product.sellerCount||0,6)},(_,i)=><div className="seller-line" key={i}><span className="seller-avatar">{String.fromCharCode(65+i)}</span><span>Seller {i+1}</span><strong>{rub(product.price-35+i*11)}</strong><em>★ {(4.5+(i%5)*.1).toFixed(1)}</em></div>)}
      {(product.sellerCount||0)>6&&<div className="seller-more">还有 {(product.sellerCount||0)-6} 家跟卖...</div>}
    </div>}
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

export function OzonPluginHomeDemo(){
  const [visibleFields,setVisibleFields]=useState<Set<DemoFieldKey>>(()=>new Set(FIELD_LABELS.map(([key])=>key)));
  const [settingsOpen,setSettingsOpen]=useState(false);
  const [panelOpen,setPanelOpen]=useState(false);
  const [cardsHidden,setCardsHidden]=useState(false);
  const [query,setQuery]=useState("");
  const displayed=useMemo(()=>PRODUCTS.filter(p=>!query||p.title.toLowerCase().includes(query.toLowerCase())||p.data.sku.includes(query)),[query]);

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
        {displayed.map(product=><article className="ozon-product-card" key={product.id}>
          <ProductVisual product={product}/>
          <div className="ozon-product-price"><b>{rub(product.price)}</b><s>{rub(product.oldPrice)}</s><em>-{product.discount}%</em></div>
          <div className="ozon-product-title">{product.title}</div>
          <div className="ozon-product-rating">★ {product.rating.toFixed(1)} <span>{new Intl.NumberFormat("ru-RU").format(product.reviews)} отзывов</span></div>
          {!cardsHidden&&<IntelCard product={product} visibleFields={visibleFields} onSettings={()=>setSettingsOpen(true)}/>}
        </article>)}
      </div>
      <div className="ozon-demo-end">已展示 30 个插件主页示例商品</div>
    </div>

    <button className="ozong-float-button" onClick={()=>setPanelOpen(v=>!v)}>✦</button>
    {panelOpen&&<aside className="ozong-control-demo">
      <header><div><span>✦</span><b>OzonG</b><small>控制中心</small></div><button onClick={()=>setPanelOpen(false)}><X size={14}/></button></header>
      <div className="ozong-control-body">
        <button className="primary">打开 Ozon Seller</button>
        <button>绑定 Cookie</button>
        <small>效率工具</small>
        <button className="dark">● 自动选品</button>
        <div className="two"><button>计算利润</button><button className="orange">定价工具</button></div>
        <small>快捷设置</small>
        <button onClick={()=>setCardsHidden(v=>!v)}>{cardsHidden?"显示商品卡":"隐藏商品卡"}</button>
        <button>进入 OzonG ERP</button>
      </div>
    </aside>}

    {settingsOpen&&<FieldSettings visibleFields={visibleFields} onClose={()=>setSettingsOpen(false)} onApply={next=>{setVisibleFields(next);setSettingsOpen(false)}}/>}
  </div>;
}
