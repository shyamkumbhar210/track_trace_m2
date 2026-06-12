import { useState } from "react";
import { Link, Navigate, NavLink, Route, Routes, useNavigate, useParams, useSearchParams } from "react-router";
import {
  APP_NOW,
  CAPABILITIES,
  PERMISSIONS,
  actorName,
  can,
  fmtDate,
  fmtIST,
  getBatch,
  getDispatch,
  getPartner,
  getSku,
  useStore,
  StoreProvider,
  type AppState,
} from "./data/store";
import type { Batch, CatalogNode, Dispatch, GenerationRequest, InternalUser, Qr, QrLevel, Recall, ReturnRequest, Role, Sku } from "./data/mock";
import {
  ConfirmModal,
  DataTable,
  DetailDrawer,
  EmptyState,
  KpiCard,
  MockChart,
  PageHeader,
  Progress,
  SectionCard,
  StatusChip,
  StepWizard,
  Timeline,
  ToastProvider,
  useToast,
} from "./components/ui";

const roles: Role[] = ["DigiTathya Super Admin", "Brand Admin", "Manufacturer L1 Approver", "Manufacturer L2 Approver", "Contract Manufacturer", "Manufacturer Field Operator"];

const appNav = [
  ["/app/dashboard", "Dashboard"],
  ["/app/brand", "Brand"],
  ["/app/products", "Products"],
  ["/app/qr/generate", "QR Generate"],
  ["/app/qr/activation", "Activation"],
  ["/app/qr/inventory", "QR Inventory"],
  ["/app/qr/history", "History"],
  ["/app/track", "Track"],
  ["/app/dispatch", "Dispatch"],
  ["/app/returns", "Returns"],
  ["/app/recalls", "Recalls"],
  ["/app/expiry", "Expiry"],
  ["/app/partners", "Partners"],
  ["/app/alerts", "Alerts"],
  ["/app/analytics", "Analytics"],
  ["/app/audit", "Audit Log"],
  ["/app/settings", "Settings"],
  ["/app/users", "Users"],
];

const cmNav = [
  ["/app/dashboard", "Own Activity"],
  ["/app/qr/generate", "QR Generation"],
  ["/app/qr/history", "History"],
  ["/app/track", "Scan Log"],
];

export default function App() {
  return (
    <StoreProvider>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/search" element={<Shell><SearchPage /></Shell>} />
          <Route path="/app/dashboard" element={<Shell><Dashboard /></Shell>} />
          <Route path="/app/brand" element={<Shell><BrandPage /></Shell>} />
          <Route path="/app/products" element={<Shell><Products /></Shell>} />
          <Route path="/app/products/import" element={<Shell><ImportWizard title="Product bulk import" /></Shell>} />
          <Route path="/app/products/:skuId" element={<Shell><SkuDetail /></Shell>} />
          <Route path="/app/qr/generate" element={<Shell><QrGenerate /></Shell>} />
          <Route path="/app/qr/activation" element={<Shell><QrActivation /></Shell>} />
          <Route path="/app/qr/inventory" element={<Shell><QrInventory /></Shell>} />
          <Route path="/app/qr/history" element={<Shell><QrHistory /></Shell>} />
          <Route path="/app/track" element={<Shell><Track /></Shell>} />
          <Route path="/app/track/:serial" element={<Shell><Passport /></Shell>} />
          <Route path="/app/dispatch" element={<Shell><DispatchList /></Shell>} />
          <Route path="/app/dispatch/new" element={<Shell><DispatchNew /></Shell>} />
          <Route path="/app/dispatch/:id" element={<Shell><DispatchDetail /></Shell>} />
          <Route path="/app/returns" element={<Shell><Returns /></Shell>} />
          <Route path="/app/recalls" element={<Shell><RecallsPage /></Shell>} />
          <Route path="/app/recalls/new" element={<Shell><RecallNew /></Shell>} />
          <Route path="/app/recalls/:id" element={<Shell><RecallDetail /></Shell>} />
          <Route path="/app/expiry" element={<Shell><Expiry /></Shell>} />
          <Route path="/app/partners" element={<Shell><Partners /></Shell>} />
          <Route path="/app/partners/approvals" element={<Shell><PartnerApprovals /></Shell>} />
          <Route path="/app/partners/new" element={<Shell><PartnerNew /></Shell>} />
          <Route path="/app/partners/import" element={<Shell><ImportWizard title="Partner bulk upload" /></Shell>} />
          <Route path="/app/partners/contract-manufacturers" element={<Shell><ContractManufacturers /></Shell>} />
          <Route path="/app/partners/:id" element={<Shell><PartnerDetail /></Shell>} />
          <Route path="/app/alerts" element={<Shell><AlertsPage /></Shell>} />
          <Route path="/app/analytics" element={<Shell><Analytics /></Shell>} />
          <Route path="/app/audit" element={<Shell><AuditLog /></Shell>} />
          <Route path="/app/settings" element={<Shell><Settings /></Shell>} />
          <Route path="/app/users" element={<Shell><Users /></Shell>} />
          <Route path="*" element={<Shell><NotFound /></Shell>} />
        </Routes>
        <DemoControl />
      </ToastProvider>
    </StoreProvider>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  const { state, dispatch, selectors } = useStore();
  const [bellOpen, setBellOpen] = useState(false);
  const navigate = useNavigate();
  const activeRecall = selectors.activeRecall;
  const ackPct = activeRecall ? Math.round((activeRecall.partnerResponses.filter((row) => row.response !== "SILENT").length / activeRecall.partnerResponses.length) * 100) : 0;
  const nav = state.role === "Contract Manufacturer" ? cmNav : appNav;

  return (
    <div className="min-h-screen">
      <header className="glass sticky top-0 z-30 flex h-14 items-center justify-between px-4">
        <button className="flex items-center gap-3" onClick={() => navigate("/app/dashboard")}>
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--foreground)] text-sm font-black text-[var(--background)]">{state.brand.logoText}</div>
          <div className="text-left">
            <p className="font-semibold tracking-[-0.025em]">DigiTathya</p>
            <p className="text-[11px] text-[var(--muted-foreground)]">{state.brand.name} / {state.role}</p>
          </div>
        </button>
        <div className="flex items-center gap-2">
          <form
            className="hidden md:block"
            onSubmit={(event) => {
              event.preventDefault();
              const query = new FormData(event.currentTarget).get("q");
              navigate(`/search?q=${encodeURIComponent(String(query ?? ""))}`);
            }}
          >
            <input className="field h-9 w-64" name="q" placeholder="Search QR, dispatch, partner" />
          </form>
          <span className="mono hidden rounded-full bg-[var(--secondary)] px-3 py-1 lg:inline">{fmtIST(APP_NOW)}</span>
          <button className="button" onClick={() => setBellOpen(true)}>Bell {state.alerts.filter((alert) => !alert.resolved && state.settings.alertRules[alert.type]?.enabled !== false).length}</button>
          <ProfileMenu />
        </div>
      </header>
      {activeRecall ? (
        <div className="border-b border-[color-mix(in_srgb,var(--destructive)_35%,var(--border))] bg-[color-mix(in_srgb,var(--destructive)_10%,var(--card))] px-4 py-3 text-sm font-semibold text-[var(--destructive)]">
          Active Recall {activeRecall.id} / {activeRecall.scope === "By Batch" ? activeRecall.targetBatchIds.map((id) => getBatch(state, id)?.number).join(", ") : activeRecall.targetSkuIds.map((id) => getSku(state, id)?.name).join(", ")} / {ackPct}% acknowledged / <Link className="underline" to={`/app/recalls/${activeRecall.id}`}>View Recall</Link>
        </div>
      ) : null}
      <div className="mx-auto grid max-w-[1440px] gap-5 px-4 py-5 lg:grid-cols-[230px_1fr]">
        <aside className="hidden lg:block">
          <nav className="card sticky top-20 p-3">
            {nav.map(([href, label]) => (
              <NavLink key={href} to={href} className={({ isActive }) => `mb-1 block rounded-xl px-3 py-2 text-sm font-semibold ${isActive ? "bg-[var(--foreground)] text-[var(--background)]" : "hover:bg-[var(--secondary)]"}`}>
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
      <DetailDrawer open={bellOpen} onClose={() => setBellOpen(false)} title="Notifications">
        <AlertList onResolve={(alert) => dispatch({ type: "PATCH", patch: { alerts: state.alerts.map((item) => item.id === alert.id ? { ...item, resolved: true, resolvedBy: actorName(state), resolvedAt: APP_NOW.toISOString(), resolutionNote: "Resolved from bell drawer" } : item) }, audit: { actor: actorName(state), module: "Alerts", action: "Resolve", entityId: alert.id, reason: "Bell drawer", detail: alert.title } })} />
      </DetailDrawer>
    </div>
  );
}

function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="relative">
      <button className="button button-primary" onClick={() => setOpen(!open)}>AR</button>
      {open ? (
        <div className="card absolute right-0 mt-2 w-44 p-2">
          <button className="button w-full" onClick={() => navigate("/login")}>Logout</button>
        </div>
      ) : null}
    </div>
  );
}

