import { useState } from "react";
import {
  ChevronDown,
  Heart,
  Package,
  Search,
  ShoppingCart,
  UserRound,
  X,
  Minus,
} from "lucide-react";
import "./ozon-plugin-shared.css";

export function OzonHeader({ storeSearch = false }: { storeSearch?: boolean }) {
  return (
    <div className="op-ozon-header">
      <div className="op-ozon-topbar">
        <div className="op-ozon-logo">OZON</div>
        <button className="op-catalog"><span>▦</span> Каталог</button>
        <div className="op-search">
          {storeSearch ? <span className="op-store-chip">Интелис <b>×</b></span> : <span className="op-search-scope">Везде <ChevronDown size={12}/></span>}
          <input placeholder={storeSearch ? "Искать в Магазине" : "Искать на Ozon"} />
          <button><Search size={18}/></button>
        </div>
        <div className="op-user-actions">
          <button><UserRound size={19}/><span>Войти</span></button>
          <button><Package size={19}/><span>Заказы</span></button>
          <button><Heart size={19}/><span>Избранное</span></button>
          <button><ShoppingCart size={19}/><span>Корзина</span></button>
        </div>
      </div>
      <div className="op-ozon-links">
        <span className="fresh">◕ Ozon fresh</span><span>▰ Ozon Банк</span><span>✈ Билеты, отели</span><span>▣ Для бизнеса⌄</span>
        <span>Скидки на летнее</span><span>Одежда</span><span>Электроника</span><span>Товары за 1₽</span><span>Сертификаты</span><span>Склад для Ozon</span>
        <b>Москва · Укажите адрес</b><span>🇷🇺 RU</span>
      </div>
    </div>
  );
}

type DrawerProps = {
  defaultOpen?: boolean;
  productPage?: boolean;
  onQuickListing?: () => void;
  onEditListing?: () => void;
  onEnterErp?: () => void;
  onHideCards?: () => void;
  cardsHidden?: boolean;
};

export function PluginControlDrawer({
  defaultOpen = true,
  productPage = false,
  onQuickListing,
  onEditListing,
  onEnterErp,
  onHideCards,
  cardsHidden = false,
}: DrawerProps) {
  const [open,setOpen]=useState(defaultOpen);
  const [collapsed,setCollapsed]=useState(false);
  const [notice,setNotice]=useState<{text:string;tone?:"info"|"success"|"error"}|null>(null);
  const [calculator,setCalculator]=useState<"profit"|"pricing"|null>(null);

  if(!open){
    return <button className="op-drawer-entrance" onClick={()=>setOpen(true)} title="打开 OzonG 控制中心">
      <img src="/auto-ozon/auto-ozon-logo.png" alt="Auto OZON"/>
    </button>;
  }

  return <>
    <aside className={"op-plugin-drawer "+(collapsed?"is-collapsed":"")}>
      <header>
        <div className="op-drawer-brand"><img src="/auto-ozon/auto-ozon-logo.png" alt="OzonG"/><div><strong>OzonG</strong><span>控制中心</span></div></div>
        <div className="op-drawer-window-actions">
          <button onClick={()=>setCollapsed(v=>!v)} title={collapsed?"展开":"最小化"}><Minus size={15}/></button>
          <button onClick={()=>setOpen(false)} title="关闭"><X size={15}/></button>
        </div>
      </header>
      {!collapsed&&<div className="op-drawer-body">
        <button className="op-action-primary" onClick={()=>{window.open("https://seller.ozon.ru/","_blank","noopener,noreferrer");setNotice({text:"已请求打开 Ozon Seller 新标签页。"})}}>打开 Ozon Seller</button>
        <button className="op-action-secondary" onClick={()=>setNotice({text:"Seller Cookie 已绑定（18 项）",tone:"success"})}>绑定 Cookie</button>

        <small>效率工具</small>
        <div className="op-tool-grid">
          {productPage&&<button className="quick" onClick={onQuickListing}>一键上架</button>}
          {productPage&&<button className="edit" onClick={onEditListing}>编辑上架</button>}
          {!productPage&&<button className="auto" onClick={()=>setNotice({text:"自动选品请在插件主页演示中使用。"})}>● 自动选品</button>}
          <button className="profit" onClick={()=>setCalculator("profit")}>计算利润</button>
          <button className="pricing" onClick={()=>setCalculator("pricing")}>定价工具</button>
        </div>

        {notice&&<div className={"op-inline-notice "+(notice.tone||"info")}>{notice.text}</div>}
        <small>快捷设置</small>
        <div className="op-utility-list">
          <button onClick={onHideCards}>{cardsHidden?"显示商品卡":"隐藏商品卡"}</button>
          <button onClick={onEnterErp}>进入 OzonG ERP</button>
        </div>
        <div className="op-version">插件版本 v0.0.19</div>
      </div>}
    </aside>
    {calculator&&<MiniCalculator mode={calculator} onClose={()=>setCalculator(null)}/>}
  </>;
}

