import { useState } from "react";
import {
  Home, Package, ArrowRight, ListOrdered, CircleDollarSign, Store, ShoppingCart,
  BarChart3, Bot, Image as ImageIcon, ChevronRight, ChevronDown, RefreshCw,
  Zap, ShieldCheck, Send, FileText, CheckCircle2, AlertTriangle, Search, Plus,
  MoreHorizontal, Upload, Trash2, Settings, UserRound, Monitor, Crown, WalletCards
} from "lucide-react";
import "./web-erp-demo.css";

type ViewKey =
  | "dashboard" | "products" | "collection" | "listing" | "source1688"
  | "orders" | "promoJoin" | "promoAuto" | "shops" | "selection"
  | "finance" | "aiImage" | "watermarks" | "membership" | "account"
  | "users" | "extensions";

const products = [
  {name:"家用多功能收纳架 可移动厨房置物架", sku:"1898518062", offer:"OZG-240923-001", price:"₽ 1,399", stock:68, status:"在售"},
  {name:"车载手机支架 360°旋转折叠款", sku:"1746914566", offer:"OZG-240923-002", price:"₽ 899", stock:42, status:"在售"},
  {name:"宠物除毛刷 沙发衣物清洁器", sku:"1522215222", offer:"OZG-240923-003", price:"₽ 1,099", stock:125, status:"审核中"},
  {name:"浴室免打孔置物架 双层收纳", sku:"1864169227", offer:"OZG-240923-004", price:"₽ 1,799", stock:31, status:"在售"},
];

const menu = [
  {key:"dashboard",label:"首页",icon:Home},
  {key:"productsGroup",label:"商品",icon:Package,children:[
    {key:"products",label:"商品管理"},
    {key:"collection",label:"采集箱"},
    {key:"listing",label:"上架记录"},
  ]},
  {key:"source1688",label:"1688 → Ozon",icon:ArrowRight},
  {key:"orders",label:"订单管理",icon:ListOrdered},
  {key:"promoGroup",label:"促销活动",icon:CircleDollarSign,children:[
    {key:"promoJoin",label:"参加促销"},
    {key:"promoAuto",label:"自动踢促销"},
  ]},
  {key:"shops",label:"店铺管理",icon:Store},
  {key:"selection",label:"选品分析",icon:ShoppingCart},
  {key:"finance",label:"财务中心",icon:BarChart3},
  {key:"aiImage",label:"AI生图",icon:Bot},
  {key:"watermarks",label:"水印管理",icon:ImageIcon},
];

const titles: Record<ViewKey,string> = {
  dashboard:"概览", products:"在线商品", collection:"采集箱", listing:"上架记录",
  source1688:"1688 → Ozon", orders:"订单列表", promoJoin:"参加促销", promoAuto:"自动踢促销",
  shops:"店铺管理", selection:"选品", finance:"财务中心", aiImage:"AI 商品图生成",
  watermarks:"水印管理", membership:"会员中心", account:"账户中心", users:"用户与额度", extensions:"浏览器插件"
};

function MiniTable({kind="products"}:{kind?:string}) {
  const rows = kind==="orders" ? [
    ["47619823-0007-1","厨房置物架","黑左严选一店","₽ 1,399","待发货"],
    ["47619510-0012-1","宠物清洁刷","UyutHome 家居","₽ 899","已发货"],
    ["47619082-0004-1","车载手机支架","北极星百货","₽ 1,099","已签收"],
    ["47618845-0009-1","浴室置物架","TopDom Store","₽ 1,799","待发货"],
  ] : products.map(p=>[p.name,p.offer,p.price,String(p.stock),p.status]);
  const heads = kind==="orders" ? ["订单号","商品","店铺","金额","状态"] : ["商品信息","货号 / SKU","售价","库存","状态"];
  return <div className="demo-table">
    <div className="demo-tr demo-th">{heads.map(h=><span key={h}>{h}</span>)}</div>
    {rows.map((r,i)=><div className="demo-tr" key={i}>
      {r.map((c,j)=><span key={j} className={j===0?"strong":""}>{j===0 && kind!=="orders" && <i className="demo-thumb">{["📦","🚗","🐾","🧺"][i%4]}</i>}{c}</span>)}
    </div>)}
  </div>
}

