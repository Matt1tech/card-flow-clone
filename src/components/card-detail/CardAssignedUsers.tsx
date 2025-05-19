
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, X } from 'lucide-react';

interface CardAssignedUsersProps {
  assignedUsers?: string[];
  availableUsers: Array<{ id: string; name: string }>;
  onUnassignUser: (userId: string) => void;
}

export function CardAssignedUsers({ 
  assignedUsers, 
  availableUsers, 
  onUnassignUser 
}: CardAssignedUsersProps) {
  if (!assignedUsers || assignedUsers.length === 0) return null;
  
  return (
    <div className="space-y-2">
      <div className="font-medium">Assigned to</div>
      <div className="flex flex-wrap gap-2">
        {assignedUsers.map(userId => {
          const user = availableUsers.find(u => u.id === userId);
          return (
            <div key={userId} className="flex items-center">
              <Badge variant="outline" className="flex gap-1 items-center">
                <User className="h-3 w-3" />
                {user?.name || userId}
              </Badge>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-5 w-5 ml-1" 
                onClick={() => onUnassignUser(userId)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