function DemoControl() {
  const { state, dispatch } = useStore();
  return (
    <div className="fixed bottom-4 right-4 z-[80] w-[280px] rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3 shadow-[var(--shadow-md)]">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">Demo Control</p>
      <select className="field h-10" value={state.role} onChange={(event) => dispatch({ type: "SET_ROLE", role: event.target.value as Role })}>
        {roles.map((role) => <option key={role}>{role}</option>)}
      </select>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState("admin@cropshield.in");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  return (
    <div className="grid min-h-screen place-items-center p-4">
      <div className="card w-full max-w-md p-6">
        <div className="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-[var(--foreground)] font-black text-[var(--background)]">DT</div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">Login</h1>
        <p className="mb-5 mt-2 text-sm text-[var(--muted-foreground)]">Email + 6-digit OTP with resend, wrong, and expired states.</p>
        <label className="text-xs font-semibold">Email</label>
        <input className="field mt-1" value={email} onChange={(event) => setEmail(event.target.value)} />
        <label className="mt-3 block text-xs font-semibold">OTP</label>
        <input className="field mt-1" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="482910" />
        {error ? <p className="mt-2 text-sm font-semibold text-[var(--destructive)]">{error}</p> : null}
        <button className="button button-primary mt-4 w-full" onClick={() => (/^\d{6}$/.test(otp) ? navigate("/app/dashboard") : setError("Wrong OTP. Enter a 6-digit code."))}>Verify and continue</button>
        <p className="mt-4 text-xs text-[var(--muted-foreground)]">Demo states</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button className="button" onClick={() => setError("Wrong OTP. 2 attempts remaining.")}>Wrong OTP</button>
          <button className="button" onClick={() => setError("OTP expired. Resend available in 00:08.")}>Expired OTP</button>
        </div>
        <Link className="button mt-2 block text-center" to="/setup">First-run setup</Link>
      </div>
    </div>
  );
}

function Setup() {
  const [active, setActive] = useState(0);
  return (
    <div className="mx-auto max-w-5xl p-6">
      <PageHeader title="Brand onboarding" eyebrow="First run" description="Four-step setup with hierarchy lock note and default thresholds." />
      <StepWizard steps={["Brand profile", "Hierarchy template", "Defaults", "Review"]} active={active} setActive={setActive}>
        {active === 0 && <ReadFields fields={[["Brand name", "CropShield Agro Pvt Ltd"], ["Logo upload", "<=500KB"], ["Co-brand", "EF Polymer"]]} />}
        {active === 1 && <div className="grid gap-3 md:grid-cols-4">{["L1 SKU to Batch to Unit", "L2 plus Box", "L3 plus Carton", "L4 plus Pallet"].map((item) => <button className="button min-h-24 text-left" onClick={() => setActive(2)} key={item}>{item}<p className="mt-2 text-xs text-[var(--muted-foreground)]">Locked after first QR generation</p></button>)}</div>}
        {active === 2 && <ReadFields fields={[["Expiry alert threshold", "70%"], ["Compliance threshold", "70%"], ["Recall SLA", "4h"]]} />}
        {active === 3 && <EmptyState title="Ready to launch" body="Manufacturer dashboard is preloaded with coherent demo data." action={<Link className="button button-primary" to="/app/dashboard">Finish setup</Link>} />}
      </StepWizard>
    </div>
  );
}

function ReadFields({ fields }: { fields: Array<[string, string | number | undefined]> }) {
  return <div className="grid gap-3 md:grid-cols-3">{fields.map(([label, value]) => <div key={label} className="rounded-xl bg-[var(--secondary)] p-4"><p className="text-xs font-semibold text-[var(--muted-foreground)]">{label}</p><div className="field mt-2 bg-[var(--card)]">{value ?? "-"}</div></div>)}</div>;
}

function ControlledDrawer({ open, title, fields, onClose, onSave }: { open: boolean; title: string; fields: Array<{ label: string; value: string; onChange: (value: string) => void; type?: string }>; onClose: () => void; onSave: () => void }) {
  return (
    <DetailDrawer open={open} title={title} onClose={onClose}>
      <div className="space-y-3">
        {fields.map((field) => <label key={field.label} className="block text-xs font-semibold">{field.label}<input className="field mt-1" type={field.type ?? "text"} value={field.value} onChange={(event) => field.onChange(event.target.value)} /></label>)}
      </div>
      <button className="button button-primary mt-4" onClick={onSave}>Save</button>
    </DetailDrawer>
  );
}

function Dashboard() {
  const { state, selectors } = useStore();
  const navigate = useNavigate();
  return (
    <>
      <PageHeader title="Manufacturer Dashboard" eyebrow={state.brand.name} description="All KPIs and attention counts are derived from live store state." actions={<Link className="button button-primary" to="/app/qr/generate">Generate QRs</Link>} />
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard label="Total Active QRs" value={selectors.activeQrs.toString()} caption="Active + In Circulation" onClick={() => navigate("/app/qr/inventory")} />
        <KpiCard label="Scan Events Today" value={state.scanEvents.length.toString()} caption={`As of ${fmtIST(APP_NOW)}`} />
        <KpiCard label="Active Partners" value={state.partners.filter((partner) => partner.status === "Active").length.toString()} caption="Dispatch-eligible network" />
        <KpiCard label="Scan Compliance" value={`${selectors.scanCompliance.toFixed(1)}%`} caption="Average enabled checkpoints" />
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <SectionCard title="Requires Attention"><ActionList rows={[["QR activation approvals", "/app/qr/activation", selectors.pendingActivations], ["Tamper alerts", "/app/alerts", selectors.unresolvedTamper], ["Recall acknowledgments", selectors.activeRecall ? `/app/recalls/${selectors.activeRecall.id}` : "/app/recalls", selectors.recallPending], ["Near-expiry batches", "/app/expiry", selectors.nearExpiryBatches.length]]} /></SectionCard>
        <SectionCard title="Scan activity over time"><MockChart bars={state.checkpoints.map((checkpoint) => checkpoint.current)} /></SectionCard>
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <SectionCard title="Checkpoint compliance"><MetricRows rows={state.checkpoints.map((checkpoint) => [checkpoint.name, checkpoint.current])} /></SectionCard>
        <SectionCard title="Expiry exposure"><MetricRows rows={[["Near expiry", selectors.nearExpiryBatches.length * 15], ["Expired", state.batches.filter((batch) => APP_NOW > new Date(batch.expiryDate)).length * 20], ["Safe", 72]]} /></SectionCard>
        <SectionCard title="Recent activity"><Timeline events={state.auditLog.slice(0, 5).map((entry) => ({ title: `${entry.module} / ${entry.action}`, subtitle: `${entry.actor} / ${entry.entityId}`, time: fmtIST(entry.timestamp) }))} /></SectionCard>
      </div>
    </>
  );
}

function ActionList({ rows }: { rows: Array<[string, string, number | string]> }) {
  return <div className="space-y-2">{rows.map(([label, link, value]) => <Link key={label} className="flex items-center justify-between rounded-xl border border-[var(--border)] p-3 hover:bg-[var(--secondary)]" to={link}><span className="font-semibold">{label}</span><StatusChip>{String(value)}</StatusChip></Link>)}</div>;
}

function MetricRows({ rows }: { rows: Array<[string, number]> }) {
  return <div className="space-y-4">{rows.map(([label, value]) => <div key={label}><div className="mb-1 flex justify-between text-sm"><span>{label}</span><span className="mono">{value}%</span></div><Progress value={value} /></div>)}</div>;
}

function BrandPage() {
  const { state, dispatch } = useStore();
  const [edit, setEdit] = useState(false);
  const [add, setAdd] = useState(false);
  const [draft, setDraft] = useState(state.brand);
  const [unit, setUnit] = useState({ name: "", type: "Warehouse", parentId: "ou-pune-plant", city: "Pune", state: "MH" });
  const { notify } = useToast();
  return (
    <>
      <PageHeader title="Brand & Organization" actions={<button className="button button-primary" onClick={() => setEdit(true)}>Edit brand</button>} />
      <div className="grid gap-5 xl:grid-cols-2">
        <SectionCard title="Brand profile"><ReadFields fields={[["Name", state.brand.name], ["GSTIN", state.brand.gstin], ["PAN", state.brand.pan], ["Registered address", state.brand.regdAddress], ["Status", state.brand.status], ["Created", fmtDate(state.brand.createdAt)]]} /></SectionCard>
        <SectionCard title="Organization structure" action={<button className="button" onClick={() => setAdd(true)}>Add unit</button>}>
          <OrgTree units={state.orgUnits} onDeactivate={(id) => dispatch({ type: "PATCH", patch: { orgUnits: state.orgUnits.map((item) => item.id === id ? { ...item, status: "Inactive" } : item) }, audit: { actor: actorName(state), module: "Brand", action: "Deactivate org unit", entityId: id, reason: "User confirmed" } })} />
        </SectionCard>
      </div>
      <ControlledDrawer open={edit} title="Edit brand" onClose={() => setEdit(false)} fields={[{ label: "Name", value: draft.name, onChange: (value) => setDraft({ ...draft, name: value }) }, { label: "GSTIN", value: draft.gstin, onChange: (value) => setDraft({ ...draft, gstin: value }) }, { label: "PAN", value: draft.pan, onChange: (value) => setDraft({ ...draft, pan: value }) }, { label: "Registered address", value: draft.regdAddress, onChange: (value) => setDraft({ ...draft, regdAddress: value }) }]} onSave={() => { if (!draft.name || !/^[0-9A-Z]{15}$/.test(draft.gstin)) { notify("Brand name and valid GSTIN required"); return; } dispatch({ type: "PATCH", patch: { brand: draft }, audit: { actor: actorName(state), module: "Brand", action: "Update profile", entityId: draft.id, detail: "Brand profile saved" } }); notify("Brand saved"); setEdit(false); }} />
      <ControlledDrawer open={add} title="Add org unit" onClose={() => setAdd(false)} fields={[{ label: "Name", value: unit.name, onChange: (value) => setUnit({ ...unit, name: value }) }, { label: "Type", value: unit.type, onChange: (value) => setUnit({ ...unit, type: value }) }, { label: "Parent ID", value: unit.parentId, onChange: (value) => setUnit({ ...unit, parentId: value }) }, { label: "City", value: unit.city, onChange: (value) => setUnit({ ...unit, city: value }) }, { label: "State", value: unit.state, onChange: (value) => setUnit({ ...unit, state: value }) }]} onSave={() => { const created = { id: `ou-${Date.now()}`, name: unit.name || "New Unit", type: unit.type as "Company" | "Plant" | "Warehouse", parentId: unit.parentId, city: unit.city, state: unit.state, status: "Active" as const }; dispatch({ type: "PATCH", patch: { orgUnits: [...state.orgUnits, created] }, audit: { actor: actorName(state), module: "Brand", action: "Add org unit", entityId: created.id } }); notify("Org unit added"); setAdd(false); }} />
    </>
  );
}

function OrgTree({ units, onDeactivate, parentId }: { units: AppState["orgUnits"]; onDeactivate: (id: string) => void; parentId?: string }) {
  return <div className="space-y-2">{units.filter((unit) => unit.parentId === parentId).map((unit) => <div key={unit.id} className={`ml-4 border-l border-[var(--border)] pl-3 ${unit.status === "Inactive" ? "opacity-50" : ""}`}><div className="flex items-center justify-between rounded-xl bg-[var(--secondary)] p-3"><span className="font-semibold">{unit.name} <span className="text-xs text-[var(--muted-foreground)]">/{unit.type}/{unit.city}</span></span><button className="button" onClick={() => onDeactivate(unit.id)}>Deactivate</button></div><OrgTree units={units} onDeactivate={onDeactivate} parentId={unit.id} /></div>)}</div>;
}

function Products() {
  const { state, dispatch } = useStore();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [status, setStatus] = useState("All");
  const [createOpen, setCreateOpen] = useState(false);
  const navigate = useNavigate();
  const filtered = state.skus.filter((sku) => (status === "All" || sku.status === status) && (!selectedNode || descendantVariantIds(state.catalog, selectedNode).includes(sku.variantId)));
  return (
    <>
      <PageHeader title="Products & Hierarchy" actions={<><Link className="button" to="/app/products/import">Bulk import</Link>{can(state.role, "manageMasters") ? <button className="button button-primary" onClick={() => setCreateOpen(true)}>Create SKU</button> : null}</>} />
      <div className="grid gap-5 xl:grid-cols-[0.38fr_0.62fr]">
        <SectionCard title="Catalog tree"><CatalogTree nodes={state.catalog} onSelect={setSelectedNode} /></SectionCard>
        <SectionCard title="SKU table">
          <Tabs tabs={["All", "Active", "Inactive"]} active={status} setActive={setStatus} />
          <DataTable rows={filtered as unknown as Record<string, unknown>[]} columns={[{ key: "code", header: "SKU", render: (row) => <Link className="mono underline" to={`/app/products/${row.id}`}>{String(row.code)}</Link> }, { key: "name", header: "Name" }, { key: "mrp", header: "MRP" }, { key: "status", header: "Status", render: (row) => <StatusChip>{String(row.status)}</StatusChip> }]} />
        </SectionCard>
      </div>
      <SkuCreateDrawer open={createOpen} onClose={() => setCreateOpen(false)} onCreate={(sku) => { dispatch({ type: "PATCH", patch: { skus: [...state.skus, sku] }, audit: { actor: actorName(state), module: "Products", action: "Create SKU", entityId: sku.id } }); navigate(`/app/products/${sku.id}`); }} />
    </>
  );
}

function descendantVariantIds(nodes: CatalogNode[], id: string) {
  const ids = new Set([id]);
  let changed = true;
  while (changed) {
    changed = false;
    nodes.forEach((node) => {
      if (node.parentId && ids.has(node.parentId) && !ids.has(node.id)) {
        ids.add(node.id);
        changed = true;
      }
    });
  }
  return nodes.filter((node) => node.type === "Variant" && ids.has(node.id)).map((node) => node.id);
}

function CatalogTree({ nodes, parentId, onSelect }: { nodes: CatalogNode[]; parentId?: string; onSelect: (id: string) => void }) {
  const { state, dispatch } = useStore();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const { notify } = useToast();
  return <div className="space-y-2">{nodes.filter((node) => node.parentId === parentId).map((node) => <div key={node.id} className={`ml-4 border-l border-[var(--border)] pl-3 ${node.status === "Archived" ? "opacity-50" : ""}`}><div className="flex items-center justify-between rounded-xl bg-[var(--secondary)] p-2"><button className="font-semibold" onClick={() => { onSelect(node.id); setCollapsed({ ...collapsed, [node.id]: !collapsed[node.id] }); }}>{node.name} <span className="text-xs text-[var(--muted-foreground)]">/{node.type}</span></button><div className="flex gap-1">{can(state.role, "manageMasters") ? <><button className="button" onClick={() => notify("Add node drawer opened")}>Add</button><button className="button" onClick={() => dispatch({ type: "PATCH", patch: { catalog: state.catalog.map((item) => item.id === node.id ? { ...item, name: `${item.name} Updated` } : item) }, audit: { actor: actorName(state), module: "Products", action: "Rename catalog node", entityId: node.id } })}>Rename</button><button className="button" onClick={() => dispatch({ type: "PATCH", patch: { catalog: state.catalog.map((item) => item.id === node.id ? { ...item, status: "Archived" } : item) }, audit: { actor: actorName(state), module: "Products", action: "Archive catalog node", entityId: node.id } })}>Archive</button></> : null}</div></div>{!collapsed[node.id] ? <CatalogTree nodes={nodes} parentId={node.id} onSelect={onSelect} /> : null}</div>)}</div>;
}

function SkuCreateDrawer({ open, onClose, onCreate }: { open: boolean; onClose: () => void; onCreate: (sku: Sku) => void }) {
  const { state } = useStore();
  const [code, setCode] = useState("NEW-SKU");
  const [name, setName] = useState("New CropShield SKU");
  const [variantId, setVariantId] = useState(state.catalog.find((node) => node.type === "Variant")?.id ?? "");
  const [mrp, setMrp] = useState("100");
  const [volume, setVolume] = useState("500ml");
  const { notify } = useToast();
  return (
    <DetailDrawer open={open} title="Create SKU" onClose={onClose}>
      <div className="space-y-3">
        <label className="block text-xs font-semibold">Variant<select className="field mt-1" value={variantId} onChange={(event) => setVariantId(event.target.value)}>{state.catalog.filter((node) => node.type === "Variant" && node.status === "Active").map((node) => <option key={node.id} value={node.id}>{node.name}</option>)}</select></label>
        <label className="block text-xs font-semibold">Code<input className="field mt-1" value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} /></label>
        <label className="block text-xs font-semibold">Name<input className="field mt-1" value={name} onChange={(event) => setName(event.target.value)} /></label>
        <label className="block text-xs font-semibold">MRP<input className="field mt-1" type="number" value={mrp} onChange={(event) => setMrp(event.target.value)} /></label>
        <label className="block text-xs font-semibold">Volume<input className="field mt-1" value={volume} onChange={(event) => setVolume(event.target.value)} /></label>
      </div>
      <button className="button button-primary mt-4" onClick={() => { if (state.skus.some((sku) => sku.code === code) || Number(mrp) <= 0) { notify("Unique code and positive MRP required"); return; } onCreate({ id: `sku-${code.toLowerCase()}`, variantId, code, name, mrp: Number(mrp), volume, shelfLifeDays: 365, expiryLevel: "Batch", status: "Active", packaging: { unitPerBox: 1, boxPerCarton: 1, cartonPerPallet: 1, qrEnabled: ["Unit"], cascadingScan: [] }, attributes: [], versions: [{ id: `ver-${Date.now()}`, what: "SKU created", actor: actorName(state), time: APP_NOW.toISOString() }] }); onClose(); }}>Create</button>
    </DetailDrawer>
  );
}

