import type { ReactNode } from "react";
import "./replica-common.css";

export function DemoModal({open,title,children,onClose,onOk,okText="确定",danger=false,width=520}:{open:boolean;title:string;children:ReactNode;onClose:()=>void;onOk?:()=>void;okText?:string;danger?:boolean;width?:number}){
  if(!open)return null;
  return <div className="replica-mask" onMouseDown={onClose}><div className="replica-modal" style={{width}} onMouseDown={e=>e.stopPropagation()}>
    <header><b>{title}</b><button onClick={onClose}>×</button></header><div className="replica-modal-body">{children}</div>
    {onOk&&<footer><button onClick={onClose}>取消</button><button className={danger?"danger":"primary"} onClick={onOk}>{okText}</button></footer>}
  </div></div>
}
export function DemoToast({text}:{text:string}){return text?<div className="replica-toast">✓ {text}</div>:null}
