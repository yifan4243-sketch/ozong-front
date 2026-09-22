import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-6xl">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground">智</span>
          </div>
          <span className="text-xl">智能通话分析</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">功能</a>
          <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">价格</a>
          <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">客户评价</a>
          <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">常见问题</a>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost">登录</Button>
          <Button>开始免费试用</Button>
        </div>

        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "关闭菜单" : "打开菜单"}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="flex flex-col space-y-4 p-4">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">功能</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">价格</a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">客户评价</a>
            <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">常见问题</a>
            <Button variant="ghost" className="justify-start">登录</Button>
            <Button className="justify-start">开始免费试用</Button>
          </nav>
        </div>
      )}
    </header>
  );
}