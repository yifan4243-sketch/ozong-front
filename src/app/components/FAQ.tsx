import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Button } from "./ui/button";

const faqs = [
  {
    question: "OzonG ERP 是做什么的？",
    answer: "OzonG ERP 是面向 Ozon 跨境卖家的运营系统，把 1688 货源采集、商品处理、Ozon 上架、在线商品、订单、选品、AI 商品图和运营数据集中到同一个工作台。"
  },
  {
    question: "1688 商品如何进入 OzonG ERP？",
    answer: "通过 OzonG 浏览器插件打开 1688 商品详情页，可采集商品结构化数据和所选 SKU 到 ERP。采集后的商品进入 1688 → Ozon 工作台，再继续完成上架设置和 Ozon 发布流程。"
  },
  {
    question: "系统会自动处理哪些上架信息？",
    answer: "当前 1688 → Ozon 工作流会衔接类目、必填项、包装估算、定价和 Ozon 商品数据处理；同时提供 AI 商品编辑页面，方便在正式发布前继续检查和调整商品内容。"
  },
  {
    question: "OzonG ERP 可以管理哪些店铺业务？",
    answer: "系统已覆盖店铺管理、在线商品、上架记录、订单、促销、选品、财务中心、AI 商品图和浏览器插件等业务模块，并支持多个 Ozon 店铺统一接入。"
  },
  {
    question: "浏览器插件可以做什么？",
    answer: "插件可在 Ozon、Ozon Seller 和 1688 页面协同 ERP 工作，包括商品情报、选品、利润与定价辅助、1688 货源采集、一键或编辑上架，以及店铺商品数据查看。"
  },
  {
    question: "AI 商品图功能支持什么？",
    answer: "ERP 内置 AI 商品图工作流，可生成 Ozon 商品主图或成套商品图，并通过任务记录、状态轮询、重试和结果管理衔接后续商品运营。"
  },
  {
    question: "店铺 API Key 和登录数据如何处理？",
    answer: "Ozon API Key 保存在 ERP 后端，不会由浏览器插件读取或展示完整密钥；Seller 会话数据由后端加密保存，并限制在明确的业务接口范围内使用。"
  },
  {
    question: "OzonG ERP 适合哪些卖家？",
    answer: "适合需要从中国货源采集、批量处理商品、运营多个 Ozon 店铺、做选品与商品数据分析，或希望减少重复人工操作的跨境卖家和运营团队。"
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
            关于 OzonG ERP、1688 采集、Ozon 上架和店铺运营，你需要了解的关键信息都在这里。
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
          <Button variant="outline">联系 OzonG 团队</Button>
        </div>
      </div>
    </section>
  );
}