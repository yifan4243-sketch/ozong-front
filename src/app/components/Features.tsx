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
    title: "人工智能转写",
    description: "基于先进的机器学习模型，将语音高精度转换为文字，准确率可达 99.5%。",
  },
  {
    icon: MessageSquare,
    title: "情绪分析",
    description: "识别每一次对话中的客户情绪与满意度变化，帮助团队及时发现问题。",
  },
  {
    icon: TrendingUp,
    title: "绩效洞察",
    description: "通过通话时长、转化率等详细数据，持续追踪并优化团队表现。",
  },
  {
    icon: Target,
    title: "关键词追踪",
    description: "自动监控竞品提及、客户异议以及关键话题，快速捕捉重要信号。",
  },
  {
    icon: Shield,
    title: "合规监测",
    description: "自动检查话术执行情况并标记风险，帮助团队持续满足合规要求。",
  },
  {
    icon: Zap,
    title: "实时辅导",
    description: "在通话过程中实时提供建议与提示，帮助团队提升沟通效果和成交结果。",
  },
  {
    icon: BarChart3,
    title: "自定义仪表盘",
    description: "根据业务需求自由组合关键指标，打造属于你自己的数据看板。",
  },
  {
    icon: Users,
    title: "团队协作",
    description: "在团队内部共享洞察、评论与优秀经验，让最佳实践快速复制。",
  },
  {
    icon: Clock,
    title: "自动生成摘要",
    description: "每次对话结束后自动生成通话摘要与待办事项，减少人工整理时间。",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 lg:py-32">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl">
            高效提升团队表现所需的一切
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            人工智能驱动的通话分析平台，为你提供完整的数据洞察能力，帮助你理解、优化并规模化提升每一次客户沟通。
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