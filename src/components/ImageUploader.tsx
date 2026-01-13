import { Upload, Image as ImageIcon } from "lucide-react";
import { useCallback } from "react";

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
  className?: string;
}

const ImageUploader = ({ onImageUpload, className = "" }: ImageUploaderProps) => {
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onImageUpload(result);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onImageUpload(result);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <label
      className={`group cursor-pointer ${className}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <div className="glass-card border-2 border-dashed border-white/20 rounded-2xl p-12 text-center transition-all duration-300 group-hover:border-primary/50 group-hover:bg-primary/5">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <Upload className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">上传图片</h3>
        <p className="text-muted-foreground mb-4">
          拖拽图片到这里，或点击选择文件
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <ImageIcon className="w-4 h-4" />
          <span>支持 JPG、PNG、WebP 格式</span>
        </div>
      </div>
    </label>
  );
};

export default ImageUploader;
