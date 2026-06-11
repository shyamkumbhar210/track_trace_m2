export type Role =
  | "Brand Admin"
  | "Manufacturer L1 Approver"
  | "Manufacturer L2 Approver"
  | "Contract Manufacturer"
  | "Manufacturer Field Operator"
  | "Distributor Admin"
  | "Dealer Admin"
  | "Retailer Admin"
  | "Partner Operator";

export type Surface = "app" | "partner" | "mobile";
export type QrStatus =
  | "Pending Activation"
  | "Active"
  | "In Circulation"
  | "Frozen"
  | "Expired"
  | "Recalled"
  | "Returned"
  | "Voided"
  | "Not Activated"
  | "Not Recognized";
export type QrLevel = "Unit" | "Box" | "Carton" | "Pallet";
export type DispatchStatus = "DRAFT" | "PENDING" | "IN_TRANSIT" | "DELIVERED" | "DISPUTED" | "CANCELLED";
export type ReturnStatus = "REQUESTED" | "APPROVED" | "REJECTED";
export type RecallSeverity = "Critical" | "Standard";
export type AlertType =
  | "Expiry Approaching"
  | "Product Expired"
  | "Low Scan Compliance"
  | "Recall Acknowledgment Pending"
  | "Suspected Duplicate / Tamper"
  | "Route Deviation";

export type Manufacturer = {
  id: string;
  name: string;
  code: string;
  logo: string;
  settings: {
    expiryThreshold: number;
    complianceThreshold: number;
    recallSlaHours: number;
    l2QuantityBand: number;
  };
};

export type Partner = {
  id: string;
  code: string;
  name: string;
  type: "Contract Mfr" | "Distributor" | "Dealer" | "Retailer";
  state: string;
  city: string;
  phone: string;
  email: string;
  gstin: string;
  pan: string;
  status: "Pending" | "Active" | "Suspended" | "Inactive" | "Rejected";
  compliance: number;
  parentId?: string;
  multiManufacturer?: boolean;
  kycVerified: boolean;
  geofence: Array<[number, number]>;
};

export type Sku = {
  id: string;
  code: string;
  name: string;
  category: string;
  subCategory: string;
  variant: string;
  mrp: number;
  volume: string;
  gtin?: string;
  shelfLifeDays: number;
  expiryLevel: "SKU" | "Batch";
  status: "Active" | "Inactive";
  images: string[];
  packaging: {
    unitPerBox: number;
    boxPerCarton: number;
    cartonPerPallet: number;
    qrEnabled: QrLevel[];
    cascadingScan: QrLevel[];
  };
};

export type Batch = {
  id: string;
  skuId: string;
  number: string;
  mfgDate: string;
  expiryDate: string;
  status: "Open" | "Closed" | "Archived";
  plannedSize: number;
  currentUnits: number;
};

export type Qr = {
  serial: string;
  uuid: string;
  skuId: string;
  batchId: string;
  level: QrLevel;
  parentSerial?: string;
  children: string[];
  status: QrStatus;
  holderId: string;
  generationRequestId: string;
  dispatchId?: string;
};

export type ScanEvent = {
  id: string;
  serial: string;
  action: "Receive" | "Dispatch" | "Return" | "Verify" | "Pack" | "Activate" | "Void" | "Freeze";
  actor: string;
  role: Role;
  entityId: string;
  place: string;
  timestamp: string;
  gpsAccuracy: number;
  viaParent?: string;
  flagged?: boolean;
  note?: string;
};

export type GenerationRequest = {
  id: string;
  requester: string;
  skuId: string;
  batchId: string;
  levels: QrLevel[];
  quantity: number;
  date: string;
  status: "Pending Activation" | "Active" | "Failed" | "Rejected";
  route: "L1" | "L1 -> L2";
  qrSerials: string[];
  approvals: Array<{ step: string; actor: string; status: "Done" | "Waiting" | "Rejected"; timestamp?: string; reason?: string }>;
};

export type Dispatch = {
  id: string;
  slipNo: string;
  partnerId: string;
  fromId: string;
  status: DispatchStatus;
  plannedDate: string;
  actualDate?: string;
  transporter?: string;
  vehicleNo?: string;
  route: string[];
  manifestSerials: string[];
  expectedCount: number;
  receivedCount: number;
  variance: number;
  lines: Array<{ skuId: string; batchId: string; cartons: number; units: number; serials: string[] }>;
};

export type ReturnRequest = {
  id: string;
  initiatorId: string;
  skuId: string;
  batchId: string;
  serials: string[];
  units: number;
  reason: "Damaged" | "Expired" | "Wrong Product" | "Quality Issue" | "Recall" | "Other";
  status: ReturnStatus;
  location: string;
  timestamp: string;
  linkedDispatchId?: string;
  consumerName?: string;
};

export type Recall = {
  id: string;
  severity: RecallSeverity;
  reason: "Contamination" | "Quality Defect" | "Regulatory Order" | "Labeling Error" | "Voluntary";
  scope: "By Batch" | "By SKU" | "By Serial Range";
  targetBatchIds: string[];
  targetSerials: string[];
  status: "ACTIVE" | "IN_PROGRESS" | "CLOSED";
  startedAt: string;
  closedAt?: string;
  partnerResponses: Array<{ partnerId: string; unitsHeld: number; response: "Acknowledge" | "Quarantine" | "Return" | "Silent"; returned: number; acknowledgedAt?: string; daysOverdue: number }>;
};

