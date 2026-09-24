import { useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowRightOutlined,
  BarChartOutlined,
  DollarOutlined,
  DownOutlined,
  HomeOutlined,
  OrderedListOutlined,
  PictureOutlined,
  RightOutlined,
  RobotOutlined,
  SafetyCertificateOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  TeamOutlined,
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
import { FinanceReplica } from "./FinanceReplica";
import { WatermarkReplica } from "./WatermarkReplica";
import { MembershipReplica } from "./MembershipReplica";
import { AccountReplica, UserCreditsReplica, ExtensionDevicesReplica } from "./SettingsReplicas";
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
  aiImage: "AI 商品图生成",
  watermarks: "水印管理",
  membership: "会员中心",
  account: "账户中心",
  users: "用户与额度",
  extensions: "浏览器插件",
};

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

function FinanceView() { return <FinanceReplica />; }

function AiImageView() { return <AiWorkflowReplica />; }

function WatermarksView() { return <WatermarkReplica />; }

function MembershipView() { return <MembershipReplica />; }

function AccountView({ type, go }: { type: "account" | "users" | "extensions"; go: (view: ViewKey) => void }) { if (type === "users") return <UserCreditsReplica />; if (type === "extensions") return <ExtensionDevicesReplica />; return <AccountReplica go={go} />; }

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
      case "users": return <AccountView type="users" go={go} />;
      case "extensions": return <AccountView type="extensions" go={go} />;
      case "account": return <AccountView type="account" go={go} />;
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
