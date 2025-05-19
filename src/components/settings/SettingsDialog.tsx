
import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const backgroundOptions = [
  { value: 'default', label: 'Default' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'purple', label: 'Purple' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
];

const labelColorOptions = [
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'red', label: 'Red' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'purple', label: 'Purple' },
  { value: 'pink', label: 'Pink' },
  { value: 'orange', label: 'Orange' },
];

export default function SettingsDialog() {
  const [background, setBackground] = useState('default');
  const [defaultLabelColor, setDefaultLabelColor] = useState('blue');
  
  // Save settings to localStorage
  const saveSettings = () => {
    localStorage.setItem('boardBackground', background);
    localStorage.setItem('defaultLabelColor', defaultLabelColor);
    
    // Apply background directly if wanted
    // For now we're just saving the preference
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="appearance">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="labels">Labels</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance" className="space-y-4 mt-4">
            <div>
              <h3 className="text-sm font-medium">Background</h3>
              <p className="text-xs text-muted-foreground mb-2">
                Choose a background for your boards
              </p>
              
              <RadioGroup value={background} onValueChange={setBackground} className="grid grid-cols-3 gap-2">
                {backgroundOptions.map(option => (
                  <div key={option.value}>
                    <RadioGroupItem
                      value={option.value}
                      id={`bg-${option.value}`}
                      className="sr-only"
                    />
                    <Label
                      htmlFor={`bg-${option.value}`}
                      className={`flex items-center justify-center h-12 rounded-md border-2 cursor-pointer ${
                        background === option.value ? "border-primary" : "border-muted"
                      } hover:bg-accent`}
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <Button onClick={saveSettings} className="w-full">Save Settings</Button>
          </TabsContent>
          
          <TabsContent value="labels" className="space-y-4 mt-4">
            <div>
              <h3 className="text-sm font-medium">Default Label Color</h3>
              <p className="text-xs text-muted-foreground mb-2">
                Choose the default color for new labels
              </p>
              
              <RadioGroup value={defaultLabelColor} onValueChange={setDefaultLabelColor} className="grid grid-cols-4 gap-2">
                {labelColorOptions.map(option => (
                  <div key={option.value} className="relative">
                    <RadioGroupItem
                      value={option.value}
                      id={`label-${option.value}`}
                      className="sr-only"
                    />
                    <Label
                      htmlFor={`label-${option.value}`}
                      className={`flex items-center justify-center h-8 rounded-md cursor-pointer bg-${option.value}-500 ${
                        defaultLabelColor === option.value ? "ring-2 ring-primary" : ""
                      }`}
                    >
                      <span className="text-xs text-white">{option.label}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium">Label Text Settings</h3>
              <p className="text-xs text-muted-foreground mb-2">
                Customize how labels appear in cards
              </p>
              
              <div className="flex items-center space-x-2 mt-2">
                <Button variant="outline" size="sm" onClick={() => {
                  localStorage.setItem('labelTextDark', 'true');
                }}>
                  Dark Text
                </Button>
                <Button variant="outline" size="sm" onClick={() => {
                  localStorage.setItem('labelTextDark', 'false');
                }}>
                  Light Text
                </Button>
              </div>
            </div>
            
            <Button onClick={saveSettings} className="w-full">Save Settings</Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