export type Alert = {
  id: string;
  type: AlertType;
  severity: "Critical" | "Warning" | "Info";
  title: string;
  body: string;
  timestamp: string;
  link: string;
  resolved: boolean;
  serial?: string;
};

export const manufacturer: Manufacturer = {
  id: "mfg-cropshield",
  name: "CropShield",
  code: "CS",
  logo: "/digitathya-logo.png",
  settings: {
    expiryThreshold: 70,
    complianceThreshold: 70,
    recallSlaHours: 4,
    l2QuantityBand: 10000,
  },
};

export const internalUsers = [
  { id: "u-1", name: "Ananya Rao", email: "ananya@cropshield.in", role: "Brand Admin" as Role, status: "Active" },
  { id: "u-2", name: "Dev Mehta", email: "dev@cropshield.in", role: "Manufacturer L1 Approver" as Role, status: "Active" },
  { id: "u-3", name: "Kavita Shah", email: "kavita@cropshield.in", role: "Manufacturer L2 Approver" as Role, status: "Active" },
  { id: "u-4", name: "Meera Pawar", email: "meera@cropshield.in", role: "Manufacturer Field Operator" as Role, status: "Active" },
  { id: "u-5", name: "Rohan Kale", email: "rohan@cropshield.in", role: "Brand Admin" as Role, status: "Invited" },
  { id: "u-6", name: "Irfan Shaikh", email: "irfan@sunriseform.in", role: "Contract Manufacturer" as Role, status: "Active" },
  { id: "u-7", name: "Asha Iyer", email: "asha@cropshield.in", role: "Brand Admin" as Role, status: "Active" },
  { id: "u-8", name: "Pooja Nair", email: "pooja@cropshield.in", role: "Manufacturer L1 Approver" as Role, status: "Suspended" },
  { id: "u-9", name: "Gaurav Bansal", email: "gaurav@cropshield.in", role: "Manufacturer Field Operator" as Role, status: "Active" },
  { id: "u-10", name: "Nikita S", email: "nikita@cropshield.in", role: "Brand Admin" as Role, status: "Active" },
];

export const partners: Partner[] = [
  {
    id: "p-cm-sunrise",
    code: "CM-GJ-000012",
    name: "Sunrise Formulations",
    type: "Contract Mfr",
    state: "GJ",
    city: "Vadodara",
    phone: "+91 98765 11001",
    email: "ops@sunriseform.in",
    gstin: "24AAGCS1299L1Z8",
    pan: "AAGCS1299L",
    status: "Active",
    compliance: 88,
    kycVerified: true,
    geofence: [
      [22.301, 73.18],
      [22.304, 73.196],
      [22.292, 73.202],
      [22.287, 73.184],
    ],
  },
  {
    id: "p-dis-mahaagro",
    code: "DIS-MH-000045",
    name: "MahaAgro Distributors",
    type: "Distributor",
    state: "MH",
    city: "Nagpur",
    phone: "+91 98230 55421",
    email: "admin@mahaagro.in",
    gstin: "27AAFCM7001R1Z5",
    pan: "AAFCM7001R",
    status: "Active",
    compliance: 94,
    kycVerified: true,
    geofence: [
      [21.145, 79.082],
      [21.151, 79.104],
      [21.133, 79.113],
      [21.127, 79.089],
    ],
  },
  {
    id: "p-dis-bharat",
    code: "DIS-MP-000031",
    name: "Bharat Krishi Supply",
    type: "Distributor",
    state: "MP",
    city: "Indore",
    phone: "+91 97555 77881",
    email: "stock@bharatkrishi.in",
    gstin: "23AABCB8722F1Z3",
    pan: "AABCB8722F",
    status: "Active",
    compliance: 81,
    kycVerified: true,
    geofence: [
      [22.719, 75.852],
      [22.731, 75.873],
      [22.706, 75.878],
      [22.699, 75.858],
    ],
  },
  {
    id: "p-dea-vidarbha",
    code: "DEA-MH-000219",
    name: "Vidarbha Agro Dealer",
    type: "Dealer",
    state: "MH",
    city: "Akola",
    phone: "+91 99222 66331",
    email: "owner@vidarbhaagro.in",
    gstin: "27AAVFV4302M1Z2",
    pan: "AAVFV4302M",
    status: "Active",
    compliance: 72,
    parentId: "p-dis-mahaagro",
    kycVerified: true,
    geofence: [
      [20.702, 77.004],
      [20.713, 77.019],
      [20.694, 77.024],
      [20.688, 77.01],
    ],
  },
  {
    id: "p-dea-narmada",
    code: "DEA-GJ-000144",
    name: "Narmada Farm Inputs",
    type: "Dealer",
    state: "GJ",
    city: "Anand",
    phone: "+91 90990 11022",
    email: "trade@narmadainputs.in",
    gstin: "24AANFN2190C1Z1",
    pan: "AANFN2190C",
    status: "Pending",
    compliance: 69,
    parentId: "p-dis-bharat",
    kycVerified: true,
    geofence: [
      [22.554, 72.945],
      [22.567, 72.958],
      [22.548, 72.967],
      [22.54, 72.949],
    ],
  },
  {
    id: "p-ret-kisan",
    code: "RET-MH-000884",
    name: "Kisan Retail Point",
    type: "Retailer",
    state: "MH",
    city: "Nashik",
    phone: "+91 88888 47321",
    email: "counter@kisanretail.in",
    gstin: "27AAKFK3309N1Z7",
    pan: "AAKFK3309N",
    status: "Active",
    parentId: "p-dea-vidarbha",
    multiManufacturer: true,
    compliance: 61,
    kycVerified: true,
    geofence: [
      [20.001, 73.776],
      [20.012, 73.789],
      [19.993, 73.794],
      [19.986, 73.781],
    ],
  },
  {
    id: "p-ret-shetkari",
    code: "RET-MP-000312",
    name: "Shetkari Seva Kendra",
    type: "Retailer",
    state: "MP",
    city: "Ujjain",
    phone: "+91 90090 45009",
    email: "desk@shetkariseva.in",
    gstin: "23AASFS0021H1Z4",
    pan: "AASFS0021H",
    status: "Suspended",
    parentId: "p-dea-narmada",
    compliance: 54,
    kycVerified: false,
    geofence: [
      [23.176, 75.781],
      [23.189, 75.796],
      [23.169, 75.802],
      [23.161, 75.785],
    ],
  },
];

