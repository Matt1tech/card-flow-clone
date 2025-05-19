
import { Button } from '@/components/ui/button';
import { Attachment } from '@/types';
import { Link, Paperclip, Trash2 } from 'lucide-react';

interface CardAttachmentsProps {
  attachments?: Attachment[];
  onDeleteAttachment: (attachmentId: string) => void;
}

export function CardAttachments({ attachments, onDeleteAttachment }: CardAttachmentsProps) {
  if (!attachments || attachments.length === 0) return null;
  
  return (
    <div className="space-y-2">
      <div className="font-medium">Attachments</div>
      <div className="space-y-2">
        {attachments.map(attachment => (
          <div key={attachment.id} className="flex items-center justify-between border rounded-md p-2 hover:bg-accent/30 transition-colors">
            <div className="flex items-center gap-2">
              {attachment.type === 'file' ? (
                <Paperclip className="h-4 w-4 flex-shrink-0" />
              ) : (
                <Link className="h-4 w-4 flex-shrink-0" />
              )}
              <a 
                href={attachment.url} 
                target="_blank" 
                rel="noreferrer"
                className="text-sm text-blue-500 hover:underline overflow-hidden text-ellipsis"
                title={attachment.name}
              >
                {attachment.name}
              </a>
            </div>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-7 w-7 flex-shrink-0" 
              onClick={() => onDeleteAttachment(attachment.id)}
              aria-label="Delete attachment"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
