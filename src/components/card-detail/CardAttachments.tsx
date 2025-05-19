import { Button } from "@/components/ui/button";
import { Attachment } from "@/types";
import {
  Link,
  Paperclip,
  File,
  FileImage,
  FileText,
  FileType,
  Trash2,
  Folder,
} from "lucide-react";

interface CardAttachmentsProps {
  attachments?: Attachment[];
  onDeleteAttachment: (attachmentId: string) => void;
}

export function CardAttachments({
  attachments,
  onDeleteAttachment,
}: CardAttachmentsProps) {
  if (!attachments || attachments.length === 0) return null;

  const getFileIcon = (url: string, type: string) => {
    if (type === "folder") {
      return <Folder className="h-4 w-4 flex-shrink-0 text-yellow-500" />;
    }
    // If it's a data URL from file upload
    if (url.startsWith("data:")) {
      if (url.startsWith("data:image/")) {
        return <FileImage className="h-4 w-4 flex-shrink-0" />;
      } else if (url.startsWith("data:application/pdf")) {
        return <FileType className="h-4 w-4 flex-shrink-0" />; // Changed from FilePdf to FileType
      } else if (url.startsWith("data:text/")) {
        return <FileText className="h-4 w-4 flex-shrink-0" />;
      } else {
        return <File className="h-4 w-4 flex-shrink-0" />;
      }
    }

    // Regular URL attachments
    if (type === "file") {
      return <Paperclip className="h-4 w-4 flex-shrink-0" />;
    } else {
      return <Link className="h-4 w-4 flex-shrink-0" />;
    }
  };

  return (
    <div className="space-y-2">
      <div className="font-medium">Attachments</div>
      <div className="space-y-2">
        {attachments.map((attachment) => (
          <div
            key={attachment.id}
            className="flex items-center justify-between border rounded-md p-2 hover:bg-accent/30 transition-colors"
          >
            <div className="flex items-center gap-2 w-[calc(100%-40px)]">
              {getFileIcon(attachment.url, attachment.type)}
              {attachment.type === "folder" ? (
                <div className="flex items-center gap-2 max-w-full">
                  <button
                    type="button"
                    className="text-sm text-blue-500 hover:underline truncate max-w-[180px] flex items-center gap-1"
                    title={attachment.name}
                    onClick={() => {
                      try {
                        const files = JSON.parse(attachment.url);
                        const html = `
                          <h2>Files in folder: ${attachment.name}</h2>
                          <ul style='font-family:monospace;font-size:14px;'>
                            ${files
                              .map(
                                (f: any) =>
                                  `<li>${f.path} (${f.size} bytes)</li>`
                              )
                              .join("")}
                          </ul>
                        `;
                        const win = window.open(
                          "",
                          "_blank",
                          "width=600,height=400"
                        );
                        if (win) {
                          win.document.write(
                            `<!DOCTYPE html><html><head><title>${attachment.name}</title></head><body>${html}</body></html>`
                          );
                          win.document.close();
                        }
                      } catch (err) {
                        alert("Could not open folder contents.");
                      }
                    }}
                  >
                    {attachment.name}{" "}
                    <span className="text-xs text-muted-foreground">
                      (folder)
                    </span>
                  </button>
                  {/* Download folder as ZIP */}
                  <button
                    type="button"
                    className="text-xs text-blue-500 hover:underline"
                    title="Download folder as ZIP"
                    onClick={async () => {
                      try {
                        const files = JSON.parse(attachment.url);
                        if (
                          !files ||
                          !Array.isArray(files) ||
                          files.length === 0
                        ) {
                          alert("No files to download.");
                          return;
                        }
                        // Dynamically import JSZip
                        const JSZip = (await import("jszip")).default;
                        const zip = new JSZip();
                        // Try to get file data if available (for now, only metadata is stored)
                        // We'll create empty files with correct names/structure
                        files.forEach((f: any) => {
                          zip.file(f.path, f.data ? f.data : "");
                        });
                        const blob = await zip.generateAsync({ type: "blob" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `${attachment.name || "folder"}.zip`;
                        document.body.appendChild(a);
                        a.click();
                        setTimeout(() => {
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }, 100);
                      } catch (err) {
                        alert("Failed to create ZIP for download.");
                      }
                    }}
                  >
                    Download ZIP
                  </button>
                </div>
              ) : (
                <a
                  href={attachment.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-500 hover:underline truncate max-w-full"
                  title={attachment.name}
                >
                  {attachment.name}
                </a>
              )}
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
