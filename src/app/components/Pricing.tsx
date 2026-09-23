import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Check, Zap } from "lucide-react";

const plans = [
  {
    name: "基础版",
    price: "定制",
    period: "按实际开通方案",
    description: "适合开始使用 OzonG ERP 管理店铺与商品的卖家",
    features: [
      "Ozon 店铺接入与管理",
      "在线商品管理",
      "订单列表与业务数据",
      "浏览器插件协同",
      "商品同步与基础运营",
      "账户与店铺数据管理"
    ],
    isPopular: false,
  },
  {
    name: "专业版",
    price: "定制",
    period: "按实际开通方案",
    description: "面向需要完整货源、AI 与运营工作流的 Ozon 卖家",
    features: [
      "1688 货源采集工作台",
      "AI 商品编辑",
      "AI 商品图生成",
      "Ozon 商品情报",
      "选品与筛选规则",
      "批量改价与库存",
      "批量促销与商品修复",
      "订单与财务中心",
      "浏览器插件完整工作流"
    ],
    isPopular: true,
  },
  {
    name: "团队版",
    price: "定制",
    period: "按团队需求配置",
    description: "适合多店铺、多成员协作和规模化运营的团队",
    features: [
      "多 Ozon 店铺集中管理",
      "用户与额度管理",
      "商品与订单统一工作台",
      "1688 → Ozon 上架流程",
      "AI 商品与图片能力",
      "选品与商品情报",
      "批量运营能力",
      "运营与利润数据",
      "账户级配置管理",
      "持续版本更新"
    ],
    isPopular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl">
            按你的运营规模选择版本
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            不同版本对应不同业务能力与使用规模，具体开通价格、额度和服务内容以正式方案为准。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.isPopular ? 'border-primary shadow-lg scale-105' : 'border-border/50'}`}>
              {plan.isPopular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                  <Zap className="w-3 h-3 mr-1" />
                  核心能力
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="space-y-2">
                  <div className="text-3xl">
                    {plan.price}
                    {plan.price !== "定制" && <span className="text-lg text-muted-foreground">/{plan.period}</span>}
                  </div>
                  {plan.price === "定制" && <div className="text-lg text-muted-foreground">{plan.period}</div>}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  className="w-full" 
                  variant={plan.isPopular ? "default" : "outline"}
                  size="lg"
                  asChild
                >
                  <a href="#contact">
                    {plan.price === "定制" ? "咨询开通" : "立即使用"}
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 space-y-4">
          <p className="text-muted-foreground">所有版本均围绕：</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Ozon 店铺运营</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>浏览器插件协同</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>后端安全保存店铺密钥</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>持续版本迭代</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}