function MiniCalculator({mode,onClose}:{mode:"profit"|"pricing";onClose:()=>void}) {
  const [sale,setSale]=useState(mode==="profit"?"242":"");
  const [cost,setCost]=useState("68");
  const [commission,setCommission]=useState("14");
  const [shipping,setShipping]=useState("32");
  const [target,setTarget]=useState("20");
  const [result,setResult]=useState<string|null>(null);

  const calc=()=>{
    const c=Number(cost)||0;
    const fee=(Number(commission)||0)/100;
    const ship=Number(shipping)||0;
    if(mode==="profit"){
      const s=Number(sale)||0;
      setResult("预计利润 ¥"+Math.max(-99999,s-c-ship-s*fee).toFixed(2));
    }else{
      const margin=(Number(target)||0)/100;
      const denom=1-fee-margin;
      const price=denom>0?(c+ship)/denom:0;
      setResult("建议售价 ¥"+price.toFixed(2));
    }
  };

  return <div className="op-mini-modal-layer">
    <div className="op-mini-calculator">
      <header><strong>{mode==="profit"?"OZON跨境利润计算器":"OZON跨境定价工具"}</strong><button onClick={onClose}>×</button></header>
      <div className="op-mini-form">
        {mode==="profit"&&<label>售价<input value={sale} onChange={e=>setSale(e.target.value)}/></label>}
        <label>采购成本<input value={cost} onChange={e=>setCost(e.target.value)}/></label>
        <label>类目佣金 %<input value={commission} onChange={e=>setCommission(e.target.value)}/></label>
        <label>物流估算<input value={shipping} onChange={e=>setShipping(e.target.value)}/></label>
        {mode==="pricing"&&<label>期望利润 %<input value={target} onChange={e=>setTarget(e.target.value)}/></label>}
        <button className="calc" onClick={calc}>开始计算</button>
        {result&&<div className="op-calc-result">{result}</div>}
      </div>
    </div>
  </div>;
}

type QuickRow = {
  id:number;
  title:string;
  sku:string;
  relation:string;
  sourcePrice:number;
  checked:boolean;
  offer:string;
  price:string;
  oldPrice:string;
};

const DEFAULT_ROWS:QuickRow[] = [
  {id:1,title:"Термоэтикетки 40x30 мм ТОП",sku:"1825601210",relation:"当前商品",sourcePrice:22.0,checked:true,offer:"ozg-306101-01",price:"",oldPrice:""},
  {id:2,title:"Термоэтикетки 40x30 мм ТОП",sku:"1825601211",relation:"颜色：白色",sourcePrice:24.5,checked:false,offer:"ozg-306101-02",price:"",oldPrice:""},
  {id:3,title:"Термоэтикетки 58x30 мм ТОП",sku:"1825601212",relation:"规格：升级款",sourcePrice:28.0,checked:false,offer:"ozg-306101-03",price:"",oldPrice:""},
  {id:4,title:"Термоэтикетки 80x40 мм ЭКО",sku:"1825601213",relation:"组合：2件装",sourcePrice:36.8,checked:false,offer:"ozg-306101-04",price:"",oldPrice:""},
];