function DashboardView({go}:{go:(v:ViewKey)=>void}) {
  return <div className="erp-demo-page dashboard-demo">
    <div className="dash-hero">
      <div className="welcome-card">
        <div><h2>欢迎回来，1234</h2><p>今天是 2026年9月23日星期三，祝您工作顺利！</p></div>
        <div className="hero-cubes"><i></i><i></i><i></i></div>
      </div>
      <button className="ai-banner" onClick={()=>go("aiImage")}>
        <div><h3>AI 商品图生成</h3><p>一键生成高质量商品图，提升转化率</p><b>立即生成 →</b></div><Zap size={34}/>
      </button>
    </div>
    <div className="stats-row">
      {[
        ["今日销售额","¥ 12,486.32","↑ 12.8%","blue","◎"],
        ["本月销售额","¥ 286,940.10","↑ 18.5%","purple","🛒"],
        ["今日订单数","137","↑ 9.6%","green","▤"],
        ["待发货订单","26","↓ 3.2%","orange","➤"],
        ["店铺数量","6","正常 6 / 异常 0","red","▣"],
      ].map((s,i)=><article className="stat-card-demo" key={s[0]}>
        <div className={"stat-icon-demo "+s[3]}>{s[4]}</div><label>{s[0]}</label><strong>{s[1]}</strong><small>{s[2]}</small><i className={"spark "+s[3]}></i>
      </article>)}
    </div>
    <div className="dash-grid">
      <section className="demo-card trend-demo">
        <div className="card-head"><h3>销售趋势</h3><div><button className="on">近7天</button><button>近30天</button><button>近90天</button></div></div>
        <div className="legend"><b>━ 销售额(¥)</b><b>━ 订单数</b><span>全部店铺⌄</span></div>
        <div className="chart-area">
          {[0,1,2,3].map(i=><i className="gridline" style={{top:(22+i*22)+"%"}} key={i}></i>)}
          <svg viewBox="0 0 600 220" preserveAspectRatio="none"><polyline points="10,170 100,140 190,155 280,92 370,120 460,65 590,82" fill="none" stroke="#4f7cff" strokeWidth="3"/><polyline points="10,188 100,166 190,178 280,145 370,150 460,116 590,124" fill="none" stroke="#22c55e" strokeWidth="3"/></svg>
          <div className="chart-labels"><span>09-17</span><span>09-18</span><span>09-19</span><span>09-20</span><span>09-21</span><span>09-22</span><span>09-23</span></div>
        </div>
      </section>
      <section className="demo-card quick-demo"><div className="card-head"><h3>快捷入口</h3></div><div className="quick-grid">
        {[["同步商品","从 Ozon 同步商品",RefreshCw,"products"],["AI 生成商品图","批量生成高质量图",Zap,"aiImage"],["店铺授权","管理店铺授权状态",ShieldCheck,"shops"],["发布商品","发布到 Ozon 平台",Send,"products"],["生成记录","查看历史生成记录",FileText,"listing"],["成本统计","查看成本消耗情况",BarChart3,"finance"]].map(([a,b,I,v]:any)=><button onClick={()=>go(v)} key={a}><i><I size={18}/></i><span><b>{a}</b><small>{b}</small></span></button>)}
      </div></section>
      <section className="demo-card notice-demo"><div className="card-head"><h3>系统通知 <small>4 条未读</small></h3><button>全部已读</button></div>
        {[
          ["财务同步完成","已同步 137 笔订单，286 条财务流水。","7分钟前","ok"],
          ["商品同步完成","店铺「黑左严选一店」同步完成。","18分钟前","ok"],
          ["库存预警","3 个商品库存低于安全库存线。","1小时前","warn"],
          ["促销检查完成","发现 8 个商品可参加平台活动。","2小时前","warn"]
        ].map(n=><div className="notice-row" key={n[0]}><i className={n[3]}>{n[3]==="ok"?"✓":"!"}</i><span><b>{n[0]}</b><small>{n[1]}</small></span><time>{n[2]}</time></div>)}
      </section>
    </div>
  </div>
}

