export type UserRole = 'public' | 'hospital' | 'admin' | 'courier';

export interface ComplianceDocs {
  regCertUrl: string;
  drugLicenseUrl: string;
  gstinCertUrl: string;
  boardResolutionUrl: string;
  uploadedAt: string;
  verifiedAt?: string;
  notes?: string;
}

export interface Hospital {
  id: string;
  name: string;
  regNo: string;
  officerName: string;
  officerDesignation: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  status: 'verified' | 'pending' | 'rejected';
  coldStorageFacility: boolean;
  totalSurplusListed: number;
  totalTransfersCompleted: number;
  complianceDocs: ComplianceDocs;
}

export type StorageCondition = 'Ambient (15-25°C)' | 'Cold-Chain (2-8°C)' | 'Ultra-Cryo (-20°C)';
export type DosageForm = 'Vial / Injection' | 'Cartridge / Pen' | 'Prefilled Syringe' | 'Infusion Bag' | 'Tablets / Blister';

export interface MedicineItem {
  id: string;
  hospitalId: string;
  hospitalName: string;
  hospitalLocation: string;
  brandName: string;
  genericComposition: string;
  dosageForm: DosageForm;
  strength: string;
  storageCondition: StorageCondition;
  batchNumber: string;
  manufacturingDate: string;
  expiryDate: string;
  totalUnits: number;
  availableUnits: number;
  mrpPerUnit: number;
  concessionPercentage: number;
  transferPricePerUnit: number;
  billNumber: string;
  billPdfUrl: string;
  status: 'available' | 'reserved' | 'regulatory_lockout' | 'routed_to_disposal';
  isNearExpiry: boolean;
  category: 'Critical Care / Antibiotic' | 'Endocrinology' | 'Anticoagulant' | 'Oncology' | 'Cardiology' | 'Gastroenterology';
}

export interface PaymentDetails {
  orderId: string;
  paymentId: string;
  method: string;
  paidAt: string;
  invoiceNumber: string;
  receiptUrl: string;
  taxAmount: number;
  concessionSaved: number;
}

export interface OutboundRequest {
  id: string;
  orderNumber: string;
  medicineId: string;
  medicineName: string;
  genericComposition: string;
  batchNumber: string;
  storageCondition: StorageCondition;
  requesterHospitalId: string;
  requesterHospitalName: string;
  sellerHospitalId: string;
  sellerHospitalName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  platformFee: number;
  netPayable: number;
  status: 'pending' | 'accepted' | 'rejected' | 'paid' | 'in_transit' | 'delivered';
  requestedAt: string;
  decisionAt?: string;
  rejectionReason?: string;
  paymentDetails?: PaymentDetails;
  shipmentId?: string;
}

export interface Checkpoint {
  stage: 'manifest_created' | 'pickup_verified' | 'in_transit' | 'delivered';
  title: string;
  timestamp: string;
  location: string;
  tempRecorded?: number;
  verifiedBy?: string;
  done: boolean;
}

export interface ShipmentTracking {
  id: string;
  shipmentId: string;
  requestId: string;
  medicineName: string;
  batchNumber: string;
  quantity: number;
  storageCondition: StorageCondition;
  originHospital: string;
  destinationHospital: string;
  courierPartner: string;
  courierContact: string;
  sensorId: string;
  currentTemp: number;
  tempStatus: 'normal' | 'warning' | 'breach';
  expectedDelivery: string;
  currentLocation: string;
  latitude: number;
  longitude: number;
  checkpoints: Checkpoint[];
}

export interface BiomedicalWasteManifest {
  id: string;
  manifestNumber: string;
  hospitalId: string;
  hospitalName: string;
  medicineName: string;
  genericComposition: string;
  batchNumber: string;
  quantity: number;
  weightKg: number;
  expiryDate: string;
  reason: 'Expired (< 30 days remaining)' | 'Cold-Chain Protocol Breach' | 'Recalled by Drug Controller (CDSCO)' | 'Packaging Damage';
  courierPartner: string;
  treatmentFacility: string;
  destructionMethod: 'High-Temp Incineration (1200°C)' | 'Autoclaving & Encapsulation';
  status: 'custody_assigned' | 'in_transit' | 'incinerated' | 'certified';
  gpsTimestamp: string;
  certificateNumber?: string;
  signedOffBy?: string;
  certifiedAt?: string;
}

export interface HospitalFeedback {
  id: string;
  ticketNumber: string;
  hospitalId: string;
  hospitalName: string;
  category: 'Cold Chain Breach Report' | 'Platform Usability' | 'Escrow & Billing Query' | 'Delivery Discrepancy';
  priority: 'critical' | 'high' | 'routine';
  subject: string;
  description: string;
  createdAt: string;
  status: 'open' | 'investigating' | 'resolved';
  adminNotes?: string;
  sentiment: 'negative' | 'neutral' | 'positive';
}

export interface DemandPrediction {
  drugName: string;
  generic: string;
  monthlyRequisitions: number;
  availableSurplusUnits: number;
  deficit: number;
  velocityIndex: number;
  riskLevel: 'critical_shortage' | 'high_demand' | 'stable';
  projectedStockoutDays: number;
  recommendedAction: string;
}