export function QuickListingDemoModal({
  onClose,
  onEdit,
}:{onClose:()=>void;onEdit:()=>void}) {
  const [rows,setRows]=useState<QuickRow[]>(DEFAULT_ROWS.map(r=>({...r})));
  const [storeTab,setStoreTab]=useState<"stores"|"groups">("stores");
  const [stores,setStores]=useState([
    {id:1,name:"星桥家居",checked:true,warehouse:"莫斯科主仓",stock:"100"},
    {id:2,name:"远航百货",checked:false,warehouse:"",stock:"100"},
    {id:3,name:"北辰数码",checked:false,warehouse:"",stock:"100"},
  ]);
  const [brand,setBrand]=useState("none");
  const [imageOrder,setImageOrder]=useState("source");
  const [watermark,setWatermark]=useState("");
  const [batchPrice,setBatchPrice]=useState("");
  const [batchOld,setBatchOld]=useState("");
  const [multiplier,setMultiplier]=useState("2");
  const [result,setResult]=useState<{text:string;tone:"success"|"error"|"loading"}|null>(null);

  const selected=rows.filter(r=>r.checked);
  const updateRow=(id:number,patch:Partial<QuickRow>)=>setRows(current=>current.map(r=>r.id===id?{...r,...patch}:r));

  const applyPrice=(which:"price"|"old")=>{
    const raw=which==="price"?batchPrice:batchOld;
    const n=Number(raw);
    if(!Number.isFinite(n)||n<=0){setResult({text:"批量价格必须大于 0",tone:"error"});return;}
    setRows(current=>current.map(r=>r.checked?{...r,[which]:n.toFixed(2)}:r));
  };
  const applyMultiplier=()=>{
    const n=Number(multiplier);
    if(!Number.isFinite(n)||n<=0){setResult({text:"价格倍数必须大于 0",tone:"error"});return;}
    setRows(current=>current.map(r=>r.checked?{...r,price:(r.sourcePrice*n).toFixed(2),oldPrice:(r.sourcePrice*n*2).toFixed(2)}:r));
  };
  const submit=()=>{
    if(!stores.some(s=>s.checked)){setResult({text:"请至少选择一个上架店铺",tone:"error"});return;}
    if(stores.some(s=>s.checked&&!s.warehouse)){setResult({text:"每个上架店铺都必须选择对应的 Ozon 仓库",tone:"error"});return;}
    if(!selected.length){setResult({text:"请至少选择一个 SKU",tone:"error"});return;}
    if(selected.some(r=>!r.offer.trim())){setResult({text:"存在未填写货号的 SKU",tone:"error"});return;}
    if(selected.some(r=>!(Number(r.price)>0))){setResult({text:"请为已选 SKU 填写售价",tone:"error"});return;}
    if(selected.some(r=>Number(r.oldPrice)>0&&Number(r.oldPrice)<=Number(r.price))){setResult({text:"划线价必须大于实际售价，或留空",tone:"error"});return;}
    setResult({text:"正在创建后台上架任务…",tone:"loading"});
    window.setTimeout(()=>setResult({text:"上架任务已创建（Demo）",tone:"success"}),650);
  };

  return <div className="op-quick-layer">
    <section className="op-quick-modal">
      <header><h2>一键上架到 OZON</h2><button onClick={onClose}>×</button></header>
      <div className="op-quick-layout">
        <aside>
          <div className="op-store-tabs"><button className={storeTab==="stores"?"active":""} onClick={()=>setStoreTab("stores")}>选择店铺</button><button className={storeTab==="groups"?"active":""} onClick={()=>setStoreTab("groups")}>店铺分组</button></div>
          <div className="op-store-title"><span>{storeTab==="stores"?"目标店铺":"店铺分组"}</span><button onClick={()=>setResult({text:"仓库列表已刷新",tone:"success"})}>刷新仓库</button></div>
          {storeTab==="stores"?<div className="op-store-list">{stores.map(store=><div className={"op-store-card "+(store.checked?"selected":"")} key={store.id}>
            <label><input type="checkbox" checked={store.checked} onChange={e=>setStores(current=>current.map(s=>s.id===store.id?{...s,checked:e.target.checked}:s))}/><strong>{store.name}</strong></label>
            <span>Ozon API 已配置 · CNY</span>
            <div><select value={store.warehouse} onChange={e=>setStores(current=>current.map(s=>s.id===store.id?{...s,warehouse:e.target.value}:s))}><option value="">选择仓库</option><option>莫斯科主仓</option><option>喀山仓</option><option>叶卡捷琳堡仓</option></select><input value={store.stock} onChange={e=>setStores(current=>current.map(s=>s.id===store.id?{...s,stock:e.target.value}:s))}/></div>
          </div>)}</div>:<div className="op-group-list"><label><input type="checkbox"/>主力店铺组 <span>2 家</span></label><label><input type="checkbox"/>测试店铺组 <span>1 家</span></label></div>}
        </aside>

        <main>
          <div className="op-quick-settings">
            <label>品牌<select value={brand} onChange={e=>setBrand(e.target.value)}><option value="none">无品牌</option><option value="source">沿用当前品牌 · InteliLabel</option></select></label>
            <label>图片顺序<select value={imageOrder} onChange={e=>setImageOrder(e.target.value)}><option value="source">按来源顺序</option><option value="reverse">倒序</option></select></label>
            <label>水印<select value={watermark} onChange={e=>setWatermark(e.target.value)}><option value="">不使用</option><option value="brand">星桥品牌角标</option><option value="promo">促销角标</option></select></label>
            <label>上架币种<select disabled><option>人民币 CNY</option></select></label>
          </div>
          <div className="op-batch-bar">
            <span>批量设置</span><div>¥<input value={batchPrice} onChange={e=>setBatchPrice(e.target.value)} placeholder="售价"/></div><button onClick={()=>applyPrice("price")}>应用售价</button>
            <div>¥<input value={batchOld} onChange={e=>setBatchOld(e.target.value)} placeholder="划线价"/></div><button onClick={()=>applyPrice("old")}>应用划线价</button>
            <i/><span>约合人民币 ×</span><input className="ratio" value={multiplier} onChange={e=>setMultiplier(e.target.value)}/><button onClick={applyMultiplier}>应用倍数</button>
          </div>
          <div className="op-quick-table-wrap"><table><thead><tr><th></th><th>序号</th><th>主图</th><th>商品 / 关联属性</th><th>SKU</th><th>货号</th><th>原售价</th><th>我的售价</th><th>我的划线价</th></tr></thead>
            <tbody>{rows.map((row,index)=><tr key={row.id}><td><input type="checkbox" checked={row.checked} onChange={e=>updateRow(row.id,{checked:e.target.checked})}/></td><td>{index+1}</td><td><div className="op-label-thumb">40×30</div></td><td><strong>{row.title}</strong><span>{row.relation}</span></td><td className="sku">{row.sku}</td><td><input value={row.offer} onChange={e=>updateRow(row.id,{offer:e.target.value})}/></td><td><b>¥{row.sourcePrice.toFixed(2)}</b></td><td><div className="money">¥<input value={row.price} onChange={e=>updateRow(row.id,{price:e.target.value,oldPrice:row.oldPrice||((Number(e.target.value)||0)*2).toFixed(2)})} placeholder="售价"/></div></td><td><div className="money">¥<input value={row.oldPrice} onChange={e=>updateRow(row.id,{oldPrice:e.target.value})} placeholder="默认售价 × 2"/></div></td></tr>)}</tbody>
          </table></div>
          <div className="op-pagination"><button disabled>上一页</button><span>第 1 / 1 页</span><button disabled>下一页</button></div>
          <div className="op-footer-fields"><label>来源链接<input readOnly value="https://www.ozon.ru/product/1825601210/"/></label><label>货源备注<input placeholder="可选"/></label></div>
        </main>
      </div>
      <footer><div>{result&&<span className={result.tone}>{result.text}</span>}</div><div><button className="secondary" onClick={onEdit}>转编辑上架</button><button className="primary" onClick={submit}>一键上架到 OZON</button></div></footer>
    </section>
  </div>;
}