function PageShell({title,subtitle,children,actions}:{title:string,subtitle:string,children:React.ReactNode,actions?:React.ReactNode}) {
  return <div className="erp-demo-page generic-page">
    <section className="page-panel-head"><div><h2>{title}</h2><p>{subtitle}</p></div><div className="head-actions">{actions}</div></section>
    {children}
  </div>
}

function ProductsView() {
  return <PageShell title="在线商品" subtitle="同步并集中管理已上架 Ozon 商品，支持批量改价、库存、促销与商品修复。"
    actions={<><button className="plain-btn">同步操作⌄</button><button className="primary-btn"><Plus size={14}/> 新建商品</button></>}>
    <div className="filter-bar"><span>全部店铺⌄</span><span><Search size={13}/> 搜索商品名称</span><span>输入货号或 SKU</span><button className="primary-btn">查询</button><button className="plain-btn">批量操作⌄</button></div>
    <div className="status-strip">{[["全部",1286],["在售",1132],["审核中",38],["异常",12],["已归档",104]].map(x=><button key={x[0]}><span>{x[0]}</span><b>{x[1]}</b></button>)}</div>
    <section className="demo-card table-card"><MiniTable/></section>
  </PageShell>
}

function CollectionView() {
  return <PageShell title="采集箱" subtitle="核对从 Ozon 前台或插件采集的商品，选择后进入上架流程。"
    actions={<><span className="selected">已选 3 项</span><button className="danger-btn"><Trash2 size={13}/> 删除</button><button className="plain-btn"><RefreshCw size={13}/> 刷新</button></>}>
    <section className="demo-card table-card"><div className="demo-tr demo-th collection-grid"><span>☑</span><span>商品信息</span><span>SKU</span><span>来源平台</span><span>采集时间</span><span>价格</span><span>操作</span></div>
      {products.map((p,i)=><div className="demo-tr collection-grid" key={p.sku}><span>☑</span><span className="strong"><i className="demo-thumb">{["📦","🚗","🐾","🧺"][i]}</i>{p.name}</span><span>{p.sku}</span><span>OZON RU</span><span>09-23 14:{20+i*4}</span><span>{p.price}</span><span><button>原链接</button> <button className="link-primary">上架</button></span></div>)}
    </section>
  </PageShell>
}

function ListingView() {
  return <PageShell title="上架记录" subtitle="查看通过 ERP 与浏览器插件提交到 Ozon 的商品上架任务及处理结果。" actions={<button className="plain-btn"><RefreshCw size={13}/> 刷新</button>}>
    <section className="demo-card table-card"><div className="demo-tr demo-th listing-grid"><span>主图</span><span>商品</span><span>店铺</span><span>状态</span><span>结果</span><span>创建时间</span></div>
      {products.map((p,i)=><div className="demo-tr listing-grid" key={p.sku}><span><i className="demo-thumb">{["📦","🚗","🐾","🧺"][i]}</i></span><span className="strong">{p.name}<small>{p.offer}</small></span><span>{["黑左严选一店","UyutHome 家居","北极星百货","TopDom Store"][i]}</span><span><em className={"tag "+(i===2?"run":"ok")}>{i===2?"上架中":"上架成功"}</em></span><span>{i===2?"正在上传商品图片…":"已提交 Ozon"}</span><span>09-23 14:{30+i*5}</span></div>)}
    </section>
  </PageShell>
}

