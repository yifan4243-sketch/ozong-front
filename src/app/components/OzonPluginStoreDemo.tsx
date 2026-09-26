import { useMemo, useState } from "react";
import { Heart } from "lucide-react";
import { OzonHeader, PluginControlDrawer } from "./OzonPluginShared";
import "./ozon-plugin-store-demo.css";

type StoreProduct = {
  id:number;
  sku:string;
  title:string;
  price:number;
  oldPrice:number;
  monthlySales:number;
  listedDays:number;
  brand:string;
  commission:[number,number,number];
  salesChange:number;
  adRate:number;
  clickRate:number;
  accent:number;
};

const TITLES=[
  "Термоэтикетки 58x90 мм ТОП",
  "Термоэтикетки 58x30 мм ТОП",
  "Термоэтикетки 80x40 мм ЭКО",
  "Самоклеящаяся термоэтикетка",
  "Этикетки для маркетплейсов",
  "Термоэтикетки 50x25 мм",
  "Наклейки белые 40x30 мм",
  "Термобумага для принтера",
  "Этикетки 75x120 мм",
  "Рулон этикеток 30x20 мм",
];
const PRICES=[267,267,586,572,244,319,428,359,710,159,164,553,432,1006,523,286,399,618,188,742,229,319,465,578,345,699,198,532,329,455];

const STORE_PRODUCTS:StoreProduct[]=Array.from({length:30},(_,i)=>{
  const sales=[4485,3430,1744,1122,976,732,521,513,377,369,336,235,221,194,180,167,154,143,129,118,106,98,87,76,66,55,43,31,20,8][i];
  return {
    id:i+1,
    sku:String(2770469377-i*573829),
    title:TITLES[i%TITLES.length],
    price:PRICES[i],
    oldPrice:Math.round(PRICES[i]*(1.55+(i%5)*.18)),
    monthlySales:sales,
    listedDays:[394,2381,779,508,1225,494,211,463,851,88,193,47,612,304,90,73,41,680,124,260,420,155,96,330,57,720,180,66,25,14][i],
    brand:i%7===0?"No name":"InteliLabel",
    commission:[12+(i%3)*2,14+(i%2)*2,16] as [number,number,number],
    salesChange:i%4===0?106-i*2:i%4===1?-(12+i):i%4===2?180-i*3:0,
    adRate:Number((1.4+(i*2.3)%28).toFixed(1)),
    clickRate:Number((1.8+(i*1.7)%23).toFixed(2)),
    accent:i%6,
  };
});

