// ============================================
// SHARED DATA - PharmaLink Application
// ============================================

import { UserType, HCP, VisitReport, Leave, Expense, DM, PlanningVisit, Employee, Laboratory, AMMDossier, Message, Contact, AccessHoursConfig } from './types'

// Fuseaux horaires par pays
export const COUNTRY_TIMEZONES: Record<string, { timezone: string; offset: string; label: string }> = {
  'Cameroun': { timezone: 'Africa/Douala', offset: 'UTC+1', label: 'Heure du Cameroun (WAT)' },
  'Gabon': { timezone: 'Africa/Libreville', offset: 'UTC+1', label: 'Heure du Gabon (WAT)' },
  'Congo': { timezone: 'Africa/Brazzaville', offset: 'UTC+1', label: 'Heure du Congo (WAT)' },
  'Tchad': { timezone: 'Africa/Ndjamena', offset: 'UTC+1', label: 'Heure du Tchad (WAT)' }
}

// Jours de la semaine
export const DAYS_OF_WEEK = [
  { value: 0, label: 'Dimanche', short: 'D' },
  { value: 1, label: 'Lundi', short: 'L' },
  { value: 2, label: 'Mardi', short: 'M' },
  { value: 3, label: 'Mercredi', short: 'M' },
  { value: 4, label: 'Jeudi', short: 'J' },
  { value: 5, label: 'Vendredi', short: 'V' },
  { value: 6, label: 'Samedi', short: 'S' }
]

// Configuration par défaut des horaires d'accès
export const DEFAULT_ACCESS_HOURS: AccessHoursConfig[] = [
  { roleId: 'dm', roleName: 'Délégué Médical', startHour: '08:00', endHour: '18:00', enabled: true, daysOfWeek: [1, 2, 3, 4, 5] },
  { roleId: 'superviseur', roleName: 'Superviseur', startHour: '07:00', endHour: '19:00', enabled: true, daysOfWeek: [1, 2, 3, 4, 5, 6] },
  { roleId: 'comptabilite', roleName: 'Comptabilité', startHour: '08:00', endHour: '17:00', enabled: true, daysOfWeek: [1, 2, 3, 4, 5] },
  { roleId: 'marketing', roleName: 'Marketing', startHour: '08:00', endHour: '18:00', enabled: true, daysOfWeek: [1, 2, 3, 4, 5] },
  { roleId: 'admin', roleName: 'Administrateur', startHour: '00:00', endHour: '23:59', enabled: false, daysOfWeek: [0, 1, 2, 3, 4, 5, 6] }
]

// Vérifier si l'utilisateur a accès à l'heure actuelle
export const checkUserAccess = (
  role: string, 
  country: string, 
  accessHours: AccessHoursConfig[]
): { hasAccess: boolean; reason: string; remainingMinutes?: number } => {
  const config = accessHours.find(ah => ah.roleId === role)
  
  if (!config || !config.enabled) {
    return { hasAccess: true, reason: 'Accès autorisé' }
  }
  
  const timezone = COUNTRY_TIMEZONES[country]?.timezone || 'Africa/Douala'
  const now = new Date()
  
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'numeric',
    hour12: false
  }
  
  const formatter = new Intl.DateTimeFormat('fr-FR', options)
  const parts = formatter.formatToParts(now)
  
  let currentHour = 0
  let currentMinute = 0
  let dayOfWeek = 1
  
  parts.forEach(part => {
    if (part.type === 'hour') currentHour = parseInt(part.value)
    if (part.type === 'minute') currentMinute = parseInt(part.value)
    if (part.type === 'weekday') {
      const dayMap: Record<string, number> = {
        'dim.': 0, 'lun.': 1, 'mar.': 2, 'mer.': 3, 'jeu.': 4, 'ven.': 5, 'sam.': 6
      }
      dayOfWeek = dayMap[part.value] ?? 1
    }
  })
  
  if (!config.daysOfWeek.includes(dayOfWeek)) {
    const dayName = DAYS_OF_WEEK.find(d => d.value === dayOfWeek)?.label || 'ce jour'
    return { hasAccess: false, reason: `Accès non autorisé le ${dayName}` }
  }
  
  const currentMinutes = currentHour * 60 + currentMinute
  const [startH, startM] = config.startHour.split(':').map(Number)
  const [endH, endM] = config.endHour.split(':').map(Number)
  const startMinutes = startH * 60 + startM
  const endMinutes = endH * 60 + endM
  
  if (currentMinutes < startMinutes) {
    const remainingMinutes = startMinutes - currentMinutes
    return { 
      hasAccess: false, 
      reason: `Accès autorisé à partir de ${config.startHour}`,
      remainingMinutes
    }
  }
  
  if (currentMinutes > endMinutes) {
    return { 
      hasAccess: false, 
      reason: `Accès terminé à ${config.endHour}. Revenez demain.` 
    }
  }
  
  const remainingMinutes = endMinutes - currentMinutes
  
  return { 
    hasAccess: true, 
    reason: `Accès autorisé jusqu'à ${config.endHour}`,
    remainingMinutes
  }
}

