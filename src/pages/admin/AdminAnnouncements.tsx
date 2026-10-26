import React, { useState, useEffect } from 'react'
import {
  Megaphone,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  X,
  Sparkles,
  ShieldAlert,
  Info,
} from 'lucide-react'
import { Card, CardContent } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { AdminAnnouncement } from '@/mock/adminData'
import { adminService } from '@/services'

export const AdminAnnouncements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<AdminAnnouncement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  // Create / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [type, setType] = useState<AdminAnnouncement['type']>('maintenance')
  const [targetAudience, setTargetAudience] = useState<AdminAnnouncement['targetAudience']>('All Users')
  const [status, setStatus] = useState<AdminAnnouncement['status']>('active')
  const [validUntil, setValidUntil] = useState('2026-11-01 00:00')
  const [formError, setFormError] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const handleOpenCreate = () => {
    setEditingId(null)
    setTitle('')
    setContent('')
    setType('maintenance')
    setTargetAudience('All Users')
    setStatus('active')
    setValidUntil('2026-11-01 00:00')
    setFormError(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (a: AdminAnnouncement) => {
    setEditingId(a.id)
    setTitle(a.title)
    setContent(a.content)
    setType(a.type)
    setTargetAudience(a.targetAudience)
    setStatus(a.status)
    setValidUntil(a.validUntil)
    setFormError(null)
    setIsModalOpen(true)
  }

  useEffect(() => {
    let isMounted = true
    const loadAnnouncements = async () => {
      try {
        setIsLoading(true)
        setLoadError(null)
        const liveAnnouncements = await adminService.getAnnouncements()
        if (isMounted) setAnnouncements(liveAnnouncements)
      } catch (error: any) {
        if (isMounted) {
          setLoadError(error?.response?.data?.message || 'Unable to load announcements from the backend.')
          setAnnouncements([])
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadAnnouncements()
    return () => {
      isMounted = false
    }
  }, [])

  const handleDelete = async (id: string, aTitle: string) => {
    try {
      await adminService.deleteAnnouncement(id)
      setAnnouncements((prev) => prev.filter((a) => a.id !== id))
      setToastMessage(`Announcement "${aTitle}" removed from the live platform feed.`)
    } catch (error: any) {
      setToastMessage(error?.response?.data?.message || 'Unable to delete announcement from the backend.')
    }
    setTimeout(() => setToastMessage(null), 3500)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      setFormError('Title and announcement content are required.')
      return
    }

    if (editingId) {
      setAnnouncements((prev) =>
        prev.map((a) =>
          a.id === editingId
            ? { ...a, title: title.trim(), content: content.trim(), type, targetAudience, status, validUntil }
            : a
        )
      )
      setToastMessage(`Announcement "${title.trim()}" updated in the active view. Backend editing is not yet exposed in this API.`)
    } else {
      try {
        const response = await adminService.createAnnouncement({
          title: title.trim(),
          content: content.trim(),
          type,
          targetAudience,
          validUntil,
        })
        const newAnn: AdminAnnouncement = {
          id: String(response.announcement?.id ?? `anc-${Date.now()}`),
          title: title.trim(),
          content: content.trim(),
          type,
          targetAudience,
          status,
          createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          validUntil,
        }
        setAnnouncements((prev) => [newAnn, ...prev])
        setToastMessage(response?.message || `New announcement published to the live banner.`)
      } catch (error: any) {
        setFormError(error?.response?.data?.message || 'Unable to publish the announcement to the backend.')
        return
      }
    }

    setTimeout(() => setToastMessage(null), 3500)
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-cp-text-primary tracking-tight">
            Platform Broadcasts & Announcements
          </h1>
          <p className="text-xs text-cp-text-muted mt-0.5">
            Publish maintenance windows, security advisories, and feature releases to the demonstration header
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={handleOpenCreate}>
          <Plus className="w-4 h-4 mr-1.5" />
          Create Announcement
        </Button>
      </div>

      {loadError && (
        <div className="p-3 rounded-xl bg-cp-negative/10 border border-cp-negative/30 text-xs text-cp-negative">
          {loadError}
        </div>
      )}

      {isLoading && (
        <div className="p-4 rounded-xl border border-cp-border bg-cp-card text-xs text-cp-text-muted">
          Loading platform announcements from the live API...
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 rounded-xl bg-cp-positive/15 border border-cp-positive/30 text-xs text-cp-positive flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button type="button" onClick={() => setToastMessage(null)} className="p-1 hover:text-cp-text-primary">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Announcements List */}
      <div className="grid grid-cols-1 gap-4">
        {announcements.map((ann) => (
          <Card key={ann.id} className="bg-[#0c121c] border-cp-border hover:border-cp-border-light transition-all">
            <CardContent className="p-5 sm:p-6 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant={ann.type === 'maintenance' ? 'gold' : ann.type === 'security' ? 'negative' : 'positive'}
                    size="sm"
                    className="capitalize"
                  >
                    {ann.type}
                  </Badge>

                  <Badge variant="neutral" size="sm">
                    Audience: {ann.targetAudience}
                  </Badge>

                  <Badge variant={ann.status === 'active' ? 'positive' : 'neutral'} size="sm" className="capitalize">
                    {ann.status}
                  </Badge>

                  <span className="text-xs text-cp-text-muted font-mono flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-cp-gold" />
                    Valid Until: {ann.validUntil}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(ann)}
                    className="p-1.5 rounded-lg bg-cp-elevated hover:bg-cp-card text-cp-text-secondary hover:text-cp-gold border border-cp-border transition-colors"
                    title="Edit announcement"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(ann.id, ann.title)}
                    className="p-1.5 rounded-lg bg-cp-negative/15 hover:bg-cp-negative/25 text-cp-negative border border-cp-negative/30 transition-colors"
                    title="Delete announcement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-bold text-cp-text-primary">{ann.title}</h3>
              <p className="text-xs text-cp-text-secondary leading-relaxed bg-cp-elevated/40 p-3 rounded-lg border border-cp-border">
                {ann.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CREATE / EDIT ANNOUNCEMENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-[#0c121c] border border-cp-border rounded-2xl shadow-2xl p-6 z-10 animate-fadeIn space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-cp-border pb-3">
              <div>
                <h3 className="text-base font-bold text-cp-text-primary">
                  {editingId ? 'Edit Platform Announcement' : 'Publish New Announcement'}
                </h3>
                <span className="text-xs text-cp-text-muted">Broadcast to demonstration customer banners</span>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-cp-text-muted hover:text-cp-text-primary hover:bg-cp-elevated"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-cp-negative/10 border border-cp-negative/30 text-xs text-cp-negative flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-cp-text-secondary block mb-1">
                  Announcement Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Scheduled Matching Engine V3 Optimization"
                  className="w-full bg-[#141d2b] border border-cp-border rounded-xl p-2.5 text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-cp-text-secondary block mb-1">Category Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-[#141d2b] border border-cp-border rounded-xl p-2.5 text-xs text-cp-text-primary focus:outline-none"
                  >
                    <option value="maintenance">Maintenance</option>
                    <option value="feature">Feature</option>
                    <option value="security">Security</option>
                    <option value="advisory">Advisory</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-cp-text-secondary block mb-1">Target Audience</label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value as any)}
                    className="w-full bg-[#141d2b] border border-cp-border rounded-xl p-2.5 text-xs text-cp-text-primary focus:outline-none"
                  >
                    <option value="All Users">All Users</option>
                    <option value="Verified Only">Verified Only</option>
                    <option value="VIP Traders">VIP Traders</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-cp-text-secondary block mb-1">
                  Announcement Body *
                </label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Full announcement description displayed in user notifications and status banner..."
                  className="w-full bg-[#141d2b] border border-cp-border rounded-xl p-2.5 text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-cp-text-secondary block mb-1">Broadcast Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-[#141d2b] border border-cp-border rounded-xl p-2.5 text-xs text-cp-text-primary focus:outline-none"
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="draft">Draft (Hidden)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-cp-text-secondary block mb-1">Valid Until</label>
                  <input
                    type="text"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    placeholder="2026-11-01 00:00"
                    className="w-full bg-[#141d2b] border border-cp-border rounded-xl p-2.5 text-xs text-cp-text-primary focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="space-y-1.5 pt-2 border-t border-cp-border/60">
                <span className="text-[10px] font-bold text-cp-gold uppercase tracking-wider">
                  Live Preview Preview:
                </span>
                <div className="p-3 rounded-xl bg-cp-elevated border border-cp-border space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="gold" size="sm" className="capitalize">
                      {type}
                    </Badge>
                    <span className="font-bold text-cp-text-primary truncate">{title || 'Sample Title'}</span>
                  </div>
                  <p className="text-[11px] text-cp-text-muted line-clamp-2">
                    {content || 'Announcement body snippet will appear here.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-cp-border">
                <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  {editingId ? 'Save Changes' : 'Publish Announcement'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminAnnouncements
