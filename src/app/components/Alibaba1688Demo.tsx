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

type ListingRow = {
  id: number;
  name: string;
  skuId: string;
  offerId: string;
  sourcePrice: string;
  stock: string;
  selected: boolean;
  deleted: boolean;
  manualPrice: string;
  weight: string;
};

const pageSkuRows = [
  { id: 1, name: "新款白色小刮无绒 4.5×10cm", price: "0.45", stock: "1978229" },
  { id: 2, name: "新款白色小刮带绒 4.5×10cm", price: "0.65", stock: "7006950" },
];

const listingSeed: ListingRow[] = [
  { id: 1, name: "颜色：新款白色小刮带绒 4.5*10cm", skuId: "5247255030042", offerId: "734320139100-1", sourcePrice: "3.95", stock: "7006950", selected: true, deleted: false, manualPrice: "", weight: "" },
  { id: 2, name: "颜色：新款白色小刮无绒 4.5*10cm", skuId: "5247255030041", offerId: "734320139100-2", sourcePrice: "3.75", stock: "1978229", selected: true, deleted: false, manualPrice: "", weight: "" },
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

function ModalSkuThumb({ dark = false }: { dark?: boolean }) {
  return <div className={"ali-modal-thumb " + (dark ? "dark" : "light")}><span /></div>;
}

function SkuPickerModal({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: (skuIds: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>(listingSeed.map((row) => row.skuId));
  const [search, setSearch] = useState("");

  const visible = listingSeed.filter((row) =>
    (row.name + " " + row.skuId).toLowerCase().includes(search.trim().toLowerCase())
  );
  const allSelected = selected.length === listingSeed.length;

  const toggle = (skuId: string) => {
    setSelected((current) =>
      current.includes(skuId) ? current.filter((id) => id !== skuId) : [...current, skuId]
    );
  };

  return (
    <div className="ali-modal-layer sku-picker-layer">
      <section className="ali-sku-picker-modal" role="dialog" aria-modal="true" aria-label="选择需要采集的 SKU">
        <header>
          <div>
            <h2>选择需要采集的 SKU</h2>
            <p>默认全部勾选。取消不需要的规格后，只会把已选 SKU 保存到 OzonG。</p>
          </div>
          <button className="ali-modal-x" onClick={onCancel} aria-label="关闭"><X size={20}/></button>
        </header>

        <div className="ali-picker-tools">
          <label>
            <input
              type="checkbox"
              checked={allSelected}
              ref={(node) => { if (node) node.indeterminate = selected.length > 0 && !allSelected; }}
              onChange={(event) => setSelected(event.target.checked ? listingSeed.map((row) => row.skuId) : [])}
            />
            全选
          </label>
          <input
            autoFocus
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="搜索规格、SKU ID"
          />
        </div>

        <div className="ali-picker-list">
          {visible.map((row, index) => (
            <label className="ali-picker-row" key={row.skuId}>
              <input type="checkbox" checked={selected.includes(row.skuId)} onChange={() => toggle(row.skuId)} />
              <ModalSkuThumb dark={index === 0} />
              <div className="ali-picker-info">
                <strong>{row.name}</strong>
                <div><span>SKU {row.skuId}</span><span>库存 {row.stock}</span><span>重量 —</span></div>
              </div>
              <b>¥{row.sourcePrice}</b>
            </label>
          ))}
        </div>

        <footer>
          <span>已选择 {selected.length} / {listingSeed.length} 个 SKU</span>
          <div>
            <button onClick={onCancel}>取消</button>
            <button className="primary" disabled={!selected.length} onClick={() => onConfirm(selected)}>
              采集已选 SKU（{selected.length}）
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}

function MediaConfirm({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="ali-media-confirm-layer">
      <section className="ali-media-confirm-card" role="dialog" aria-modal="true">
        <h3>开启 AI 商品图/视频封面生成？</h3>
        <p>
          开启后，本次上架会先生成 8 张 Ozon 商品套图，再自动合成 1 个 16 秒 MP4 视频封面。
          图片按 3 点/张计费，本套图最多消耗 24 点；视频合成不额外扣点。
          若视频合成失败，再次提交会复用已成功图片，不会整套重做或重复扣除已完成图片。
        </p>
        <div>
          <button onClick={onCancel}>取消</button>
          <button className="primary" onClick={onConfirm}>确认开启</button>
        </div>
      </section>
    </div>
  );
}

function PriceSettings({
  rows,
  onCancel,
  onApply,
}: {
  rows: ListingRow[];
  onCancel: () => void;
  onApply: (prices: Record<string, string>) => void;
}) {
  const [mode, setMode] = useState<"same" | "multiplier">("same");
  const [same, setSame] = useState("");
  const [multiplier, setMultiplier] = useState("");

  const apply = () => {
    const prices: Record<string, string> = {};
    if (mode === "same") {
      const n = Number(same);
      if (!(n > 0)) return;
      rows.forEach((row) => { if (!row.deleted) prices[row.skuId] = n.toFixed(2); });
    } else {
      const n = Number(multiplier);
      if (!(n > 0)) return;
      rows.forEach((row) => { if (!row.deleted) prices[row.skuId] = (Number(row.sourcePrice) * n).toFixed(2); });
    }
    onApply(prices);
  };

  return (
    <div className="ali-price-layer">
      <section className="ali-price-card">
        <header><strong>价格设置</strong><button onClick={onCancel}><X size={17}/></button></header>
        <label className={mode === "same" ? "active" : ""}>
          <input type="radio" checked={mode === "same"} onChange={() => setMode("same")} />
          <span>全部采用同一个售价</span>
          <input value={same} onChange={(e) => setSame(e.target.value)} placeholder="例如 129.00" />
        </label>
        <label className={mode === "multiplier" ? "active" : ""}>
          <input type="radio" checked={mode === "multiplier"} onChange={() => setMode("multiplier")} />
          <span>1688 原价 × X</span>
          <input value={multiplier} onChange={(e) => setMultiplier(e.target.value)} placeholder="例如 1.8" />
        </label>
        <p>批量规则会应用到当前未删除的 SKU。应用后仍可逐行调整售价。</p>
        <footer><button onClick={onCancel}>取消</button><button className="primary" onClick={apply}>应用价格</button></footer>
      </section>
    </div>
  );
}

function QuickListingModal({
  onCancel,
  onSubmit,
}: {
  onCancel: () => void;
  onSubmit: () => void;
}) {
  const [rows, setRows] = useState<ListingRow[]>(listingSeed.map((row) => ({ ...row })));
  const [storeId, setStoreId] = useState("test");
  const [pricingMode, setPricingMode] = useState<"auto" | "manual">("auto");
  const [dims, setDims] = useState({ length: "", width: "", height: "" });
  const [mediaEnabled, setMediaEnabled] = useState(false);
  const [mediaConfirm, setMediaConfirm] = useState(false);
  const [priceSettings, setPriceSettings] = useState(false);
  const [error, setError] = useState("");

  const activeRows = rows.filter((row) => !row.deleted);
  const selectedRows = activeRows.filter((row) => row.selected);
  const allChecked = activeRows.length > 0 && selectedRows.length === activeRows.length;

  const patchRow = (skuId: string, patch: Partial<ListingRow>) => {
    setRows((current) => current.map((row) => row.skuId === skuId ? { ...row, ...patch } : row));
  };

  const submit = () => {
    setError("");
    if (!storeId) { setError("请选择目标 Ozon 店铺"); return; }
    if (!selectedRows.length) { setError("至少保留一个 SKU"); return; }
    if (pricingMode === "manual") {
      const missing = selectedRows.find((row) => !(Number(row.manualPrice) > 0));
      if (missing) { setError(`手动定价模式下，SKU ${missing.skuId} 必须填写有效售价`); return; }
    }
    onSubmit();
  };

  return (
    <div className="ali-modal-layer quick-list-layer">
      <section className="ali-quick-modal" role="dialog" aria-modal="true" aria-label="一键上架至 Ozon">
        <header className="ali-quick-head">
          <h2>一键上架至 Ozon</h2>
          <button onClick={onCancel}><X size={18}/></button>
        </header>

        <div className="ali-quick-notice">
          Ozon 类目、必填属性、俄语内容、变体合并与最终 JSON 继续由 ERP 后台统一处理。这里仅确认目标店铺、售价方式、SKU、重量和包装尺寸。
        </div>

        <div className="ali-quick-toolbar">
          <label><b>*</b> 选择店铺：
            <select value={storeId} onChange={(e) => setStoreId(e.target.value)}>
              <option value="test">测试</option>
              <option value="star">星桥家居</option>
            </select>
          </label>
          <label><b>*</b> 售价方式：
            <select value={pricingMode} onChange={(e) => setPricingMode(e.target.value as "auto" | "manual")}>
              <option value="auto">自动定价</option>
              <option value="manual">手动定价</option>
            </select>
          </label>
          <div className={"ali-media-field " + (mediaEnabled ? "enabled" : "")}>
            <div><strong>生成图/视频封面</strong><small>8 张图 · 24 点 · 16s MP4</small></div>
            <button
              role="switch"
              aria-checked={mediaEnabled}
              onClick={() => mediaEnabled ? setMediaEnabled(false) : setMediaConfirm(true)}
            />
          </div>
        </div>

        <div className="ali-quick-table-wrap">
          <table>
            <thead>
              <tr>
                <th><input type="checkbox" checked={allChecked} onChange={(e) => {
                  const checked = e.target.checked;
                  setRows((current) => current.map((row) => row.deleted ? row : { ...row, selected: checked }));
                }}/></th>
                <th>序号</th><th>主图</th><th>变体</th><th>SKU</th><th>货号</th><th>1688原价</th>
                <th><span className="ali-price-head">售价 <button disabled={pricingMode !== "manual"} onClick={() => setPriceSettings(true)}>⚙</button></span></th>
                <th>自定义重量(g)</th><th>包装尺寸(mm)</th><th>操作</th>
              </tr>
            </thead>
            <tbody>
              {rows.filter((row) => !row.deleted).map((row, index) => (
                <tr key={row.skuId}>
                  <td><input type="checkbox" checked={row.selected} onChange={(e) => patchRow(row.skuId, { selected: e.target.checked })}/></td>
                  <td>{index + 1}</td>
                  <td><ModalSkuThumb dark={row.id === 1}/></td>
                  <td className="variant">{row.name}</td>
                  <td className="sku">{row.skuId}</td>
                  <td className="offer">{row.offerId}</td>
                  <td className="source-price">¥{row.sourcePrice}</td>
                  <td>
                    {pricingMode === "auto"
                      ? <b className="auto-price">后台计算</b>
                      : <input className="manual-price" value={row.manualPrice} onChange={(e) => patchRow(row.skuId, { manualPrice: e.target.value })} placeholder="售价"/>}
                  </td>
                  <td><input className="mini" value={row.weight} onChange={(e) => patchRow(row.skuId, { weight: e.target.value })} placeholder="可不填"/></td>
                  <td>
                    <div className="ali-dims">
                      <input value={dims.length} onChange={(e) => setDims({ ...dims, length: e.target.value })} placeholder="长"/>
                      <span>×</span>
                      <input value={dims.width} onChange={(e) => setDims({ ...dims, width: e.target.value })} placeholder="宽"/>
                      <span>×</span>
                      <input value={dims.height} onChange={(e) => setDims({ ...dims, height: e.target.value })} placeholder="高"/>
                    </div>
                  </td>
                  <td><button className="ali-delete-row" onClick={() => patchRow(row.skuId, { deleted: true, selected: false })}>删除</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="ali-quick-foot">
          <div>
            <strong>已选择 {selectedRows.length} / {activeRows.length} 个 SKU</strong>
            <span>上架货币：人民币 CNY</span>
            <em>{pricingMode === "auto" ? "自动定价由 ERP 后台计算" : "手动定价模式"}</em>
            {error && <i>{error}</i>}
          </div>
          <div><button onClick={onCancel}>取消</button><button className="primary" onClick={submit}>一键上架至 Ozon</button></div>
        </footer>

        {mediaConfirm && (
          <MediaConfirm
            onCancel={() => setMediaConfirm(false)}
            onConfirm={() => { setMediaEnabled(true); setMediaConfirm(false); }}
          />
        )}
        {priceSettings && (
          <PriceSettings
            rows={rows}
            onCancel={() => setPriceSettings(false)}
            onApply={(prices) => {
              setRows((current) => current.map((row) => prices[row.skuId] ? { ...row, manualPrice: prices[row.skuId] } : row));
              setPriceSettings(false);
            }}
          />
        )}
      </section>
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
  const [quickModalOpen, setQuickModalOpen] = useState(false);
  const [skuPickerOpen, setSkuPickerOpen] = useState(false);
  const [quickLabel, setQuickLabel] = useState("一键上架至 Ozon");
  const [collectLabel, setCollectLabel] = useState("采集到 OzonG");
  const [drawerNotice, setDrawerNotice] = useState("");
  const [quickBusy, setQuickBusy] = useState(false);
  const [collectBusy, setCollectBusy] = useState(false);
  const selected = useMemo(() => pageSkuRows[activeSku], [activeSku]);

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 1800);
  };

  const openQuickListing = () => {
    if (quickBusy || collectBusy) return;
    setDrawerNotice("");
    setQuickBusy(true);
    setQuickLabel("读取商品数据…");
    window.setTimeout(() => {
      setQuickLabel("等待确认…");
      setQuickModalOpen(true);
    }, 420);
  };

  const cancelQuickListing = () => {
    setQuickModalOpen(false);
    setQuickBusy(false);
    setQuickLabel("一键上架至 Ozon");
  };

  const submitQuickListing = () => {
    setQuickModalOpen(false);
    setQuickLabel("正在创建后台上架任务…");
    window.setTimeout(() => {
      setQuickLabel("✓ 已进入上架队列");
      setDrawerNotice("已提交到后台流水线，Job 8A2C1F4D。可进入 OzonG 查看类目、属性、定价和 Ozon 校验进度。");
      window.setTimeout(() => {
        setQuickLabel("一键上架至 Ozon");
        setQuickBusy(false);
      }, 2400);
    }, 760);
  };

  const openCollector = () => {
    if (quickBusy || collectBusy) return;
    setDrawerNotice("");
    setCollectBusy(true);
    setCollectLabel("读取 SKU…");
    window.setTimeout(() => setSkuPickerOpen(true), 380);
  };

  const cancelCollector = () => {
    setSkuPickerOpen(false);
    setCollectBusy(false);
    setCollectLabel("采集到 OzonG");
  };

  const confirmCollector = (ids: string[]) => {
    setSkuPickerOpen(false);
    setCollectLabel("采集中…");
    window.setTimeout(() => {
      setCollectLabel("✓ 已采集到 OzonG");
      setDrawerNotice(`当前商品已保存到 OzonG 1688 商品工作台（${ids.length} 个 SKU）。中转采集不会自动触发上架。`);
      window.setTimeout(() => {
        setCollectLabel("采集到 OzonG");
        setCollectBusy(false);
      }, 1600);
    }, 650);
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
                {pageSkuRows.map((row,index)=>(
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
            <button className="ali-drawer-primary" disabled={quickBusy || collectBusy} onClick={openQuickListing}>{quickLabel}</button>
            <button className="ali-drawer-primary second" disabled={quickBusy || collectBusy} onClick={openCollector}>{collectLabel}</button>
            <button className="ali-drawer-enter" onClick={onEnterErp}>进入 OzonG</button>
            {drawerNotice && <div className="ali-drawer-notice">{drawerNotice}</div>}
            <div className="ali-source-summary"><span>当前货源</span><b>¥0.45–0.65</b><em>2 个 SKU · 广东揭阳</em></div>
            <div className="ali-drawer-version">插件版本 v0.0.19</div>
          </div>}
        </aside>
      ) : (
        <button className="ali-drawer-entry" onClick={()=>setDrawerOpen(true)}><img src="/auto-ozon/auto-ozon-logo.png" alt="OzonG"/></button>
      )}

      {quickModalOpen && <QuickListingModal onCancel={cancelQuickListing} onSubmit={submitQuickListing}/>}
      {skuPickerOpen && <SkuPickerModal onCancel={cancelCollector} onConfirm={confirmCollector}/>}
      {toast&&<div className="ali-toast" onClick={()=>setToast("")}>{toast}</div>}
    </div>
  );
}
