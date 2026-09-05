import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Hospital,
  MedicineItem,
  OutboundRequest,
  ShipmentTracking,
  BiomedicalWasteManifest,
  HospitalFeedback,
  StorageCondition
} from '../types';
import {
  INITIAL_HOSPITALS,
  INITIAL_MEDICINES,
  INITIAL_REQUESTS,
  INITIAL_TRACKING,
  INITIAL_WASTE_MANIFESTS,
  INITIAL_FEEDBACK
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentHospital: Hospital;
  activePath: string;
  navigate: (path: string) => void;
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Data lists
  hospitals: Hospital[];
  medicines: MedicineItem[];
  requests: OutboundRequest[];
  trackingList: ShipmentTracking[];
  wasteManifests: BiomedicalWasteManifest[];
  feedbackTickets: HospitalFeedback[];

  // Actions
  addMedicine: (data: {
    brandName: string;
    genericComposition: string;
    dosageForm: MedicineItem['dosageForm'];
    strength: string;
    storageCondition: StorageCondition;
    batchNumber: string;
    manufacturingDate: string;
    expiryDate: string;
    totalUnits: number;
    mrpPerUnit: number;
    concessionPercentage: number;
    billNumber: string;
    billPdfUrl?: string;
    category: MedicineItem['category'];
  }) => { success: boolean; isNearExpiry: boolean };

  routeToDisposal: (medicineId: string, reason?: BiomedicalWasteManifest['reason']) => void;
  requestTransfer: (medicineId: string, quantity: number) => void;
  acceptRequest: (requestId: string) => void;
  rejectRequest: (requestId: string, reason: string) => void;
  payWithRazorpay: (requestId: string, method: string) => void;
  
  // Admin Actions
  adminOverrideMedicine: (medicineId: string, updates: Partial<MedicineItem>) => void;
  adminApproveHospital: (hospitalId: string) => void;
  adminRejectHospital: (hospitalId: string, reason: string) => void;
  updateHospitalDetails: (hospitalId: string, updates: Partial<Hospital>) => void;
  signOffBiomedicalWaste: (manifestId: string, certNumber: string, signedBy: string) => void;
  submitFeedback: (data: {
    category: HospitalFeedback['category'];
    priority: HospitalFeedback['priority'];
    subject: string;
    description: string;
  }) => void;
  resolveFeedback: (ticketId: string, notes: string) => void;
  registerHospital: (formData: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem('medex_role') as UserRole) || 'public';
  });

  const [activePath, setActivePath] = useState<string>(() => {
    return window.location.pathname === '/' ? '/' : window.location.pathname;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [hospitals, setHospitals] = useState<Hospital[]>(() => {
    const saved = localStorage.getItem('medex_hospitals');
    return saved ? JSON.parse(saved) : INITIAL_HOSPITALS;
  });

  const [medicines, setMedicines] = useState<MedicineItem[]>(() => {
    const saved = localStorage.getItem('medex_medicines');
    return saved ? JSON.parse(saved) : INITIAL_MEDICINES;
  });

  const [requests, setRequests] = useState<OutboundRequest[]>(() => {
    const saved = localStorage.getItem('medex_requests');
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  const [trackingList, setTrackingList] = useState<ShipmentTracking[]>(() => {
    const saved = localStorage.getItem('medex_tracking');
    return saved ? JSON.parse(saved) : INITIAL_TRACKING;
  });

  const [wasteManifests, setWasteManifests] = useState<BiomedicalWasteManifest[]>(() => {
    const saved = localStorage.getItem('medex_waste_manifests');
    return saved ? JSON.parse(saved) : INITIAL_WASTE_MANIFESTS;
  });

  const [feedbackTickets, setFeedbackTickets] = useState<HospitalFeedback[]>(() => {
    const saved = localStorage.getItem('medex_feedback');
    return saved ? JSON.parse(saved) : INITIAL_FEEDBACK;
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('medex_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('medex_hospitals', JSON.stringify(hospitals));
  }, [hospitals]);

  useEffect(() => {
    localStorage.setItem('medex_medicines', JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem('medex_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('medex_tracking', JSON.stringify(trackingList));
  }, [trackingList]);

  useEffect(() => {
    localStorage.setItem('medex_waste_manifests', JSON.stringify(wasteManifests));
  }, [wasteManifests]);

  useEffect(() => {
    localStorage.setItem('medex_feedback', JSON.stringify(feedbackTickets));
  }, [feedbackTickets]);

  const addToast = (message: string, type: ToastMessage['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole === 'hospital') {
      setActivePath('/hospital/dashboard');
      addToast('Switched to Hospital Portal (Apollo Metro)', 'info');
    } else if (newRole === 'admin') {
      setActivePath('/admin/dashboard');
      addToast('Switched to Admin Command Center (CDSCO / MedEx Central)', 'info');
    } else {
      setActivePath('/');
      addToast('Switched to Public Front Door', 'info');
    }
  };

  const navigate = (path: string) => {
    setActivePath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentHospital = hospitals.find((h) => h.id === 'hosp_apollo') || hospitals[0];

  // Logic: Add Medicine with Expiry calculation
  const addMedicine = (data: {
    brandName: string;
    genericComposition: string;
    dosageForm: MedicineItem['dosageForm'];
    strength: string;
    storageCondition: StorageCondition;
    batchNumber: string;
    manufacturingDate: string;
    expiryDate: string;
    totalUnits: number;
    mrpPerUnit: number;
    concessionPercentage: number;
    billNumber: string;
    billPdfUrl?: string;
    category: MedicineItem['category'];
  }) => {
    const expiryTimestamp = new Date(data.expiryDate).getTime();
    const nowTimestamp = new Date('2026-09-05').getTime(); // Synchronized local system context
    const daysUntilExpiry = Math.round((expiryTimestamp - nowTimestamp) / (1000 * 60 * 60 * 24));
    const isNearExpiry = daysUntilExpiry <= 30;

    const transferPrice = Math.round(data.mrpPerUnit * (1 - data.concessionPercentage / 100) * 100) / 100;

    const newItem: MedicineItem = {
      id: `med_${Date.now()}`,
      hospitalId: currentHospital.id,
      hospitalName: currentHospital.name,
      hospitalLocation: `${currentHospital.city} (Local)`,
      brandName: data.brandName,
      genericComposition: data.genericComposition,
      dosageForm: data.dosageForm,
      strength: data.strength,
      storageCondition: data.storageCondition,
      batchNumber: data.batchNumber,
      manufacturingDate: data.manufacturingDate,
      expiryDate: data.expiryDate,
      totalUnits: data.totalUnits,
      availableUnits: data.totalUnits,
      mrpPerUnit: data.mrpPerUnit,
      concessionPercentage: data.concessionPercentage,
      transferPricePerUnit: transferPrice,
      billNumber: data.billNumber || `BILL-${Date.now().toString().slice(-4)}`,
      billPdfUrl: data.billPdfUrl || 'VERIFIED-INVOICE.pdf',
      status: isNearExpiry ? 'regulatory_lockout' : 'available',
      isNearExpiry,
      category: data.category
    };

    setMedicines((prev) => [newItem, ...prev]);

    if (isNearExpiry) {
      addToast(
        `Alert: Batch ${data.batchNumber} has under 30 days to expiry (${daysUntilExpiry}d). Regulatory Lockout applied. Automatically routing to Safe Disposal stream.`,
        'error'
      );
      // Automatically generate a biomedical waste manifest
      const newManifest: BiomedicalWasteManifest = {
        id: `bmw_${Date.now()}`,
        manifestNumber: `BMW-DL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        hospitalId: currentHospital.id,
        hospitalName: currentHospital.name,
        medicineName: `${data.brandName} (${data.strength})`,
        genericComposition: data.genericComposition,
        batchNumber: data.batchNumber,
        quantity: data.totalUnits,
        weightKg: Math.round((data.totalUnits * 0.08) * 10) / 10,
        expiryDate: data.expiryDate,
        reason: 'Expired (< 30 days remaining)',
        courierPartner: 'EcoHaz Bio-Logistics Authorized CPCB Carrier #DL-14',
        treatmentFacility: 'Delhi Metro Central Bio-Medical Waste Treatment Facility (CBWTF Unit 4, Okhla)',
        destructionMethod: 'High-Temp Incineration (1200°C)',
        status: 'custody_assigned',
        gpsTimestamp: new Date().toLocaleString()
      };
      setWasteManifests((prev) => [newManifest, ...prev]);
    } else {
      addToast(
        `Medicine "${data.brandName}" listed successfully in verified network catalog. Concession: ${data.concessionPercentage}%`,
        'success'
      );
    }

    return { success: true, isNearExpiry };
  };

  // Route to safe disposal
  const routeToDisposal = (medicineId: string, reason: BiomedicalWasteManifest['reason'] = 'Expired (< 30 days remaining)') => {
    const med = medicines.find((m) => m.id === medicineId);
    if (!med) return;

    setMedicines((prev) =>
      prev.map((m) => (m.id === medicineId ? { ...m, status: 'routed_to_disposal' } : m))
    );

    const newManifest: BiomedicalWasteManifest = {
      id: `bmw_${Date.now()}`,
      manifestNumber: `BMW-DL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      hospitalId: med.hospitalId,
      hospitalName: med.hospitalName,
      medicineName: `${med.brandName} (${med.strength})`,
      genericComposition: med.genericComposition,
      batchNumber: med.batchNumber,
      quantity: med.availableUnits,
      weightKg: Math.round((med.availableUnits * 0.08) * 10) / 10,
      expiryDate: med.expiryDate,
      reason,
      courierPartner: 'EcoHaz Bio-Logistics Authorized CPCB Carrier #DL-14',
      treatmentFacility: 'Delhi Metro Central Bio-Medical Waste Treatment Facility (CBWTF Unit 4, Okhla)',
      destructionMethod: 'High-Temp Incineration (1200°C)',
      status: 'custody_assigned',
      gpsTimestamp: new Date().toLocaleString()
    };

    setWasteManifests((prev) => [newManifest, ...prev]);
    addToast(`Batch ${med.batchNumber} safely transferred to Bio-Medical Waste Stream. CPCB Manifest generated.`, 'warning');
  };

  // Request transfer from peer hospital
  const requestTransfer = (medicineId: string, quantity: number) => {
    const med = medicines.find((m) => m.id === medicineId);
    if (!med) return;

    const totalAmount = med.transferPricePerUnit * quantity;
    const platformFee = Math.round(totalAmount * 0.02 * 100) / 100;
    const netPayable = totalAmount + platformFee;

    const newReq: OutboundRequest = {
      id: `req_${Date.now()}`,
      orderNumber: `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      medicineId: med.id,
      medicineName: `${med.brandName} (${med.strength})`,
      genericComposition: med.genericComposition,
      batchNumber: med.batchNumber,
      storageCondition: med.storageCondition,
      requesterHospitalId: currentHospital.id,
      requesterHospitalName: currentHospital.name,
      sellerHospitalId: med.hospitalId,
      sellerHospitalName: med.hospitalName,
      quantity,
      unitPrice: med.transferPricePerUnit,
      totalAmount,
      platformFee,
      netPayable,
      status: 'pending',
      requestedAt: new Date().toISOString()
    };

    setRequests((prev) => [newReq, ...prev]);
    addToast(
      `Transfer requisition #${newReq.orderNumber} dispatched to ${med.hospitalName}. Awaiting verification.`,
      'success'
    );
  };

  // Accept incoming request
  const acceptRequest = (requestId: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: 'accepted', decisionAt: new Date().toISOString() }
          : r
      )
    );
    const req = requests.find((r) => r.id === requestId);
    if (req) {
      // reserve stock
      setMedicines((prev) =>
        prev.map((m) =>
          m.id === req.medicineId
            ? { ...m, availableUnits: Math.max(0, m.availableUnits - req.quantity) }
            : m
        )
      );
    }
    addToast('Request accepted and stock reserved. Peer hospital notified to complete Razorpay Escrow payment.', 'success');
  };

  // Reject incoming request
  const rejectRequest = (requestId: string, reason: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: 'rejected', decisionAt: new Date().toISOString(), rejectionReason: reason }
          : r
      )
    );
    addToast(`Requisition rejected. Reason: "${reason}" logged in compliance record.`, 'info');
  };

  // Razorpay payment checkout
  const payWithRazorpay = (requestId: string, method: string) => {
    const req = requests.find((r) => r.id === requestId);
    if (!req) return;

    const orderId = `order_medex_${Date.now().toString().slice(-6)}`;
    const paymentId = `pay_live_${Math.floor(10000000 + Math.random() * 90000000)}`;
    const invoiceNumber = `TAX-INV-2026-${Date.now().toString().slice(-4)}`;
    const shipmentId = `TRK-MED-${Math.floor(1000 + Math.random() * 9000)}`;

    const paymentDetails = {
      orderId,
      paymentId,
      method: `Razorpay Escrow (${method})`,
      paidAt: new Date().toISOString(),
      invoiceNumber,
      receiptUrl: `RECEIPT-${paymentId}.pdf`,
      taxAmount: Math.round(req.totalAmount * 0.05),
      concessionSaved: Math.round(req.totalAmount * 0.4)
    };

    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'paid',
              paymentDetails,
              shipmentId
            }
          : r
      )
    );

    // Create live tracking
    const newTracking: ShipmentTracking = {
      id: `trk_${Date.now()}`,
      shipmentId,
      requestId,
      medicineName: req.medicineName,
      batchNumber: req.batchNumber,
      quantity: req.quantity,
      storageCondition: req.storageCondition,
      originHospital: req.sellerHospitalName,
      destinationHospital: req.requesterHospitalName,
      courierPartner: 'BlueDart Bio-Express Pharma Dedicated Fleet',
      courierContact: '+91 98101 22941 (HazMat Lead: Suresh Kumar)',
      sensorId: `IOT-TEMP-SENS-${Math.floor(1000 + Math.random() * 9000)}`,
      currentTemp: req.storageCondition.includes('Cold') ? 4.1 : 21.5,
      tempStatus: 'normal',
      expectedDelivery: 'Today, within 4 hours (Priority Cold-Chain)',
      currentLocation: 'Transit Staging Bay — Dispatched with thermal seal',
      latitude: 28.5522,
      longitude: 77.2515,
      checkpoints: [
        {
          stage: 'manifest_created',
          title: 'Escrow Confirmed & Cold-Chain Manifest Generated',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          location: `${req.sellerHospitalName} Logistics Gate`,
          tempRecorded: req.storageCondition.includes('Cold') ? 3.9 : 21.0,
          verifiedBy: 'Razorpay Escrow & CDSCO Verified Gate',
          done: true
        },
        {
          stage: 'pickup_verified',
          title: 'Thermal Packout & Courier Handoff',
          timestamp: 'Scheduled in 30 mins',
          location: `${req.sellerHospitalName} Central Bay`,
          done: false
        },
        {
          stage: 'in_transit',
          title: 'Live IoT Telemetry Monitoring (Temp & GPS)',
          timestamp: 'Pending Dispatch',
          location: 'NCR Priority Transit Green Corridor',
          done: false
        },
        {
          stage: 'delivered',
          title: 'Destination Pharmacy Receipt & Seal Inspection',
          timestamp: 'Pending Delivery',
          location: `${req.requesterHospitalName} Pharmacy Receiving Dock`,
          done: false
        }
      ]
    };

    setTrackingList((prev) => [newTracking, ...prev]);
    addToast(
      `Payment of ₹${req.netPayable.toLocaleString()} captured via Razorpay. Order #${orderId} locked in Escrow. Shipment #${shipmentId} initialized.`,
      'success'
    );
  };

  // Admin Override
  const adminOverrideMedicine = (medicineId: string, updates: Partial<MedicineItem>) => {
    setMedicines((prev) =>
      prev.map((m) => (m.id === medicineId ? { ...m, ...updates } : m))
    );
    addToast(`Admin Override: Batch data modified with CDSCO audit log recorded.`, 'info');
  };

  // Admin Verification of Hospital
  const adminApproveHospital = (hospitalId: string) => {
    setHospitals((prev) =>
      prev.map((h) =>
        h.id === hospitalId
          ? {
              ...h,
              status: 'verified',
              complianceDocs: {
                ...h.complianceDocs,
                verifiedAt: new Date().toISOString(),
                notes: 'All licenses verified against State Drug Controller Form 20B registry.'
              }
            }
          : h
      )
    );
    addToast('Hospital approved and verified! Member granted immediate network trading credentials.', 'success');
  };

  const adminRejectHospital = (hospitalId: string, reason: string) => {
    setHospitals((prev) =>
      prev.map((h) =>
        h.id === hospitalId
          ? {
              ...h,
              status: 'rejected',
              complianceDocs: {
                ...h.complianceDocs,
                notes: `Verification rejected: ${reason}`
              }
            }
          : h
      )
    );
    addToast(`Hospital registration rejected. Compliance notice dispatched.`, 'warning');
  };

  const updateHospitalDetails = (hospitalId: string, updates: Partial<Hospital>) => {
    setHospitals((prev) =>
      prev.map((h) => (h.id === hospitalId ? { ...h, ...updates } : h))
    );
    addToast('Hospital institutional profile updated successfully.', 'success');
  };

  // Sign-off biomedical waste
  const signOffBiomedicalWaste = (manifestId: string, certNumber: string, signedBy: string) => {
    setWasteManifests((prev) =>
      prev.map((m) =>
        m.id === manifestId
          ? {
              ...m,
              status: 'certified',
              certificateNumber: certNumber,
              signedOffBy: signedBy,
              certifiedAt: new Date().toISOString()
            }
          : m
      )
    );
    addToast(`Destruction Certificate #${certNumber} generated and cryptographically stamped under CPCB 2016 Rules.`, 'success');
  };

  // Submit Feedback
  const submitFeedback = (data: {
    category: HospitalFeedback['category'];
    priority: HospitalFeedback['priority'];
    subject: string;
    description: string;
  }) => {
    const newTkt: HospitalFeedback = {
      id: `tkt_${Date.now()}`,
      ticketNumber: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      hospitalId: currentHospital.id,
      hospitalName: currentHospital.name,
      category: data.category,
      priority: data.priority,
      subject: data.subject,
      description: data.description,
      createdAt: new Date().toISOString(),
      status: 'open',
      sentiment: data.priority === 'critical' ? 'negative' : 'neutral'
    };
    setFeedbackTickets((prev) => [newTkt, ...prev]);
    addToast(`Ticket #${newTkt.ticketNumber} filed with Central Compliance Desk. SLA response: < 2 hours.`, 'success');
  };

  const resolveFeedback = (ticketId: string, notes: string) => {
    setFeedbackTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'resolved', adminNotes: notes } : t))
    );
    addToast('Ticket marked as resolved and resolution note logged.', 'success');
  };

  const registerHospital = (formData: any) => {
    const newHosp: Hospital = {
      id: `hosp_${Date.now()}`,
      name: formData.hospitalName,
      regNo: formData.regNo,
      officerName: formData.officerName,
      officerDesignation: formData.officerDesignation || 'Authorized Nodal Officer',
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pinCode: formData.pinCode,
      status: 'pending',
      coldStorageFacility: formData.coldStorageFacility ?? true,
      totalSurplusListed: 0,
      totalTransfersCompleted: 0,
      complianceDocs: {
        regCertUrl: 'UPLOADED-REG-CERT.pdf',
        drugLicenseUrl: 'UPLOADED-FORM20B.pdf',
        gstinCertUrl: 'UPLOADED-GSTIN.pdf',
        boardResolutionUrl: 'UPLOADED-BOARD-AUTH.pdf',
        uploadedAt: new Date().toISOString(),
        notes: 'Submitted for queue review.'
      }
    };
    setHospitals((prev) => [...prev, newHosp]);
    addToast('Hospital registration submitted successfully! Placed in Admin Verification Queue.', 'success');
    navigate('/auth/signin');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentHospital,
        activePath,
        navigate,
        toasts,
        addToast,
        removeToast,
        hospitals,
        medicines,
        requests,
        trackingList,
        wasteManifests,
        feedbackTickets,
        addMedicine,
        routeToDisposal,
        requestTransfer,
        acceptRequest,
        rejectRequest,
        payWithRazorpay,
        adminOverrideMedicine,
        adminApproveHospital,
        adminRejectHospital,
        updateHospitalDetails,
        signOffBiomedicalWaste,
        submitFeedback,
        resolveFeedback,
        registerHospital
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