export const skus: Sku[] = [
  {
    id: "sku-ngp-500",
    code: "NGP-500",
    name: "NeemGuard Plus 500ml",
    category: "Agrochemicals",
    subCategory: "Bio Pesticides",
    variant: "Plus",
    mrp: 420,
    volume: "500ml",
    gtin: "8908012345012",
    shelfLifeDays: 365,
    expiryLevel: "Batch",
    status: "Active",
    images: ["front", "back", "seal"],
    packaging: { unitPerBox: 12, boxPerCarton: 2, cartonPerPallet: 30, qrEnabled: ["Unit", "Box", "Carton", "Pallet"], cascadingScan: ["Box", "Carton", "Pallet"] },
  },
  {
    id: "sku-smb-1l",
    code: "SMB-1L",
    name: "SoilMax BioStim 1L",
    category: "Agrochemicals",
    subCategory: "Bio Stimulants",
    variant: "BioStim",
    mrp: 680,
    volume: "1L",
    gtin: "8908012345111",
    shelfLifeDays: 540,
    expiryLevel: "Batch",
    status: "Active",
    images: ["front", "carton"],
    packaging: { unitPerBox: 6, boxPerCarton: 2, cartonPerPallet: 24, qrEnabled: ["Unit", "Carton", "Pallet"], cascadingScan: ["Carton", "Pallet"] },
  },
  {
    id: "sku-fgo-250",
    code: "FGO-250",
    name: "FungiOff Granules 250g",
    category: "Agrochemicals",
    subCategory: "Fungicides",
    variant: "Granules",
    mrp: 260,
    volume: "250g",
    gtin: "8908012345227",
    shelfLifeDays: 365,
    expiryLevel: "SKU",
    status: "Active",
    images: ["front", "label"],
    packaging: { unitPerBox: 24, boxPerCarton: 2, cartonPerPallet: 40, qrEnabled: ["Unit", "Carton"], cascadingScan: ["Carton"] },
  },
  {
    id: "sku-cst-tag",
    code: "CST-TAG",
    name: "CropShield TraceTag",
    category: "Packaging",
    subCategory: "Security Labels",
    variant: "Tamper Seal",
    mrp: 4,
    volume: "Label",
    shelfLifeDays: 730,
    expiryLevel: "SKU",
    status: "Active",
    images: ["roll"],
    packaging: { unitPerBox: 1000, boxPerCarton: 5, cartonPerPallet: 20, qrEnabled: ["Unit", "Box", "Carton"], cascadingScan: ["Box", "Carton"] },
  },
];

export const batches: Batch[] = [
  { id: "bat-ngp-a", skuId: "sku-ngp-500", number: "NG500-2026-04-A", mfgDate: "2026-04-18", expiryDate: "2027-04-18", status: "Open", plannedSize: 10000, currentUnits: 5720 },
  { id: "bat-ngp-b", skuId: "sku-ngp-500", number: "NG500-2025-06-X", mfgDate: "2025-06-02", expiryDate: "2026-06-20", status: "Closed", plannedSize: 6000, currentUnits: 430 },
  { id: "bat-smb-a", skuId: "sku-smb-1l", number: "SM1L-2026-03-C", mfgDate: "2026-03-06", expiryDate: "2027-08-28", status: "Open", plannedSize: 8500, currentUnits: 6880 },
  { id: "bat-smb-b", skuId: "sku-smb-1l", number: "SM1L-2025-01-E", mfgDate: "2025-01-14", expiryDate: "2026-07-08", status: "Closed", plannedSize: 4200, currentUnits: 210 },
  { id: "bat-fgo-a", skuId: "sku-fgo-250", number: "FGO250-2026-02-B", mfgDate: "2026-02-11", expiryDate: "2027-02-11", status: "Open", plannedSize: 12000, currentUnits: 9110 },
  { id: "bat-fgo-exp", skuId: "sku-fgo-250", number: "FGO250-2025-04-Z", mfgDate: "2025-04-02", expiryDate: "2026-04-02", status: "Archived", plannedSize: 3000, currentUnits: 96 },
  { id: "bat-cst-a", skuId: "sku-cst-tag", number: "CST-2026-05-B", mfgDate: "2026-05-03", expiryDate: "2028-05-03", status: "Open", plannedSize: 50000, currentUnits: 50000 },
  { id: "bat-cst-b", skuId: "sku-cst-tag", number: "CST-2025-12-A", mfgDate: "2025-12-15", expiryDate: "2027-12-15", status: "Closed", plannedSize: 25000, currentUnits: 17200 },
];

