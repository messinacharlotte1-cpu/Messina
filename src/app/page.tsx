'use client'

import React, { useState, useEffect, useRef, useCallback, Suspense, lazy } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import {
  Building2, Lock, Eye, EyeOff, Loader2, ArrowRight, MapPin, Users, FileText, DollarSign, Megaphone, BarChart3, LogOut, Bell, Settings, Calendar, TrendingUp, Target, Globe, Activity, User, AlertTriangle, Check, X, Camera, Package, ShoppingCart, Mail, Phone, Edit, Save, Badge as BadgeIcon
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/hooks/use-toast'
import { Separator } from '@/components/ui/separator'

// Types
type UserRole = 'dm' | 'superviseur' | 'comptabilite' | 'marketing' | 'admin'
type Module = 'dashboard' | 'geolocation' | 'crm' | 'accounting' | 'marketing' | 'analytics' | 'settings' | 'hcp' | 'planning' | 'budget' | 'reports' | 'rh' | 'payroll' | 'my-space' | 'messages' | 'stocks' | 'sales' | 'regulatory' | 'laboratories'

interface UserType {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  region?: string
  country?: string
  phone?: string
  supervisorId?: string
}

interface AccessHoursConfig {
  roleId: UserRole
  roleName: string
  startHour: string
  endHour: string
  enabled: boolean
  daysOfWeek: number[]
}

// Constants
const COUNTRY_TIMEZONES: Record<string, { timezone: string; offset: string; label: string }> = {
  'Cameroun': { timezone: 'Africa/Douala', offset: 'UTC+1', label: 'Heure du Cameroun (WAT)' },
  'Gabon': { timezone: 'Africa/Libreville', offset: 'UTC+1', label: 'Heure du Gabon (WAT)' },
  'Congo': { timezone: 'Africa/Brazzaville', offset: 'UTC+1', label: 'Heure du Congo (WAT)' },
  'Tchad': { timezone: 'Africa/Ndjamena', offset: 'UTC+1', label: 'Heure du Tchad (WAT)' }
}

const DEFAULT_ACCESS_HOURS: AccessHoursConfig[] = [
  { roleId: 'dm', roleName: 'Délégué Médical', startHour: '08:00', endHour: '18:00', enabled: true, daysOfWeek: [1, 2, 3, 4, 5] },
  { roleId: 'superviseur', roleName: 'Superviseur', startHour: '07:00', endHour: '19:00', enabled: true, daysOfWeek: [1, 2, 3, 4, 5, 6] },
  { roleId: 'comptabilite', roleName: 'Comptabilité', startHour: '08:00', endHour: '17:00', enabled: true, daysOfWeek: [1, 2, 3, 4, 5] },
  { roleId: 'marketing', roleName: 'Marketing', startHour: '08:00', endHour: '18:00', enabled: true, daysOfWeek: [1, 2, 3, 4, 5] },
  { roleId: 'admin', roleName: 'Administrateur', startHour: '00:00', endHour: '23:59', enabled: false, daysOfWeek: [0, 1, 2, 3, 4, 5, 6] }
]

const ROLE_LABELS: Record<UserRole, string> = {
  dm: 'Délégué Médical',
  superviseur: 'Superviseur',
  comptabilite: 'Comptabilité',
  marketing: 'Marketing',
  admin: 'Administrateur'
}

const SAMPLE_USERS: UserType[] = [
  { id: '1', name: 'Marie Ngono', email: 'marie.ngono@prodipharm.com', role: 'dm', region: 'Douala', country: 'Cameroun', phone: '+237 699 123 456', supervisorId: '2' },
  { id: '2', name: 'Jean Atangana', email: 'jean.atangana@prodipharm.com', role: 'superviseur', region: 'Yaoundé', country: 'Cameroun', phone: '+237 677 234 567' },
  { id: '3', name: 'Paul Mbarga', email: 'paul.mbarga@prodipharm.com', role: 'comptabilite', region: 'Douala', country: 'Cameroun' },
  { id: '4', name: 'Sophie Mballa', email: 'sophie.mballa@prodipharm.com', role: 'marketing', region: 'Yaoundé', country: 'Cameroun' },
  { id: '5', name: 'Admin User', email: 'admin@prodipharm.com', role: 'admin', region: 'Douala', country: 'Cameroun' }
]

// Animation variants
const fadeInUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.3 } } }

