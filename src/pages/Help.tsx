import React, { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Search,
  X,
  HelpCircle,
  BookOpen,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  User,
  Wallet,
  TrendingUp,
  ArrowDownToLine,
  ArrowUpFromLine,
  Lock,
  Rocket,
  Check,
  Share2,
} from 'lucide-react'
import { Card, CardContent } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Typography } from '@/components/common/Typography'
import {
  HelpCategoryId,
  HelpCategory,
  HelpArticle,
  HELP_CATEGORIES,
  POPULAR_HELP_QUERIES,
  HELP_ARTICLES,
} from '@/mock/helpData'

// Icon mapping helper for categories
const CategoryIcon: React.FC<{ name: string; className?: string }> = ({ name, className = 'w-5 h-5' }) => {
  switch (name) {
    case 'Rocket':
      return <Rocket className={className} />
    case 'User':
      return <User className={className} />
    case 'TrendingUp':
      return <TrendingUp className={className} />
    case 'Wallet':
      return <Wallet className={className} />
    case 'ArrowDownToLine':
      return <ArrowDownToLine className={className} />
    case 'ArrowUpFromLine':
      return <ArrowUpFromLine className={className} />
    case 'ShieldCheck':
      return <ShieldCheck className={className} />
    case 'Lock':
      return <Lock className={className} />
    default:
      return <HelpCircle className={className} />
  }
}

