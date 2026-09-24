import { useState } from "react";
import { AppstoreOutlined, BarChartOutlined, CalendarOutlined, CarOutlined, CrownOutlined, FireOutlined, PieChartOutlined, SafetyCertificateOutlined, TrophyOutlined } from "@ant-design/icons";
import "./selection-replica.css";

type PeriodKey="week"|"month"|"quarter"|"year";
const categories=[
["住宅和花园","7956.12万","812.46亿",14.87,10.94],
["服装","6124.76万","1194.62亿",11.45,15.92],
["美容和卫生","5018.33万","438.72亿",9.38,5.85],
["建筑和装修","4726.58万","781.39亿",8.84,10.41],
["食品","3915.64万","238.51亿",7.32,3.18],
["汽车用品","3098.27万","572.84亿",5.79,7.64],
["电子产品","2864.91万","641.27亿",5.36,8.55],
["Ozon Fresh食品","2688.44万","51.32亿",5.03,.68],
["小百货和配饰","2359.18万","229.76亿",4.41,3.06],
["药店","1874.52万","247.31亿",3.51,3.29],
["运动与休闲","1698.26万","338.62亿",3.18,4.51],
["日化","1496.71万","114.08亿",2.80,1.52],
["鞋类","1438.25万","446.73亿",2.69,5.95],
["宠物用品","1316.88万","192.14亿",2.46,2.56],
["爱好和创作","1129.43万","82.37亿",2.11,1.10],
["文具","1042.95万","58.12亿",1.95,.77],
["儿童用品","984.61万","162.48亿",1.84,2.16],
["家用电器","892.34万","401.76亿",1.67,5.35],
["家具","547.82万","329.45亿",1.02,4.39],
["书籍","488.37万","49.63亿",.91,.66],
["农场","86.14万","16.28亿",.16,.22],
["成人用品","79.52万","14.86亿",.15,.20],
["珠宝","73.81万","48.92亿",.14,.65],
["古董和收藏品","43.27万","4.91亿",.08,.07],
["乐器","39.42万","14.26亿",.07,.19],
["音影娱乐","34.85万","10.12亿",.07,.13],
["吸烟及配件","19.74万","2.06亿",.04,.03],
["汽车和摩托车","2315","7.18亿",0,.10],
["慈善","1984","184.6万",0,0],
] as const;
const cards=[
  {key:"week" as PeriodKey,label:"周数据",sales:"148,230,410",amount:"196.42亿",theme:"purple",icon:<CalendarOutlined/>},
  {key:"month" as PeriodKey,label:"月数据",sales:"603,812,900",amount:"782.16亿",theme:"blue",icon:<CalendarOutlined/>},
  {key:"quarter" as PeriodKey,label:"季数据",sales:"1,748,220,510",amount:"2264.73亿",theme:"cyan",icon:<PieChartOutlined/>},
  {key:"year" as PeriodKey,label:"年数据",sales:"5,968,441,320",amount:"7521.88亿",theme:"violet",icon:<BarChartOutlined/>},
];
export function SelectionReplica(){
  const [activePeriod,setActivePeriod]=useState<PeriodKey>("month");
  return <div className="selection-page-source">
    <section className="selection-toolbar-source"><div className="title-block-source"><h1>选品分析</h1><span>Ozon 全平台市场数据分析，每周更新</span></div></section>
    <section className="insight-strip-source">
      <article><span className="purple"><AppstoreOutlined/></span><div><strong>数据洞察</strong><em>市场需求持续增长</em></div></article>
      <article><span className="orange"><FireOutlined/></span><div><strong>住宅和花园类目表现活跃</strong><em>销量占比 14.87%</em></div></article>
      <article><span className="blue"><CrownOutlined/></span><div><strong>服装销售额占比高</strong><em>销售额占比 15.92%</em></div></article>
      <article><span className="cyan"><CarOutlined/></span><div><strong>FBO 发货占比 68.42%</strong><em>较上月提升 1.64 个百分点</em></div></article>
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
        <div className="donut-source" style={{background:"conic-gradient(#7c3aed 0 69.20%, #e9e7ff 69.20% 100%)"}}><strong>71.7%</strong><span>品牌占比</span></div>
        <div className="distribution-content-source"><div className="distribution-bars-source">
          <div className="distribution-row-source"><span>有品牌</span><i><b style={{width:"69.20%"}}></b></i><strong>69.20%</strong></div>
          <div className="distribution-row-source"><span>无品牌</span><i><b style={{width:"30.80%"}}></b></i><strong>30.80%</strong></div>
        </div><div className="distribution-metrics-source"><div><span>有品牌</span><p><em>销量</em><strong>4.13亿</strong></p><p><em>销售额</em><strong>6682.41亿</strong></p></div><div><span>无品牌</span><p><em>销量</em><strong>1.84亿</strong></p><p><em>销售额</em><strong>1337.58亿</strong></p></div></div></div>
      </div></article>
      <article className="panel-source distribution-panel-source"><div className="panel-head-source compact"><h2><CarOutlined/> 发货方式分布</h2></div><div className="distribution-body-source">
        <div className="donut-source blue" style={{background:"conic-gradient(#1677ff 0 68.42%, #dbeafe 68.42% 100%)"}}><strong>71.4%</strong><span>FBO占比</span></div>
        <div className="distribution-content-source"><div className="distribution-bars-source">
          <div className="distribution-row-source blue"><span>FBO</span><i><b style={{width:"68.42%"}}></b></i><strong>68.42%</strong></div>
          <div className="distribution-row-source blue"><span>FBS</span><i><b style={{width:"31.58%"}}></b></i><strong>31.58%</strong></div>
        </div><div className="distribution-metrics-source"><div><span>FBO</span><p><em>销量</em><strong>3.86亿</strong></p><p><em>销售额</em><strong>5188.36亿</strong></p></div><div><span>FBS</span><p><em>销量</em><strong>1.89亿</strong></p><p><em>销售额</em><strong>2784.11亿</strong></p></div></div></div>
      </div></article>
    </section>
  </div>
}