function SkuDetail() {
  const { state, dispatch } = useStore();
  const { skuId = "" } = useParams();
  const sku = getSku(state, skuId);
  const [tab, setTab] = useState("Overview");
  if (!sku) return <EmptyState title="SKU not found" body="The requested SKU is not in the product master." action={<Link className="button button-primary" to="/app/products">Back to products</Link>} />;
  const skuBatches = state.batches.filter((batch) => batch.skuId === sku.id);
  return (
    <>
      <PageHeader title={sku.name} eyebrow={sku.code} actions={<><button className="button" onClick={() => dispatch({ type: "PATCH", patch: { skus: state.skus.map((item) => item.id === sku.id ? { ...item, status: item.status === "Active" ? "Inactive" : "Active", versions: [{ id: `ver-${Date.now()}`, what: `Status ${item.status === "Active" ? "Inactive" : "Active"}`, actor: actorName(state), time: APP_NOW.toISOString() }, ...item.versions] } : item) }, audit: { actor: actorName(state), module: "Products", action: "Toggle SKU status", entityId: sku.id } })}>{sku.status === "Active" ? "Deactivate" : "Reactivate"}</button><Link className="button button-primary" to="/app/qr/generate">Generate QRs</Link></>} />
      <Tabs tabs={["Overview", "Packaging", "Batches", "Versions"]} active={tab} setActive={setTab} />
      {tab === "Overview" ? <SkuOverview sku={sku} /> : null}
      {tab === "Packaging" ? <Packaging sku={sku} /> : null}
      {tab === "Batches" ? <Batches sku={sku} rows={skuBatches} /> : null}
      {tab === "Versions" ? <SectionCard title="Versions"><Timeline events={sku.versions.map((version) => ({ title: version.what, subtitle: version.actor, time: fmtIST(version.time) }))} /></SectionCard> : null}
    </>
  );
}

function SkuOverview({ sku }: { sku: Sku }) {
  const { state, dispatch } = useStore();
  const [attrOpen, setAttrOpen] = useState(false);
  const [key, setKey] = useState("HSN");
  const [value, setValue] = useState("3808");
  return <><SectionCard title="Overview"><ReadFields fields={[["MRP", `INR ${sku.mrp}`], ["Volume", sku.volume], ["GTIN", sku.gtin ?? "Optional"], ["Expiry level", sku.expiryLevel], ["Shelf life", `${sku.shelfLifeDays} days`]]} /></SectionCard><SectionCard title="Attributes" action={<button className="button" onClick={() => setAttrOpen(true)}>Add attribute</button>}><DataTable rows={sku.attributes as unknown as Record<string, unknown>[]} columns={[{ key: "key", header: "Key" }, { key: "value", header: "Value" }, { key: "id", header: "Action", render: (row) => <button className="button" onClick={() => dispatch({ type: "PATCH", patch: { skus: state.skus.map((item) => item.id === sku.id ? { ...item, attributes: item.attributes.filter((attribute) => attribute.id !== row.id), versions: [{ id: `ver-${Date.now()}`, what: "Attribute deleted", actor: actorName(state), time: APP_NOW.toISOString() }, ...item.versions] } : item) }, audit: { actor: actorName(state), module: "Products", action: "Delete attribute", entityId: sku.id } })}>Delete</button> }]} /></SectionCard><ControlledDrawer open={attrOpen} title="Add attribute" onClose={() => setAttrOpen(false)} fields={[{ label: "Key", value: key, onChange: setKey }, { label: "Value", value, onChange: setValue }]} onSave={() => { dispatch({ type: "PATCH", patch: { skus: state.skus.map((item) => item.id === sku.id ? { ...item, attributes: [...item.attributes, { id: `attr-${Date.now()}`, key, value }], versions: [{ id: `ver-${Date.now()}`, what: `Attribute ${key} added`, actor: actorName(state), time: APP_NOW.toISOString() }, ...item.versions] } : item) }, audit: { actor: actorName(state), module: "Products", action: "Add attribute", entityId: sku.id } }); setAttrOpen(false); }} /></>;
}

function Packaging({ sku }: { sku: Sku }) {
  const { state, dispatch } = useStore();
  const [pack, setPack] = useState(sku.packaging);
  const levels: QrLevel[] = ["Unit", "Box", "Carton", "Pallet"];
  const { notify } = useToast();
  return <SectionCard title="Packaging"><div className="grid gap-3 md:grid-cols-3">{(["unitPerBox", "boxPerCarton", "cartonPerPallet"] as const).map((field) => <label key={field} className="block text-xs font-semibold">{field}<input className="field mt-1" type="number" value={pack[field]} onChange={(event) => setPack({ ...pack, [field]: Number(event.target.value) })} /></label>)}</div><div className="mt-4 grid gap-4 md:grid-cols-2"><CheckboxGroup label="QR enabled" levels={levels} selected={pack.qrEnabled} onChange={(qrEnabled) => setPack({ ...pack, qrEnabled })} /><CheckboxGroup label="Cascading scan" levels={levels} selected={pack.cascadingScan} onChange={(cascadingScan) => setPack({ ...pack, cascadingScan })} /></div><p className="mt-4 rounded-xl bg-[var(--secondary)] p-3 text-sm text-[var(--muted-foreground)]">Changes apply to future generations only.</p><button className="button button-primary mt-4" onClick={() => { if (pack.unitPerBox < 1 || pack.boxPerCarton < 1 || pack.cartonPerPallet < 1) { notify("Packaging ratios must be integers >= 1"); return; } dispatch({ type: "PATCH", patch: { skus: state.skus.map((item) => item.id === sku.id ? { ...item, packaging: pack, versions: [{ id: `ver-${Date.now()}`, what: "Packaging updated", actor: actorName(state), time: APP_NOW.toISOString() }, ...item.versions] } : item) }, audit: { actor: actorName(state), module: "Products", action: "Update packaging", entityId: sku.id } }); notify("Packaging saved"); }}>Save packaging</button></SectionCard>;
}

function CheckboxGroup({ label, levels, selected, onChange }: { label: string; levels: QrLevel[]; selected: QrLevel[]; onChange: (levels: QrLevel[]) => void }) {
  return <div className="rounded-xl bg-[var(--secondary)] p-4"><p className="mb-2 font-semibold">{label}</p>{levels.map((level) => <label key={level} className="mr-3 inline-flex gap-2"><input type="checkbox" checked={selected.includes(level)} onChange={(event) => onChange(event.target.checked ? [...selected, level] : selected.filter((item) => item !== level))} />{level}</label>)}</div>;
}

function Batches({ sku, rows }: { sku: Sku; rows: Batch[] }) {
  const { state, dispatch } = useStore();
  const [open, setOpen] = useState(false);
  const [number, setNumber] = useState(`${sku.code}-NEW`);
  const { notify } = useToast();
  return <><SectionCard title="Batches" action={<button className="button" onClick={() => setOpen(true)}>Create batch</button>}><DataTable rows={rows as unknown as Record<string, unknown>[]} columns={[{ key: "number", header: "Batch", render: (row) => <span className="mono">{String(row.number)}</span> }, { key: "mfgDate", header: "Mfg" }, { key: "expiryDate", header: "Expiry" }, { key: "status", header: "Status", render: (row) => <StatusChip>{String(row.status)}</StatusChip> }, { key: "id", header: "Action", render: (row) => <button className="button" onClick={() => dispatch({ type: "PATCH", patch: { batches: state.batches.map((batch) => batch.id === row.id ? { ...batch, status: batch.status === "Open" ? "Closed" : batch.status === "Closed" ? "Archived" : batch.status } : batch) }, audit: { actor: actorName(state), module: "Products", action: "Batch transition", entityId: String(row.id) } })}>{row.status === "Open" ? "Close" : row.status === "Closed" ? "Archive" : "Terminal"}</button> }]} /></SectionCard><ControlledDrawer open={open} title="Create batch" onClose={() => setOpen(false)} fields={[{ label: "Batch number", value: number, onChange: (value) => setNumber(value.toUpperCase()) }]} onSave={() => { if (state.batches.some((batch) => batch.skuId === sku.id && batch.number === number)) { notify("Batch number must be unique within SKU"); return; } const batch: Batch = { id: `bat-${Date.now()}`, skuId: sku.id, number, mfgDate: fmtDate(APP_NOW), expiryDate: new Date(APP_NOW.getTime() + sku.shelfLifeDays * 86400000).toISOString().slice(0, 10), status: "Open", plannedSize: 1000, currentUnits: 0 }; dispatch({ type: "PATCH", patch: { batches: [...state.batches, batch] }, audit: { actor: actorName(state), module: "Products", action: "Create batch", entityId: batch.id } }); setOpen(false); }} /></>;
}

function Tabs({ tabs, active, setActive }: { tabs: string[]; active: string; setActive: (tab: string) => void }) {
  return <div className="mb-4 flex flex-wrap gap-2">{tabs.map((tab) => <button key={tab} className={`button ${active === tab ? "button-primary" : ""}`} onClick={() => setActive(tab)}>{tab}</button>)}</div>;
}

function ImportWizard({ title }: { title: string }) {
  const [active, setActive] = useState(0);
  return <><PageHeader title={title} /><StepWizard steps={["Upload", "Map and validate", "Import"]} active={active} setActive={setActive}>{active === 0 && <EmptyState title="Template and upload" body="CSV/XLSX upload is simulated in this static prototype." />}{active === 1 && <ValidationReport />}{active === 2 && <EmptyState title="Rows created as Pending" body="Valid rows are ready for atomic creation." />}</StepWizard></>;
}

function ValidationReport() {
  return <div><div className="mb-3 flex gap-2"><StatusChip tone="destructive">12 Errors</StatusChip><StatusChip tone="warning">7 Warnings</StatusChip><StatusChip tone="success">231 Valid</StatusChip></div><DataTable rows={[{ id: 1, row: 18, field: "GTIN", reason: "Invalid checksum" }, { id: 2, row: 24, field: "Batch", reason: "Duplicate batch no." }]} columns={[{ key: "row", header: "Row" }, { key: "field", header: "Field" }, { key: "reason", header: "Reason" }]} /></div>;
}

