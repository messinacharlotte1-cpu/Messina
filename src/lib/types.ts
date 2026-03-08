// ============================================
// TYPES - PharmaLink Application
// ============================================

export type UserRole = 'dm' | 'superviseur' | 'comptabilite' | 'marketing' | 'admin'
export type Module = 'dashboard' | 'geolocation' | 'crm' | 'accounting' | 'marketing' | 'analytics' | 'settings' | 'hcp' | 'planning' | 'budget' | 'reports' | 'rh' | 'payroll' | 'my-space' | 'messages' | 'stocks' | 'sales' | 'regulatory' | 'laboratories'

// Configuration des horaires d'accès par rôle
export interface AccessHoursConfig {
  roleId: UserRole
  roleName: string
  startHour: string
  endHour: string
  enabled: boolean
  daysOfWeek: number[]
}

export interface UserType {
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

export interface HCP {
  id: string
  name: string
  speciality: string
  region: string
  phone: string
  email: string
  visits: number
  lastVisit: string
  status: 'active' | 'inactive'
  category: 'A' | 'B' | 'C'
  assignedDM?: string
}

export interface VisitReport {
  id: string
  dmId: string
  dmName: string
  hcpName: string
  date: string
  time: string
  duration: number
  location: string
  products: string[]
  objective: string
  feedback: string
  outcome: 'positive' | 'neutral' | 'negative'
  nextAction?: string
  status: 'draft' | 'submitted' | 'reviewed'
  createdAt: string
}

export interface Budget {
  id: string
  supervisorId: string
  supervisorName: string
  region: string
  month: string
  year: number
  categories: {
    carburant: number
    hebergement: number
    repas: number
    transport: number
    autres: number
  }
  total: number
  status: 'draft' | 'submitted' | 'approved' | 'rejected'
  submittedAt?: string
  reviewedAt?: string
  reviewedBy?: string
  comment?: string
}

export interface ActivityReport {
  id: string
  supervisorId: string
  supervisorName: string
  type: 'weekly' | 'monthly'
  startDate: string
  endDate: string
  summary: string
  visitsCompleted: number
  visitsPlanned: number
  teamPerformance: number
  challenges: string
  recommendations: string
  status: 'draft' | 'submitted'
  createdAt: string
}

export interface Visit {
  id: string
  hcpName: string
  date: string
  status: 'completed' | 'pending' | 'cancelled'
  products: string[]
  feedback: string
  duration: number
  location: string
}

export interface Expense {
  id: string
  dmName: string
  type: 'carburant' | 'hebergement' | 'repas' | 'transport' | 'autre'
  amount: number
  currency: string
  date: string
  status: 'pending' | 'approved' | 'rejected'
  receipt?: string
  justification?: {
    fileName: string
    fileType: 'pdf' | 'docx' | 'doc' | 'jpeg' | 'jpg' | 'png'
    fileSize: number
    uploadedAt: string
  }
  description?: string
  submittedBy?: string
}

export interface Product {
  id: string
  name: string
  category: string
  description: string
  price: number
  stock: number
}

export interface DM {
  id: string
  name: string
  email: string
  region: string
  status: 'active' | 'inactive'
  position: { lat: number; lng: number }
  visitsToday: number
  visitsTarget: number
  assignedSupervisor?: string
}

export interface PlanningVisit {
  id: string
  dmId: string
  dmName: string
  hcpName: string
  date: string
  time: string
  duration: number
  location: string
  status: 'planned' | 'confirmed' | 'completed' | 'cancelled'
  type: 'visit' | 'follow-up' | 'presentation' | 'delivery'
  notes?: string
}

export interface Employee {
  id: string
  matricule: string
  name: string
  email: string
  phone: string
  department: string
  position: string
  region: string
  status: 'active' | 'inactive' | 'on_leave'
  hireDate: string
  contractType: 'cdi' | 'cdd' | 'stage'
  contractEndDate?: string
  baseSalary: number
  avatar?: string
  supervisorId?: string
}

export interface Leave {
  id: string
  employeeId: string
  employeeName: string
  type: 'annual' | 'sick' | 'maternity' | 'paternity' | 'unpaid' | 'other'
  startDate: string
  endDate: string
  status: 'pending' | 'approved' | 'rejected'
  reason?: string
  approvedBy?: string
  approvedAt?: string
}

export interface OvertimeRecord {
  id: string
  employeeId: string
  employeeName: string
  date: string
  hours: number
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  approvedBy?: string
}

export interface DisciplinaryRecord {
  id: string
  employeeId: string
  employeeName: string
  type: 'verbal' | 'written' | 'suspension' | 'termination'
  date: string
  reason: string
  description: string
  issuedBy: string
  severity: 'low' | 'medium' | 'high'
}

export interface Payslip {
  id: string
  employeeId: string
  employeeName: string
  month: string
  year: number
  baseSalary: number
  overtime: number
  bonus: number
  deductions: number
  netSalary: number
  status: 'draft' | 'validated' | 'paid'
  paidAt?: string
  workedDays: number
  workedHours: number
}

export interface PayrollConfig {
  id: string
  name: string
  baseSalary: number
  overtimeRate: number
  socialCharges: number
  taxRate: number
}

export interface Department {
  id: string
  name: string
  managerId?: string
  managerName?: string
  employeeCount: number
}

export interface Message {
  id: string
  senderId: string
  senderName: string
  senderRole: UserRole
  recipientId: string
  recipientName: string
  subject: string
  content: string
  timestamp: string
  read: boolean
  priority: 'normal' | 'important' | 'urgent'
  attachments?: { name: string; size: number; url: string }[]
}

export interface Contact {
  id: string
  name: string
  role: UserRole
  avatar?: string
  lastMessage?: string
  lastMessageDate?: string
  unreadCount: number
}

// Pharma Product Types
export interface PharmaProduct {
  id: string
  code: string
  name: string
  category: string
  description: string
  unitPrice: number
  stockQuantity: number
  minStock: number
  maxStock: number
  lotNumber: string
  expirationDate: string
  supplier: string
  location: string
  status: 'available' | 'out_of_stock' | 'expired' | 'recalled'
}

export interface StockMovement {
  id: string
  productId: string
  productName: string
  type: 'in' | 'out' | 'transfer'
  quantity: number
  previousStock: number
  newStock: number
  reason: string
  userId: string
  userName: string
  date: string
  reference?: string
}

export interface StockAlert {
  id: string
  productId: string
  productName: string
  type: 'low_stock' | 'expiring_soon' | 'expired' | 'overstock'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  date: string
  acknowledged: boolean
  acknowledgedBy?: string
  acknowledgedAt?: string
}

export interface Supplier {
  id: string
  name: string
  contact: string
  email: string
  phone: string
  address: string
  status: 'active' | 'inactive'
  rating: number
}

export interface PurchaseOrder {
  id: string
  supplierId: string
  supplierName: string
  orderDate: string
  expectedDate: string
  status: 'draft' | 'submitted' | 'confirmed' | 'received' | 'cancelled'
  items: { productId: string; productName: string; quantity: number; unitPrice: number; totalPrice: number }[]
  totalAmount: number
  notes?: string
  receivedDate?: string
  invoiceNumber?: string
}

export interface InventoryCount {
  id: string
  reference: string
  countDate: string
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled'
  warehouse: string
  countedBy: string[]
  notes?: string
  items: { productId: string; productName: string; expectedQty: number; countedQty: number; variance: number; notes?: string }[]
}

export interface InventoryVariance {
  id: string
  inventoryCountId: string
  productId: string
  productName: string
  expectedQty: number
  actualQty: number
  variance: number
  variancePercent: number
  reason?: string
  status: 'pending' | 'investigating' | 'resolved'
  resolvedBy?: string
  resolvedAt?: string
  resolution?: string
}

// Commercial Client Types
export type ClientType = 'pharmacy' | 'hospital' | 'clinic' | 'health_center' | 'other'

export interface CommercialClient {
  id: string
  code: string
  name: string
  type: ClientType
  region: string
  city: string
  address: string
  phone: string
  email?: string
  contactPerson?: string
  creditLimit: number
  currentBalance: number
  status: 'active' | 'inactive'
  totalOrders: number
  lastOrderDate?: string
  notes?: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  clientId: string
  clientName: string
  date: string
  dueDate: string
  items: { description: string; quantity: number; unitPrice: number; totalPrice: number }[]
  subtotal: number
  tax: number
  total: number
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  paidAmount?: number
  paidDate?: string
  notes?: string
}

export interface Order {
  id: string
  orderNumber: string
  clientId: string
  clientName: string
  createdAt: string
  status: 'pending' | 'confirmed' | 'processing' | 'delivered' | 'cancelled'
  items: { productId: string; productName: string; quantity: number; unitPrice: number; totalPrice: number }[]
  totalAmount: number
  deliveredAt?: string
  deliveryAddress?: string
  notes?: string
}

export interface Quote {
  id: string
  quoteNumber: string
  clientId: string
  clientName: string
  date: string
  validUntil: string
  items: { description: string; quantity: number; unitPrice: number; totalPrice: number }[]
  subtotal: number
  tax: number
  total: number
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
  notes?: string
}

// Laboratory Types
export type LaboratoryType = 'pharmaceutique' | 'cosmetique' | 'dispositif_medical' | 'nutraceutique' | 'autre'
export type LaboratoryStatus = 'actif' | 'inactif' | 'en_negociation' | 'suspendu'
export type ContractStatus = 'actif' | 'expire' | 'en_renouvellement' | 'resilie' | 'en_negociation'

export interface LaboratoryContract {
  id: string
  type: 'exclusivite' | 'non_exclusivite' | 'distribution' | 'partenariat'
  startDate: string
  endDate: string
  status: ContractStatus
  products: string[]
  territories: string[]
  conditions?: string
  renewalClause?: boolean
}

export interface LaboratoryContact {
  id: string
  name: string
  position: string
  email: string
  phone: string
  isPrimary: boolean
}

export interface LaboratoryDocument {
  id: string
  name: string
  type: 'contrat' | 'certificat' | 'licence' | 'amm' | 'autre'
  uploadDate: string
  expiryDate?: string
  fileName?: string
}

export interface Laboratory {
  id: string
  code: string
  name: string
  type: LaboratoryType
  status: LaboratoryStatus
  country: string
  city: string
  address: string
  website?: string
  email: string
  phone: string
  fax?: string
  logo?: string
  contacts: LaboratoryContact[]
  contracts: LaboratoryContract[]
  documents: LaboratoryDocument[]
  productsCount: number
  activeProducts: number
  ammObtained: number
  totalRevenue: number
  lastOrderDate?: string
  relationshipStart: string
  notes?: string
  createdAt: string
  updatedAt: string
}

// Regulatory Affairs Types
export type ARCountry = 'Cameroun' | 'Congo' | 'Gabon'
export type ARProcedureType = 'AMM' | 'Renouvellement' | 'Variation'
export type ARDossierStatus = 'a_preparer' | 'documents_en_attente' | 'documents_recus' | 'dossier_envoye' | 'en_cours_evaluation' | 'demande_complement' | 'amm_obtenue' | 'amm_refusee'
export type ARDocumentStatus = 'recu' | 'non_recu' | 'en_attente'

export interface ARDocument {
  id: string
  name: string
  type: 'formulaire_officiel' | 'module_1' | 'dossier_ctd' | 'reception_echantillons' | 'reception_email' | 'envoi_autorites' | 'autre'
  status: ARDocumentStatus
  fileName?: string
  fileSize?: number
  uploadedAt?: string
  uploadedBy?: string
  notes?: string
}

export interface ARHistoryEntry {
  id: string
  action: string
  field?: string
  oldValue?: string
  newValue?: string
  userId: string
  userName: string
  timestamp: string
}

export interface AMMDossier {
  id: string
  country: ARCountry
  productName: string
  pharmaceuticalForm: string
  dosage: string
  laboratory: string
  procedureType: ARProcedureType
  responsibleId: string
  responsibleName: string
  status: ARDossierStatus
  createdAt: string
  updatedAt: string
  documents: ARDocument[]
  history: ARHistoryEntry[]
  ammReference?: string
  ammDate?: string
  expiryDate?: string
  authorityResponse?: string
  notes?: string
  priority: 'basse' | 'normale' | 'haute' | 'urgente'
  expectedDate?: string
}

// Supplier Portal Types
export interface SupplierAccount {
  id: string
  name: string
  email: string
  code: string
  country: string
  city: string
  address: string
  phone: string
  avatar?: string
  portalType: 'supplier'
}

export interface Payment {
  id: string
  orderId: string
  amount: number
  date: string
  method: string
  reference: string
  status: 'pending' | 'completed' | 'failed'
}

// Client Portal Types
export interface ClientAccount {
  id: string
  name: string
  email: string
  code: string
  type: ClientType
  region: string
  city: string
  address: string
  phone: string
  avatar?: string
  portalType: 'client'
  creditLimit: number
  currentBalance: number
}

export interface ClientReminder {
  id: string
  clientId: string
  clientName: string
  type: 'payment' | 'order' | 'delivery' | 'other'
  message: string
  date: string
  status: 'pending' | 'sent' | 'acknowledged'
}

export interface SalesTarget {
  id: string
  region: string
  month: string
  year: number
  target: number
  achieved: number
  productCategory?: string
}

// Role Labels
export const ROLE_LABELS: Record<UserRole, string> = {
  dm: 'Délégué Médical',
  superviseur: 'Superviseur',
  comptabilite: 'Comptabilité',
  marketing: 'Marketing',
  admin: 'Administrateur'
}