// Sample Users
export const sampleUsers: UserType[] = [
  { id: '1', name: 'Marie Ngono', email: 'marie.ngono@prodipharm.com', role: 'dm', region: 'Douala', country: 'Cameroun', phone: '+237 699 123 456', supervisorId: '2' },
  { id: '2', name: 'Jean Atangana', email: 'jean.atangana@prodipharm.com', role: 'superviseur', region: 'Yaoundé', country: 'Cameroun', phone: '+237 677 234 567' },
  { id: '3', name: 'Paul Mbarga', email: 'paul.mbarga@prodipharm.com', role: 'comptabilite', region: 'Douala', country: 'Cameroun' },
  { id: '4', name: 'Sophie Mballa', email: 'sophie.mballa@prodipharm.com', role: 'marketing', region: 'Yaoundé', country: 'Cameroun' },
  { id: '5', name: 'Admin User', email: 'admin@prodipharm.com', role: 'admin', region: 'Douala', country: 'Cameroun' }
]

// Sample HCPs
export const sampleHCPs: HCP[] = [
  { id: 'hcp1', name: 'Dr. Emmanuel Fouda', speciality: 'Médecin généraliste', region: 'Douala', phone: '+237 699 111 222', email: 'dr.fouda@email.com', visits: 12, lastVisit: '2025-02-20', status: 'active', category: 'A', assignedDM: '1' },
  { id: 'hcp2', name: 'Dr. Aminata Ngo', speciality: 'Pédiatre', region: 'Yaoundé', phone: '+237 677 333 444', email: 'dr.ngo@email.com', visits: 8, lastVisit: '2025-02-18', status: 'active', category: 'A', assignedDM: '1' },
  { id: 'hcp3', name: 'Dr. Pierre Kamga', speciality: 'Cardiologue', region: 'Douala', phone: '+237 655 555 666', email: 'dr.kamga@email.com', visits: 5, lastVisit: '2025-02-15', status: 'active', category: 'B', assignedDM: '1' },
  { id: 'hcp4', name: 'Dr. Fatou Nkongo', speciality: 'Gynécologue', region: 'Yaoundé', phone: '+237 644 777 888', email: 'dr.nkongo@email.com', visits: 10, lastVisit: '2025-02-22', status: 'active', category: 'A', assignedDM: '1' }
]

