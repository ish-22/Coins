import React, { useState, useMemo, useEffect, useCallback } from 'react'
import {
  Users,
  Search,
  Eye,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  X,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  Phone,
  Ban,
  Unlock,
  RefreshCw,
  Clock,
  Shield,
  Mail,
  Globe,
} from 'lucide-react'
import { Card, CardContent } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { AdminUser } from '@/mock/adminData'
import { formatUSD } from '@/utils/formatters'
import { adminService } from '@/services'

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'blocked' | 'pending'>('all')
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'operator' | 'admin'>('all')

  const currentAdmin = useMemo(() => {
    try {
      const stored = sessionStorage.getItem('cp_admin_user') || localStorage.getItem('cp_admin_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }, [])
  const isOperator = currentAdmin?.role === 'operator'

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('Just now')

  // Restriction / Status Dialog State (Activate, Suspend, Block, Unblock)
  const [actionUser, setActionUser] = useState<AdminUser | null>(null)
  const [actionType, setActionType] = useState<'suspend' | 'activate' | 'block' | 'unblock' | null>(null)
  const [actionReason, setActionReason] = useState('')
  const [actionError, setActionError] = useState<string | null>(null)
  const [successToast, setSuccessToast] = useState<string | null>(null)

  // Delete User Dialog State (with regulatory data-retention note)
  const [deleteModalUser, setDeleteModalUser] = useState<AdminUser | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Create / Edit User Modal State
  const [userModalOpen, setUserModalOpen] = useState(false)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formPassword, setFormPassword] = useState('')
  const [formRole, setFormRole] = useState('user')
  const [formStatus, setFormStatus] = useState<'active' | 'suspended' | 'pending' | 'blocked'>('active')
  const [formKycTier, setFormKycTier] = useState('Tier 1 (Basic Identity)')
  const [formCountry, setFormCountry] = useState('United States')
  const [formBalance, setFormBalance] = useState('1000')
  const [modalFormError, setModalFormError] = useState<string | null>(null)
  const [modalSubmitting, setModalSubmitting] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Fetch users with optional silent background refresh
  const fetchUsers = useCallback(async (silent = false) => {
    try {
      if (!silent) setIsLoading(true)
      else setIsRefreshing(true)
      setLoadError(null)

      const liveUsers = await adminService.getUsers()
      setUsers(liveUsers)
      setLastSyncedTime(new Date().toLocaleTimeString())
    } catch (error: any) {
      if (!silent) {
        setLoadError(error?.response?.data?.message || 'Unable to load live customer records from the API.')
        setUsers([])
      }
    } finally {
      if (!silent) setIsLoading(false)
      else setIsRefreshing(false)
    }
  }, [])

  // Initial load + Real-time Automatic Registration Polling (every 10s)
  useEffect(() => {
    fetchUsers(false)

    // Background auto-refresh: Automatically displays any newly registered client
    const pollInterval = setInterval(() => {
      fetchUsers(true)
    }, 10000)

    // Listen for in-app or cross-tab registration events
    const handleUserRegistered = () => {
      fetchUsers(true)
    }
    window.addEventListener('cp_user_registered', handleUserRegistered)
    window.addEventListener('storage', handleUserRegistered)

    return () => {
      clearInterval(pollInterval)
      window.removeEventListener('cp_user_registered', handleUserRegistered)
      window.removeEventListener('storage', handleUserRegistered)
    }
  }, [fetchUsers])

  const handleOpenCreateModal = () => {
    setEditingUserId(null)
    setFormName('')
    setFormEmail('')
    setFormPhone('')
    setFormPassword('')
    setFormRole('user')
    setFormStatus('active')
    setFormKycTier('Tier 1 (Basic Identity)')
    setFormCountry('United States')
    setFormBalance('1000')
    setModalFormError(null)
    setUserModalOpen(true)
  }

  const handleOpenEditModal = (user: AdminUser) => {
    setEditingUserId(user.id)
    setFormName(user.name)
    setFormEmail(user.email)
    setFormPhone(user.phone && user.phone !== 'N/A' && user.phone !== 'Not provided' ? user.phone : '')
    setFormPassword('')
    setFormRole((user as any).role || 'user')
    setFormStatus(user.status)
    setFormKycTier(user.kycTier)
    setFormCountry(user.country)
    setFormBalance(String(user.balanceUsd))
    setModalFormError(null)
    setUserModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deleteModalUser) return
    if (isOperator) {
      alert('Permission denied: Operators cannot delete accounts. Administrator privileges required.')
      return
    }

    try {
      setIsDeleting(true)
      await adminService.deleteUser(deleteModalUser.id)
      setUsers((prev) => prev.filter((u) => u.id !== deleteModalUser.id))
      if (selectedUser?.id === deleteModalUser.id) setSelectedUser(null)
      setSuccessToast(`User account ${deleteModalUser.email} has been permanently purged in accordance with data-retention policies.`)
      setDeleteModalUser(null)
      setTimeout(() => setSuccessToast(null), 4000)
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete user account.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSaveUserForm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim() || !formEmail.trim()) {
      setModalFormError('Name and email are required.')
      return
    }

    if (!editingUserId && !formPassword.trim()) {
      setModalFormError('A password is required when creating a new user.')
      return
    }

    setModalSubmitting(true)
    setModalFormError(null)

    try {
      if (editingUserId) {
        await adminService.updateUser(editingUserId, {
          name: formName.trim(),
          email: formEmail.trim(),
          phone: formPhone.trim() || undefined,
          password: formPassword.trim() || undefined,
          role: formRole,
          status: formStatus,
          kyc_tier: formKycTier,
          country: formCountry,
          balance_usd: Number(formBalance) || 0,
        })
        setSuccessToast(`User profile for "${formName.trim()}" updated successfully.`)
      } else {
        await adminService.createUser({
          name: formName.trim(),
          email: formEmail.trim(),
          phone: formPhone.trim() || undefined,
          password: formPassword.trim(),
          role: formRole,
          status: formStatus,
          kyc_tier: formKycTier,
          country: formCountry,
          initial_balance_usd: Number(formBalance) || 0,
        })
        setSuccessToast(`New customer account "${formName.trim()}" registered and added to database.`)
      }

      setUserModalOpen(false)
      fetchUsers(true)
      setTimeout(() => setSuccessToast(null), 4000)
    } catch (err: any) {
      setModalFormError(err?.response?.data?.message || 'Failed to save customer account to database.')
    } finally {
      setModalSubmitting(false)
    }
  }

  // Filtered users matching search, status, and role
  const filteredUsers = useMemo(() => {
    const searchLower = searchQuery.trim().toLowerCase()
    return users.filter((u) => {
      const matchSearch =
        !searchLower ||
        u.name.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower) ||
        u.userRef.toLowerCase().includes(searchLower) ||
        u.id.toLowerCase().includes(searchLower) ||
        (u.phone && u.phone.toLowerCase().includes(searchLower))

      const matchStatus = statusFilter === 'all' || u.status === statusFilter

      const userRole = u.role || 'user'
      const matchRole =
        roleFilter === 'all' ||
        (roleFilter === 'admin' ? (userRole === 'admin' || userRole === 'super_admin') : userRole === roleFilter)

      return matchSearch && matchStatus && matchRole
    })
  }, [users, searchQuery, statusFilter, roleFilter])

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleOpenActionModal = (
    user: AdminUser,
    type: 'suspend' | 'activate' | 'block' | 'unblock'
  ) => {
    if (isOperator && ['admin', 'super_admin'].includes(user.role || '')) {
      alert('Permission denied: Operators cannot alter administrative account status.')
      return
    }

    setActionUser(user)
    setActionType(type)
    if (type === 'suspend') {
      setActionReason('Temporary restriction due to unusual trading velocity or KYC review')
    } else if (type === 'block') {
      setActionReason('Account blocked due to AML / compliance risk or policy violation')
    } else if (type === 'unblock') {
      setActionReason('Compliance review completed and account unblocked by administration')
    } else {
      setActionReason('Identity and credentials verified by administration desk')
    }
    setActionError(null)
  }

  const handleConfirmAction = async () => {
    if (!actionReason.trim()) {
      setActionError('A valid operational reason is required for compliance audit logging.')
      return
    }

    if (!actionUser || !actionType) return

    let newStatus: 'active' | 'suspended' | 'blocked' = 'active'
    if (actionType === 'suspend') newStatus = 'suspended'
    else if (actionType === 'block') newStatus = 'blocked'
    else newStatus = 'active'

    try {
      const response = await adminService.updateUserStatus(actionUser.id, newStatus)

      setUsers((prev) =>
        prev.map((u) => (u.id === actionUser.id ? { ...u, status: newStatus } : u))
      )

      if (selectedUser?.id === actionUser.id) {
        setSelectedUser((prev) => (prev ? { ...prev, status: newStatus } : null))
      }

      setSuccessToast(
        response?.message ||
          `User ${actionUser.userRef} (${actionUser.name}) status changed to ${newStatus.toUpperCase()} successfully.`
      )
      setTimeout(() => setSuccessToast(null), 4000)
    } catch (error: any) {
      setActionError(error?.response?.data?.message || 'The account status could not be updated from the API.')
      return
    }

    setActionUser(null)
    setActionType(null)
    setActionReason('')
  }

  // Count summaries
  const statusCounts = useMemo(() => {
    const counts = { active: 0, suspended: 0, blocked: 0, pending: 0 }
    users.forEach((u) => {
      if (u.status === 'active') counts.active++
      else if (u.status === 'suspended') counts.suspended++
      else if (u.status === 'blocked') counts.blocked++
      else if (u.status === 'pending') counts.pending++
    })
    return counts
  }, [users])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-cp-text-primary tracking-tight">
              User Registration & Client Management
            </h1>
            <span
              className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cp-positive/10 border border-cp-positive/30 text-cp-positive text-[10px] font-semibold"
              title="Automatically syncs new client registrations every 10 seconds"
            >
              <span className={`w-1.5 h-1.5 rounded-full bg-cp-positive ${isRefreshing ? 'animate-ping' : 'animate-pulse'}`} />
              Auto-Sync Active ({lastSyncedTime})
            </span>
          </div>
          <p className="text-xs text-cp-text-muted mt-0.5">
            Monitor all registered clients, inspect profiles, search by ID/email/name/phone, and control account access status
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchUsers(true)}
            disabled={isRefreshing}
            className="px-2.5 py-1.5 rounded-lg border border-cp-border bg-cp-card hover:bg-cp-elevated text-cp-text-secondary hover:text-cp-text-primary text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
            title="Force immediate check for new registrations"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cp-gold' : ''}`} />
            <span className="hidden sm:inline">Sync Now</span>
          </button>

          <Badge variant="gold" size="sm">
            Total Clients: {users.length}
          </Badge>

          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenCreateModal}
            className="flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Account</span>
          </Button>
        </div>
      </div>

      {loadError && (
        <div className="p-3 rounded-xl bg-cp-negative/10 border border-cp-negative/30 text-xs text-cp-negative flex items-center justify-between">
          <span>{loadError}</span>
          <button onClick={() => fetchUsers(false)} className="underline hover:text-white ml-2">Retry</button>
        </div>
      )}

      {isLoading && (
        <div className="p-6 rounded-xl border border-cp-border bg-cp-card text-xs text-cp-text-muted flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-cp-gold" />
          <span>Synchronizing client registration records from the exchange database...</span>
        </div>
      )}

      {/* Success Toast */}
      {successToast && (
        <div className="p-3 rounded-xl bg-cp-positive/15 border border-cp-positive/30 text-xs text-cp-positive flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button type="button" onClick={() => setSuccessToast(null)} className="p-1 hover:text-cp-text-primary">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <Card className="bg-[#0c121c] border-cp-border">
        <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search bar (Name, Email, User ID, Phone) */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cp-text-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, email, phone, or User ID (e.g. UID-884920)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full bg-[#141d2b] border border-cp-border rounded-xl pl-9 pr-3 py-2 text-xs text-cp-text-primary placeholder:text-cp-text-muted/60 focus:outline-none focus:border-cp-gold/60"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter Pills */}
            <div className="flex items-center gap-1 text-xs overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <span className="text-[10px] text-cp-text-muted font-bold uppercase tracking-wider mr-1">Status:</span>
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('all')
                  setCurrentPage(1)
                }}
                className={`px-2.5 py-1 rounded-lg border font-semibold transition-all ${
                  statusFilter === 'all'
                    ? 'bg-cp-gold text-cp-bg border-cp-gold shadow-sm'
                    : 'bg-cp-card hover:bg-cp-elevated text-cp-text-secondary border-cp-border'
                }`}
              >
                All ({users.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('active')
                  setCurrentPage(1)
                }}
                className={`px-2.5 py-1 rounded-lg border font-semibold transition-all ${
                  statusFilter === 'active'
                    ? 'bg-cp-positive/20 text-cp-positive border-cp-positive/40 shadow-sm'
                    : 'bg-cp-card hover:bg-cp-elevated text-cp-text-secondary border-cp-border'
                }`}
              >
                Active ({statusCounts.active})
              </button>
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('suspended')
                  setCurrentPage(1)
                }}
                className={`px-2.5 py-1 rounded-lg border font-semibold transition-all ${
                  statusFilter === 'suspended'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                    : 'bg-cp-card hover:bg-cp-elevated text-cp-text-secondary border-cp-border'
                }`}
              >
                Suspended ({statusCounts.suspended})
              </button>
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('blocked')
                  setCurrentPage(1)
                }}
                className={`px-2.5 py-1 rounded-lg border font-semibold transition-all ${
                  statusFilter === 'blocked'
                    ? 'bg-cp-negative/20 text-cp-negative border-cp-negative/40 shadow-sm'
                    : 'bg-cp-card hover:bg-cp-elevated text-cp-text-secondary border-cp-border'
                }`}
              >
                Blocked ({statusCounts.blocked})
              </button>
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('pending')
                  setCurrentPage(1)
                }}
                className={`px-2.5 py-1 rounded-lg border font-semibold transition-all ${
                  statusFilter === 'pending'
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-sm'
                    : 'bg-cp-card hover:bg-cp-elevated text-cp-text-secondary border-cp-border'
                }`}
              >
                Pending ({statusCounts.pending})
              </button>
            </div>

            {/* Role Filter Pills */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[10px] text-cp-text-muted font-bold uppercase tracking-wider mr-1">Role:</span>
              {(['all', 'user', 'operator', 'admin'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRoleFilter(r)
                    setCurrentPage(1)
                  }}
                  className={`px-2 py-1 rounded-lg border text-[11px] font-semibold transition-all ${
                    roleFilter === r
                      ? 'bg-cp-gold text-cp-bg border-cp-gold shadow-sm'
                      : 'bg-cp-card hover:bg-cp-elevated text-cp-text-secondary border-cp-border'
                  }`}
                >
                  {r === 'all' ? 'All Roles' : r === 'user' ? 'Traders' : r === 'operator' ? 'Operators' : 'Admins'}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-[#0c121c] border-cp-border overflow-hidden">
        {paginatedUsers.length === 0 ? (
          <div className="p-12 text-center text-xs text-cp-text-muted space-y-2">
            <Users className="w-8 h-8 text-cp-text-muted mx-auto" />
            <p>No registered client records match your search or filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-cp-border bg-cp-elevated/40 text-cp-text-muted uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3 px-4">Client Details</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Country</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4">KYC Tier</th>
                  <th className="py-3 px-4 text-right">Balance</th>
                  <th className="py-3 px-4">Registration Date</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cp-border/50 text-cp-text-secondary">
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-cp-elevated/30 transition-colors">
                    {/* Client Details (Name, Email, Phone, User ID) */}
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-cp-text-primary block">{user.name}</span>
                          <span className="text-[10px] text-cp-gold font-mono font-bold">({user.userRef})</span>
                        </div>
                        <span className="text-[11px] text-cp-text-muted block font-mono">{user.email}</span>
                        <div className="flex items-center gap-1 text-[10px] text-cp-text-secondary mt-0.5">
                          <Phone className="w-3 h-3 text-cp-gold/80 shrink-0" />
                          <span>{user.phone && user.phone !== 'N/A' ? user.phone : 'No phone recorded'}</span>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4">
                      {user.role === 'super_admin' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          SUPER ADMIN
                        </span>
                      ) : user.role === 'admin' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cp-gold/20 text-cp-gold border border-cp-gold/40">
                          ADMIN
                        </span>
                      ) : user.role === 'operator' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          OPERATOR
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-cp-elevated text-cp-text-secondary border border-cp-border">
                          TRADER
                        </span>
                      )}
                    </td>

                    {/* Country */}
                    <td className="py-3.5 px-4 text-cp-text-secondary font-medium">
                      {user.country}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {user.status === 'active' ? (
                        <Badge variant="positive" size="sm">
                          ACTIVE
                        </Badge>
                      ) : user.status === 'suspended' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          SUSPENDED
                        </span>
                      ) : user.status === 'blocked' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cp-negative/20 text-cp-negative border border-cp-negative/40">
                          BLOCKED
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          PENDING
                        </span>
                      )}
                    </td>

                    {/* KYC Tier */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 font-bold text-xs ${
                          user.kycTier.toUpperCase().includes('VERIFIED')
                            ? 'text-cp-positive'
                            : user.kycTier.toLowerCase().includes('in review')
                            ? 'text-cp-gold'
                            : user.kycTier.toLowerCase().includes('rejected')
                            ? 'text-cp-negative'
                            : 'text-cp-text-muted'
                        }`}
                      >
                        {user.kycTier.toUpperCase().includes('VERIFIED') ? '✓ VERIFIED' : user.kycTier}
                      </span>
                    </td>

                    {/* Balance */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-cp-text-primary">
                      {formatUSD(user.balanceUsd)}
                    </td>

                    {/* Registered Date & Time */}
                    <td className="py-3.5 px-4 text-cp-text-muted font-mono text-[11px] whitespace-nowrap">
                      {user.registeredAt}
                    </td>

                    {/* Actions Toolbar */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        {/* 1. Inspect Profile */}
                        <button
                          type="button"
                          onClick={() => setSelectedUser(user)}
                          className="px-2 py-1 rounded-lg bg-cp-elevated hover:bg-cp-card border border-cp-border text-cp-text-secondary hover:text-cp-gold transition-colors inline-flex items-center gap-1"
                          title="View complete client profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Profile</span>
                        </button>

                        {/* 2. Edit User */}
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(user)}
                          className="p-1.5 rounded-lg bg-cp-elevated hover:bg-cp-card border border-cp-border text-cp-text-secondary hover:text-cp-text-primary transition-colors"
                          title="Edit client profile"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* 3. Status Action (Activate / Suspend) */}
                        {user.status === 'suspended' ? (
                          <button
                            type="button"
                            onClick={() => handleOpenActionModal(user, 'activate')}
                            className="px-2 py-1 rounded-lg bg-cp-positive/15 hover:bg-cp-positive/25 border border-cp-positive/30 text-cp-positive transition-colors font-medium text-[11px]"
                            title="Activate account"
                          >
                            Activate
                          </button>
                        ) : user.status === 'blocked' ? (
                          <button
                            type="button"
                            onClick={() => handleOpenActionModal(user, 'unblock')}
                            className="px-2 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 transition-colors font-medium text-[11px] inline-flex items-center gap-1"
                            title="Unblock account"
                          >
                            <Unlock className="w-3 h-3" />
                            <span>Unblock</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenActionModal(user, 'suspend')}
                            disabled={isOperator && ['admin', 'super_admin'].includes(user.role || '')}
                            className={`px-2 py-1 rounded-lg border transition-colors font-medium text-[11px] ${
                              isOperator && ['admin', 'super_admin'].includes(user.role || '')
                                ? 'opacity-30 cursor-not-allowed bg-cp-elevated text-cp-text-muted border-cp-border'
                                : 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/30 text-amber-300'
                            }`}
                            title="Suspend account"
                          >
                            Suspend
                          </button>
                        )}

                        {/* 4. Block / Unblock Button (if not already handled above) */}
                        {user.status !== 'blocked' ? (
                          <button
                            type="button"
                            onClick={() => handleOpenActionModal(user, 'block')}
                            disabled={isOperator && ['admin', 'super_admin'].includes(user.role || '')}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              isOperator && ['admin', 'super_admin'].includes(user.role || '')
                                ? 'opacity-30 cursor-not-allowed bg-cp-elevated text-cp-text-muted border-cp-border'
                                : 'bg-cp-negative/10 hover:bg-cp-negative/20 border-cp-negative/30 text-cp-negative'
                            }`}
                            title="Block user account permanently"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        ) : null}

                        {/* 5. Delete Account */}
                        <button
                          type="button"
                          onClick={() => setDeleteModalUser(user)}
                          disabled={isOperator}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            isOperator
                              ? 'opacity-30 cursor-not-allowed bg-cp-elevated text-cp-text-muted border-cp-border'
                              : 'bg-cp-negative/10 hover:bg-cp-negative/20 border-cp-negative/30 text-cp-negative'
                          }`}
                          title={isOperator ? 'Operators cannot delete accounts (Administrator required)' : 'Delete client record'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="p-4 border-t border-cp-border/80 flex items-center justify-between text-xs text-cp-text-muted">
          <span>
            Showing {paginatedUsers.length} of {filteredUsers.length} clients
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-cp-border disabled:opacity-40 hover:bg-cp-elevated text-cp-text-primary"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-cp-text-primary">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-cp-border disabled:opacity-40 hover:bg-cp-elevated text-cp-text-primary"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* USER DETAIL PROFILE DRAWER / MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedUser(null)}
          />

          <div className="relative w-full max-w-lg bg-[#0c121c] border border-cp-border rounded-2xl shadow-2xl overflow-hidden z-10 animate-fadeIn space-y-5 p-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-cp-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-cp-text-primary">{selectedUser.name}</h3>
                  {selectedUser.status === 'active' ? (
                    <Badge variant="positive" size="sm">ACTIVE</Badge>
                  ) : selectedUser.status === 'suspended' ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      SUSPENDED
                    </span>
                  ) : selectedUser.status === 'blocked' ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cp-negative/20 text-cp-negative border border-cp-negative/40">
                      BLOCKED
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      PENDING
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-cp-gold font-mono">{selectedUser.userRef}</span>
                  <span className="text-[10px] text-cp-text-muted font-mono">(ID: {selectedUser.id})</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="p-1 rounded-lg text-cp-text-muted hover:text-cp-text-primary hover:bg-cp-elevated"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-2 gap-3.5 text-xs">
              <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                <span className="text-cp-text-muted block text-[10px] uppercase font-bold">Email Address</span>
                <span className="font-mono text-cp-text-primary font-semibold mt-0.5 block truncate">
                  {selectedUser.email}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                <span className="text-cp-text-muted block text-[10px] uppercase font-bold">Phone Number</span>
                <span className="font-mono text-cp-text-primary font-semibold mt-0.5 block">
                  {selectedUser.phone && selectedUser.phone !== 'N/A' ? selectedUser.phone : 'Not provided'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                <span className="text-cp-text-muted block text-[10px] uppercase font-bold">Country & Territory</span>
                <span className="text-cp-text-primary font-semibold mt-0.5 block">
                  {selectedUser.country} ({selectedUser.countryCode})
                </span>
              </div>

              <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                <span className="text-cp-text-muted block text-[10px] uppercase font-bold">Registration Timestamp</span>
                <span className="font-mono text-cp-text-primary font-semibold mt-0.5 block">
                  {selectedUser.registeredAt}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                <span className="text-cp-text-muted block text-[10px] uppercase font-bold">Assigned Role</span>
                <span className="font-bold text-cp-gold mt-0.5 block uppercase tracking-wide">
                  {selectedUser.role ? selectedUser.role.replace('_', ' ') : 'USER (TRADER)'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                <span className="text-cp-text-muted block text-[10px] uppercase font-bold">Estimated Balance</span>
                <span className="font-mono text-cp-gold font-bold mt-0.5 block">
                  {formatUSD(selectedUser.balanceUsd)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                <span className="text-cp-text-muted block text-[10px] uppercase font-bold">KYC Verification Tier</span>
                <span className="text-cp-text-primary font-semibold mt-0.5 block">
                  {selectedUser.kycTier}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                <span className="text-cp-text-muted block text-[10px] uppercase font-bold">Last Known Network IP</span>
                <span className="font-mono text-cp-text-secondary mt-0.5 block">
                  {selectedUser.ipAddress}
                </span>
              </div>

              <div className="col-span-2 p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                <span className="text-cp-text-muted block text-[10px] uppercase font-bold">Security Credentials & Posture</span>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${selectedUser.twoFactorEnabled ? 'bg-cp-positive/15 text-cp-positive border border-cp-positive/30' : 'bg-cp-border text-cp-text-muted'}`}>
                    2FA: {selectedUser.twoFactorEnabled ? 'ENABLED' : 'DISABLED'}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${selectedUser.passkeyRegistered ? 'bg-cp-positive/15 text-cp-positive border border-cp-positive/30' : 'bg-cp-border text-cp-text-muted'}`}>
                    FIDO2 Passkeys: {selectedUser.passkeyRegistered ? 'REGISTERED' : 'NONE'}
                  </span>
                  <span className="text-[10px] text-cp-text-muted">
                    Last active: {selectedUser.lastLogin}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Action Toolbar */}
            <div className="pt-3 flex flex-wrap items-center justify-between gap-2 border-t border-cp-border">
              <Button
                variant="outline"
                size="sm"
                className="text-cp-negative border-cp-negative/40 hover:bg-cp-negative/15"
                disabled={isOperator}
                onClick={() => {
                  setSelectedUser(null)
                  setDeleteModalUser(selectedUser)
                }}
              >
                Delete Client Record
              </Button>

              <div className="flex items-center gap-2">
                {selectedUser.status === 'blocked' ? (
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-500"
                    onClick={() => {
                      setSelectedUser(null)
                      handleOpenActionModal(selectedUser, 'unblock')
                    }}
                  >
                    Unblock Account
                  </Button>
                ) : (
                  <>
                    {selectedUser.status === 'suspended' ? (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(null)
                          handleOpenActionModal(selectedUser, 'activate')
                        }}
                      >
                        Activate Account
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-amber-300 border-amber-500/40 hover:bg-amber-500/15"
                        disabled={isOperator && ['admin', 'super_admin'].includes(selectedUser.role || '')}
                        onClick={() => {
                          setSelectedUser(null)
                          handleOpenActionModal(selectedUser, 'suspend')
                        }}
                      >
                        Suspend Account
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      className="text-cp-negative border-cp-negative/40 hover:bg-cp-negative/15"
                      disabled={isOperator && ['admin', 'super_admin'].includes(selectedUser.role || '')}
                      onClick={() => {
                        setSelectedUser(null)
                        handleOpenActionModal(selectedUser, 'block')
                      }}
                    >
                      Block User
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUSPEND / ACTIVATE / BLOCK / UNBLOCK CONFIRMATION DIALOG */}
      {actionUser && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-sm"
            onClick={() => setActionUser(null)}
          />

          <div className="relative w-full max-w-md bg-[#0c121c] border border-cp-border rounded-2xl shadow-2xl p-6 z-10 animate-fadeIn space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  actionType === 'block'
                    ? 'bg-cp-negative/20 text-cp-negative border border-cp-negative/40'
                    : actionType === 'suspend'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-cp-positive/15 text-cp-positive border border-cp-positive/30'
                }`}
              >
                {actionType === 'block' ? (
                  <Ban className="w-5 h-5" />
                ) : actionType === 'suspend' ? (
                  <ShieldAlert className="w-5 h-5" />
                ) : (
                  <ShieldCheck className="w-5 h-5" />
                )}
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-cp-text-primary">
                  {actionType === 'block'
                    ? 'Confirm Client Account Blocking'
                    : actionType === 'unblock'
                      ? 'Confirm Client Account Unblock'
                      : actionType === 'suspend'
                        ? 'Confirm Account Suspension'
                        : 'Confirm Account Activation'}
                </h4>
                <p className="text-xs text-cp-text-muted">
                  Client: <strong>{actionUser.name}</strong> ({actionUser.userRef} &bull; {actionUser.email})
                </p>
              </div>
            </div>

            <p className="text-xs text-cp-text-secondary leading-relaxed bg-cp-elevated/40 p-3 rounded-lg border border-cp-border">
              {actionType === 'block'
                ? 'Blocking this client account permanently terminates trading session tokens and flags the account as sanctioned. Only an administrator can unblock.'
                : actionType === 'unblock'
                  ? 'Unblocking will lift all restrictions and restore standard spot trading terminal access.'
                  : actionType === 'suspend'
                    ? 'Suspending this account will temporarily restrict login access and freeze open orders pending compliance review.'
                    : 'Activating will restore full spot cryptocurrency trading terminal and wallet deposit access.'}
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-cp-text-secondary block">
                Required Operational Justification *
              </label>
              <textarea
                rows={3}
                value={actionReason}
                onChange={(e) => {
                  setActionReason(e.target.value)
                  if (actionError) setActionError(null)
                }}
                placeholder="State regulatory or operational justification for audit logs..."
                className="w-full bg-[#141d2b] border border-cp-border rounded-xl p-2.5 text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold"
              />
              {actionError && (
                <p className="text-xs text-cp-negative flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{actionError}</span>
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-cp-border">
              <Button variant="outline" size="sm" onClick={() => setActionUser(null)}>
                Cancel
              </Button>
              <Button
                variant={actionType === 'block' || actionType === 'suspend' ? 'outline' : 'primary'}
                size="sm"
                className={
                  actionType === 'block'
                    ? 'bg-cp-negative text-white hover:bg-cp-negative/90'
                    : actionType === 'suspend'
                      ? 'bg-amber-600 text-white hover:bg-amber-500'
                      : ''
                }
                onClick={handleConfirmAction}
              >
                {actionType === 'block'
                  ? 'Confirm Block'
                  : actionType === 'unblock'
                    ? 'Confirm Unblock'
                    : actionType === 'suspend'
                      ? 'Confirm Suspension'
                      : 'Confirm Activation'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE ACCOUNT DIALOG WITH DATA RETENTION COMPLIANCE */}
      {deleteModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-sm"
            onClick={() => !isDeleting && setDeleteModalUser(null)}
          />

          <div className="relative w-full max-w-md bg-[#0c121c] border border-cp-negative/40 rounded-2xl shadow-2xl p-6 z-10 animate-fadeIn space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-cp-negative/20 text-cp-negative border border-cp-negative/40 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-cp-text-primary">
                  Delete Client Account Permanently
                </h4>
                <p className="text-xs text-cp-text-muted">
                  Target: <strong>{deleteModalUser.name}</strong> ({deleteModalUser.email})
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-cp-negative/10 border border-cp-negative/30 text-xs text-cp-negative space-y-2">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Data-Retention Notice & Policy Warning</span>
              </div>
              <p className="text-[11px] leading-relaxed text-cp-text-secondary">
                Deleting this account will permanently purge the client record, revoke active session tokens, and eliminate trade and wallet links. Regulatory audit records will document this deletion pursuant to data-retention schedules. This action is irreversible.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-cp-border">
              <Button
                variant="outline"
                size="sm"
                disabled={isDeleting}
                onClick={() => setDeleteModalUser(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={isDeleting}
                className="bg-cp-negative text-white hover:bg-cp-negative/90"
                onClick={handleConfirmDelete}
              >
                {isDeleting ? 'Purging Account...' : 'Confirm Account Deletion'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT USER MODAL */}
      {userModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-sm"
            onClick={() => !modalSubmitting && setUserModalOpen(false)}
          />

          <div className="relative w-full max-w-md bg-[#0c121c] border border-cp-border rounded-2xl shadow-2xl p-6 z-10 animate-fadeIn space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-cp-border pb-3">
              <h3 className="text-base font-bold text-cp-text-primary">
                {editingUserId ? 'Edit Client Profile' : 'Register New Client Account'}
              </h3>
              <button
                type="button"
                onClick={() => setUserModalOpen(false)}
                className="p-1 rounded-lg text-cp-text-muted hover:text-cp-text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {modalFormError && (
              <div className="p-2.5 rounded-lg bg-cp-negative/15 border border-cp-negative/30 text-xs text-cp-negative">
                {modalFormError}
              </div>
            )}

            <form onSubmit={handleSaveUserForm} className="space-y-3.5 text-xs">
              <div>
                <label className="text-cp-text-secondary font-medium block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-[#141d2b] border border-cp-border rounded-xl px-3 py-2 text-cp-text-primary focus:outline-none focus:border-cp-gold"
                />
              </div>

              <div>
                <label className="text-cp-text-secondary font-medium block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-[#141d2b] border border-cp-border rounded-xl px-3 py-2 text-cp-text-primary focus:outline-none focus:border-cp-gold"
                />
              </div>

              <div>
                <label className="text-cp-text-secondary font-medium block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="e.g. +1 (555) 019-8921"
                  className="w-full bg-[#141d2b] border border-cp-border rounded-xl px-3 py-2 text-cp-text-primary focus:outline-none focus:border-cp-gold"
                />
              </div>

              <div>
                <label className="text-cp-text-secondary font-medium block mb-1">
                  {editingUserId ? 'New Password (Leave blank to keep current)' : 'Account Password *'}
                </label>
                <input
                  type="password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder={editingUserId ? '••••••••' : 'Minimum 8 characters'}
                  className="w-full bg-[#141d2b] border border-cp-border rounded-xl px-3 py-2 text-cp-text-primary focus:outline-none focus:border-cp-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-cp-text-secondary font-medium block mb-1">System Role</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    disabled={isOperator}
                    className="w-full bg-[#141d2b] border border-cp-border rounded-xl px-2.5 py-2 text-cp-text-primary focus:outline-none disabled:opacity-50"
                  >
                    <option value="user">User (Trader)</option>
                    {!isOperator && <option value="operator">Operator (Support & Compliance)</option>}
                    {!isOperator && <option value="admin">Administrator</option>}
                    {!isOperator && <option value="super_admin">Super Administrator</option>}
                  </select>
                  {isOperator && (
                    <p className="text-[10px] text-amber-400 mt-1 font-medium">
                      {editingUserId
                        ? 'Only Administrators can modify user roles.'
                        : 'Operators can only provision Trader accounts.'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-cp-text-secondary font-medium block mb-1">Account Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full bg-[#141d2b] border border-cp-border rounded-xl px-2.5 py-2 text-cp-text-primary focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="blocked">Blocked</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-cp-text-secondary font-medium block mb-1">KYC Tier</label>
                  <select
                    value={formKycTier}
                    onChange={(e) => setFormKycTier(e.target.value)}
                    className="w-full bg-[#141d2b] border border-cp-border rounded-xl px-2.5 py-2 text-cp-text-primary focus:outline-none"
                  >
                    <option value="Tier 0 (Unverified)">Tier 0 (Unverified)</option>
                    <option value="Tier 1 (Basic Identity)">Tier 1 (Basic)</option>
                    <option value="Tier 2 (Full KYC Verified)">Tier 2 (Full KYC)</option>
                    <option value="Tier 3 (Institutional Corporate)">Tier 3 (Institutional)</option>
                  </select>
                </div>

                <div>
                  <label className="text-cp-text-secondary font-medium block mb-1">Balance (USDT)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formBalance}
                    onChange={(e) => setFormBalance(e.target.value)}
                    className="w-full bg-[#141d2b] border border-cp-border rounded-xl px-3 py-2 text-cp-text-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-cp-text-secondary font-medium block mb-1">Country</label>
                <input
                  type="text"
                  value={formCountry}
                  onChange={(e) => setFormCountry(e.target.value)}
                  className="w-full bg-[#141d2b] border border-cp-border rounded-xl px-3 py-2 text-cp-text-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-cp-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setUserModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={modalSubmitting}
                >
                  {modalSubmitting ? 'Saving Account...' : editingUserId ? 'Save Profile Changes' : 'Create Account'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUsers
