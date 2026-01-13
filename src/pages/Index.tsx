import { Palette, LayoutGrid, Sticker, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import FeatureCard from "@/components/FeatureCard";
import heroImage from "@/assets/hero-image.png";

const Index = () => {
  const features = [
    {
      title: "Filters",
      description: "Rich filter effects to transform your photos. Adjust brightness, contrast, saturation, and more.",
      icon: Palette,
      href: "/filters",
      gradient: "bg-gradient-to-br from-purple-500 to-pink-500",
    },
    {
      title: "Collage",
      description: "Multiple grid layouts to easily create stunning photo collages. Perfectly showcase your best moments.",
      icon: LayoutGrid,
      href: "/collage",
      gradient: "bg-gradient-to-br from-blue-500 to-cyan-500",
    },
    {
      title: "Stickers",
      description: "Tons of fun stickers to add flair to your photos. Emojis, decorations, and more.",
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
            <span className="text-sm font-medium text-primary">Online Photo Editor</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text">Unlimited Creativity</span>
            <br />
            <span className="text-foreground">Make Your Photos Shine</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Easy-to-use online photo editing tools with filters, collage, and stickers
            <br />
            No download required — start creating now
          </p>

          {/* Floating preview mockup */}
          <div className="relative max-w-4xl mx-auto">
            <div className="glass-card p-4 glow-effect animate-float">
              <img 
                src={heroImage} 
                alt="PixelMagic 图片编辑展示" 
                className="w-full rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground text-lg">Choose a feature to start editing</p>
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
          <p>© 2024 PixelMagic. Online Photo Editor</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
