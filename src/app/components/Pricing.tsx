import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Check } from "lucide-react";

const plans = [
  {
    code: "STARTER",
    name: "体验会员",
    price: "免费体验",
    suffix: "",
    originalPrice: "",
    badge: "",
    features: [
      "1 天使用时限",
      "1 台设备同时登录",
      "2 个店铺",
      "全部 ERP 功能开放",
      "上架、收藏、运营功能不设会员次数限制",
    ],
    buttonText: "兑换体验码",
    featured: false,
  },
  {
    code: "COPPER",
    name: "月卡会员",
    price: "259",
    suffix: "/月",
    originalPrice: "",
    badge: "",
    features: [
      "30 天使用时限",
      "1 台设备同时登录",
      "5 个店铺",
      "全部 ERP 功能开放",
      "上架、收藏、运营功能不设会员次数限制",
    ],
    buttonText: "开通月卡会员",
    featured: false,
  },
  {
    code: "SILVER",
    name: "季卡会员",
    price: "699",
    suffix: "/季度",
    originalPrice: "按月原价 ¥777",
    badge: "9折",
    features: [
      "90 天使用时限",
      "5 台设备同时登录",
      "10 个店铺",
      "全部 ERP 功能开放",
      "上架、收藏、运营功能不设会员次数限制",
    ],
    buttonText: "开通季卡会员",
    featured: true,
  },
  {
    code: "GOLD",
    name: "年卡会员",
    price: "2599",
    suffix: "/年",
    originalPrice: "按月原价 ¥3108",
    badge: "8.4折",
    features: [
      "365 天使用时限",
      "20 台设备同时登录",
      "100 个店铺",
      "全部 ERP 功能开放",
      "上架、收藏、运营功能不设会员次数限制",
    ],
    buttonText: "开通年卡会员",
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 lg:py-24 bg-muted/30">
      <div className="container mx-auto max-w-[1540px] px-4">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-sm font-semibold text-primary">会员套餐</div>
            <h2 className="mt-1 text-3xl md:text-4xl">
              选择适合你的 OzonG 会员
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground lg:text-right">
            会员只限制使用时限、同时登录设备数和店铺数；其余 ERP 业务功能不额外设置会员配额。
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <Card
              key={plan.code}
              className={`relative min-h-[435px] overflow-hidden rounded-2xl border bg-background shadow-sm ${plan.featured ? "border-primary/40 shadow-md" : "border-border/70"}`}
            >
              <CardHeader className="space-y-5 px-6 pb-3 pt-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[10px] font-medium tracking-[0.22em] text-muted-foreground">
                      {plan.code}
                    </div>
                    <CardTitle className={`mt-1 text-2xl ${plan.code === "COPPER" ? "text-orange-700" : plan.code === "GOLD" ? "text-amber-600" : ""}`}>
                      {plan.name}
                    </CardTitle>
                  </div>
                  {plan.badge && (
                    <Badge variant="secondary" className="bg-violet-50 text-violet-600 hover:bg-violet-50">
                      {plan.badge}
                    </Badge>
                  )}
                </div>

                <div className="min-h-[72px]">
                  {plan.code === "STARTER" ? (
                    <div className="pt-2 text-3xl font-bold tracking-tight">{plan.price}</div>
                  ) : (
                    <>
                      <div className="flex items-end gap-1">
                        <span className="pb-1 text-lg font-bold">¥</span>
                        <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                        <span className="pb-1 text-sm text-muted-foreground">{plan.suffix}</span>
                      </div>
                      {plan.originalPrice && (
                        <div className="mt-1 text-xs text-muted-foreground line-through">
                          {plan.originalPrice}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex h-[300px] flex-col px-6 pb-6">
                <Button
                  className="mb-5 w-full rounded-xl text-base font-semibold"
                  size="lg"
                  variant={plan.code === "STARTER" ? "outline" : "default"}
                  asChild
                >
                  <a href="#contact">{plan.buttonText}</a>
                </Button>

                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                      <span className="text-sm leading-5 text-foreground/85">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
