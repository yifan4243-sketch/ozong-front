import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "1688 采集上架",
    role: "货源工作流",
    company: "1688 → Ozon",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    content: "采集 1688 商品与 SKU 后直接进入 ERP，继续完成商品处理、上架设置和 Ozon 发布，不再依赖多份中间表格。",
    rating: 5,
  },
  {
    name: "AI 商品编辑",
    role: "商品工作流",
    company: "Ozon 上架",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    content: "围绕 Ozon 商品结构处理类目、标题、必填项和商品内容，让采集后的货源更快进入可检查、可发布的商品状态。",
    rating: 5,
  },
  {
    name: "AI 商品图",
    role: "图片工作流",
    company: "商品素材",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    content: "在 ERP 内完成商品主图与成套商品图生成，并通过任务记录、重试和结果管理衔接商品上架流程。",
    rating: 5,
  },
  {
    name: "在线商品管理",
    role: "日常运营",
    company: "批量处理",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    content: "同步店铺在线商品后，可集中执行批量改价、库存、促销、归档和修复操作，减少逐个商品处理的重复步骤。",
    rating: 5,
  },
  {
    name: "Ozon 商品情报",
    role: "选品分析",
    company: "浏览器插件",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    content: "在 Ozon 商品页直接查看销量、销售额、佣金、推广、流量、配送、退货、尺寸重量和跟卖等关键运营数据。",
    rating: 5,
  },
  {
    name: "多店铺运营",
    role: "店铺管理",
    company: "OzonG ERP",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    content: "把多个 Ozon 店铺接入同一个 ERP，统一查看商品、订单和运营数据，让不同店铺的日常工作保持在同一套流程中。",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 lg:py-32">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl">
            覆盖 Ozon 卖家的核心工作流
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            OzonG ERP 围绕真实运营场景连接货源、商品、图片、店铺、订单和数据，让每个环节都能继续向下一步流转。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border/50">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground">“{testimonial.content}”</p>
                  
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}，{testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}