const baseSerials = [
  "DT-7k3m9q",
  "DT-7k3m9r",
  "DT-7k3m9s",
  "DT-7k3m9t",
  "DT-7k3m9u",
  "DT-7k3m9v",
  "DT-7k3m9w",
  "DT-7k3m9x",
  "DT-7k3m9y",
  "DT-7k3m9z",
  "DT-8a2p1a",
  "DT-8a2p1b",
  "DT-8a2p1c",
  "DT-8a2p1d",
  "DT-8a2p1e",
  "DT-8a2p1f",
  "DT-8a2p1g",
  "DT-8a2p1h",
  "DT-8a2p1i",
  "DT-8a2p1j",
  "DT-9b4r2a",
  "DT-9b4r2b",
  "DT-9b4r2c",
  "DT-9b4r2d",
  "DT-9b4r2e",
  "DT-9b4r2f",
  "DT-9b4r2g",
  "DT-9b4r2h",
  "DT-9b4r2i",
  "DT-9b4r2j",
  "BX-NG-0001",
  "BX-NG-0002",
  "BX-NG-0003",
  "BX-NG-0004",
  "BX-NG-0005",
  "CT-NG-0001",
  "CT-NG-0002",
  "CT-NG-0003",
  "PL-NG-0001",
  "DT-SM-1001",
  "DT-SM-1002",
  "DT-SM-1003",
  "DT-SM-1004",
  "DT-SM-1005",
  "DT-SM-1006",
  "CT-SM-001",
  "PL-SM-001",
  "DT-FG-2101",
  "DT-FG-2102",
  "DT-FG-2103",
  "DT-FG-2104",
  "DT-FG-2105",
  "CT-FG-001",
  "DT-VOID-01",
  "DT-EXP-01",
  "DT-REC-01",
  "DT-FRZ-01",
  "DT-RET-01",
  "DT-NACT-01",
  "DT-UNK-01",
];

const unitGroups = {
  box1: baseSerials.slice(0, 12),
  box2: baseSerials.slice(12, 24),
  box3: baseSerials.slice(24, 30),
};

export const generationRequests: GenerationRequest[] = [
  {
    id: "gr-260611-001",
    requester: "Asha Iyer",
    skuId: "sku-ngp-500",
    batchId: "bat-ngp-a",
    levels: ["Unit", "Box", "Carton", "Pallet"],
    quantity: 10000,
    date: "2026-06-11T09:20:00+05:30",
    status: "Pending Activation",
    route: "L1",
    qrSerials: ["DT-7k3m9q", ...unitGroups.box1.slice(1), "BX-NG-0001", "CT-NG-0001", "PL-NG-0001"],
    approvals: [
      { step: "Generated", actor: "Asha Iyer", status: "Done", timestamp: "2026-06-11T09:20:00+05:30" },
      { step: "Printed", actor: "Meera Pawar", status: "Done", timestamp: "2026-06-11T10:05:00+05:30" },
      { step: "Activated", actor: "Dev Mehta", status: "Waiting" },
    ],
  },
  {
    id: "gr-260611-002",
    requester: "Sunrise Formulations",
    skuId: "sku-smb-1l",
    batchId: "bat-smb-a",
    levels: ["Unit", "Carton", "Pallet"],
    quantity: 28500,
    date: "2026-06-10T15:30:00+05:30",
    status: "Active",
    route: "L1 -> L2",
    qrSerials: ["DT-SM-1001", "DT-SM-1002", "DT-SM-1003", "CT-SM-001", "PL-SM-001"],
    approvals: [
      { step: "Generated", actor: "Sunrise Formulations", status: "Done", timestamp: "2026-06-10T15:30:00+05:30" },
      { step: "L1 approval", actor: "Dev Mehta", status: "Done", timestamp: "2026-06-10T16:08:00+05:30" },
      { step: "L2 approval", actor: "Kavita Shah", status: "Done", timestamp: "2026-06-10T16:21:00+05:30" },
    ],
  },
  {
    id: "gr-260609-003",
    requester: "Rohan Kale",
    skuId: "sku-cst-tag",
    batchId: "bat-cst-a",
    levels: ["Unit", "Box", "Carton"],
    quantity: 50000,
    date: "2026-06-09T12:00:00+05:30",
    status: "Rejected",
    route: "L1 -> L2",
    qrSerials: ["DT-NACT-01"],
    approvals: [
      { step: "Generated", actor: "Rohan Kale", status: "Done", timestamp: "2026-06-09T12:00:00+05:30" },
      { step: "L1 approval", actor: "Pooja Nair", status: "Rejected", timestamp: "2026-06-09T12:25:00+05:30", reason: "Wrong batch selected" },
    ],
  },
];

