import { createContext, useContext, useMemo, useReducer } from "react";
import type { ReactNode } from "react";
import * as seed from "./mock";
import type {
  Alert,
  AuditEntry,
  Batch,
  Brand,
  Capability,
  CatalogNode,
  Checkpoint,
  Dispatch,
  DispatchStatus,
  GenerationRequest,
  InternalUser,
  OrgUnit,
  Partner,
  Qr,
  QrStatus,
  Recall,
  ReturnRequest,
  Role,
  ScanEvent,
  Settings,
  Sku,
} from "./mock";

export const APP_NOW = seed.APP_NOW;

export function fmtIST(input: string | Date) {
  const date = typeof input === "string" ? new Date(input) : input;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  }).format(date).replace(",", "") + " IST";
}

export function fmtDate(input: string | Date) {
  const date = typeof input === "string" ? new Date(input) : input;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

export const CAPABILITIES: Capability[] = ["view", "generateQr", "approveL1", "approveL2", "activateQr", "manageDispatch", "decideReturns", "manageRecalls", "manageMasters", "manageSettings", "manageUsers"];

export const PERMISSIONS: Record<Role, Capability[]> = {
  "DigiTathya Super Admin": CAPABILITIES,
  "Brand Admin": CAPABILITIES,
  "Manufacturer L1 Approver": ["view", "approveL1"],
  "Manufacturer L2 Approver": ["view", "approveL2"],
  "Contract Manufacturer": ["view", "generateQr"],
  "Manufacturer Field Operator": ["view", "manageDispatch"],
};

export function can(role: Role, capability: Capability) {
  return PERMISSIONS[role].includes(capability);
}

export const TRANSITIONS = {
  qr: {
    "Pending Activation": ["Active", "Voided"],
    Active: ["In Circulation", "Frozen", "Recalled", "Expired", "Voided"],
    "In Circulation": ["Frozen", "Recalled", "Returned", "Expired", "Voided"],
    Frozen: ["In Circulation", "Voided", "Recalled"],
    Recalled: ["Returned", "Voided"],
    Returned: [],
    Expired: ["Returned", "Voided"],
    Voided: [],
  } satisfies Record<QrStatus, QrStatus[]>,
  dispatch: {
    DRAFT: ["PENDING", "CANCELLED"],
    PENDING: ["IN_TRANSIT", "CANCELLED"],
    IN_TRANSIT: ["DELIVERED", "DISPUTED"],
    DISPUTED: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: [],
  } satisfies Record<DispatchStatus, DispatchStatus[]>,
  return: { REQUESTED: ["APPROVED", "REJECTED"], APPROVED: [], REJECTED: [] },
  recall: { ACTIVE: ["CLOSED"], CLOSED: [] },
  batch: { Open: ["Closed"], Closed: ["Archived"], Archived: [] },
  sku: { Active: ["Inactive"], Inactive: ["Active"] },
};

export type AppState = {
  brand: Brand;
  orgUnits: OrgUnit[];
  catalog: CatalogNode[];
  skus: Sku[];
  batches: Batch[];
  qrs: Qr[];
  generationRequests: GenerationRequest[];
  dispatches: Dispatch[];
  returns: ReturnRequest[];
  recalls: Recall[];
  alerts: Alert[];
  partners: Partner[];
  internalUsers: InternalUser[];
  settings: Settings;
  checkpoints: Checkpoint[];
  scanEvents: ScanEvent[];
  auditLog: AuditEntry[];
  role: Role;
};

type Action =
  | { type: "SET_ROLE"; role: Role }
  | { type: "PATCH"; patch: Partial<AppState>; audit?: Omit<AuditEntry, "id" | "timestamp" | "role"> }
  | { type: "TRANSITION_QR"; serial: string; to: QrStatus; reason: string; note?: string }
  | { type: "TRANSITION_DISPATCH"; id: string; to: DispatchStatus; reason: string; note?: string }
  | { type: "AUDIT"; entry: Omit<AuditEntry, "id" | "timestamp" | "role"> };

const initialState: AppState = {
  brand: seed.brand,
  orgUnits: seed.orgUnits,
  catalog: seed.catalog,
  skus: seed.skus,
  batches: seed.batches,
  qrs: seed.qrs,
  generationRequests: seed.generationRequests,
  dispatches: seed.dispatches,
  returns: seed.returns,
  recalls: seed.recalls,
  alerts: seed.alerts,
  partners: seed.partners,
  internalUsers: seed.internalUsers,
  settings: seed.settings,
  checkpoints: seed.checkpoints,
  scanEvents: seed.scanEvents,
  auditLog: seed.auditLog,
  role: "Brand Admin",
};

function actorForRole(state: AppState) {
  return state.internalUsers.find((user) => user.role === state.role && user.status === "Active")?.name ?? state.role;
}

function audit(state: AppState, entry: Omit<AuditEntry, "id" | "timestamp" | "role">): AuditEntry {
  return {
    ...entry,
    id: `audit-${state.auditLog.length + 1}-${Date.now()}`,
    timestamp: APP_NOW.toISOString(),
    role: state.role,
  };
}

function reducer(state: AppState, action: Action): AppState {
  if (action.type === "SET_ROLE") return { ...state, role: action.role };
  if (action.type === "AUDIT") return { ...state, auditLog: [audit(state, action.entry), ...state.auditLog] };
  if (action.type === "PATCH") {
    const patched = { ...state, ...action.patch };
    return action.audit ? { ...patched, auditLog: [audit(state, action.audit), ...state.auditLog] } : patched;
  }
  if (action.type === "TRANSITION_QR") {
    const qr = state.qrs.find((item) => item.serial === action.serial);
    if (!qr || !(TRANSITIONS.qr[qr.status] as QrStatus[]).includes(action.to)) {
      return {
        ...state,
        auditLog: [audit(state, { actor: actorForRole(state), module: "QR", action: "Rejected transition", entityId: action.serial, reason: action.reason, detail: qr ? `${qr.status} to ${action.to}` : "Unknown QR" }), ...state.auditLog],
      };
    }
    const actor = actorForRole(state);
    return {
      ...state,
      qrs: state.qrs.map((item) => item.serial === action.serial ? { ...item, status: action.to } : item),
      scanEvents: [{ id: `se-${state.scanEvents.length + 1}`, serial: action.serial, action: action.to, actor, role: state.role, entityId: qr.holderId, place: "Dashboard", timestamp: APP_NOW.toISOString(), gpsAccuracy: 0, note: `${action.reason}${action.note ? ` / ${action.note}` : ""}` }, ...state.scanEvents],
      auditLog: [audit(state, { actor, module: "QR", action: `Transition to ${action.to}`, entityId: action.serial, reason: action.reason, detail: action.note }), ...state.auditLog],
    };
  }
  if (action.type === "TRANSITION_DISPATCH") {
    const dispatch = state.dispatches.find((item) => item.id === action.id || item.slipNo === action.id);
    if (!dispatch || !(TRANSITIONS.dispatch[dispatch.status] as DispatchStatus[]).includes(action.to)) {
      return state;
    }
    const next = { ...dispatch, status: action.to, receivedCount: action.to === "DELIVERED" ? dispatch.expectedCount : dispatch.receivedCount, variance: action.to === "DELIVERED" && dispatch.status !== "DISPUTED" ? 0 : dispatch.variance };
    return {
      ...state,
      dispatches: state.dispatches.map((item) => item.id === dispatch.id ? next : item),
      auditLog: [audit(state, { actor: actorForRole(state), module: "Dispatch", action: `Transition to ${action.to}`, entityId: dispatch.slipNo, reason: action.reason, detail: action.note }), ...state.auditLog],
    };
  }
  return state;
}

const StoreContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action>; selectors: ReturnType<typeof makeSelectors> } | null>(null);