export const Help: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  // State initialization from URL query params
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [selectedCategory, setSelectedCategory] = useState<HelpCategoryId | 'all'>(
    (searchParams.get('category') as HelpCategoryId) || 'all'
  )
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(
    searchParams.get('article') || null
  )

  // Expandable state for FAQ list mode
  const [expandedFaqIds, setExpandedFaqIds] = useState<Set<string>>(new Set())

  // Mock feedback votes state: { [articleId]: 'helpful' | 'unhelpful' }
  const [userVotes, setUserVotes] = useState<Record<string, 'helpful' | 'unhelpful'>>({})
  const [copiedLink, setCopiedLink] = useState(false)

  // Sync state changes with URL query parameters for shareability
  useEffect(() => {
    const params: Record<string, string> = {}
    if (searchQuery.trim()) params.q = searchQuery.trim()
    if (selectedCategory !== 'all') params.category = selectedCategory
    if (selectedArticleId) params.article = selectedArticleId
    setSearchParams(params, { replace: true })
  }, [searchQuery, selectedCategory, selectedArticleId, setSearchParams])

  // Look up selected article details
  const activeArticle = useMemo(() => {
    if (!selectedArticleId) return null
    return HELP_ARTICLES.find((a) => a.id === selectedArticleId) || null
  }, [selectedArticleId])

  // Look up category meta
  const activeCategoryMeta = useMemo(() => {
    if (!activeArticle) return null
    return HELP_CATEGORIES.find((c) => c.id === activeArticle.categoryId) || null
  }, [activeArticle])

  // Related articles lookup
  const relatedArticles = useMemo(() => {
    if (!activeArticle) return []
    return HELP_ARTICLES.filter((a) => activeArticle.relatedArticleIds.includes(a.id))
  }, [activeArticle])

  // Filtered articles for list/search view
  const filteredArticles = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return HELP_ARTICLES.filter((article) => {
      // Category match
      if (selectedCategory !== 'all' && article.categoryId !== selectedCategory) {
        return false
      }
      // Query match across title, summary, content paragraphs, and key steps
      if (!q) return true

      const inTitle = article.title.toLowerCase().includes(q)
      const inSummary = article.summary.toLowerCase().includes(q)
      const inContent = article.content.some((paragraph) => paragraph.toLowerCase().includes(q))
      const inSteps = article.keySteps
        ? article.keySteps.some((step) => step.toLowerCase().includes(q))
        : false

      return inTitle || inSummary || inContent || inSteps
    })
  }, [searchQuery, selectedCategory])

  // Toggle FAQ accordion expansion
  const toggleFaq = (id: string) => {
    setExpandedFaqIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  // Handle article feedback
  const handleVote = (articleId: string, vote: 'helpful' | 'unhelpful') => {
    setUserVotes((prev) => ({
      ...prev,
      [articleId]: vote,
    }))
  }

  // Handle article selection
  const handleSelectArticle = (articleId: string) => {
    setSelectedArticleId(articleId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Back to FAQ/List view
  const handleBackToList = () => {
    setSelectedArticleId(null)
  }

  // Copy article link
  const handleCopyLink = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2500)
    }
  }

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setSelectedArticleId(null)
  }

  return (
    <div className="space-y-10 pb-16">
      {/* 1. HERO HEADER WITH PROMINENT SEARCH */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-cp-card via-cp-card/90 to-cp-base border border-cp-border p-6 sm:p-10 text-center shadow-xl">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-cp-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cp-gold/10 border border-cp-gold/20 text-cp-gold text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CoinPlus Self-Service Knowledge Base</span>
          </div>

          <Typography variant="h1" className="text-3xl sm:text-4xl lg:text-5xl font-black text-cp-text-primary tracking-tight">
            CoinPlus Help Centre
          </Typography>

          <Typography variant="body" className="text-cp-text-secondary text-sm sm:text-base max-w-2xl mx-auto">
            Find answers, technical documentation, and step-by-step guides for spot trading, deposit confirmation, 
            wallet security, and institutional identity verification.
          </Typography>

          {/* Prominent Search Bar */}
          <div className="pt-4 max-w-2xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-cp-text-muted pointer-events-none" />
              <input
                type="text"
                placeholder="Search FAQs, trading rules, deposit memos, 2FA, or KYC guides..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  if (selectedArticleId) setSelectedArticleId(null) // return to search results
                }}
                className="w-full pl-12 pr-12 py-3.5 text-sm sm:text-base bg-cp-elevated/80 hover:bg-cp-elevated focus:bg-cp-base text-cp-text-primary placeholder:text-cp-text-muted rounded-xl border border-cp-border focus:border-cp-gold focus:outline-none transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 p-1 rounded-lg text-cp-text-muted hover:text-cp-text-primary hover:bg-cp-elevated transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Popular Topics Quick Chips */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-cp-text-muted flex items-center gap-1 font-medium">
                <Sparkles className="w-3 h-3 text-cp-gold" /> Popular:
              </span>
              {POPULAR_HELP_QUERIES.map((query) => (
                <button
                  key={query}
                  type="button"
                  onClick={() => {
                    setSearchQuery(query)
                    setSelectedCategory('all')
                    setSelectedArticleId(null)
                  }}
                  className={`px-3 py-1 rounded-lg border text-xs transition-all ${
                    searchQuery === query
                      ? 'bg-cp-gold/20 text-cp-gold border-cp-gold/40'
                      : 'bg-cp-card hover:bg-cp-elevated text-cp-text-secondary hover:text-cp-text-primary border-cp-border'
                  }`}
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. ARTICLE DETAIL VIEW (IF AN ARTICLE IS SELECTED) */}
      {activeArticle ? (
        <section className="space-y-6 animate-fadeIn">
          {/* Breadcrumbs Navigation */}
          <nav className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-cp-text-muted">
            <button
              type="button"
              onClick={handleBackToList}
              className="inline-flex items-center gap-1 text-cp-text-secondary hover:text-cp-gold transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Help Centre
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-cp-text-muted/60" />
            <button
              type="button"
              onClick={() => {
                setSelectedCategory(activeArticle.categoryId)
                setSelectedArticleId(null)
              }}
              className="hover:text-cp-gold transition-colors text-cp-text-secondary"
            >
              {activeCategoryMeta?.title || 'Category'}
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-cp-text-muted/60" />
            <span className="text-cp-gold font-medium truncate max-w-xs sm:max-w-md">
              {activeArticle.title}
            </span>
          </nav>

          {/* Main Article Card */}
          <Card className="bg-cp-card border-cp-border overflow-hidden">
            <CardContent className="p-6 sm:p-10 space-y-8">
              {/* Header meta */}
              <div className="space-y-4 border-b border-cp-border pb-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="gold" size="sm">
                      {activeCategoryMeta?.title}
                    </Badge>
                    <span className="flex items-center gap-1 text-xs text-cp-text-muted">
                      <Clock className="w-3.5 h-3.5" />
                      {activeArticle.readTime}
                    </span>
                    <span className="text-xs text-cp-text-muted">• Updated {activeArticle.lastUpdated}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cp-elevated hover:bg-cp-border text-cp-text-secondary hover:text-cp-text-primary text-xs font-medium transition-colors"
                      title="Copy link to article"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-cp-positive" />
                          <span className="text-cp-positive">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Share Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <Typography variant="h2" className="text-2xl sm:text-3xl font-bold text-cp-text-primary">
                  {activeArticle.title}
                </Typography>

                <p className="text-base text-cp-text-secondary font-medium leading-relaxed bg-cp-elevated/40 p-4 rounded-xl border-l-4 border-cp-gold">
                  {activeArticle.summary}
                </p>
              </div>

              {/* Main Content Paragraphs */}
              <div className="space-y-4 text-sm sm:text-base text-cp-text-secondary leading-relaxed">
                {activeArticle.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              {/* Key Steps / Walkthrough if available */}
              {activeArticle.keySteps && activeArticle.keySteps.length > 0 && (
                <div className="rounded-xl border border-cp-border bg-cp-elevated/30 p-5 sm:p-6 space-y-4">
                  <h4 className="text-sm sm:text-base font-semibold text-cp-text-primary flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cp-gold" />
                    Recommended Action Steps:
                  </h4>
                  <ol className="space-y-3">
                    {activeArticle.keySteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-cp-text-secondary">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cp-gold/15 text-cp-gold border border-cp-gold/30 flex items-center justify-center font-bold text-xs mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Feedback control */}
              <div className="pt-6 border-t border-cp-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h5 className="text-sm font-semibold text-cp-text-primary">Was this article helpful?</h5>
                  <p className="text-xs text-cp-text-muted">
                    {activeArticle.helpfulVotes + (userVotes[activeArticle.id] === 'helpful' ? 1 : 0)} users found this helpful
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleVote(activeArticle.id, 'helpful')}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      userVotes[activeArticle.id] === 'helpful'
                        ? 'bg-cp-positive/20 text-cp-positive border-cp-positive/50'
                        : 'bg-cp-elevated hover:bg-cp-card text-cp-text-secondary hover:text-cp-text-primary border-cp-border'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>Yes, helpful</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleVote(activeArticle.id, 'unhelpful')}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      userVotes[activeArticle.id] === 'unhelpful'
                        ? 'bg-cp-negative/20 text-cp-negative border-cp-negative/50'
                        : 'bg-cp-elevated hover:bg-cp-card text-cp-text-secondary hover:text-cp-text-primary border-cp-border'
                    }`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span>No, needs improvement</span>
                  </button>
                </div>
              </div>

              {/* Feedback Confirmation message */}
              {userVotes[activeArticle.id] && (
                <div className="p-3 rounded-lg bg-cp-gold/10 border border-cp-gold/20 text-xs text-cp-gold text-center animate-fadeIn">
                  Thank you for your feedback! Your rating helps the CoinPlus team refine platform documentation.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Related Articles Section */}
          {relatedArticles.length > 0 && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-cp-text-primary flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cp-gold" />
                  Related Help Topics
                </h3>
                <button
                  type="button"
                  onClick={handleBackToList}
                  className="text-xs text-cp-gold hover:underline flex items-center gap-1"
                >
                  View All Knowledge Base Guides <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedArticles.map((rel) => (
                  <Card
                    key={rel.id}
                    className="bg-cp-card hover:bg-cp-elevated/40 border-cp-border hover:border-cp-gold/30 transition-all cursor-pointer group"
                    onClick={() => handleSelectArticle(rel.id)}
                  >
                    <CardContent className="p-5 space-y-2">
                      <div className="flex items-center justify-between text-xs text-cp-text-muted">
                        <span className="text-cp-gold uppercase tracking-wider font-semibold text-[10px]">
                          {HELP_CATEGORIES.find((c) => c.id === rel.categoryId)?.shortLabel}
                        </span>
                        <span>{rel.readTime}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-cp-text-primary group-hover:text-cp-gold transition-colors flex items-center justify-between">
                        {rel.title}
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-cp-gold shrink-0 ml-2" />
                      </h4>
                      <p className="text-xs text-cp-text-secondary line-clamp-2">{rel.summary}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </section>
      ) : (
        /* 3. CATEGORY CARDS + FAQ LIST VIEW */
        <div className="space-y-10">
          {/* Category Cards Grid (8 Core Topics) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h3" className="text-xl font-bold text-cp-text-primary">
                  Browse by Help Category
                </Typography>
                <p className="text-xs text-cp-text-muted mt-0.5">
                  Select a knowledge pillar to filter relevant FAQs, troubleshooting guides, and tutorials
                </p>
              </div>
              {selectedCategory !== 'all' && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className="text-xs text-cp-gold hover:underline font-medium"
                >
                  Show All Categories
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {HELP_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id
                return (
                  <Card
                    key={cat.id}
                    onClick={() => setSelectedCategory(isSelected ? 'all' : cat.id)}
                    className={`cursor-pointer transition-all duration-200 border text-left group ${
                      isSelected
                        ? 'bg-cp-gold/10 border-cp-gold shadow-lg shadow-cp-gold/5'
                        : 'bg-cp-card hover:bg-cp-elevated border-cp-border hover:border-cp-gold/40'
                    }`}
                  >
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-cp-gold text-cp-base font-bold'
                              : 'bg-cp-elevated text-cp-gold group-hover:bg-cp-gold/20'
                          }`}
                        >
                          <CategoryIcon name={cat.iconName} className="w-5 h-5" />
                        </div>
                        <Badge
                          variant={isSelected ? 'gold' : 'neutral'}
                          size="sm"
                        >
                          {cat.articleCount} guides
                        </Badge>
                      </div>

                      <div>
                        <h4
                          className={`text-sm font-bold transition-colors ${
                            isSelected ? 'text-cp-gold' : 'text-cp-text-primary group-hover:text-cp-gold'
                          }`}
                        >
                          {cat.title}
                        </h4>
                        <p className="text-xs text-cp-text-muted mt-1 line-clamp-2 leading-relaxed">
                          {cat.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Quick Filter Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-cp-border">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-cp-gold text-cp-base font-bold shadow-sm'
                  : 'bg-cp-card hover:bg-cp-elevated text-cp-text-secondary hover:text-cp-text-primary border border-cp-border'
              }`}
            >
              All Articles ({HELP_ARTICLES.length})
            </button>
            {HELP_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-cp-gold text-cp-base font-bold shadow-sm'
                    : 'bg-cp-card hover:bg-cp-elevated text-cp-text-secondary hover:text-cp-text-primary border border-cp-border'
                }`}
              >
                {cat.shortLabel} ({cat.articleCount})
              </button>
            ))}
          </div>

          {/* Article & FAQ Search Results Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <Typography variant="h3" className="text-xl font-bold text-cp-text-primary">
                  {selectedCategory === 'all'
                    ? 'Knowledge Base FAQs & Articles'
                    : `${HELP_CATEGORIES.find((c) => c.id === selectedCategory)?.title} FAQs`}
                </Typography>
                <p className="text-xs text-cp-text-muted mt-0.5">
                  Showing {filteredArticles.length} {filteredArticles.length === 1 ? 'guide' : 'guides'}
                  {searchQuery && ` matching "${searchQuery}"`}
                </p>
              </div>

              {/* Expand / Collapse All Quick Action */}
              {filteredArticles.length > 0 && (
                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      if (expandedFaqIds.size === filteredArticles.length) {
                        setExpandedFaqIds(new Set())
                      } else {
                        setExpandedFaqIds(new Set(filteredArticles.map((a) => a.id)))
                      }
                    }}
                    className="text-cp-text-secondary hover:text-cp-gold transition-colors font-medium"
                  >
                    {expandedFaqIds.size === filteredArticles.length ? 'Collapse All' : 'Expand All'}
                  </button>
                </div>
              )}
            </div>

            {/* List / Accordion */}
            {filteredArticles.length > 0 ? (
              <div className="space-y-3">
                {filteredArticles.map((article) => {
                  const isExpanded = expandedFaqIds.has(article.id)
                  const categoryMeta = HELP_CATEGORIES.find((c) => c.id === article.categoryId)
                  const isUserHelpful = userVotes[article.id] === 'helpful'

                  return (
                    <Card
                      key={article.id}
                      className={`border transition-all duration-200 overflow-hidden ${
                        isExpanded
                          ? 'bg-cp-card border-cp-gold/40 shadow-md'
                          : 'bg-cp-card hover:bg-cp-elevated/40 border-cp-border hover:border-cp-border/80'
                      }`}
                    >
                      {/* Accordion Header */}
                      <div
                        onClick={() => toggleFaq(article.id)}
                        className="p-5 flex items-start sm:items-center justify-between gap-4 cursor-pointer select-none"
                      >
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="px-2 py-0.5 rounded bg-cp-elevated text-cp-gold font-medium text-[11px] border border-cp-border">
                              {categoryMeta?.shortLabel || 'General'}
                            </span>
                            <span className="text-cp-text-muted flex items-center gap-1 text-[11px]">
                              <Clock className="w-3 h-3" />
                              {article.readTime}
                            </span>
                            {article.popular && (
                              <span className="px-2 py-0.5 rounded-full bg-cp-gold/15 text-cp-gold text-[10px] font-semibold">
                                Popular
                              </span>
                            )}
                          </div>

                          <h4 className="text-base font-semibold text-cp-text-primary hover:text-cp-gold transition-colors">
                            {article.title}
                          </h4>

                          {!isExpanded && (
                            <p className="text-xs text-cp-text-muted line-clamp-1">{article.summary}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-3 shrink-0 pt-1 sm:pt-0">
                          <div
                            className={`p-1.5 rounded-lg border transition-colors ${
                              isExpanded
                                ? 'bg-cp-gold/15 text-cp-gold border-cp-gold/30'
                                : 'bg-cp-elevated text-cp-text-muted border-cp-border'
                            }`}
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </div>
                      </div>

                      {/* Accordion Expanded Body */}
                      {isExpanded && (
                        <div className="px-5 pb-5 pt-1 border-t border-cp-border/60 space-y-4 animate-fadeIn">
                          <p className="text-sm text-cp-text-secondary leading-relaxed bg-cp-elevated/40 p-3.5 rounded-lg border-l-2 border-cp-gold">
                            {article.summary}
                          </p>

                          <div className="space-y-2 text-sm text-cp-text-secondary leading-relaxed">
                            {article.content.slice(0, 2).map((paragraph, idx) => (
                              <p key={idx}>{paragraph}</p>
                            ))}
                          </div>

                          {article.keySteps && article.keySteps.length > 0 && (
                            <div className="rounded-lg bg-cp-elevated/40 p-4 border border-cp-border space-y-2">
                              <h5 className="text-xs font-semibold text-cp-text-primary uppercase tracking-wider">
                                Quick Action Steps:
                              </h5>
                              <ul className="space-y-1.5">
                                {article.keySteps.map((step, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-xs text-cp-text-secondary">
                                    <span className="text-cp-gold font-bold">•</span>
                                    <span>{step}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Footer Actions inside accordion */}
                          <div className="pt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="text-cp-text-muted">Helpful?</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleVote(article.id, 'helpful')
                                }}
                                className={`px-2.5 py-1 rounded border inline-flex items-center gap-1 transition-colors ${
                                  isUserHelpful
                                    ? 'bg-cp-positive/20 text-cp-positive border-cp-positive/40'
                                    : 'bg-cp-elevated hover:bg-cp-card text-cp-text-secondary border-cp-border'
                                }`}
                              >
                                <ThumbsUp className="w-3 h-3" />
                                <span>{article.helpfulVotes + (isUserHelpful ? 1 : 0)}</span>
                              </button>
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSelectArticle(article.id)}
                              className="text-xs"
                            >
                              <span>Read Full Article & Guides</span>
                              <ArrowRight className="w-3.5 h-3.5 ml-1 text-cp-gold" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </Card>
                  )
                })}
              </div>
            ) : (
              /* No Search Results Empty State */
              <Card className="bg-cp-card border-cp-border text-center py-12 px-4">
                <CardContent className="max-w-md mx-auto space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-cp-gold/10 border border-cp-gold/20 text-cp-gold flex items-center justify-center mx-auto">
                    <Search className="w-7 h-7" />
                  </div>
                  <Typography variant="h3" className="text-lg font-bold text-cp-text-primary">
                    No Matching Articles Found
                  </Typography>
                  <p className="text-xs sm:text-sm text-cp-text-muted leading-relaxed">
                    We couldn't find any knowledge base articles matching "{searchQuery}". Try using broader
                    keywords like <span className="text-cp-gold">deposit</span>,{' '}
                    <span className="text-cp-gold">2FA</span>, <span className="text-cp-gold">fees</span>, or{' '}
                    <span className="text-cp-gold">verification</span>.
                  </p>
                  <div className="pt-2 flex flex-wrap justify-center gap-3">
                    <Button variant="outline" size="sm" onClick={handleResetFilters}>
                      Reset Filters & View All
                    </Button>
                    <Link to="/support">
                      <Button variant="primary" size="sm">
                        Contact Support Desk
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* 4. CONTACT SUPPORT BANNER */}
      <section className="rounded-2xl border border-cp-gold/30 bg-gradient-to-r from-cp-card via-cp-elevated/70 to-cp-card p-6 sm:p-8 shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cp-gold/10 text-cp-gold text-xs font-semibold">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Need Specialized Assistance?</span>
            </div>
            <Typography variant="h3" className="text-xl sm:text-2xl font-bold text-cp-text-primary">
              Can't Find What You're Looking For?
            </Typography>
            <p className="text-xs sm:text-sm text-cp-text-secondary max-w-xl">
              Our 24/7 VIP desk and dedicated support engineers are available to troubleshoot order routing,
              blockchain transaction memos, account security, and identity verification reviews.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link to="/support">
              <Button variant="primary" size="md">
                <MessageSquare className="w-4 h-4 mr-2" />
                Open Support Ticket
              </Button>
            </Link>
            <Link to="/fees">
              <Button variant="outline" size="md">
                View Fee Schedules
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. HELPFUL PLATFORM RESOURCES FOOTER */}
      <section className="border-t border-cp-border/80 pt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/fees"
            className="p-4 rounded-xl bg-cp-card hover:bg-cp-elevated border border-cp-border hover:border-cp-gold/40 transition-all group"
          >
            <div className="flex items-center justify-between text-xs text-cp-gold mb-1 font-semibold">
              <span>FEE TRANSPARENCY</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h4 className="text-sm font-bold text-cp-text-primary group-hover:text-cp-gold transition-colors">
              Spot Fee Schedule & VIP Limits
            </h4>
            <p className="text-xs text-cp-text-muted mt-1">
              Review maker/taker tiers, free deposit schedules, and network gas rates.
            </p>
          </Link>

          <Link
            to="/kyc"
            className="p-4 rounded-xl bg-cp-card hover:bg-cp-elevated border border-cp-border hover:border-cp-gold/40 transition-all group"
          >
            <div className="flex items-center justify-between text-xs text-cp-gold mb-1 font-semibold">
              <span>COMPLIANCE</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h4 className="text-sm font-bold text-cp-text-primary group-hover:text-cp-gold transition-colors">
              Identity Verification (KYC)
            </h4>
            <p className="text-xs text-cp-text-muted mt-1">
              Explore Tier 1 and Tier 2 daily withdrawal allowance limits and requirements.
            </p>
          </Link>

          <Link
            to="/settings"
            className="p-4 rounded-xl bg-cp-card hover:bg-cp-elevated border border-cp-border hover:border-cp-gold/40 transition-all group"
          >
            <div className="flex items-center justify-between text-xs text-cp-gold mb-1 font-semibold">
              <span>ACCOUNT SECURITY</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h4 className="text-sm font-bold text-cp-text-primary group-hover:text-cp-gold transition-colors">
              2FA & Passkey Protection
            </h4>
            <p className="text-xs text-cp-text-muted mt-1">
              Configure hardware biometric keys, active session audit, and withdrawal address allowlists.
            </p>
          </Link>

          <Link
            to="/about"
            className="p-4 rounded-xl bg-cp-card hover:bg-cp-elevated border border-cp-border hover:border-cp-gold/40 transition-all group"
          >
            <div className="flex items-center justify-between text-xs text-cp-gold mb-1 font-semibold">
              <span>ABOUT COINPLUS</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h4 className="text-sm font-bold text-cp-text-primary group-hover:text-cp-gold transition-colors">
              Platform Architecture & Concept
            </h4>
            <p className="text-xs text-cp-text-muted mt-1">
              Learn about CoinPlus's non-custodial demonstration engine and design principles.
            </p>
          </Link>
        </div>

        {/* Regulatory & Risk Notice Disclaimer */}
        <div className="mt-8 p-4 rounded-xl bg-cp-elevated/40 border border-cp-border text-center text-xs text-cp-text-muted space-y-1">
          <p className="font-semibold text-cp-text-secondary">
            Demonstration Disclaimer & Risk Disclosure
          </p>
          <p className="max-w-3xl mx-auto">
            CoinPlus is a non-custodial fintech demonstration platform. Articles, guides, and procedures in this
            Help Centre are designed for educational and platform demonstration purposes only. Digital asset trading
            carries substantial market risk. CoinPlus does not provide investment or tax advisory services.
          </p>
        </div>
      </section>
    </div>
  )
}
export default Help
