import React, { useState } from 'react';
import { RoastResponse, RoastStyle } from '../types';
import { Button } from './Button';
import { Share2, RotateCcw, Flame, Heart, Smile } from 'lucide-react';
import { createShareableImage, downloadDataUrl } from '../utils/canvasUtils';

interface RoastCardProps {
  imageSrc: string;
  roasts: RoastResponse;
  onReset: () => void;
}

export const RoastCard: React.FC<RoastCardProps> = ({ imageSrc, roasts, onReset }) => {
  const [activeStyle, setActiveStyle] = useState<RoastStyle>(RoastStyle.SAVAGE);
  const [isDownloading, setIsDownloading] = useState(false);

  const getRoastContent = () => {
    switch (activeStyle) {
      case RoastStyle.SAVAGE: return roasts.savage;
      case RoastStyle.FRIENDLY: return roasts.friendly;
      case RoastStyle.COMPLIMENT: return roasts.compliment;
    }
  };

  const getStyleLabel = () => {
    switch (activeStyle) {
      case RoastStyle.SAVAGE: return "Savage";
      case RoastStyle.FRIENDLY: return "Friendly";
      case RoastStyle.COMPLIMENT: return "Compliment";
    }
  };

  const handleShare = async () => {
    setIsDownloading(true);
    try {
      const roastText = getRoastContent();
      const dataUrl = await createShareableImage(imageSrc, roastText, getStyleLabel());
      downloadDataUrl(dataUrl, `ai-roast-${activeStyle}-${Date.now()}.png`);
    } catch (err) {
      console.error("Failed to download", err);
      alert("Oops, couldn't create the image. Try again!");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto animate-fade-in-up">
      {/* Image Card */}
      <div className="relative group rounded-3xl overflow-hidden shadow-2xl shadow-black/50 bg-gray-900 aspect-[3/4] mb-6">
        <img 
          src={imageSrc} 
          alt="Uploaded" 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        
        {/* Text Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pb-8">
           <div className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white mb-3 border border-white/10">
              {getStyleLabel()} Mode
           </div>
           <p className="text-white text-xl md:text-2xl font-bold leading-snug drop-shadow-md">
             "{getRoastContent()}"
           </p>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-6 px-2">
        
        {/* Style Selector */}
        <div className="flex justify-between bg-white/10 backdrop-blur-lg p-2 rounded-full border border-white/10">
          <button
            onClick={() => setActiveStyle(RoastStyle.SAVAGE)}
            className={`flex-1 flex items-center justify-center py-3 rounded-full transition-all ${
              activeStyle === RoastStyle.SAVAGE 
                ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg' 
                : 'text-white/60 hover:bg-white/5'
            }`}
          >
            <Flame size={18} />
          </button>
          <button
            onClick={() => setActiveStyle(RoastStyle.FRIENDLY)}
            className={`flex-1 flex items-center justify-center py-3 rounded-full transition-all ${
              activeStyle === RoastStyle.FRIENDLY 
                ? 'bg-gradient-to-r from-blue-400 to-teal-400 text-white shadow-lg' 
                : 'text-white/60 hover:bg-white/5'
            }`}
          >
            <Smile size={18} />
          </button>
          <button
            onClick={() => setActiveStyle(RoastStyle.COMPLIMENT)}
            className={`flex-1 flex items-center justify-center py-3 rounded-full transition-all ${
              activeStyle === RoastStyle.COMPLIMENT 
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg' 
                : 'text-white/60 hover:bg-white/5'
            }`}
          >
            <Heart size={18} />
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button 
            variant="secondary" 
            fullWidth 
            onClick={onReset}
            icon={<RotateCcw size={18} />}
          >
            Try Again
          </Button>
          <Button 
            variant="primary" 
            fullWidth 
            onClick={handleShare}
            disabled={isDownloading}
            icon={isDownloading ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"/> : <Share2 size={18} />}
          >
            {isDownloading ? 'Saving...' : 'Share Card'}
          </Button>
        </div>
      </div>
    </div>
  );
};
