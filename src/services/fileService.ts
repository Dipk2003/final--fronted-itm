import apiClient, { getErrorMessage } from '@/lib/enhanced-api-client';
import toast from 'react-hot-toast';

// File Management Types
export interface FileUpload {
  id: number;
  fileName: string;
  originalName: string;
  filePath: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  mimeType: string;
  uploadedBy: number;
  uploadedAt: string;
  isPublic: boolean;
  category?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface FileUploadProgress {
  fileId: string;
  fileName: string;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

export interface ImageUpload extends FileUpload {
  width?: number;
  height?: number;
  thumbnailUrl?: string;
  variants?: ImageVariant[];
}

export interface ImageVariant {
  size: 'thumbnail' | 'small' | 'medium' | 'large' | 'original';
  url: string;
  width: number;
  height: number;
}

export interface DocumentUpload extends FileUpload {
  pages?: number;
  previewUrl?: string;
  extractedText?: string;
  language?: string;
}

export interface VideoUpload extends FileUpload {
  duration?: number;
  thumbnailUrl?: string;
  previewUrl?: string;
  qualities?: VideoQuality[];
}

export interface VideoQuality {
  quality: '360p' | '480p' | '720p' | '1080p' | 'original';
  url: string;
  fileSize: number;
}

export interface AudioUpload extends FileUpload {
  duration?: number;
  bitrate?: number;
  sampleRate?: number;
  waveformUrl?: string;
}

export interface FileCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  allowedTypes: string[];
  maxSize: number;
  isActive: boolean;
}

export interface FileFilter {
  category?: string;
  fileType?: string;
  mimeType?: string;
  minSize?: number;
  maxSize?: number;
  uploadedBy?: number;
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
  isPublic?: boolean;
  search?: string;
}

export interface UploadOptions {
  category?: string;
  isPublic?: boolean;
  tags?: string[];
  metadata?: Record<string, any>;
  generateThumbnail?: boolean;
  generateVariants?: boolean;
  extractText?: boolean;
  processVideo?: boolean;
  onProgress?: (progress: FileUploadProgress) => void;
}

export interface BulkUploadResult {
  successful: FileUpload[];
  failed: { fileName: string; error: string }[];
  total: number;
  successCount: number;
  failCount: number;
}

export interface ExcelImportResult {
  success: boolean;
  message: string;
  importedCount: number;
  errorCount: number;
  errors: ExcelImportError[];
  data?: any[];
}

export interface ExcelImportError {
  row: number;
  field: string;
  value: any;
  error: string;
}

export interface ExcelExportOptions {
  filename?: string;
  sheetName?: string;
  headers?: string[];
  formatters?: Record<string, (value: any) => string>;
  includeMetadata?: boolean;
}

export interface FileStorageInfo {
  totalStorage: number;
  usedStorage: number;
  availableStorage: number;
  fileCount: number;
  storageByCategory: Record<string, number>;
  storageByType: Record<string, number>;
}

// File Management Service
class FileService {
  private uploadQueue = new Map<string, XMLHttpRequest>();
  private uploadListeners = new Map<string, Function[]>();

  // ===================
  // FILE UPLOAD
  // ===================

