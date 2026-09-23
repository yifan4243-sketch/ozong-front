import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  AppstoreOutlined,
  ArrowRightOutlined,
  BarChartOutlined,
  CalendarOutlined,
  CarOutlined,
  CheckCircleOutlined,
  CrownOutlined,
  DeleteOutlined,
  DesktopOutlined,
  DollarOutlined,
  DownOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  FileDoneOutlined,
  FileTextOutlined,
  FireOutlined,
  HomeOutlined,
  InboxOutlined,
  LeftOutlined,
  LinkOutlined,
  LockOutlined,
  MoreOutlined,
  OrderedListOutlined,
  PictureOutlined,
  PieChartOutlined,
  PlusOutlined,
  ReloadOutlined,
  RightOutlined,
  RobotOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
  SendOutlined,
  SettingOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  SyncOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
  UploadOutlined,
  UserOutlined,
  WarningOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import "./web-erp-demo.css";

type ViewKey =
  | "dashboard"
  | "products"
  | "collection"
  | "listing"
  | "source1688"
  | "orders"
  | "promoJoin"
  | "promoAuto"
  | "shops"
  | "selection"
  | "finance"
  | "aiImage"
  | "watermarks"
  | "membership"
  | "account"
  | "users"
  | "extensions";

type TrendKey = "7d" | "30d" | "90d";

const REAL_LOGO = "https://raw.githubusercontent.com/yifan4243-sketch/ozon-erp/dev-hotfix/frontend/public/logo.png";
const REAL_AVATAR = "https://raw.githubusercontent.com/yifan4243-sketch/ozon-erp/dev-hotfix/frontend/public/default-user-avatar.png";

const viewTitles: Record<ViewKey, string> = {
  dashboard: "概览",
  products: "在线商品",
  collection: "采集箱",
  listing: "上架记录",
  source1688: "1688 → Ozon",
  orders: "订单列表",
  promoJoin: "参加促销",
  promoAuto: "自动踢促销",
  shops: "店铺管理",
  selection: "选品",
  finance: "财务中心",
  aiImage: "AI生图",
  watermarks: "水印管理",
  membership: "会员中心",
  account: "账户中心",
  users: "用户与额度",
  extensions: "浏览器插件",
};

const sampleProducts = [
  { name: "Набор шариковых ручек, 4 штуки, синие, 0.7 мм", offer: "ozg-260909-519098-03", sku: "5743999143", price: "200.00元", stock: 100, weight: "13g" },
  { name: "Ручки шариковые синие 10 шт 0.7 мм", offer: "ozg-260909-511678-04", sku: "5743996564", price: "200.00元", stock: 100, weight: "40g" },
  { name: "Набор цветных шариковых ручек 10 цветов", offer: "ozg-260909-509462-02", sku: "5743990580", price: "200.00元", stock: 100, weight: "50g" },
  { name: "Комплект одежды школьный для детей", offer: "ozg-260908-567901-10", sku: "5736228976", price: "300.00元", stock: 100, weight: "645g" },
  { name: "Дождевик Спецодежда / Плащи и дождевики", offer: "C-123-284.2", sku: "5367925035", price: "103,28 ¥", stock: 36, weight: "515g" },
  { name: "Игровые беспроводные контроллеры 2,4G", offer: "C-287-456.52", sku: "4993872000", price: "37,94 ¥", stock: 42, weight: "420g" },
];

const trendData: Record<TrendKey, { sales: number[]; orders: number[]; labels: string[] }> = {
  "7d": {
    sales: [8420, 11280, 9680, 15120, 13860, 18640, 21280],
    orders: [72, 94, 81, 116, 108, 139, 151],
    labels: ["09-17", "09-18", "09-19", "09-20", "09-21", "09-22", "09-23"],
  },
  "30d": {
    sales: [6200, 7800, 9300, 8700, 12100, 11000, 13800, 15200, 14400, 16000, 18500, 17100, 19600, 20800, 18900, 22400, 21600, 23800, 25100, 24300, 26700, 25900, 28100, 29300, 27600, 30500, 31800, 29600, 33400, 34800],
    orders: [54, 61, 74, 70, 88, 83, 96, 102, 98, 107, 116, 112, 124, 131, 119, 138, 135, 146, 153, 149, 161, 157, 169, 176, 168, 183, 190, 181, 197, 205],
    labels: ["08-25", "08-30", "09-04", "09-09", "09-14", "09-19", "09-23"],
  },
  "90d": {
    sales: Array.from({ length: 90 }, (_, i) => 6500 + i * 310 + Math.sin(i / 3) * 3500 + (i % 11) * 260),
    orders: Array.from({ length: 90 }, (_, i) => 48 + i * 1.5 + Math.sin(i / 4) * 18 + (i % 9)),
    labels: ["06-26", "07-10", "07-24", "08-07", "08-21", "09-04", "09-23"],
  },
};

function cn(n: number) {
  return new Intl.NumberFormat("zh-CN").format(Math.round(n));
}

