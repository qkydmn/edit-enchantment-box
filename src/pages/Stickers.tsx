import { useState, useRef, useCallback } from "react";
import { Download, Trash2, Move, RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import Header from "@/components/Header";
import ImageUploader from "@/components/ImageUploader";
import { Button } from "@/components/ui/button";

interface Sticker {
  id: string;
  emoji: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

const stickerEmojis = [
  "😀", "😍", "🥳", "😎", "🤩", "😇",
  "❤️", "💖", "✨", "🌟", "⭐", "💫",
  "🎉", "🎊", "🎈", "🎁", "🏆", "🥇",
  "👍", "👏", "🙌", "💪", "✌️", "🤟",
  "🌈", "☀️", "🌙", "⚡", "🔥", "💧",
  "🌸", "🌺", "🌻", "🌹", "🍀", "🌿",
  "🦋", "🐱", "🐶", "🦊", "🐼", "🦄",
  "🍕", "🍔", "🍦", "🧁", "🍩", "☕",
];

const Stickers = () => {
  const [image, setImage] = useState<string | null>(null);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const addSticker = (emoji: string) => {
    const newSticker: Sticker = {
      id: Date.now().toString(),
      emoji,
      x: 50,
      y: 50,
      scale: 1,
      rotation: 0,
    };
    setStickers([...stickers, newSticker]);
    setSelectedSticker(newSticker.id);
  };

  const updateSticker = (id: string, updates: Partial<Sticker>) => {
    setStickers(stickers.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteSticker = (id: string) => {
    setStickers(stickers.filter((s) => s.id !== id));
    if (selectedSticker === id) setSelectedSticker(null);
  };

  const handleMouseDown = useCallback((e: React.MouseEvent, stickerId: string) => {
    e.preventDefault();
    setSelectedSticker(stickerId);
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !selectedSticker || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    updateSticker(selectedSticker, {
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  }, [isDragging, selectedSticker]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDownload = () => {
    if (!image || !canvasRef.current) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      if (ctx) {
        ctx.drawImage(img, 0, 0);

        // Draw stickers
        stickers.forEach((sticker) => {
          const x = (sticker.x / 100) * img.width;
          const y = (sticker.y / 100) * img.height;
          const fontSize = img.width * 0.08 * sticker.scale;

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate((sticker.rotation * Math.PI) / 180);
          ctx.font = `${fontSize}px serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(sticker.emoji, 0, 0);
          ctx.restore();
        });

        const link = document.createElement("a");
        link.download = "sticker-image.png";
        link.href = canvas.toDataURL();
        link.click();
      }
    };
    img.src = image;
  };

  const selectedStickerData = stickers.find((s) => s.id === selectedSticker);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-28 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 gradient-text">Stickers</h1>
            <p className="text-muted-foreground text-lg">Add fun stickers to make your photos pop</p>
          </div>

          {!image ? (
            <div className="max-w-2xl mx-auto">
              <ImageUploader onImageUpload={setImage} />
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Canvas */}
              <div className="lg:col-span-2">
                <div className="glass-card p-4">
                  <div
                    ref={canvasRef}
                    className="relative select-none"
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    <img
                      src={image}
                      alt="Canvas"
                      className="w-full h-auto rounded-xl"
                      draggable={false}
                    />
                    
                    {stickers.map((sticker) => (
                      <div
                        key={sticker.id}
                        className={`absolute cursor-move select-none ${
                          selectedSticker === sticker.id
                            ? "ring-2 ring-primary ring-offset-2 ring-offset-transparent rounded"
                            : ""
                        }`}
                        style={{
                          left: `${sticker.x}%`,
                          top: `${sticker.y}%`,
                          transform: `translate(-50%, -50%) scale(${sticker.scale}) rotate(${sticker.rotation}deg)`,
                          fontSize: "3rem",
                        }}
                        onMouseDown={(e) => handleMouseDown(e, sticker.id)}
                        onClick={() => setSelectedSticker(sticker.id)}
                      >
                        {sticker.emoji}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground justify-center">
                  <div className="flex items-center gap-2">
                    <Move className="w-4 h-4" />
                    <span>Drag to move stickers</span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-6">
                {/* Sticker Picker */}
                <div className="glass-card p-6">
                  <h3 className="text-lg font-semibold mb-4">Choose Stickers</h3>
                  <div className="grid grid-cols-6 gap-2 max-h-64 overflow-y-auto">
                    {stickerEmojis.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => addSticker(emoji)}
                        className="text-2xl p-2 rounded-lg hover:bg-primary/10 transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Sticker Controls */}
                {selectedStickerData && (
                  <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Edit Sticker</h3>
                      <button
                        onClick={() => deleteSticker(selectedStickerData.id)}
                        className="p-2 rounded-lg hover:bg-destructive/20 text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Scale */}
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">Size</label>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              updateSticker(selectedStickerData.id, {
                                scale: Math.max(0.5, selectedStickerData.scale - 0.25),
                              })
                            }
                          >
                            <ZoomOut className="w-4 h-4" />
                          </Button>
                          <div className="flex-1 text-center text-sm">
                            {(selectedStickerData.scale * 100).toFixed(0)}%
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              updateSticker(selectedStickerData.id, {
                                scale: Math.min(3, selectedStickerData.scale + 0.25),
                              })
                            }
                          >
                            <ZoomIn className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Rotation */}
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">Rotation</label>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              updateSticker(selectedStickerData.id, {
                                rotation: selectedStickerData.rotation - 15,
                              })
                            }
                          >
                            <RotateCw className="w-4 h-4 -scale-x-100" />
                          </Button>
                          <div className="flex-1 text-center text-sm">
                            {selectedStickerData.rotation}°
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              updateSticker(selectedStickerData.id, {
                                rotation: selectedStickerData.rotation + 15,
                              })
                            }
                          >
                            <RotateCw className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <Button variant="gradient" onClick={handleDownload} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Image
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => {
                    setImage(null);
                    setStickers([]);
                    setSelectedSticker(null);
                  }}
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

export default Stickers;