// Sample Visit Reports
export const sampleVisitReports: VisitReport[] = [
  { id: 'vr1', dmId: '1', dmName: 'Marie Ngono', hcpName: 'Dr. Emmanuel Fouda', date: '2025-02-25', time: '10:00', duration: 30, location: 'Douala, Akwa', products: ['Paracétamol 500mg', 'Amoxicilline'], objective: 'Présentation nouveaux produits', feedback: 'Médecin intéressé par les nouveaux antibiotiques', outcome: 'positive', nextAction: 'Envoyer documentation détaillée', status: 'submitted', createdAt: '2025-02-25' },
  { id: 'vr2', dmId: '1', dmName: 'Marie Ngono', hcpName: 'Dr. Aminata Ngo', date: '2025-02-24', time: '14:00', duration: 45, location: 'Yaoundé, Bastos', products: ['Vitamine C 1000mg'], objective: 'Suivi traitement pédiatrique', feedback: 'Bons retours sur le produit', outcome: 'positive', nextAction: 'Planifier visite de suivi', status: 'submitted', createdAt: '2025-02-24' }
]

// Sample Leaves
export const initialLeaves: Leave[] = [
  { id: 'leave1', employeeId: '1', employeeName: 'Marie Ngono', type: 'annual', startDate: '2025-03-01', endDate: '2025-03-15', status: 'pending', reason: 'Congés annuels' }
]

// Sample Expenses
export const sampleExpenses: Expense[] = [
  { id: 'exp1', dmName: 'Marie Ngono', type: 'carburant', amount: 25000, currency: 'XAF', date: '2025-02-25', status: 'pending', description: 'Déplacement Douala-Yaoundé' }
]

// Sample DMs
export const sampleDMs: DM[] = [
  { id: '1', name: 'Marie Ngono', email: 'marie.ngono@prodipharm.com', region: 'Douala', status: 'active', position: { lat: 4.0511, lng: 9.7679 }, visitsToday: 3, visitsTarget: 8, assignedSupervisor: '2' },
  { id: 'dm2', name: 'Pierre Nkongo', email: 'pierre.nkongo@prodipharm.com', region: 'Yaoundé', status: 'active', position: { lat: 3.8480, lng: 11.5021 }, visitsToday: 5, visitsTarget: 8, assignedSupervisor: '2' }
]

// Sample Planning Visits
export const samplePlanningVisits: PlanningVisit[] = [
  { id: 'pv1', dmId: '1', dmName: 'Marie Ngono', hcpName: 'Dr. Emmanuel Fouda', date: '2025-02-26', time: '09:00', duration: 30, location: 'Douala, Akwa', status: 'planned', type: 'visit', notes: 'Première visite de présentation' }
]

// Sample Employees
export const sampleEmployees: Employee[] = [
  { id: 'emp1', matricule: 'EMP001', name: 'Marie Ngono', email: 'marie.ngono@prodipharm.com', phone: '+237 699 123 456', department: 'Commercial', position: 'Délégué Médical', region: 'Douala', status: 'active', hireDate: '2022-01-15', contractType: 'cdi', baseSalary: 450000 }
]

