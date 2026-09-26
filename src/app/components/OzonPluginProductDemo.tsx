import { useMemo, useState } from "react";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { OzonHeader, PluginControlDrawer, QuickListingDemoModal } from "./OzonPluginShared";
import "./ozon-plugin-product-demo.css";

const RECOMMENDED = Array.from({length:10},(_,index)=>({
  id:index+1,
  title:[
    "Термоэтикетки 50x25 мм ТОП",
    "Этикетки 50x80 мм 500 шт.",
    "Наклейки универсальные",
    "Самоклеящаяся термоэтикетка",
    "Термоэтикетки 80x40 мм ЭКО",
  ][index%5],
  price:[244,710,159,164,572,553,432,1006,523,286][index],
  old:[940,890,1950,760,902,1687,1290,4000,1590,920][index],
  sales:[901,315,1236,1640,570,150,490,39,80,830][index],
}));

export function OzonPluginProductDemo({
  onEnterErp,
  onEditListing,
}:{
  onEnterErp:()=>void;
  onEditListing:()=>void;
}) {
  const [quickOpen,setQuickOpen]=useState(false);
  const [cardsHidden,setCardsHidden]=useState(false);
  const [liked,setLiked]=useState(false);
  const [cartCount,setCartCount]=useState(0);
  const [variant,setVariant]=useState(0);
  const [notice,setNotice]=useState("");
  const variants=useMemo(()=>[
    {qty:"1",price:"242 ₽/шт",discount:"Выгода 22%"},
    {qty:"5",price:"190 ₽/шт",discount:"Выгода 27%"},
    {qty:"6",price:"177 ₽/шт",discount:"Выгода 35%"},
    {qty:"24",price:"146 ₽/шт",discount:"Выгода 40%"},
    {qty:"36",price:"158 ₽/шт",discount:"Выгода 35%"},
  ],[]);

  const edit=()=>{
    setQuickOpen(false);
    onEditListing();
  };

  return <div className="op-product-demo">
    <div className="op-product-scroll">
      <OzonHeader/>
      <div className="op-product-breadcrumb">Канцелярские товары · Бумажная продукция · Этикетки · InteliLabel</div>

      <section className="op-product-main">
        <aside className="op-product-thumbs">
          {Array.from({length:8},(_,i)=><button key={i} className={i===0?"active":""}><span>{i===7?"▶":"40×30"}</span></button>)}
        </aside>

        <div className="op-product-image">
          <div className="label-sheet">
            <div className="sheet-heading">Термоэтикетки</div>
            <div className="roll-visual"><div className="roll-hole"/><div className="roll-tail"/></div>
            <div className="measure top">40 мм</div><div className="measure right">30 мм</div>
            <div className="top-mark">ТОП</div><div className="count-mark"><b>1</b> ×1000 эт.</div>
          </div>
        </div>

        <div className="op-product-info">
          <div className="product-brand">▣ Постоплата ›</div>
          <h1>Термоэтикетки 40x30 мм ТОП (1 рулон на 1000 эт. втулка 40 мм./D85 мм)</h1>
          <div className="rating"><Star size={16} fill="#f5a000" color="#f5a000"/> 5 · <span>218 отзывов</span> · <span>5 вопросов</span></div>
          <p className="one-item">Единиц в одном товаре:</p>
          <div className="variant-grid">{variants.map((item,i)=><button className={variant===i?"active":""} key={i} onClick={()=>setVariant(i)}><em>{item.discount}</em><b>{item.qty}</b><span>{item.price}</span></button>)}</div>
          <div className="spec-table">
            <div><span>Тип</span><b>Этикетка</b></div><div><span>Количество этикеток, шт</span><b>1001</b></div><div><span>Назначение</span><b>для печати</b></div><div><span>Единиц в одном товаре</span><b>{variants[variant].qty}</b></div><div><span>Тип печати</span><b>Термопечать</b></div>
          </div>
          <h3>Фото и видео покупателей</h3>
          <div className="buyer-media">{Array.from({length:5},(_,i)=><button key={i}>{i===4?"+16":"◉"}</button>)}</div>
        </div>

        <aside className="op-product-buybox">
          <div className="sale-line"><span>● Распродажа</span><b>5 дней до конца</b></div>
          <div className="buy-price"><strong>242 ₽</strong><small>269 ₽ <s>951 ₽</s></small></div>
          <p>242 ₽ за 1 шт.</p>
          <button className="later" onClick={()=>setNotice("Оплата позже добавлена в Demo-корзину")}>Оплатить позже</button>
          <div className="buy-actions"><button onClick={()=>setCartCount(v=>v+1)}><ShoppingCart size={16}/> В корзину {cartCount>0?"("+cartCount+")":""}</button><button className={liked?"liked":""} onClick={()=>setLiked(v=>!v)}><Heart size={16} fill={liked?"currentColor":"none"}/></button></div>

          {!cardsHidden&&<div className="op-detail-intel-card">
            <div className="intel-head"><span className="mini-auto"><img src="/auto-ozon/Auto_ozon2.png"/><img src="/auto-ozon/Auto_ozon1.png"/></span><button onClick={()=>setNotice("商品已加入采集箱（Demo）")}>＋</button><button onClick={()=>setNotice("风险规则：推广费占比偏高")}>⚠</button><button onClick={()=>setNotice("字段显示设置已打开（Demo）")}>⚙</button></div>
            <div className="intel-grid">
              <span>类目：<b>标签</b></span><span>销售佣金：<b className="chips">12%　14%　16%</b></span><span>SKU：<b className="blue">1825601210</b></span><span>品牌：<b className="blue">InteliLabel</b></span><span>月销量：<b className="blue">6 件</b></span><span>月销售额：<b className="blue">¥99</b></span><span>销售变化：<b className="red">-74%</b></span><span>近30天日均销量：<b className="blue">0.2</b></span><span>推广费占比：<b className="red">21.7%</b></span><span>促销活动转化率：<b className="blue">100.00%</b></span>
            </div>
            <div className="detail-actions"><button onClick={()=>setQuickOpen(true)}>一键上架</button><button onClick={edit}>编辑上架</button></div>
          </div>}
        </aside>
      </section>

      <section className="op-recommend">
        <h2>Рекомендуем также</h2>
        <div className="op-recommend-grid">{RECOMMENDED.slice(0,5).map((item,i)=><article key={item.id}>
          <button className="heart">♡</button><div className="rec-image"><div className={"rec-roll r"+i}>ТОП</div></div>
          <div className="rec-price"><b>{item.price} ₽</b><s>{item.old} ₽</s><em>-{Math.round((1-item.price/item.old)*100)}%</em></div>
          <p>{item.title}</p><span>★ 4.{8+i%2} · {item.sales} отзывов</span>
          <button className="delivery" onClick={()=>setNotice("Товар добавлен в корзину (Demo)")}>🛍 Завтра</button>
        </article>)}</div>
      </section>

      <section className="op-recommend second">
        <h2>Покупают вместе</h2>
        <div className="op-recommend-grid">{RECOMMENDED.slice(5).map((item,i)=><article key={item.id}>
          <button className="heart">♡</button><div className="rec-image alt"><div className={"rec-roll r"+i}>40×30</div></div>
          <div className="rec-price"><b>{item.price} ₽</b><s>{item.old} ₽</s><em>-{Math.round((1-item.price/item.old)*100)}%</em></div>
          <p>{item.title}</p><span>★ 4.9 · {item.sales} отзывов</span><button className="delivery">🛍 1 октября</button>
        </article>)}</div>
      </section>

      <section className="op-description"><h2>Описание</h2><div><p>Ссылки на другие размеры этикеток в магазине:</p><p className="links">квадратные и круглые этикетки<br/>15x15, 16x16 ПП, 20x20 для честного знака<br/>30x10, 30x20, 30x30</p></div></section>
      {notice&&<div className="op-page-toast" onClick={()=>setNotice("")}>{notice}</div>}
    </div>

    <PluginControlDrawer
      defaultOpen
      productPage
      cardsHidden={cardsHidden}
      onQuickListing={()=>setQuickOpen(true)}
      onEditListing={edit}
      onHideCards={()=>setCardsHidden(v=>!v)}
      onEnterErp={onEnterErp}
    />
    {quickOpen&&<QuickListingDemoModal onClose={()=>setQuickOpen(false)} onEdit={edit}/>}
  </div>;
}
