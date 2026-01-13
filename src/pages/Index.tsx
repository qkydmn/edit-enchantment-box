import { Palette, LayoutGrid, Sticker, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import FeatureCard from "@/components/FeatureCard";

const Index = () => {
  const features = [
    {
      title: "滤镜",
      description: "丰富的滤镜效果，让你的照片焕然一新。调整亮度、对比度、饱和度等参数。",
      icon: Palette,
      href: "/filters",
      gradient: "bg-gradient-to-br from-purple-500 to-pink-500",
    },
    {
      title: "拼图",
      description: "多种网格布局，轻松创建精美的照片拼图。完美呈现你的精彩瞬间。",
      icon: LayoutGrid,
      href: "/collage",
      gradient: "bg-gradient-to-br from-blue-500 to-cyan-500",
    },
    {
      title: "贴纸",
      description: "海量趣味贴纸，为你的照片增添乐趣。表情、装饰、文字应有尽有。",
      icon: Sticker,
      href: "/stickers",
      gradient: "bg-gradient-to-br from-orange-500 to-yellow-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse-slow" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[128px] animate-pulse-slow" />
      
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">在线图片编辑工具</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text">创意无限</span>
            <br />
            <span className="text-foreground">让图片更精彩</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            简单易用的在线图片编辑工具，支持滤镜、拼图、贴纸等功能
            <br />
            无需下载，即刻开始创作
          </p>

          {/* Floating preview mockup */}
          <div className="relative max-w-4xl mx-auto">
            <div className="glass-card p-4 glow-effect animate-float">
              <div className="aspect-video rounded-xl bg-gradient-to-br from-secondary to-card flex items-center justify-center">
                <div className="grid grid-cols-3 gap-4 p-8">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-lg bg-gradient-to-br from-primary/30 to-accent/30 animate-pulse"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">强大功能</h2>
            <p className="text-muted-foreground text-lg">选择一个功能开始编辑</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground text-sm">
          <p>© 2024 PixelMagic. 在线图片编辑工具</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