function createQrs(): Qr[] {
  const qrs: Qr[] = [];
  const add = (qr: Qr) => qrs.push(qr);
  const ngUnits = [...unitGroups.box1, ...unitGroups.box2, ...unitGroups.box3];
  ngUnits.forEach((serial, index) => {
    const parentSerial = index < 12 ? "BX-NG-0001" : index < 24 ? "BX-NG-0002" : "BX-NG-0003";
    add({
      serial,
      uuid: `uuid-ng-${index.toString().padStart(3, "0")}`,
      skuId: "sku-ngp-500",
      batchId: "bat-ngp-a",
      level: "Unit",
      parentSerial,
      children: [],
      status: serial === "DT-7k3m9q" ? "Recalled" : index === 1 ? "Returned" : index === 2 ? "Frozen" : "In Circulation",
      holderId: index < 18 ? "p-dis-mahaagro" : "p-dea-vidarbha",
      generationRequestId: "gr-260611-001",
      dispatchId: "ds-2606110007",
    });
  });
  ["BX-NG-0001", "BX-NG-0002", "BX-NG-0003"].forEach((serial, index) => {
    add({
      serial,
      uuid: `uuid-ng-box-${index}`,
      skuId: "sku-ngp-500",
      batchId: "bat-ngp-a",
      level: "Box",
      parentSerial: index < 2 ? "CT-NG-0001" : "CT-NG-0002",
      children: index === 0 ? unitGroups.box1 : index === 1 ? unitGroups.box2 : unitGroups.box3,
      status: index === 0 ? "Recalled" : "In Circulation",
      holderId: "p-dis-mahaagro",
      generationRequestId: "gr-260611-001",
      dispatchId: "ds-2606110007",
    });
  });
  add({ serial: "CT-NG-0001", uuid: "uuid-ng-carton-1", skuId: "sku-ngp-500", batchId: "bat-ngp-a", level: "Carton", parentSerial: "PL-NG-0001", children: ["BX-NG-0001", "BX-NG-0002"], status: "Recalled", holderId: "p-dis-mahaagro", generationRequestId: "gr-260611-001", dispatchId: "ds-2606110007" });
  add({ serial: "CT-NG-0002", uuid: "uuid-ng-carton-2", skuId: "sku-ngp-500", batchId: "bat-ngp-a", level: "Carton", parentSerial: "PL-NG-0001", children: ["BX-NG-0003"], status: "In Circulation", holderId: "p-dea-vidarbha", generationRequestId: "gr-260611-001", dispatchId: "ds-2606110007" });
  add({ serial: "CT-NG-0003", uuid: "uuid-ng-carton-3", skuId: "sku-ngp-500", batchId: "bat-ngp-b", level: "Carton", children: ["DT-EXP-01"], status: "Expired", holderId: "p-ret-kisan", generationRequestId: "gr-260611-001", dispatchId: "ds-2606090031" });
  add({ serial: "PL-NG-0001", uuid: "uuid-ng-pallet-1", skuId: "sku-ngp-500", batchId: "bat-ngp-a", level: "Pallet", children: ["CT-NG-0001", "CT-NG-0002"], status: "Recalled", holderId: "p-dis-mahaagro", generationRequestId: "gr-260611-001", dispatchId: "ds-2606110007" });
  ["DT-SM-1001", "DT-SM-1002", "DT-SM-1003", "DT-SM-1004", "DT-SM-1005", "DT-SM-1006"].forEach((serial, index) => {
    add({ serial, uuid: `uuid-sm-${index}`, skuId: "sku-smb-1l", batchId: "bat-smb-a", level: "Unit", parentSerial: "CT-SM-001", children: [], status: index === 5 ? "Voided" : "In Circulation", holderId: "p-dea-vidarbha", generationRequestId: "gr-260611-002", dispatchId: "ds-2606100019" });
  });
  add({ serial: "CT-SM-001", uuid: "uuid-sm-carton", skuId: "sku-smb-1l", batchId: "bat-smb-a", level: "Carton", parentSerial: "PL-SM-001", children: ["DT-SM-1001", "DT-SM-1002", "DT-SM-1003", "DT-SM-1004", "DT-SM-1005", "DT-SM-1006"], status: "In Circulation", holderId: "p-dea-vidarbha", generationRequestId: "gr-260611-002", dispatchId: "ds-2606100019" });
  add({ serial: "PL-SM-001", uuid: "uuid-sm-pallet", skuId: "sku-smb-1l", batchId: "bat-smb-a", level: "Pallet", children: ["CT-SM-001"], status: "In Circulation", holderId: "p-dea-vidarbha", generationRequestId: "gr-260611-002", dispatchId: "ds-2606100019" });
  ["DT-FG-2101", "DT-FG-2102", "DT-FG-2103", "DT-FG-2104", "DT-FG-2105"].forEach((serial, index) => {
    add({ serial, uuid: `uuid-fg-${index}`, skuId: "sku-fgo-250", batchId: index === 4 ? "bat-fgo-exp" : "bat-fgo-a", level: "Unit", parentSerial: "CT-FG-001", children: [], status: index === 4 ? "Expired" : "Active", holderId: index === 4 ? "p-ret-kisan" : "mfg-cropshield", generationRequestId: "gr-260611-001" });
  });
  add({ serial: "CT-FG-001", uuid: "uuid-fg-carton", skuId: "sku-fgo-250", batchId: "bat-fgo-a", level: "Carton", children: ["DT-FG-2101", "DT-FG-2102", "DT-FG-2103", "DT-FG-2104", "DT-FG-2105"], status: "Active", holderId: "mfg-cropshield", generationRequestId: "gr-260611-001" });
  add({ serial: "DT-VOID-01", uuid: "uuid-void", skuId: "sku-ngp-500", batchId: "bat-ngp-a", level: "Unit", children: [], status: "Voided", holderId: "mfg-cropshield", generationRequestId: "gr-260611-001" });
  add({ serial: "DT-EXP-01", uuid: "uuid-exp", skuId: "sku-ngp-500", batchId: "bat-ngp-b", level: "Unit", parentSerial: "CT-NG-0003", children: [], status: "Expired", holderId: "p-ret-kisan", generationRequestId: "gr-260611-001", dispatchId: "ds-2606090031" });
  add({ serial: "DT-REC-01", uuid: "uuid-rec", skuId: "sku-ngp-500", batchId: "bat-ngp-a", level: "Unit", children: [], status: "Recalled", holderId: "p-dea-vidarbha", generationRequestId: "gr-260611-001", dispatchId: "ds-2606110007" });
  add({ serial: "DT-FRZ-01", uuid: "uuid-frz", skuId: "sku-smb-1l", batchId: "bat-smb-a", level: "Unit", children: [], status: "Frozen", holderId: "p-dea-vidarbha", generationRequestId: "gr-260611-002", dispatchId: "ds-2606100019" });
  add({ serial: "DT-RET-01", uuid: "uuid-ret", skuId: "sku-ngp-500", batchId: "bat-ngp-a", level: "Unit", children: [], status: "Returned", holderId: "mfg-cropshield", generationRequestId: "gr-260611-001", dispatchId: "ds-2606110007" });
  add({ serial: "DT-NACT-01", uuid: "uuid-nact", skuId: "sku-cst-tag", batchId: "bat-cst-a", level: "Unit", children: [], status: "Not Activated", holderId: "mfg-cropshield", generationRequestId: "gr-260609-003" });
  add({ serial: "DT-UNK-01", uuid: "uuid-unk", skuId: "sku-cst-tag", batchId: "bat-cst-a", level: "Unit", children: [], status: "Not Recognized", holderId: "unknown", generationRequestId: "gr-260609-003" });
  return qrs;
}

