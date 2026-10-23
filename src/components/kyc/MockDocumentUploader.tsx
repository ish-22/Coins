import React, { useState } from 'react'
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  FileCheck,
  Eye,
  AlertCircle,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/common/Badge'
import { UploadedMockDoc } from '@/mock/kycData'

export interface MockDocumentUploaderProps {
  label: string
  description?: string
  acceptTypes?: string
  file: UploadedMockDoc | null
  sampleFilename: string
  sampleFileSize?: string
  sampleFileType?: 'image/jpeg' | 'application/pdf' | 'image/png'
  onUpload: (doc: UploadedMockDoc) => void
  onRemove: () => void
}

export const MockDocumentUploader: React.FC<MockDocumentUploaderProps> = ({
  label,
  description,
  file,
  sampleFilename,
  sampleFileSize = '1.8 MB',
  sampleFileType = 'image/jpeg',
  onUpload,
  onRemove,
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showPreviewModal, setShowPreviewModal] = useState(false)

  // Simulate file selection & simulated upload progress
  const handleSimulateUpload = (customName?: string) => {
    setIsUploading(true)
    setUploadProgress(15)

    const timer1 = setTimeout(() => setUploadProgress(65), 250)
    const timer2 = setTimeout(() => {
      setUploadProgress(100)
      setIsUploading(false)
      onUpload({
        id: `mock-doc-${Date.now().toString().slice(-4)}`,
        name: customName || sampleFilename,
        size: sampleFileSize,
        type: sampleFileType,
        uploadedAt: 'Just now',
      })
    }, 600)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }

  // Handle actual file picker input (demonstration only, reads metadata without uploading)
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0]
      const sizeMb = (selected.size / (1024 * 1024)).toFixed(1) + ' MB'
      handleSimulateUpload(selected.name)
    }
  }

  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <label className="font-semibold text-cp-text-primary block">{label}</label>
        {file && (
          <Badge variant="positive" size="sm" withDot>
            Attached
          </Badge>
        )}
      </div>

      {description && (
        <p className="text-[11px] text-cp-text-secondary">{description}</p>
      )}

      {/* Uploading Progress Simulation */}
      {isUploading ? (
        <div className="p-5 rounded-xl border border-cp-gold/40 bg-cp-card space-y-2 text-center animate-in fade-in">
          <div className="flex items-center justify-between text-[11px] text-cp-text-secondary">
            <span className="flex items-center gap-1.5 text-cp-gold font-medium">
              <UploadCloud className="w-4 h-4 animate-bounce" />
              Simulating document upload...
            </span>
            <span className="font-mono">{uploadProgress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-cp-elevated overflow-hidden">
            <div
              className="h-full bg-cp-gold transition-all duration-200 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      ) : file ? (
        /* Uploaded Mock File Card */
        <div className="p-3.5 rounded-xl bg-cp-elevated border border-cp-border flex items-center justify-between gap-3 group hover:border-cp-gold/40 transition-colors">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-cp-card border border-cp-border flex items-center justify-center text-cp-gold shrink-0">
              {file.type.includes('pdf') ? (
                <FileText className="w-5 h-5 text-red-400" />
              ) : (
                <ImageIcon className="w-5 h-5 text-cp-positive" />
              )}
            </div>
            <div className="overflow-hidden">
              <span className="font-semibold text-cp-text-primary block truncate font-mono text-xs">
                {file.name}
              </span>
              <div className="flex items-center gap-2 text-[11px] text-cp-text-secondary font-mono mt-0.5">
                <span>{file.size}</span>
                <span>•</span>
                <span className="text-cp-positive flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3" /> Ready
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setShowPreviewModal(true)}
              className="p-1.5 rounded-lg text-cp-text-secondary hover:text-cp-gold hover:bg-cp-card transition-colors"
              title="Inspect preview"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="p-1.5 rounded-lg text-cp-text-secondary hover:text-cp-negative hover:bg-cp-card transition-colors"
              title="Remove document"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Empty Upload Zone */
        <div className="p-5 rounded-xl border border-dashed border-cp-border hover:border-cp-gold/60 bg-cp-card/50 hover:bg-cp-elevated/40 transition-all text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-cp-elevated border border-cp-border flex items-center justify-center mx-auto text-cp-text-secondary">
            <UploadCloud className="w-5 h-5 text-cp-gold" />
          </div>

          <div>
            <span className="text-xs font-semibold text-cp-text-primary block">
              Drag and drop your document, or browse
            </span>
            <span className="text-[11px] text-cp-text-secondary block mt-0.5">
              Supports PDF, JPG, PNG (Max 10MB). High-resolution scan or photo.
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <span className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-cp-elevated border border-cp-border hover:border-cp-gold text-cp-text-primary transition-colors">
                Browse Files
              </span>
            </label>

            <button
              type="button"
              onClick={() => handleSimulateUpload()}
              className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-cp-gold/10 border border-cp-gold/40 text-cp-gold hover:bg-cp-gold/20 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              Use Demo Sample
            </button>
          </div>
        </div>
      )}

      {/* Sample Preview Modal */}
      {showPreviewModal && file && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-cp-elevated border border-cp-border p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-cp-border pb-3">
              <span className="font-bold text-cp-text-primary text-sm font-mono truncate">
                {file.name}
              </span>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-cp-text-secondary hover:text-cp-text-primary text-xs"
              >
                ✕ Close
              </button>
            </div>

            <div className="h-48 rounded-xl bg-cp-card border border-cp-border flex flex-col items-center justify-center p-4 text-center space-y-2">
              <FileCheck className="w-12 h-12 text-cp-positive" />
              <span className="text-xs font-semibold text-cp-text-primary">
                Simulated Document Preview
              </span>
              <p className="text-[11px] text-cp-text-secondary max-w-xs">
                {file.name} ({file.size}) has been validated with correct simulated resolution and clear readability.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="secondary" size="sm" onClick={() => setShowPreviewModal(false)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
