import { useMemo, useState } from "react";
import {
  Camera,
  Copy,
  Globe2,
  Grid2X2,
  Heart,
  Headphones,
  Home,
  MessageSquare,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  Store,
  X,
} from "lucide-react";
import "./alibaba-1688-demo.css";

type Props = {
  onEnterErp: () => void;
};

const skuRows = [
  { id: 1, name: "新款白色小刮无绒 4.5×10cm", price: "0.45", stock: "1978229" },
  { id: 2, name: "新款白色小刮带绒 4.5×10cm", price: "0.65", stock: "7006950" },
];

const thumbs = ["视频", "讲解", "细节", "实拍", "无绒", "带绒", "侧面"];

function ProductVisual({ mode }: { mode: number }) {
  return (
    <div className={"ali-product-visual visual-" + mode}>
      <div className="ali-scraper scraper-a"><span /></div>
      <div className="ali-scraper scraper-b"><span /></div>
      <div className="ali-video-play">▶</div>
      <div className="ali-video-bar"><b>▶</b><span>00:00</span><i /><span>00:20</span><b>◼</b></div>
      <div className="ali-main-video-chip">主图视频</div>
    </div>
  );
}

export function Alibaba1688Demo({ onEnterErp }: Props) {
  const [activeThumb, setActiveThumb] = useState(0);
  const [activeSku, setActiveSku] = useState(0);
  const [qty, setQty] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [drawerCollapsed, setDrawerCollapsed] = useState(false);
  const [toast, setToast] = useState("");
  const [favorited, setFavorited] = useState(false);
  const selected = useMemo(() => skuRows[activeSku], [activeSku]);

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 1800);
  };

  return (
    <div className="ali-demo">
      <div className="ali-scroll">
        <header className="ali-header">
          <div className="ali-logo">1688</div>
          <div className="ali-search">
            <input defaultValue="宿舍小锅" />
            <button className="store-search">搜本店</button>
            <button className="search-btn"><Search size={17}/> 搜索</button>
          </div>
          <button className="ali-image-search"><Camera size={17}/> 以图搜款</button>
          <div className="ali-header-icons">
            <button><Home size={19}/><span>首页</span></button>
            <button><Grid2X2 size={19}/><span>分类</span></button>
            <button className="with-dot"><ShoppingCart size={20}/><i>3</i><span>进货单</span></button>
            <button><MessageSquare size={19}/><span>消息</span></button>
            <button><Globe2 size={20}/><span>CN</span></button>
          </div>
        </header>

        <main className="ali-page">
          <section className="ali-seller-card">
            <div className="ali-seller-main">
              <h2>揭阳市榕城区阳美胶粘纸厂 <span>⌄</span></h2>
              <div><b>实力商家</b><span>入驻17年</span><span>主营：美容养护</span></div>
              <p><strong>AI 四星供应链</strong> ☆ ☆ ☆ ☆ <span>品质达标率 100%</span><span>综合履约率 99.9%</span><span>店铺回头率 62%</span></p>
            </div>
            <div className="ali-seller-actions">
              <button><Heart size={16}/> 关注</button>
              <button><Headphones size={16}/> 客服</button>
              <button><Store size={16}/> 商品</button>
            </div>
          </section>

          <section className="ali-product-grid">
            <div className="ali-gallery">
              <div className="ali-thumbs">
                {thumbs.map((item,index)=>(
                  <button key={item} className={activeThumb===index?"active":""} onClick={()=>setActiveThumb(index)}>
                    <div className={"ali-thumb-art t"+index}><span /></div>
                    <b>{item}</b>
                  </button>
                ))}
              </div>
              <ProductVisual mode={activeThumb}/>
            </div>

            <div className="ali-info">
              <div className="ali-title-strip">
                <div className="ali-badges"><b>严选</b><strong>镇店之宝</strong></div>
                <h1>新款白色贴膜刮板广告玻璃贴膜工具汽车美容刮刀带布小小白刮板</h1>
                <div className="ali-score"><span>AI严选指数 4.6 ›</span><span>200+人好评</span><span>商品复购率56.52%</span></div>
              </div>

              <div className="ali-buy-card">
                <div className="ali-price-row"><b>¥0.45</b><span>~</span><b>¥0.65</b><em>1只起批</em><i>60天老客价⌄</i><strong>已售10万+只</strong></div>
                <div className="ali-coupon">首单减1元 <span>⌄</span></div>
                <div className="ali-shipping">🚚 广东揭阳送至 福建厦门　⌄　<span>现在付款，预计3天达</span>　⌄　运费 <b>¥5起</b></div>
                <div className="ali-guarantee">◉ <b>敢赔付</b>　<b>品质不符包赔</b>　<b>严选晚发必赔</b>　<span>退货包运费</span>　<span>售后延长⌄</span></div>
              </div>

              <div className="ali-sku-section">
                <div className="ali-sku-label">颜色</div>
                {skuRows.map((row,index)=>(
                  <div className={"ali-sku-row "+(activeSku===index?"active":"")} key={row.id} onClick={()=>setActiveSku(index)}>
                    <div className={"ali-sku-mini m"+index}><span /></div>
                    <strong>{row.name}</strong>
                    <b>¥{row.price}</b>
                    <span>库存{row.stock}只</span>
                    <div className="ali-stepper">
                      <button onClick={(e)=>{e.stopPropagation();setQty(Math.max(0,qty-1))}}><Minus size={13}/></button>
                      <em>{activeSku===index?qty:0}</em>
                      <button onClick={(e)=>{e.stopPropagation();setActiveSku(index);setQty(q=>q+1)}}><Plus size={13}/></button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="ali-buy-actions">
                <button onClick={()=>flash("立即下单：已选择 "+selected.name+"（Demo）")}>立即下单</button>
                <button onClick={()=>flash("已加入进货单（Demo）")}>加采购车</button>
                <button onClick={()=>flash("跨境货通功能演示")}>跨境货通</button>
              </div>

              <div className="ali-dropship">
                <div className="ali-drop-head"><h2>密文代发</h2><span>淘</span><span>拼</span><span>抖</span><span>快</span><button>立即铺货</button></div>
                <div className="ali-drop-price"><span>1件包邮 <b>¥3.75</b></span><span>2件 <b>¥0.45</b></span><em>官方仓退货,晚批必赔⌄</em></div>
                <div className="ali-metrics">
                  <span>商家代发热度 <b>786</b></span>
                  <span>近30天代发数量 <b>100以内</b></span>
                  <span>48h揽收率 <b>100.00%</b></span>
                  <span>24h揽收率 <b>47.00%</b></span>
                  <span>铺货分销商数 <b>10000+</b></span>
                  <span>代发品质达标率 <b>100.00%</b></span>
                </div>
              </div>
            </div>
          </section>

          <section className="ali-detail-placeholder">
            <h2>商品详情</h2>
            <div className="ali-detail-grid">
              <article><b>材质</b><span>PP / 橡胶刮条</span></article>
              <article><b>用途</b><span>玻璃贴膜、汽车美容、墙纸施工</span></article>
              <article><b>规格</b><span>4.5 × 10 cm</span></article>
              <article><b>发货地</b><span>广东揭阳</span></article>
            </div>
          </section>
        </main>
      </div>

      <aside className="ali-side-rail">
        <button><Headphones size={18}/>客服</button>
        <button><Grid2X2 size={18}/>APP</button>
        <button><Search size={18}/>全网比价</button>
        <button><Copy size={18}/>复制链接</button>
      </aside>

      {drawerOpen ? (
        <aside className={"ali-ozong-drawer "+(drawerCollapsed?"collapsed":"")}>
          <header>
            <div className="ali-drawer-brand">
              <img src="/auto-ozon/auto-ozon-logo.png" alt="OzonG"/>
              <div><strong>OzonG</strong><span>1688 商品采集 / 一键上架</span></div>
            </div>
            <div>
              <button onClick={()=>setDrawerCollapsed(v=>!v)} title="最小化"><Minus size={15}/></button>
              <button onClick={()=>setDrawerOpen(false)} title="关闭"><X size={15}/></button>
            </div>
          </header>
          {!drawerCollapsed&&<div className="ali-drawer-body">
            <button className="ali-drawer-primary" onClick={()=>flash("已读取当前 1688 商品及 2 个 SKU，进入一键上架流程（Demo）")}>一键上架至 Ozon</button>
            <button className="ali-drawer-primary second" onClick={()=>flash("商品已采集到 OzonG 采集箱（Demo）")}>采集到 OzonG</button>
            <button className="ali-drawer-enter" onClick={onEnterErp}>进入 OzonG</button>
            <div className="ali-source-summary"><span>当前货源</span><b>¥0.45–0.65</b><em>2 个 SKU · 广东揭阳</em></div>
            <div className="ali-drawer-version">插件版本 v0.0.19</div>
          </div>}
        </aside>
      ) : (
        <button className="ali-drawer-entry" onClick={()=>setDrawerOpen(true)}><img src="/auto-ozon/auto-ozon-logo.png" alt="OzonG"/></button>
      )}

      {toast&&<div className="ali-toast" onClick={()=>setToast("")}>{toast}</div>}
    </div>
  );
}
