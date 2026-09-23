import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Mail, Phone, MapPin, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer id="contact" className="bg-primary text-primary-foreground">
      <div className="container mx-auto max-w-6xl px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary-foreground text-primary rounded-lg flex items-center justify-center">
                <span>O</span>
              </div>
              <span className="text-xl">OzonG ERP</span>
            </div>
            <p className="text-primary-foreground/80">
              面向 Ozon 跨境卖家的智能运营系统，把货源、商品、AI、店铺、订单和数据连接成一套工作流。
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10" aria-label="产品动态" asChild>
                <a href="#features">
                  <Linkedin className="w-4 h-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10" aria-label="官方内容" asChild>
                <a href="#testimonials">
                  <Twitter className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3>产品</h3>
            <div className="space-y-2 text-primary-foreground/80">
              <div><a href="#features" className="hover:text-primary-foreground transition-colors">核心功能</a></div>
              <div><a href="#pricing" className="hover:text-primary-foreground transition-colors">版本方案</a></div>
              <div><a href="#features" className="hover:text-primary-foreground transition-colors">1688 → Ozon</a></div>
              <div><a href="#features" className="hover:text-primary-foreground transition-colors">AI 商品图</a></div>
              <div><a href="#features" className="hover:text-primary-foreground transition-colors">浏览器插件</a></div>
            </div>
          </div>

          <div className="space-y-4">
            <h3>能力</h3>
            <div className="space-y-2 text-primary-foreground/80">
              <div><a href="#features" className="hover:text-primary-foreground transition-colors">在线商品</a></div>
              <div><a href="#features" className="hover:text-primary-foreground transition-colors">订单管理</a></div>
              <div><a href="#testimonials" className="hover:text-primary-foreground transition-colors">选品分析</a></div>
              <div><a href="#testimonials" className="hover:text-primary-foreground transition-colors">商品情报</a></div>
              <div><a href="#features" className="hover:text-primary-foreground transition-colors">多店铺管理</a></div>
            </div>
          </div>

          <div className="space-y-4">
            <h3>联系我们</h3>
            <div className="space-y-3 text-primary-foreground/80">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>商务合作与产品咨询</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>产品开通与售后支持</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>专注 Ozon 跨境电商运营</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-primary-foreground/20" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-primary-foreground/80 text-sm">
            © 2026 OzonG ERP。版权所有。
          </div>
          <div className="flex space-x-6 text-sm text-primary-foreground/80">
            <a href="#faq" className="hover:text-primary-foreground transition-colors">隐私政策</a>
            <a href="#faq" className="hover:text-primary-foreground transition-colors">服务条款</a>
            <a href="#faq" className="hover:text-primary-foreground transition-colors">数据安全</a>
          </div>
        </div>
      </div>
    </footer>
  );
}