
import { Button } from '@/components/ui/button';
import { Attachment } from '@/types';
import { Link, Paperclip, File, FileImage, FileText, FilePdf, Trash2 } from 'lucide-react';

interface CardAttachmentsProps {
  attachments?: Attachment[];
  onDeleteAttachment: (attachmentId: string) => void;
}

export function CardAttachments({ attachments, onDeleteAttachment }: CardAttachmentsProps) {
  if (!attachments || attachments.length === 0) return null;
  
  const getFileIcon = (url: string, type: string) => {
    // If it's a data URL from file upload
    if (url.startsWith('data:')) {
      if (url.startsWith('data:image/')) {
        return <FileImage className="h-4 w-4 flex-shrink-0" />;
      } else if (url.startsWith('data:application/pdf')) {
        return <FilePdf className="h-4 w-4 flex-shrink-0" />;
      } else if (url.startsWith('data:text/')) {
        return <FileText className="h-4 w-4 flex-shrink-0" />;
      } else {
        return <File className="h-4 w-4 flex-shrink-0" />;
      }
    }
    
    // Regular URL attachments
    if (type === 'file') {
      return <Paperclip className="h-4 w-4 flex-shrink-0" />;
    } else {
      return <Link className="h-4 w-4 flex-shrink-0" />;
    }
  };
  
  return (
    <div className="space-y-2">
      <div className="font-medium">Attachments</div>
      <div className="space-y-2">
        {attachments.map(attachment => (
          <div key={attachment.id} className="flex items-center justify-between border rounded-md p-2 hover:bg-accent/30 transition-colors">
            <div className="flex items-center gap-2 max-w-[80%]">
              {getFileIcon(attachment.url, attachment.type)}
              <a 
                href={attachment.url} 
                target="_blank" 
                rel="noreferrer"
                className="text-sm text-blue-500 hover:underline overflow-hidden text-ellipsis whitespace-nowrap"
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