function QrGenerate() {
  const { state, dispatch } = useStore();
  const [active, setActive] = useState(0);
  const [skuId, setSkuId] = useState(state.skus.find((sku) => sku.status === "Active")?.id ?? "");
  const sku = getSku(state, skuId);
  const activeBatches = state.batches.filter((batch) => batch.skuId === skuId && batch.status === "Open" && !batch.dispatchBlocked && APP_NOW < new Date(batch.expiryDate));
  const [batchId, setBatchId] = useState(activeBatches[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1000);
  const [levels, setLevels] = useState<QrLevel[]>(["Unit"]);
  const { notify } = useToast();
  const navigate = useNavigate();
  if (!can(state.role, "generateQr")) return <EmptyState title="Generation unavailable" body="Your current role cannot generate QR requests." />;
  const math = sku ? computeLinkage(sku, quantity) : "";
  const confirm = () => {
    if (!sku || !batchId || quantity < 1 || quantity > 50000) { notify("Select active SKU, open batch, and quantity between 1 and 50,000"); return; }
    const reqId = `gr-${APP_NOW.toISOString().slice(2, 10).replaceAll("-", "")}-${String(state.generationRequests.length + 1).padStart(3, "0")}`;
    const serials = Array.from({ length: Math.min(40, quantity) }, (_, index) => `DT-${reqId.slice(-3)}-${String(index + 1).padStart(4, "0")}`);
    const qrs = serials.map((serial, index): Qr => ({ serial, uuid: `uuid-${serial}`, skuId, batchId, level: "Unit", children: [], status: "Pending Activation", holderId: state.brand.id, generationRequestId: reqId, parentSerial: index < 12 ? `${reqId}-BX-001` : undefined }));
    const request: GenerationRequest = { id: reqId, requester: actorName(state), skuId, batchId, plantId: "ou-pune-plant", levels, quantity, plannedQuantity: quantity, date: APP_NOW.toISOString(), status: "Pending Activation", route: quantity <= state.settings.l2QuantityBand ? "L1" : "L1 -> L2", qrSerials: serials, downloads: [], approvals: [{ step: "Generated", actor: actorName(state), status: "Done", timestamp: APP_NOW.toISOString() }, { step: "L1 approval", actor: "L1 Approver", status: "Waiting" }] };
    dispatch({ type: "PATCH", patch: { generationRequests: [request, ...state.generationRequests], qrs: [...qrs, ...state.qrs] }, audit: { actor: actorName(state), module: "QR", action: "Generate request", entityId: reqId, detail: `${quantity} planned / ${qrs.length} materialized` } });
    notify("QR generation request created");
    navigate("/app/qr/activation");
  };
  return <><PageHeader title="Generate QRs" description="Live SKU, batch, plant, level, quantity, and linkage math." /><StepWizard steps={["SKU and batch", "Levels and quantity", "Preview", "Created"]} active={active} setActive={setActive}>{active === 0 && <div className="grid gap-3 md:grid-cols-3"><label>SKU<select className="field mt-1" value={skuId} onChange={(event) => setSkuId(event.target.value)}>{state.skus.filter((item) => item.status === "Active").map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label>Batch<select className="field mt-1" value={batchId} onChange={(event) => setBatchId(event.target.value)}>{activeBatches.map((batch) => <option key={batch.id} value={batch.id}>{batch.number}</option>)}</select></label><label>Location<select className="field mt-1">{state.orgUnits.filter((unit) => unit.type === "Plant" && unit.status === "Active").map((unit) => <option key={unit.id}>{unit.name}</option>)}</select></label>{activeBatches.length === 0 ? <p className="text-sm text-[var(--destructive)]">No open non-expired batches available.</p> : null}</div>}{active === 1 && <div><CheckboxGroup label="Levels" levels={sku?.packaging.qrEnabled ?? ["Unit"]} selected={levels} onChange={setLevels} /><label className="mt-3 block">Quantity<input className="field mt-1" type="number" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} /></label><p className="mt-2 text-sm text-[var(--muted-foreground)]">Max per request: 50,000. {math}</p></div>}{active === 2 && <EmptyState title="Preview" body={`${getSku(state, skuId)?.name} / ${getBatch(state, batchId)?.number} / ${quantity} planned / serial preview DT-XXXXXX... / ${math}`} action={<button className="button button-primary" onClick={confirm}>Confirm generation</button>} />}{active === 3 && <EmptyState title="Pending Activation" body="Request is now visible in Activation and History." />}</StepWizard></>;
}

function computeLinkage(sku: Sku, units: number) {
  const boxes = Math.ceil(units / sku.packaging.unitPerBox);
  const cartons = Math.ceil(boxes / sku.packaging.boxPerCarton);
  const pallets = Math.ceil(cartons / sku.packaging.cartonPerPallet);
  return `${units} units -> ${boxes} boxes -> ${cartons} cartons -> ${pallets} pallets`;
}

function QrActivation() {
  const { state, dispatch } = useStore();
  const [tab, setTab] = useState("Approval queue");
  const [selected, setSelected] = useState<GenerationRequest | null>(null);
  const [range, setRange] = useState({ from: "DT-001-0001", to: "DT-001-0040" });
  const { notify } = useToast();
  const dryRun = activateDryRun(state, range.from, range.to);
  const approve = (request: GenerationRequest) => {
    const l1 = request.status === "Pending Activation";
    if ((l1 && !can(state.role, "approveL1")) || (!l1 && !can(state.role, "approveL2"))) { notify("Role cannot approve this pending step"); return; }
    const next = request.route === "L1 -> L2" && l1 ? "L2 Pending" : "Approved - Awaiting Activation";
    dispatch({ type: "PATCH", patch: { generationRequests: state.generationRequests.map((item) => item.id === request.id ? { ...item, status: next, approvals: item.approvals.map((approval) => approval.status === "Waiting" ? { ...approval, actor: actorName(state), status: "Done" as const, timestamp: APP_NOW.toISOString() } : approval).concat(next === "L2 Pending" ? [{ step: "L2 approval", actor: "L2 Approver", status: "Waiting" as const }] : []) } : item) }, audit: { actor: actorName(state), module: "QR", action: "Approve", entityId: request.id } });
    notify(`Request moved to ${next}`);
  };
  const activate = () => {
    const eligible = state.qrs.filter((qr) => dryRun.eligible.includes(qr.serial));
    eligible.forEach((qr) => dispatch({ type: "TRANSITION_QR", serial: qr.serial, to: "Active", reason: "Range activation" }));
    dispatch({ type: "PATCH", patch: { generationRequests: state.generationRequests.map((req) => req.qrSerials.some((serial) => dryRun.eligible.includes(serial)) ? { ...req, status: "Active" } : req) }, audit: { actor: actorName(state), module: "QR", action: "Activate range", entityId: `${range.from}-${range.to}`, detail: `${eligible.length} QRs activated` } });
    notify(`${eligible.length} QRs activated`);
  };
  return <><PageHeader title="QR Activation" /><Tabs tabs={["Approval queue", "Range activation"]} active={tab} setActive={setTab} />{tab === "Approval queue" ? <SectionCard title="Queue"><DataTable rows={state.generationRequests as unknown as Record<string, unknown>[]} onRowClick={(row) => setSelected(row as unknown as GenerationRequest)} columns={[{ key: "id", header: "Request" }, { key: "skuId", header: "SKU", render: (row) => getSku(state, String(row.skuId))?.name }, { key: "plannedQuantity", header: "Planned" }, { key: "route", header: "Route", render: (row) => <StatusChip>{String(row.route)}</StatusChip> }, { key: "status", header: "Status", render: (row) => <StatusChip>{String(row.status)}</StatusChip> }]} /></SectionCard> : <SectionCard title="Range activation">{can(state.role, "activateQr") ? <div className="grid gap-4 md:grid-cols-2"><div><label>Serial from<input className="field mt-1" value={range.from} onChange={(event) => setRange({ ...range, from: event.target.value })} /></label><label className="mt-3 block">Serial to<input className="field mt-1" value={range.to} onChange={(event) => setRange({ ...range, to: event.target.value })} /></label><div className="mt-3 flex gap-2"><StatusChip tone="success">Eligible {dryRun.eligible.length}</StatusChip><StatusChip>Active {dryRun.active}</StatusChip><StatusChip tone="destructive">Unknown {dryRun.unknown}</StatusChip></div><button className="button button-primary mt-4" onClick={activate}>Activate range</button></div><div className="rounded-xl bg-[var(--secondary)] p-4"><p className="font-semibold">CSV upload simulation</p><p className="mt-2 text-sm text-[var(--muted-foreground)]">Rows found {dryRun.total}, valid {dryRun.eligible.length}, duplicates {dryRun.active}, unknown {dryRun.unknown}.</p><button className="button mt-4" onClick={activate}>Confirm CSV activation</button></div></div> : <EmptyState title="Activation restricted" body="Only Brand Admin and DigiTathya Super Admin can activate ranges." />}</SectionCard>}<DetailDrawer open={!!selected} title={selected?.id ?? ""} onClose={() => setSelected(null)}>{selected ? <><Timeline events={selected.approvals.map((approval) => ({ title: approval.step, subtitle: `${approval.actor} / ${approval.status}${approval.reason ? ` / ${approval.reason}` : ""}`, time: approval.timestamp ? fmtIST(approval.timestamp) : undefined }))} /><div className="mt-4 flex gap-2"><button className="button button-primary" onClick={() => approve(selected)}>Approve</button><button className="button" onClick={() => dispatch({ type: "PATCH", patch: { generationRequests: state.generationRequests.map((req) => req.id === selected.id ? { ...req, status: "Rejected", approvals: [...req.approvals, { step: "Rejected", actor: actorName(state), status: "Rejected", timestamp: APP_NOW.toISOString(), reason: "Wrong Batch" }] } : req) }, audit: { actor: actorName(state), module: "QR", action: "Reject", entityId: selected.id, reason: "Wrong Batch" } })}>Reject</button></div></> : null}</DetailDrawer></>;
}

function activateDryRun(state: AppState, from: string, to: string) {
  const inRange = state.qrs.filter((qr) => qr.serial >= from && qr.serial <= to);
  return { total: inRange.length, eligible: inRange.filter((qr) => qr.status === "Pending Activation" && state.generationRequests.find((req) => req.id === qr.generationRequestId)?.status === "Approved - Awaiting Activation").map((qr) => qr.serial), active: inRange.filter((qr) => qr.status === "Active").length, unknown: inRange.length === 0 ? 1 : 0 };
}

function QrInventory() {
  const { state, selectors } = useStore();
  const statuses = ["Pending Activation", "Active", "In Circulation", "Frozen", "Recalled", "Returned", "Voided", "Expired"];
  const rows = state.batches.map((batch) => ({ id: batch.id, sku: getSku(state, batch.skuId)?.name, batch: batch.number, planned: state.generationRequests.filter((req) => req.batchId === batch.id).reduce((sum, req) => sum + req.plannedQuantity, 0), created: state.qrs.filter((qr) => qr.batchId === batch.id).length, ...Object.fromEntries(statuses.map((status) => [status, state.qrs.filter((qr) => qr.batchId === batch.id && qr.status === status).length])) }));
  return <><PageHeader title="QR Inventory" description="Counts reconcile with dashboard selectors." /><div className="grid gap-4 md:grid-cols-6"><KpiCard label="Generated" value={state.qrs.length.toString()} caption="All materialized QRs" /><KpiCard label="Pending Activation" value={state.qrs.filter((qr) => qr.status === "Pending Activation").length.toString()} caption="Awaiting activation" /><KpiCard label="Active" value={selectors.activeQrs.toString()} caption="Dashboard match" /><KpiCard label="Frozen" value={state.qrs.filter((qr) => qr.status === "Frozen").length.toString()} caption="Held" /><KpiCard label="Recalled" value={state.qrs.filter((qr) => qr.status === "Recalled").length.toString()} caption="Recall scope" /><KpiCard label="Terminal/Held" value={state.qrs.filter((qr) => ["Recalled", "Returned", "Voided", "Expired"].includes(qr.status)).length.toString()} caption="Recalled / returned / voided / expired" /></div><SectionCard title="By SKU and batch"><DataTable rows={rows} columns={[{ key: "sku", header: "SKU" }, { key: "batch", header: "Batch" }, { key: "planned", header: "Planned" }, { key: "created", header: "Created" }, { key: "Pending Activation", header: "Pending" }, { key: "Active", header: "Active" }, { key: "In Circulation", header: "Circulation" }, { key: "Recalled", header: "Recalled" }]} /></SectionCard></>;
}

function QrHistory() {
  const { state, dispatch } = useStore();
  const [selected, setSelected] = useState<GenerationRequest | null>(null);
  const [label, setLabel] = useState(false);
  const { notify } = useToast();
  return <><PageHeader title="Generation History" /><SectionCard title="All requests"><DataTable rows={state.generationRequests as unknown as Record<string, unknown>[]} onRowClick={(row) => setSelected(row as unknown as GenerationRequest)} columns={[{ key: "date", header: "Date", render: (row) => fmtIST(String(row.date)) }, { key: "requester", header: "User" }, { key: "skuId", header: "SKU", render: (row) => getSku(state, String(row.skuId))?.name }, { key: "plannedQuantity", header: "Planned" }, { key: "status", header: "Status", render: (row) => <StatusChip>{String(row.status)}</StatusChip> }]} /></SectionCard><DetailDrawer open={!!selected} title={selected?.id ?? ""} onClose={() => setSelected(null)}>{selected ? <><ReadFields fields={[["Planned", selected.plannedQuantity], ["Materialized", selected.qrSerials.length], ["Serial range", `${selected.qrSerials[0]} to ${selected.qrSerials[selected.qrSerials.length - 1]}`]]} /><Timeline events={selected.approvals.map((approval) => ({ title: approval.step, subtitle: approval.actor, time: approval.timestamp ? fmtIST(approval.timestamp) : undefined }))} /><button className="button button-primary mt-4" onClick={() => { dispatch({ type: "PATCH", patch: { generationRequests: state.generationRequests.map((req) => req.id === selected.id ? { ...req, downloads: [...req.downloads, { actor: actorName(state), time: APP_NOW.toISOString() }] } : req) }, audit: { actor: actorName(state), module: "QR", action: "Download labels", entityId: selected.id } }); notify("Downloaded labels.pdf"); setLabel(true); }}>Download labels.pdf</button></> : null}</DetailDrawer><LabelModal open={label} onClose={() => setLabel(false)} /></>;
}

function LabelModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return <DetailDrawer open={open} onClose={onClose} title="Download and Labels"><ReadFields fields={[["Format", "PDF"], ["Size", "2.5 cm"], ["Fields", "serial, batch, SKU, expiry, UUID"]]} /><div className="mt-4 rounded-2xl border border-[var(--border)] p-6 text-center"><div className="mx-auto mb-3 grid h-28 w-28 place-items-center border-4 border-[var(--foreground)] mono">QR</div><p className="font-semibold">DT-7k3m9q / NG500-2026-04-A</p></div></DetailDrawer>;
}

