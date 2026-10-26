import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Pin,
  Megaphone,
  ArrowRight,
  ExternalLink,
} from 'lucide-react'
import { Card, CardTitle } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import apiClient from '@/services/apiClient'

export const AnnouncementsCard: React.FC = () => {
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    let isMounted = true

    const loadAnnouncements = async () => {
      try {
        const { data } = await apiClient.get('/announcements')
        const announcements = data?.announcements ?? []
        if (isMounted) setItems(announcements.slice(0, 4))
      } catch {
        if (isMounted) setItems([])
      }
    }

    loadAnnouncements()
    return () => {
      isMounted = false
    }
  }, [])

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'system':
        return <Badge variant="gold" size="sm">System</Badge>
      case 'promo':
        return <Badge variant="positive" size="sm">Promo</Badge>
      case 'security':
        return <Badge variant="neutral" size="sm">Security</Badge>
      case 'listing':
        return <Badge variant="outline" size="sm">Listing</Badge>
      default:
        return <Badge variant="neutral" size="sm">Notice</Badge>
    }
  }

  return (
    <Card variant="default" padding="none" className="overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-cp-border flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cp-gold/10 text-cp-gold">
            <Megaphone className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-base">Exchange Announcements</CardTitle>
            <p className="text-[11px] text-cp-text-muted">Platform updates & security dispatches</p>
          </div>
        </div>

        <Link to="/notifications" className="text-xs text-cp-gold font-semibold hover:underline flex items-center gap-1">
          <span>All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-cp-border/60">
        {items.length === 0 ? (
          <div className="p-4 text-xs text-cp-text-muted">No announcements available right now.</div>
        ) : (
          items.map((item) => {
            const category = String(item.type || 'system')
            const summary = String(item.content || item.summary || '')
            const date = String(item.validUntil || item.createdAt || item.date || 'Today')

            return (
              <div key={String(item.id)} className="p-4 hover:bg-cp-elevated/40 transition-colors group cursor-pointer">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {item.isPinned && (
                        <Pin className="w-3.5 h-3.5 text-cp-gold fill-cp-gold shrink-0 rotate-45" />
                      )}
                      {getCategoryBadge(category === 'maintenance' ? 'system' : category === 'security' ? 'security' : category === 'promo' ? 'promo' : category === 'listing' ? 'listing' : 'system')}
                      <span className="text-[11px] text-cp-text-muted">{date}</span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-cp-text-primary group-hover:text-cp-gold transition-colors leading-snug">
                      {item.title}
                    </h4>

                    <p className="text-xs text-cp-text-secondary leading-relaxed line-clamp-2">
                      {summary}
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="p-3 bg-cp-elevated/40 border-t border-cp-border text-center">
        <Link to="/support" className="text-xs text-cp-text-muted hover:text-cp-gold transition-colors inline-flex items-center gap-1.5">
          <span>Need help with an announcement? Visit Support Desk</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </Card>
  )
}

export default AnnouncementsCard