function makeSelectors(state: AppState) {
  const enabledCheckpoints = state.checkpoints.filter((checkpoint) => checkpoint.enabled);
  const activeRecall = state.recalls.find((recall) => recall.status === "ACTIVE");
  const nearExpiryBatches = state.batches.filter((batch) => {
    const sku = state.skus.find((item) => item.id === batch.skuId);
    if (!sku) return false;
    const mfg = new Date(batch.mfgDate).getTime();
    const expiry = new Date(batch.expiryDate).getTime();
    const consumed = ((APP_NOW.getTime() - mfg) / Math.max(1, expiry - mfg)) * 100;
    return consumed >= state.settings.expiryThreshold && APP_NOW < new Date(batch.expiryDate);
  });
  return {
    activeQrs: state.qrs.filter((qr) => qr.status === "Active" || qr.status === "In Circulation").length,
    pendingActivations: state.generationRequests.filter((request) => request.status === "Pending Activation" || request.status === "L2 Pending").length,
    unresolvedTamper: state.alerts.filter((alert) => alert.type === "Suspected Duplicate / Tamper" && !alert.resolved).length,
    recallPending: state.recalls.filter((recall) => recall.status === "ACTIVE").reduce((sum, recall) => sum + recall.partnerResponses.filter((row) => row.response === "SILENT").length, 0),
    nearExpiryBatches,
    scanCompliance: enabledCheckpoints.length ? enabledCheckpoints.reduce((sum, checkpoint) => sum + checkpoint.current, 0) / enabledCheckpoints.length : 0,
    activeRecall,
    searchIndex: [
      ...state.qrs.map((qr) => ({ type: "QR", label: qr.serial, path: `/app/track/${qr.serial}`, meta: state.skus.find((sku) => sku.id === qr.skuId)?.name ?? "" })),
      ...state.partners.map((partner) => ({ type: "Partner", label: partner.name, path: `/app/partners/${partner.id}`, meta: partner.code })),
      ...state.dispatches.map((dispatch) => ({ type: "Dispatch", label: dispatch.slipNo, path: `/app/dispatch/${dispatch.slipNo}`, meta: dispatch.status })),
      ...state.recalls.map((recall) => ({ type: "Recall", label: recall.id, path: `/app/recalls/${recall.id}`, meta: recall.severity })),
    ],
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const selectors = useMemo(() => makeSelectors(state), [state]);
  return <StoreContext.Provider value={{ state, dispatch, selectors }}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside StoreProvider");
  return context;
}

export function getSku(state: AppState, id: string) {
  return state.skus.find((sku) => sku.id === id);
}

export function getBatch(state: AppState, id: string) {
  return state.batches.find((batch) => batch.id === id);
}

export function getPartner(state: AppState, id: string) {
  return state.partners.find((partner) => partner.id === id);
}

export function getDispatch(state: AppState, id: string) {
  return state.dispatches.find((dispatch) => dispatch.id === id || dispatch.slipNo === id);
}

export function actorName(state: AppState) {
  return actorForRole(state);
}
