
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Cover } from '@/types';
import { Image, Palette } from 'lucide-react';

// Predefined color options
const colorOptions = [
  '#0079bf', // Blue
  '#70b500', // Green
  '#ff9f1a', // Orange
  '#eb5a46', // Red
  '#c377e0', // Purple
  '#ff78cb', // Pink
  '#344563', // Navy
  '#00c2e0', // Cyan
  '#51e898', // Mint
  '#c4c9cc', // Gray
];

// Sample image URLs - in a real app these might be from your asset library or API
const sampleImages = [
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500&auto=format',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&auto=format',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&auto=format',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&auto=format',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&auto=format',
];

interface CoverSelectorProps {
  currentCover?: Cover;
  onSelectCover: (cover: Cover) => void;
  onRemoveCover: () => void;
}

export default function CoverSelector({ currentCover, onSelectCover, onRemoveCover }: CoverSelectorProps) {
  const [imageUrl, setImageUrl] = useState('');
  
  const handleColorSelect = (color: string) => {
    onSelectCover({ url: '', color });
  };
  
  const handleImageSelect = (url: string) => {
    onSelectCover({ url });
  };
  
  const handleCustomImageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrl.trim()) {
      onSelectCover({ url: imageUrl });
      setImageUrl('');
    }
  };
  
  return (
    <div className="p-4">
      <h3 className="text-sm font-medium mb-2">Cover</h3>
      
      <Tabs defaultValue="colors">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="colors">
            <Palette className="h-4 w-4 mr-1" /> Colors
          </TabsTrigger>
          <TabsTrigger value="images">
            <Image className="h-4 w-4 mr-1" /> Images
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="colors" className="space-y-4">
          <div className="grid grid-cols-5 gap-2">
            {colorOptions.map((color) => (
              <Button
                key={color}
                className="w-full h-10 rounded-md p-0 border"
                style={{ backgroundColor: color }}
                onClick={() => handleColorSelect(color)}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="images" className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {sampleImages.map((url) => (
              <button
                key={url}
                className="aspect-video rounded-md overflow-hidden hover:ring-2 ring-primary transition-all"
                onClick={() => handleImageSelect(url)}
              >
                <img src={url} alt="Cover option" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          
          <form onSubmit={handleCustomImageSubmit} className="flex gap-2 mt-4">
            <Input
              type="text"
              placeholder="Enter image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <Button type="submit" size="sm" disabled={!imageUrl.trim()}>
              Add
            </Button>
          </form>
        </TabsContent>
      </Tabs>
      
      {currentCover && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRemoveCover} 
          className="w-full mt-4"
        >
          Remove Cover
        </Button>
      )}
    </div>
  );
}
