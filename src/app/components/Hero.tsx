import { useState } from "react";
import { Button } from "./ui/button";
import { Play, Brain, Zap, Monitor, Puzzle, Home, Store, PackageSearch, ChevronDown, ShoppingBag } from "lucide-react";
import { WebErpDemo } from "./demo/WebErpDemo";
import { OzonPluginHomeDemo } from "./OzonPluginHomeDemo";
import { OzonPluginStoreDemo } from "./OzonPluginStoreDemo";
import { OzonPluginProductDemo } from "./OzonPluginProductDemo";
import { Alibaba1688Demo } from "./Alibaba1688Demo";

export function Hero() {
  const [demoMode, setDemoMode] = useState<"erp" | "source1688" | "plugin">("erp");
  const [pluginPage, setPluginPage] = useState<"home" | "store" | "product">("home");
  const [pluginMenuOpen, setPluginMenuOpen] = useState(false);
  const [erpInitialView, setErpInitialView] = useState<"dashboard" | "productEdit">("dashboard");
  const [demoNoticeOpen, setDemoNoticeOpen] = useState(false);
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
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6"
              onClick={() => setDemoNoticeOpen(true)}
            >
              <Play className="w-5 h-5 mr-2" />
              体验网页端演示
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

      {demoNoticeOpen && (
        <div
          className="fixed inset-0 z-[2147483600] flex items-center justify-center bg-slate-950/35 px-4 backdrop-blur-[2px]"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setDemoNoticeOpen(false);
          }}
        >
          <div
            className="w-full max-w-[520px] rounded-2xl border border-border/70 bg-background p-6 text-left shadow-[0_28px_90px_rgba(15,23,42,0.24)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-notice-title"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  Demo 演示说明
                </div>
                <h3 id="demo-notice-title" className="text-xl font-semibold tracking-tight">
                  当前页面仅用于产品演示
                </h3>
              </div>
              <button
                type="button"
                aria-label="关闭"
                onClick={() => setDemoNoticeOpen(false)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-sm leading-7 text-muted-foreground">
              当前 Demo 主要用于展示 OzonG ERP 的核心页面与交互流程。演示数据、部分功能细节及界面表现与实际正式版本可能略有不同，实际功能请以正式产品为准。
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDemoNoticeOpen(false)}>
                我知道了
              </Button>
              <Button
                onClick={() => {
                  setDemoNoticeOpen(false);
                  window.requestAnimationFrame(() => {
                    document.getElementById("web-erp-demo")?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  });
                }}
              >
                <Play className="mr-2 h-4 w-4" />
                继续体验 Demo
              </Button>
            </div>
          </div>
        </div>
      )}

      <div
        id="web-erp-demo"
        className="demo-morph-zone mt-20 px-2 md:px-4 scroll-mt-24"
      >
        <style>{`
          .demo-morph-zone,.demo-morph-zone *{
            cursor:url("/ozong-demo-cursor.png") 2 2, default!important;
          }
          .demo-morph-zone input:not([type="checkbox"]):not([type="radio"]),
          .demo-morph-zone textarea{
            cursor:text!important;
          }
          @media (pointer:coarse){
            .demo-morph-zone,.demo-morph-zone *{cursor:auto!important}
          }
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
            <button
              type="button"
              onClick={() => setDemoMode("source1688")}
              className={"flex h-8 items-center gap-2 rounded-lg px-4 text-sm font-medium transition-all " + (
                demoMode === "source1688"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              aria-pressed={demoMode === "source1688"}
            >
              <ShoppingBag className="h-4 w-4" />
              1688 端
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
        ) : demoMode === "source1688" ? (
          <Alibaba1688Demo onEnterErp={() => { setErpInitialView("dashboard"); setDemoMode("erp"); }} />
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