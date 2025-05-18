
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Comment } from '@/types';
import { format } from 'date-fns';
import { X } from 'lucide-react';

interface CardCommentsProps {
  comments?: Comment[];
  onAddComment: (text: string) => void;
  onDeleteComment: (commentId: string) => void;
}

export function CardComments({ comments, onAddComment, onDeleteComment }: CardCommentsProps) {
  const [newComment, setNewComment] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };
  
  return (
    <div className="space-y-3">
      {comments && comments.length > 0 && (
        <div className="border-t pt-4">
          <div className="font-medium">Comments</div>
          {comments.map(comment => (
            <div key={comment.id} className="space-y-1 pb-3 border-b">
              <div className="flex justify-between">
                <div className="text-sm font-medium">{comment.author}</div>
                <div className="flex items-center">
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(comment.createdAt), 'MMM d, HH:mm')}
                  </div>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-6 w-6 ml-1" 
                    onClick={() => onDeleteComment(comment.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <p className="text-sm">{comment.text}</p>
            </div>
          ))}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="mt-2 space-y-2">
        <div className="font-medium">Add Comment</div>
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="min-h-[80px] text-sm"
        />
        <Button type="submit" className="w-full" disabled={!newComment.trim()}>
          Add Comment
        </Button>
      </form>
    </div>
  );
}
