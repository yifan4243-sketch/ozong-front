import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Button } from "./ui/button";

const faqs = [
  {
    question: "人工智能语音转写的准确率有多高？",
    answer: "在理想环境下，人工智能语音转写准确率可达到 99.5%；即使存在背景噪音或口音等复杂情况，也能保持 95% 以上的准确率。系统还会根据你的实际使用场景持续学习和优化。"
  },
  {
    question: "可以与哪些电话系统集成？",
    answer: "我们支持主流电话与客户管理系统，并可连接常见的企业通信平台。对于特殊业务，也提供 开放接口用于自定义集成，只要系统能够提供通话录音即可接入。"
  },
  {
    question: "完成系统配置需要多长时间？",
    answer: "大多数客户可在 30 分钟内完成基础配置并开始使用。我们的团队会提供完整的接入指导，帮助系统顺利连接现有业务流程，无需你具备专业技术能力。"
  },
  {
    question: "我的通话数据是否安全合规？",
    answer: "是的。平台遵循行业标准的数据安全与加密规范，数据在传输和存储过程中均受到加密保护。我们不会向第三方出售或共享你的业务数据。"
  },
  {
    question: "可以自定义分析指标和仪表盘吗？",
    answer: "可以。平台支持灵活配置仪表盘、自定义关键词追踪以及告警规则。企业客户还可以通过开放接口构建更深度的定制分析方案。"
  },
  {
    question: "免费试用期间可以使用哪些功能？",
    answer: "14 天免费试用期间，你可以完整体验专业版中的主要功能，无需绑定信用卡。我们的团队也会协助完成系统配置并提供基础使用培训，帮助你快速体验产品价值。"
  },
  {
    question: "是否提供培训和售后支持？",
    answer: "提供。我们会提供完整的新用户接入、培训和持续支持。不同套餐对应不同级别的服务，企业客户可获得专属客户成功经理与全天候电话支持。"
  },
  {
    question: "可以随时升级或降级套餐吗？",
    answer: "可以随时调整套餐。升级后立即生效，降级将在下一个计费周期生效。我们会协助你平稳迁移相关数据与配置。"
  }
];

export function FAQ() {
  return (
    <section id="faq" className="py-20 lg:py-32">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl">
            常见问题
          </h2>
          <p className="text-lg text-muted-foreground">
            关于人工智能通话分析平台，你需要了解的关键信息都在这里。
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border border-border/50 rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">还有其他问题？</p>
          <Button variant="outline">联系支持团队</Button>
        </div>
      </div>
    </section>
  );
}