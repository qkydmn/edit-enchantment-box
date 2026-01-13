import { useState, useCallback } from "react";
import { Download, RotateCcw, Sun, Contrast, Droplets, Palette } from "lucide-react";
import Header from "@/components/Header";
import ImageUploader from "@/components/ImageUploader";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface FilterValues {
  brightness: number;
  contrast: number;
  saturate: number;
  hueRotate: number;
  blur: number;
  grayscale: number;
  sepia: number;
}

const defaultFilters: FilterValues = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  hueRotate: 0,
  blur: 0,
  grayscale: 0,
  sepia: 0,
};

const presetFilters = [
  { name: "Original", values: defaultFilters },
  { name: "Warm", values: { ...defaultFilters, saturate: 130, brightness: 110, sepia: 20 } },
  { name: "Cool", values: { ...defaultFilters, saturate: 80, hueRotate: 180, brightness: 95 } },
  { name: "Vintage", values: { ...defaultFilters, sepia: 60, contrast: 110, saturate: 80 } },
  { name: "B&W", values: { ...defaultFilters, grayscale: 100, contrast: 120 } },
  { name: "Vibrant", values: { ...defaultFilters, saturate: 150, contrast: 110 } },
  { name: "Dreamy", values: { ...defaultFilters, blur: 1, brightness: 110, saturate: 90 } },
  { name: "Film", values: { ...defaultFilters, contrast: 90, saturate: 85, sepia: 15 } },
];

const Filters = () => {
  const [image, setImage] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterValues>(defaultFilters);

  const getFilterStyle = useCallback(() => {
    return {
      filter: `
        brightness(${filters.brightness}%)
        contrast(${filters.contrast}%)
        saturate(${filters.saturate}%)
        hue-rotate(${filters.hueRotate}deg)
        blur(${filters.blur}px)
        grayscale(${filters.grayscale}%)
        sepia(${filters.sepia}%)
      `,
    };
  }, [filters]);

  const handleReset = () => {
    setFilters(defaultFilters);
  };

  const handleDownload = () => {
    if (!image) return;
    
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.filter = `
          brightness(${filters.brightness}%)
          contrast(${filters.contrast}%)
          saturate(${filters.saturate}%)
          hue-rotate(${filters.hueRotate}deg)
          grayscale(${filters.grayscale}%)
          sepia(${filters.sepia}%)
        `;
        ctx.drawImage(img, 0, 0);
        const link = document.createElement("a");
        link.download = "filtered-image.png";
        link.href = canvas.toDataURL();
        link.click();
      }
    };
    img.src = image;
  };

  const filterControls = [
    { name: "Brightness", key: "brightness" as const, icon: Sun, min: 0, max: 200 },
    { name: "Contrast", key: "contrast" as const, icon: Contrast, min: 0, max: 200 },
    { name: "Saturation", key: "saturate" as const, icon: Droplets, min: 0, max: 200 },
    { name: "Hue", key: "hueRotate" as const, icon: Palette, min: 0, max: 360 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-28 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 gradient-text">Filters</h1>
            <p className="text-muted-foreground text-lg">Adjust parameters or choose presets to create unique visual effects</p>
          </div>

          {!image ? (
            <div className="max-w-2xl mx-auto">
              <ImageUploader onImageUpload={setImage} />
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Image Preview */}
              <div className="lg:col-span-2">
                <div className="glass-card p-4">
                  <img
                    src={image}
                    alt="Preview"
                    className="w-full h-auto rounded-xl"
                    style={getFilterStyle()}
                  />
                </div>
                
                {/* Preset Filters */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Preset Filters</h3>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {presetFilters.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => setFilters(preset.values)}
                        className="flex-shrink-0 text-center"
                      >
                        <div className="w-16 h-16 rounded-lg overflow-hidden mb-1 border-2 border-transparent hover:border-primary transition-colors">
                          <img
                            src={image}
                            alt={preset.name}
                            className="w-full h-full object-cover"
                            style={{
                              filter: `
                                brightness(${preset.values.brightness}%)
                                contrast(${preset.values.contrast}%)
                                saturate(${preset.values.saturate}%)
                                hue-rotate(${preset.values.hueRotate}deg)
                                grayscale(${preset.values.grayscale}%)
                                sepia(${preset.values.sepia}%)
                              `,
                            }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-6">
                <div className="glass-card p-6">
                  <h3 className="text-lg font-semibold mb-6">Adjustments</h3>
                  
                  <div className="space-y-6">
                    {filterControls.map((control) => {
                      const Icon = control.icon;
                      return (
                        <div key={control.key}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4 text-primary" />
                              <span className="text-sm font-medium">{control.name}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {filters[control.key]}
                              {control.key === "hueRotate" ? "°" : "%"}
                            </span>
                          </div>
                          <Slider
                            value={[filters[control.key]]}
                            min={control.min}
                            max={control.max}
                            step={1}
                            onValueChange={([value]) =>
                              setFilters((prev) => ({ ...prev, [control.key]: value }))
                            }
                            className="w-full"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleReset} className="flex-1">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                  <Button variant="gradient" onClick={handleDownload} className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  onClick={() => setImage(null)}
                  className="w-full text-muted-foreground"
                >
                  Change Image
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Filters;
