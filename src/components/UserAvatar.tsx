
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail, User, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function UserAvatar() {
  const [avatarUrl, setAvatarUrl] = useState(() => {
    return localStorage.getItem('userAvatar') || '';
  });
  const [name, setName] = useState(() => {
    return localStorage.getItem('userName') || 'User';
  });
  const [email, setEmail] = useState(() => {
    return localStorage.getItem('userEmail') || '';
  });
  
  const saveProfile = () => {
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userAvatar', avatarUrl);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Get initials for avatar fallback
  const getInitials = () => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="rounded-full h-9 w-9 p-0" aria-label="User profile">
          <Avatar>
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>
              {email && !avatarUrl ? <Mail className="h-4 w-4" /> : getInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex justify-center mb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="text-xl">
                {email && !avatarUrl ? <Mail className="h-8 w-8" /> : getInitials()}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <div className="mx-auto">
            <Label htmlFor="picture" className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
              <Upload className="mr-2 h-4 w-4" /> Upload Picture
            </Label>
            <Input 
              id="picture"
              type="file" 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        
        <Button onClick={saveProfile}>Save Profile</Button>
      </DialogContent>
    </Dialog>
  );
}