function Source1688View() {
  return <PageShell title="1688 → Ozon" subtitle="浏览器插件采集的 1688 商品统一进入这里，完成类目、必填项、包装、定价和上架处理。"
    actions={<><span className="switch-on">● 生成图/视频封面</span><span className="select-like">上架店铺：黑左严选一店⌄</span><button className="plain-btn">上架设置</button><button className="primary-btn">打开 1688</button></>}>
    <div className="source-summary"><article><span>已采集商品</span><b>128</b></article><article><span>来源平台</span><b>1688</b></article><article><span>待处理</span><b>24</b></article><article><span>今日已上架</span><b>67</b></article></div>
    <section className="demo-card source-card"><div className="section-title"><div><h3>1688 商品</h3><p>SKU 已完成筛选；类目、必填项、包装估算、定价和 Ozon JSON 由系统自动处理。</p></div><button className="primary-btn">批量上架至 Ozon</button></div>
      <div className="source-grid">{products.map((p,i)=><article className="source-product" key={p.sku}><div className="product-photo">{["🧺","🚗","🐾","📦"][i]}<b>1688</b></div><h4>{p.name}</h4><small>货源 ID：{1688000000+i*15319}</small><div><span>价格<b>¥ {18+i*7}.80</b></span><span>图片<b>{6+i} 张</b></span><span>SKU<b>{3+i}</b></span></div><footer><button>查看货源</button><button className="primary-btn">{i===1?"处理中…":"上架至 Ozon"}</button></footer></article>)}</div>
    </section>
  </PageShell>
}

function OrdersView() {
  return <PageShell title="订单管理" subtitle="统一查看多个 Ozon 店铺订单状态、商品明细、物流与采购成本。" actions={<button className="primary-btn"><RefreshCw size={13}/> 同步订单</button>}>
    <div className="filter-bar"><span>全部店铺⌄</span><span>订单状态：全部⌄</span><span><Search size={13}/> 订单号 / SKU</span><span>下单日期 09-17 至 09-23</span><button className="primary-btn">查询</button></div>
    <div className="status-strip">{[["全部订单",486],["待发货",26],["已发货",91],["已签收",342],["已取消",27]].map(x=><button key={x[0]}><span>{x[0]}</span><b>{x[1]}</b></button>)}</div>
    <section className="demo-card table-card"><MiniTable kind="orders"/></section>
  </PageShell>
}

function PromoJoinView() {
  return <PageShell title="参加促销" subtitle="查看商品可参与的 Ozon 平台促销活动，并批量加入活动。" actions={<button className="primary-btn">同步促销活动</button>}>
    <div className="promo-kpis">{[["可参加活动","14"],["可参加商品","326"],["已参加商品","188"],["待处理","38"]].map(x=><article key={x[0]}><span>{x[0]}</span><b>{x[1]}</b></article>)}</div>
    <section className="demo-card table-card"><div className="demo-tr demo-th promo-grid"><span>活动名称</span><span>活动时间</span><span>可参加商品</span><span>目标折扣</span><span>状态</span><span>操作</span></div>
      {[["秋季超级大促","09-20 ~ 10-08","128","12%"],["家居生活节","09-25 ~ 10-12","76","15%"],["限时闪购","09-23 ~ 09-26","54","8%"],["新客专享","长期","68","10%"]].map((r,i)=><div className="demo-tr promo-grid" key={r[0]}>{r.map(x=><span key={x}>{x}</span>)}<span><em className="tag ok">{i===0?"进行中":"可参加"}</em></span><span><button className="link-primary">选择商品</button></span></div>)}
    </section>
  </PageShell>
}