function StoreIntelCard({product}:{product:StoreProduct}){
  const [selected,setSelected]=useState(false);
  const [highlighted,setHighlighted]=useState(false);
  const [settingsActive,setSettingsActive]=useState(false);
  const monthlyGmv=Math.round(product.monthlySales*product.price*.087);
  const dailySales=product.monthlySales/30;
  const dailyGmv=monthlyGmv/30;
  const averagePrice=Math.max(18,Math.round(product.price*.087));
  const promoDays=6+(product.id*3)%24;
  const promoDiscount=8+(product.id*7)%42;
  const promoConversion=Number((4.8+(product.id*2.71)%28).toFixed(2));
  const paidDays=4+(product.id*5)%25;
  const paidBuyers=36+(product.id*137)%4200;
  const cardViews=4200+(product.id*7341)%188000;
  const cardCart=Number((3.3+(product.id*1.37)%18).toFixed(2));
  const searchViews=6500+(product.id*4927)%156000;
  const searchCart=Number((.4+(product.id*.83)%11).toFixed(2));
  const displayConversion=Number((.35+(product.id*.69)%14).toFixed(2));
  const returnRate=Number((.4+(product.id*.47)%8).toFixed(2));
  const sellerCount=2+(product.id%7);
  const followMin=Math.max(12,averagePrice-(3+product.id%5));
  const followMax=averagePrice+(8+product.id%11);
  const length=120+(product.id%6)*20;
  const width=40+(product.id%5)*10;
  const height=30+(product.id%4)*10;
  const weight=180+(product.id*47)%980;
  const month=String(1+((product.id+1)%8)).padStart(2,"0");
  const day=String(3+(product.id*3)%25).padStart(2,"0");

  return <section className={"op-store-intel "+(highlighted?"highlighted ":"")+(settingsActive?"settings-active":"")}>
    <div className="op-store-intel-head">
      <span className="op-store-auto-logo" aria-label="Auto OZON">
        <span className="op-store-auto-mark-frame"><img className="op-store-auto-mark" src="/auto-ozon/Auto_ozon2.png" alt=""/></span>
        <span className="op-store-auto-word-frame"><img className="op-store-auto-word" src="/auto-ozon/Auto_ozon1.png" alt="Auto OZON"/></span>
      </span>
      <span className="op-store-intel-actions">
        <button className={"op-store-intel-action "+(selected?"done":"")} title="加入 ERP 选品池" onClick={()=>setSelected(v=>!v)}>{selected?"✓":"＋"}</button>
        <button className={"op-store-intel-action warning "+(highlighted?"active":"")} title="高亮条件" onClick={()=>setHighlighted(v=>!v)}>⚙</button>
        <button className={"op-store-intel-action "+(settingsActive?"active":"")} title="字段设置" onClick={()=>setSettingsActive(v=>!v)}>⚙</button>
      </span>
    </div>
    <div className="op-store-intel-lines">
      <div className="op-store-intel-row"><span>类目</span><b>标签</b></div>
      <div className="op-store-intel-row"><span>销售佣金</span><b className="op-store-commission"><i>{product.commission[0]}%</i><i>{product.commission[1]}%</i><i>{product.commission[2]}%</i></b></div>
      <div className="op-store-intel-row"><span>SKU</span><b className="blue">{product.sku}</b></div>
      <div className="op-store-intel-row"><span>品牌</span><b className="blue">{product.brand}</b></div>
      <div className="op-store-intel-row"><span>月销量</span><b className="blue">{product.monthlySales.toLocaleString("zh-CN")} 件</b></div>
      <div className="op-store-intel-row"><span>月销售额</span><b className="blue">¥{monthlyGmv.toLocaleString("zh-CN")}</b></div>
      <div className="op-store-intel-row"><span>销售变化</span><b className={product.salesChange>=0?"green":"red"}>{product.salesChange>0?"+":""}{product.salesChange}%</b></div>
      <div className="op-store-intel-row"><span>近30天日均销量</span><b className="blue">{dailySales.toFixed(1)}</b></div>
      <div className="op-store-intel-row"><span>近30天日均销售额</span><b className="blue">¥{Math.round(dailyGmv).toLocaleString("zh-CN")}</b></div>
      <div className="op-store-intel-row"><span>均价</span><b>¥{averagePrice}</b></div>
      <div className="op-store-intel-row"><span>推广费占比</span><b className={product.adRate>18?"red":"green"}>{product.adRate}%</b></div>
      <div className="op-store-intel-row"><span>参与促销天数</span><b>{promoDays}</b></div>
      <div className="op-store-intel-row"><span>参与促销的折扣</span><b>{promoDiscount}%</b></div>
      <div className="op-store-intel-row"><span>促销活动转化率</span><b className="blue">{promoConversion.toFixed(2)}%</b></div>
      <div className="op-store-intel-row"><span>付费推广天数</span><b className="blue">{paidDays}</b></div>
      <div className="op-store-intel-row"><span>付费买家</span><b className="blue">{paidBuyers.toLocaleString("zh-CN")}</b></div>
      <div className="op-store-intel-row"><span>商品卡浏览量</span><b>{cardViews.toLocaleString("zh-CN")}</b></div>
      <div className="op-store-intel-row"><span>商品卡加购率</span><b>{cardCart.toFixed(2)}%</b></div>
      <div className="op-store-intel-row"><span>搜索目录浏览量</span><b>{searchViews.toLocaleString("zh-CN")}</b></div>
      <div className="op-store-intel-row"><span>搜索目录加购率</span><b>{searchCart.toFixed(2)}%</b></div>
      <div className="op-store-intel-row"><span>展示转化率</span><b>{displayConversion.toFixed(2)}%</b></div>
      <div className="op-store-intel-row"><span>商品点击率</span><b className={product.clickRate>3?"green":"red"}>{product.clickRate}%</b></div>
      <div className="op-store-intel-row"><span>发货模式</span><b className="blue">{product.id%4===0?"FBO":"FBS"}</b></div>
      <div className="op-store-intel-row"><span>退货取消率</span><b className="green">{returnRate.toFixed(2)}%</b></div>
      <div className="op-store-intel-row"><span>长 × 宽 × 高</span><b>{length} × {width} × {height}mm</b></div>
      <div className="op-store-intel-row"><span>重量</span><b>{weight} g</b></div>
      <div className="op-store-intel-row"><span>上架时间</span><b className="green">2026-{month}-{day}（{product.listedDays}天）</b></div>
      <div className="op-store-intel-row"><span>跟卖列表</span><b className="blue">{sellerCount} 个卖家</b></div>
      <div className="op-store-intel-row"><span>跟卖最低价</span><b className="red">¥{followMin}</b></div>
      <div className="op-store-intel-row"><span>跟卖最高价</span><b className="red">¥{followMax}</b></div>
    </div>
    <div className="op-store-intel-updated">数据截至：2026-09-26 07:{String(40+product.id%19).padStart(2,"0")}:02</div>
  </section>;
}