function Track() {
  const { state } = useStore();
  const [filters, setFilters] = useState({ sku: "All", batch: "All", status: "All", level: "All", holder: "All" });
  const rows = state.qrs.filter((qr) => (filters.sku === "All" || qr.skuId === filters.sku) && (filters.batch === "All" || qr.batchId === filters.batch) && (filters.status === "All" || qr.status === filters.status) && (filters.level === "All" || qr.level === filters.level) && (filters.holder === "All" || qr.holderId === filters.holder));
  return <><PageHeader title="Passport Search" description="Filters compose with AND over live QR inventory." /><SectionCard title="Filters"><div className="grid gap-2 md:grid-cols-5"><Select value={filters.sku} onChange={(sku) => setFilters({ ...filters, sku })} options={["All", ...state.skus.map((sku) => sku.id)]} labels={(id) => id === "All" ? "All SKUs" : getSku(state, id)?.name ?? id} /><Select value={filters.batch} onChange={(batch) => setFilters({ ...filters, batch })} options={["All", ...state.batches.map((batch) => batch.id)]} labels={(id) => id === "All" ? "All batches" : getBatch(state, id)?.number ?? id} /><Select value={filters.status} onChange={(status) => setFilters({ ...filters, status })} options={["All", "Pending Activation", "Active", "In Circulation", "Frozen", "Recalled", "Returned", "Voided", "Expired"]} /><Select value={filters.level} onChange={(level) => setFilters({ ...filters, level })} options={["All", "Unit", "Box", "Carton", "Pallet"]} /><Select value={filters.holder} onChange={(holder) => setFilters({ ...filters, holder })} options={["All", state.brand.id, ...state.partners.map((partner) => partner.id)]} labels={(id) => id === "All" ? "All holders" : getPartner(state, id)?.name ?? state.brand.name} /></div></SectionCard><SectionCard title="Results"><DataTable rows={rows as unknown as Record<string, unknown>[]} columns={[{ key: "serial", header: "Serial", render: (row) => <Link className="mono underline" to={`/app/track/${row.serial}`}>{String(row.serial)}</Link> }, { key: "skuId", header: "SKU", render: (row) => getSku(state, String(row.skuId))?.name }, { key: "batchId", header: "Batch", render: (row) => <span className="mono">{getBatch(state, String(row.batchId))?.number}</span> }, { key: "status", header: "Status", render: (row) => <StatusChip>{String(row.status)}</StatusChip> }, { key: "holderId", header: "Holder", render: (row) => getPartner(state, String(row.holderId))?.name ?? state.brand.name }]} /></SectionCard></>;
}

function Select({ value, onChange, options, labels }: { value: string; onChange: (value: string) => void; options: string[]; labels?: (value: string) => string }) {
  return <select className="field" value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option} value={option}>{labels ? labels(option) : option}</option>)}</select>;
}

function Passport() {
  const { state, dispatch } = useStore();
  const { serial = "" } = useParams();
  const qr = state.qrs.find((row) => row.serial === serial);
  const [confirm, setConfirm] = useState<null | "Frozen" | "In Circulation" | "Voided">(null);
  if (!qr) return <EmptyState title="Serial not found in passport registry" body="No QR identity exists for this URL." action={<Link className="button button-primary" to="/app/track">Back to Track</Link>} />;
  const actions: Array<["Freeze" | "Unfreeze" | "Void", "Frozen" | "In Circulation" | "Voided"]> = [];
  if (qr.status === "Active" || qr.status === "In Circulation") actions.push(["Freeze", "Frozen"]);
  if (qr.status === "Frozen") actions.push(["Unfreeze", "In Circulation"]);
  if (qr.status !== "Voided" && !["Returned", "Recalled"].includes(qr.status)) actions.push(["Void", "Voided"]);
  return <><PageHeader title={`Passport ${qr.serial}`} eyebrow={qr.uuid} actions={<>{actions.map(([label, to]) => <button key={label} className="button" onClick={() => setConfirm(to)}>{label}</button>)}</>} /><div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]"><SectionCard title="Identity"><ReadFields fields={[["SKU", getSku(state, qr.skuId)?.name], ["Batch", getBatch(state, qr.batchId)?.number], ["Level", qr.level], ["Holder", getPartner(state, qr.holderId)?.name ?? state.brand.name], ["Status", qr.status]]} /></SectionCard><SectionCard title="Timeline"><Timeline events={state.scanEvents.filter((event) => event.serial === qr.serial).map((event) => ({ title: event.action, subtitle: `${event.actor} / ${event.place}${event.note ? ` / ${event.note}` : ""}`, time: fmtIST(event.timestamp), tone: event.flagged ? "destructive" : "primary" }))} /></SectionCard></div><SectionCard title="Linkage"><Linkage qr={qr} /></SectionCard><ConfirmModal open={!!confirm} title="Confirm QR action" body="Reason: Tamper suspicion. Optional note: dashboard action." onClose={() => setConfirm(null)} onConfirm={() => { if (confirm) dispatch({ type: "TRANSITION_QR", serial: qr.serial, to: confirm, reason: "Tamper suspicion", note: "Dashboard action" }); setConfirm(null); }} /></>;
}

function Linkage({ qr }: { qr: Qr }) {
  const { state } = useStore();
  const parent = qr.parentSerial ? state.qrs.find((item) => item.serial === qr.parentSerial) : null;
  return <div className="grid gap-3 md:grid-cols-3"><div className="rounded-xl bg-[var(--secondary)] p-3"><p className="font-semibold">Parent</p>{parent ? <Link className="mono underline" to={`/app/track/${parent.serial}`}>{parent.serial}</Link> : <p className="mono">Top level</p>}</div><div className="rounded-xl bg-[var(--foreground)] p-3 text-[var(--background)]"><p className="font-semibold">Current</p><p className="mono">{qr.serial}</p></div><div className="rounded-xl bg-[var(--secondary)] p-3"><p className="font-semibold">Children</p>{qr.children.length ? qr.children.map((child) => <Link key={child} className="mono mr-2 underline" to={`/app/track/${child}`}>{child}</Link>) : <p className="mono">No children</p>}</div></div>;
}

function DispatchList() {
  const { state } = useStore();
  return <><PageHeader title="Dispatch" actions={<Link className="button button-primary" to="/app/dispatch/new">Create Dispatch</Link>} /><SectionCard title="Dispatch orders"><DataTable rows={state.dispatches as unknown as Record<string, unknown>[]} columns={[{ key: "slipNo", header: "Slip", render: (row) => <Link className="mono underline" to={`/app/dispatch/${row.slipNo}`}>{String(row.slipNo)}</Link> }, { key: "partnerId", header: "Partner", render: (row) => getPartner(state, String(row.partnerId))?.name }, { key: "status", header: "Status", render: (row) => <StatusChip>{String(row.status)}</StatusChip> }, { key: "plannedDate", header: "Planned" }, { key: "variance", header: "Variance" }]} /></SectionCard></>;
}

function DispatchNew() {
  const { state, dispatch } = useStore();
  const [active, setActive] = useState(0);
  const [partnerId, setPartnerId] = useState(state.partners.find((partner) => partner.status === "Active")?.id ?? "");
  const [skuId, setSkuId] = useState(state.skus.find((sku) => sku.status === "Active")?.id ?? "");
  const [batchId, setBatchId] = useState("");
  const [units, setUnits] = useState(24);
  const [lines, setLines] = useState<Array<{ skuId: string; batchId: string; units: number; serials: string[] }>>([]);
  const navigate = useNavigate();
  const { notify } = useToast();
  const availableBatches = state.batches.filter((batch) => batch.skuId === skuId && batch.status === "Open" && !batch.dispatchBlocked && APP_NOW < new Date(batch.expiryDate));
  const create = () => {
    const sequence = state.dispatches.filter((row) => row.slipNo.startsWith("DS-260611")).length + 1;
    const slipNo = `DS-260611${String(sequence).padStart(4, "0")}`;
    const selectedLines = lines.length ? lines : [{ skuId, batchId: batchId || availableBatches[0]?.id, units, serials: state.qrs.filter((qr) => qr.skuId === skuId && qr.batchId === (batchId || availableBatches[0]?.id) && qr.holderId === state.brand.id).slice(0, units).map((qr) => qr.serial) }];
    const item: Dispatch = { id: slipNo.toLowerCase(), slipNo, partnerId, originId: "ou-pune-plant", status: "DRAFT", plannedDate: APP_NOW.toISOString().slice(0, 10), route: ["Pune Factory", getPartner(state, partnerId)?.city ?? "Partner"], manifestSerials: selectedLines.flatMap((line) => line.serials), expectedCount: selectedLines.reduce((sum, line) => sum + line.units, 0), receivedCount: 0, variance: 0, lines: selectedLines };
    dispatch({ type: "PATCH", patch: { dispatches: [item, ...state.dispatches] }, audit: { actor: actorName(state), module: "Dispatch", action: "Create", entityId: slipNo } });
    notify("Dispatch created");
    navigate(`/app/dispatch/${slipNo}`);
  };
  return <><PageHeader title="Create Dispatch Order" /><StepWizard steps={["Partner", "Lines and route", "Preview"]} active={active} setActive={setActive}>{active === 0 && <label>Partner<select className="field mt-1" value={partnerId} onChange={(event) => setPartnerId(event.target.value)}>{state.partners.filter((partner) => partner.status === "Active").map((partner) => <option key={partner.id} value={partner.id}>{partner.code} / {partner.name} / {partner.compliance}%</option>)}</select></label>}{active === 1 && <div className="grid gap-3 md:grid-cols-4"><Select value={skuId} onChange={setSkuId} options={state.skus.filter((sku) => sku.status === "Active").map((sku) => sku.id)} labels={(id) => getSku(state, id)?.name ?? id} /><Select value={batchId || availableBatches[0]?.id || ""} onChange={setBatchId} options={availableBatches.map((batch) => batch.id)} labels={(id) => getBatch(state, id)?.number ?? id} /><input className="field" type="number" value={units} onChange={(event) => setUnits(Number(event.target.value))} /><button className="button" onClick={() => setLines([...lines, { skuId, batchId: batchId || availableBatches[0]?.id, units, serials: [] }])}>Add line</button>{availableBatches.length === 0 ? <p className="text-sm text-[var(--destructive)]">Expired or dispatch-blocked batches are excluded.</p> : null}</div>}{active === 2 && <EmptyState title="Preview" body={`${lines.length || 1} line(s), ${units} units, route Pune Factory to ${getPartner(state, partnerId)?.city}`} action={<button className="button button-primary" onClick={create}>Confirm dispatch</button>} />}</StepWizard></>;
}

