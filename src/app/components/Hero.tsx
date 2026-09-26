import { useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { Button } from "./ui/button";
import { Play, Brain, Zap, Monitor, Puzzle, Home, Store, PackageSearch, ChevronDown } from "lucide-react";
import { WebErpDemo } from "./demo/WebErpDemo";
import { OzonPluginHomeDemo } from "./OzonPluginHomeDemo";
import { OzonPluginStoreDemo } from "./OzonPluginStoreDemo";
import { OzonPluginProductDemo } from "./OzonPluginProductDemo";

export function Hero() {
  const [demoMode, setDemoMode] = useState<"erp" | "plugin">("erp");
  const [pluginPage, setPluginPage] = useState<"home" | "store" | "product">("home");
  const [pluginMenuOpen, setPluginMenuOpen] = useState(false);
  const [erpInitialView, setErpInitialView] = useState<"dashboard" | "productEdit">("dashboard");
  const demoCursorRef = useRef<HTMLDivElement | null>(null);

  const moveDemoCursor = (event: ReactPointerEvent<HTMLDivElement>) => {
    const cursor = demoCursorRef.current;
    if (!cursor) return;
    cursor.style.left = event.clientX + "px";
    cursor.style.top = event.clientY + "px";
    cursor.style.opacity = "1";
    const target = event.target as Element;
    const textTarget = target.closest('input:not([type="checkbox"]):not([type="radio"]), textarea');
    const actionTarget = target.closest('button, a, select, [role="button"], input[type="checkbox"], input[type="radio"], label');
    cursor.dataset.mode = textTarget ? "text" : actionTarget ? "action" : "arrow";
  };

  return (
    <section id="top" className="py-20 lg:py-32 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            <div className="inline-flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full border">
              <Brain className="w-4 h-4 mr-2" />
              <span className="text-sm">为 Ozon 跨境运营打造的智能 ERP</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl tracking-tight">
              从 1688 货源到 Ozon 上架
              <span className="text-primary"> 一套系统完成</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              OzonG ERP 将货源采集、AI 商品处理、商品图生成、Ozon 上架、在线商品、订单、选品和运营数据集中到一个工作台。
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <a href="#features">
                <Zap className="w-5 h-5 mr-2" />
                了解 OzonG ERP
              </a>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6" asChild>
              <a href="#web-erp-demo">
                <Play className="w-5 h-5 mr-2" />
                体验网页端演示
              </a>
            </Button>
          </div>

          <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              1688 货源采集
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              AI 商品处理
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Ozon 店铺运营
            </div>
          </div>
        </div>
      </div>

      <div
        id="web-erp-demo"
        className="demo-morph-zone mt-20 px-2 md:px-4 scroll-mt-24"
        onPointerMove={moveDemoCursor}
        onPointerEnter={() => { if (demoCursorRef.current) demoCursorRef.current.style.opacity = "1"; }}
        onPointerLeave={() => { if (demoCursorRef.current) demoCursorRef.current.style.opacity = "0"; }}
      >
        <div ref={demoCursorRef} className="demo-morph-cursor" data-mode="arrow" aria-hidden="true" />
        <style>{`
          .demo-morph-zone,.demo-morph-zone *{cursor:none!important}
          .demo-morph-cursor{position:fixed;left:-80px;top:-80px;z-index:2147483647;pointer-events:none;opacity:0;background:#050505;will-change:left,top,width,height,transform;transition:width .12s ease,height .12s ease,opacity .12s ease,filter .12s ease}
          .demo-morph-cursor[data-mode="arrow"]{width:17px;height:22px;border-radius:0;clip-path:polygon(0 0,0 100%,100% 48%);transform:translate(-2px,-2px);filter:drop-shadow(0 1px 1px rgba(0,0,0,.16))}
          .demo-morph-cursor[data-mode="action"]{width:21px;height:27px;border-radius:0;clip-path:polygon(0 0,0 100%,100% 48%);transform:translate(-2px,-2px);filter:drop-shadow(0 2px 2px rgba(0,0,0,.2))}
          .demo-morph-cursor[data-mode="text"]{width:3px;height:26px;border-radius:3px;clip-path:none;transform:translate(-50%,-50%)}
          @media (pointer:coarse){.demo-morph-zone,.demo-morph-zone *{cursor:auto!important}.demo-morph-cursor{display:none!important}}
        `}</style>
        <div className="relative z-[10000] mx-auto mb-3 flex w-[min(1500px,calc(100vw-36px))] items-center justify-start overflow-visible">
          <div className="relative inline-flex h-10 items-center overflow-visible rounded-xl border border-border/70 bg-background/95 p-1 shadow-sm">
            <button
              type="button"
              onClick={() => { setErpInitialView("dashboard"); setDemoMode("erp"); }}
              className={`flex h-8 items-center gap-2 rounded-lg px-4 text-sm font-medium transition-all ${
                demoMode === "erp"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              aria-pressed={demoMode === "erp"}
            >
              <Monitor className="h-4 w-4" />
              ERP 网页端
            </button>
            <div
              className="relative"
              onMouseEnter={() => setPluginMenuOpen(true)}
              onMouseLeave={() => setPluginMenuOpen(false)}
              onFocusCapture={() => setPluginMenuOpen(true)}
              onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setPluginMenuOpen(false);
                }
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setDemoMode("plugin");
                  setPluginMenuOpen(true);
                }}
                className={`flex h-8 items-center gap-2 rounded-lg px-4 text-sm font-medium transition-all ${
                  demoMode === "plugin"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                aria-pressed={demoMode === "plugin"}
                aria-haspopup="menu"
                aria-expanded={pluginMenuOpen}
              >
                <Puzzle className="h-4 w-4" />
                Ozon 插件端
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${pluginMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {pluginMenuOpen && (
              <div
                className="absolute left-0 top-full z-[9999] w-44 pt-2"
                role="menu"
                style={{ isolation: "isolate" }}
              >
                <div className="overflow-hidden rounded-xl border border-border/80 bg-background p-1.5 shadow-xl">
                  {[
                    { key: "home", label: "主页", icon: Home },
                    { key: "store", label: "店铺页", icon: Store },
                    { key: "product", label: "商品详情页", icon: PackageSearch },
                  ].map((item) => {
                    const Icon = item.icon;
                    const active = demoMode === "plugin" && pluginPage === item.key;
                    return (
                      <button
                        type="button"
                        role="menuitem"
                        key={item.key}
                        onClick={() => {
                          setPluginPage(item.key as "home" | "store" | "product");
                          setDemoMode("plugin");
                          setPluginMenuOpen(false);
                        }}
                        className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                          active
                            ? "bg-primary/10 font-medium text-primary"
                            : "text-foreground hover:bg-muted"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              )}
            </div>
          </div>
        </div>

        {demoMode === "erp" ? (
          <WebErpDemo initialView={erpInitialView} />
        ) : pluginPage === "home" ? (
          <OzonPluginHomeDemo onEnterErp={() => { setErpInitialView("dashboard"); setDemoMode("erp"); }} />
        ) : pluginPage === "store" ? (
          <OzonPluginStoreDemo onEnterErp={() => { setErpInitialView("dashboard"); setDemoMode("erp"); }} />
        ) : (
          <OzonPluginProductDemo
            onEnterErp={() => { setErpInitialView("dashboard"); setDemoMode("erp"); }}
            onEditListing={() => { setErpInitialView("productEdit"); setDemoMode("erp"); }}
          />
        )}
      </div>
    </section>
  );
}