  async uploadFile(file: File, options?: UploadOptions): Promise<FileUpload> {
    const fileId = this.generateFileId();
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      if (options?.category) formData.append('category', options.category);
      if (options?.isPublic !== undefined) formData.append('isPublic', String(options.isPublic));
      if (options?.tags) formData.append('tags', JSON.stringify(options.tags));
      if (options?.metadata) formData.append('metadata', JSON.stringify(options.metadata));
      if (options?.generateThumbnail) formData.append('generateThumbnail', 'true');
      if (options?.generateVariants) formData.append('generateVariants', 'true');
      if (options?.extractText) formData.append('extractText', 'true');
      if (options?.processVideo) formData.append('processVideo', 'true');

      const response = await this.uploadWithProgress(formData, fileId, file.name, options?.onProgress);
      
      toast.success(`File uploaded successfully: ${file.name}`);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to upload file: ${message}`);
      throw error;
    }
  }

  async uploadMultipleFiles(files: File[], options?: UploadOptions): Promise<BulkUploadResult> {
    const results: BulkUploadResult = {
      successful: [],
      failed: [],
      total: files.length,
      successCount: 0,
      failCount: 0
    };

    const uploadPromises = files.map(async (file) => {
      try {
        const uploadedFile = await this.uploadFile(file, options);
        results.successful.push(uploadedFile);
        results.successCount++;
      } catch (error) {
        const message = getErrorMessage(error);
        results.failed.push({ fileName: file.name, error: message });
        results.failCount++;
      }
    });

    await Promise.all(uploadPromises);
    
    const message = `Uploaded ${results.successCount}/${results.total} files successfully`;
    if (results.successCount > 0) {
      toast.success(message);
    }
    if (results.failCount > 0) {
      toast.error(`${results.failCount} files failed to upload`);
    }

    return results;
  }

  private async uploadWithProgress(
    formData: FormData, 
    fileId: string, 
    fileName: string,
    onProgress?: (progress: FileUploadProgress) => void
  ): Promise<FileUpload> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      this.uploadQueue.set(fileId, xhr);

      // Progress tracking
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          const progressData: FileUploadProgress = {
            fileId,
            fileName,
            progress,
            status: 'uploading'
          };
          
          onProgress?.(progressData);
          this.emitUploadProgress(fileId, progressData);
        }
      });

      // Success handler
      xhr.addEventListener('load', () => {
        this.uploadQueue.delete(fileId);
        
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          const progressData: FileUploadProgress = {
            fileId,
            fileName,
            progress: 100,
            status: 'completed'
          };
          
          onProgress?.(progressData);
          this.emitUploadProgress(fileId, progressData);
          resolve(response.data);
        } else {
          const errorMsg = xhr.responseText || 'Upload failed';
          const progressData: FileUploadProgress = {
            fileId,
            fileName,
            progress: 0,
            status: 'error',
            error: errorMsg
          };
          
          onProgress?.(progressData);
          this.emitUploadProgress(fileId, progressData);
          reject(new Error(errorMsg));
        }
      });

      // Error handler
      xhr.addEventListener('error', () => {
        this.uploadQueue.delete(fileId);
        const progressData: FileUploadProgress = {
          fileId,
          fileName,
          progress: 0,
          status: 'error',
          error: 'Network error'
        };
        
        onProgress?.(progressData);
        this.emitUploadProgress(fileId, progressData);
        reject(new Error('Network error'));
      });

      // Abort handler
      xhr.addEventListener('abort', () => {
        this.uploadQueue.delete(fileId);
        const progressData: FileUploadProgress = {
          fileId,
          fileName,
          progress: 0,
          status: 'error',
          error: 'Upload cancelled'
        };
        
        onProgress?.(progressData);
        this.emitUploadProgress(fileId, progressData);
        reject(new Error('Upload cancelled'));
      });

      // Configure and send request
      xhr.open('POST', '/api/files/upload');
      
      // Add auth header if available
      const token = localStorage.getItem('authToken');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      
      xhr.send(formData);
    });
  }

  cancelUpload(fileId: string): void {
    const xhr = this.uploadQueue.get(fileId);
    if (xhr) {
      xhr.abort();
      toast('Upload cancelled', { icon: 'ℹ️' });
    }
  }

  // ===================
  // FILE MANAGEMENT
  // ===================

  async getFiles(filter?: FileFilter, page = 1, limit = 20): Promise<{
    files: FileUpload[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const params = { ...filter, page, limit };
      const url = apiClient.buildUrl('/api/files', params);
      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to fetch files: ${message}`);
      return {
        files: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0
      };
    }
  }

  async getFile(id: number): Promise<FileUpload> {
    try {
      const response = await apiClient.get<FileUpload>(`/api/files/${id}`);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to fetch file: ${message}`);
      throw error;
    }
  }

  async updateFile(id: number, updates: Partial<FileUpload>): Promise<FileUpload> {
    try {
      const response = await apiClient.put<FileUpload>(`/api/files/${id}`, updates);
      toast.success('File updated successfully');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to update file: ${message}`);
      throw error;
    }
  }

  async deleteFile(id: number): Promise<void> {
    try {
      await apiClient.delete(`/api/files/${id}`);
      toast.success('File deleted successfully');
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to delete file: ${message}`);
      throw error;
    }
  }

  async deleteFiles(ids: number[]): Promise<void> {
    try {
      await apiClient.post('/api/files/bulk-delete', { ids });
      toast.success(`${ids.length} file(s) deleted successfully`);
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to delete files: ${message}`);
      throw error;
    }
  }

  async downloadFile(id: number, filename?: string): Promise<Blob> {
    try {
      const response = await apiClient.get(`/api/files/${id}/download`, {
        responseType: 'blob'
      });
      
      // Trigger download
      const url = window.URL.createObjectURL(response);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `file_${id}`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      toast.success('File downloaded successfully');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to download file: ${message}`);
      throw error;
    }
  }

  // ===================
  // IMAGE PROCESSING
  // ===================

  async uploadImage(file: File, options?: UploadOptions & {
    generateThumbnail?: boolean;
    generateVariants?: boolean;
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  }): Promise<ImageUpload> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      if (options?.generateThumbnail) formData.append('generateThumbnail', 'true');
      if (options?.generateVariants) formData.append('generateVariants', 'true');
      if (options?.maxWidth) formData.append('maxWidth', String(options.maxWidth));
      if (options?.maxHeight) formData.append('maxHeight', String(options.maxHeight));
      if (options?.quality) formData.append('quality', String(options.quality));
      if (options?.category) formData.append('category', options.category);
      if (options?.isPublic !== undefined) formData.append('isPublic', String(options.isPublic));
      if (options?.tags) formData.append('tags', JSON.stringify(options.tags));
      if (options?.metadata) formData.append('metadata', JSON.stringify(options.metadata));

      const fileId = this.generateFileId();
      const response = await this.uploadWithProgress(formData, fileId, file.name, options?.onProgress);
      
      toast.success(`Image uploaded successfully: ${file.name}`);
      return response as ImageUpload;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to upload image: ${message}`);
      throw error;
    }
  }

  async resizeImage(imageId: number, width: number, height: number, quality = 80): Promise<ImageUpload> {
    try {
      const response = await apiClient.post<ImageUpload>(`/api/files/images/${imageId}/resize`, {
        width,
        height,
        quality
      });
      
      toast.success('Image resized successfully');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to resize image: ${message}`);
      throw error;
    }
  }

  async generateImageVariants(imageId: number): Promise<ImageUpload> {
    try {
      const response = await apiClient.post<ImageUpload>(`/api/files/images/${imageId}/variants`);
      toast.success('Image variants generated successfully');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to generate image variants: ${message}`);
      throw error;
    }
  }

  // ===================
  // DOCUMENT PROCESSING
  // ===================

  async uploadDocument(file: File, options?: UploadOptions & {
    extractText?: boolean;
    generatePreview?: boolean;
    language?: string;
  }): Promise<DocumentUpload> {
    try {
      const formData = new FormData();
      formData.append('document', file);
      
      if (options?.extractText) formData.append('extractText', 'true');
      if (options?.generatePreview) formData.append('generatePreview', 'true');
      if (options?.language) formData.append('language', options.language);
      if (options?.category) formData.append('category', options.category);
      if (options?.isPublic !== undefined) formData.append('isPublic', String(options.isPublic));
      if (options?.tags) formData.append('tags', JSON.stringify(options.tags));
      if (options?.metadata) formData.append('metadata', JSON.stringify(options.metadata));

      const fileId = this.generateFileId();
      const response = await this.uploadWithProgress(formData, fileId, file.name, options?.onProgress);
      
      toast.success(`Document uploaded successfully: ${file.name}`);
      return response as DocumentUpload;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to upload document: ${message}`);
      throw error;
    }
  }

  async extractTextFromDocument(documentId: number, language = 'en'): Promise<string> {
    try {
      const response = await apiClient.post(`/api/files/documents/${documentId}/extract-text`, {
        language
      });
      
      toast.success('Text extracted successfully');
      return response.text;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to extract text: ${message}`);
      throw error;
    }
  }

  // ===================
  // VIDEO PROCESSING
  // ===================

  async uploadVideo(file: File, options?: UploadOptions & {
    generateThumbnail?: boolean;
    generateQualities?: boolean;
    thumbnailTime?: number;
  }): Promise<VideoUpload> {
    try {
      const formData = new FormData();
      formData.append('video', file);
      
      if (options?.generateThumbnail) formData.append('generateThumbnail', 'true');
      if (options?.generateQualities) formData.append('generateQualities', 'true');
      if (options?.thumbnailTime) formData.append('thumbnailTime', String(options.thumbnailTime));
      if (options?.category) formData.append('category', options.category);
      if (options?.isPublic !== undefined) formData.append('isPublic', String(options.isPublic));
      if (options?.tags) formData.append('tags', JSON.stringify(options.tags));
      if (options?.metadata) formData.append('metadata', JSON.stringify(options.metadata));

      const fileId = this.generateFileId();
      const response = await this.uploadWithProgress(formData, fileId, file.name, options?.onProgress);
      
      toast.success(`Video uploaded successfully: ${file.name}`);
      return response as VideoUpload;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to upload video: ${message}`);
      throw error;
    }
  }

  async generateVideoThumbnail(videoId: number, timeInSeconds = 5): Promise<VideoUpload> {
    try {
      const response = await apiClient.post<VideoUpload>(`/api/files/videos/${videoId}/thumbnail`, {
        time: timeInSeconds
      });
      
      toast.success('Video thumbnail generated successfully');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to generate video thumbnail: ${message}`);
      throw error;
    }
  }

  // ===================
  // EXCEL IMPORT/EXPORT
  // ===================

  async importFromExcel(file: File, options: {
    sheetName?: string;
    headerRow?: number;
    mapping?: Record<string, string>;
    validationRules?: Record<string, any>;
    batchSize?: number;
    onProgress?: (progress: number) => void;
  }): Promise<ExcelImportResult> {
    try {
      const formData = new FormData();
      formData.append('excel', file);
      
      if (options.sheetName) formData.append('sheetName', options.sheetName);
      if (options.headerRow) formData.append('headerRow', String(options.headerRow));
      if (options.mapping) formData.append('mapping', JSON.stringify(options.mapping));
      if (options.validationRules) formData.append('validationRules', JSON.stringify(options.validationRules));
      if (options.batchSize) formData.append('batchSize', String(options.batchSize));

      const response = await apiClient.post<ExcelImportResult>('/api/files/excel/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            options.onProgress?.(progress);
          }
        }
      });
      
      if (response.success) {
        toast.success(`Successfully imported ${response.importedCount} records`);
      } else {
        toast.error(`Import failed: ${response.message}`);
      }
      
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to import Excel file: ${message}`);
      throw error;
    }
  }

  async exportToExcel(data: any[], options?: ExcelExportOptions): Promise<Blob> {
    try {
      const response = await apiClient.post('/api/files/excel/export', {
        data,
        ...options
      }, {
        responseType: 'blob'
      });
      
      // Trigger download
      const filename = options?.filename || `export_${new Date().toISOString().split('T')[0]}.xlsx`;
      const url = window.URL.createObjectURL(response);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(url);
      
      toast.success('Excel file exported successfully');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to export Excel file: ${message}`);
      throw error;
    }
  }

  async exportQueryToExcel(endpoint: string, params?: any, options?: ExcelExportOptions): Promise<Blob> {
    try {
      const response = await apiClient.post('/api/files/excel/export-query', {
        endpoint,
        params,
        ...options
      }, {
        responseType: 'blob'
      });
      
      const filename = options?.filename || `export_${new Date().toISOString().split('T')[0]}.xlsx`;
      const url = window.URL.createObjectURL(response);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(url);
      
      toast.success('Excel report exported successfully');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to export Excel report: ${message}`);
      throw error;
    }
  }

  // ===================
  // FILE CATEGORIES
  // ===================

  async getFileCategories(): Promise<FileCategory[]> {
    try {
      const response = await apiClient.get<FileCategory[]>('/api/files/categories');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to fetch file categories: ${message}`);
      return [];
    }
  }

  async createFileCategory(category: Omit<FileCategory, 'id'>): Promise<FileCategory> {
    try {
      const response = await apiClient.post<FileCategory>('/api/files/categories', category);
      toast.success('File category created successfully');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to create file category: ${message}`);
      throw error;
    }
  }

  async updateFileCategory(id: number, updates: Partial<FileCategory>): Promise<FileCategory> {
    try {
      const response = await apiClient.put<FileCategory>(`/api/files/categories/${id}`, updates);
      toast.success('File category updated successfully');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to update file category: ${message}`);
      throw error;
    }
  }

  async deleteFileCategory(id: number): Promise<void> {
    try {
      await apiClient.delete(`/api/files/categories/${id}`);
      toast.success('File category deleted successfully');
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to delete file category: ${message}`);
      throw error;
    }
  }

  // ===================
  // STORAGE MANAGEMENT
  // ===================

  async getStorageInfo(): Promise<FileStorageInfo> {
    try {
      const response = await apiClient.get<FileStorageInfo>('/api/files/storage');
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to fetch storage info: ${message}`);
      return {
        totalStorage: 0,
        usedStorage: 0,
        availableStorage: 0,
        fileCount: 0,
        storageByCategory: {},
        storageByType: {}
      };
    }
  }

  async cleanupUnusedFiles(): Promise<{ deletedCount: number; freedSpace: number }> {
    try {
      const response = await apiClient.post('/api/files/cleanup');
      toast.success(`Cleaned up ${response.deletedCount} unused files, freed ${this.formatFileSize(response.freedSpace)}`);
      return response;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to cleanup files: ${message}`);
      throw error;
    }
  }

  // ===================
  // UTILITY METHODS
  // ===================

  generateFileId(): string {
    return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getFileIcon(fileType: string): string {
    const icons: Record<string, string> = {
      'image': '🖼️',
      'video': '🎥',
      'audio': '🎵',
      'pdf': '📄',
      'document': '📝',
      'spreadsheet': '📊',
      'presentation': '📽️',
      'archive': '🗜️',
      'code': '💻',
      'text': '📄'
    };
    
    const category = this.getFileCategory(fileType);
    return icons[category] || '📎';
  }

  getFileCategory(mimeType: string): string {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType === 'application/pdf') return 'pdf';
    if (mimeType.includes('document') || mimeType.includes('word')) return 'document';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'spreadsheet';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'presentation';
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('archive')) return 'archive';
    if (mimeType.startsWith('text/') || mimeType.includes('javascript') || mimeType.includes('json')) return 'code';
    return 'document';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  isValidFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.some(type => {
      if (type.includes('*')) {
        const baseType = type.split('/')[0];
        return file.type.startsWith(baseType + '/');
      }
      return file.type === type;
    });
  }

  isValidFileSize(file: File, maxSize: number): boolean {
    return file.size <= maxSize;
  }

  validateFile(file: File, category?: FileCategory): { isValid: boolean; error?: string } {
    if (!category) return { isValid: true };
    
    if (!this.isValidFileType(file, category.allowedTypes)) {
      return {
        isValid: false,
        error: `File type ${file.type} is not allowed for category ${category.name}`
      };
    }
    
    if (!this.isValidFileSize(file, category.maxSize)) {
      return {
        isValid: false,
        error: `File size ${this.formatFileSize(file.size)} exceeds maximum allowed size ${this.formatFileSize(category.maxSize)}`
      };
    }
    
    return { isValid: true };
  }

  // ===================
  // EVENT LISTENERS
  // ===================

  onUploadProgress(fileId: string, callback: (progress: FileUploadProgress) => void): void {
    if (!this.uploadListeners.has(fileId)) {
      this.uploadListeners.set(fileId, []);
    }
    this.uploadListeners.get(fileId)!.push(callback);
  }

  offUploadProgress(fileId: string, callback: (progress: FileUploadProgress) => void): void {
    const listeners = this.uploadListeners.get(fileId);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emitUploadProgress(fileId: string, progress: FileUploadProgress): void {
    const listeners = this.uploadListeners.get(fileId);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(progress);
        } catch (error) {
          console.error(`Error in upload progress listener for ${fileId}:`, error);
        }
      });
    }
  }

  // ===================
  // DRAG & DROP HELPERS
  // ===================

  setupDragAndDrop(element: HTMLElement, options: {
    onFiles: (files: File[]) => void;
    onError?: (error: string) => void;
    allowedTypes?: string[];
    maxFileSize?: number;
    maxFiles?: number;
  }): () => void {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      element.classList.add('drag-over');
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      element.classList.remove('drag-over');
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      element.classList.remove('drag-over');

      const files = Array.from(e.dataTransfer?.files || []);
      
      // Validate file count
      if (options.maxFiles && files.length > options.maxFiles) {
        options.onError?.(`Maximum ${options.maxFiles} files allowed`);
        return;
      }

      // Validate files
      const validFiles: File[] = [];
      const errors: string[] = [];

      files.forEach(file => {
        // Check file type
        if (options.allowedTypes && !this.isValidFileType(file, options.allowedTypes)) {
          errors.push(`${file.name}: Invalid file type`);
          return;
        }

        // Check file size
        if (options.maxFileSize && !this.isValidFileSize(file, options.maxFileSize)) {
          errors.push(`${file.name}: File size too large`);
          return;
        }

        validFiles.push(file);
      });

      if (errors.length > 0) {
        options.onError?.(errors.join(', '));
      }

      if (validFiles.length > 0) {
        options.onFiles(validFiles);
      }
    };

    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('dragleave', handleDragLeave);
    element.addEventListener('drop', handleDrop);

    // Return cleanup function
    return () => {
      element.removeEventListener('dragover', handleDragOver);
      element.removeEventListener('dragleave', handleDragLeave);
      element.removeEventListener('drop', handleDrop);
    };
  }
}

// Export singleton instance
export const fileService = new FileService();
export default fileService;