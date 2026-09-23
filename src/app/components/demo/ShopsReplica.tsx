import { useMemo, useState } from "react";
import { DeleteOutlined, DownOutlined, DownloadOutlined, PlusOutlined, ReloadOutlined, SyncOutlined } from "@ant-design/icons";
import { DemoModal, DemoToast } from "./ReplicaCommon";
import "./shops-replica.css";

type ShopStatus="authorized"|"expired"|"inactive";
type Shop={id:number;name:string;clientId:string;currency:string;country:"ru"|"cn";status:ShopStatus;products:number;warehouse:string;partners:number;group:string;avatar:string};
const INITIAL:Shop[]=[
{id:1,name:"测试",clientId:"4151485",currency:"CNY",country:"ru",status:"authorized",products:29,warehouse:"",partners:4,group:"",avatar:"测试"},
{id:2,name:"UyutHome 家居",clientId:"2314887",currency:"CNY",country:"ru",status:"authorized",products:184,warehouse:"CEL-01",partners:3,group:"家居组",avatar:"UY"},
{id:3,name:"北极星百货",clientId:"2265104",currency:"CNY",country:"ru",status:"expired",products:91,warehouse:"CEL-02",partners:2,group:"百货组",avatar:"北"}
];
type ModalKind="shop"|"group"|"warehouse"|"avatar"|"delete"|null;