function PromoAutoView() {
  return <PageShell title="自动踢促销" subtitle="按价格保护规则监控促销商品，避免活动折扣导致售价低于设定底线。" actions={<button className="primary-btn">+ 新增监控规则</button>}>
    <div className="rule-grid">{[["价格保护","目标利润率低于 18% 自动退出促销","已启用"],["最低售价","低于 ₽899 自动退出促销","已启用"],["库存保护","库存低于 5 件暂停活动","已启用"]].map(r=><article className="demo-card rule-card" key={r[0]}><div><ShieldCheck/><h3>{r[0]}</h3></div><p>{r[1]}</p><footer><em className="tag ok">{r[2]}</em><button>编辑</button></footer></article>)}</div>
    <section className="demo-card table-card"><div className="section-title"><h3>最近执行记录</h3></div><div className="demo-tr demo-th"><span>商品</span><span>店铺</span><span>原因</span><span>结果</span><span>时间</span></div>{products.slice(0,3).map((p,i)=><div className="demo-tr" key={p.sku}><span>{p.name}</span><span>黑左严选一店</span><span>{["利润率低于阈值","售价触发保护","库存低于阈值"][i]}</span><span><em className="tag ok">已退出</em></span><span>今天 1{i}:20</span></div>)}</section>
  </PageShell>
}

function ShopsView() {
  return <PageShell title="店铺管理" subtitle="集中维护 Ozon Client ID、API Key、币种、默认店铺和授权状态。" actions={<button className="primary-btn"><Plus size={14}/> 添加店铺</button>}>
    <div className="shop-grid">{["黑左严选一店","UyutHome 家居","北极星百货","TopDom Store","Sever Home","МиниДом 生活馆"].map((n,i)=><article className="demo-card shop-card" key={n}><header><span className="ozon-mark">ozon</span><em className="tag ok">已连接</em></header><h3>{n}</h3><p>Client ID：{2178453+i*12834}</p><div><span>在线商品<b>{128+i*37}</b></span><span>待发货<b>{3+i}</b></span></div><footer><button>设为默认</button><button className="link-primary">管理</button></footer></article>)}</div>
  </PageShell>
}

function SelectionView() {
  return <PageShell title="选品分析" subtitle="基于 Ozon 类目与市场数据观察销量、销售额、品牌和发货方式分布。" actions={<><span className="select-like">类目：家居与花园⌄</span><button className="primary-btn">刷新数据</button></>}>
    <div className="selection-kpis">{[["类目商品数","248,316"],["月销量","1,286,420"],["月销售额","₽ 2.84B"],["平均价格","₽ 1,746"],["品牌占比","31.8%"]].map(x=><article key={x[0]}><span>{x[0]}</span><b>{x[1]}</b><small>较上月 ↑ 8.6%</small></article>)}</div>
    <div className="selection-grid"><section className="demo-card"><div className="card-head"><h3>一级类目排行</h3><button>查看全部 ›</button></div>{["家居收纳","厨房用品","汽车用品","宠物用品","园艺工具"].map((n,i)=><div className="rank-row" key={n}><b>{i+1}</b><span>{n}</span><strong>{(186-i*24)+"K"}</strong><em>{(18.6-i*2.1).toFixed(1)}%</em></div>)}</section><section className="demo-card"><div className="card-head"><h3>品牌 / 发货方式分布</h3></div><div className="donut-demo"><div><b>31.8%</b><span>品牌占比</span></div><div><b>64.2%</b><span>FBO/FBP</span></div></div><div className="bar-list"><p><span>无品牌</span><i><b style={{width:"68%"}}></b></i><em>68.2%</em></p><p><span>品牌商品</span><i><b style={{width:"32%"}}></b></i><em>31.8%</em></p><p><span>FBS/rFBS</span><i><b style={{width:"36%"}}></b></i><em>35.8%</em></p></div></section></div>
  </PageShell>
}