// Loading Components
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-16 h-16 mx-auto mb-6 border-4 border-purple-500 border-t-transparent rounded-full" />
        <h1 className="text-2xl font-bold text-white mb-2">PharmaLink</h1>
        <p className="text-purple-300">Chargement en cours...</p>
      </div>
    </div>
  )
}

function ModuleLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="w-10 h-10 mx-auto mb-4 border-3 border-primary border-t-transparent rounded-full" />
        <p className="text-muted-foreground text-sm">Chargement du module...</p>
      </div>
    </div>
  )
}

// Lazy loaded modules - Each will be in its own chunk
const AllModules = dynamic(() => import('@/components/AllModules'), {
  loading: () => <ModuleLoading />,
  ssr: false
})

// Login Screen
function LoginScreen({ onLogin }: { onLogin: (user: UserType) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [portal, setPortal] = useState<'interne' | 'fournisseur' | 'client'>('interne')
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    await new Promise(resolve => setTimeout(resolve, 800))

    if (portal === 'interne') {
      const user = SAMPLE_USERS.find(u => u.email.toLowerCase() === email.toLowerCase())
      if (user && (password === 'demo' || password === 'password')) {
        onLogin(user)
        toast({ title: 'Connexion réussie', description: `Bienvenue, ${user.name}` })
      } else {
        setError('Email ou mot de passe incorrect')
      }
    } else if (portal === 'fournisseur') {
      onLogin({ id: 'supplier-1', name: 'Sanofi Distribution', email: 'contact@sanofi.com', role: 'dm', region: 'France', country: 'France' })
    } else {
      onLogin({ id: 'client-1', name: 'Pharmacie du Centre', email: 'pharmacie@centre.com', role: 'dm', region: 'Douala', country: 'Cameroun' })
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Card className="bg-white/95 backdrop-blur-xl shadow-2xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-blue-600 p-6 text-center">
            <div className="w-20 h-20 mx-auto bg-white rounded-xl flex items-center justify-center shadow-lg mb-4 overflow-hidden p-2">
              <img src="/logo.png" alt="Prodipharm Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-white">PharmaLink</h1>
            <p className="text-white/80 text-sm mt-1">Plateforme Prodipharm</p>
          </div>

          <CardContent className="p-6">
            <div className="flex gap-2 mb-6">
              {[
                { id: 'interne', label: 'Interne', icon: Building2 },
                { id: 'fournisseur', label: 'Fournisseur', icon: Package },
                { id: 'client', label: 'Client', icon: Users }
              ].map(p => (
                <button key={p.id} onClick={() => setPortal(p.id as typeof portal)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${portal === p.id ? 'bg-primary text-white' : 'bg-muted hover:bg-muted/80 text-muted-foreground'}`}>
                  <p.icon className="h-4 w-4 mx-auto mb-1" />{p.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {portal === 'interne' && (
                <>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" placeholder="votre.email@prodipharm.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Mot de passe</Label>
                    <div className="relative">
                      <Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pr-10" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </>
              )}
              {error && <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg"><AlertTriangle className="h-4 w-4" />{error}</div>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Connexion...</> : <>Se connecter <ArrowRight className="h-4 w-4 ml-2" /></>}
              </Button>
            </form>
            {portal === 'interne' && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground">
                <p className="font-medium mb-1">Comptes de démonstration :</p>
                <p>• DM: marie.ngono@prodipharm.com</p>
                <p>• Superviseur: jean.atangana@prodipharm.com</p>
                <p>• Admin: admin@prodipharm.com</p>
                <p className="mt-1 text-primary">Mot de passe: demo</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

// Menu Icon
function MenuIcon({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
}

// Main App
export default function PharmaLinkApp() {
  const [isReady, setIsReady] = useState(false)
  const [user, setUser] = useState<UserType | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [module, setModule] = useState<Module>('dashboard')
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [showPinModal, setShowPinModal] = useState(false)
  const [pendingModule, setPendingModule] = useState<Module | null>(null)
  const [mySpaceUnlocked, setMySpaceUnlocked] = useState(false)
  const [pinError, setPinError] = useState('')
  const [showAccessDeniedModal, setShowAccessDeniedModal] = useState(false)
  const [accessDeniedReason, setAccessDeniedReason] = useState('')
  const [accessHours, setAccessHours] = useState<AccessHoursConfig[]>(DEFAULT_ACCESS_HOURS)
  
  const { toast } = useToast()

  useEffect(() => { const timer = setTimeout(() => setIsReady(true), 100); return () => clearTimeout(timer) }, [])
  
  const logout = useCallback(() => {
    localStorage.removeItem('pharmalink_user')
    setUser(null)
    setMySpaceUnlocked(false)
    setShowAccessDeniedModal(false)
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('pharmalink_access_hours')
    if (saved) { 
      try { 
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAccessHours(JSON.parse(saved)) 
      } catch {} 
    }
  }, [])

  useEffect(() => {
    if (!user || !isHydrated) return
    const config = accessHours.find(ah => ah.roleId === user.role)
    if (!config || !config.enabled) return
    // Basic check - in real app this would be more sophisticated
  }, [user, isHydrated, accessHours])

  useEffect(() => {
    const savedUser = localStorage.getItem('pharmalink_user')
    if (savedUser) { 
      try { 
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(JSON.parse(savedUser)) 
      } catch { localStorage.removeItem('pharmalink_user') } 
    }
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (isHydrated) {
      if (user) localStorage.setItem('pharmalink_user', JSON.stringify(user))
      else localStorage.removeItem('pharmalink_user')
    }
  }, [user, isHydrated])

  const handleModuleChange = (newModule: Module) => {
    if (newModule === 'my-space' && !mySpaceUnlocked) {
      setPendingModule(newModule)
      setShowPinModal(true)
      return
    }
    setModule(newModule)
  }

  const handleVerifyPin = (pin: string) => {
    if (pin.length >= 4) {
      const storedPin = localStorage.getItem('pharmalink_pin')
      if (storedPin === pin) {
        setMySpaceUnlocked(true)
        setShowPinModal(false)
        setPendingModule(null)
        setPinError('')
        if (pendingModule) setModule(pendingModule)
      } else setPinError('Code PIN incorrect')
    } else setPinError('Le code PIN doit contenir au moins 4 chiffres')
  }

  const menuItems = [
    { id: 'dashboard' as Module, label: 'Tableau de bord', icon: BarChart3, roles: ['dm', 'superviseur', 'comptabilite', 'marketing', 'admin'] },
    { id: 'my-space' as Module, label: 'Mon espace', icon: User, roles: ['dm'] },
    { id: 'messages' as Module, label: 'Messagerie', icon: Mail, roles: ['dm', 'superviseur', 'comptabilite', 'marketing', 'admin'] },
    { id: 'stocks' as Module, label: 'Stocks & Produits', icon: Package, roles: ['superviseur', 'comptabilite', 'admin'] },
    { id: 'sales' as Module, label: 'Ventes', icon: ShoppingCart, roles: ['admin', 'comptabilite', 'superviseur'] },
    { id: 'regulatory' as Module, label: 'Affaires Réglementaires', icon: FileText, roles: ['admin', 'superviseur'] },
    { id: 'laboratories' as Module, label: 'Laboratoires', icon: Building2, roles: ['admin', 'superviseur', 'comptabilite'] },
    { id: 'planning' as Module, label: 'Planning', icon: Calendar, roles: ['superviseur', 'admin'] },
    { id: 'hcp' as Module, label: 'Prof. de Santé', icon: User, roles: ['dm', 'superviseur', 'admin'] },
    { id: 'geolocation' as Module, label: 'Géolocalisation', icon: MapPin, roles: ['dm', 'superviseur', 'admin'] },
    { id: 'crm' as Module, label: 'CRM Médical', icon: FileText, roles: ['dm', 'superviseur', 'admin'] },
    { id: 'budget' as Module, label: 'Budgets', icon: DollarSign, roles: ['dm', 'superviseur', 'comptabilite', 'admin'] },
    { id: 'reports' as Module, label: 'Rapports', icon: Activity, roles: ['superviseur', 'admin'] },
    { id: 'accounting' as Module, label: 'Notes de frais', icon: DollarSign, roles: ['dm', 'comptabilite', 'superviseur', 'admin'] },
    { id: 'rh' as Module, label: 'RH', icon: Users, roles: ['superviseur', 'comptabilite', 'admin'] },
    { id: 'payroll' as Module, label: 'Paie', icon: DollarSign, roles: ['comptabilite', 'admin'] },
    { id: 'marketing' as Module, label: 'Marketing', icon: Megaphone, roles: ['marketing', 'admin'] },
    { id: 'analytics' as Module, label: 'Analytics', icon: Activity, roles: ['superviseur', 'admin', 'marketing'] },
    { id: 'settings' as Module, label: 'Paramètres', icon: Settings, roles: ['admin'] },
  ].filter(m => m.roles.includes(user?.role || 'dm'))

  if (!isHydrated || !isReady) return <LoadingScreen />
  if (!user) return <LoginScreen onLogin={setUser} />

  return (
    <div className="min-h-screen bg-background">
      {sidebarOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border z-50 flex flex-col transition-all duration-300 ${sidebarOpen ? 'w-72' : 'w-20 -translate-x-full lg:translate-x-0'}`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center overflow-hidden p-1">
              <img src="/logo.png" alt="Prodipharm Logo" className="w-full h-full object-contain rounded-lg" />
            </div>
            {sidebarOpen && <div><h1 className="font-bold text-lg">PharmaLink</h1><p className="text-xs text-muted-foreground">Prodipharm</p></div>}
          </div>
        </div>
        <div className="flex-1 py-4 overflow-y-auto">
          <nav className="px-3 space-y-1">
            {menuItems.map((m, i) => (
              <motion.button key={m.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                onClick={() => handleModuleChange(m.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-muted-foreground hover:text-foreground hover:bg-sidebar-accent ${module === m.id ? 'bg-primary text-primary-foreground' : ''}`}>
                <m.icon className="h-5 w-5" />
                {sidebarOpen && <span className="font-medium">{m.label}</span>}
                {m.id === 'my-space' && sidebarOpen && <Lock className="h-3 w-3 ml-auto opacity-50" />}
              </motion.button>
            ))}
          </nav>
        </div>
        <div className="p-3 border-t border-sidebar-border">
          <Button variant="ghost" onClick={logout} className="w-full gap-3 text-muted-foreground hover:text-destructive">
            <LogOut className="h-5 w-5" />{sidebarOpen && <span>Déconnexion</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-20'}`}>
        <header className="h-16 border-b bg-card/80 backdrop-blur-sm sticky top-0 z-30 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden"><MenuIcon className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden lg:flex"><MenuIcon className="h-5 w-5" /></Button>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative"><Bell className="h-5 w-5" /><span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" /></Button>
            <Button variant="ghost" className="gap-2" onClick={() => setShowProfileModal(true)}>
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline">{user.name}</span>
            </Button>
          </div>
        </header>

        <main className="p-4 lg:p-6">
          <Suspense fallback={<ModuleLoading />}>
            <AllModules user={user} module={module} setModule={setModule} />
          </Suspense>
        </main>
      </div>

      {/* PIN Modal */}
      <AnimatePresence>
        {showPinModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-card rounded-xl w-full max-w-sm shadow-2xl p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"><Lock className="h-8 w-8 text-primary" /></div>
                <h2 className="text-xl font-bold">Mon espace protégé</h2>
                <p className="text-muted-foreground text-sm mt-1">Entrez votre code PIN</p>
              </div>
              <div className="space-y-4">
                <Input type="password" placeholder="••••" maxLength={6} className="text-center text-2xl tracking-widest" id="verify-pin-input"
                  onKeyDown={(e) => { if (e.key === 'Enter') handleVerifyPin((e.target as HTMLInputElement).value) }} />
                {pinError && <p className="text-sm text-red-500 text-center flex items-center justify-center gap-2"><AlertTriangle className="h-4 w-4" />{pinError}</p>}
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => { setShowPinModal(false); setPendingModule(null); setPinError('') }}>Annuler</Button>
                  <Button className="flex-1" onClick={() => handleVerifyPin((document.getElementById('verify-pin-input') as HTMLInputElement)?.value || '')}><Lock className="h-4 w-4 mr-2" />Déverrouiller</Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Access Denied Modal */}
      <AnimatePresence>
        {showAccessDeniedModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="bg-card rounded-2xl w-full max-w-md shadow-2xl p-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4"><Calendar className="h-10 w-10 text-white" /></div>
              <h2 className="text-2xl font-bold text-red-600 mb-2">Accès non autorisé</h2>
              <p className="text-muted-foreground mb-4">{accessDeniedReason}</p>
              <Button className="mt-4 w-full bg-red-600 hover:bg-red-700" onClick={() => { logout(); setShowAccessDeniedModal(false); }}><LogOut className="h-4 w-4 mr-2" />Se déconnecter</Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Toaster />
    </div>
  )
}
