import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "莎拉·约翰逊",
    role: "销售副总裁",
    company: "泰科流科技",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    content: "智能通话分析彻底改变了我们的销售流程。仅仅 3 个月，我们的转化率就提升了 35%，人工智能给出的洞察非常准确。",
    rating: 5,
  },
  {
    name: "迈克尔·陈",
    role: "客户成功经理",
    company: "增长实验室",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    content: "实时辅导功能非常实用。新员工过去需要几个月才能达到成熟销售的水平，现在几周就能做到。",
    rating: 5,
  },
  {
    name: "艾米丽·罗德里格斯",
    role: "质量负责人",
    company: "专业服务公司",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    content: "以前合规检查需要大量人工时间，现在已经实现自动化，而且能实时发现问题，对我们的业务非常重要。",
    rating: 5,
  },
  {
    name: "大卫·金",
    role: "销售总监",
    company: "规模增长解决方案",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    content: "数据分析帮助我们识别出高绩效员工与其他人的关键差异，现在我们能把他们的成功方法复制到整个团队。",
    rating: 5,
  },
  {
    name: "丽莎·汤普森",
    role: "运营经理",
    company: "客户至上公司",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    content: "使用情绪分析后，客户满意度明显提升。很多问题在升级之前，我们就已经能够提前识别并处理。",
    rating: 5,
  },
  {
    name: "詹姆斯·威尔逊",
    role: "培训经理",
    company: "呼叫中心精英",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    content: "借助自动化辅导洞察，新员工培训速度提升了 60%。平台可以根据成功对话模式持续优化培训效果。",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 lg:py-32">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl">
            深受行业领先企业信赖
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            看看其他企业如何利用人工智能通话分析推动业务增长，并持续改善客户体验。
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