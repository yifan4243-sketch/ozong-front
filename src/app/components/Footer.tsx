import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Mail, Phone, MapPin, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto max-w-6xl px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary-foreground text-primary rounded-lg flex items-center justify-center">
                <span>智</span>
              </div>
              <span className="text-xl">智能通话分析</span>
            </div>
            <p className="text-primary-foreground/80">
              用人工智能驱动的通话分析与实时洞察，重新定义你的客户沟通方式。
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10" aria-label="领英">
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10" aria-label="推特">
                <Twitter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3>产品</h3>
            <div className="space-y-2 text-primary-foreground/80">
              <div><a href="#features" className="hover:text-primary-foreground transition-colors">功能</a></div>
              <div><a href="#pricing" className="hover:text-primary-foreground transition-colors">价格</a></div>
              <div><a href="#" className="hover:text-primary-foreground transition-colors">系统集成</a></div>
              <div><a href="#" className="hover:text-primary-foreground transition-colors">开放接口</a></div>
              <div><a href="#" className="hover:text-primary-foreground transition-colors">安全</a></div>
            </div>
          </div>

          <div className="space-y-4">
            <h3>公司</h3>
            <div className="space-y-2 text-primary-foreground/80">
              <div><a href="#" className="hover:text-primary-foreground transition-colors">关于我们</a></div>
              <div><a href="#" className="hover:text-primary-foreground transition-colors">博客</a></div>
              <div><a href="#" className="hover:text-primary-foreground transition-colors">加入我们</a></div>
              <div><a href="#" className="hover:text-primary-foreground transition-colors">媒体报道</a></div>
              <div><a href="#" className="hover:text-primary-foreground transition-colors">合作伙伴</a></div>
            </div>
          </div>

          <div className="space-y-4">
            <h3>联系我们</h3>
            <div className="space-y-3 text-primary-foreground/80">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>商务合作请通过官网联系</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>400-800-1234</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>美国加利福尼亚州旧金山</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-primary-foreground/20" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-primary-foreground/80 text-sm">
            © 2025 智能通话分析。版权所有。
          </div>
          <div className="flex space-x-6 text-sm text-primary-foreground/80">
            <a href="#" className="hover:text-primary-foreground transition-colors">隐私政策</a>
            <a href="#" className="hover:text-primary-foreground transition-colors">服务条款</a>
            <a href="#" className="hover:text-primary-foreground transition-colors">浏览器数据政策</a>
          </div>
        </div>
      </div>
    </footer>
  );
}