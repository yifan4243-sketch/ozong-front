import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CheckCircle } from "lucide-react";

const benefits = [
  "1688 商品统一进入 ERP 采集工作台",
  "自动衔接类目、属性、包装估算与定价流程",
  "商品、订单和店铺在一个系统集中管理",
  "支持批量改价、库存与促销等运营操作",
  "Ozon 前台商品情报辅助选品和定价判断",
  "AI 商品图、水印与商品内容工作流协同"
];

const useCases = [
  {
    title: "1688 → Ozon",
    description: "从 1688 采集货源和 SKU，在 ERP 中处理商品信息并进入 Ozon 上架流程。",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
  },
  {
    title: "日常商品运营",
    description: "集中同步在线商品，批量处理价格、库存、促销、归档和商品修复。",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
  },
  {
    title: "选品与数据判断",
    description: "结合 Ozon 商品情报、佣金、销量、流量与配送数据辅助筛选和评估商品。",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
  },
];

export function Benefits() {
  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl">
                把重复运营工作放进一个系统
              </h2>
              <p className="text-lg text-muted-foreground">
                OzonG ERP 不是单一工具，而是围绕 Ozon 跨境卖家的实际流程，把采集、上架、商品、订单、选品和数据能力连接起来。
              </p>
            </div>

            <div className="grid gap-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {useCases.map((useCase, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-1/3">
                      <ImageWithFallback
                        src={useCase.image}
                        alt={useCase.title}
                        className="w-full h-32 sm:h-full object-cover"
                      />
                    </div>
                    <div className="sm:w-2/3 p-6">
                      <h3 className="text-xl mb-2">{useCase.title}</h3>
                      <p className="text-muted-foreground">{useCase.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}