export const qrs = createQrs();

export const dispatches: Dispatch[] = [
  { id: "ds-1", slipNo: "DS-2606110007", partnerId: "p-dis-mahaagro", fromId: "mfg-cropshield", status: "IN_TRANSIT", plannedDate: "2026-06-11", transporter: "Nagpur Roadlines", vehicleNo: "MH31 AB 4401", route: ["CropShield Pune Factory", "MahaAgro Nagpur DC"], manifestSerials: ["PL-NG-0001", "CT-NG-0001", "DT-7k3m9q"], expectedCount: 30, receivedCount: 0, variance: 0, lines: [{ skuId: "sku-ngp-500", batchId: "bat-ngp-a", cartons: 2, units: 30, serials: ["PL-NG-0001", "CT-NG-0001", "CT-NG-0002"] }] },
  { id: "ds-2", slipNo: "DS-2606100019", partnerId: "p-dea-vidarbha", fromId: "p-dis-mahaagro", status: "DISPUTED", plannedDate: "2026-06-10", actualDate: "2026-06-11", transporter: "Akola Express", vehicleNo: "MH30 C 2109", route: ["Nagpur", "Akola"], manifestSerials: ["PL-SM-001", "CT-SM-001"], expectedCount: 2112, receivedCount: 2098, variance: 14, lines: [{ skuId: "sku-smb-1l", batchId: "bat-smb-a", cartons: 88, units: 2112, serials: ["PL-SM-001", "CT-SM-001"] }] },
  { id: "ds-3", slipNo: "DS-2606090031", partnerId: "p-ret-kisan", fromId: "p-dea-vidarbha", status: "DELIVERED", plannedDate: "2026-06-09", actualDate: "2026-06-09", route: ["Akola", "Nashik"], manifestSerials: ["CT-NG-0003", "DT-EXP-01"], expectedCount: 42, receivedCount: 42, variance: 0, lines: [{ skuId: "sku-ngp-500", batchId: "bat-ngp-b", cartons: 1, units: 42, serials: ["CT-NG-0003", "DT-EXP-01"] }] },
  { id: "ds-4", slipNo: "DS-2606120001", partnerId: "p-dis-bharat", fromId: "mfg-cropshield", status: "DRAFT", plannedDate: "2026-06-12", route: ["Pune", "Indore"], manifestSerials: ["CT-FG-001"], expectedCount: 96, receivedCount: 0, variance: 0, lines: [{ skuId: "sku-fgo-250", batchId: "bat-fgo-a", cartons: 2, units: 96, serials: ["CT-FG-001"] }] },
  { id: "ds-5", slipNo: "DS-2606110011", partnerId: "p-dea-narmada", fromId: "p-dis-bharat", status: "PENDING", plannedDate: "2026-06-12", route: ["Indore", "Anand"], manifestSerials: ["DT-FG-2101", "DT-FG-2102"], expectedCount: 120, receivedCount: 0, variance: 0, lines: [{ skuId: "sku-fgo-250", batchId: "bat-fgo-a", cartons: 3, units: 120, serials: ["DT-FG-2101", "DT-FG-2102"] }] },
  { id: "ds-6", slipNo: "DS-2606080004", partnerId: "p-ret-shetkari", fromId: "p-dea-narmada", status: "CANCELLED", plannedDate: "2026-06-08", route: ["Anand", "Ujjain"], manifestSerials: ["DT-SM-1006"], expectedCount: 24, receivedCount: 0, variance: 0, lines: [{ skuId: "sku-smb-1l", batchId: "bat-smb-a", cartons: 1, units: 24, serials: ["DT-SM-1006"] }] },
];