function DispatchDetail() {
  const { state, dispatch } = useStore();
  const { id = "" } = useParams();
  const item = getDispatch(state, id);
  const [slip, setSlip] = useState(false);
  if (!item) return <EmptyState title="Dispatch not found" body="No dispatch matches this URL." action={<Link className="button button-primary" to="/app/dispatch">Back to dispatch</Link>} />;
  const actions: Array<[string, "PENDING" | "IN_TRANSIT" | "DELIVERED" | "CANCELLED"]> = item.status === "DRAFT" ? [["Submit", "PENDING"], ["Cancel", "CANCELLED"]] : item.status === "PENDING" ? [["Mark In Transit", "IN_TRANSIT"], ["Cancel", "CANCELLED"]] : item.status === "IN_TRANSIT" ? [["Mark Delivered", "DELIVERED"]] : item.status === "DISPUTED" ? [["Resolve dispute", "DELIVERED"]] : [];
  return <><PageHeader title={item.slipNo} eyebrow={item.status} actions={<><button className="button" onClick={() => setSlip(true)}>Dispatch slip preview</button>{actions.map(([label, to]) => <button key={label} className="button button-primary" onClick={() => dispatch({ type: "TRANSITION_DISPATCH", id: item.id, to, reason: label, note: label === "Resolve dispute" ? "Shortage written off" : undefined })}>{label}</button>)}</>} /><div className="grid gap-5 xl:grid-cols-2"><SectionCard title="Manifest"><DataTable rows={item.lines as unknown as Record<string, unknown>[]} columns={[{ key: "skuId", header: "SKU", render: (row) => getSku(state, String(row.skuId))?.name }, { key: "batchId", header: "Batch", render: (row) => getBatch(state, String(row.batchId))?.number }, { key: "units", header: "Units" }, { key: "serials", header: "Serials", render: (row) => String(row.serials).slice(0, 48) }]} /></SectionCard><SectionCard title="Reconciliation"><ReadFields fields={[["Expected", item.expectedCount], ["Received", item.receivedCount], ["Variance", item.variance], ["Route", item.route.join(" to ")]]} /></SectionCard></div><DetailDrawer open={slip} title="Dispatch slip preview" onClose={() => setSlip(false)}><div className="flex justify-between"><div><p className="font-semibold">{state.brand.name}</p><p className="text-sm text-[var(--muted-foreground)]">{state.brand.gstin}</p></div><div className="grid h-24 w-24 place-items-center border-4 border-[var(--foreground)] mono">QR</div></div><ReadFields fields={[["Slip", item.slipNo], ["Partner", getPartner(state, item.partnerId)?.name], ["Route", item.route.join(" to ")], ["Vehicle", item.vehicleNo ?? "-"]]} /></DetailDrawer></>;
}

function Returns() {
  const { state, dispatch } = useStore();
  const [tab, setTab] = useState("REQUESTED");
  const [selected, setSelected] = useState<ReturnRequest | null>(null);
  const { notify } = useToast();
  const rows = state.returns.filter((row) => row.status === tab);
  const decide = (status: "APPROVED" | "REJECTED") => {
    if (!selected) return;
    const updated = { ...selected, status, decidedBy: actorName(state), decidedAt: APP_NOW.toISOString(), disposition: status === "APPROVED" ? "Pending inspection" as const : undefined, rejectionReason: status === "REJECTED" ? "Condition mismatch" : undefined };
    dispatch({ type: "PATCH", patch: { returns: state.returns.map((row) => row.id === selected.id ? updated : row) }, audit: { actor: actorName(state), module: "Returns", action: status, entityId: selected.id, reason: updated.rejectionReason, detail: updated.disposition } });
    if (status === "APPROVED") selected.serials.forEach((serial) => dispatch({ type: "TRANSITION_QR", serial, to: "Returned", reason: "Approved return" }));
    notify(`Return ${status.toLowerCase()}`);
    setSelected(null);
  };
  return <><PageHeader title="Returns" /><Tabs tabs={["REQUESTED", "APPROVED", "REJECTED"]} active={tab} setActive={setTab} /><SectionCard title={`${tab} returns`}><DataTable rows={rows as unknown as Record<string, unknown>[]} onRowClick={(row) => setSelected(row as unknown as ReturnRequest)} columns={[{ key: "id", header: "Return ID", render: (row) => <span className="mono">{String(row.id)}</span> }, { key: "initiatorId", header: "Initiator", render: (row) => getPartner(state, String(row.initiatorId))?.name ?? String(row.consumerName ?? "Consumer") }, { key: "reason", header: "Reason" }, { key: "units", header: "Units" }, { key: "status", header: "Status", render: (row) => <StatusChip>{String(row.status)}</StatusChip> }]} /></SectionCard><DetailDrawer open={!!selected} title={selected?.id ?? ""} onClose={() => setSelected(null)}>{selected ? <><ReadFields fields={[["Reason", selected.reason], ["Location", selected.location], ["Serials", selected.serials.join(", ")], ["Linked dispatch", selected.linkedDispatchId ? getDispatch(state, selected.linkedDispatchId)?.slipNo : "D2C"], ["Decision", selected.decidedBy ? `${selected.status} by ${selected.decidedBy} at ${fmtIST(selected.decidedAt ?? APP_NOW)}` : "Pending"], ["Disposition", selected.disposition], ["Rejection reason", selected.rejectionReason]]} />{selected.status === "REQUESTED" && can(state.role, "decideReturns") ? <div className="mt-4 flex gap-2"><button className="button button-primary" onClick={() => decide("APPROVED")}>Approve with disposition</button><button className="button" onClick={() => decide("REJECTED")}>Reject with reason</button></div> : null}</> : null}</DetailDrawer></>;
}

function RecallsPage() {
  const { state } = useStore();
  return <><PageHeader title="Recalls" actions={can(state.role, "manageRecalls") ? <Link className="button button-primary" to="/app/recalls/new">Create Recall</Link> : null} /><SectionCard title="Recall list"><DataTable rows={state.recalls as unknown as Record<string, unknown>[]} columns={[{ key: "id", header: "Recall", render: (row) => <Link className="mono underline" to={`/app/recalls/${row.id}`}>{String(row.id)}</Link> }, { key: "severity", header: "Severity", render: (row) => <StatusChip>{String(row.severity)}</StatusChip> }, { key: "reason", header: "Reason" }, { key: "scope", header: "Scope" }, { key: "status", header: "Status", render: (row) => <StatusChip>{String(row.status)}</StatusChip> }]} /></SectionCard></>;
}

function RecallNew() {
  const { state, dispatch } = useStore();
  const [active, setActive] = useState(0);
  const [batchId, setBatchId] = useState(state.batches[0]?.id ?? "");
  const navigate = useNavigate();
  const { notify } = useToast();
  const scoped = state.qrs.filter((qr) => qr.batchId === batchId);
  const holders = state.partners.map((partner) => ({ partner, units: scoped.filter((qr) => qr.holderId === partner.id && qr.level === "Unit").length })).filter((row) => row.units > 0);
  const create = () => {
    const id = `RCL-260611-${String(state.recalls.length + 1).padStart(2, "0")}`;
    const recall: Recall = { id, severity: "Critical", reason: "Labeling Error", scope: "By Batch", targetBatchIds: [batchId], targetSkuIds: [], targetSerials: scoped.map((qr) => qr.serial), status: "ACTIVE", startedAt: APP_NOW.toISOString(), partnerResponses: holders.map((row) => ({ partnerId: row.partner.id, unitsHeld: row.units, response: "SILENT", returned: 0, daysOverdue: 0 })) };
    dispatch({ type: "PATCH", patch: { recalls: [recall, ...state.recalls], qrs: state.qrs.map((qr) => qr.batchId === batchId ? { ...qr, status: "Recalled" } : qr) }, audit: { actor: actorName(state), module: "Recalls", action: "Create", entityId: id } });
    notify("Recall created");
    navigate(`/app/recalls/${id}`);
  };
  return <><PageHeader title="Create Recall" /><StepWizard steps={["Reason and scope", "Distribution summary", "Double confirm"]} active={active} setActive={setActive}>{active === 0 && <label>Batch<select className="field mt-1" value={batchId} onChange={(event) => setBatchId(event.target.value)}>{state.batches.map((batch) => <option key={batch.id} value={batch.id}>{batch.number}</option>)}</select></label>}{active === 1 && <SectionCard title="Computed holder breakdown"><DataTable rows={holders.map((row) => ({ id: row.partner.id, partner: row.partner.name, units: row.units }))} columns={[{ key: "partner", header: "Partner" }, { key: "units", header: "Units held" }]} /></SectionCard>}{active === 2 && <EmptyState title="Destructive confirmation" body={`${scoped.length} QRs will be recalled.`} action={<button className="button button-primary" onClick={create}>Create recall</button>} />}</StepWizard></>;
}

function RecallDetail() {
  const { state, dispatch } = useStore();
  const { id = "" } = useParams();
  const recall = state.recalls.find((row) => row.id === id);
  const [confirm, setConfirm] = useState(false);
  if (!recall) return <EmptyState title="Recall not found" body="No recall matches this URL." action={<Link className="button button-primary" to="/app/recalls">Back to recalls</Link>} />;
  const returned = Math.round(recall.partnerResponses.reduce((sum, row) => sum + row.returned, 0) / Math.max(1, recall.partnerResponses.reduce((sum, row) => sum + row.unitsHeld, 0)) * 100);
  const silent = recall.partnerResponses.filter((row) => row.response === "SILENT").length;
  return <><PageHeader title={recall.id} eyebrow={`${recall.severity} / ${recall.status}`} actions={recall.status === "ACTIVE" && can(state.role, "manageRecalls") ? <button className="button button-primary" onClick={() => setConfirm(true)}>Close recall</button> : null} /><div className="grid gap-5 xl:grid-cols-[220px_1fr]"><SectionCard title="Returned dial"><div className="grid aspect-square place-items-center rounded-full border-[18px] border-[var(--foreground)]"><div className="text-center"><p className="mono text-4xl">{returned}%</p><p className="text-xs text-[var(--muted-foreground)]">returned</p></div></div></SectionCard><SectionCard title="Acknowledgment matrix"><DataTable rows={recall.partnerResponses.map((row) => ({ id: row.partnerId, ...row }))} columns={[{ key: "partnerId", header: "Partner", render: (row) => getPartner(state, String(row.partnerId))?.name }, { key: "unitsHeld", header: "Held" }, { key: "response", header: "Response", render: (row) => <StatusChip>{String(row.response)}</StatusChip> }, { key: "returned", header: "Returned" }, { key: "daysOverdue", header: "Overdue" }]} /></SectionCard></div><SectionCard title="Status timeline"><Timeline events={[{ title: "Initiated", subtitle: actorName(state), time: fmtIST(recall.startedAt) }, { title: "Partners notified", subtitle: `${recall.partnerResponses.length} holders`, time: fmtIST(recall.startedAt) }, { title: "Responses in progress", subtitle: `${silent} silent` }, ...(recall.closedAt ? [{ title: "Closed", subtitle: recall.closureNote ?? "", time: fmtIST(recall.closedAt) }] : [])]} /></SectionCard><ConfirmModal open={confirm} title="Close recall?" body={`${silent} partners have not acknowledged. Close anyway with justification: Partial field closure approved.`} onClose={() => setConfirm(false)} onConfirm={() => { dispatch({ type: "PATCH", patch: { recalls: state.recalls.map((row) => row.id === recall.id ? { ...row, status: "CLOSED", closedBy: actorName(state), closedAt: APP_NOW.toISOString(), closureNote: "Partial field closure approved." } : row) }, audit: { actor: actorName(state), module: "Recalls", action: "Close", entityId: recall.id, reason: "Partial field closure approved." } }); setConfirm(false); }} /></>;
}

