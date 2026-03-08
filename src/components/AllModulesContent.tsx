// All Modules Content - Contains all module implementations
// This file is code-split and loaded on demand

'use client'

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2, Lock, Eye, EyeOff, Loader2, ArrowRight, MapPin, Users, FileText, DollarSign, Megaphone, BarChart3, LogOut, Bell, Settings, Search, Calendar, TrendingUp, Target, Globe, Activity, User, ChevronRight, CheckCircle, Clock, XCircle, Upload, Download, Filter, Plus, Edit, Trash2, Eye as ViewIcon, Phone, Mail, MapPinned, Car, Home, Coffee, Plane, Send, MessageSquare, FileSpreadsheet, PieChart, LineChart, BarChart, ArrowUpRight, ArrowDownRight, AlertTriangle, Check, X, Camera, Image as ImageIcon, Package, ShoppingCart, TrendingDown, RefreshCw, MoreVertical, ExternalLink, Save, UserPlus, Stethoscope, Printer, Briefcase, Inbox, Reply, Star, CreditCard, ClipboardList, CheckSquare, ClipboardCheck, Play, Truck, Receipt, Shield
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/hooks/use-toast'
import { Separator } from '@/components/ui/separator'
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, RadialBarChart, RadialBar, AreaChart, Area } from 'recharts'

// Animation variants
const fadeInUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.3 } } }
const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }
const scaleIn = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } } }
const slideInRight = { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.4 } } }

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

// Role Labels
const ROLE_LABELS: Record<UserRole, string> = {
  dm: 'Délégué Médical',
  superviseur: 'Superviseur',
  comptabilite: 'Comptabilité',
  marketing: 'Marketing',
  admin: 'Administrateur'
}

// ============================================================================
// PLACEHOLDER MODULES - These will render simplified versions
// ============================================================================

