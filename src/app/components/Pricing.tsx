import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Check, Zap } from "lucide-react";

const plans = [
  {
    name: "入门版",
    price: "$29",
    period: "每位用户/月",
    description: "适合刚开始使用通话分析的小型团队",
    features: [
      "每月最多分析 100 通电话",
      "基础语音转写",
      "情绪分析",
      "标准数据看板",
      "邮件支持",
      "数据保留 7 天"
    ],
    isPopular: false,
  },
  {
    name: "专业版",
    price: "$79",
    period: "每位用户/月",
    description: "面向正在增长的销售与客服团队，提供更完整的高级能力",
    features: [
      "每月最多分析 500 通电话",
      "高级人工智能语音转写",
      "实时辅导",
      "自定义数据看板",
      "关键词追踪",
      "合规监测",
      "优先支持",
      "数据保留 30 天",
      "开放接口访问"
    ],
    isPopular: true,
  },
  {
    name: "企业版",
    price: "定制",
    period: "专属报价",
    description: "为大型组织提供可定制的企业级解决方案",
    features: [
      "不限通话数量",
      "高级人工智能模型",
      "定制系统集成",
      "专属客户成功经理",
      "自定义合规规则",
      "高级数据分析",
      "7×24 小时电话支持",
      "不限数据保留期限",
      "单点登录与企业身份认证",
      "本地化部署"
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
            简单透明的价格方案
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            根据团队规模和实际需求选择合适方案，所有方案均包含 14 天免费试用。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.isPopular ? 'border-primary shadow-lg scale-105' : 'border-border/50'}`}>
              {plan.isPopular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                  <Zap className="w-3 h-3 mr-1" />
                  最受欢迎
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
                >
                  {plan.price === "定制" ? "联系销售" : "开始免费试用"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 space-y-4">
          <p className="text-muted-foreground">所有方案均包含：</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>14 天免费试用</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>无配置费用</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>随时取消</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>99.9% 服务可用性保障</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}