export const returns: ReturnRequest[] = [
  { id: "RR-260611-001", initiatorId: "p-dea-vidarbha", skuId: "sku-ngp-500", batchId: "bat-ngp-a", serials: ["DT-7k3m9r", "DT-RET-01"], units: 2, reason: "Recall", status: "REQUESTED", location: "Akola, MH", timestamp: "2026-06-11T15:10:00+05:30", linkedDispatchId: "ds-1" },
  { id: "RR-260610-014", initiatorId: "p-ret-kisan", skuId: "sku-ngp-500", batchId: "bat-ngp-b", serials: ["DT-EXP-01"], units: 1, reason: "Expired", status: "APPROVED", location: "Nashik, MH", timestamp: "2026-06-10T11:40:00+05:30", linkedDispatchId: "ds-3" },
  { id: "RR-260609-008", initiatorId: "p-dis-mahaagro", skuId: "sku-smb-1l", batchId: "bat-smb-a", serials: ["DT-FRZ-01"], units: 1, reason: "Damaged", status: "REJECTED", location: "Nagpur, MH", timestamp: "2026-06-09T17:20:00+05:30", linkedDispatchId: "ds-2" },
  { id: "RR-260608-003", initiatorId: "p-ret-shetkari", skuId: "sku-fgo-250", batchId: "bat-fgo-exp", serials: ["DT-FG-2105"], units: 1, reason: "Wrong Product", status: "REQUESTED", location: "Ujjain, MP", timestamp: "2026-06-08T12:22:00+05:30" },
  { id: "RR-D2C-260607-001", initiatorId: "consumer", skuId: "sku-ngp-500", batchId: "bat-ngp-a", serials: ["DT-REC-01"], units: 1, reason: "Quality Issue", status: "APPROVED", location: "Pune, MH", timestamp: "2026-06-07T09:15:00+05:30", consumerName: "Amit Patil" },
];

export const recalls: Recall[] = [
  {
    id: "RCL-260611-02",
    severity: "Critical",
    reason: "Labeling Error",
    scope: "By Batch",
    targetBatchIds: ["bat-ngp-a"],
    targetSerials: qrs.filter((qr) => qr.batchId === "bat-ngp-a").map((qr) => qr.serial),
    status: "ACTIVE",
    startedAt: "2026-06-11T08:30:00+05:30",
    partnerResponses: [
      { partnerId: "p-dis-mahaagro", unitsHeld: 4200, response: "Acknowledge", returned: 58, acknowledgedAt: "2026-06-11T09:10:00+05:30", daysOverdue: 0 },
      { partnerId: "p-dea-vidarbha", unitsHeld: 1180, response: "Quarantine", returned: 36, acknowledgedAt: "2026-06-11T11:45:00+05:30", daysOverdue: 2 },
      { partnerId: "p-ret-kisan", unitsHeld: 260, response: "Silent", returned: 0, daysOverdue: 4 },
    ],
  },
  {
    id: "RCL-260405-01",
    severity: "Standard",
    reason: "Quality Defect",
    scope: "By SKU",
    targetBatchIds: ["bat-fgo-exp"],
    targetSerials: ["DT-FG-2105", "DT-EXP-01"],
    status: "CLOSED",
    startedAt: "2026-04-05T10:00:00+05:30",
    closedAt: "2026-04-12T18:00:00+05:30",
    partnerResponses: [
      { partnerId: "p-ret-kisan", unitsHeld: 96, response: "Return", returned: 96, acknowledgedAt: "2026-04-05T13:00:00+05:30", daysOverdue: 0 },
      { partnerId: "p-ret-shetkari", unitsHeld: 18, response: "Acknowledge", returned: 12, acknowledgedAt: "2026-04-06T09:20:00+05:30", daysOverdue: 1 },
    ],
  },
];

export const scanEvents: ScanEvent[] = [
  { id: "se-1", serial: "DT-7k3m9q", action: "Activate", actor: "Dev Mehta", role: "Manufacturer L1 Approver", entityId: "mfg-cropshield", place: "Pune Factory, MH", timestamp: "2026-06-11T10:05:00+05:30", gpsAccuracy: 8, viaParent: "BX-NG-0001" },
  { id: "se-2", serial: "DT-7k3m9q", action: "Pack", actor: "Meera Pawar", role: "Manufacturer Field Operator", entityId: "mfg-cropshield", place: "Pune Factory, MH", timestamp: "2026-06-11T10:28:00+05:30", gpsAccuracy: 7, viaParent: "CT-NG-0001" },
  { id: "se-3", serial: "DT-7k3m9q", action: "Dispatch", actor: "Meera Pawar", role: "Manufacturer Field Operator", entityId: "mfg-cropshield", place: "Pune Factory, MH", timestamp: "2026-06-11T11:12:00+05:30", gpsAccuracy: 9, viaParent: "PL-NG-0001" },
  { id: "se-4", serial: "DT-7k3m9q", action: "Receive", actor: "Nitin Patil", role: "Distributor Admin", entityId: "p-dis-mahaagro", place: "Nagpur, MH", timestamp: "2026-06-11T18:42:00+05:30", gpsAccuracy: 14, viaParent: "PL-NG-0001" },
  { id: "se-5", serial: "DT-7k3m9q", action: "Verify", actor: "Unknown Device", role: "Partner Operator", entityId: "p-ret-shetkari", place: "Mumbai, MH", timestamp: "2026-06-11T18:50:00+05:30", gpsAccuracy: 78, flagged: true, note: "Delhi to Mumbai in 8 min impossible travel" },
  { id: "se-6", serial: "DT-RET-01", action: "Return", actor: "Nitin Patil", role: "Dealer Admin", entityId: "p-dea-vidarbha", place: "Akola, MH", timestamp: "2026-06-11T15:10:00+05:30", gpsAccuracy: 11, note: "RR-260611-001" },
  { id: "se-7", serial: "DT-FRZ-01", action: "Freeze", actor: "Ananya Rao", role: "Brand Admin", entityId: "mfg-cropshield", place: "Dashboard", timestamp: "2026-06-09T17:50:00+05:30", gpsAccuracy: 0 },
];