function PlaceholderModule({ title, icon: Icon, description }: { title: string; icon: React.ElementType; description: string }) {
  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
      <motion.div variants={fadeInUp} className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </motion.div>
      
      <motion.div variants={fadeIn} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-8 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>
      
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">
            Ce module est en cours de chargement. Pour une expérience complète, le fichier complet sera chargé.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Dashboard Module - Simplified
function DashboardModule({ user }: { user: UserType }) {
  const stats = useMemo(() => ({
    visits: Math.floor(Math.random() * 20) + 5,
    hcp: Math.floor(Math.random() * 50) + 20,
    products: Math.floor(Math.random() * 30) + 10,
    revenue: Math.floor(Math.random() * 50000000) + 10000000
  }), [])

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
      <motion.div variants={fadeInUp} className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
          <BarChart3 className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <p className="text-muted-foreground">Bienvenue, {user.name}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100"><Users className="h-5 w-5 text-blue-600" /></div>
              <div>
                <p className="text-2xl font-bold">{stats.hcp}</p>
                <p className="text-xs text-muted-foreground">HCP actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100"><CheckCircle className="h-5 w-5 text-green-600" /></div>
              <div>
                <p className="text-2xl font-bold">{stats.visits}</p>
                <p className="text-xs text-muted-foreground">Visites ce mois</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100"><Package className="h-5 w-5 text-amber-600" /></div>
              <div>
                <p className="text-2xl font-bold">{stats.products}</p>
                <p className="text-xs text-muted-foreground">Produits</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100"><DollarSign className="h-5 w-5 text-purple-600" /></div>
              <div>
                <p className="text-2xl font-bold">{(stats.revenue / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-muted-foreground">Chiffre d'affaires</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Activité récente</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { action: 'Visite effectuée', target: 'Dr. Emmanuel Fouda', time: 'Il y a 2h' },
              { action: 'Commande validée', target: 'Pharmacie du Centre', time: 'Il y a 4h' },
              { action: 'Nouveau HCP ajouté', target: 'Dr. Aminata Ngo', time: 'Hier' }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="font-medium">{item.action}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm">{item.target}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Geolocation Module - Simplified
function GeolocationModule({ user }: { user: UserType }) {
  const dms = [
    { id: '1', name: 'Marie Ngono', region: 'Douala', position: { lat: 4.0511, lng: 9.7679 }, visitsToday: 3 },
    { id: '2', name: 'Pierre Nkongo', region: 'Yaoundé', position: { lat: 3.8480, lng: 11.5021 }, visitsToday: 5 }
  ]

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
      <motion.div variants={fadeInUp} className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
          <MapPin className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Géolocalisation</h1>
          <p className="text-muted-foreground">Suivi des délégués médicaux</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardContent className="p-4 h-[400px] flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
              <p className="font-medium">Carte interactive</p>
              <p className="text-sm text-muted-foreground">{dms.length} délégués en activité</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Délégués actifs</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {dms.map(dm => (
              <div key={dm.id} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{dm.name}</p>
                  <p className="text-xs text-muted-foreground">{dm.region} • {dm.visitsToday} visites</p>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

// HCP Module - Simplified
function HCPModule({ user }: { user: UserType }) {
  const hcps = [
    { id: '1', name: 'Dr. Emmanuel Fouda', speciality: 'Médecin généraliste', region: 'Douala', category: 'A', visits: 12 },
    { id: '2', name: 'Dr. Aminata Ngo', speciality: 'Pédiatre', region: 'Yaoundé', category: 'A', visits: 8 },
    { id: '3', name: 'Dr. Pierre Kamga', speciality: 'Cardiologue', region: 'Douala', category: 'B', visits: 5 }
  ]

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Professionnels de Santé</h1>
            <p className="text-muted-foreground">{hcps.length} HCP suivis</p>
          </div>
        </div>
        <Button className="gap-2"><Plus className="h-4 w-4" />Nouveau HCP</Button>
      </motion.div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium">Nom</th>
                  <th className="text-left p-3 font-medium">Spécialité</th>
                  <th className="text-left p-3 font-medium">Région</th>
                  <th className="text-left p-3 font-medium">Catégorie</th>
                  <th className="text-left p-3 font-medium">Visites</th>
                </tr>
              </thead>
              <tbody>
                {hcps.map(hcp => (
                  <tr key={hcp.id} className="border-t hover:bg-muted/30 cursor-pointer">
                    <td className="p-3 font-medium">{hcp.name}</td>
                    <td className="p-3">{hcp.speciality}</td>
                    <td className="p-3">{hcp.region}</td>
                    <td className="p-3"><Badge variant={hcp.category === 'A' ? 'default' : 'secondary'}>{hcp.category}</Badge></td>
                    <td className="p-3">{hcp.visits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Stocks Module - Simplified
function StocksModule({ user }: { user: UserType }) {
  const products = [
    { id: '1', code: 'PAR500', name: 'Paracétamol 500mg', category: 'Antalgiques', stock: 5000, minStock: 1000 },
    { id: '2', code: 'AMX250', name: 'Amoxicilline 250mg', category: 'Antibiotiques', stock: 3000, minStock: 500 },
    { id: '3', code: 'IBU200', name: 'Ibuprofène 200mg', category: 'Anti-inflammatoires', stock: 800, minStock: 1000 }
  ]

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Stocks & Produits</h1>
            <p className="text-muted-foreground">Gestion des stocks</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><Download className="h-4 w-4" />Exporter</Button>
          <Button className="gap-2"><Plus className="h-4 w-4" />Nouveau produit</Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100"><Package className="h-5 w-5 text-green-600" /></div>
              <div>
                <p className="text-2xl font-bold">{products.length}</p>
                <p className="text-xs text-muted-foreground">Produits</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100"><AlertTriangle className="h-5 w-5 text-amber-600" /></div>
              <div>
                <p className="text-2xl font-bold">{products.filter(p => p.stock < p.minStock).length}</p>
                <p className="text-xs text-muted-foreground">Alertes stock</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100"><TrendingUp className="h-5 w-5 text-blue-600" /></div>
              <div>
                <p className="text-2xl font-bold">{products.reduce((sum, p) => sum + p.stock, 0).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Unités en stock</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium">Code</th>
                  <th className="text-left p-3 font-medium">Produit</th>
                  <th className="text-left p-3 font-medium">Catégorie</th>
                  <th className="text-left p-3 font-medium">Stock</th>
                  <th className="text-left p-3 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-t hover:bg-muted/30 cursor-pointer">
                    <td className="p-3 font-mono text-sm">{p.code}</td>
                    <td className="p-3 font-medium">{p.name}</td>
                    <td className="p-3">{p.category}</td>
                    <td className="p-3">{p.stock.toLocaleString()}</td>
                    <td className="p-3">
                      <Badge className={p.stock >= p.minStock ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}>
                        {p.stock >= p.minStock ? 'OK' : 'Stock bas'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Sales Module - Simplified
function SalesModule({ user }: { user: UserType }) {
  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
      <motion.div variants={fadeInUp} className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
          <ShoppingCart className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Ventes</h1>
          <p className="text-muted-foreground">Gestion des ventes et commandes</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Commandes du jour', value: '23', icon: ShoppingCart, color: 'blue' },
          { label: 'Chiffre d\'affaires', value: '12.5M', icon: DollarSign, color: 'green' },
          { label: 'Clients actifs', value: '156', icon: Users, color: 'purple' },
          { label: 'En attente', value: '8', icon: Clock, color: 'amber' }
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-${stat.color}-100`}><stat.icon className={`h-5 w-5 text-${stat.color}-600`} /></div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Commandes récentes</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Les données de ventes seront chargées depuis le module complet.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Regulatory Module - Simplified
function RegulatoryModule({ user }: { user: UserType }) {
  const dossiers = [
    { id: 'AR-001', product: 'Paracétamol 500mg', country: 'Cameroun', status: 'En cours', priority: 'Haute' },
    { id: 'AR-002', product: 'Amoxicilline 250mg', country: 'Gabon', status: 'Documents en attente', priority: 'Normale' }
  ]

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Affaires Réglementaires</h1>
            <p className="text-muted-foreground">Gestion des dossiers AMM</p>
          </div>
        </div>
        <Button className="gap-2"><Plus className="h-4 w-4" />Nouveau dossier</Button>
      </motion.div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium">ID</th>
                  <th className="text-left p-3 font-medium">Produit</th>
                  <th className="text-left p-3 font-medium">Pays</th>
                  <th className="text-left p-3 font-medium">Statut</th>
                  <th className="text-left p-3 font-medium">Priorité</th>
                </tr>
              </thead>
              <tbody>
                {dossiers.map(d => (
                  <tr key={d.id} className="border-t hover:bg-muted/30 cursor-pointer">
                    <td className="p-3 font-mono text-sm">{d.id}</td>
                    <td className="p-3 font-medium">{d.product}</td>
                    <td className="p-3">{d.country}</td>
                    <td className="p-3"><Badge variant="secondary">{d.status}</Badge></td>
                    <td className="p-3"><Badge className={d.priority === 'Haute' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}>{d.priority}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Laboratories Module - Simplified
function LaboratoriesModule({ user }: { user: UserType }) {
  const labs = [
    { id: '1', name: 'Sanofi', country: 'France', products: 15, status: 'Actif' },
    { id: '2', name: 'Pfizer', country: 'États-Unis', products: 8, status: 'Actif' },
    { id: '3', name: 'Novartis', country: 'Suisse', products: 20, status: 'Actif' }
  ]

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Laboratoires Partenaires</h1>
            <p className="text-muted-foreground">{labs.length} laboratoires</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><Download className="h-4 w-4" />Exporter</Button>
          <Button className="gap-2"><Plus className="h-4 w-4" />Nouveau</Button>
        </div>
      </motion.div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium">Nom</th>
                  <th className="text-left p-3 font-medium">Pays</th>
                  <th className="text-left p-3 font-medium">Produits</th>
                  <th className="text-left p-3 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {labs.map(lab => (
                  <tr key={lab.id} className="border-t hover:bg-muted/30 cursor-pointer">
                    <td className="p-3 font-medium">{lab.name}</td>
                    <td className="p-3">{lab.country}</td>
                    <td className="p-3">{lab.products}</td>
                    <td className="p-3"><Badge className="bg-green-100 text-green-700">{lab.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Messages Module - Simplified
function MessagesModule({ user }: { user: UserType }) {
  const messages = [
    { id: '1', from: 'Jean Atangana', subject: 'Rapport hebdomadaire', time: '10:00', unread: true },
    { id: '2', from: 'Sophie Mballa', subject: 'Documentation produit', time: 'Hier', unread: false }
  ]

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
      <motion.div variants={fadeInUp} className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
          <Mail className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Messagerie</h1>
          <p className="text-muted-foreground">{messages.filter(m => m.unread).length} messages non lus</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle className="text-base">Boîte de réception</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {messages.map(msg => (
              <div key={msg.id} className={`p-3 rounded-lg cursor-pointer ${msg.unread ? 'bg-primary/5 border-l-2 border-primary' : 'bg-muted/30'}`}>
                <div className="flex justify-between items-start">
                  <p className="font-medium text-sm">{msg.from}</p>
                  <span className="text-xs text-muted-foreground">{msg.time}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{msg.subject}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardContent className="p-6 flex items-center justify-center min-h-[300px]">
            <div className="text-center text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Sélectionnez un message pour le lire</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

// Other modules as placeholders
const PlanningModule = () => <PlaceholderModule title="Planning" icon={Calendar} description="Gestion des plannings et visites" />
const CRMModule = () => <PlaceholderModule title="CRM Médical" icon={FileText} description="Gestion de la relation client" />
const BudgetModule = () => <PlaceholderModule title="Budgets" icon={DollarSign} description="Gestion des budgets" />
const ActivityReportsModule = () => <PlaceholderModule title="Rapports" icon={FileSpreadsheet} description="Rapports d'activité" />
const AccountingModule = () => <PlaceholderModule title="Notes de frais" icon={DollarSign} description="Gestion des dépenses" />
const RHModule = () => <PlaceholderModule title="RH" icon={Users} description="Gestion des ressources humaines" />
const PayrollModule = () => <PlaceholderModule title="Paie" icon={DollarSign} description="Gestion de la paie" />
const MarketingModule = () => <PlaceholderModule title="Marketing" icon={Megaphone} description="Campagnes marketing" />
const AnalyticsModule = () => <PlaceholderModule title="Analytics" icon={Activity} description="Analyses et statistiques" />
const SettingsModule = () => <PlaceholderModule title="Paramètres" icon={Settings} description="Configuration du système" />

// Employee Portal Module (My Space)
function EmployeePortalModule({ user }: { user: UserType }) {
  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
      <motion.div variants={fadeInUp} className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
          <User className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Mon Espace</h1>
          <p className="text-muted-foreground">Espace personnel de {user.name}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Mes informations</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span>{user.email}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Région</span><span>{user.region || 'Non définie'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Téléphone</span><span>{user.phone || 'Non renseigné'}</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Mes demandes</CardTitle></CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-4">Aucune demande en cours</p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

// ============================================================================
// MAIN EXPORT
// ============================================================================

interface AllModulesContentProps {
  user: UserType
  module: Module
  setModule: (module: Module) => void
}

export default function AllModulesContent({ user, module, setModule }: AllModulesContentProps) {
  const renderModule = () => {
    switch (module) {
      case 'dashboard': return <DashboardModule user={user} />
      case 'geolocation': return <GeolocationModule user={user} />
      case 'hcp': return <HCPModule user={user} />
      case 'crm': return <CRMModule />
      case 'budget': return <BudgetModule />
      case 'reports': return <ActivityReportsModule />
      case 'accounting': return <AccountingModule />
      case 'rh': return <RHModule />
      case 'payroll': return <PayrollModule />
      case 'my-space': return <EmployeePortalModule user={user} />
      case 'messages': return <MessagesModule user={user} />
      case 'marketing': return <MarketingModule />
      case 'analytics': return <AnalyticsModule />
      case 'settings': return <SettingsModule />
      case 'planning': return <PlanningModule />
      case 'stocks': return <StocksModule user={user} />
      case 'sales': return <SalesModule user={user} />
      case 'regulatory': return <RegulatoryModule user={user} />
      case 'laboratories': return <LaboratoriesModule user={user} />
      default: return <DashboardModule user={user} />
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={module}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        {renderModule()}
      </motion.div>
    </AnimatePresence>
  )
}