function Expiry() {
  const { state, dispatch, selectors } = useStore();
  const [tab, setTab] = useState("All");
  const rows = state.batches.map((batch) => ({ ...batch, skuName: getSku(state, batch.skuId)?.name, days: Math.ceil((new Date(batch.expiryDate).getTime() - APP_NOW.getTime()) / 86400000), near: selectors.nearExpiryBatches.some((item) => item.id === batch.id) })).filter((row) => tab === "All" || (tab === "Near Expiry" ? row.near : row.days <= 0));
  return <><PageHeader title="Expiry Management" description={`Near Expiry is shelf-life consumed >= ${state.settings.expiryThreshold}%. Expired units remain scannable.`} /><Tabs tabs={["All", "Near Expiry", "Expired"]} active={tab} setActive={setTab} /><SectionCard title={`${tab} batches`}><DataTable rows={rows as unknown as Record<string, unknown>[]} columns={[{ key: "number", header: "Batch", render: (row) => <span className="mono">{String(row.number)}</span> }, { key: "skuName", header: "Product" }, { key: "expiryDate", header: "Expiry" }, { key: "days", header: "Days", render: (row) => <StatusChip>{Number(row.days) <= 0 ? "Expired" : `${row.days} days`}</StatusChip> }, { key: "dispatchBlocked", header: "Dispatch", render: (row) => <button className="button" onClick={() => dispatch({ type: "PATCH", patch: { batches: state.batches.map((batch) => batch.id === row.id ? { ...batch, dispatchBlocked: !batch.dispatchBlocked } : batch) }, audit: { actor: actorName(state), module: "Expiry", action: "Toggle dispatch block", entityId: String(row.id) } })}>{row.dispatchBlocked ? "Unblock" : "Block dispatch"}</button> }]} /></SectionCard><p className="mt-3 text-xs text-[var(--muted-foreground)]">Expired QR count: {state.qrs.filter((qr) => qr.status === "Expired").length}</p></>;
}

function Partners() {
  const { state } = useStore();
  return <><PageHeader title="Partners" actions={<><Link className="button" to="/app/partners/approvals">Pending approvals</Link><Link className="button" to="/app/partners/import">Bulk upload</Link><Link className="button button-primary" to="/app/partners/new">Add partner</Link></>} /><SectionCard title="Partner network"><DataTable rows={state.partners as unknown as Record<string, unknown>[]} columns={[{ key: "code", header: "Code", render: (row) => <Link className="mono underline" to={`/app/partners/${row.id}`}>{String(row.code)}</Link> }, { key: "name", header: "Name" }, { key: "type", header: "Type" }, { key: "city", header: "City" }, { key: "compliance", header: "Compliance", render: (row) => <div className="w-32"><Progress value={Number(row.compliance)} /></div> }, { key: "status", header: "Status", render: (row) => <StatusChip>{String(row.status)}</StatusChip> }]} /></SectionCard></>;
}

function PartnerApprovals() {
  const { state, dispatch } = useStore();
  const pending = state.partners.filter((partner) => partner.status === "Pending" || !partner.kycVerified);
  return <><PageHeader title="Partner approvals" /><SectionCard title="Pending rows"><DataTable rows={pending as unknown as Record<string, unknown>[]} columns={[{ key: "code", header: "Code" }, { key: "name", header: "Partner" }, { key: "gstin", header: "GSTIN" }, { key: "kycVerified", header: "KYC", render: (row) => <StatusChip>{row.kycVerified ? "KYC-verified-by-DigiTathya" : "Needs KYC"}</StatusChip> }, { key: "id", header: "Action", render: (row) => <div className="flex gap-2"><button className="button" onClick={() => dispatch({ type: "PATCH", patch: { partners: state.partners.map((partner) => partner.id === row.id ? { ...partner, status: "Active", kycVerified: true } : partner) }, audit: { actor: actorName(state), module: "Partners", action: "Approve", entityId: String(row.id) } })}>Approve</button><button className="button" onClick={() => dispatch({ type: "PATCH", patch: { partners: state.partners.map((partner) => partner.id === row.id ? { ...partner, status: "Rejected" } : partner) }, audit: { actor: actorName(state), module: "Partners", action: "Reject", entityId: String(row.id), reason: "KYC mismatch" } })}>Reject</button></div> }]} /></SectionCard></>;
}

function PartnerNew() {
  const [active, setActive] = useState(0);
  return <><PageHeader title="Add Partner" /><StepWizard steps={["Basic info", "Business details", "Hierarchy", "Review"]} active={active} setActive={setActive}>{active === 0 && <ReadFields fields={[["Name", "Narmada Farm Inputs"], ["Type", "Dealer"], ["Phone", "+91 90990 11022"]]} />}{active === 1 && <ReadFields fields={[["GSTIN", "24AANFN2190C1Z1"], ["Existing GSTIN", "code will be extended"], ["PAN", "AANFN2190C"]]} />}{active === 2 && <ReadFields fields={[["Parent", "Bharat Krishi Supply"], ["Assigned states", "GJ, MP"]]} />}{active === 3 && <EmptyState title="Pending record ready" body="Submit creates a pending partner and audit entry." />}</StepWizard></>;
}

function PartnerDetail() {
  const { state, dispatch } = useStore();
  const { id = "" } = useParams();
  const partner = getPartner(state, id);
  const [tab, setTab] = useState("Overview");
  const [doc, setDoc] = useState("");
  if (!partner) return <EmptyState title="Partner not found" body="No partner matches this URL." action={<Link className="button button-primary" to="/app/partners">Back to partners</Link>} />;
  return <><PageHeader title={partner.name} eyebrow={partner.code} actions={<><button className="button" onClick={() => dispatch({ type: "PATCH", patch: { partners: state.partners.map((item) => item.id === partner.id ? { ...item, status: item.status === "Suspended" ? "Active" : "Suspended" } : item) }, audit: { actor: actorName(state), module: "Partners", action: "Toggle status", entityId: partner.id, reason: "Operational reason" } })}>{partner.status === "Suspended" ? "Reactivate" : "Suspend"}</button></>} /><Tabs tabs={["Overview", "Dispatches", "Returns", "Scan Events", "Event Log"]} active={tab} setActive={setTab} />{tab === "Overview" && <><SectionCard title="Overview"><ReadFields fields={[["Compliance", `${partner.compliance}%`], ["GSTIN", partner.gstin], ["PAN", partner.pan], ["Status", partner.status]]} /><div className="mt-4 h-48 rounded-2xl border border-[var(--border)] bg-[var(--secondary)] p-4"><p className="font-semibold">Geofence (coordinates)</p><p className="mono mt-2">{partner.geofence.map((point) => point.join(",")).join(" / ")}</p></div></SectionCard><SectionCard title="KYC documents"><div className="flex gap-2"><button className="button" onClick={() => setDoc("GSTIN certificate")}>View GSTIN certificate</button><button className="button" onClick={() => setDoc("PAN card")}>View PAN card</button></div></SectionCard></>}{tab === "Dispatches" && <SectionCard title="Dispatches"><DataTable rows={state.dispatches.filter((row) => row.partnerId === partner.id) as unknown as Record<string, unknown>[]} columns={[{ key: "slipNo", header: "Slip" }, { key: "status", header: "Status", render: (row) => <StatusChip>{String(row.status)}</StatusChip> }, { key: "variance", header: "Variance" }]} /></SectionCard>}{tab === "Returns" && <SectionCard title="Returns"><DataTable rows={state.returns.filter((row) => row.initiatorId === partner.id) as unknown as Record<string, unknown>[]} columns={[{ key: "id", header: "ID" }, { key: "reason", header: "Reason" }, { key: "status", header: "Status", render: (row) => <StatusChip>{String(row.status)}</StatusChip> }]} /></SectionCard>}{tab === "Scan Events" && <SectionCard title="Scan Events"><Timeline events={state.scanEvents.filter((event) => event.entityId === partner.id).map((event) => ({ title: event.action, subtitle: event.serial, time: fmtIST(event.timestamp) }))} /></SectionCard>}{tab === "Event Log" && <SectionCard title="Event Log"><Timeline events={state.auditLog.filter((entry) => entry.entityId === partner.id).map((entry) => ({ title: entry.action, subtitle: entry.module, time: fmtIST(entry.timestamp) }))} /></SectionCard>}<DetailDrawer open={!!doc} title={doc} onClose={() => setDoc("")}><div className="rounded-2xl border border-[var(--border)] bg-[var(--secondary)] p-8 text-center"><p className="font-semibold">{doc}</p><p className="mt-2 text-sm text-[var(--muted-foreground)]">Verified on {fmtDate(APP_NOW)}</p></div></DetailDrawer></>;
}

function ContractManufacturers() {
  const { state, dispatch } = useStore();
  const [toggles, setToggles] = useState<Record<string, boolean>>({});
  return <><PageHeader title="Contract Manufacturers" /><SectionCard title="Sunrise Formulations permissions"><DataTable rows={state.skus.map((sku) => ({ id: sku.id, sku: sku.name, qr: toggles[`${sku.id}-qr`] ?? true, scan: toggles[`${sku.id}-scan`] ?? true, pack: toggles[`${sku.id}-pack`] ?? sku.id !== "sku-cst-tag" }))} columns={[{ key: "sku", header: "SKU" }, { key: "qr", header: "QR generation", render: (row) => <PersistToggle value={Boolean(row.qr)} onChange={(value) => { setToggles({ ...toggles, [`${row.id}-qr`]: value }); dispatch({ type: "AUDIT", entry: { actor: actorName(state), module: "Contract Manufacturers", action: "Toggle QR permission", entityId: String(row.id), detail: String(value) } }); }} /> }, { key: "scan", header: "Factory exit", render: (row) => <PersistToggle value={Boolean(row.scan)} onChange={(value) => { setToggles({ ...toggles, [`${row.id}-scan`]: value }); dispatch({ type: "AUDIT", entry: { actor: actorName(state), module: "Contract Manufacturers", action: "Toggle scan permission", entityId: String(row.id), detail: String(value) } }); }} /> }, { key: "pack", header: "Pack/link", render: (row) => <PersistToggle value={Boolean(row.pack)} onChange={(value) => { setToggles({ ...toggles, [`${row.id}-pack`]: value }); dispatch({ type: "AUDIT", entry: { actor: actorName(state), module: "Contract Manufacturers", action: "Toggle pack permission", entityId: String(row.id), detail: String(value) } }); }} /> }]} /></SectionCard></>;
}

function PersistToggle({ value, onChange }: { value: boolean; onChange: (value: boolean) => void }) {
  return <button className={`h-7 w-12 rounded-full p-1 ${value ? "bg-[var(--foreground)]" : "bg-[var(--border-strong)]"}`} onClick={() => onChange(!value)}><span className={`block h-5 w-5 rounded-full bg-[var(--card)] transition ${value ? "translate-x-5" : ""}`} /></button>;
}

function AlertsPage() {
  const { state, dispatch } = useStore();
  const [tab, setTab] = useState("All");
  const [selected, setSelected] = useState<(typeof state.alerts)[number] | null>(null);
  const rows = state.alerts.filter((alert) => tab === "All" || alert.severity === tab);
  return <><PageHeader title="Alerts" /><Tabs tabs={["All", "Critical", "Warning", "Info"]} active={tab} setActive={setTab} /><SectionCard title="Alert cards"><DataTable rows={rows as unknown as Record<string, unknown>[]} onRowClick={(row) => setSelected(row as unknown as (typeof state.alerts)[number])} columns={[{ key: "severity", header: "Severity", render: (row) => <StatusChip>{String(row.severity)}</StatusChip> }, { key: "type", header: "Type" }, { key: "title", header: "Title", render: (row) => <Link className="underline" to={String(row.link)}>{String(row.title)}</Link> }, { key: "resolved", header: "Resolved", render: (row) => <StatusChip>{row.resolved ? "Resolved" : "Open"}</StatusChip> }, { key: "id", header: "Action", render: (row) => <button className="button" onClick={(event) => { event.stopPropagation(); dispatch({ type: "PATCH", patch: { alerts: state.alerts.map((alert) => alert.id === row.id ? { ...alert, resolved: true, resolvedBy: actorName(state), resolvedAt: APP_NOW.toISOString(), resolutionNote: "Investigated and resolved" } : alert) }, audit: { actor: actorName(state), module: "Alerts", action: "Resolve", entityId: String(row.id), reason: "Investigated and resolved" } }); }}>Resolve</button> }]} /></SectionCard><SectionCard title="Rules">{Object.entries(state.settings.alertRules).map(([rule, config]) => <div key={rule} className="mb-2 flex items-center justify-between rounded-xl bg-[var(--secondary)] p-3"><span className="font-semibold">{rule}</span><div className="flex items-center gap-2"><input className="field w-24" type="number" value={config.threshold ?? 0} onChange={(event) => dispatch({ type: "PATCH", patch: { settings: { ...state.settings, alertRules: { ...state.settings.alertRules, [rule]: { ...config, threshold: Number(event.target.value) } } } }, audit: { actor: actorName(state), module: "Alerts", action: "Update rule threshold", entityId: rule } })} /><PersistToggle value={config.enabled} onChange={(enabled) => dispatch({ type: "PATCH", patch: { settings: { ...state.settings, alertRules: { ...state.settings.alertRules, [rule]: { ...config, enabled } } } }, audit: { actor: actorName(state), module: "Alerts", action: "Toggle rule", entityId: rule, detail: String(enabled) } })} /></div></div>)}</SectionCard><DetailDrawer open={!!selected} title={selected?.title ?? ""} onClose={() => setSelected(null)}>{selected ? <ReadFields fields={[["Type", selected.type], ["Body", selected.body], ["Resolved", selected.resolved ? "Yes" : "No"], ["Resolved by", selected.resolvedBy], ["Note", selected.resolutionNote]]} /> : null}</DetailDrawer></>;
}