export function OzonPluginStoreDemo({onEnterErp}:{onEnterErp:()=>void}){
  const [rankingOpen,setRankingOpen]=useState(false);
  const [cardsHidden,setCardsHidden]=useState(false);
  const [sort,setSort]=useState("Популярные");
  const [priceMin,setPriceMin]=useState("199");
  const [priceMax,setPriceMax]=useState("42059");
  const [query,setQuery]=useState("");
  const ranking=useMemo(()=>[...STORE_PRODUCTS].sort((a,b)=>b.monthlySales-a.monthlySales),[]);
  const visible=useMemo(()=>STORE_PRODUCTS.filter(p=>{
    if(query&&!p.title.toLowerCase().includes(query.toLowerCase())&&!p.sku.includes(query)) return false;
    const min=Number(priceMin)||0; const max=Number(priceMax)||Infinity;
    return p.price>=min&&p.price<=max;
  }),[query,priceMin,priceMax]);

  return <div className="op-store-demo">
    <div className="op-store-scroll">
      <OzonHeader storeSearch/>
      <section className="op-store-profile">
        <div className="op-store-avatar">●●</div>
        <div><h1>Интелис</h1><p>▣ Магазин　★ 4,9　▣ 14,4K отзывов　▣ 23,9K заказов</p></div>
        <button>💬 Написать</button><button>♥ 233</button><button>↗</button><button>ⓘ</button>
      </section>
      <div className="op-store-banner">
        <div className="banner-copy"><strong>Используйте поле «искать по магазину»</strong><span>Этикетки <b>ТОП</b> или <b>58x40</b> или <b>40x30</b> ПП или <b>20x20</b></span><span>Риббон <b>60мм</b> или WAX или Resin или textile</span><span>Для упаковки Короб или Скотч или Пакет</span></div>
        <div className="banner-rolls"><i/><i/><i/></div>
      </div>

      <div className="op-store-body">
        <aside className="op-store-filters">
          <h3>Категория</h3><button>Электроника</button><button>Дом и сад</button><button>Хобби и творчество</button><button>Канцелярские товары</button>
          <h3>Распродажа</h3><label className="switch"><input type="checkbox"/><span/></label>
          <h3>Доставка</h3>{["Неважно","Сегодня","Завтра","До 3 дней","До 7 дней"].map((t,i)=><label className="radio" key={t}><input type="radio" name="delivery" defaultChecked={i===0}/>{t}</label>)}
          <h3>Цена ⓘ</h3><div className="price-range"><input value={priceMin} onChange={e=>setPriceMin(e.target.value)}/><input value={priceMax} onChange={e=>setPriceMax(e.target.value)}/></div>
          {["до 500 ₽","500–1000 ₽","1000–2000 ₽","2000 ₽ и дороже","Неважно"].map((t,i)=><label className="radio" key={t}><input type="radio" name="price" defaultChecked={i===4}/>{t}</label>)}
          <h3>Бренд</h3>{["NOVAROLL","Lomond","CAS","TSC","Honeywell"].map((b,i)=><div className="brand-filter" key={b}><span className={"bf"+i}>{b.slice(0,2)}</span>{b}</div>)}
        </aside>

        <main className="op-store-products">
          <div className="op-store-toolbar">
            <select value={sort} onChange={e=>setSort(e.target.value)}><option>Популярные</option><option>Сначала дешевые</option><option>Сначала дорогие</option></select>
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Поиск по товарам"/>
          </div>

          <div className="op-ranking-wrap" onMouseEnter={()=>setRankingOpen(true)} onMouseLeave={()=>window.setTimeout(()=>setRankingOpen(false),180)}>
            <div className="op-ranking-summary">
              <span>该店铺总商品数量： <strong>30<b>个</b></strong></span>
              <button onFocus={()=>setRankingOpen(true)} onClick={()=>setRankingOpen(v=>!v)}>月销量排行榜 <em>30/30</em></button>
            </div>
            {rankingOpen&&<div className="op-ranking-popover" onMouseEnter={()=>setRankingOpen(true)}>
              <div className="title">月销量前 30 名</div>
              <div className="table-scroll"><table><thead><tr><th>SKU</th><th>月销量</th><th>上架时间</th></tr></thead><tbody>
                {ranking.map(p=><tr key={p.id}><td>{p.sku}</td><td>{p.monthlySales.toLocaleString("zh-CN")}</td><td>{p.listedDays}天前</td></tr>)}
              </tbody></table></div>
            </div>}
          </div>

          <div className="op-store-grid">{visible.map((product)=><article className="op-store-product-card" key={product.id}>
            <button className="store-heart"><Heart size={18}/></button>
            <div className={"op-store-product-image a"+product.accent}><div className="label-product-art"><span>Термоэтикетки</span><b>{[58,40,80,50][product.id%4]} мм</b><strong>ТОП</strong><em>1×{[300,500,1000][product.id%3]} эт.</em></div></div>
            <div className="dots">●••••</div>
            <div className="store-price"><b>{product.price} ₽</b><s>{product.oldPrice} ₽</s><em>-{Math.round((1-product.price/product.oldPrice)*100)}%</em></div>
            <p>{product.title}</p><span className="review">★ 4.{8+product.id%2}　● {Math.max(2,Math.round(product.monthlySales*1.8)).toLocaleString("ru-RU")} отзывов</span>
            <button className="store-delivery">🛍 Завтра</button>
            {!cardsHidden&&<StoreIntelCard product={product}/>}
          </article>)}</div>
        </main>
      </div>
    </div>
    <PluginControlDrawer defaultOpen cardsHidden={cardsHidden} onHideCards={()=>setCardsHidden(v=>!v)} onEnterErp={onEnterErp}/>
  </div>;
}