export function ShopsReplica(){
 const [shops,setShops]=useState(INITIAL);
 const [groups,setGroups]=useState(["家居组","百货组"]);
 const [filters,setFilters]=useState({group:"all",name:"",client:"",country:"all",status:"all"});
 const [applied,setApplied]=useState(filters);
 const [selected,setSelected]=useState<number[]>([]);
 const [modal,setModal]=useState<ModalKind>(null);
 const [editing,setEditing]=useState<Shop|null>(null);
 const [target,setTarget]=useState<Shop|null>(null);
 const [form,setForm]=useState({name:"",clientId:"",apiKey:"",currency:"CNY",isDefault:false});
 const [groupName,setGroupName]=useState("");
 const [warehouse,setWarehouse]=useState("");
 const [avatar,setAvatar]=useState("");
 const [syncing,setSyncing]=useState(false);
 const [toast,setToast]=useState("");
 const flash=(t:string)=>{setToast(t);setTimeout(()=>setToast(""),1500)};
 const visible=useMemo(()=>shops.filter(s=>{
  if(applied.group!=="all"&&s.group!==applied.group)return false;
  if(applied.name&&!s.name.toLowerCase().includes(applied.name.toLowerCase()))return false;
  if(applied.client&&!s.clientId.includes(applied.client))return false;
  if(applied.country!=="all"&&s.country!==applied.country)return false;
  if(applied.status!=="all"&&s.status!==applied.status)return false;
  return true;
 }),[shops,applied]);
 const all=visible.length>0&&visible.every(s=>selected.includes(s.id));
 const openAdd=()=>{setEditing(null);setForm({name:"",clientId:"",apiKey:"",currency:"CNY",isDefault:false});setModal("shop")};
 const openEdit=(s:Shop)=>{setEditing(s);setForm({name:s.name,clientId:s.clientId,apiKey:"",currency:s.currency,isDefault:false});setModal("shop")};
 const saveShop=()=>{
  if(!form.name||!form.clientId){flash("请填写店铺名称和 Client ID");return}
  if(editing)setShops(v=>v.map(s=>s.id===editing.id?{...s,name:form.name,clientId:form.clientId,currency:form.currency}:s));
  else setShops(v=>[...v,{id:Date.now(),name:form.name,clientId:form.clientId,currency:form.currency,country:"ru",status:"authorized",products:0,warehouse:"",partners:0,group:"",avatar:form.name.slice(0,2)}]);
  setModal(null);flash(editing?"编辑成功":"店铺添加成功");
 };
 const reset=()=>{const f={group:"all",name:"",client:"",country:"all",status:"all"};setFilters(f);setApplied(f)};
 const saveGroup=()=>{if(groupName.trim()&&!groups.includes(groupName.trim()))setGroups(v=>[...v,groupName.trim()]);setGroupName("");setModal(null);flash("分组创建成功")};
 const saveWarehouse=()=>{if(target){setShops(v=>v.map(s=>s.id===target.id?{...s,warehouse}:s));setModal(null);flash("默认仓库已设置")}};
 const saveAvatar=()=>{if(target){setShops(v=>v.map(s=>s.id===target.id?{...s,avatar:avatar||s.avatar}:s));setModal(null);flash("店铺头像已保存")}};
 const deleteShop=()=>{if(target){setShops(v=>v.filter(s=>s.id!==target.id));setSelected(v=>v.filter(id=>id!==target.id));setModal(null);flash("删除成功")}};
 const sync=()=>{setSyncing(true);setTimeout(()=>{setSyncing(false);flash("同步任务已创建")},700)};
 const batchDelete=()=>{setShops(v=>v.filter(s=>!selected.includes(s.id)));setSelected([]);flash("已删除所选店铺（示例）")};
 return <div className="shops-page-source"><DemoToast text={toast}/>
  <section className="shops-card-source">
   <div className="shops-filter-source">
    <div className="shop-filter-grid-source">
      <label>店铺分组<select value={filters.group} onChange={e=>setFilters({...filters,group:e.target.value})}><option value="all">全部分组</option>{groups.map(g=><option key={g}>{g}</option>)}</select></label>
      <label>店铺名称<input value={filters.name} onChange={e=>setFilters({...filters,name:e.target.value})} placeholder="请输入店铺名称"/></label>
      <label>Client ID<input value={filters.client} onChange={e=>setFilters({...filters,client:e.target.value})} placeholder="请输入 Client ID"/></label>
      <label>国家<select value={filters.country} onChange={e=>setFilters({...filters,country:e.target.value})}><option value="all">全部国家</option><option value="ru">俄罗斯</option><option value="cn">中国</option></select></label>
      <label>授权状态<select value={filters.status} onChange={e=>setFilters({...filters,status:e.target.value})}><option value="all">全部状态</option><option value="authorized">已授权</option><option value="expired">授权过期</option><option value="inactive">未激活</option></select></label>
    </div>
    <div><button className="primary" onClick={()=>setApplied(filters)}>查询</button><button onClick={reset}>重置</button></div>
   </div>
   <div className="shops-toolbar-source"><div><button className="primary" onClick={openAdd}><PlusOutlined/> 新增店铺</button><button onClick={()=>{setGroupName("");setModal("group")}}><PlusOutlined/> 新增分组</button><div className="dropdown-wrap"><button disabled={!selected.length}><DeleteOutlined/> 批量操作 <DownOutlined/></button>{selected.length>0&&<div className="dropdown-menu-source shops-batch-menu"><button onClick={()=>flash("已创建批量同步任务")}>批量同步</button><button onClick={()=>flash("已提交批量授权示例")}>批量授权</button><button className="danger" onClick={batchDelete}>批量删除</button></div>}</div></div><div><button disabled={syncing} onClick={sync}><SyncOutlined/> {syncing?"同步中…":"同步店铺"}</button><button onClick={()=>flash("店铺数据已导出（演示）")}><DownloadOutlined/> 导出</button><button onClick={()=>flash("店铺列表已刷新")}><ReloadOutlined/></button></div></div>
   <div className="shops-table-wrap-source"><div className="shops-table-source">
    <div className="shop-row-source head"><span><input type="checkbox" checked={all} onChange={()=>setSelected(all?[]:visible.map(s=>s.id))}/></span><span>序号</span><span>店铺信息</span><span>平台</span><span>授权到期时间</span><span>产品数量</span><span>货币</span><span>默认仓库</span><span>合作仓库</span><span>状态</span><span>Cookie状态</span><span>分组</span><span>操作</span></div>
    {visible.map((s,i)=><div className={"shop-row-source "+(selected.includes(s.id)?"selected":"")} key={s.id}><span><input type="checkbox" checked={selected.includes(s.id)} onChange={()=>setSelected(v=>v.includes(s.id)?v.filter(x=>x!==s.id):[...v,s.id])}/></span><span>{i+1}</span><span className="shop-info-source"><button onClick={()=>{setTarget(s);setAvatar(s.avatar);setModal("avatar")}}>{s.avatar}</button><i><b>{s.name}</b><small>Client ID: {s.clientId}</small></i></span><span className="ozon-source-logo">ozon</span><span>{s.status==="authorized"?<em className="pill success">永久</em>:<em className="pill danger">已过期</em>}</span><span className="blue">{s.products}</span><span>{s.currency}</span><span>{s.warehouse?<button className="pill-button" onClick={()=>{setTarget(s);setWarehouse(s.warehouse);setModal("warehouse")}}>{s.warehouse}</button>:<button className="warehouse-btn" onClick={()=>{setTarget(s);setWarehouse("");setModal("warehouse")}}>添加默认仓库</button>}</span><span className="blue">{s.partners}个</span><span><em className={"pill "+(s.status==="authorized"?"success":"danger")}>{s.status==="authorized"?"已授权":s.status==="expired"?"授权过期":"未激活"}</em></span><span><em className="pill success">正常</em></span><span><select value={s.group} onChange={e=>{const g=e.target.value;setShops(v=>v.map(x=>x.id===s.id?{...x,group:g}:x));flash("分组已更新")}}><option value="">未分组</option>{groups.map(g=><option key={g}>{g}</option>)}</select></span><span className="shop-ops-source"><button onClick={()=>openEdit(s)}>编辑</button><button className="danger" onClick={()=>{setTarget(s);setModal("delete")}}>删除</button></span></div>)}
   </div></div>
   <footer className="shops-footer-source"><strong>共 {visible.length} 条记录，当前页 {visible.length} 条记录</strong><div>‹ <b>1</b> › <select><option>10 条/页</option><option>20 条/页</option><option>50 条/页</option></select></div></footer>
  </section>
  <DemoModal open={modal==="shop"} title={editing?"编辑店铺":"添加店铺"} width={560} onClose={()=>setModal(null)} onOk={saveShop} okText="确定"><label className="replica-field"><span>店铺名称 *</span><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="请输入店铺名称"/></label><label className="replica-field"><span>Client ID *</span><input value={form.clientId} onChange={e=>setForm({...form,clientId:e.target.value})} placeholder="请输入 Client ID"/></label><label className="replica-field"><span>API密钥 *</span><input type="password" value={form.apiKey} onChange={e=>setForm({...form,apiKey:e.target.value})} placeholder={editing?"留空则不修改":"请输入API密钥"}/></label><label className="replica-field"><span>货币类型 *</span><select value={form.currency} onChange={e=>setForm({...form,currency:e.target.value})}><option>CNY</option><option>RUB</option></select></label><label className="shop-radio-source"><span>默认店铺(默认上传产品的店铺)</span><i><input type="radio" checked={form.isDefault} onChange={()=>setForm({...form,isDefault:true})}/> 是　<input type="radio" checked={!form.isDefault} onChange={()=>setForm({...form,isDefault:false})}/> 否</i></label></DemoModal>
  <DemoModal open={modal==="group"} title="新增分组" width={420} onClose={()=>setModal(null)} onOk={saveGroup} okText="确定"><label className="replica-field"><span>分组名称</span><input value={groupName} onChange={e=>setGroupName(e.target.value)} placeholder="请输入分组名称"/></label></DemoModal>
  <DemoModal open={modal==="warehouse"} title="设置默认仓库" width={460} onClose={()=>setModal(null)} onOk={saveWarehouse} okText="确定"><label className="replica-field"><span>仓库</span><select value={warehouse} onChange={e=>setWarehouse(e.target.value)}><option value="">请选择仓库</option><option>CEL-01 厦门仓</option><option>CEL-02 义乌仓</option><option>CEL-03 深圳仓</option></select></label></DemoModal>
  <DemoModal open={modal==="avatar"} title="设置店铺头像" width={520} onClose={()=>setModal(null)} onOk={saveAvatar} okText="确定"><label className="replica-field"><span>头像 URL / 简称</span><input value={avatar} onChange={e=>setAvatar(e.target.value)} placeholder="请输入头像图片 URL"/></label><div className="avatar-preview-source">{avatar||target?.name.slice(0,2)}</div></DemoModal>
  <DemoModal open={modal==="delete"} title="确认删除店铺？" onClose={()=>setModal(null)} onOk={deleteShop} okText="确认删除" danger><p className="shop-delete-copy">删除后将移除店铺「{target?.name}」。</p></DemoModal>
 </div>
}
