// Client Management Types
export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  dateOfBirth?: string;
  occupation?: string;
  companyName?: string;
  clientType: ClientType;
  status: ClientStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  lastContact?: string;
  primaryLawyer?: Lawyer;
  firm: Firm;
  cases: LegalCase[];
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  preferredBillingMethod?: string;
  billingAddress?: string;
}

export enum ClientType {
  INDIVIDUAL = 'INDIVIDUAL',
  CORPORATION = 'CORPORATION',
  NON_PROFIT = 'NON_PROFIT',
  GOVERNMENT = 'GOVERNMENT',
  PARTNERSHIP = 'PARTNERSHIP'
}

export enum ClientStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PROSPECTIVE = 'PROSPECTIVE',
  FORMER = 'FORMER',
  ARCHIVED = 'ARCHIVED'
}

// Lawyer Types
export interface Lawyer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  specialization?: string;
  barNumber?: string;
  yearsOfExperience?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  firm: Firm;
}

// Firm Types
export interface Firm {
  id: string;
  name: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
}

// Legal Case Types
export interface LegalCase {
  id: string;
  title: string;
  description?: string;
  caseNumber: string;
  caseType: CaseType;
  status: CaseStatus;
  priority: Priority;
  startDate: string;
  endDate?: string;
  client: Client;
  assignedLawyer: Lawyer;
  firm: Firm;
  documents: Document[];
  events: CalendarEvent[];
}

export enum CaseType {
  CRIMINAL = 'CRIMINAL',
  CIVIL = 'CIVIL',
  CORPORATE = 'CORPORATE',
  FAMILY = 'FAMILY',
  IMMIGRATION = 'IMMIGRATION',
  INTELLECTUAL_PROPERTY = 'INTELLECTUAL_PROPERTY',
  REAL_ESTATE = 'REAL_ESTATE',
  LABOR = 'LABOR',
  TAX = 'TAX',
  OTHER = 'OTHER'
}

export enum CaseStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_HOLD = 'ON_HOLD',
  CLOSED_WON = 'CLOSED_WON',
  CLOSED_LOST = 'CLOSED_LOST',
  SETTLED = 'SETTLED',
  DISMISSED = 'DISMISSED'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

// Document Types
export interface Document {
  id: string;
  name: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadDate: string;
  uploadedBy: Lawyer;
  case: LegalCase;
  client?: Client;
  documentType: DocumentType;
  isConfidential: boolean;
  tags: string[];
}

export enum DocumentType {
  CONTRACT = 'CONTRACT',
  EVIDENCE = 'EVIDENCE',
  CORRESPONDENCE = 'CORRESPONDENCE',
  COURT_FILING = 'COURT_FILING',
  RESEARCH = 'RESEARCH',
  CLIENT_INTAKE = 'CLIENT_INTAKE',
  BILLING = 'BILLING',
  OTHER = 'OTHER'
}

// Calendar Types
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  eventType: EventType;
  case?: LegalCase;
  client?: Client;
  attendees: Lawyer[];
  location?: string;
  reminders: Reminder[];
  recurrence?: RecurrenceRule;
}

export enum EventType {
  MEETING = 'MEETING',
  COURT_HEARING = 'COURT_HEARING',
  DEPOSITION = 'DEPOSITION',
  DEADLINE = 'DEADLINE',
  CONSULTATION = 'CONSULTATION',
  FOLLOW_UP = 'FOLLOW_UP',
  OTHER = 'OTHER'
}

export interface Reminder {
  id: string;
  eventId: string;
  reminderTime: number; // minutes before event
  isEmail: boolean;
  isDesktop: boolean;
}

export interface RecurrenceRule {
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  interval: number;
  endDate?: string;
  count?: number;
}

// API Response Types
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  timestamp: string;
}

// Dashboard Stats Types
export interface DashboardStats {
  totalClients: number;
  activeClients: number;
  recentClientsCount: number;
  followUpNeeded: number;
  clientsByType: Array<{ type: ClientType; count: number }>;
  clientsByStatus: Array<{ status: ClientStatus; count: number }>;
}

export interface ClientFilters {
  firstName?: string;
  lastName?: string;
  email?: string;
  clientType?: ClientType;
  status?: ClientStatus;
  city?: string;
  searchTerm?: string;
}

// Form Types for Creating/Updating
export interface ClientFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  dateOfBirth?: string;
  occupation?: string;
  companyName?: string;
  clientType: ClientType;
  status: ClientStatus;
  notes?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  preferredBillingMethod?: string;
  billingAddress?: string;
  primaryLawyerId?: string;
}