// Sample Laboratories
export const sampleLaboratories: Laboratory[] = [
  {
    id: 'lab-001', code: 'LAB001', name: 'Sanofi', type: 'pharmaceutique', status: 'actif',
    country: 'France', city: 'Paris', address: '54 Rue La Boétie, 75008 Paris',
    website: 'https://www.sanofi.com', email: 'contact@sanofi.com', phone: '+33 1 53 77 40 00',
    contacts: [{ id: 'c1', name: 'Marie Durand', position: 'Directrice Commerciale', email: 'marie.durand@sanofi.com', phone: '+33 1 53 77 40 01', isPrimary: true }],
    contracts: [{ id: 'ctr1', type: 'exclusivite', startDate: '2022-01-01', endDate: '2025-12-31', status: 'actif', products: ['Produit A'], territories: ['Cameroun', 'Gabon'], renewalClause: true }],
    documents: [], productsCount: 15, activeProducts: 12, ammObtained: 10, totalRevenue: 250000000,
    lastOrderDate: '2024-02-10', relationshipStart: '2018-01-01', createdAt: '2018-01-01', updatedAt: '2024-02-10'
  },
  {
    id: 'lab-002', code: 'LAB002', name: 'Pfizer', type: 'pharmaceutique', status: 'actif',
    country: 'États-Unis', city: 'New York', address: '66 Hudson Blvd, New York, NY 10001',
    website: 'https://www.pfizer.com', email: 'contact@pfizer.com', phone: '+1 212 733 2323',
    contacts: [{ id: 'c3', name: 'John Smith', position: 'Regional Director Africa', email: 'john.smith@pfizer.com', phone: '+1 212 733 2324', isPrimary: true }],
    contracts: [{ id: 'ctr2', type: 'distribution', startDate: '2021-06-01', endDate: '2024-05-31', status: 'en_renouvellement', products: ['Vaccins', 'Antibiotiques'], territories: ['Cameroun', 'Gabon'], renewalClause: true }],
    documents: [], productsCount: 8, activeProducts: 6, ammObtained: 5, totalRevenue: 180000000,
    lastOrderDate: '2024-01-25', relationshipStart: '2019-06-01', createdAt: '2019-06-01', updatedAt: '2024-01-25'
  },
  {
    id: 'lab-003', code: 'LAB003', name: 'Novartis', type: 'pharmaceutique', status: 'actif',
    country: 'Suisse', city: 'Bâle', address: 'Novartis Campus, CH-4056 Basel',
    website: 'https://www.novartis.com', email: 'contact@novartis.com', phone: '+41 61 324 11 11',
    contacts: [{ id: 'c4', name: 'Anna Müller', position: 'Responsable Zone Afrique', email: 'anna.muller@novartis.com', phone: '+41 61 324 11 12', isPrimary: true }],
    contracts: [{ id: 'ctr3', type: 'non_exclusivite', startDate: '2023-01-01', endDate: '2026-12-31', status: 'actif', products: ['Oncologie', 'Cardiologie'], territories: ['Cameroun', 'Gabon', 'Congo', 'Tchad'], renewalClause: false }],
    documents: [], productsCount: 20, activeProducts: 18, ammObtained: 15, totalRevenue: 320000000,
    lastOrderDate: '2024-02-15', relationshipStart: '2020-01-01', createdAt: '2020-01-01', updatedAt: '2024-02-15'
  }
]

// Sample AMM Dossiers
export const sampleARDossiers: AMMDossier[] = [
  {
    id: 'AR-001',
    country: 'Cameroun',
    productName: 'Paracetamol 500mg',
    pharmaceuticalForm: 'Comprimé',
    dosage: '500 mg',
    laboratory: 'Prodipharm',
    procedureType: 'AMM',
    responsibleId: '1',
    responsibleName: 'Marie Ngono',
    status: 'en_cours_evaluation',
    createdAt: '2024-01-15',
    updatedAt: '2024-02-10',
    documents: [
      { id: 'doc1', name: 'Formulaire AMM Cameroun', type: 'formulaire_officiel', status: 'recu', uploadedAt: '2024-01-16', uploadedBy: 'Marie Ngono' }
    ],
    history: [
      { id: 'h1', action: 'Création du dossier', userId: '1', userName: 'Marie Ngono', timestamp: '2024-01-15T10:00:00' }
    ],
    priority: 'haute',
    expectedDate: '2024-06-15'
  }
]

// Liste des laboratoires combinant le module Laboratoires et les dossiers AR existants
export const AR_LABORATORIES = Array.from(new Set([
  ...sampleLaboratories.map(lab => lab.name),
  ...sampleARDossiers.map(d => d.laboratory)
])).sort()

// Sample Messages
export const sampleMessages: Message[] = [
  { id: 'm1', senderId: '2', senderName: 'Jean Atangana', senderRole: 'superviseur', recipientId: '1', recipientName: 'Marie Ngono', subject: 'Rapport hebdomadaire', content: 'Merci d\'envoyer votre rapport avant vendredi.', timestamp: '2025-02-25T10:00:00', read: false, priority: 'normal' }
]

// Message contacts
export const messageContacts: Contact[] = sampleUsers.map(u => ({
  id: u.id,
  name: u.name,
  role: u.role,
  avatar: u.avatar,
  unreadCount: u.id === '1' ? 1 : 0
}))
