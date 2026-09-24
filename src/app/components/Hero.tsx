import { Button } from "./ui/button";
import { Play, Brain, Zap } from "lucide-react";
import { WebErpDemo } from "./demo/WebErpDemo";

export function Hero() {
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

      <div id="web-erp-demo" className="mt-20 px-0 scroll-mt-24">
        <WebErpDemo />
      </div>
    </section>
  );
}