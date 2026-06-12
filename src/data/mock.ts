export const APP_NOW = new Date("2026-06-11T19:20:00+05:30");

export type Role =
  | "DigiTathya Super Admin"
  | "Brand Admin"
  | "Manufacturer L1 Approver"
  | "Manufacturer L2 Approver"
  | "Contract Manufacturer"
  | "Manufacturer Field Operator";

export type Capability =
  | "view"
  | "generateQr"
  | "approveL1"
  | "approveL2"
  | "activateQr"
  | "manageDispatch"
  | "decideReturns"
  | "manageRecalls"
  | "manageMasters"
  | "manageSettings"
  | "manageUsers";

export type Brand = {
  id: string;
  name: string;
  code: string;
  gstin: string;
  pan: string;
  regdAddress: string;
  logoText: string;
  status: "Active" | "Inactive";
  createdAt: string;
};

export type OrgUnit = {
  id: string;
  name: string;
  type: "Company" | "Plant" | "Warehouse";
  parentId?: string;
  city: string;
  state: string;
  status: "Active" | "Inactive";
};

export type CatalogNode = {
  id: string;
  name: string;
  type: "Category" | "Subcategory" | "Product" | "Variant";
  parentId?: string;
  status: "Active" | "Archived";
};

export type QrLevel = "Unit" | "Box" | "Carton" | "Pallet";
export type SkuStatus = "Active" | "Inactive";
export type BatchStatus = "Open" | "Closed" | "Archived";
export type QrStatus = "Pending Activation" | "Active" | "In Circulation" | "Frozen" | "Expired" | "Recalled" | "Returned" | "Voided";
export type DispatchStatus = "DRAFT" | "PENDING" | "IN_TRANSIT" | "DELIVERED" | "DISPUTED" | "CANCELLED";
export type ReturnStatus = "REQUESTED" | "APPROVED" | "REJECTED";
export type RecallStatus = "ACTIVE" | "CLOSED";

export type Sku = {
  id: string;
  variantId: string;
  code: string;
  name: string;
  mrp: number;
  volume: string;
  gtin?: string;
  shelfLifeDays: number;
  expiryLevel: "SKU" | "Batch";
  status: SkuStatus;
  packaging: {
    unitPerBox: number;
    boxPerCarton: number;
    cartonPerPallet: number;
    qrEnabled: QrLevel[];
    cascadingScan: QrLevel[];
  };
  attributes: Array<{ id: string; key: string; value: string }>;
  versions: Array<{ id: string; what: string; actor: string; time: string }>;
};

export type Batch = {
  id: string;
  skuId: string;
  number: string;
  mfgDate: string;
  expiryDate: string;
  status: BatchStatus;
  plannedSize: number;
  currentUnits: number;
  dispatchBlocked?: boolean;
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

export type GenerationRequest = {
  id: string;
  requester: string;
  skuId: string;
  batchId: string;
  plantId: string;
  levels: QrLevel[];
  quantity: number;
  plannedQuantity: number;
  date: string;
  status: "Pending Activation" | "L2 Pending" | "Approved - Awaiting Activation" | "Active" | "Rejected";
  route: "L1" | "L1 -> L2";
  qrSerials: string[];
  downloads: Array<{ actor: string; time: string }>;
  approvals: Array<{ step: string; actor: string; status: "Done" | "Waiting" | "Rejected"; timestamp?: string; reason?: string }>;
};

export type Dispatch = {
  id: string;
  slipNo: string;
  partnerId: string;
  originId: string;
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
  resolution?: string;
  lines: Array<{ skuId: string; batchId: string; units: number; serials: string[] }>;
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
  decidedBy?: string;
  decidedAt?: string;
  rejectionReason?: string;
  disposition?: "Restock" | "Scrap" | "Pending inspection";
};

export type Recall = {
  id: string;
  severity: "Critical" | "Standard";
  reason: "Contamination" | "Quality Defect" | "Regulatory Order" | "Labeling Error" | "Voluntary";
  scope: "By Batch" | "By SKU";
  targetBatchIds: string[];
  targetSkuIds: string[];
  targetSerials: string[];
  status: RecallStatus;
  startedAt: string;
  closedAt?: string;
  closedBy?: string;
  closureNote?: string;
  partnerResponses: Array<{ partnerId: string; unitsHeld: number; response: "SILENT" | "Acknowledge" | "Quarantine" | "Return"; returned: number; acknowledgedAt?: string; daysOverdue: number }>;
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
  kycVerified: boolean;
  geofence: Array<[number, number]>;
};

export type InternalUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "Active" | "Invited" | "Inactive";
};