function AlertList({ onResolve }: { onResolve: (alert: AppState["alerts"][number]) => void }) {
  const { state } = useStore();
  return <div className="space-y-3">{state.alerts.slice(0, 12).map((alert) => <div key={alert.id} className={`rounded-xl border border-[var(--border)] p-3 ${alert.resolved ? "opacity-50" : ""}`}><div className="flex items-center justify-between"><StatusChip>{alert.severity}</StatusChip><Link className="text-xs font-bold underline" to={alert.link}>Open</Link></div><p className="mt-2 font-semibold">{alert.title}</p><p className="text-sm text-[var(--muted-foreground)]">{alert.body}</p><button className="button mt-3" onClick={() => onResolve(alert)}>Resolve with note</button></div>)}</div>;
}

function Analytics() {
  const { state } = useStore();
  const { notify } = useToast();
  const [sku, setSku] = useState("All");
  const filteredQrs = state.qrs.filter((qr) => sku === "All" || qr.skuId === sku);
  const returnsByReason = ["Damaged", "Expired", "Wrong Product", "Quality Issue", "Recall"].map((reason) => state.returns.filter((row) => row.reason === reason).length * 20);
  const downloadCsv = () => {
    const csv = ["serial,status,sku", ...filteredQrs.map((qr) => `${qr.serial},${qr.status},${getSku(state, qr.skuId)?.code}`)].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "analytics.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  return <><PageHeader title="Analytics and Reports" actions={<><button className="button" onClick={downloadCsv}>CSV</button><button className="button button-primary" onClick={() => notify("Exported analytics.pdf")}>PDF</button></>} /><SectionCard title="Filters"><div className="grid gap-2 md:grid-cols-5"><Select value={sku} onChange={setSku} options={["All", ...state.skus.map((item) => item.id)]} labels={(id) => id === "All" ? "All SKUs" : getSku(state, id)?.name ?? id} /><Select value="All" onChange={() => undefined} options={["All", ...state.batches.map((item) => item.id)]} labels={(id) => id === "All" ? "All batches" : getBatch(state, id)?.number ?? id} /><Select value="All" onChange={() => undefined} options={["All", ...state.partners.map((item) => item.id)]} labels={(id) => id === "All" ? "All partners" : getPartner(state, id)?.name ?? id} /><Select value="All" onChange={() => undefined} options={["All", "MH", "GJ", "MP"]} /><Select value="30d" onChange={() => undefined} options={["7d", "30d", "90d"]} /></div></SectionCard><div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{[["Scan volume by checkpoint", state.checkpoints.map((cp) => cp.current)], ["Partner compliance ranking", state.partners.map((p) => p.compliance).slice(0, 5)], ["Geography heatmap of scans", [61, 72, 88, 94]], ["Expiry exposure", [state.batches.filter((b) => APP_NOW > new Date(b.expiryDate)).length * 20, 45, 70]], ["Recall status summary", state.recalls.map((r) => r.partnerResponses.filter((p) => p.response !== "SILENT").length * 35)], ["Returns by reason", returnsByReason]].map(([title, bars]) => <SectionCard key={String(title)} title={String(title)}><MockChart bars={bars as number[]} /><p className="mt-2 text-xs text-[var(--muted-foreground)]">{(bars as number[]).join(" / ")}</p></SectionCard>)}</div></>;
}

function Settings() {
  const { state, dispatch } = useStore();
  const { notify } = useToast();
  const editable = can(state.role, "manageSettings");
  const updateSetting = (patch: Partial<typeof state.settings>) => {
    dispatch({ type: "PATCH", patch: { settings: { ...state.settings, ...patch } }, audit: { actor: actorName(state), module: "Settings", action: "Save", entityId: "settings", detail: JSON.stringify(patch) } });
    notify("Settings saved");
  };
  return <><PageHeader title="Settings" description={editable ? "Editable for this role." : "Read-only for this role."} /><div className="grid gap-5 xl:grid-cols-2"><SectionCard title="Thresholds"><NumberField disabled={!editable} label="Expiry alert threshold %" value={state.settings.expiryThreshold} onSave={(value) => updateSetting({ expiryThreshold: value })} /><NumberField disabled={!editable} label="Scan compliance threshold %" value={state.settings.complianceThreshold} onSave={(value) => updateSetting({ complianceThreshold: value })} /><NumberField disabled={!editable} label="Recall SLA hours" value={state.settings.recallSlaHours} onSave={(value) => updateSetting({ recallSlaHours: value })} /><NumberField disabled={!editable} label="L2 approval band" value={state.settings.l2QuantityBand} onSave={(value) => updateSetting({ l2QuantityBand: value })} /></SectionCard><SectionCard title="Checkpoints">{state.checkpoints.map((checkpoint) => <div key={checkpoint.id} className="mb-2 flex items-center justify-between rounded-xl bg-[var(--secondary)] p-3"><span>{checkpoint.name}</span><div className="flex items-center gap-2"><input className="field w-24" type="number" value={checkpoint.complianceThreshold} disabled={!editable} onChange={(event) => dispatch({ type: "PATCH", patch: { checkpoints: state.checkpoints.map((item) => item.id === checkpoint.id ? { ...item, complianceThreshold: Number(event.target.value) } : item) }, audit: { actor: actorName(state), module: "Settings", action: "Update checkpoint threshold", entityId: checkpoint.id } })} /><PersistToggle value={checkpoint.enabled} onChange={(enabled) => editable && dispatch({ type: "PATCH", patch: { checkpoints: state.checkpoints.map((item) => item.id === checkpoint.id ? { ...item, enabled } : item) }, audit: { actor: actorName(state), module: "Settings", action: "Toggle checkpoint", entityId: checkpoint.id } })} /></div></div>)}</SectionCard></div></>;
}

function NumberField({ label, value, disabled, onSave }: { label: string; value: number; disabled: boolean; onSave: (value: number) => void }) {
  const [draft, setDraft] = useState(value);
  return <div className="mb-3 flex items-end gap-2"><label className="flex-1 text-xs font-semibold">{label}<input className="field mt-1" type="number" value={draft} disabled={disabled} onChange={(event) => setDraft(Number(event.target.value))} /></label><button className="button" disabled={disabled} onClick={() => onSave(draft)}>Save changes</button></div>;
}

function Users() {
  const { state, dispatch } = useStore();
  const [invite, setInvite] = useState(false);
  const [selected, setSelected] = useState<InternalUser | null>(null);
  const [email, setEmail] = useState("new.user@cropshield.in");
  const [role, setRole] = useState<Role>("Manufacturer Field Operator");
  const { notify } = useToast();
  return <><PageHeader title="User Management" actions={can(state.role, "manageUsers") ? <button className="button button-primary" onClick={() => setInvite(true)}>Invite User</button> : null} /><SectionCard title="Internal users"><DataTable rows={state.internalUsers as unknown as Record<string, unknown>[]} onRowClick={(row) => setSelected(row as unknown as InternalUser)} columns={[{ key: "name", header: "Name" }, { key: "email", header: "Email" }, { key: "role", header: "Role" }, { key: "status", header: "Status", render: (row) => <StatusChip>{String(row.status)}</StatusChip> }]} /></SectionCard><SectionCard title="Roles & permissions"><DataTable rows={roles.map((item) => ({ id: item, role: item, ...Object.fromEntries(CAPABILITIES.map((cap) => [cap, PERMISSIONS[item].includes(cap) ? "check" : "-"])) }))} columns={[{ key: "role", header: "Role" }, ...CAPABILITIES.map((cap) => ({ key: cap, header: cap, render: (row: Record<string, unknown>) => row[cap] === "check" ? "check" : "-" }))]} /></SectionCard><DetailDrawer open={invite} title="Invite User" onClose={() => setInvite(false)}><label>Email<input className="field mt-1" value={email} onChange={(event) => setEmail(event.target.value)} /></label><label className="mt-3 block">Role<select className="field mt-1" value={role} onChange={(event) => setRole(event.target.value as Role)}>{roles.map((item) => <option key={item}>{item}</option>)}</select></label><button className="button button-primary mt-4" onClick={() => { if (!/^[^@]+@[^@]+\.[^@]+$/.test(email) || state.internalUsers.some((user) => user.email === email)) { notify("Valid unique email required"); return; } const user = { id: `u-${Date.now()}`, name: email.split("@")[0], email, role, status: "Invited" as const }; dispatch({ type: "PATCH", patch: { internalUsers: [...state.internalUsers, user] }, audit: { actor: actorName(state), module: "Users", action: "Invite", entityId: user.id } }); setInvite(false); }}>Send invite</button></DetailDrawer><DetailDrawer open={!!selected} title={selected?.name ?? ""} onClose={() => setSelected(null)}>{selected ? <><ReadFields fields={[["Email", selected.email], ["Role", selected.role], ["Status", selected.status]]} /><div className="mt-4 flex gap-2"><button className="button" onClick={() => dispatch({ type: "PATCH", patch: { internalUsers: state.internalUsers.map((user) => user.id === selected.id ? { ...user, status: user.status === "Inactive" ? "Active" : "Inactive" } : user) }, audit: { actor: actorName(state), module: "Users", action: "Toggle user status", entityId: selected.id } })}>{selected.status === "Inactive" ? "Reactivate" : "Deactivate"}</button></div></> : null}</DetailDrawer></>;
}

function AuditLog() {
  const { state } = useStore();
  const [module, setModule] = useState("All");
  const [actor, setActor] = useState("All");
  const rows = state.auditLog.filter((entry) => (module === "All" || entry.module === module) && (actor === "All" || entry.actor === actor));
  return <><PageHeader title="Audit Log" /><SectionCard title="Filters"><div className="grid gap-2 md:grid-cols-2"><Select value={module} onChange={setModule} options={["All", ...Array.from(new Set(state.auditLog.map((entry) => entry.module)))]} /><Select value={actor} onChange={setActor} options={["All", ...Array.from(new Set(state.auditLog.map((entry) => entry.actor)))]} /></div></SectionCard><SectionCard title="Newest first"><DataTable rows={rows as unknown as Record<string, unknown>[]} columns={[{ key: "timestamp", header: "Time", render: (row) => fmtIST(String(row.timestamp)) }, { key: "actor", header: "Actor" }, { key: "role", header: "Role" }, { key: "module", header: "Module" }, { key: "action", header: "Action" }, { key: "entityId", header: "Entity" }, { key: "reason", header: "Reason" }, { key: "detail", header: "Detail" }]} /></SectionCard></>;
}

function SearchPage() {
  const { selectors } = useStore();
  const [params] = useSearchParams();
  const q = (params.get("q") ?? "").toLowerCase();
  const rows = selectors.searchIndex.filter((item) => [item.type, item.label, item.meta].join(" ").toLowerCase().includes(q));
  return <><PageHeader title="Global Search" description={`Results for "${q || "all"}"`} /><SectionCard title="Results"><DataTable rows={rows} columns={[{ key: "type", header: "Type" }, { key: "label", header: "Result", render: (row) => <Link className="underline" to={String(row.path)}>{String(row.label)}</Link> }, { key: "meta", header: "Meta", render: (row) => String(row.meta) }]} /></SectionCard></>;
}

function NotFound() {
  return <EmptyState title="404" body="This route does not exist in the DigiTathya prototype." action={<Link className="button button-primary" to="/app/dashboard">Back to dashboard</Link>} />;
}
