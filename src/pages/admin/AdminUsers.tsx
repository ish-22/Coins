import React, { useState, useMemo, useEffect } from 'react'
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
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'pending'>('all')
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  // Restriction dialog state
  const [actionUser, setActionUser] = useState<AdminUser | null>(null)
  const [actionType, setActionType] = useState<'suspend' | 'activate' | null>(null)
  const [actionReason, setActionReason] = useState('')
  const [actionError, setActionError] = useState<string | null>(null)
  const [successToast, setSuccessToast] = useState<string | null>(null)

  // Create / Edit User Modal State
  const [userModalOpen, setUserModalOpen] = useState(false)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formPassword, setFormPassword] = useState('')
  const [formRole, setFormRole] = useState('user')
  const [formStatus, setFormStatus] = useState<'active' | 'suspended' | 'pending'>('active')
  const [formKycTier, setFormKycTier] = useState('Tier 1 (Basic Identity)')
  const [formCountry, setFormCountry] = useState('United States')
  const [formBalance, setFormBalance] = useState('1000')
  const [modalFormError, setModalFormError] = useState<string | null>(null)
  const [modalSubmitting, setModalSubmitting] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      setLoadError(null)
      const liveUsers = await adminService.getUsers()
      setUsers(liveUsers)
    } catch (error: any) {
      setLoadError(error?.response?.data?.message || 'Unable to load live customer records from the API.')
      setUsers([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleOpenCreateModal = () => {
    setEditingUserId(null)
    setFormName('')
    setFormEmail('')
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
    setFormPassword('')
    setFormRole((user as any).role || 'user')
    setFormStatus(user.status)
    setFormKycTier(user.kycTier)
    setFormCountry(user.country)
    setFormBalance(String(user.balanceUsd))
    setModalFormError(null)
    setUserModalOpen(true)
  }

  const handleDeleteUser = async (user: AdminUser) => {
    if (!window.confirm(`Are you sure you want to delete user account "${user.name}" (${user.email})?`)) {
      return
    }

    try {
      await adminService.deleteUser(user.id)
      setUsers((prev) => prev.filter((u) => u.id !== user.id))
      if (selectedUser?.id === user.id) setSelectedUser(null)
      setSuccessToast(`User ${user.email} removed permanently.`)
      setTimeout(() => setSuccessToast(null), 4000)
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete user.')
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
          password: formPassword.trim() || undefined,
          role: formRole,
          status: formStatus,
          kyc_tier: formKycTier,
          country: formCountry,
          balance_usd: Number(formBalance) || 0,
        })
        setSuccessToast(`User ${formName.trim()} profile updated successfully.`)
      } else {
        await adminService.createUser({
          name: formName.trim(),
          email: formEmail.trim(),
          password: formPassword.trim(),
          role: formRole,
          status: formStatus,
          kyc_tier: formKycTier,
          country: formCountry,
          initial_balance_usd: Number(formBalance) || 0,
        })
        setSuccessToast(`New customer ${formName.trim()} created and assigned login credentials.`)
      }

      setUserModalOpen(false)
      fetchUsers()
      setTimeout(() => setSuccessToast(null), 4000)
    } catch (err: any) {
      setModalFormError(err?.response?.data?.message || 'Failed to save customer account to database.')
    } finally {
      setModalSubmitting(false)
    }
  }

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.userRef.toLowerCase().includes(searchQuery.toLowerCase())

      const matchStatus = statusFilter === 'all' || u.status === statusFilter

      return matchSearch && matchStatus
    })
  }, [users, searchQuery, statusFilter])

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleOpenActionModal = (user: AdminUser, type: 'suspend' | 'activate') => {
    setActionUser(user)
    setActionType(type)
    setActionReason(type === 'suspend' ? 'Suspicious location velocity detected' : 'Identity verified by compliance desk')
    setActionError(null)
  }

  const handleConfirmAction = async () => {
    if (!actionReason.trim()) {
      setActionError('A valid operational reason is required for compliance logging.')
      return
    }

    if (!actionUser || !actionType) return

    const newStatus = actionType === 'suspend' ? 'suspended' : 'active'

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
          `User ${actionUser.userRef} (${actionUser.name}) ${actionType === 'suspend' ? 'suspended' : 'reactivated'} successfully.`
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-cp-text-primary tracking-tight">
            User Account Management
          </h1>
          <p className="text-xs text-cp-text-muted mt-0.5">
            Inspect customer portfolios, verification tiers, security posture, and manage demonstration status
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="gold" size="sm">
            Total Live Accounts: {users.length}
          </Badge>
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenCreateModal}
            className="flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create User</span>
          </Button>
        </div>
      </div>

      {loadError && (
        <div className="p-3 rounded-xl bg-cp-negative/10 border border-cp-negative/30 text-xs text-cp-negative">
          {loadError}
        </div>
      )}

      {isLoading && (
        <div className="p-4 rounded-xl border border-cp-border bg-cp-card text-xs text-cp-text-muted">
          Loading customer records from the live admin API...
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
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cp-text-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, email, or user reference (e.g. CP-USR-1092)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full bg-[#141d2b] border border-cp-border rounded-xl pl-9 pr-3 py-2 text-xs text-cp-text-primary placeholder:text-cp-text-muted/60 focus:outline-none focus:border-cp-gold/60"
            />
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => {
                setStatusFilter('all')
                setCurrentPage(1)
              }}
              className={`px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                statusFilter === 'all'
                  ? 'bg-cp-gold text-cp-bg border-cp-gold'
                  : 'bg-cp-card hover:bg-cp-elevated text-cp-text-secondary border-cp-border'
              }`}
            >
              All Statuses
            </button>
            <button
              type="button"
              onClick={() => {
                setStatusFilter('active')
                setCurrentPage(1)
              }}
              className={`px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                statusFilter === 'active'
                  ? 'bg-cp-positive/20 text-cp-positive border-cp-positive/40'
                  : 'bg-cp-card hover:bg-cp-elevated text-cp-text-secondary border-cp-border'
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => {
                setStatusFilter('suspended')
                setCurrentPage(1)
              }}
              className={`px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                statusFilter === 'suspended'
                  ? 'bg-cp-negative/20 text-cp-negative border-cp-negative/40'
                  : 'bg-cp-card hover:bg-cp-elevated text-cp-text-secondary border-cp-border'
              }`}
            >
              Suspended
            </button>
            <button
              type="button"
              onClick={() => {
                setStatusFilter('pending')
                setCurrentPage(1)
              }}
              className={`px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                statusFilter === 'pending'
                  ? 'bg-cp-gold/20 text-cp-gold border-cp-gold/40'
                  : 'bg-cp-card hover:bg-cp-elevated text-cp-text-secondary border-cp-border'
              }`}
            >
              Pending
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Responsive Users Table & Mobile Cards */}
      <Card className="bg-[#0c121c] border-cp-border overflow-hidden">
        {paginatedUsers.length === 0 ? (
          <div className="p-12 text-center text-xs text-cp-text-muted space-y-2">
            <Users className="w-8 h-8 text-cp-text-muted mx-auto" />
            <p>No simulated users found matching your search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-cp-border bg-cp-elevated/40 text-cp-text-muted uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Country</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">KYC Tier</th>
                  <th className="py-3 px-4 text-right">Balance</th>
                  <th className="py-3 px-4">Registered</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cp-border/50 text-cp-text-secondary">
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-cp-elevated/30 transition-colors">
                    {/* User */}
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-bold text-cp-text-primary block">{user.name}</span>
                        <span className="text-[11px] text-cp-text-muted block font-mono">{user.email}</span>
                        <span className="text-[10px] text-cp-gold font-mono block">{user.userRef}</span>
                      </div>
                    </td>

                    {/* Country */}
                    <td className="py-3.5 px-4 text-cp-text-secondary font-medium">
                      {user.country}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={user.status === 'active' ? 'positive' : user.status === 'suspended' ? 'negative' : 'gold'}
                        size="sm"
                      >
                        {user.status.toUpperCase()}
                      </Badge>
                    </td>

                    {/* KYC Tier */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-cp-text-primary">{user.kycTier}</span>
                    </td>

                    {/* Balance */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-cp-text-primary">
                      {formatUSD(user.balanceUsd)}
                    </td>

                    {/* Registered */}
                    <td className="py-3.5 px-4 text-cp-text-muted font-mono text-[11px]">
                      {user.registeredAt.slice(0, 10)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedUser(user)}
                          className="px-2 py-1 rounded-lg bg-cp-elevated hover:bg-cp-card border border-cp-border text-cp-text-secondary hover:text-cp-gold transition-colors inline-flex items-center gap-1"
                          title="View user details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(user)}
                          className="p-1.5 rounded-lg bg-cp-elevated hover:bg-cp-card border border-cp-border text-cp-text-secondary hover:text-cp-text-primary transition-colors"
                          title="Edit user profile"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteUser(user)}
                          className="p-1.5 rounded-lg bg-cp-negative/10 hover:bg-cp-negative/20 border border-cp-negative/30 text-cp-negative transition-colors"
                          title="Delete user"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {user.status === 'suspended' ? (
                          <button
                            type="button"
                            onClick={() => handleOpenActionModal(user, 'activate')}
                            className="px-2.5 py-1 rounded-lg bg-cp-positive/15 hover:bg-cp-positive/25 border border-cp-positive/30 text-cp-positive transition-colors font-medium text-[11px]"
                          >
                            Reactivate
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenActionModal(user, 'suspend')}
                            className="px-2.5 py-1 rounded-lg bg-cp-negative/15 hover:bg-cp-negative/25 border border-cp-negative/30 text-cp-negative transition-colors font-medium text-[11px]"
                          >
                            Suspend
                          </button>
                        )}
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
            Showing {paginatedUsers.length} of {filteredUsers.length} users
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

      {/* USER DETAIL DRAWER / MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedUser(null)}
          />

          <div className="relative w-full max-w-lg bg-[#0c121c] border border-cp-border rounded-2xl shadow-2xl overflow-hidden z-10 animate-fadeIn space-y-5 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-cp-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-cp-text-primary">{selectedUser.name}</h3>
                  <Badge
                    variant={selectedUser.status === 'active' ? 'positive' : selectedUser.status === 'suspended' ? 'negative' : 'gold'}
                    size="sm"
                  >
                    {selectedUser.status.toUpperCase()}
                  </Badge>
                </div>
                <span className="text-xs text-cp-gold font-mono">{selectedUser.userRef}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="p-1 rounded-lg text-cp-text-muted hover:text-cp-text-primary hover:bg-cp-elevated"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3.5 text-xs">
              <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                <span className="text-cp-text-muted block text-[10px] uppercase">Email Address</span>
                <span className="font-mono text-cp-text-primary font-semibold mt-0.5 block truncate">
                  {selectedUser.email}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                <span className="text-cp-text-muted block text-[10px] uppercase">Country</span>
                <span className="text-cp-text-primary font-semibold mt-0.5 block">
                  {selectedUser.country} ({selectedUser.countryCode})
                </span>
              </div>

              <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                <span className="text-cp-text-muted block text-[10px] uppercase">Estimated Balance</span>
                <span className="font-mono text-cp-gold font-bold mt-0.5 block">
                  {formatUSD(selectedUser.balanceUsd)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                <span className="text-cp-text-muted block text-[10px] uppercase">KYC Level</span>
                <span className="text-cp-text-primary font-semibold mt-0.5 block">
                  {selectedUser.kycTier}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                <span className="text-cp-text-muted block text-[10px] uppercase">Last Known IP</span>
                <span className="font-mono text-cp-text-secondary mt-0.5 block">
                  {selectedUser.ipAddress}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                <span className="text-cp-text-muted block text-[10px] uppercase">Security Credentials</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${selectedUser.twoFactorEnabled ? 'bg-cp-positive/15 text-cp-positive' : 'bg-cp-border text-cp-text-muted'}`}>
                    2FA: {selectedUser.twoFactorEnabled ? 'ON' : 'OFF'}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${selectedUser.passkeyRegistered ? 'bg-cp-positive/15 text-cp-positive' : 'bg-cp-border text-cp-text-muted'}`}>
                    Passkey: {selectedUser.passkeyRegistered ? 'YES' : 'NO'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-cp-border">
              <span className="text-[11px] text-cp-text-muted">
                Joined: {selectedUser.registeredAt}
              </span>

              {selectedUser.status === 'suspended' ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleOpenActionModal(selectedUser, 'activate')}
                >
                  Reactivate Account
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-cp-negative border-cp-negative/40 hover:bg-cp-negative/15"
                  onClick={() => handleOpenActionModal(selectedUser, 'suspend')}
                >
                  Suspend Account
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUSPEND / REACTIVATE CONFIRMATION DIALOG */}
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
                  actionType === 'suspend'
                    ? 'bg-cp-negative/15 text-cp-negative border border-cp-negative/30'
                    : 'bg-cp-positive/15 text-cp-positive border border-cp-positive/30'
                }`}
              >
                {actionType === 'suspend' ? (
                  <ShieldAlert className="w-5 h-5" />
                ) : (
                  <ShieldCheck className="w-5 h-5" />
                )}
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-cp-text-primary">
                  {actionType === 'suspend' ? 'Confirm Account Suspension' : 'Confirm Account Reactivation'}
                </h4>
                <p className="text-xs text-cp-text-muted">
                  Target: <strong>{actionUser.name}</strong> ({actionUser.userRef})
                </p>
              </div>
            </div>

            <p className="text-xs text-cp-text-secondary leading-relaxed bg-cp-elevated/40 p-3 rounded-lg border border-cp-border">
              {actionType === 'suspend'
                ? 'Suspending this demonstration account will simulatedly restrict login access and freeze open orders.'
                : 'Reactivating will restore full demonstration trading terminal access.'}
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-cp-text-secondary block">
                Required Operational Reason *
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
                variant={actionType === 'suspend' ? 'outline' : 'primary'}
                size="sm"
                className={actionType === 'suspend' ? 'bg-cp-negative text-white hover:bg-cp-negative/90' : ''}
                onClick={handleConfirmAction}
              >
                {actionType === 'suspend' ? 'Confirm Suspension' : 'Confirm Reactivation'}
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
            onClick={() => setUserModalOpen(false)}
          />

          <div className="relative w-full max-w-md bg-[#0c121c] border border-cp-border rounded-2xl shadow-2xl p-6 z-10 animate-fadeIn space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-cp-border pb-3">
              <h3 className="text-base font-bold text-cp-text-primary">
                {editingUserId ? 'Edit Customer Profile' : 'Create New Account'}
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
                    className="w-full bg-[#141d2b] border border-cp-border rounded-xl px-2.5 py-2 text-cp-text-primary focus:outline-none"
                  >
                    <option value="user">User (Trader)</option>
                    <option value="admin">Administrator</option>
                    <option value="operator">Operator</option>
                  </select>
                </div>

                <div>
                  <label className="text-cp-text-secondary font-medium block mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full bg-[#141d2b] border border-cp-border rounded-xl px-2.5 py-2 text-cp-text-primary focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
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
                  {modalSubmitting ? 'Saving...' : editingUserId ? 'Save Changes' : 'Create Account'}
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
