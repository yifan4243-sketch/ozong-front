import { useMemo, useRef, useState } from "react";
import { DesktopOutlined, LockOutlined, SafetyCertificateOutlined, UserOutlined } from "@ant-design/icons";
import { DemoModal, DemoToast } from "./ReplicaCommon";
import "./settings-replica.css";

const AVATAR="https://raw.githubusercontent.com/yifan4243-sketch/ozon-erp/dev-hotfix/frontend/public/default-user-avatar.png";

type Go=(v:any)=>void;
type LoginDevice={id:number,name:string,current:boolean,login:string,seen:string,ip:string,hint:string};
const DEVICES:LoginDevice[]=[
{id:1,name:"Chrome · Windows",current:true,login:"2026-09-23 09:12:18",seen:"刚刚",ip:"192.168.1.24",hint:"Chrome 153 / Windows 11"},
{id:2,name:"Edge · Windows",current:false,login:"2026-09-22 18:26:41",seen:"8 分钟前",ip:"192.168.1.18",hint:"Edge 153 / Windows 11"},
{id:3,name:"Chrome · macOS",current:false,login:"2026-09-19 12:04:09",seen:"2 天前",ip:"10.0.0.36",hint:"Chrome / macOS"},
];

export function AccountReplica({go}:{go:Go}){
 const [section,setSection]=useState<"profile"|"password"|"devices">("profile");
 const [displayName,setDisplayName]=useState("1234"); const [avatar,setAvatar]=useState(AVATAR); const inputRef=useRef<HTMLInputElement|null>(null);
 const [current,setCurrent]=useState(""); const [next,setNext]=useState(""); const [confirm,setConfirm]=useState("");
 const [devices,setDevices]=useState(DEVICES); const [confirmRemove,setConfirmRemove]=useState<LoginDevice|null>(null); const [logoutAll,setLogoutAll]=useState(false); const [toast,setToast]=useState("");
 const flash=(t:string)=>{setToast(t);setTimeout(()=>setToast(""),1500)};
 const avatarFile=(f?:File)=>{if(!f)return;if(!["image/png","image/jpeg","image/webp"].includes(f.type)){flash("头像仅支持 JPG、PNG 或 WEBP");return}if(f.size>1024*1024){flash("头像文件不能超过 1MB");return}const reader=new FileReader();reader.onload=()=>setAvatar(String(reader.result||AVATAR));reader.readAsDataURL(f)};
 const savePassword=()=>{if(!current){flash("请输入当前密码");return}if(next.length<8||!/[A-Za-z]/.test(next)||!/\d/.test(next)){flash("新密码至少 8 位，并同时包含字母和数字");return}if(next!==confirm){flash("两次输入的新密码不一致");return}setCurrent("");setNext("");setConfirm("");flash("密码修改成功")};
 const remove=()=>{if(confirmRemove&&!confirmRemove.current)setDevices(v=>v.filter(d=>d.id!==confirmRemove.id));setConfirmRemove(null);flash("设备已移除")};
 const logoutOthers=()=>{setDevices(v=>v.filter(d=>d.current));setLogoutAll(false);flash("其他设备已退出登录")};
 return <div className="account-page-source"><DemoToast text={toast}/><section className="account-shell-source">
  <aside className="account-nav-source"><div className="account-identity-source"><img src={avatar}/><div><b>{displayName}</b><span>@ozong_user_1234</span></div></div>
   <button className={section==="profile"?"active":""} onClick={()=>setSection("profile")}><UserOutlined/><span>修改资料</span></button>
   <button className={section==="password"?"active":""} onClick={()=>setSection("password")}><LockOutlined/><span>修改密码</span></button>
   <button className={section==="devices"?"active":""} onClick={()=>setSection("devices")}><DesktopOutlined/><span>设备管理</span></button>
   <button onClick={()=>go("extensions")}><SafetyCertificateOutlined/><span>浏览器插件</span></button>
  </aside>
  <section className="account-content-source">
   {section==="profile"&&<><header><h1>个人资料</h1><p>维护当前租户账号的显示信息。登录账号不可修改。</p></header><div className="profile-card-source"><div className="avatar-editor-source"><img src={avatar}/><div><b>头像</b><p>支持 JPG、PNG、WEBP，文件不超过 1MB。</p><div><button onClick={()=>inputRef.current?.click()}>更换头像</button><button className="danger" onClick={()=>setAvatar(AVATAR)}>移除头像</button></div><input hidden ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>avatarFile(e.target.files?.[0])}/></div></div><div className="profile-form-source"><label>昵称 *<input value={displayName} maxLength={30} onChange={e=>setDisplayName(e.target.value)}/></label><label>登录账号<input disabled value="ozong_user_1234"/><small>登录账号作为账户唯一身份，不支持自助修改。</small></label><div className="readonly-grid-source"><span>账号类型<b>客户</b></span><span>注册时间<b>2026-04-17 12:26</b></span><span>授权状态<b>剩余 330 天</b></span><span>AI 生图点数<b>956</b></span></div><button className="primary" onClick={()=>displayName.trim()?flash("个人资料已保存"):flash("昵称不能为空")}>保存修改</button></div></div></>}
   {section==="password"&&<><header><h1>修改密码</h1><p>修改密码后，其他网页登录会话的刷新凭证将失效。</p></header><div className="security-card-source"><div className="password-tip-source"><b>ⓘ 密码安全要求</b><span>新密码至少 8 位，并同时包含字母和数字；不能与当前密码相同，也不能包含登录账号。</span></div><div className="password-form-source"><label>当前密码 *<input type="password" value={current} onChange={e=>setCurrent(e.target.value)} placeholder="请输入当前密码"/></label><label>新密码 *<input type="password" value={next} onChange={e=>setNext(e.target.value)} placeholder="至少 8 位，包含字母和数字"/></label><label>确认新密码 *<input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="请再次输入新密码"/></label><button className="primary" onClick={savePassword}>确认修改</button></div></div></>}
   {section==="devices"&&<><header className="device-head-source"><div><h1>登录设备</h1><p>设备额度表示可同时保持登录的浏览器数量。新设备登录时，会自动挤下最早登录的设备。</p></div><button onClick={()=>{setDevices([...DEVICES]);flash("登录设备已刷新")}}>刷新</button></header><div className="device-quota-source"><div><span>同时登录设备</span><b>{devices.length} / 5</b></div><div className="progress-source"><i style={{width:Math.min(100,devices.length/5*100)+"%"}}></i></div><button className="danger" disabled={devices.length<=1} onClick={()=>setLogoutAll(true)}>退出其他所有设备</button></div><div className="device-list-source">{devices.map(d=><article key={d.id}><span className="device-icon-source"><DesktopOutlined/></span><div><div className="device-title-source"><b>{d.name}</b>{d.current&&<i>当前设备</i>}</div><div className="device-meta-source"><span><b>登录时间</b>{d.login}</span><span><b>最近活跃</b>{d.seen}</span><span><b>登录 IP</b>{d.ip}</span><span><b>设备标识</b>{d.hint}</span></div></div><div>{d.current?<span className="current-note-source">当前浏览器</span>:<button className="danger" onClick={()=>setConfirmRemove(d)}>移除</button>}</div></article>)}</div></>}
  </section>
 </section>
 <DemoModal open={!!confirmRemove} title="移除登录设备？" onClose={()=>setConfirmRemove(null)} onOk={remove} okText="移除" danger><p>移除后，该浏览器下一次请求会被要求重新登录。</p></DemoModal>
 <DemoModal open={logoutAll} title="退出其他所有设备？" onClose={()=>setLogoutAll(false)} onOk={logoutOthers} okText="全部退出" danger><p>除当前浏览器之外的所有设备都会退出登录。</p></DemoModal>
 </div>
}

type User={id:number;username:string;role:string,balance:number,reserved:number,active:boolean};
const USERS:User[]=[{id:1,username:"admin",role:"管理员",balance:956,reserved:0,active:true},{id:2,username:"operator01",role:"运营",balance:320,reserved:12,active:true},{id:3,username:"designer",role:"设计",balance:188,reserved:0,active:true},{id:4,username:"old_operator",role:"运营",balance:26,reserved:0,active:false}];
export function UserCreditsReplica(){
 const [users,setUsers]=useState(USERS); const [keyword,setKeyword]=useState(""); const [applied,setApplied]=useState(""); const [adjust,setAdjust]=useState<User|null>(null); const [amount,setAmount]=useState(0); const [reason,setReason]=useState(""); const [ledgerUser,setLedgerUser]=useState<User|null>(null); const [toast,setToast]=useState("");
 const flash=(t:string)=>{setToast(t);setTimeout(()=>setToast(""),1500)}; const visible=useMemo(()=>users.filter(u=>!applied||u.username.toLowerCase().includes(applied.toLowerCase())),[users,applied]);
 const save=()=>{if(!adjust||!amount||!reason.trim()){flash("请填写非零额度和调整原因");return}setUsers(v=>v.map(u=>u.id===adjust.id?{...u,balance:Math.max(0,u.balance+amount)}:u));setAdjust(null);flash("额度已调整")};
 const toggle=(u:User)=>{if(u.id===1)return;setUsers(v=>v.map(x=>x.id===u.id?{...x,active:!x.active}:x));flash(u.active?"用户已停用":"用户已启用")};
 return <div className="user-credit-page-source"><DemoToast text={toast}/><section className="settings-page-head-source"><div><h1>用户与额度</h1><p>管理员手工充值或调整 AI 生图额度；每笔变更都会保留审计记录。</p></div><label><input value={keyword} onChange={e=>setKeyword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&setApplied(keyword)} placeholder="搜索用户名"/><button onClick={()=>setApplied(keyword)}>⌕</button></label></section><section className="settings-table-source"><div className="settings-row-source head"><span>用户</span><span>角色</span><span>额度</span><span>状态</span><span>操作</span></div>{visible.map(u=><div className="settings-row-source" key={u.id}><span><b>{u.username}</b></span><span>{u.role}</span><span><b>{u.balance-u.reserved} 点可用</b><small>总 {u.balance} · 冻结 {u.reserved}</small></span><span><i className={"state-pill-source "+(u.active?"active":"")}>{u.active?"启用":"已停用"}</i></span><span><button onClick={()=>{setAdjust(u);setAmount(0);setReason("")}}>调整额度</button><button disabled={u.id===1} onClick={()=>toggle(u)}>{u.active?"停用":"启用"}</button><button onClick={()=>setLedgerUser(u)}>流水</button></span></div>)}</section>
 <DemoModal open={!!adjust} title="调整 AI 生图额度" onClose={()=>setAdjust(null)} onOk={save}>{adjust&&<><p>用户：<b>{adjust.username}</b>。正数为充值，负数为扣减。</p><label className="replica-field"><span>额度</span><input type="number" value={amount} onChange={e=>setAmount(Number(e.target.value))}/></label><label className="replica-field"><span>调整原因</span><textarea maxLength={500} value={reason} onChange={e=>setReason(e.target.value)} placeholder="请填写调整原因（必填）"/></label></>}</DemoModal>
 {ledgerUser&&<div className="settings-drawer-source"><header><b>额度流水</b><button onClick={()=>setLedgerUser(null)}>×</button></header><div>{[{d:100,r:"管理员充值",b:ledgerUser.balance},{d:-24,r:"AI 商品图生成",b:ledgerUser.balance-24},{d:50,r:"活动赠送",b:ledgerUser.balance+50}].map((x,i)=><article key={i}><div><b className={x.d>=0?"plus":"minus"}>{x.d>=0?"+":""}{x.d} 点</b><p>{x.r}</p></div><small>2026-09-{23-i} 14:2{i} · 余额 {x.b}</small></article>)}</div></div>}
 </div>
}