function LineChart({ range }: { range: TrendKey }) {
  const data = trendData[range];
  const width = 640;
  const height = 320;
  const left = 54;
  const right = 616;
  const top = 28;
  const bottom = 282;
  const max = Math.max(...data.sales);
  const maxOrders = Math.max(...data.orders);
  const points = (values: number[], localMax: number) =>
    values
      .map((value, index) => {
        const x = left + (index / Math.max(1, values.length - 1)) * (right - left);
        const y = bottom - (value / Math.max(1, localMax)) * (bottom - top);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  const ticks = data.labels.map((label, index) => ({
    label,
    x: left + (index / Math.max(1, data.labels.length - 1)) * (right - left),
  }));
  return (
    <svg viewBox="0 0 640 320" className="real-trend-svg" preserveAspectRatio="none">
      {[0, 1, 2, 3, 4].map((row) => {
        const y = top + (row / 4) * (bottom - top);
        return <line key={row} x1={left} x2={right} y1={y} y2={y} className="real-grid-line" />;
      })}
      <polyline points={points(data.sales, max)} className="real-sales-line" />
      <polyline points={points(data.orders, maxOrders)} className="real-orders-line" />
      {ticks.map((tick) => (
        <text key={tick.label} x={tick.x} y={306} textAnchor="middle" className="real-x-label">
          {tick.label}
        </text>
      ))}
    </svg>
  );
}

function IconBox({ tone, children }: { tone: string; children: ReactNode }) {
  return <span className={`real-icon-box ${tone}`}>{children}</span>;
}

function DashboardView({ go }: { go: (view: ViewKey) => void }) {
  const [range, setRange] = useState<TrendKey>("7d");
  const [rankingRange, setRankingRange] = useState<7 | 30 | 100>(7);

  const rankings = useMemo(() => {
    const seed = rankingRange === 7 ? 1 : rankingRange === 30 ? 2.7 : 7.5;
    return [
      { name: "测试", sales: 12680 * seed, orders: Math.round(92 * seed) },
      { name: "UyutHome 家居", sales: 9480 * seed, orders: Math.round(71 * seed) },
      { name: "北极星百货", sales: 7320 * seed, orders: Math.round(56 * seed) },
    ];
  }, [rankingRange]);

  const stats = [
    { label: "今日销售额", value: "¥ 12,486.32", trend: "↑ 12.8%", compare: "较昨日", tone: "blue", icon: <DollarOutlined />, line: "#3b82f6" },
    { label: "本月销售额", value: "¥ 286,940.10", trend: "↑ 18.5%", compare: "较上月同期", tone: "purple", icon: <ShoppingCartOutlined />, line: "#8b5cf6" },
    { label: "今日订单数", value: "137", trend: "↑ 9.6%", compare: "较昨日", tone: "green", icon: <FileTextOutlined />, line: "#10b981" },
    { label: "待发货订单", value: "26", trend: "↓ 3.2%", compare: "较昨日", tone: "orange", icon: <SendOutlined />, line: "#f97316" },
    { label: "店铺数量", value: "6", trend: "↑ 0.0%", compare: "总数", extra: "正常 6 / 异常 0", tone: "blue", icon: <ShopOutlined />, line: "#ef4444" },
  ];

  return (
    <div className="real-erp-page real-dashboard-page">
      <div className="real-dashboard-shell">
        <section className="real-dashboard-hero-grid">
          <div className="real-welcome-panel">
            <div className="real-welcome-copy">
              <div className="real-welcome-title">欢迎回来，1234</div>
              <div className="real-welcome-sub">今天是 2026年9月23日星期三，祝您工作顺利！</div>
            </div>
            <div className="real-cube-scene" aria-hidden="true">
              <span className="real-cube real-cube-main"></span>
              <span className="real-cube real-cube-a"></span>
              <span className="real-cube real-cube-b"></span>
              <span className="real-cube-shadow"></span>
            </div>
          </div>

          <button className="real-ai-generate-panel" type="button" onClick={() => go("aiImage")}>
            <div>
              <div className="real-ai-title">AI 商品图生成</div>
              <div className="real-ai-desc">一键生成高质量商品图，提升转化率</div>
              <span className="real-ai-action">立即生成 <span>→</span></span>
            </div>
            <div className="real-ai-symbol"><ThunderboltOutlined /></div>
          </button>
        </section>

        <section className="real-stat-grid">
          {stats.map((stat) => (
            <article className="real-stat-card" key={stat.label}>
              <div className="real-stat-main">
                <div>
                  <div className="real-stat-label">{stat.label}</div>
                  <div className="real-stat-value">{stat.value}</div>
                </div>
                <IconBox tone={stat.tone}>{stat.icon}</IconBox>
              </div>
              <div className="real-stat-meta">
                <span className={stat.trend.includes("↓") ? "down" : ""}>{stat.trend}</span>
                <span>{stat.compare}</span>
              </div>
              {stat.extra && <div className="real-stat-extra">{stat.extra}</div>}
              <svg className="real-mini-chart" viewBox="0 0 150 42" preserveAspectRatio="none">
                <path d="M4 36 L30 31 L54 33 L78 20 L102 24 L126 12 L146 14" fill="none" stroke={stat.line} strokeWidth="2.4" strokeLinecap="round" />
              </svg>
            </article>
          ))}
        </section>

        <section className="real-dashboard-insight-grid">
          <article className="real-dashboard-card real-trend-card">
            <div className="real-section-head">
              <div>
                <h2>销售趋势</h2>
                <div className="real-legend-row">
                  <span className="sales">销售额(¥)</span>
                  <span className="orders">订单数</span>
                  <button className="real-select-btn">全部店铺 <DownOutlined /></button>
                </div>
              </div>
              <div className="real-trend-tabs">
                {(["7d", "30d", "90d"] as TrendKey[]).map((key) => (
                  <button key={key} className={range === key ? "active" : ""} onClick={() => setRange(key)}>
                    {key === "7d" ? "近7天" : key === "30d" ? "近30天" : "近90天"}
                  </button>
                ))}
              </div>
            </div>
            <div className="real-trend-plot"><LineChart range={range} /></div>
          </article>

          <article className="real-dashboard-card real-quick-card">
            <div className="real-section-head single"><h2>快捷入口</h2></div>
            <div className="real-quick-list">
              {[
                ["同步商品", "从 Ozon 同步商品", <SyncOutlined />, "blue", "products"],
                ["AI 生成商品图", "批量生成高质量图", <ThunderboltOutlined />, "purple", "aiImage"],
                ["店铺授权", "管理店铺授权状态", <SafetyCertificateOutlined />, "green", "shops"],
                ["发布商品", "发布到 Ozon 平台", <SendOutlined />, "orange", "products"],
                ["生成记录", "查看历史生成记录", <FileDoneOutlined />, "blue", "listing"],
                ["成本统计", "查看成本消耗情况", <BarChartOutlined />, "purple", "finance"],
              ].map(([label, desc, icon, tone, target]: any) => (
                <button key={label} onClick={() => go(target)}>
                  <IconBox tone={tone}>{icon}</IconBox>
                  <span><strong>{label}</strong><em>{desc}</em></span>
                </button>
              ))}
            </div>
          </article>

          <article className="real-dashboard-card real-notice-card">
            <div className="real-section-head">
              <h2>系统通知 <small>47 条未读</small></h2>
              <button className="real-text-link">全部已读</button>
            </div>
            <div className="real-notice-list">
              {[
                ["财务同步完成", "已同步 137 笔订单，286 条财务流水。", "7分钟前", "success"],
                ["财务同步完成", "已同步 86 笔订单，190 条财务流水。", "9分钟前", "success"],
                ["财务同步完成，存在异常", "已同步 41 笔订单，6 条财务流水。", "10分钟前", "warning"],
                ["库存预警", "3 个商品库存低于安全库存线。", "18分钟前", "warning"],
              ].map(([title, body, time, tone]) => (
                <button className="real-notice-item" key={title + time}>
                  <span className={`real-notice-icon ${tone}`}>{tone === "success" ? <CheckCircleOutlined /> : <WarningOutlined />}</span>
                  <span className="real-notice-copy"><strong>{title}</strong><em>{body}</em></span>
                  <time>{time}</time>
                </button>
              ))}
            </div>
          </article>
        </section>

        <section className="real-dashboard-bottom-grid">
          <article className="real-dashboard-card real-ranking-card">
            <div className="real-section-head">
              <h2>店铺销售排行</h2>
              <div className="real-ranking-range">
                {[7, 30, 100].map((days) => (
                  <button key={days} className={rankingRange === days ? "active" : ""} onClick={() => setRankingRange(days as 7 | 30 | 100)}>
                    近{days}天
                  </button>
                ))}
              </div>
            </div>
            <div className="real-ranking-table">
              <div className="real-ranking-row head"><span>排名</span><span>店铺名称</span><span>销售额(¥)</span><span>订单数</span><span>操作</span></div>
              {rankings.map((row, index) => (
                <div className="real-ranking-row" key={row.name}>
                  <span className="rank-no">{index + 1}</span>
                  <span className="shop-cell"><b>ozon</b>{row.name}</span>
                  <span>¥ {cn(row.sales)}</span>
                  <span>{cn(row.orders)}</span>
                  <button onClick={() => go("orders")}>查看</button>
                </div>
              ))}
            </div>
          </article>

          <article className="real-dashboard-card real-alert-card">
            <div className="real-section-head">
              <h2>异常提醒</h2>
              <button className="real-text-link">预警设置</button>
            </div>
            <div className="real-alert-list">
              {[
                ["商品库存偏低", "当前影响 3 项", "warning"],
                ["商品图片异常", "当前影响 18 项", "warning"],
                ["商品资料缺失", "当前影响 138 项", "warning"],
                ["商品存在 Ozon 错误", "当前影响 6 项", "danger"],
              ].map(([title, desc, tone]) => (
                <div className="real-alert-item" key={title}>
                  <span className={`real-alert-icon ${tone}`}><ExclamationCircleOutlined /></span>
                  <span><strong>{title}</strong><em>{desc}</em></span>
                  <span className="real-alert-actions"><button>查看</button><button>24小时后提醒</button></span>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}

function PageFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`real-erp-page ${className}`}>{children}</div>;
}

function OnlineProductsView() {
  const [status, setStatus] = useState("所有");
  const counts = [["所有", 366], ["销售中", 29], ["准备出售", 248], ["错误", 299], ["已下架", 0], ["已归档", 1382]];
  return (
    <PageFrame className="real-products-page">
      <section className="real-products-shell">
        <div className="real-product-filter-row">
          <button>全部店铺 <DownOutlined /></button>
          <div>搜索商品名称</div>
          <div>输入货号或 SKU</div>
          <span className="spacer"></span>
          <button className="primary">查询</button>
          <button className="create"><PlusOutlined /> 新建商品</button>
          <button><ReloadOutlined /> 同步操作 <DownOutlined /></button>
          <button className="disabled">批量操作 <DownOutlined /></button>
          <button className="square"><ReloadOutlined /></button>
        </div>

        <div className="real-product-status-grid">
          {counts.map(([label, value]) => (
            <button key={label as string} className={status === label ? "active" : ""} onClick={() => setStatus(label as string)}>
              <span>{label}</span><b>{value}</b>
            </button>
          ))}
        </div>

        <div className="real-products-table-scroll">
          <div className="real-products-table">
            <div className="real-products-row head">
              <span>□</span><span>商品信息</span><span>类目佣金</span><span>店铺</span><span>状态</span><span>价格</span><span>库存</span><span>重量</span><span>更新时间</span><span>操作</span>
            </div>
            {sampleProducts.map((row, index) => (
              <div className="real-products-row" key={row.sku}>
                <span>□</span>
                <span className="product-info">
                  <i className={`mock-product-img img-${index % 4}`}>{index % 2 ? "🖊️" : "👖"}</i>
                  <b>{row.name}</b>
                  <small>货号 {row.offer}　SKU {row.sku}</small>
                </span>
                <span className="commission"><em>佣金率:14%</em><em>佣金:28.00元</em><em>收单:2.00元</em></span>
                <span>测试</span>
                <span><i className="status-chip green">销售中</i></span>
                <span className="price-stack"><b>{row.price}</b><s>{index ? "400.00元" : "600.00元"}</s><em>不利价格指数</em></span>
                <span>{row.stock} <EditOutlined /></span>
                <span><b>{row.weight}</b></span>
                <span>2026-09-10<small>13:35:41</small></span>
                <span><button className="edit-btn">编辑</button><MoreOutlined /></span>
              </div>
            ))}
          </div>
        </div>
        <footer className="real-table-footer"><strong>共 366 条记录，当前页 10 条记录</strong><div><button disabled><LeftOutlined /></button><button className="on">1</button><button>2</button><button>3</button><button>4</button><button>5</button><span>•••</span><button>37</button><button><RightOutlined /></button><button>10 条/页 <DownOutlined /></button></div></footer>
      </section>
    </PageFrame>
  );
}

function CollectionView() {
  return (
    <PageFrame className="real-collection-page">
      <section className="real-collection-panel">
        <header className="real-collection-toolbar">
          <div><div className="title-line"><h1>采集箱</h1><b>19 件</b></div><p>核对采集的商品信息，选择需要上架的商品，或进行批量删除。</p></div>
          <div className="actions"><span>□ 全选</span><i></i><span>已选 <b>0</b> 项</span><button disabled><DeleteOutlined /> 删除</button><button><ReloadOutlined /> 刷新</button></div>
        </header>
        <div className="real-collection-table">
          <div className="real-collection-row head"><span>□</span><span>商品信息</span><span>SKU</span><span>来源平台</span><span>采集时间 ↓</span><span>价格</span><span>操作</span></div>
          {sampleProducts.map((row, index) => (
            <div className="real-collection-row" key={row.sku}>
              <span>□</span>
              <span className="collection-product"><i className={`mock-product-img img-${index % 4}`}>{["🧻","🧥","🎮","🔦"][index % 4]}</i><b>{row.name}</b></span>
              <span>{row.sku}</span><span className="ozon-source">OZON <small>RU</small></span><span>2026-09-{index ? "22" : "23"} 11:{47 - index * 2}:13</span><span className="pink-price">{["83,17 ¥","103,28 ¥","37,94 ¥","86,17 ¥"][index % 4]}</span>
              <span className="collection-actions"><button><LinkOutlined /> 原链接</button><button className="purple"><UploadOutlined /> 上架</button></span>
            </div>
          ))}
        </div>
      </section>
    </PageFrame>
  );
}

function ListingView() {
  return (
    <PageFrame className="real-listing-page">
      <section className="real-listing-head"><div><h1>上架记录</h1><p>一键上架与编辑上架共用同一任务队列；离开页面不会中断处理。</p></div><button>刷新</button></section>
      <section className="real-listing-table-card">
        <div className="real-listing-row head"><span>主图</span><span>商品</span><span>店铺</span><span>状态</span><span>结果</span><span>创建时间</span><span>操作</span></div>
        {sampleProducts.slice(0, 5).map((row, index) => (
          <div className={`real-listing-row ${index === 1 ? "highlight" : ""}`} key={row.sku}>
            <span><i className={`mock-product-img img-${index % 4}`}>{index < 2 ? "🎒" : "🔎"}</i></span>
            <span><b>{row.name}</b><small>SKU {row.sku} · 货号 {row.offer}</small></span>
            <span>测试</span>
            <span><i className={index < 3 ? "status-chip red" : "status-chip success"}>{index < 3 ? "上架失败" : "上架成功"}</i></span>
            <span className={index < 3 ? "result-error" : "result-success"}>{index < 3 ? "商品校验失败；商品校验失败" : `Ozon 商品 ID 6340${index}78236`}</span>
            <span>2026-09-{index < 1 ? "16" : "15"} 23:{25 - index}:28</span>
            <span>{index < 3 ? <button>重试</button> : null}</span>
          </div>
        ))}
        <div className="load-more"><button>加载更多</button></div>
      </section>
    </PageFrame>
  );
}

function Source1688View() {
  const [selected, setSelected] = useState<number[]>([]);
  const cards = [
    { id: 1, title: "欧式户外花园天使复古花盆庭院阳台装饰工艺品创意摆件美式艺术", price: "—", pics: 4, sku: 1, icon: "🗿" },
    { id: 2, title: "25新款时尚复古牛仔腋下包大容量丹宁洗水托特欧美辣妹手提斜挎包", price: "—", pics: 5, sku: 2, icon: "👜" },
  ];
  return (
    <PageFrame className="real-source-page">
      <section className="real-source-hero">
        <div className="source-title"><small>货源采集工作台</small><h1><span>1688</span> → <b>Ozon</b></h1><p>浏览器插件采集的 1688 商品统一进入这里，和 Ozon 在线商品分开管理。</p></div>
        <div className="source-controls"><label>生成图/视频封面 <i>8 张图 · 24点 · 16s MP4</i><span className="switch"></span></label><button>上架店铺　测试 <DownOutlined /></button><button>上架设置</button><button>刷新</button><button className="purple">打开 1688</button></div>
      </section>
      <section className="real-source-summary"><article><span>已采集商品</span><b>2</b></article><article><span>来源平台</span><b>1688</b></article></section>
      <section className="real-source-list">
        <div className="real-source-list-head"><div><h2>1688 商品</h2><p>SKU 已在采集阶段完成筛选；类目、必填项、包装估算、定价和 Ozon JSON 由系统自动处理。</p></div><div><span>□ 全选　 已选 {selected.length} 项</span><button disabled>删除</button><button className="purple">批量上架至 Ozon</button></div></div>
        <div className="real-source-card-grid">
          {cards.map((card) => (
            <article className="real-source-card" key={card.id}>
              <button className={selected.includes(card.id) ? "select on" : "select"} onClick={() => setSelected((v) => v.includes(card.id) ? v.filter((x) => x !== card.id) : [...v, card.id])}>{selected.includes(card.id) ? "✓" : ""}</button>
              <div className="source-photo"><span>{card.icon}</span><b>1688</b></div>
              <h3>{card.title}</h3><small>货源 ID：{card.id === 1 ? "1052537880354" : "917088483865"}</small>
              <div className="source-meta"><span>价格<b>{card.price}</b></span><span>图片<b>{card.pics} 张</b></span><span>SKU<b>{card.sku}</b></span></div>
              <time>08-23 {card.id === 1 ? "12:19" : "00:16"}</time>
              <footer><button>查看货源</button><button className="purple">已上架 Ozon</button></footer>
            </article>
          ))}
        </div>
      </section>
    </PageFrame>
  );
}

function OrdersView() {
  const [status, setStatus] = useState("所有订单");
  const counts = [["所有订单",291],["等待备货",0],["等待发运",0],["运输中",0],["已签收",158],["已取消",133]];
  const rows = [
    ["Dandy Ambulance трансформер 20 см, свет и звук, S1.","0146328704-0023-1","¥75.00","已签收"],
    ["Видеоглазок для входной двери с WI-FI, умный...","0131670595-0370-1","¥400.00","已取消"],
    ["Dandy Ambulance трансформер 20 см, свет и звук, S1.","01103533932-0188-1","¥75.00","已签收"],
    ["Набор инструментов 399 предметов GOODKING...","145656659-0347-1","¥733.00","已取消"],
    ["Резец по дереву","0159578246-0065-1","¥131.00","已签收"],
  ];
  return (
    <PageFrame className="real-orders-page">
      <section className="real-orders-shell">
        <div className="real-orders-filters"><button>全部店铺 <DownOutlined /></button><button>全部状态 <DownOutlined /></button><div>请输入订单号</div><div className="wide">搜索商品、货号、SKU</div><button className="date">2026-03-18 → 2026-09-23</button><button className="primary">查询</button><button className="green">拉取新订单</button><button>更多操作 <DownOutlined /></button><button disabled>批量操作 <DownOutlined /></button></div>
        <div className="real-order-status-grid">{counts.map(([label,value])=><button key={label as string} className={status===label?"active":""} onClick={()=>setStatus(label as string)}><span>{label}</span><b>{value}</b></button>)}</div>
        <div className="real-orders-table-scroll">
          <div className="real-orders-table">
            <div className="real-orders-row head"><span>□</span><span>商品信息</span><span>订单信息</span><span>店铺</span><span>订单金额</span><span>履约状态</span><span>下单时间</span><span>操作</span></div>
            {rows.map((row,index)=><div className={`real-orders-row ${index===1?"highlight":""}`} key={row[1]}><span>□</span><span className="order-product"><i className={`mock-product-img img-${index%4}`}>🎁</i><b>{row[0]}</b><small>货号：Q-12.8-26.46　SKU：4486313693　 数量 1</small><em>✎ 补充货源信息</em></span><span><b>{row[1]}</b><small>仓库：厦门CEL陆运</small><small>发运方式：CEL Standard Extra Small</small></span><span>测试</span><span><b>{row[2]}</b></span><span><i className={row[3]==="已签收"?"status-chip success":"status-chip gray"}>{row[3]}</i></span><span>2026-06-{13-index}<small>00:{24-index*3}:09</small></span><span><button>查看详情</button></span></div>)}
          </div>
        </div>
        <footer className="real-table-footer"><strong>共 291 条记录，当前页 10 条记录</strong><div><button disabled><LeftOutlined /></button><button className="on">1</button><button>2</button><span>•••</span><button>30</button><button><RightOutlined /></button><button>10 条/页 <DownOutlined /></button></div></footer>
      </section>
    </PageFrame>
  );
}

function PromotionJoinView() {
  const [tab, setTab] = useState<"可参加商品"|"已参加商品">("可参加商品");
  const rows = [
    ["Складная детская ванночка и подстав...","₽ 399.80","₽ 324.00","0"],
    ["Селфи-монитор мобильного телефон...","₽ 125.00","₽ 94.00","0"],
    ["Селфи-монитор мобильного телефон...","₽ 122.00","₽ 92.00","0"],
    ["ДЖИП на радиоуправлении LC 80","₽ 507.77","₽ 399.00","0"],
  ];
  return (
    <PageFrame className="real-promo-page">
      <section className="real-promo-shell">
        <header><h1>参加促销</h1><p>管理商品参加 Ozon 活动的关系；修改会先退出旧关系，再按新参数重新加入。</p></header>
        <div className="real-promo-filter"><button>测试 <DownOutlined /></button><button className="activity">Эластичный бустинг. Без ограничения срока де... <DownOutlined /></button><div>商品名称 / 货号 / SKU</div><button className="primary"><SearchOutlined /> 查询</button><button><ReloadOutlined /> 同步活动</button></div>
        <div className="real-promo-tabs"><button className={tab==="可参加商品"?"active":""} onClick={()=>setTab("可参加商品")}>可参加商品</button><button className={tab==="已参加商品"?"active":""} onClick={()=>setTab("已参加商品")}>已参加商品</button></div>
        <div className="selected-line">已选 0 项 <button disabled>批量参加</button></div>
        <div className="real-promo-table">
          <div className="real-promo-row head"><span>□</span><span>商品</span><span>原价</span><span>建议活动价</span><span>库存</span><span>操作</span></div>
          {rows.map((row,index)=><div className="real-promo-row" key={row[0]+index}><span>□</span><span className="promo-product"><i className={`mock-product-img img-${index%4}`}>🛁</i><b>{row[0]}</b><small>货号 C-89-114.34 · SKU 3621328314</small></span><span>{row[1]}</span><span>{row[2]}</span><span>{row[3]}</span><span><button className="purple">参加</button></span></div>)}
        </div>
        <div className="promo-pagination">‹ <b>1</b> 2　3　›</div>
      </section>
    </PageFrame>
  );
}

function PromotionAutoView() {
  const [enabled, setEnabled] = useState(false);
  return (
    <PageFrame className="real-auto-promo-page">
      <section className="real-auto-promo-shell">
        <header><h1>自动踢促销</h1><p>开启后首次扫描在 2 小时后执行，之后每 2 小时扫描一次；系统只处理 Ozon 标记为自动加入的商品。</p></header>
        <div className="real-auto-table"><div className="head"><span>店铺名称</span><span>启用状态</span></div><div><strong>测试</strong><button className={enabled?"switch-pill on":"switch-pill"} onClick={()=>setEnabled(!enabled)}><i></i>{enabled?"开启":"关闭"}</button></div></div>
      </section>
    </PageFrame>
  );
}

function ShopsView() {
  return (
    <PageFrame className="real-shops-page">
      <section className="real-shops-shell">
        <div className="real-shop-filters"><label>店铺分组<button>全部分组 <DownOutlined /></button></label><label>店铺名称<div>请输入店铺名称</div></label><label>Client ID<div>请输入 Client ID</div></label><label>国家<button>全部国家 <DownOutlined /></button></label><label>授权状态<button>全部状态 <DownOutlined /></button></label><button className="primary">查询</button><button>重置</button></div>
        <div className="real-shop-actions"><div><button className="purple"><PlusOutlined /> 新增店铺</button><button><PlusOutlined /> 新增分组</button><button><DeleteOutlined /> 批量操作 <DownOutlined /></button></div><div><button><SyncOutlined /> 同步店铺</button><button>⇩ 导出</button><button><ReloadOutlined /></button></div></div>
        <div className="real-shop-table">
          <div className="real-shop-row head"><span>□</span><span>序号</span><span>店铺信息</span><span>平台</span><span>授权到期时间</span><span>产品数量</span><span>货币</span><span>默认仓库</span><span>合作仓库</span><span>状态</span><span>Cookie状态</span><span>分组</span><span>操作</span></div>
          <div className="real-shop-row"><span>□</span><span>1</span><span className="shop-name"><b>测试</b><small>Client ID: 4151485</small></span><span className="ozon-logo">ozon</span><span><i className="status-chip success">永久</i></span><span className="blue-number">29</span><span>CNY</span><span><button>添加默认仓库</button></span><span className="blue-number">4个</span><span><i className="status-chip success">已授权</i></span><span><i className="status-chip success">正常</i></span><span><button className="group-select"><DownOutlined /></button></span><span className="shop-ops"><button>编辑</button><button>删除</button></span></div>
        </div>
        <footer className="real-shop-footer"><strong>共 1 条记录，当前页 1 条记录</strong><div>‹ <b>1</b> › <button>10 条/页 <DownOutlined /></button></div></footer>
      </section>
    </PageFrame>
  );
}

const categoryRows = [
  ["住宅和花园","8624.84万","864.17亿","15.93%","11.32%"],
  ["服装","6583.13万","1280.91亿","12.16%","16.78%"],
  ["美容和卫生","5233.73万","411.16亿","9.66%","5.39%"],
  ["建筑和装修","4902.73万","826.84亿","9.05%","10.83%"],
  ["食品","4034.53万","216.93亿","7.45%","2.84%"],
  ["汽车用品","3218.83万","605.99亿","5.94%","7.94%"],
  ["Ozon Fresh食品","2790.65万","44.68亿","5.15%","0.59%"],
  ["电子产品","2757.78万","618.53亿","5.09%","8.10%"],
  ["小百货和配饰","2428.27万","216.45亿","4.48%","2.84%"],
];

function SelectionView() {
  const [period, setPeriod] = useState<"week"|"month"|"quarter"|"year">("month");
  const cards = [
    ["week","周数据","133,145,630","175.88亿",<CalendarOutlined />,"purple"],
    ["month","月数据","541,543,500","704.81亿",<CalendarOutlined />,"blue"],
    ["quarter","季数据","1,600,368,344","2075.52亿",<PieChartOutlined />,"cyan"],
    ["year","年数据","5,411,882,918","6976.49亿",<BarChartOutlined />,"violet"],
  ] as const;
  return (
    <PageFrame className="real-selection-page">
      <div className="real-selection-title"><h1>选品分析</h1><span>Ozon 全平台市场数据分析，每周更新</span></div>
      <section className="real-insight-strip">
        <article><IconBox tone="purple"><AppstoreOutlined /></IconBox><div><strong>数据洞察</strong><em>市场需求持续增长</em></div></article>
        <article><IconBox tone="orange"><FireOutlined /></IconBox><div><strong>住宅和花园类目增长最快</strong><em>销量占比 15.93%</em></div></article>
        <article><IconBox tone="blue"><CrownOutlined /></IconBox><div><strong>服装销售额占比高</strong><em>销售额占比 16.78%</em></div></article>
        <article><IconBox tone="cyan"><CarOutlined /></IconBox><div><strong>FBO 发货占比 71.36%</strong><em>较上月提升 2.18 个百分点</em></div></article>
      </section>
      <section className="real-period-grid">
        {cards.map(([key,label,sales,amount,icon,tone])=><button key={key} className={`real-period-card ${tone} ${period===key?"active":""}`} onClick={()=>setPeriod(key)}><div className="wave"></div><h3>{label}</h3><span>销量</span><b>{sales}</b><span>销售额</span><strong>¥{amount}</strong><i>{icon}</i><div className="bars">{[1,2,3,4,5,6,7].map(n=><em key={n} style={{height:8+n*4}}></em>)}</div></button>)}
      </section>
      <section className="real-selection-panel">
        <div className="panel-head"><h2><TrophyOutlined /> 一级类目排行</h2><button>查看全部 &gt;</button></div>
        <div className="real-category-table"><div className="real-category-row head"><span>排名</span><span>类目名</span><span>月销量</span><span>月销售额(₽)</span><span>销量占比</span><span>销售额占比</span></div><div className="body">{categoryRows.map((r,i)=><div className="real-category-row" key={r[0]}><span><b className={i<3?"top":""}>{i+1}</b></span>{r.map(x=><span key={x}>{x}</span>)}</div>)}</div></div>
        <footer>共 29 条　<span>可在表格内上下拖动查看全部类目</span></footer>
      </section>
    </PageFrame>
  );
}

function FinanceView() {
  return (
    <PageFrame className="real-finance-page">
      <section className="real-finance-summary"><div className="heading"><div><h1>财务中心</h1><p>统计已签收订单的收支情况，支持按结算日期筛选。</p></div><button>口径说明</button></div><div className="equation">
        {[["销售所得","₽ 428,650","income"],["采购成本","¥ 12,860","cost"],["Ozon 费用","₽ 86,430","fee"],["其他支出","₽ 12,480","other"],["估算利润","¥ 24,638","profit"]].map((m,i)=><span className="eq-wrap" key={m[0]}><article className={m[2]}><small>{m[0]}</small><b>{m[1]}</b>{i===4&&<em>利润率 31.6%</em>}</article>{i<4&&<strong>−</strong>}</span>)}
      </div></section>
      <section className="real-finance-filters"><button>全部店铺 <DownOutlined /></button><div>签收日期　2026-09-01　至　2026-09-23</div><div className="wide"><SearchOutlined /> 订单号 / SKU / 货号</div><button>财务状态 <DownOutlined /></button><button>成本状态 <DownOutlined /></button><label>估算规则 <b>5</b>%</label><button className="primary">查询</button><button>重置</button><button>导出 Excel</button><button><SyncOutlined /> 同步数据</button></section>
      <section className="real-finance-table"><div className="real-finance-row head"><span>订单 / 商品</span><span>销售所得</span><span>采购成本</span><span>平台费用</span><span>物流</span><span>估算利润</span></div>{sampleProducts.slice(0,5).map((p,i)=><div className="real-finance-row" key={p.sku}><span><b>47619{i}82-000{i+1}-1</b><small>{p.name}</small></span><span>₽ {1399+i*340}</span><span>¥ {18+i*7}.80</span><span>₽ {220+i*44}</span><span>₽ {180+i*32}</span><span className="profit">¥ {82+i*29}.40</span></div>)}</section>
    </PageFrame>
  );
}

function AiImageView() {
  return (
    <PageFrame className="real-ai-page">
      <div className="real-ai-toolbar"><strong>OzonG AI Workflow</strong><span>统一生图</span><i>● 已保存</i><button>＋ 新建</button><button>历史记录</button><button>自动布局</button><button>−</button><button>55%</button><button>＋</button><button>适应画布</button><span className="grow"></span><button>单主图</button><button className="active">8图套图</button><span>生图点数：<b>956</b></span><span>预计消耗：24点</span><button>⇩ 下载全部</button><button className="run">▶ 运行工作流</button></div>
      <div className="real-ai-canvas">
        <svg className="workflow-lines" viewBox="0 0 1300 640" preserveAspectRatio="none">
          <path d="M330 145 C390 145 390 280 465 280" />
          <path className="pink" d="M330 300 C400 300 405 280 465 280" />
          <path className="orange" d="M330 450 C405 450 420 290 465 280" />
          {[125,225,325,425].map((y,i)=><path key={"l"+i} d={`M645 280 C710 280 700 ${y} 780 ${y}`} />)}
          {[175,275,375,475].map((y,i)=><path key={"r"+i} d={`M645 280 C755 280 830 ${y} 965 ${y}`} />)}
        </svg>
        <article className="flow-node source"><header>▣ 商品源图 <span>0 / 5</span></header><div>＋<b>上传商品源图</b><small>最多5张 · JPG PNG WEBP · 10MB</small></div><footer>💡 商品源图会参与主体识别</footer></article>
        <article className="flow-node reference"><header>✦ 风格参考 <span>0 / 5</span></header><div>＋<b>上传风格参考</b><small>可选 · 最多5张</small></div><footer>仅影响：构图 / 灯光 / 配色</footer></article>
        <article className="flow-node request"><header>✎ 创作要求</header><textarea defaultValue="补充商品事实、核心卖点或希望强调的场景..." /><footer><span>输出语言　俄语</span><span>比例　3:4</span></footer></article>
        <article className="flow-node plan"><header>✦ PromptPlan v3 <button>统一计划</button></header><div><span>样式<b>8图套图</b></span><span>任务<b>8个</b></span><span>商品图<b>已锁定 ✓</b></span></div><a>查看计划详情 →</a></article>
        {["Ozon 主图","使用场景图","商品细节图","核心卖点图 1"].map((n,i)=><article className={`flow-node out left-out out-${i}`} key={n}><header>{5+i}　{n}<span>●</span></header><p>{i===0?"建立商品主视觉":i===1?"展示可使用场景":i===2?"只展示可看到的细节": "一个卖点一个中心价值"}</p><div>○ 等待工作流运行</div><footer>预计 3 点</footer></article>)}
        {["核心卖点图 2","参数信息图","包装清单图","营销卖点图"].map((n,i)=><article className={`flow-node out right-out out-${i}`} key={n}><header>{9+i}　{n}<span>●</span></header><p>{i===0?"表达第二个场景卖点":"只展示可证实的信息"}</p><div>○ 等待工作流运行</div><footer>预计 3 点</footer></article>)}
      </div>
    </PageFrame>
  );
}

function WatermarksView() {
  return (
    <PageFrame className="real-watermark-page">
      <section className="real-watermark-card">
        <header><div><h1>水印管理 <i>图片水印</i></h1><p>集中管理当前账号的品牌水印，为后续商品图片处理做好模板准备。</p></div><button className="primary"><PlusOutlined /> 新增水印</button></header>
        <div className="real-watermark-filter"><div><SearchOutlined /> 搜索模板名称</div><div>2026-09-01　至　2026-09-23</div><button className="primary">查询</button><button>重置</button><span></span><button><DeleteOutlined /> 批量删除</button><button><ReloadOutlined /></button></div>
        <div className="real-watermark-table"><div className="real-watermark-row head"><span>□</span><span>序号</span><span>模板名称</span><span>预览</span><span>位置</span><span>设置</span><span>创建时间</span><span>操作</span></div>{[["品牌Logo-右下","右下","宽度 18% / 不透明度 72%"],["店铺角标","左上","宽度 14% / 不透明度 88%"],["促销水印","右上","宽度 22% / 不透明度 65%"]].map((r,i)=><div className="real-watermark-row" key={r[0]}><span>□</span><span>{i+1}</span><span><b>{r[0]}</b><small>ozong-{i+1}.png · 48KB</small></span><span><i className="wm-preview">OzonG</i></span><span><i className="status-chip gray">{r[1]}</i></span><span>{r[2]}</span><span>2026-09-{18+i}</span><span><button>查看</button><button>编辑</button><button className="danger-link">删除</button></span></div>)}</div>
      </section>
    </PageFrame>
  );
}

function MembershipView() {
  return (
    <PageFrame className="real-membership-page">
      <section className="real-membership-current"><div><small>OZONG MEMBERSHIP</small><h1>年卡会员</h1><p>当前会员有效期至 2027-08-19</p></div><div><b>2/3<small>登录设备</small></b><b>6/10<small>店铺数量</small></b><b>330天<small>剩余时间</small></b></div></section>
      <section className="real-membership-plans"><header><div><span>会员套餐</span><h2>选择适合你的 OzonG 会员</h2></div><p>会员只限制使用时限、同时登录设备数和店铺数；其余 ERP 业务功能不额外设置会员配额。</p></header><div className="plan-grid">{[["体验会员","7","1","1"],["月卡会员","30","2","3"],["季度会员","90","3","6"],["年卡会员","365","5","10"]].map((p,i)=><article className={i===3?"gold":""} key={p[0]}><span>{i===3?"GOLD":"OZONG"}</span><h3>{p[0]}</h3><strong>{p[1]} 天</strong><p>✓ {p[2]} 台设备同时登录</p><p>✓ {p[3]} 个店铺</p><p>✓ 全部 ERP 功能开放</p><button>{i===3?"当前套餐":"查看方案"}</button></article>)}</div></section>
    </PageFrame>
  );
}

function AccountView({ type }: { type: "account" | "users" | "extensions" }) {
  if (type === "users") {
    return <PageFrame className="real-settings-page"><section className="real-settings-head"><div><h1>用户与额度</h1><p>管理员手工充值或调整 AI 生图额度；每笔变更都会保留审计记录。</p></div><div className="search-box">搜索用户名 <SearchOutlined /></div></section><div className="real-settings-table"><div className="row head"><span>用户</span><span>角色</span><span>额度</span><span>状态</span><span>操作</span></div>{[["admin","管理员","956 点可用"],["operator01","运营","320 点可用"],["designer","设计","188 点可用"]].map(r=><div className="row" key={r[0]}><span><b>{r[0]}</b></span><span>{r[1]}</span><span><b>{r[2]}</b><small>总额度 1200 · 冻结 0</small></span><span><i className="status-chip success">启用</i></span><span><button>调整额度</button><button>流水</button></span></div>)}</div></PageFrame>;
  }
  if (type === "extensions") {
    return <PageFrame className="real-settings-page"><section className="real-settings-head"><div><h1>浏览器插件</h1><p>管理已连接 ERP 的 Auto-OZON 浏览器。撤销后，该设备会立即无法查询店铺或继续同步情报。</p></div><button>刷新</button></section><div className="real-security-tip"><SafetyCertificateOutlined /><b>隐私边界</b><span>Seller Cookie 始终留在浏览器；ERP 只接收白名单采集任务的必要结果，不保存 Cookie。</span></div><div className="real-settings-table"><div className="row head"><span>设备</span><span>插件版本</span><span>最近在线</span><span>状态</span><span>操作</span></div>{[["Chrome · Windows","0.0.19","刚刚"],["Edge · Windows","0.0.19","8 分钟前"]].map(r=><div className="row" key={r[0]}><span><b>{r[0]}</b></span><span>{r[1]}</span><span>{r[2]}</span><span><i className="status-chip success">已连接</i></span><span><button className="danger-link">撤销设备</button></span></div>)}</div></PageFrame>;
  }
  return <PageFrame className="real-account-page"><div className="real-account-layout"><aside><button className="active"><UserOutlined /> 修改资料</button><button><LockOutlined /> 修改密码</button><button><DesktopOutlined /> 设备管理</button></aside><section><header><div><h1>修改资料</h1><p>更新昵称、头像和个人账户信息。</p></div></header><div className="profile-avatar"><img src={REAL_AVATAR} alt="" /><div><b>1234</b><button>更换头像</button></div></div><label>昵称<div>1234</div></label><label>登录账号<div className="disabled">ozong_user_1234</div></label><div className="account-stats"><span>账号类型<b>客户</b></span><span>授权状态<b>年卡会员</b></span><span>AI 生图点数<b>956</b></span></div><button className="save">保存修改</button></section></div></PageFrame>;
}

function Sidebar({
  view,
  go,
  productsOpen,
  setProductsOpen,
  promoOpen,
  setPromoOpen,
}: {
  view: ViewKey;
  go: (view: ViewKey) => void;
  productsOpen: boolean;
  setProductsOpen: (value: boolean) => void;
  promoOpen: boolean;
  setPromoOpen: (value: boolean) => void;
}) {
  const productActive = ["products", "collection", "listing"].includes(view);
  const promoActive = ["promoJoin", "promoAuto"].includes(view);
  const itemClass = (key: ViewKey) => view === key ? "real-sidebar-item active" : "real-sidebar-item";
  return (
    <aside className="real-erp-sidebar">
      <button className="real-sidebar-logo" onClick={() => go("dashboard")}><span><img src={REAL_LOGO} alt="OzonG ERP" /></span><b>ERP管理系统</b></button>
      <nav className="real-sidebar-menu">
        <button className={itemClass("dashboard")} onClick={() => go("dashboard")}><HomeOutlined /><span>首页</span></button>

        <button className={`real-sidebar-item ${productActive ? "parent-active" : ""}`} onClick={() => setProductsOpen(!productsOpen)}><ShoppingOutlined /><span>商品</span>{productsOpen ? <DownOutlined /> : <RightOutlined />}</button>
        {productsOpen && <div className="real-sidebar-children">
          <button className={view === "products" ? "active" : ""} onClick={() => go("products")}>商品管理</button>
          <button className={view === "collection" ? "active" : ""} onClick={() => go("collection")}>采集箱</button>
          <button className={view === "listing" ? "active" : ""} onClick={() => go("listing")}>上架记录</button>
        </div>}

        <button className={itemClass("source1688")} onClick={() => go("source1688")}><ArrowRightOutlined /><span>1688 → Ozon</span></button>
        <button className={itemClass("orders")} onClick={() => go("orders")}><OrderedListOutlined /><span>订单管理</span></button>

        <button className={`real-sidebar-item ${promoActive ? "parent-active" : ""}`} onClick={() => setPromoOpen(!promoOpen)}><DollarOutlined /><span>促销活动</span>{promoOpen ? <DownOutlined /> : <RightOutlined />}</button>
        {promoOpen && <div className="real-sidebar-children">
          <button className={view === "promoJoin" ? "active" : ""} onClick={() => go("promoJoin")}>参加促销</button>
          <button className={view === "promoAuto" ? "active" : ""} onClick={() => go("promoAuto")}>自动踢促销</button>
        </div>}

        <button className={itemClass("shops")} onClick={() => go("shops")}><ShopOutlined /><span>店铺管理</span><RightOutlined /></button>
        <button className={itemClass("selection")} onClick={() => go("selection")}><ShoppingCartOutlined /><span>选品分析</span><RightOutlined /></button>
        <button className={itemClass("finance")} onClick={() => go("finance")}><BarChartOutlined /><span>财务中心</span><RightOutlined /></button>
        <button className={itemClass("aiImage")} onClick={() => go("aiImage")}><RobotOutlined /><span>AI生图</span></button>
        <button className={itemClass("watermarks")} onClick={() => go("watermarks")}><PictureOutlined /><span>水印管理</span></button>
      </nav>
      <div className="real-sidebar-footer">
        <button className="real-avatar-entry" onClick={() => go("account")}><img src={REAL_AVATAR} alt="1234" /></button>
        <button className="real-collapse-entry">« <span>收起侧栏</span></button>
      </div>
    </aside>
  );
}

export function WebErpDemo() {
  const [view, setView] = useState<ViewKey>("dashboard");
  const [tabs, setTabs] = useState<ViewKey[]>(["dashboard"]);
  const [productsOpen, setProductsOpen] = useState(false);
  const [promoOpen, setPromoOpen] = useState(false);

  const go = (next: ViewKey) => {
    setView(next);
    setTabs((current) => current.includes(next) ? current : [...current, next]);
    if (["products", "collection", "listing"].includes(next)) setProductsOpen(true);
    if (["promoJoin", "promoAuto"].includes(next)) setPromoOpen(true);
  };

  const closeTab = (closing: ViewKey) => {
    setTabs((current) => {
      if (current.length === 1) return current;
      const index = current.indexOf(closing);
      const nextTabs = current.filter((tab) => tab !== closing);
      if (view === closing) {
        const next = nextTabs[Math.max(0, index - 1)] || nextTabs[0] || "dashboard";
        setView(next);
      }
      return nextTabs;
    });
  };

  const renderView = () => {
    switch (view) {
      case "dashboard": return <DashboardView go={go} />;
      case "products": return <OnlineProductsView />;
      case "collection": return <CollectionView />;
      case "listing": return <ListingView />;
      case "source1688": return <Source1688View />;
      case "orders": return <OrdersView />;
      case "promoJoin": return <PromotionJoinView />;
      case "promoAuto": return <PromotionAutoView />;
      case "shops": return <ShopsView />;
      case "selection": return <SelectionView />;
      case "finance": return <FinanceView />;
      case "aiImage": return <AiImageView />;
      case "watermarks": return <WatermarksView />;
      case "membership": return <MembershipView />;
      case "users": return <AccountView type="users" />;
      case "extensions": return <AccountView type="extensions" />;
      case "account": return <AccountView type="account" />;
    }
  };

  return (
    <div className="erp-demo-frame real-version">
      <div className="erp-demo-badge"><span></span>网页端交互演示 · 示例数据</div>
      <div className="real-erp-app">
        <Sidebar
          view={view}
          go={go}
          productsOpen={productsOpen}
          setProductsOpen={setProductsOpen}
          promoOpen={promoOpen}
          setPromoOpen={setPromoOpen}
        />
        <div className="real-erp-main-layout">
          <div className="real-workspace-tabs">
            <div className="real-tabs-inner">
              <div className="real-tabs-scroll">
                {tabs.map((tab) => (
                  <button key={tab} className={`real-tab-item ${view === tab ? "active" : ""}`} onClick={() => setView(tab)}>
                    <span className="real-tab-dot"></span>
                    <span className="real-tab-title">{viewTitles[tab]}</span>
                    <span className="real-tab-close" onClick={(event) => { event.stopPropagation(); closeTab(tab); }}>×</span>
                  </button>
                ))}
              </div>
              <div className="real-tabs-right">
                <button className="real-membership-badge" onClick={() => go("membership")}>VIP　年卡会员(330天)</button>
                <span className="real-credit-wallet">生图点数：<b>956</b></span>
                <button className="real-recharge-btn" onClick={() => go("membership")}>充值</button>
              </div>
            </div>
          </div>
          <div className="real-erp-page-container">{renderView()}</div>
        </div>
      </div>
    </div>
  );
}
