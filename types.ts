
export const PLATFORM_COMMISSION_RATE = 0.20; // 20% Service Fee

export const DURATION_MULTIPLIERS = {
  '15m': 0.25,
  '30m': 0.50,
  '45m': 0.75,
  '60m': 1.00
} as const;

export type BookingDuration = keyof typeof DURATION_MULTIPLIERS;

export enum ProjectStatus {
  DRAFT = 'Draft',
  ANALYZING = 'Analyzing',
  BLUEPRINT_READY = 'Blueprint Ready',
  PRE_FLIGHT = 'Pre-Flight Check',
  EXPERT_BOOKED = 'Technician Assigned',
  INSTALLING = 'In Transit',
  DEPLOYED = 'Arrived (Production)'
}

export type CodeSourceType = 'github' | 'paste' | 'upload' | 'ai-sync' | 'not-sure';
export type TechProfile = 'non-tech-founder' | 'solo-dev' | 'technical-pm';
export type ShipmentTier = 'basic' | 'pro' | 'enterprise';

export interface PreFlightCheck {
  id: string;
  category: string;
  status: string;
  detail: string;
}

export interface InfrastructureOption {
  id: string;
  label: string;
  description: string;
  costEstimate: string;
  isIncluded: boolean;
}

export interface Artifact {
  id: string;
  title: string;
  code: string;
  language: string;
  sourceApp: 'Gemini' | 'ChatGPT' | 'Claude';
  timestamp: string;
}

export interface FareBreakdown {
  baseFee: number;
  technicalDistanceRate: number;
  distanceUnits: number;
  roadConditionSurcharge: number;
  whiteGloveSurcharge: number; 
  infrastructureSurcharge: number;
  serviceFee: number;
  total: number;
}

export interface Message {
  id: string;
  sender: 'user' | 'expert';
  text: string;
  timestamp: string;
}

export interface VaultItem {
  id: string;
  key: string;
  value: string;
  isRevealed: boolean;
}

export interface Milestone {
  id: string;
  label: string;
  isCompleted: boolean;
  isApproved: boolean;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'security';
}

export interface Blueprint {
  stack: string;
  checklist: string[];
  securityPoints: string[];
  estimatedCost: string;
  recommendedExpertType: string;
  estimatedHours: number;
  technicalDistanceScore: number;
  fare: FareBreakdown;
  infrastructureNeeds: InfrastructureOption[];
  shipmentTier: ShipmentTier;
  preFlight: PreFlightCheck[];
}

export interface Project {
  id: string;
  sourceType: CodeSourceType;
  techProfile: TechProfile;
  githubUrl?: string;
  pastedCode?: string;
  repoName: string;
  repoOwner: string;
  description: string;
  status: ProjectStatus;
  blueprint?: Blueprint;
  expertId?: string;
  createdAt: string;
  activityLogs: ActivityLog[];
  isGitHubConnected: boolean;
  totalBookingCost?: number;
  platformFee?: number;
  technicianFee?: number;
  selectedDuration?: BookingDuration;
  messages: Message[];
  vault: VaultItem[];
  milestones: Milestone[];
  artifacts: Artifact[];
  sourceApp?: string;
  liveSessionStart?: string; // Timestamp when tech started work
  liveAccumulatedCost?: number; // Ticking counter
}

export interface Expert {
  id: string;
  name: string;
  specialty: string[];
  rating: number;
  completedJobs: number;
  avatar: string;
  bio: string;
  hourlyRate: number;
  baseFee: number; // Minimum fee per job
  isOnline: boolean;
  responseTime: string;
  location: string;
  freeConsultationAvailable: boolean;
  providesInfrastructure: boolean;
  infrastructureCertification: string[];
  expertTier: 'Junior Courier' | 'Senior Technician' | 'Lead Architect';
}

export interface Consultation {
  id: string;
  expertId: string;
  projectId?: string;
  duration: BookingDuration;
  timestamp: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface Integration {
  id: string;
  name: string;
  type: 'extension' | 'overlay' | 'plugin';
  status: 'connected' | 'disconnected';
  lastSync?: string;
}

export type ViewState = 'landing' | 'onboarding' | 'dashboard' | 'experts' | 'how-it-works' | 'pricing' | 'integrations' | 'expert-landing' | 'expert-onboarding' | 'expert-portal';