function FinanceView() {
  return <PageShell title="财务中心" subtitle="统计已签收订单的收支情况，按销售所得、采购成本、Ozon 费用与其他支出估算利润。" actions={<button className="plain-btn">口径说明</button>}>
    <div className="finance-eq">{[["销售所得","₽ 428,650","green"],["采购成本","¥ 12,860","orange"],["Ozon费用","₽ 86,430","purple"],["其他支出","₽ 12,480","red"],["估算利润","¥ 24,638","blue"]].map((x,i)=><><article className={x[2]} key={x[0]}><span>{x[0]}</span><b>{x[1]}</b>{i===4&&<small>利润率 31.6%</small>}</article>{i<4&&<strong className="eq-sign">{i===3?"=":"−"}</strong>}</>)}</div>
    <div className="filter-bar"><span>全部店铺⌄</span><span>签收日期 09-01 至 09-23</span><span><Search size={13}/> 订单号 / SKU / 货号</span><button className="primary-btn">查询</button><button className="plain-btn">导出 Excel</button></div>
    <section className="demo-card table-card"><div className="demo-tr demo-th finance-grid"><span>订单 / 商品</span><span>销售所得</span><span>采购成本</span><span>平台费用</span><span>物流</span><span>估算利润</span></div>{products.map((p,i)=><div className="demo-tr finance-grid" key={p.sku}><span className="strong">47619{i}82-000{i+1}-1<small>{p.name}</small></span><span>₽ {1399+i*340}</span><span>¥ {18+i*7}.80</span><span>₽ {220+i*44}</span><span>₽ {180+i*32}</span><span className="profit">¥ {82+i*29}.40</span></div>)}</section>
  </PageShell>
}

function AiImageView() {
  return <PageShell title="AI 商品图生成" subtitle="以商品原图为产品真实性依据，生成 Ozon 主图和成套商品图。" actions={<><button className="plain-btn">历史记录</button><button className="primary-btn">新建任务</button></>}>
    <div className="ai-canvas-demo"><div className="ai-toolbar"><button>100%</button><button>适应画布</button><button>重置布局</button></div><div className="workflow"><article className="node source-node"><header>① 商品原图</header><div className="node-img">📦</div><p>上传 / 粘贴商品图片</p></article><i>→</i><article className="node ai-node"><header>② AI 商品分析</header><p>识别产品主体</p><p>生成俄语卖点</p><p>规划主图与副图</p><button className="primary-btn">生成方案</button></article><i>→</i><article className="node result-node"><header>③ 商品图结果</header><div className="result-pics"><b>主图</b><b>场景</b><b>卖点</b><b>规格</b></div><p>预计消耗 12 点</p></article></div></div>
  </PageShell>
}

function WatermarksView() {
  return <PageShell title="水印管理" subtitle="集中管理当前账号的品牌图片水印，为商品图片处理准备模板。" actions={<button className="primary-btn"><Plus size={14}/> 新增水印</button>}>
    <div className="filter-bar"><span><Search size={13}/> 搜索模板名称</span><span>开始日期 — 结束日期</span><button className="primary-btn">查询</button><button className="plain-btn">重置</button></div>
    <section className="demo-card table-card"><div className="demo-tr demo-th watermark-grid"><span>序号</span><span>模板名称</span><span>预览</span><span>位置</span><span>设置</span><span>创建时间</span><span>操作</span></div>{[["品牌Logo-右下","右下","宽度 18% · 透明度 72%"],["店铺角标","左上","宽度 14% · 透明度 88%"],["促销水印","右上","宽度 22% · 透明度 65%"]].map((r,i)=><div className="demo-tr watermark-grid" key={r[0]}><span>{i+1}</span><span className="strong">{r[0]}</span><span><i className="wm-preview">OzonG</i></span><span>{r[1]}</span><span>{r[2]}</span><span>2026-09-{18+i}</span><span><button>查看</button> <button className="link-primary">编辑</button></span></div>)}</section>
  </PageShell>
}

