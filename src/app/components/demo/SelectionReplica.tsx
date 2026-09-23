import { useState } from "react";
import { AppstoreOutlined, BarChartOutlined, CalendarOutlined, CarOutlined, CrownOutlined, FireOutlined, PieChartOutlined, SafetyCertificateOutlined, TrophyOutlined } from "@ant-design/icons";
import "./selection-replica.css";

type PeriodKey="week"|"month"|"quarter"|"year";
const categories=[
["住宅和花园","8624.84万","864.17亿",15.93,11.32],
["服装","6583.13万","1280.91亿",12.16,16.78],
["美容和卫生","5233.73万","411.16亿",9.66,5.39],
["建筑和装修","4902.73万","826.84亿",9.05,10.83],
["食品","4034.53万","216.93亿",7.45,2.84],
["汽车用品","3218.83万","605.99亿",5.94,7.94],
["Ozon Fresh食品","2790.65万","44.68亿",5.15,.59],
["电子产品","2757.78万","618.53亿",5.09,8.10],
["小百货和配饰","2428.27万","216.45亿",4.48,2.84],
["药店","1943.44万","234.79亿",3.59,3.08],
["运动与休闲","1701.61万","355.8亿",3.14,4.66],
["日化","1526.14万","102.98亿",2.82,1.35],
["鞋类","1479.95万","464.81亿",2.73,6.09],
["宠物用品","1358.13万","180.42亿",2.51,2.36],
["爱好和创作","1164.62万","74.9亿",2.15,.98],
["文具","1084.31万","51.94亿",2.00,.68],
["儿童用品","1010.67万","150.83亿",1.87,1.98],
["家用电器","901.59万","422.58亿",1.66,5.54],
["家具","525.79万","351.94亿",.97,4.61],
["书籍","509.06万","45.57亿",.94,.60],
["农场","79.23万","14.83亿",.15,.19],
["成人用品","82.69万","15.35亿",.15,.20],
["珠宝","75.19万","46.53亿",.14,.61],
["古董和收藏品","41.79万","4.35亿",.08,.06],
["乐器","37.18万","13.37亿",.07,.18],
["音影娱乐","36.39万","9.4亿",.07,.12],
["吸烟及配件","21.66万","1.79亿",.04,.02],
["汽车和摩托车","2073","6.35亿",0,.08],
["慈善","2366","159.1万",0,0],
] as const;
const cards=[
  {key:"week" as PeriodKey,label:"周数据",sales:"133,145,630",amount:"175.88亿",theme:"purple",icon:<CalendarOutlined/>},
  {key:"month" as PeriodKey,label:"月数据",sales:"541,543,500",amount:"704.81亿",theme:"blue",icon:<CalendarOutlined/>},
  {key:"quarter" as PeriodKey,label:"季数据",sales:"1,600,368,344",amount:"2075.52亿",theme:"cyan",icon:<PieChartOutlined/>},
  {key:"year" as PeriodKey,label:"年数据",sales:"5,411,882,918",amount:"6976.49亿",theme:"violet",icon:<BarChartOutlined/>},
];
export function SelectionReplica(){
  const [activePeriod,setActivePeriod]=useState<PeriodKey>("month");
  return <div className="selection-page-source">
    <section className="selection-toolbar-source"><div className="title-block-source"><h1>选品分析</h1><span>Ozon 全平台市场数据分析，每周更新</span></div></section>
    <section className="insight-strip-source">
      <article><span className="purple"><AppstoreOutlined/></span><div><strong>数据洞察</strong><em>市场需求持续增长</em></div></article>
      <article><span className="orange"><FireOutlined/></span><div><strong>住宅和花园类目增长最快</strong><em>销量占比 15.93%</em></div></article>
      <article><span className="blue"><CrownOutlined/></span><div><strong>服装销售额占比高</strong><em>销售额占比 16.78%</em></div></article>
      <article><span className="cyan"><CarOutlined/></span><div><strong>FBO 发货占比 71.36%</strong><em>较上月提升 2.18 个百分点</em></div></article>
    </section>
    <section className="period-grid-source">{cards.map(card=><article key={card.key} className={`period-card-source ${card.theme} ${activePeriod===card.key?"active":""}`} onClick={()=>setActivePeriod(card.key)}>
      <div className="card-wave-source"></div><div className="period-title-source">{card.label}</div><div className="period-field-source">销量</div><div className="period-value-source">{card.sales}</div><div className="period-field-source">销售额</div><div className="period-amount-source">¥{card.amount}</div><div className="period-icon-source">{card.icon}</div><div className="mini-bars-source">{[1,2,3,4,5,6,7].map(n=><i key={n} style={{height:`${8+n*4}px`}}></i>)}</div>
    </article>)}</section>
    <section className="ranking-section-source panel-source"><div className="panel-head-source"><h2><TrophyOutlined/> 一级类目排行</h2><button>查看全部 &gt;</button></div>
      <div className="category-table-source"><div className="table-row-source table-head-source"><span>排名</span><span>类目名</span><span>月销量</span><span>月销售额(₽)</span><span>销量占比</span><span>销售额占比</span></div>
        <div className="category-table-body-source">{categories.map((r,i)=><div className="table-row-source" key={r[0]}><span className={`rank-badge-source ${i<3?"top":""}`}>{i+1}</span><span className="category-name-source">{r[0]}</span><span>{r[1]}</span><span>{r[2]}</span><span>{Number(r[3]).toFixed(2)}%</span><span>{Number(r[4]).toFixed(2)}%</span></div>)}</div>
      </div><div className="table-footer-source">共 {categories.length} 条 <span>可在表格内上下拖动查看全部类目</span></div>
    </section>
    <section className="distribution-grid-source">
      <article className="panel-source distribution-panel-source"><div className="panel-head-source compact"><h2><SafetyCertificateOutlined/> 品牌分布</h2></div><div className="distribution-body-source">
        <div className="donut-source" style={{background:"conic-gradient(#7c3aed 0 71.67%, #e9e7ff 71.67% 100%)"}}><strong>71.7%</strong><span>品牌占比</span></div>
        <div className="distribution-content-source"><div className="distribution-bars-source">
          <div className="distribution-row-source"><span>有品牌</span><i><b style={{width:"71.67%"}}></b></i><strong>71.67%</strong></div>
          <div className="distribution-row-source"><span>无品牌</span><i><b style={{width:"28.33%"}}></b></i><strong>28.33%</strong></div>
        </div><div className="distribution-metrics-source"><div><span>有品牌</span><p><em>销量</em><strong>3.88亿</strong></p><p><em>销售额</em><strong>6419.23亿</strong></p></div><div><span>无品牌</span><p><em>销量</em><strong>1.53亿</strong></p><p><em>销售额</em><strong>1214.97亿</strong></p></div></div></div>
      </div></article>
      <article className="panel-source distribution-panel-source"><div className="panel-head-source compact"><h2><CarOutlined/> 发货方式分布</h2></div><div className="distribution-body-source">
        <div className="donut-source blue" style={{background:"conic-gradient(#1677ff 0 71.36%, #dbeafe 71.36% 100%)"}}><strong>71.4%</strong><span>FBO占比</span></div>
        <div className="distribution-content-source"><div className="distribution-bars-source">
          <div className="distribution-row-source blue"><span>FBO</span><i><b style={{width:"71.36%"}}></b></i><strong>71.36%</strong></div>
          <div className="distribution-row-source blue"><span>FBS</span><i><b style={{width:"29.06%"}}></b></i><strong>29.06%</strong></div>
        </div><div className="distribution-metrics-source"><div><span>FBO</span><p><em>销量</em><strong>3.86亿</strong></p><p><em>销售额</em><strong>5021.92亿</strong></p></div><div><span>FBS</span><p><em>销量</em><strong>1.57亿</strong></p><p><em>销售额</em><strong>2647.55亿</strong></p></div></div></div>
      </div></article>
    </section>
  </div>
}
