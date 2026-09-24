import { useRef, useState } from "react";
import { CheckCircleOutlined } from "@ant-design/icons";
import { DemoToast } from "./ReplicaCommon";
import "./membership-replica.css";

const plans=[
 {code:"trial",name:"体验会员",price:0,duration:7,devices:1,stores:1,kicker:"STARTER"},
 {code:"month",name:"月卡会员",price:299,duration:30,devices:2,stores:3,kicker:"COPPER"},
 {code:"quarter",name:"季度会员",price:699,duration:90,devices:3,stores:6,kicker:"SILVER"},
 {code:"year",name:"年卡会员",price:1999,duration:365,devices:5,stores:10,kicker:"GOLD"},
];
export function MembershipReplica(){
 const [code,setCode]=useState("");const [days,setDays]=useState(214);const [toast,setToast]=useState("");const [redeeming,setRedeeming]=useState(false);const redeemRef=useRef<HTMLElement|null>(null);
 const flash=(t:string)=>{setToast(t);setTimeout(()=>setToast(""),1600)};
 const focus=()=>redeemRef.current?.scrollIntoView({behavior:"smooth",block:"center"});
 const redeem=()=>{const v=code.trim();if(!v){flash("请输入会员激活码");return}setRedeeming(true);setTimeout(()=>{setRedeeming(false);if(v.toUpperCase().startsWith("OZG")){setDays(d=>d+30);setCode("");flash("激活成功：会员时长已顺延")}else flash("激活码不存在或已失效")},800)};
 return <div className="membership-page-source"><DemoToast text={toast}/>
  <section className="current-membership-source tone-gold"><div><span>OZONG MEMBERSHIP</span><h1>年卡会员</h1><p>当前会员有效期至 2027-04-26</p></div><div className="member-stats-source"><span><b>3/5</b><small>登录设备</small></span><span><b>3/10</b><small>店铺数量</small></span><span><b>{days}天</b><small>剩余时间</small></span></div></section>
  <section className="plans-section-source"><div className="plans-heading-source"><div><span>会员套餐</span><h2>选择适合你的 OzonG 会员</h2></div><p>会员只限制使用时限、同时登录设备数和店铺数；其余 ERP 业务功能不额外设置会员配额。</p></div>
   <div className="plan-grid-source">{plans.map(p=>{const original=p.code==="quarter"?299*3:p.code==="year"?299*12:null;const discount=original&&p.price?((p.price/original)*10).toFixed(1)+"折":"";return <article className={"plan-card-source plan-"+p.code} key={p.code}><div className="plan-top-source"><div><span>{p.kicker}</span><h3>{p.name}</h3></div>{discount&&<i>{discount}</i>}</div><div className="price-row-source">{p.price>0?<><span>¥</span><b>{p.price}</b><em>/{p.code==="month"?"月":p.code==="quarter"?"季度":"年"}</em></>:<b className="free">免费体验</b>}</div>{original&&<div className="original-price-source">按月原价 ¥{original}</div>}<button className="plan-action-source" onClick={focus}>{p.code==="trial"?"兑换体验码":"开通"+p.name}</button><div className="benefits-source"><p><CheckCircleOutlined/><span><b>{p.duration}</b> 天使用时限</span></p><p><CheckCircleOutlined/><span><b>{p.devices}</b> 台设备同时登录</span></p><p><CheckCircleOutlined/><span><b>{p.stores}</b> 个店铺</span></p><p><CheckCircleOutlined/><span>全部 ERP 功能开放</span></p><p><CheckCircleOutlined/><span>上架、收藏、运营功能不设会员次数限制</span></p></div></article>})}</div>
  </section>
  <section ref={redeemRef} className="redeem-section-source"><div><span>ACTIVATION</span><h2>已有会员激活码？</h2><p>向管理员购买或领取激活码后，在这里直接兑换。套餐时长会在现有有效期基础上顺延，高等级设备/店铺权益不会因兑换低等级卡而降低。</p><div className="redeem-form-source"><input value={code} onChange={e=>setCode(e.target.value)} onKeyDown={e=>e.key==="Enter"&&redeem()} placeholder="输入 ERP 会员激活码"/><button disabled={redeeming} onClick={redeem}>{redeeming?"兑换中…":"立即兑换"}</button></div></div><div className="contact-card-source"><div className="qr-mock-source">微信二维码</div><b>联系客服开通会员</b><span>扫码联系管理员获取对应套餐激活码</span></div></section>
 </div>
}