export const alerts: Alert[] = [
  { id: "al-1", type: "Suspected Duplicate / Tamper", severity: "Critical", title: "Duplicate scan for DT-7k3m9q", body: "Nagpur and Mumbai scans are impossible within 8 minutes.", timestamp: "2026-06-11T18:50:00+05:30", link: "/app/track/DT-7k3m9q", resolved: false, serial: "DT-7k3m9q" },
  { id: "al-2", type: "Recall Acknowledgment Pending", severity: "Critical", title: "Kisan Retail Point silent on critical recall", body: "Acknowledgment pending beyond 4h SLA.", timestamp: "2026-06-11T14:40:00+05:30", link: "/app/recalls/RCL-260611-02", resolved: false },
  { id: "al-3", type: "Route Deviation", severity: "Critical", title: "Dispatch DS-2606100019 route deviation", body: "Expected Nagpur to Akola path was not followed.", timestamp: "2026-06-11T13:20:00+05:30", link: "/app/dispatch/ds-2", resolved: false },
  { id: "al-4", type: "Expiry Approaching", severity: "Warning", title: "NG500-2025-06-X near expiry", body: "Batch crossed 70% shelf-life threshold.", timestamp: "2026-06-11T09:00:00+05:30", link: "/app/expiry", resolved: false },
  { id: "al-5", type: "Product Expired", severity: "Warning", title: "FGO250-2025-04-Z expired", body: "Expired units remain scannable with warning.", timestamp: "2026-06-10T08:00:00+05:30", link: "/app/expiry", resolved: false },
  { id: "al-6", type: "Low Scan Compliance", severity: "Warning", title: "Retail verify checkpoint below threshold", body: "Nashik retail verify scans at 61%.", timestamp: "2026-06-10T18:00:00+05:30", link: "/app/partners/p-ret-kisan", resolved: false },
  ...Array.from({ length: 6 }, (_, index) => ({
    id: `al-extra-${index + 1}`,
    type: (["Expiry Approaching", "Product Expired", "Low Scan Compliance", "Recall Acknowledgment Pending", "Suspected Duplicate / Tamper", "Route Deviation"] as AlertType[])[index],
    severity: (index % 3 === 0 ? "Critical" : index % 3 === 1 ? "Warning" : "Info") as "Critical" | "Warning" | "Info",
    title: `Mock operational alert ${index + 1}`,
    body: `Connected alert for CropShield workflow ${index + 1}.`,
    timestamp: `2026-06-${10 - index}T10:00:00+05:30`,
    link: index % 2 === 0 ? "/app/alerts" : "/partner/events",
    resolved: index > 3,
  })),
];

export const scanResultVariants = [
  { key: "success", title: "Success", serial: "DT-7k3m9q", status: "In Circulation" as QrStatus, message: "Authentic CropShield QR. Action recorded." },
  { key: "expired", title: "Expired", serial: "DT-EXP-01", status: "Expired" as QrStatus, message: "Product expired. Scanner warning shown; brand alerted." },
  { key: "recalled", title: "Recalled", serial: "DT-REC-01", status: "Recalled" as QrStatus, message: "Critical recall active. Acknowledge or initiate return." },
  { key: "not-activated", title: "Not Activated", serial: "DT-NACT-01", status: "Not Activated" as QrStatus, message: "QR generated but not activated by approver." },
  { key: "voided", title: "Voided", serial: "DT-VOID-01", status: "Voided" as QrStatus, message: "Terminal void. Do not transact." },
  { key: "not-recognized", title: "Not Recognized", serial: "DT-UNK-01", status: "Not Recognized" as QrStatus, message: "QR not recognized in DigiTathya." },
  { key: "duplicate", title: "Duplicate in session", serial: "DT-7k3m9q", status: "Frozen" as QrStatus, message: "Already scanned in this session. Review before confirming." },
  { key: "cascade", title: "Cascade success", serial: "PL-NG-0001", status: "Recalled" as QrStatus, message: "Pallet scanned: 30 cartons, 2,880 units updated." },
];

export const getSku = (id: string) => skus.find((sku) => sku.id === id);
export const getBatch = (id: string) => batches.find((batch) => batch.id === id);
export const getPartner = (id: string) => partners.find((partner) => partner.id === id);
export const getQr = (serial: string) => qrs.find((qr) => qr.serial === serial);
export const getDispatch = (id: string) => dispatches.find((dispatch) => dispatch.id === id || dispatch.slipNo === id);
export const getRecall = (id: string) => recalls.find((recall) => recall.id === id);

export const partnerStock = partners.map((partner) => {
  const held = qrs.filter((qr) => qr.holderId === partner.id);
  return {
    partnerId: partner.id,
    rows: batches
      .map((batch) => {
        const batchHeld = held.filter((qr) => qr.batchId === batch.id);
        return {
          skuId: batch.skuId,
          batchId: batch.id,
          units: batchHeld.filter((qr) => qr.level === "Unit").length,
          serials: batchHeld.map((qr) => qr.serial),
        };
      })
      .filter((row) => row.serials.length > 0),
  };
});

export const appSearchIndex = [
  ...qrs.map((qr) => ({ type: "QR", label: qr.serial, path: `/app/track/${qr.serial}`, meta: getSku(qr.skuId)?.name ?? "" })),
  ...partners.map((partner) => ({ type: "Partner", label: partner.name, path: `/app/partners/${partner.id}`, meta: partner.code })),
  ...dispatches.map((dispatch) => ({ type: "Dispatch", label: dispatch.slipNo, path: `/app/dispatch/${dispatch.id}`, meta: dispatch.status })),
  ...recalls.map((recall) => ({ type: "Recall", label: recall.id, path: `/app/recalls/${recall.id}`, meta: recall.severity })),
];
