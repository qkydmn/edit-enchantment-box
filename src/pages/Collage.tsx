import { useState } from "react";
import { Download, Plus, Trash2, Grid2X2, Grid3X3, LayoutGrid } from "lucide-react";
import Header from "@/components/Header";
import ImageUploader from "@/components/ImageUploader";
import { Button } from "@/components/ui/button";

type LayoutType = "2x1" | "2x2" | "3x3" | "1+2" | "2+1";

interface LayoutConfig {
  name: string;
  icon: React.ReactNode;
  cells: number;
  gridClass: string;
  areas: string[];
}

const layouts: Record<LayoutType, LayoutConfig> = {
  "2x1": {
    name: "2 Horizontal",
    icon: <div className="grid grid-cols-2 gap-0.5 w-5 h-3"><div className="bg-current" /><div className="bg-current" /></div>,
    cells: 2,
    gridClass: "grid-cols-2",
    areas: ["1", "2"],
  },
  "2x2": {
    name: "2x2 Grid",
    icon: <Grid2X2 className="w-4 h-4" />,
    cells: 4,
    gridClass: "grid-cols-2",
    areas: ["1", "2", "3", "4"],
  },
  "3x3": {
    name: "3x3 Grid",
    icon: <Grid3X3 className="w-4 h-4" />,
    cells: 9,
    gridClass: "grid-cols-3",
    areas: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
  },
  "1+2": {
    name: "1 Left + 2",
    icon: <LayoutGrid className="w-4 h-4" />,
    cells: 3,
    gridClass: "grid-cols-2",
    areas: ["span-2", "1", "2"],
  },
  "2+1": {
    name: "2 Top + 1",
    icon: <div className="grid grid-cols-2 gap-0.5 w-5 h-4"><div className="bg-current" /><div className="bg-current" /><div className="col-span-2 bg-current" /></div>,
    cells: 3,
    gridClass: "grid-cols-2",
    areas: ["1", "2", "span-2"],
  },
};

const Collage = () => {
  const [layout, setLayout] = useState<LayoutType>("2x2");
  const [images, setImages] = useState<(string | null)[]>(Array(9).fill(null));
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [gap, setGap] = useState(4);
  const [bgColor, setBgColor] = useState("#1a1a2e");

  const currentLayout = layouts[layout];

  const handleImageUpload = (imageUrl: string) => {
    if (activeSlot !== null) {
      const newImages = [...images];
      newImages[activeSlot] = imageUrl;
      setImages(newImages);
      setActiveSlot(null);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  const handleDownload = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const size = 1200;
    canvas.width = size;
    canvas.height = size;

    if (ctx) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, size, size);

      // Simple grid layout for download
      const cols = layout === "3x3" ? 3 : 2;
      const rows = Math.ceil(currentLayout.cells / cols);
      const cellWidth = (size - gap * (cols + 1)) / cols;
      const cellHeight = (size - gap * (rows + 1)) / rows;

      let loaded = 0;
      const total = images.slice(0, currentLayout.cells).filter(Boolean).length;

      if (total === 0) {
        const link = document.createElement("a");
        link.download = "collage.png";
        link.href = canvas.toDataURL();
        link.click();
        return;
      }

      images.slice(0, currentLayout.cells).forEach((src, i) => {
        if (src) {
          const img = new Image();
          img.onload = () => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = gap + col * (cellWidth + gap);
            const y = gap + row * (cellHeight + gap);
            
            // Cover fit
            const scale = Math.max(cellWidth / img.width, cellHeight / img.height);
            const sw = cellWidth / scale;
            const sh = cellHeight / scale;
            const sx = (img.width - sw) / 2;
            const sy = (img.height - sh) / 2;
            
            ctx.drawImage(img, sx, sy, sw, sh, x, y, cellWidth, cellHeight);
            
            loaded++;
            if (loaded === total) {
              const link = document.createElement("a");
              link.download = "collage.png";
              link.href = canvas.toDataURL();
              link.click();
            }
          };
          img.src = src;
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-28 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 gradient-text">Collage</h1>
            <p className="text-muted-foreground text-lg">Choose a layout, add images, and create stunning collages</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Canvas Preview */}
            <div className="lg:col-span-2">
              <div 
                className="glass-card p-4"
                style={{ backgroundColor: bgColor }}
              >
                <div 
                  className={`grid ${currentLayout.gridClass} aspect-square`}
                  style={{ gap: `${gap}px` }}
                >
                  {currentLayout.areas.map((area, index) => {
                    const imageIndex = index;
                    const hasImage = images[imageIndex];
                    const isSpan = area.includes("span");
                    
                    return (
                      <div
                        key={index}
                        className={`relative rounded-lg overflow-hidden bg-secondary/50 ${
                          isSpan ? "col-span-2" : ""
                        } ${layout === "1+2" && index === 0 ? "row-span-2" : ""}`}
                        onClick={() => !hasImage && setActiveSlot(imageIndex)}
                      >
                        {hasImage ? (
                          <>
                            <img
                              src={images[imageIndex]!}
                              alt={`Collage ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImage(imageIndex);
                              }}
                              className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive/80 hover:bg-destructive transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-destructive-foreground" />
                            </button>
                          </>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-primary/10 transition-colors">
                            <Plus className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-6">
              {/* Layout Selection */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4">Select Layout</h3>
                <div className="grid grid-cols-3 gap-3">
                  {(Object.entries(layouts) as [LayoutType, LayoutConfig][]).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => setLayout(key)}
                      className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        layout === key
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {config.icon}
                      <span className="text-xs">{config.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Gap Control */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4">Gap</h3>
                <div className="flex gap-2">
                  {[0, 4, 8, 12, 16].map((g) => (
                    <button
                      key={g}
                      onClick={() => setGap(g)}
                      className={`flex-1 py-2 rounded-lg border-2 transition-all text-sm ${
                        gap === g
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {g}px
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Color */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4">Background Color</h3>
                <div className="flex gap-2">
                  {["#1a1a2e", "#ffffff", "#000000", "#2d3436", "#6c5ce7"].map((color) => (
                    <button
                      key={color}
                      onClick={() => setBgColor(color)}
                      className={`w-10 h-10 rounded-lg border-2 transition-all ${
                        bgColor === color ? "border-primary scale-110" : "border-border"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Actions */}
              <Button variant="gradient" onClick={handleDownload} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download Collage
              </Button>
            </div>
          </div>

          {/* Upload Modal */}
          {activeSlot !== null && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
              <div className="max-w-md w-full">
                <ImageUploader onImageUpload={handleImageUpload} />
                <Button
                  variant="ghost"
                  onClick={() => setActiveSlot(null)}
                  className="w-full mt-4"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Collage;