function MembershipView() {
  return <PageShell title="会员中心" subtitle="查看当前会员权益、设备/店铺额度与激活码。" actions={<button className="primary-btn">兑换激活码</button>}>
    <div className="member-current"><div><span>OZONG MEMBERSHIP</span><h2>年卡会员</h2><p>当前会员有效期至 2027-08-19</p></div><div><b>2 / 3<small>登录设备</small></b><b>6 / 10<small>店铺数量</small></b><b>330天<small>剩余时间</small></b></div></div>
    <div className="plans-demo">{[["体验会员","7 天","1 台设备","1 个店铺"],["月卡会员","30 天","2 台设备","3 个店铺"],["季度会员","90 天","3 台设备","6 个店铺"],["年卡会员","365 天","5 台设备","10 个店铺"]].map((p,i)=><article className={"demo-card plan-demo "+(i===3?"popular":"")} key={p[0]}><span>{i===3?"GOLD":"OZONG"}</span><h3>{p[0]}</h3><b>{p[1]}</b><p>✓ {p[2]}</p><p>✓ {p[3]}</p><p>✓ 全部 ERP 功能开放</p><button className={i===3?"primary-btn":"plain-btn"}>{i===3?"当前套餐":"查看方案"}</button></article>)}</div>
  </PageShell>
}

function SettingsView({type}:{type:"account"|"users"|"extensions"}) {
  const cfg = type==="account" ? ["账户中心","管理个人资料、密码与登录设备。"] : type==="users" ? ["用户与额度","管理员调整团队用户与 AI 生图额度。"] : ["浏览器插件","管理已连接 ERP 的 Auto-OZON 浏览器设备。"];
  return <PageShell title={cfg[0]} subtitle={cfg[1]} actions={<button className="plain-btn"><RefreshCw size={13}/> 刷新</button>}>
    {type==="account" ? <div className="settings-layout"><aside><button className="on"><UserRound/> 修改资料</button><button><Settings/> 修改密码</button><button><Monitor/> 设备管理</button></aside><section className="demo-card profile-card"><div className="avatar-big">12</div><label>昵称</label><div className="input-demo">1234</div><label>登录账号</label><div className="input-demo muted">ozong_user_1234</div><div className="profile-stats"><span>账号类型<b>客户</b></span><span>授权状态<b>年卡会员</b></span><span>AI 生图点数<b>956</b></span></div><button className="primary-btn">保存修改</button></section></div> :
    type==="users" ? <section className="demo-card table-card"><div className="demo-tr demo-th"><span>用户</span><span>角色</span><span>额度</span><span>状态</span><span>操作</span></div>{[["admin","管理员","956 点可用"],["operator01","运营","320 点可用"],["designer","设计","188 点可用"]].map(r=><div className="demo-tr" key={r[0]}><span className="strong">{r[0]}</span><span>{r[1]}</span><span>{r[2]}</span><span><em className="tag ok">启用</em></span><span><button>调整额度</button> <button>流水</button></span></div>)}</section> :
    <><div className="security-tip"><ShieldCheck/> <b>隐私边界</b><span>Seller Cookie 始终留在浏览器；ERP 只接收白名单采集任务的必要结果。</span></div><section className="demo-card table-card"><div className="demo-tr demo-th"><span>设备</span><span>插件版本</span><span>最近在线</span><span>状态</span><span>操作</span></div>{[["Chrome · Windows","0.0.19","刚刚"],["Edge · Windows","0.0.19","8 分钟前"]].map(r=><div className="demo-tr" key={r[0]}><span className="strong">{r[0]}</span><span>{r[1]}</span><span>{r[2]}</span><span><em className="tag ok">已连接</em></span><span><button>撤销设备</button></span></div>)}</section></>}
  </PageShell>
}

