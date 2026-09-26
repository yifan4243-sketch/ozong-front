import { useEffect, useRef, useState } from "react";
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
  const demoZoneRef = useRef<HTMLDivElement | null>(null);
  const demoCursorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const zone = demoZoneRef.current;
    const cursor = demoCursorRef.current;
    if (!zone || !cursor || window.matchMedia("(pointer: coarse)").matches) return;

    let x = -80;
    let y = -80;
    let frame = 0;

    const paint = () => {
      cursor.style.transform = `translate3d(${x - 2}px, ${y - 2}px, 0)`;
      frame = 0;
    };

    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(paint);
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (!target) return;
      const textTarget = target.closest('input:not([type="checkbox"]):not([type="radio"]), textarea');
      const actionTarget = target.closest('button, a, select, [role="button"], input[type="checkbox"], input[type="radio"], label');
      cursor.dataset.mode = textTarget ? "text" : actionTarget ? "action" : "arrow";
    };

    const onEnter = () => { cursor.style.opacity = "1"; };
    const onLeave = () => { cursor.style.opacity = "0"; };

    zone.addEventListener("pointermove", onMove, { passive: true });
    zone.addEventListener("pointerover", onOver, { passive: true });
    zone.addEventListener("pointerenter", onEnter, { passive: true });
    zone.addEventListener("pointerleave", onLeave, { passive: true });

    return () => {
      zone.removeEventListener("pointermove", onMove);
      zone.removeEventListener("pointerover", onOver);
      zone.removeEventListener("pointerenter", onEnter);
      zone.removeEventListener("pointerleave", onLeave);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

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
        ref={demoZoneRef}
        className="demo-morph-zone mt-20 px-2 md:px-4 scroll-mt-24"
      >
        <div ref={demoCursorRef} className="demo-morph-cursor" data-mode="arrow" aria-hidden="true">
          <svg className="demo-morph-cursor-arrow" viewBox="0 0 22 24">
            <path d="M2.4 1.9L19.1 14.25L11.85 16.0L9.35 21.45L7.55 17.25L3.05 21.05L2.4 1.9Z"/>
          </svg>
          <span className="demo-morph-cursor-ibeam" />
        </div>
        <style>{`
          .demo-morph-zone,.demo-morph-zone *{cursor:none!important}
          .demo-morph-cursor{position:fixed;left:0;top:0;z-index:2147483647;width:22px;height:24px;pointer-events:none;opacity:0;transform:translate3d(-80px,-80px,0);will-change:transform,opacity;transition:opacity .1s ease}
          .demo-morph-cursor-arrow{display:block;width:22px;height:24px;overflow:visible;transform-origin:3px 3px;transition:transform .12s cubic-bezier(.2,.8,.2,1),filter .12s ease;filter:drop-shadow(0 1px 1px rgba(15,23,42,.18)) drop-shadow(0 3px 5px rgba(15,23,42,.16))}
          .demo-morph-cursor-arrow path{fill:#07090d;stroke:rgba(255,255,255,.98);stroke-width:1.35;stroke-linejoin:round;stroke-linecap:round}
          .demo-morph-cursor[data-mode="action"] .demo-morph-cursor-arrow{transform:scale(1.08);filter:drop-shadow(0 3px 6px rgba(15,23,42,.25))}
          .demo-morph-cursor-ibeam{display:none;position:absolute;left:9px;top:1px;width:3px;height:25px;border-radius:99px;background:#090b10;box-shadow:0 0 0 .7px rgba(255,255,255,.75)}
          .demo-morph-cursor-ibeam:before,.demo-morph-cursor-ibeam:after{content:"";position:absolute;left:-4px;width:11px;height:2px;border-radius:99px;background:#090b10}
          .demo-morph-cursor-ibeam:before{top:0}.demo-morph-cursor-ibeam:after{bottom:0}
          .demo-morph-cursor[data-mode="text"] .demo-morph-cursor-arrow{display:none}
          .demo-morph-cursor[data-mode="text"] .demo-morph-cursor-ibeam{display:block}
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