type ExtDevice={id:number,name:string,version:string,last:string,revoked:boolean};
export function ExtensionDevicesReplica(){
 const [devices,setDevices]=useState<ExtDevice[]>([{id:1,name:"Chrome · Windows",version:"0.0.19",last:"刚刚",revoked:false},{id:2,name:"Edge · Windows",version:"0.0.19",last:"8 分钟前",revoked:false}]); const [target,setTarget]=useState<ExtDevice|null>(null); const [toast,setToast]=useState(""); const [loading,setLoading]=useState(false);
 const flash=(t:string)=>{setToast(t);setTimeout(()=>setToast(""),1500)}; const revoke=()=>{if(target)setDevices(v=>v.map(d=>d.id===target.id?{...d,revoked:true}:d));setTarget(null);flash("插件设备已撤销")};
 return <div className="extension-page-source"><DemoToast text={toast}/><section className="settings-page-head-source"><div><h1>浏览器插件</h1><p>管理已连接 ERP 的 Auto-OZON 浏览器。撤销后，该设备会立即无法查询店铺或继续同步情报。</p></div><button disabled={loading} onClick={()=>{setLoading(true);setTimeout(()=>{setLoading(false);flash("插件设备已刷新")},500)}}>{loading?"刷新中…":"刷新"}</button></section><section className="security-tip-source"><b>隐私边界</b><span>Seller Cookie 始终留在浏览器；ERP 只接收白名单采集任务的必要结果，不保存 Cookie。</span></section><section className="settings-table-source"><div className="settings-row-source ext head"><span>设备</span><span>插件版本</span><span>最近在线</span><span>状态</span><span>操作</span></div>{devices.map(d=><div className="settings-row-source ext" key={d.id}><span><b>{d.name}</b></span><span>{d.version}</span><span>{d.last}</span><span><i className={"state-pill-source "+(!d.revoked?"active":"")}>{d.revoked?"已撤销":"已连接"}</i></span><span><button className="danger" disabled={d.revoked} onClick={()=>setTarget(d)}>撤销设备</button></span></div>)}</section><DemoModal open={!!target} title="撤销插件设备？" onClose={()=>setTarget(null)} onOk={revoke} okText="撤销" danger><p>撤销后该浏览器需要重新授权，确定继续吗？</p></DemoModal></div>
}