export function WebErpDemo() {
  const [view,setView] = useState<ViewKey>("dashboard");
  const [productsOpen,setProductsOpen] = useState(false);
  const [promoOpen,setPromoOpen] = useState(false);
  const [accountOpen,setAccountOpen] = useState(false);

  const renderView = () => {
    switch(view){
      case "dashboard": return <DashboardView go={setView}/>;
      case "products": return <ProductsView/>;
      case "collection": return <CollectionView/>;
      case "listing": return <ListingView/>;
      case "source1688": return <Source1688View/>;
      case "orders": return <OrdersView/>;
      case "promoJoin": return <PromoJoinView/>;
      case "promoAuto": return <PromoAutoView/>;
      case "shops": return <ShopsView/>;
      case "selection": return <SelectionView/>;
      case "finance": return <FinanceView/>;
      case "aiImage": return <AiImageView/>;
      case "watermarks": return <WatermarksView/>;
      case "membership": return <MembershipView/>;
      case "account": return <SettingsView type="account"/>;
      case "users": return <SettingsView type="users"/>;
      case "extensions": return <SettingsView type="extensions"/>;
    }
  };

  const isActive=(k:string)=>view===k || (k==="productsGroup"&&["products","collection","listing"].includes(view)) || (k==="promoGroup"&&["promoJoin","promoAuto"].includes(view));

  return <div className="erp-demo-frame">
    <div className="erp-demo-badge"><span></span>网页端交互演示 · 示例数据</div>
    <div className="erp-demo-window">
      <aside className="erp-demo-sidebar">
        <button className="erp-logo" onClick={()=>setView("dashboard")}><span>G</span><b>ERP管理系统</b></button>
        <nav>
          {menu.map((item:any)=>{
            const I=item.icon;
            if(item.children){
              const open=item.key==="productsGroup"?productsOpen:promoOpen;
              const toggle=()=> item.key==="productsGroup"?setProductsOpen(!productsOpen):setPromoOpen(!promoOpen);
              return <div className="menu-group" key={item.key}>
                <button className={"menu-item "+(isActive(item.key)?"parent-active":"")} onClick={toggle}><I/><span>{item.label}</span>{open?<ChevronDown/>:<ChevronRight/>}</button>
                {open&&<div className="submenu">{item.children.map((c:any)=><button key={c.key} className={view===c.key?"active":""} onClick={()=>setView(c.key)}>{c.label}</button>)}</div>}
              </div>
            }
            return <button key={item.key} className={"menu-item "+(view===item.key?"active":"")} onClick={()=>setView(item.key)}><I/><span>{item.label}</span>{["shops","selection","finance"].includes(item.key)&&<ChevronRight/>}</button>
          })}
        </nav>
        <div className="sidebar-bottom">
          <button className="avatar-btn" onClick={()=>setAccountOpen(!accountOpen)}><span>12</span><b>1234</b><ChevronRight/></button>
          {accountOpen&&<div className="account-pop">
            <button onClick={()=>{setView("membership");setAccountOpen(false)}}><Crown/> 会员中心</button>
            <button onClick={()=>{setView("account");setAccountOpen(false)}}><UserRound/> 账户中心</button>
            <button onClick={()=>{setView("users");setAccountOpen(false)}}><WalletCards/> 用户与额度</button>
            <button onClick={()=>{setView("extensions");setAccountOpen(false)}}><Monitor/> 浏览器插件</button>
          </div>}
          <button className="collapse-fake">« <span>收起侧栏</span></button>
        </div>
      </aside>
      <main className="erp-demo-main">
        <header className="erp-demo-top">
          <div className="workspace-tab"><i></i>{titles[view]} <span>×</span></div>
          <div className="top-account"><button className="vip-pill" onClick={()=>setView("membership")}>VIP&nbsp;&nbsp;年卡会员(330天)</button><span>生图点数：<b>956</b></span><button onClick={()=>setView("membership")}>充值</button></div>
        </header>
        <div className="erp-demo-content">{renderView()}</div>
      </main>
    </div>
  </div>
}
