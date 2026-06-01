import { useState, useRef } from 'react';
import { Upload, X, FileVideo, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';

interface UploadedFile {
  id: string;
  name: string;
  type: 'image' | 'video';
  size: number;
  preview: string;
}

export function MultimediaUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = {
    image: 10 * 1024 * 1024, // 10 MB
    video: 100 * 1024 * 1024, // 100 MB
  };

  const ALLOWED_TYPES = {
    image: ['image/jpeg', 'image/png'],
    video: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
  };

  const getFileType = (file: File): 'image' | 'video' | null => {
    if (ALLOWED_TYPES.image.includes(file.type)) return 'image';
    if (ALLOWED_TYPES.video.includes(file.type)) return 'video';
    return null;
  };

  const handleFileSelect = async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    setError(null);
    setUploading(true);

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileType = getFileType(file);

        // Validation
        if (!fileType) {
          setError(`${file.name} has unsupported format. Use JPG, PNG for images or MP4, MOV, AVI for videos.`);
          continue;
        }

        if (file.size > MAX_FILE_SIZE[fileType]) {
          setError(`${file.name} exceeds size limit. Max: ${fileType === 'image' ? '10MB' : '100MB'}`);
          continue;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = () => {
          const newFile: UploadedFile = {
            id: `${Date.now()}-${i}`,
            name: file.name,
            type: fileType,
            size: file.size,
            preview: reader.result as string,
          };

          setFiles((prev) => [...prev, newFile]);
        };

        reader.readAsDataURL(file);

        // Simulate upload delay
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } catch (err) {
      setError('Failed to upload files. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-primary', 'bg-primary/5');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('border-primary', 'bg-primary/5');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-primary', 'bg-primary/5');
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Multimedia Documentation</CardTitle>
        <CardDescription>Upload photos and videos of your work activities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition bg-muted/50"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
            disabled={uploading}
          />

          <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
          <p className="font-medium text-sm mb-1">Drag and drop your files here</p>
          <p className="text-xs text-muted-foreground mb-3">or click to browse</p>
          <Button variant="outline" size="sm" disabled={uploading}>
            {uploading ? (
              <>
                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              'Select Files'
            )}
          </Button>

          <div className="mt-4 text-xs text-muted-foreground space-y-1">
            <p>Supported: JPG, PNG (max 10MB) | MP4, MOV, AVI (max 100MB)</p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Uploaded Files Grid */}
        {files.length > 0 && (
          <div className="space-y-4">
            <div className="text-sm font-medium">Uploaded Files ({files.length})</div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {files.map((file) => (
                <div key={file.id} className="relative group">
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted border border-border">
                    {file.type === 'image' ? (
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={file.preview}
                        className="w-full h-full object-cover"
                      />
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition flex items-center justify-center">
                      {file.type === 'image' ? (
                        <ImageIcon className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition" />
                      ) : (
                        <FileVideo className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition" />
                      )}
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFile(file.id)}
                      className="absolute top-2 right-2 p-1 bg-red-500/80 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>
                  </div>

                  {/* File Info */}
                  <div className="mt-2">
                    <p className="text-xs font-medium truncate">{file.name}</p>
                    <p className="text-[10px] text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        {files.length > 0 && (
          <Button
            className="w-full bg-primary hover:bg-primary/90"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : `Upload ${files.length} File${files.length !== 1 ? 's' : ''}`}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
