import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  gradient: string;
}

const FeatureCard = ({ title, description, icon: Icon, href, gradient }: FeatureCardProps) => {
  return (
    <Link to={href} className="group block">
      <div className="glass-card card-hover p-8 h-full relative overflow-hidden">
        {/* Background gradient glow */}
        <div 
          className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 ${gradient}`}
        />
        
        {/* Icon */}
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${gradient}`}>
          <Icon className="w-8 h-8 text-primary-foreground" />
        </div>
        
        {/* Content */}
        <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
        
        {/* Arrow indicator */}
        <div className="mt-6 flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-sm font-medium">开始使用</span>
          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default FeatureCard;
