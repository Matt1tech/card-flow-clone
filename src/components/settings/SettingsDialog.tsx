
import { useState, useEffect } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/context/theme/ThemeContext';
import { toast } from 'sonner';

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
  const { theme, setTheme } = useTheme();
  const [background, setBackground] = useState('default');
  const [defaultLabelColor, setDefaultLabelColor] = useState('blue');
  const [darkLabelText, setDarkLabelText] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [showDueDate, setShowDueDate] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Load settings from localStorage on mount
  useEffect(() => {
    const savedBackground = localStorage.getItem('boardBackground') || 'default';
    const savedLabelColor = localStorage.getItem('defaultLabelColor') || 'blue';
    const savedDarkLabelText = localStorage.getItem('labelTextDark') === 'true';
    const savedCompactMode = localStorage.getItem('compactMode') === 'true';
    const savedNotifications = localStorage.getItem('enableNotifications') !== 'false';
    const savedAutoSave = localStorage.getItem('autoSave') !== 'false';
    const savedShowDueDate = localStorage.getItem('showDueDate') !== 'false';
    
    setBackground(savedBackground);
    setDefaultLabelColor(savedLabelColor);
    setDarkLabelText(savedDarkLabelText);
    setCompactMode(savedCompactMode);
    setEnableNotifications(savedNotifications);
    setAutoSave(savedAutoSave);
    setShowDueDate(savedShowDueDate);
  }, []);
  
  // Save settings to localStorage
  const saveSettings = () => {
    localStorage.setItem('boardBackground', background);
    localStorage.setItem('defaultLabelColor', defaultLabelColor);
    localStorage.setItem('labelTextDark', String(darkLabelText));
    localStorage.setItem('compactMode', String(compactMode));
    localStorage.setItem('enableNotifications', String(enableNotifications));
    localStorage.setItem('autoSave', String(autoSave));
    localStorage.setItem('showDueDate', String(showDueDate));
    
    // Apply theme if it changed
    document.documentElement.classList.toggle('compact', compactMode);
    
    toast.success("Settings saved successfully");
    setDialogOpen(false);
  };
  
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="labels">Labels</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Theme</h3>
                <p className="text-xs text-muted-foreground mb-2">
                  Choose your preferred theme
                </p>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant={theme === 'light' ? 'default' : 'outline'} 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setTheme('light')}
                  >
                    Light
                  </Button>
                  <Button 
                    variant={theme === 'dark' ? 'default' : 'outline'} 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setTheme('dark')}
                  >
                    Dark
                  </Button>
                </div>
              </div>

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
              
              <div>
                <h3 className="text-sm font-medium">Compact Mode</h3>
                <div className="flex items-center justify-between mt-2">
                  <Label htmlFor="compact-mode" className="text-sm">
                    Use compact card layout
                  </Label>
                  <Switch
                    id="compact-mode"
                    checked={compactMode}
                    onCheckedChange={setCompactMode}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="labels" className="space-y-4">
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
              
              <div className="flex items-center justify-between mt-2">
                <Label htmlFor="dark-label-text" className="text-sm">
                  Use dark text on labels
                </Label>
                <Switch
                  id="dark-label-text"
                  checked={darkLabelText}
                  onCheckedChange={(checked) => {
                    setDarkLabelText(checked);
                    localStorage.setItem('labelTextDark', String(checked));
                  }}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="preferences" className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">Notifications</h3>
              <div className="flex items-center justify-between mt-2">
                <Label htmlFor="enable-notifications" className="text-sm">
                  Enable notifications
                </Label>
                <Switch
                  id="enable-notifications"
                  checked={enableNotifications}
                  onCheckedChange={setEnableNotifications}
                />
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium">Card Preferences</h3>
              <div className="space-y-2 mt-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-save" className="text-sm">
                    Auto-save card changes
                  </Label>
                  <Switch
                    id="auto-save"
                    checked={autoSave}
                    onCheckedChange={setAutoSave}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-due-date" className="text-sm">
                    Show due dates on cards
                  </Label>
                  <Switch
                    id="show-due-date"
                    checked={showDueDate}
                    onCheckedChange={setShowDueDate}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <Button onClick={saveSettings} className="w-full mt-4">Save Settings</Button>
      </DialogContent>
    </Dialog>
  );
}
