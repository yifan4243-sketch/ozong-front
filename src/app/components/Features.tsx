import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { 
  Brain, 
  MessageSquare, 
  TrendingUp, 
  Target, 
  Shield, 
  Zap,
  BarChart3,
  Users,
  Clock
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "1688 货源采集",
    description: "通过浏览器插件采集 1688 商品、图片和 SKU 数据，统一进入 ERP 采集工作台继续处理。",
  },
  {
    icon: MessageSquare,
    title: "AI 商品编辑",
    description: "围绕 Ozon 上架流程处理类目、标题、必填属性、俄语内容和商品信息，减少重复整理工作。",
  },
  {
    icon: TrendingUp,
    title: "Ozon 商品上架",
    description: "从采集商品进入上架流程，结合店铺、仓库、SKU、价格、图片和库存信息完成 Ozon 商品发布。",
  },
  {
    icon: Target,
    title: "AI 商品图生成",
    description: "在 ERP 内生成 Ozon 商品主图与成套商品图，并保留生成任务、重试与结果管理能力。",
  },
  {
    icon: Shield,
    title: "在线商品管理",
    description: "集中管理已上架商品，支持同步、批量改价、批量库存、批量促销、归档与商品修复等操作。",
  },
  {
    icon: Zap,
    title: "Ozon 商品情报",
    description: "在 Ozon 页面查看类目、佣金、销量、销售额、推广、流量、配送、退货、包装与跟卖等关键数据。",
  },
  {
    icon: BarChart3,
    title: "选品与规则",
    description: "把商品加入 ERP 选品池，并通过筛选条件、高亮规则和自动扫描辅助完成 Ozon 选品判断。",
  },
  {
    icon: Users,
    title: "多店铺管理",
    description: "在一个 ERP 中连接和管理多个 Ozon 店铺，统一查看店铺商品、订单与运营工作流。",
  },
  {
    icon: Clock,
    title: "订单与财务中心",
    description: "统一处理 Ozon 订单，并结合采购成本、平台费用和订单数据查看业务利润与经营结果。",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 lg:py-32">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl">
            覆盖 Ozon 运营核心流程
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            从中国货源采集到 Ozon 店铺运营，把原本分散在浏览器、表格和多个工具里的工作集中到 OzonG ERP。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-border/50 hover:border-border transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}