export type Checkpoint = {
  id: string;
  name: string;
  sequence: number;
  enabled: boolean;
  complianceThreshold: number;
  current: number;
};

export type Alert = {
  id: string;
  type: "Expiry Approaching" | "Product Expired" | "Low Scan Compliance" | "Recall Acknowledgment Pending" | "Suspected Duplicate / Tamper" | "Route Deviation";
  severity: "Critical" | "Warning" | "Info";
  title: string;
  body: string;
  timestamp: string;
  link: string;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
  resolutionNote?: string;
};

export type ScanEvent = {
  id: string;
  serial: string;
  action: string;
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

export type AuditEntry = {
  id: string;
  timestamp: string;
  actor: string;
  role: Role;
  module: string;
  action: string;
  entityId: string;
  reason?: string;
  detail?: string;
};

export type Settings = {
  expiryThreshold: number;
  complianceThreshold: number;
  recallSlaHours: number;
  l2QuantityBand: number;
  cascadingDefaults: boolean;
  scanResultFields: string[];
  notificationPreferences: string[];
  alertRules: Record<string, { enabled: boolean; threshold?: number }>;
};

export const brand: Brand = {
  id: "brand-cropshield",
  name: "CropShield Agro Pvt Ltd",
  code: "CS",
  gstin: "27AAHCC7788F1Z6",
  pan: "AAHCC7788F",
  regdAddress: "Plot 18, Chakan MIDC, Pune, Maharashtra 410501",
  logoText: "DT",
  status: "Active",
  createdAt: APP_NOW.toISOString(),
};

export const orgUnits: OrgUnit[] = [
  { id: "ou-company", name: "CropShield Agro Pvt Ltd", type: "Company", city: "Pune", state: "MH", status: "Active" },
  { id: "ou-pune-plant", name: "Pune Factory", type: "Plant", parentId: "ou-company", city: "Pune", state: "MH", status: "Active" },
  { id: "ou-vadodara-plant", name: "Vadodara Plant", type: "Plant", parentId: "ou-company", city: "Vadodara", state: "GJ", status: "Active" },
  { id: "ou-pune-wh", name: "Pune Finished Goods Warehouse", type: "Warehouse", parentId: "ou-pune-plant", city: "Pune", state: "MH", status: "Active" },
  { id: "ou-vadodara-wh", name: "Vadodara Warehouse", type: "Warehouse", parentId: "ou-vadodara-plant", city: "Vadodara", state: "GJ", status: "Active" },
];

export const catalog: CatalogNode[] = [
  { id: "cat-agro", name: "Agrochemicals", type: "Category", status: "Active" },
  { id: "sub-bio", name: "Bio Pesticides", type: "Subcategory", parentId: "cat-agro", status: "Active" },
  { id: "sub-soil", name: "Soil Care", type: "Subcategory", parentId: "cat-agro", status: "Active" },
  { id: "prod-neem", name: "NeemGuard", type: "Product", parentId: "sub-bio", status: "Active" },
  { id: "prod-soilmax", name: "SoilMax", type: "Product", parentId: "sub-soil", status: "Active" },
  { id: "prod-fungioff", name: "FungiOff", type: "Product", parentId: "sub-bio", status: "Active" },
  { id: "var-plus", name: "Plus", type: "Variant", parentId: "prod-neem", status: "Active" },
  { id: "var-biostim", name: "BioStim", type: "Variant", parentId: "prod-soilmax", status: "Active" },
  { id: "var-granules", name: "Granules", type: "Variant", parentId: "prod-fungioff", status: "Active" },
  { id: "var-tracetag", name: "TraceTag", type: "Variant", parentId: "prod-neem", status: "Active" },
];

export const skus: Sku[] = [
  { id: "sku-ngp-500", variantId: "var-plus", code: "NGP-500", name: "NeemGuard Plus 500ml", mrp: 420, volume: "500ml", gtin: "8908012345012", shelfLifeDays: 365, expiryLevel: "Batch", status: "Active", packaging: { unitPerBox: 12, boxPerCarton: 2, cartonPerPallet: 30, qrEnabled: ["Unit", "Box", "Carton", "Pallet"], cascadingScan: ["Box", "Carton", "Pallet"] }, attributes: [{ id: "a1", key: "CIB&RC Reg No", value: "CIB-BP-4472" }, { id: "a2", key: "HSN", value: "3808" }], versions: [] },
  { id: "sku-smb-1l", variantId: "var-biostim", code: "SMB-1L", name: "SoilMax BioStim 1L", mrp: 680, volume: "1L", gtin: "8908012345111", shelfLifeDays: 540, expiryLevel: "Batch", status: "Active", packaging: { unitPerBox: 6, boxPerCarton: 2, cartonPerPallet: 24, qrEnabled: ["Unit", "Carton", "Pallet"], cascadingScan: ["Carton", "Pallet"] }, attributes: [{ id: "a3", key: "Organic Input", value: "Yes" }], versions: [] },
  { id: "sku-fgo-250", variantId: "var-granules", code: "FGO-250", name: "FungiOff Granules 250g", mrp: 260, volume: "250g", shelfLifeDays: 365, expiryLevel: "SKU", status: "Active", packaging: { unitPerBox: 24, boxPerCarton: 2, cartonPerPallet: 40, qrEnabled: ["Unit", "Carton"], cascadingScan: ["Carton"] }, attributes: [{ id: "a4", key: "HSN", value: "3808" }], versions: [] },
  { id: "sku-cst-tag", variantId: "var-tracetag", code: "CST-TAG", name: "CropShield TraceTag", mrp: 4, volume: "Label", shelfLifeDays: 730, expiryLevel: "SKU", status: "Active", packaging: { unitPerBox: 1000, boxPerCarton: 5, cartonPerPallet: 20, qrEnabled: ["Unit", "Box", "Carton"], cascadingScan: ["Box", "Carton"] }, attributes: [{ id: "a5", key: "Material", value: "Tamper-evident label" }], versions: [] },
];

export const batches: Batch[] = [
  { id: "bat-ngp-a", skuId: "sku-ngp-500", number: "NG500-2026-04-A", mfgDate: "2026-04-18", expiryDate: "2027-04-18", status: "Open", plannedSize: 10000, currentUnits: 5720 },
  { id: "bat-ngp-b", skuId: "sku-ngp-500", number: "NG500-2025-06-X", mfgDate: "2025-06-02", expiryDate: "2026-06-20", status: "Closed", plannedSize: 6000, currentUnits: 430 },
  { id: "bat-smb-a", skuId: "sku-smb-1l", number: "SM1L-2026-03-C", mfgDate: "2026-03-06", expiryDate: "2027-08-28", status: "Open", plannedSize: 8500, currentUnits: 6880 },
  { id: "bat-smb-b", skuId: "sku-smb-1l", number: "SM1L-2025-01-E", mfgDate: "2025-01-14", expiryDate: "2026-07-08", status: "Closed", plannedSize: 4200, currentUnits: 210 },
  { id: "bat-fgo-a", skuId: "sku-fgo-250", number: "FGO250-2026-02-B", mfgDate: "2026-02-11", expiryDate: "2027-02-11", status: "Open", plannedSize: 12000, currentUnits: 9110 },
  { id: "bat-fgo-exp", skuId: "sku-fgo-250", number: "FGO250-2025-04-Z", mfgDate: "2025-04-02", expiryDate: "2026-04-02", status: "Archived", plannedSize: 3000, currentUnits: 96, dispatchBlocked: true },
  { id: "bat-cst-a", skuId: "sku-cst-tag", number: "CST-2026-05-B", mfgDate: "2026-05-03", expiryDate: "2028-05-03", status: "Open", plannedSize: 50000, currentUnits: 50000 },
  { id: "bat-cst-b", skuId: "sku-cst-tag", number: "CST-2025-12-A", mfgDate: "2025-12-15", expiryDate: "2027-12-15", status: "Closed", plannedSize: 25000, currentUnits: 17200 },
];

const unitSerials = ["DT-7k3m9q", "DT-7k3m9r", "DT-7k3m9s", "DT-7k3m9t", "DT-7k3m9u", "DT-7k3m9v", "DT-7k3m9w", "DT-7k3m9x", "DT-7k3m9y", "DT-7k3m9z", "DT-8a2p1a", "DT-8a2p1b", "DT-8a2p1c", "DT-8a2p1d", "DT-8a2p1e", "DT-8a2p1f", "DT-8a2p1g", "DT-8a2p1h", "DT-8a2p1i", "DT-8a2p1j", "DT-9b4r2a", "DT-9b4r2b", "DT-9b4r2c", "DT-9b4r2d", "DT-9b4r2e", "DT-9b4r2f", "DT-9b4r2g", "DT-9b4r2h", "DT-9b4r2i", "DT-9b4r2j"];

export const qrs: Qr[] = [
  ...unitSerials.map((serial, index): Qr => ({ serial, uuid: `uuid-ng-${index}`, skuId: "sku-ngp-500", batchId: "bat-ngp-a", level: "Unit", parentSerial: index < 12 ? "BX-NG-0001" : index < 24 ? "BX-NG-0002" : "BX-NG-0003", children: [], status: index === 0 ? "Recalled" : index === 1 ? "Returned" : index === 2 ? "Frozen" : index < 8 ? "Active" : "In Circulation", holderId: index < 18 ? "p-dis-mahaagro" : "p-dea-vidarbha", generationRequestId: "gr-260611-001", dispatchId: "ds-2606110007" })),
  { serial: "BX-NG-0001", uuid: "uuid-box-1", skuId: "sku-ngp-500", batchId: "bat-ngp-a", level: "Box", parentSerial: "CT-NG-0001", children: unitSerials.slice(0, 12), status: "Recalled", holderId: "p-dis-mahaagro", generationRequestId: "gr-260611-001", dispatchId: "ds-2606110007" },
  { serial: "BX-NG-0002", uuid: "uuid-box-2", skuId: "sku-ngp-500", batchId: "bat-ngp-a", level: "Box", parentSerial: "CT-NG-0001", children: unitSerials.slice(12, 24), status: "In Circulation", holderId: "p-dis-mahaagro", generationRequestId: "gr-260611-001", dispatchId: "ds-2606110007" },
  { serial: "BX-NG-0003", uuid: "uuid-box-3", skuId: "sku-ngp-500", batchId: "bat-ngp-a", level: "Box", parentSerial: "CT-NG-0002", children: unitSerials.slice(24), status: "In Circulation", holderId: "p-dea-vidarbha", generationRequestId: "gr-260611-001", dispatchId: "ds-2606110007" },
  { serial: "CT-NG-0001", uuid: "uuid-carton-1", skuId: "sku-ngp-500", batchId: "bat-ngp-a", level: "Carton", parentSerial: "PL-NG-0001", children: ["BX-NG-0001", "BX-NG-0002"], status: "Recalled", holderId: "p-dis-mahaagro", generationRequestId: "gr-260611-001", dispatchId: "ds-2606110007" },
  { serial: "CT-NG-0002", uuid: "uuid-carton-2", skuId: "sku-ngp-500", batchId: "bat-ngp-a", level: "Carton", parentSerial: "PL-NG-0001", children: ["BX-NG-0003"], status: "In Circulation", holderId: "p-dea-vidarbha", generationRequestId: "gr-260611-001", dispatchId: "ds-2606110007" },
  { serial: "PL-NG-0001", uuid: "uuid-pallet-1", skuId: "sku-ngp-500", batchId: "bat-ngp-a", level: "Pallet", children: ["CT-NG-0001", "CT-NG-0002"], status: "Recalled", holderId: "p-dis-mahaagro", generationRequestId: "gr-260611-001", dispatchId: "ds-2606110007" },
  ...["DT-SM-1001", "DT-SM-1002", "DT-SM-1003", "DT-SM-1004", "DT-SM-1005", "DT-SM-1006"].map((serial, index): Qr => ({ serial, uuid: `uuid-sm-${index}`, skuId: "sku-smb-1l", batchId: "bat-smb-a", level: "Unit", parentSerial: "CT-SM-001", children: [], status: index === 5 ? "Voided" : "In Circulation", holderId: "p-dea-vidarbha", generationRequestId: "gr-260611-002", dispatchId: "ds-2606100019" })),
  { serial: "CT-SM-001", uuid: "uuid-sm-carton", skuId: "sku-smb-1l", batchId: "bat-smb-a", level: "Carton", children: ["DT-SM-1001", "DT-SM-1002", "DT-SM-1003", "DT-SM-1004", "DT-SM-1005", "DT-SM-1006"], status: "In Circulation", holderId: "p-dea-vidarbha", generationRequestId: "gr-260611-002", dispatchId: "ds-2606100019" },
  { serial: "DT-EXP-01", uuid: "uuid-exp", skuId: "sku-ngp-500", batchId: "bat-ngp-b", level: "Unit", children: [], status: "Expired", holderId: "p-ret-kisan", generationRequestId: "gr-260611-001", dispatchId: "ds-2606090031" },
  { serial: "DT-VOID-01", uuid: "uuid-void", skuId: "sku-ngp-500", batchId: "bat-ngp-a", level: "Unit", children: [], status: "Voided", holderId: "brand-cropshield", generationRequestId: "gr-260611-001" },
];

export const generationRequests: GenerationRequest[] = [
  { id: "gr-260611-001", requester: "Asha Iyer", skuId: "sku-ngp-500", batchId: "bat-ngp-a", plantId: "ou-pune-plant", levels: ["Unit", "Box", "Carton", "Pallet"], quantity: 10000, plannedQuantity: 10000, date: APP_NOW.toISOString(), status: "Approved - Awaiting Activation", route: "L1", qrSerials: qrs.filter((qr) => qr.generationRequestId === "gr-260611-001").map((qr) => qr.serial), downloads: [], approvals: [{ step: "Generated", actor: "Asha Iyer", status: "Done", timestamp: APP_NOW.toISOString() }, { step: "L1 approval", actor: "Dev Mehta", status: "Done", timestamp: APP_NOW.toISOString() }] },
  { id: "gr-260611-002", requester: "Sunrise Formulations", skuId: "sku-smb-1l", batchId: "bat-smb-a", plantId: "ou-vadodara-plant", levels: ["Unit", "Carton"], quantity: 28500, plannedQuantity: 28500, date: APP_NOW.toISOString(), status: "Pending Activation", route: "L1 -> L2", qrSerials: qrs.filter((qr) => qr.generationRequestId === "gr-260611-002").map((qr) => qr.serial), downloads: [], approvals: [{ step: "Generated", actor: "Sunrise Formulations", status: "Done", timestamp: APP_NOW.toISOString() }, { step: "L1 approval", actor: "Dev Mehta", status: "Waiting" }] },
];

export const partners: Partner[] = [
  { id: "p-cm-sunrise", code: "CM-GJ-000012", name: "Sunrise Formulations", type: "Contract Mfr", state: "GJ", city: "Vadodara", phone: "+91 98765 11001", email: "ops@sunriseform.in", gstin: "24AAGCS1299L1Z8", pan: "AAGCS1299L", status: "Active", compliance: 88, kycVerified: true, geofence: [[22.301, 73.18], [22.304, 73.196], [22.292, 73.202]] },
  { id: "p-dis-mahaagro", code: "DIS-MH-000045", name: "MahaAgro Distributors", type: "Distributor", state: "MH", city: "Nagpur", phone: "+91 98230 55421", email: "admin@mahaagro.in", gstin: "27AAFCM7001R1Z5", pan: "AAFCM7001R", status: "Active", compliance: 94, kycVerified: true, geofence: [[21.145, 79.082], [21.151, 79.104], [21.133, 79.113]] },
  { id: "p-dis-bharat", code: "DIS-MP-000031", name: "Bharat Krishi Supply", type: "Distributor", state: "MP", city: "Indore", phone: "+91 97555 77881", email: "stock@bharatkrishi.in", gstin: "23AABCB8722F1Z3", pan: "AABCB8722F", status: "Active", compliance: 81, kycVerified: true, geofence: [[22.719, 75.852], [22.731, 75.873], [22.706, 75.878]] },
  { id: "p-dea-vidarbha", code: "DEA-MH-000219", name: "Vidarbha Agro Dealer", type: "Dealer", state: "MH", city: "Akola", phone: "+91 99222 66331", email: "owner@vidarbhaagro.in", gstin: "27AAVFV4302M1Z2", pan: "AAVFV4302M", status: "Active", compliance: 72, parentId: "p-dis-mahaagro", kycVerified: true, geofence: [[20.702, 77.004], [20.713, 77.019], [20.694, 77.024]] },
  { id: "p-dea-narmada", code: "DEA-GJ-000144", name: "Narmada Farm Inputs", type: "Dealer", state: "GJ", city: "Anand", phone: "+91 90990 11022", email: "trade@narmadainputs.in", gstin: "24AANFN2190C1Z1", pan: "AANFN2190C", status: "Pending", compliance: 69, parentId: "p-dis-bharat", kycVerified: true, geofence: [[22.554, 72.945], [22.567, 72.958], [22.548, 72.967]] },
  { id: "p-ret-kisan", code: "RET-MH-000884", name: "Kisan Retail Point", type: "Retailer", state: "MH", city: "Nashik", phone: "+91 88888 47321", email: "counter@kisanretail.in", gstin: "27AAKFK3309N1Z7", pan: "AAKFK3309N", status: "Active", compliance: 61, parentId: "p-dea-vidarbha", kycVerified: true, geofence: [[20.001, 73.776], [20.012, 73.789], [19.993, 73.794]] },
  { id: "p-ret-shetkari", code: "RET-MP-000312", name: "Shetkari Seva Kendra", type: "Retailer", state: "MP", city: "Ujjain", phone: "+91 90090 45009", email: "desk@shetkariseva.in", gstin: "23AASFS0021H1Z4", pan: "AASFS0021H", status: "Suspended", compliance: 54, parentId: "p-dea-narmada", kycVerified: false, geofence: [[23.176, 75.781], [23.189, 75.796], [23.169, 75.802]] },
];

export const dispatches: Dispatch[] = [
  { id: "ds-2606110007", slipNo: "DS-2606110007", partnerId: "p-dis-mahaagro", originId: "ou-pune-plant", status: "IN_TRANSIT", plannedDate: "2026-06-11", transporter: "Nagpur Roadlines", vehicleNo: "MH31 AB 4401", route: ["Pune Factory", "MahaAgro Distributors"], manifestSerials: ["PL-NG-0001", "CT-NG-0001", "DT-7k3m9q"], expectedCount: 30, receivedCount: 0, variance: 0, lines: [{ skuId: "sku-ngp-500", batchId: "bat-ngp-a", units: 30, serials: ["PL-NG-0001", "CT-NG-0001", "CT-NG-0002"] }] },
  { id: "ds-2606100019", slipNo: "DS-2606100019", partnerId: "p-dea-vidarbha", originId: "ou-pune-plant", status: "DISPUTED", plannedDate: "2026-06-10", actualDate: "2026-06-11", transporter: "Akola Express", vehicleNo: "MH30 C 2109", route: ["Nagpur", "Akola"], manifestSerials: ["CT-SM-001"], expectedCount: 2112, receivedCount: 2098, variance: 14, lines: [{ skuId: "sku-smb-1l", batchId: "bat-smb-a", units: 2112, serials: ["CT-SM-001"] }] },
  { id: "ds-2606090031", slipNo: "DS-2606090031", partnerId: "p-ret-kisan", originId: "ou-pune-plant", status: "DELIVERED", plannedDate: "2026-06-09", actualDate: "2026-06-09", route: ["Akola", "Nashik"], manifestSerials: ["DT-EXP-01"], expectedCount: 42, receivedCount: 42, variance: 0, lines: [{ skuId: "sku-ngp-500", batchId: "bat-ngp-b", units: 42, serials: ["DT-EXP-01"] }] },
  { id: "ds-2606120001", slipNo: "DS-2606120001", partnerId: "p-dis-bharat", originId: "ou-pune-plant", status: "DRAFT", plannedDate: "2026-06-12", route: ["Pune", "Indore"], manifestSerials: [], expectedCount: 96, receivedCount: 0, variance: 0, lines: [{ skuId: "sku-fgo-250", batchId: "bat-fgo-a", units: 96, serials: [] }] },
  { id: "ds-2606110011", slipNo: "DS-2606110011", partnerId: "p-dea-narmada", originId: "ou-vadodara-plant", status: "PENDING", plannedDate: "2026-06-12", route: ["Indore", "Anand"], manifestSerials: [], expectedCount: 120, receivedCount: 0, variance: 0, lines: [{ skuId: "sku-fgo-250", batchId: "bat-fgo-a", units: 120, serials: [] }] },
  { id: "ds-2606080004", slipNo: "DS-2606080004", partnerId: "p-ret-shetkari", originId: "ou-vadodara-plant", status: "CANCELLED", plannedDate: "2026-06-08", route: ["Anand", "Ujjain"], manifestSerials: [], expectedCount: 24, receivedCount: 0, variance: 0, lines: [{ skuId: "sku-smb-1l", batchId: "bat-smb-a", units: 24, serials: [] }] },
];

export const returns: ReturnRequest[] = [
  { id: "RR-260611-001", initiatorId: "p-dea-vidarbha", skuId: "sku-ngp-500", batchId: "bat-ngp-a", serials: ["DT-7k3m9r"], units: 1, reason: "Recall", status: "REQUESTED", location: "Akola, MH", timestamp: APP_NOW.toISOString(), linkedDispatchId: "ds-2606110007" },
  { id: "RR-260610-014", initiatorId: "p-ret-kisan", skuId: "sku-ngp-500", batchId: "bat-ngp-b", serials: ["DT-EXP-01"], units: 1, reason: "Expired", status: "APPROVED", location: "Nashik, MH", timestamp: APP_NOW.toISOString(), linkedDispatchId: "ds-2606090031", decidedBy: "Ananya Rao", decidedAt: APP_NOW.toISOString(), disposition: "Scrap" },
  { id: "RR-260609-008", initiatorId: "p-dis-mahaagro", skuId: "sku-smb-1l", batchId: "bat-smb-a", serials: ["DT-SM-1006"], units: 1, reason: "Damaged", status: "REJECTED", location: "Nagpur, MH", timestamp: APP_NOW.toISOString(), linkedDispatchId: "ds-2606100019", decidedBy: "Ananya Rao", decidedAt: APP_NOW.toISOString(), rejectionReason: "Condition mismatch" },
  { id: "RR-260608-003", initiatorId: "p-ret-shetkari", skuId: "sku-fgo-250", batchId: "bat-fgo-exp", serials: [], units: 1, reason: "Wrong Product", status: "REQUESTED", location: "Ujjain, MP", timestamp: APP_NOW.toISOString() },
  { id: "RR-D2C-260607-001", initiatorId: "consumer", skuId: "sku-ngp-500", batchId: "bat-ngp-a", serials: ["DT-7k3m9q"], units: 1, reason: "Quality Issue", status: "APPROVED", location: "Pune, MH", timestamp: APP_NOW.toISOString(), consumerName: "Amit Patil", decidedBy: "Ananya Rao", decidedAt: APP_NOW.toISOString(), disposition: "Pending inspection" },
];

export const recalls: Recall[] = [
  { id: "RCL-260611-02", severity: "Critical", reason: "Labeling Error", scope: "By Batch", targetBatchIds: ["bat-ngp-a"], targetSkuIds: [], targetSerials: qrs.filter((qr) => qr.batchId === "bat-ngp-a").map((qr) => qr.serial), status: "ACTIVE", startedAt: APP_NOW.toISOString(), partnerResponses: [{ partnerId: "p-dis-mahaagro", unitsHeld: 18, response: "Acknowledge", returned: 1, acknowledgedAt: APP_NOW.toISOString(), daysOverdue: 0 }, { partnerId: "p-dea-vidarbha", unitsHeld: 12, response: "SILENT", returned: 0, daysOverdue: 4 }] },
  { id: "RCL-260405-01", severity: "Standard", reason: "Quality Defect", scope: "By SKU", targetBatchIds: ["bat-fgo-exp"], targetSkuIds: ["sku-fgo-250"], targetSerials: ["DT-EXP-01"], status: "CLOSED", startedAt: "2026-04-05T10:00:00+05:30", closedAt: "2026-04-12T18:00:00+05:30", closedBy: "Ananya Rao", closureNote: "Returned material reconciled.", partnerResponses: [{ partnerId: "p-ret-kisan", unitsHeld: 96, response: "Return", returned: 96, acknowledgedAt: "2026-04-05T13:00:00+05:30", daysOverdue: 0 }] },
];

export const checkpoints: Checkpoint[] = [
  { id: "cp-factory", name: "Factory Exit", sequence: 1, enabled: true, complianceThreshold: 70, current: 96 },
  { id: "cp-distributor", name: "Distributor Receive", sequence: 2, enabled: true, complianceThreshold: 70, current: 88 },
  { id: "cp-dealer", name: "Dealer Dispatch", sequence: 3, enabled: true, complianceThreshold: 70, current: 74 },
  { id: "cp-retail", name: "Retail Verify", sequence: 4, enabled: true, complianceThreshold: 70, current: 61 },
];

export const alerts: Alert[] = [
  { id: "al-1", type: "Suspected Duplicate / Tamper", severity: "Critical", title: "Duplicate scan for DT-7k3m9q", body: "Nagpur and Mumbai scans are impossible within 8 minutes.", timestamp: APP_NOW.toISOString(), link: "/app/track/DT-7k3m9q", resolved: false },
  { id: "al-2", type: "Recall Acknowledgment Pending", severity: "Critical", title: "Vidarbha Agro Dealer silent on recall", body: "Acknowledgment pending beyond SLA.", timestamp: APP_NOW.toISOString(), link: "/app/recalls/RCL-260611-02", resolved: false },
  { id: "al-3", type: "Route Deviation", severity: "Critical", title: "Dispatch DS-2606100019 route deviation", body: "Expected Nagpur to Akola path was not followed.", timestamp: APP_NOW.toISOString(), link: "/app/dispatch/DS-2606100019", resolved: false },
  { id: "al-4", type: "Expiry Approaching", severity: "Warning", title: "NG500-2025-06-X near expiry", body: "Batch crossed threshold.", timestamp: APP_NOW.toISOString(), link: "/app/expiry", resolved: false },
  { id: "al-5", type: "Product Expired", severity: "Warning", title: "FGO250-2025-04-Z expired", body: "Expired units remain scannable.", timestamp: APP_NOW.toISOString(), link: "/app/expiry", resolved: false },
  { id: "al-6", type: "Low Scan Compliance", severity: "Warning", title: "Retail verify below threshold", body: "Nashik retail verify scans at 61%.", timestamp: APP_NOW.toISOString(), link: "/app/analytics", resolved: false },
];

export const scanEvents: ScanEvent[] = [
  { id: "se-1", serial: "DT-7k3m9q", action: "Activate", actor: "Dev Mehta", role: "Manufacturer L1 Approver", entityId: "brand-cropshield", place: "Pune Factory", timestamp: APP_NOW.toISOString(), gpsAccuracy: 8, viaParent: "BX-NG-0001" },
  { id: "se-2", serial: "DT-7k3m9q", action: "Dispatch", actor: "Meera Pawar", role: "Manufacturer Field Operator", entityId: "brand-cropshield", place: "Pune Factory", timestamp: APP_NOW.toISOString(), gpsAccuracy: 9, viaParent: "PL-NG-0001" },
  { id: "se-3", serial: "DT-7k3m9q", action: "Verify", actor: "Unknown Device", role: "Manufacturer Field Operator", entityId: "p-ret-shetkari", place: "Mumbai, MH", timestamp: APP_NOW.toISOString(), gpsAccuracy: 78, flagged: true, note: "Delhi to Mumbai in 8 min impossible travel" },
];

export const internalUsers: InternalUser[] = [
  { id: "u-1", name: "Ananya Rao", email: "ananya@cropshield.in", role: "Brand Admin", status: "Active" },
  { id: "u-2", name: "Dev Mehta", email: "dev@cropshield.in", role: "Manufacturer L1 Approver", status: "Active" },
  { id: "u-3", name: "Kavita Shah", email: "kavita@cropshield.in", role: "Manufacturer L2 Approver", status: "Active" },
  { id: "u-4", name: "Meera Pawar", email: "meera@cropshield.in", role: "Manufacturer Field Operator", status: "Active" },
  { id: "u-5", name: "Irfan Shaikh", email: "irfan@sunriseform.in", role: "Contract Manufacturer", status: "Active" },
  { id: "u-6", name: "DigiTathya Ops", email: "ops@digitathya.in", role: "DigiTathya Super Admin", status: "Active" },
  { id: "u-7", name: "Rohan Kale", email: "rohan@cropshield.in", role: "Brand Admin", status: "Invited" },
  { id: "u-8", name: "Pooja Nair", email: "pooja@cropshield.in", role: "Manufacturer L1 Approver", status: "Inactive" },
  { id: "u-9", name: "Gaurav Bansal", email: "gaurav@cropshield.in", role: "Manufacturer Field Operator", status: "Active" },
  { id: "u-10", name: "Nikita S", email: "nikita@cropshield.in", role: "Brand Admin", status: "Active" },
];

export const settings: Settings = {
  expiryThreshold: 70,
  complianceThreshold: 70,
  recallSlaHours: 4,
  l2QuantityBand: 10000,
  cascadingDefaults: true,
  scanResultFields: ["SKU name", "batch", "expiry", "mfg date", "current status"],
  notificationPreferences: ["bell", "push"],
  alertRules: {
    "Expiry Approaching": { enabled: true, threshold: 70 },
    "Product Expired": { enabled: true },
    "Low Scan Compliance": { enabled: true, threshold: 70 },
    "Recall Acknowledgment Pending": { enabled: true, threshold: 4 },
    "Suspected Duplicate / Tamper": { enabled: true, threshold: 2 },
    "Route Deviation": { enabled: true },
  },
};

export const auditLog: AuditEntry[] = Array.from({ length: 10 }, (_, index) => ({
  id: `audit-seed-${index + 1}`,
  timestamp: new Date(APP_NOW.getTime() - index * 3600000).toISOString(),
  actor: index % 2 ? "Ananya Rao" : "Dev Mehta",
  role: index % 2 ? "Brand Admin" : "Manufacturer L1 Approver",
  module: ["QR", "Dispatch", "Returns", "Partners", "Settings"][index % 5],
  action: ["Created", "Approved", "Updated", "Resolved", "Exported"][index % 5],
  entityId: ["gr-260611-001", "DS-2606110007", "RR-260611-001", "p-dis-mahaagro", "settings"][index % 5],
  detail: "Seeded historical activity",
}));
