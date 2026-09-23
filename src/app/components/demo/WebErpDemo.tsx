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
import { AiWorkflowReplica } from "./AiWorkflowReplica";
import { DashboardReplica } from "./DashboardReplica";
import { ProductsReplica } from "./ProductsReplica";
import { CollectionReplica } from "./CollectionReplica";
import { ListingReplica } from "./ListingReplica";
import { Source1688Replica } from "./Source1688Replica";
import { OrdersReplica } from "./OrdersReplica";
import { PromotionJoinReplica } from "./PromotionJoinReplica";
import { PromotionAutoReplica } from "./PromotionAutoReplica";
import { ShopsReplica } from "./ShopsReplica";
import { SelectionReplica } from "./SelectionReplica";
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

function DashboardView({ go }: { go: (view: ViewKey) => void }) { return <DashboardReplica go={go} />; }

function PageFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`real-erp-page ${className}`}>{children}</div>;
}

function OnlineProductsView() { return <ProductsReplica />; }

function CollectionView() { return <CollectionReplica />; }

function ListingView() { return <ListingReplica />; }

function Source1688View() { return <Source1688Replica />; }

function OrdersView() { return <OrdersReplica />; }

function PromotionJoinView() { return <PromotionJoinReplica />; }

function PromotionAutoView() { return <PromotionAutoReplica />; }

function ShopsView() { return <ShopsReplica />; }

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

function SelectionView() { return <SelectionReplica />; }

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

function AiImageView() { return <AiWorkflowReplica />; }

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
  collapsed,
  setCollapsed,
}: {
  view: ViewKey;
  go: (view: ViewKey) => void;
  productsOpen: boolean;
  setProductsOpen: (value: boolean) => void;
  promoOpen: boolean;
  setPromoOpen: (value: boolean) => void;
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}) {
  const [accountOpen, setAccountOpen] = useState(false);
  const [hoverGroup, setHoverGroup] = useState<"products"|"promo"|null>(null);
  const productActive = ["products", "collection", "listing"].includes(view);
  const promoActive = ["promoJoin", "promoAuto"].includes(view);
  const itemClass = (key: ViewKey) => view === key ? "real-sidebar-item active" : "real-sidebar-item";
  return (
    <aside className={`real-erp-sidebar ${collapsed ? "collapsed" : ""}`}>
      <button className="real-sidebar-logo" onClick={() => go("dashboard")}><span><img src={REAL_LOGO} alt="OzonG ERP" /></span><b>ERP管理系统</b></button>
      <nav className="real-sidebar-menu">
        <button className={itemClass("dashboard")} onClick={() => go("dashboard")}><HomeOutlined /><span>首页</span></button>

        <div className="real-menu-group-wrap" onMouseEnter={() => collapsed && setHoverGroup("products")} onMouseLeave={() => collapsed && setHoverGroup(null)}>
          <button className={`real-sidebar-item ${productActive ? "parent-active" : ""}`} onClick={() => { if (!collapsed) setProductsOpen(!productsOpen); }} title={collapsed ? "商品" : ""}><ShoppingOutlined /><span>商品</span>{productsOpen ? <DownOutlined /> : <RightOutlined />}</button>
          {productsOpen && !collapsed && <div className="real-sidebar-children">
            <button className={view === "products" ? "active" : ""} onClick={() => go("products")}>商品管理</button>
            <button className={view === "collection" ? "active" : ""} onClick={() => go("collection")}>采集箱</button>
            <button className={view === "listing" ? "active" : ""} onClick={() => go("listing")}>上架记录</button>
          </div>}
          {collapsed && hoverGroup === "products" && <div className="real-collapsed-flyout">
            <b>商品</b>
            <button className={view === "products" ? "active" : ""} onClick={() => go("products")}>商品管理</button>
            <button className={view === "collection" ? "active" : ""} onClick={() => go("collection")}>采集箱</button>
            <button className={view === "listing" ? "active" : ""} onClick={() => go("listing")}>上架记录</button>
          </div>}
        </div>

        <button className={itemClass("source1688")} onClick={() => go("source1688")}><ArrowRightOutlined /><span>1688 → Ozon</span></button>
        <button className={itemClass("orders")} onClick={() => go("orders")}><OrderedListOutlined /><span>订单管理</span></button>

        <div className="real-menu-group-wrap" onMouseEnter={() => collapsed && setHoverGroup("promo")} onMouseLeave={() => collapsed && setHoverGroup(null)}>
          <button className={`real-sidebar-item ${promoActive ? "parent-active" : ""}`} onClick={() => { if (!collapsed) setPromoOpen(!promoOpen); }} title={collapsed ? "促销活动" : ""}><DollarOutlined /><span>促销活动</span>{promoOpen ? <DownOutlined /> : <RightOutlined />}</button>
          {promoOpen && !collapsed && <div className="real-sidebar-children">
            <button className={view === "promoJoin" ? "active" : ""} onClick={() => go("promoJoin")}>参加促销</button>
            <button className={view === "promoAuto" ? "active" : ""} onClick={() => go("promoAuto")}>自动踢促销</button>
          </div>}
          {collapsed && hoverGroup === "promo" && <div className="real-collapsed-flyout">
            <b>促销活动</b>
            <button className={view === "promoJoin" ? "active" : ""} onClick={() => go("promoJoin")}>参加促销</button>
            <button className={view === "promoAuto" ? "active" : ""} onClick={() => go("promoAuto")}>自动踢促销</button>
          </div>}
        </div>

        <button className={itemClass("shops")} onClick={() => go("shops")}><ShopOutlined /><span>店铺管理</span><RightOutlined /></button>
        <button className={itemClass("selection")} onClick={() => go("selection")}><ShoppingCartOutlined /><span>选品分析</span><RightOutlined /></button>
        <button className={itemClass("finance")} onClick={() => go("finance")}><BarChartOutlined /><span>财务中心</span><RightOutlined /></button>
        <button className={itemClass("aiImage")} onClick={() => go("aiImage")}><RobotOutlined /><span>AI生图</span></button>
        <button className={itemClass("watermarks")} onClick={() => go("watermarks")}><PictureOutlined /><span>水印管理</span></button>
      </nav>
      <div className="real-sidebar-footer">
        <div className="real-account-menu-wrap">
          <button className="real-avatar-entry" onClick={() => setAccountOpen(!accountOpen)} aria-label="1234"><img src={REAL_AVATAR} alt="1234" /></button>
          {accountOpen && <div className="real-account-dropdown">
            <div className="real-account-summary"><b>1234</b><span>剩余使用：330 天</span></div>
            <button onClick={() => { go("users"); setAccountOpen(false); }}><TeamOutlined /> 用户与额度</button>
            <button onClick={() => { go("extensions"); setAccountOpen(false); }}><SafetyCertificateOutlined /> 浏览器插件</button>
            <i></i>
            <button onClick={() => setAccountOpen(false)}>退出登录</button>
          </div>}
        </div>
        <button className="real-collapse-entry" onClick={() => setCollapsed(!collapsed)}>{collapsed ? "»" : "«"} {!collapsed && <span>收起侧栏</span>}</button>
      </div>
    </aside>
  );
}

export function WebErpDemo() {
  const [view, setView] = useState<ViewKey>("dashboard");
  const [tabs, setTabs] = useState<ViewKey[]>(["dashboard"]);
  const [productsOpen, setProductsOpen] = useState(false);
  const [promoOpen, setPromoOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

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
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
        <div className={`real-erp-main-layout ${collapsed ? "collapsed" : ""}`}>
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
