import { useState } from "react";
import { Link, Navigate, NavLink, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from "react-router";
import {
  alerts as seedAlerts,
  appSearchIndex,
  batches,
  dispatches,
  generationRequests,
  getBatch,
  getPartner,
  getQr,
  getSku,
  internalUsers,
  manufacturer,
  partnerStock,
  partners,
  qrs,
  recalls,
  returns,
  scanEvents,
  scanResultVariants,
  skus,
  type Alert,
  type Dispatch,
  type GenerationRequest,
  type Qr,
  type Recall,
  type ReturnRequest,
  type Role,
  type Surface,
} from "./data/mock";
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

const appNav = [
  ["/app/dashboard", "Dashboard"],
  ["/app/products", "Products"],
  ["/app/qr/generate", "QR Generate"],
  ["/app/qr/activation", "Activation"],
  ["/app/qr/history", "History"],
  ["/app/track", "Track"],
  ["/app/dispatch", "Dispatch"],
  ["/app/returns", "Returns"],
  ["/app/recalls", "Recalls"],
  ["/app/expiry", "Expiry"],
  ["/app/partners", "Partners"],
  ["/app/alerts", "Alerts"],
  ["/app/analytics", "Analytics"],
  ["/app/settings", "Settings"],
  ["/app/users", "Users"],
];

const cmNav = [
  ["/app/dashboard", "Own Activity"],
  ["/app/qr/generate", "QR Generation"],
  ["/app/qr/history", "History"],
  ["/app/track", "Scan Log"],
];

const partnerNav = [
  ["/partner/home", "Home"],
  ["/partner/events", "Events"],
  ["/partner/stock", "Stock"],
  ["/partner/returns", "Returns"],
  ["/partner/recalls", "Recalls"],
  ["/partner/profile", "Profile"],
];

const mobileNav = [
  ["/mobile/home", "Home"],
  ["/mobile/scan", "Scan"],
  ["/mobile/pack", "Pack"],
  ["/mobile/receive", "Receive"],
  ["/mobile/returns", "Returns"],
  ["/mobile/recall", "Recall"],
  ["/mobile/history", "History"],
  ["/mobile/profile", "Profile"],
];

type AppState = {
  role: Role;
  alerts: Alert[];
  requests: GenerationRequest[];
  qrRows: Qr[];
  returnRows: ReturnRequest[];
  dispatchRows: Dispatch[];
  recallRows: Recall[];
};

function AppInner() {
  const [state, setState] = useState<AppState>({
    role: "Brand Admin",
    alerts: seedAlerts,
    requests: generationRequests,
    qrRows: qrs,
    returnRows: returns,
    dispatchRows: dispatches,
    recallRows: recalls,
  });

  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/search" element={<Shell state={state} setState={setState} surface="app"><SearchPage /></Shell>} />
        <Route path="/app/dashboard" element={<Shell state={state} setState={setState} surface="app"><Dashboard state={state} /></Shell>} />
        <Route path="/app/products" element={<Shell state={state} setState={setState} surface="app"><Products /></Shell>} />
        <Route path="/app/products/import" element={<Shell state={state} setState={setState} surface="app"><ProductsImport /></Shell>} />
        <Route path="/app/products/:skuId" element={<Shell state={state} setState={setState} surface="app"><SkuDetail /></Shell>} />
        <Route path="/app/qr/generate" element={<Shell state={state} setState={setState} surface="app"><QrGenerate state={state} setState={setState} /></Shell>} />
        <Route path="/app/qr/activation" element={<Shell state={state} setState={setState} surface="app"><QrActivation state={state} setState={setState} /></Shell>} />
        <Route path="/app/qr/history" element={<Shell state={state} setState={setState} surface="app"><QrHistory state={state} /></Shell>} />
        <Route path="/app/track" element={<Shell state={state} setState={setState} surface="app"><Track state={state} /></Shell>} />
        <Route path="/app/track/:serial" element={<Shell state={state} setState={setState} surface="app"><Passport state={state} setState={setState} /></Shell>} />
        <Route path="/app/dispatch" element={<Shell state={state} setState={setState} surface="app"><DispatchList state={state} /></Shell>} />
        <Route path="/app/dispatch/new" element={<Shell state={state} setState={setState} surface="app"><DispatchNew state={state} setState={setState} /></Shell>} />
        <Route path="/app/dispatch/:id" element={<Shell state={state} setState={setState} surface="app"><DispatchDetail state={state} setState={setState} /></Shell>} />
        <Route path="/app/returns" element={<Shell state={state} setState={setState} surface="app"><Returns state={state} setState={setState} /></Shell>} />
        <Route path="/app/recalls" element={<Shell state={state} setState={setState} surface="app"><RecallsPage state={state} /></Shell>} />
        <Route path="/app/recalls/new" element={<Shell state={state} setState={setState} surface="app"><RecallNew state={state} setState={setState} /></Shell>} />
        <Route path="/app/recalls/:id" element={<Shell state={state} setState={setState} surface="app"><RecallDetail state={state} setState={setState} /></Shell>} />
        <Route path="/app/expiry" element={<Shell state={state} setState={setState} surface="app"><Expiry state={state} /></Shell>} />
        <Route path="/app/partners" element={<Shell state={state} setState={setState} surface="app"><Partners /></Shell>} />
        <Route path="/app/partners/approvals" element={<Shell state={state} setState={setState} surface="app"><PartnerApprovals /></Shell>} />
        <Route path="/app/partners/new" element={<Shell state={state} setState={setState} surface="app"><PartnerNew /></Shell>} />
        <Route path="/app/partners/import" element={<Shell state={state} setState={setState} surface="app"><PartnerImport /></Shell>} />
        <Route path="/app/partners/contract-manufacturers" element={<Shell state={state} setState={setState} surface="app"><ContractManufacturers /></Shell>} />
        <Route path="/app/partners/:id" element={<Shell state={state} setState={setState} surface="app"><PartnerDetail /></Shell>} />
        <Route path="/app/alerts" element={<Shell state={state} setState={setState} surface="app"><AlertsPage state={state} setState={setState} /></Shell>} />
        <Route path="/app/analytics" element={<Shell state={state} setState={setState} surface="app"><Analytics /></Shell>} />
        <Route path="/app/settings" element={<Shell state={state} setState={setState} surface="app"><Settings /></Shell>} />
        <Route path="/app/users" element={<Shell state={state} setState={setState} surface="app"><Users /></Shell>} />
        <Route path="/partner/home" element={<Shell state={state} setState={setState} surface="partner"><PartnerHome state={state} /></Shell>} />
        <Route path="/partner/events" element={<Shell state={state} setState={setState} surface="partner"><PartnerEvents /></Shell>} />
        <Route path="/partner/stock" element={<Shell state={state} setState={setState} surface="partner"><PartnerStockPage /></Shell>} />
        <Route path="/partner/returns" element={<Shell state={state} setState={setState} surface="partner"><PartnerReturns state={state} setState={setState} /></Shell>} />
        <Route path="/partner/recalls" element={<Shell state={state} setState={setState} surface="partner"><PartnerRecalls /></Shell>} />
        <Route path="/partner/profile" element={<Shell state={state} setState={setState} surface="partner"><PartnerProfile /></Shell>} />
        <Route path="/mobile/login" element={<MobileFrame><MobileLogin /></MobileFrame>} />
        <Route path="/mobile/register" element={<MobileFrame><MobileRegister /></MobileFrame>} />
        <Route path="/mobile/workspaces" element={<MobileFrame><MobileWorkspaces /></MobileFrame>} />
        <Route path="/mobile/home" element={<MobileFrame><MobileHome /></MobileFrame>} />
        <Route path="/mobile/scan" element={<MobileFrame><MobileScan state={state} setState={setState} /></MobileFrame>} />
        <Route path="/mobile/pack" element={<MobileFrame><MobilePack /></MobileFrame>} />
        <Route path="/mobile/receive" element={<MobileFrame><MobileReceive state={state} setState={setState} /></MobileFrame>} />
        <Route path="/mobile/returns" element={<MobileFrame><MobileReturns state={state} setState={setState} /></MobileFrame>} />
        <Route path="/mobile/recall" element={<MobileFrame><MobileRecall /></MobileFrame>} />
        <Route path="/mobile/history" element={<MobileFrame><MobileHistory /></MobileFrame>} />
        <Route path="/mobile/profile" element={<MobileFrame><MobileProfile /></MobileFrame>} />
        <Route path="*" element={<Shell state={state} setState={setState} surface="app"><NotFound /></Shell>} />
      </Routes>
      <DemoControl role={state.role} setRole={(role) => setState((current) => ({ ...current, role }))} />
    </ToastProvider>
  );
}

export default function App() {
  return <AppInner />;
}

function Shell({ children, state, setState, surface }: { children: React.ReactNode; state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>>; surface: Surface }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [bellOpen, setBellOpen] = useState(false);
  const [blockedRecall, setBlockedRecall] = useState(surface === "partner" && state.recallRows.some((recall) => recall.status === "ACTIVE"));
  const nav = surface === "partner" ? partnerNav : state.role === "Contract Manufacturer" ? cmNav : appNav;

  return (
    <div className="min-h-screen">
      <header className="glass sticky top-0 z-30 flex h-14 items-center justify-between px-4">
        <button className="flex items-center gap-3" onClick={() => navigate(surface === "partner" ? "/partner/home" : "/app/dashboard")}>
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--foreground)] text-sm font-black text-[var(--background)]">DT</div>
          <div className="text-left">
            <p className="font-semibold tracking-[-0.025em]">DigiTathya</p>
            <p className="text-[11px] text-[var(--muted-foreground)]">{surface === "partner" ? "Partner Web" : "Manufacturer Web"} / {state.role}</p>
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
            <input name="q" className="field h-9 w-64" placeholder="Global search serial, partner, dispatch" />
          </form>
          <span className="mono hidden rounded-full bg-[var(--secondary)] px-3 py-1 lg:inline">11 Jun 2026, 19:20 IST</span>
          <button className="button" onClick={() => setBellOpen(true)}>Bell {state.alerts.filter((alert) => !alert.resolved).length}</button>
        </div>
      </header>
      {state.recallRows.some((recall) => recall.status === "ACTIVE") ? (
        <div className="border-b border-[color-mix(in_srgb,var(--destructive)_35%,var(--border))] bg-[color-mix(in_srgb,var(--destructive)_10%,var(--card))] px-4 py-3 text-sm font-semibold text-[var(--destructive)]">
          Active Recall RCL-260611-02 / Batch NG500-2026-04-A / 72% acknowledged / <Link className="underline" to="/app/recalls/RCL-260611-02">View Recall</Link>
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
            <div className="mt-4 rounded-xl bg-[var(--secondary)] p-3 text-xs text-[var(--muted-foreground)]">
              Current route: <span className="mono">{location.pathname}</span>
            </div>
          </nav>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
      <NotificationDrawer open={bellOpen} onClose={() => setBellOpen(false)} state={state} setState={setState} />
      <ConfirmModal
        open={blockedRecall}
        title="Critical recall requires response"
        body="CropShield has issued RCL-260611-02 for NG500-2026-04-A. Partner users must acknowledge, quarantine, or return affected stock before continuing."
        confirmLabel="Acknowledge and continue"
        onClose={() => setBlockedRecall(false)}
        onConfirm={() => setBlockedRecall(false)}
      />
    </div>
  );
}

function DemoControl({ role, setRole }: { role: Role; setRole: (role: Role) => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const roles: Role[] = ["Brand Admin", "Manufacturer L1 Approver", "Manufacturer L2 Approver", "Contract Manufacturer", "Manufacturer Field Operator", "Distributor Admin", "Dealer Admin", "Retailer Admin", "Partner Operator"];
  const surface = location.pathname.startsWith("/partner") ? "partner" : location.pathname.startsWith("/mobile") ? "mobile" : "app";
  return (
    <div className="fixed bottom-4 right-4 z-[80] w-[280px] rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3 shadow-[var(--shadow-md)]">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">Demo Control</p>
      <div className="mb-2 grid grid-cols-3 gap-1">
        {[
          ["app", "/app/dashboard"],
          ["partner", "/partner/home"],
          ["mobile", "/mobile/home"],
        ].map(([label, path]) => (
          <button key={label} className={`rounded-lg px-2 py-2 text-xs font-bold ${surface === label ? "bg-[var(--foreground)] text-[var(--background)]" : "bg-[var(--secondary)]"}`} onClick={() => navigate(path)}>
            {label}
          </button>
        ))}
      </div>
      <select className="field h-10" value={role} onChange={(event) => setRole(event.target.value as Role)}>
        {roles.map((item) => <option key={item}>{item}</option>)}
      </select>
    </div>
  );
}

function NotificationDrawer({ open, onClose, state, setState }: { open: boolean; onClose: () => void; state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>> }) {
  const { notify } = useToast();
  return (
    <DetailDrawer open={open} onClose={onClose} title="Notifications">
      <div className="space-y-3">
        {state.alerts.slice(0, 12).map((alert) => (
          <div key={alert.id} className={`rounded-xl border border-[var(--border)] p-3 ${alert.resolved ? "opacity-50" : ""}`}>
            <div className="flex items-center justify-between">
              <StatusChip>{alert.severity}</StatusChip>
              <Link className="text-xs font-bold underline" to={alert.link} onClick={onClose}>Open</Link>
            </div>
            <p className="mt-2 font-semibold">{alert.title}</p>
            <p className="text-sm text-[var(--muted-foreground)]">{alert.body}</p>
            <button
              className="button mt-3"
              onClick={() => {
                setState((current) => ({ ...current, alerts: current.alerts.map((item) => item.id === alert.id ? { ...item, resolved: true } : item) }));
                notify("Alert marked resolved");
              }}
            >
              Mark resolved
            </button>
          </div>
        ))}
      </div>
    </DetailDrawer>
  );
}

function Login() {
  const [step, setStep] = useState<"email" | "otp" | "error" | "expired">("email");
  const navigate = useNavigate();
  return (
    <AuthCard title="Login" copy="Email + 6-digit OTP with error and expired states.">
      <input className="field" placeholder="admin@cropshield.in" />
      {step !== "email" ? <input className="field mt-3" placeholder="6-digit OTP" defaultValue={step === "error" ? "111111" : "482910"} /> : null}
      {step === "error" ? <p className="mt-2 text-sm font-semibold text-[var(--destructive)]">Wrong OTP. 2 attempts remaining.</p> : null}
      {step === "expired" ? <p className="mt-2 text-sm font-semibold text-[var(--destructive)]">OTP expired. Resend available in 00:08.</p> : null}
      <div className="mt-4 grid gap-2">
        <button className="button button-primary" onClick={() => step === "email" ? setStep("otp") : navigate("/app/dashboard")}>{step === "email" ? "Send OTP" : "Verify and continue"}</button>
        <button className="button" onClick={() => setStep("error")}>Simulate wrong OTP</button>
        <button className="button" onClick={() => setStep("expired")}>Simulate expired OTP</button>
        <Link className="button text-center" to="/setup">First-run setup</Link>
      </div>
    </AuthCard>
  );
}

function AuthCard({ title, copy, children }: { title: string; copy: string; children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center p-4">
      <div className="card w-full max-w-md p-6">
        <div className="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-[var(--foreground)] font-black text-[var(--background)]">DT</div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">{title}</h1>
        <p className="mb-5 mt-2 text-sm text-[var(--muted-foreground)]">{copy}</p>
        {children}
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
        {active === 0 && <FormGrid fields={["Brand name: CropShield", "Logo upload <=500KB", "Co-brand: EF Polymer"]} />}
        {active === 1 && <div className="grid gap-3 md:grid-cols-4">{["L1 SKU to Batch to Unit", "L2 plus Box", "L3 plus Carton", "L4 plus Pallet"].map((item) => <button className="button min-h-24 text-left" onClick={() => setActive(2)} key={item}>{item}<p className="mt-2 text-xs text-[var(--muted-foreground)]">Locked after first QR generation</p></button>)}</div>}
        {active === 2 && <FormGrid fields={["Expiry alert threshold 70%", "Compliance threshold 70%", "Recall acknowledgment SLA 4h"]} />}
        {active === 3 && <EmptyState title="Ready to launch CropShield" body="Manufacturer dashboard, partner web, and mobile workflows are preloaded with coherent demo data." action={<Link className="button button-primary" to="/app/dashboard">Finish setup</Link>} />}
      </StepWizard>
    </div>
  );
}

function FormGrid({ fields }: { fields: string[] }) {
  return <div className="grid gap-3 md:grid-cols-3">{fields.map((field) => <label key={field} className="rounded-xl bg-[var(--secondary)] p-4 font-semibold">{field}<input className="field mt-2" defaultValue={field.split(": ")[1] ?? field.split(" ")[field.split(" ").length - 1]} /></label>)}</div>;
}

function Dashboard({ state }: { state: AppState }) {
  return (
    <>
      <PageHeader title="Manufacturer Dashboard" eyebrow="CropShield" description="Operational command center with KPIs, attention queues, scan activity, recall ribbon, and recent lifecycle events." actions={<Link className="button button-primary" to="/app/qr/generate">Generate QRs</Link>} />
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard label="Total Active QRs" value={state.qrRows.filter((qr) => qr.status === "Active" || qr.status === "In Circulation").length.toString()} caption="Connected mock serials" />
        <KpiCard label="Scan Events Today" value={scanEvents.length.toString()} caption="Latest at 18:50 IST" />
        <KpiCard label="Active Partners" value={partners.filter((partner) => partner.status === "Active").length.toString()} caption="Including multi-manufacturer retailer" />
        <KpiCard label="Scan Compliance" value="84.7%" caption="Threshold 70%" />
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <SectionCard title="Requires Attention">
          <ActionList rows={[["QR activation approvals", "/app/qr/activation", state.requests.filter((r) => r.status === "Pending Activation").length], ["Tamper alerts", "/app/alerts", 2], ["Recall acknowledgments", "/app/recalls/RCL-260611-02", 3], ["Near expiry batches", "/app/expiry", 2]]} />
        </SectionCard>
        <SectionCard title="Scan activity over time"><MockChart bars={[44, 62, 58, 88, 76, 92, 81]} /></SectionCard>
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <SectionCard title="Checkpoint compliance"><MetricRows rows={[["Factory Exit", 96], ["Distributor Receive", 88], ["Dealer Dispatch", 74], ["Retail Verify", 61]]} /></SectionCard>
        <SectionCard title="Expiry exposure"><MetricRows rows={[["Expired", 8], ["0-30 days", 14], ["31-90 days", 31], ["91+ days", 72]]} /></SectionCard>
        <SectionCard title="Recent activity"><Timeline events={scanEvents.slice(0, 5).map((event) => ({ title: `${event.action} / ${event.serial}`, subtitle: `${event.actor} at ${event.place}`, time: event.timestamp, tone: event.flagged ? "destructive" : "primary" }))} /></SectionCard>
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

function Products() {
  return (
    <>
      <PageHeader title="Products and Hierarchy" description="Catalog tree with create actions, SKU detail links, status filters, and active QR visibility." actions={<><Link className="button" to="/app/products/import">Bulk import</Link><Link className="button button-primary" to="/app/products/sku-ngp-500">Open SKU</Link></>} />
      <div className="grid gap-5 xl:grid-cols-[0.35fr_0.65fr]">
        <SectionCard title="Catalog tree">
          {["Agrochemicals", "Bio Pesticides", "NeemGuard", "Plus", "NGP-500"].map((node, index) => <button key={node} className="mb-2 block w-full border-l border-[var(--border)] py-2 pl-3 text-left hover:bg-[var(--secondary)]" style={{ marginLeft: index * 10 }} onClick={() => index === 4 && location.assign("/app/products/sku-ngp-500")}>+ {node}</button>)}
        </SectionCard>
        <SectionCard title="SKU list">
          <DataTable rows={skus.map((sku) => ({ ...sku, batchCount: batches.filter((batch) => batch.skuId === sku.id).length }))} columns={[{ key: "code", header: "SKU", sortable: true, render: (row) => <Link className="mono underline" to={`/app/products/${row.id}`}>{String(row.code)}</Link> }, { key: "name", header: "Name" }, { key: "category", header: "Category" }, { key: "batchCount", header: "Batches" }, { key: "status", header: "Status", render: (row) => <StatusChip>{String(row.status)}</StatusChip> }]} />
        </SectionCard>
      </div>
    </>
  );
}

function SkuDetail() {
  const { skuId = "sku-ngp-500" } = useParams();
  const [tab, setTab] = useState("Overview");
  const sku = getSku(skuId) ?? skus[0];
  const skuBatches = batches.filter((batch) => batch.skuId === sku.id);
  return (
    <>
      <PageHeader title={sku.name} eyebrow={sku.code} description="Overview, packaging hierarchy, batch lifecycle, and version history." actions={<Link className="button" to="/app/qr/generate">Generate QRs</Link>} />
      <Tabs tabs={["Overview", "Packaging", "Batches", "Versions"]} active={tab} setActive={setTab} />
      <SectionCard title={tab}>
        {tab === "Overview" && <FormGrid fields={[`MRP: INR ${sku.mrp}`, `Volume: ${sku.volume}`, `GTIN: ${sku.gtin ?? "Optional"}`, `Expiry level: ${sku.expiryLevel}`, `Shelf life: ${sku.shelfLifeDays} days`]} />}
        {tab === "Packaging" && <FormGrid fields={[`Units per box: ${sku.packaging.unitPerBox}`, `Boxes per carton: ${sku.packaging.boxPerCarton}`, `Cartons per pallet: ${sku.packaging.cartonPerPallet}`, `QR enabled: ${sku.packaging.qrEnabled.join(", ")}`, `Cascading: ${sku.packaging.cascadingScan.join(", ")}`, "Banner: Changes apply to future generations only"]} />}
        {tab === "Batches" && <DataTable rows={skuBatches} columns={[{ key: "number", header: "Batch", render: (row) => <span className="mono">{String(row.number)}</span> }, { key: "mfgDate", header: "Mfg" }, { key: "expiryDate", header: "Expiry" }, { key: "status", header: "Status", render: (row) => <StatusChip>{String(row.status)}</StatusChip> }, { key: "plannedSize", header: "Planned" }]} />}
        {tab === "Versions" && <Timeline events={[{ title: "Packaging ratio changed", subtitle: "24 units/carton to match L4 template", time: "2026-06-01" }, { title: "GTIN added", subtitle: "Readonly diff history retained", time: "2026-05-28" }]} />}
      </SectionCard>
    </>
  );
}

function Tabs({ tabs, active, setActive }: { tabs: string[]; active: string; setActive: (tab: string) => void }) {
  return <div className="mb-4 flex flex-wrap gap-2">{tabs.map((tab) => <button key={tab} className={`button ${active === tab ? "button-primary" : ""}`} onClick={() => setActive(tab)}>{tab}</button>)}</div>;
}

function ProductsImport() {
  const [active, setActive] = useState(0);
  return <WizardPage title="Product bulk import" steps={["Download template", "Upload and dry-run", "Confirm atomic creation"]} active={active} setActive={setActive} panels={[<EmptyState key="t" title="CSV template ready" body="Template includes category, SKU, batch, packaging ratios, and GTIN optional columns." />, <ValidationReport key="v" />, <EmptyState key="c" title="Import creates pending records" body="231 valid rows will create categories, SKUs, and batches atomically." />]} />;
}

function ValidationReport() {
  return <div><div className="mb-3 flex gap-2"><StatusChip tone="destructive">12 Errors</StatusChip><StatusChip tone="warning">7 Warnings</StatusChip><StatusChip tone="success">231 Valid</StatusChip></div><DataTable rows={[{ id: 1, row: 18, field: "GTIN", reason: "Invalid checksum" }, { id: 2, row: 24, field: "Batch", reason: "Duplicate batch no." }]} columns={[{ key: "row", header: "Row" }, { key: "field", header: "Field" }, { key: "reason", header: "Reason" }]} /></div>;
}

function WizardPage({ title, steps, active, setActive, panels }: { title: string; steps: string[]; active: number; setActive: (step: number) => void; panels: React.ReactNode[] }) {
  return <><PageHeader title={title} /><StepWizard steps={steps} active={active} setActive={setActive}>{panels[active]}</StepWizard></>;
}

function QrGenerate({ state, setState }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>> }) {
  const [active, setActive] = useState(0);
  const { notify } = useToast();
  const navigate = useNavigate();
  const finish = () => {
    const newReq: GenerationRequest = { ...state.requests[0], id: `gr-demo-${state.requests.length + 1}`, status: "Pending Activation", date: new Date().toISOString(), qrSerials: ["DT-7k3m9q"] };
    setState((current) => ({ ...current, requests: [newReq, ...current.requests] }));
    notify("QR generation request created: Pending Activation");
    navigate("/app/qr/activation");
  };
  return (
    <>
      <PageHeader title="Generate QRs" description="Select SKU, batch, hierarchy levels, quantity, and confirm parent-child linkage math." />
      <StepWizard steps={["SKU and batch", "Levels and quantity", "Preview", "Created"]} active={active} setActive={setActive}>
        {active === 0 && <FormGrid fields={["SKU: NeemGuard Plus 500ml", "Batch: NG500-2026-04-A", "Expiry: 18 Apr 2027"]} />}
        {active === 1 && <FormGrid fields={["Levels: Unit, Box, Carton, Pallet", "Quantity: 10000", "Limit: 50000"]} />}
        {active === 2 && <EmptyState title="Linkage math preview" body="10,000 units to 417 cartons at 24/carton; last carton has 16 units. Pallet scan cascades through cartons, boxes, and units." action={<button className="button button-primary" onClick={finish}>Confirm generation</button>} />}
        {active === 3 && <EmptyState title="Pending activation" body="Generated QR serials now appear in history and activation queue." />}
      </StepWizard>
    </>
  );
}

function QrActivation({ state, setState }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>> }) {
  const [selected, setSelected] = useState<GenerationRequest | null>(state.requests[0]);
  const { notify } = useToast();
  return (
    <>
      <PageHeader title="QR Activation Approvals" description="Quantity-based L1/L2 routing with request detail and Generated -> Printed -> Activated timeline." />
      <SectionCard title="Queue">
        <DataTable rows={state.requests} onRowClick={setSelected as (row: Record<string, unknown>) => void} columns={[{ key: "requester", header: "Requester" }, { key: "skuId", header: "SKU", render: (row) => getSku(String(row.skuId))?.name }, { key: "batchId", header: "Batch", render: (row) => <span className="mono">{getBatch(String(row.batchId))?.number}</span> }, { key: "quantity", header: "Qty", sortable: true }, { key: "route", header: "Route", render: (row) => <StatusChip>{String(row.route)}</StatusChip> }, { key: "status", header: "Status", render: (row) => <StatusChip>{String(row.status)}</StatusChip> }]} />
      </SectionCard>
      <DetailDrawer open={!!selected} title={selected?.id ?? "Request"} onClose={() => setSelected(null)}>
        {selected ? <><Timeline events={selected.approvals.map((item) => ({ title: item.step, subtitle: `${item.actor} / ${item.status}${item.reason ? ` / ${item.reason}` : ""}`, time: item.timestamp }))} /><div className="mt-5 flex gap-2"><button className="button button-primary" onClick={() => { setState((current) => ({ ...current, requests: current.requests.map((request) => request.id === selected.id ? { ...request, status: "Active" } : request) })); notify("Request approved. QRs flipped to Active."); }}>Approve</button><button className="button" onClick={() => notify("Reject reason captured: Wrong Batch")}>Reject with reason</button></div></> : null}
      </DetailDrawer>
    </>
  );
}

function QrHistory({ state }: { state: AppState }) {
  const [label, setLabel] = useState(false);
  return <><PageHeader title="Generation History" actions={<button className="button button-primary" onClick={() => setLabel(true)}>Download labels</button>} /><SectionCard title="All requests"><DataTable rows={state.requests} columns={[{ key: "date", header: "Date" }, { key: "requester", header: "User" }, { key: "skuId", header: "SKU", render: (row) => getSku(String(row.skuId))?.name }, { key: "quantity", header: "Qty" }, { key: "status", header: "Status", render: (row) => <StatusChip>{String(row.status)}</StatusChip> }]} /></SectionCard><LabelModal open={label} onClose={() => setLabel(false)} /></>;
}

function LabelModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { notify } = useToast();
  return <DetailDrawer open={open} onClose={onClose} title="Download and Labels"><FormGrid fields={["Format: PDF", "Size: 2.5 cm", "Fields: serial, batch, SKU, expiry, UUID"]} /><div className="mt-4 rounded-2xl border border-[var(--border)] p-6 text-center"><div className="mx-auto mb-3 grid h-28 w-28 place-items-center border-4 border-[var(--foreground)] mono">QR</div><p className="font-semibold">DT-7k3m9q / NG500-2026-04-A</p></div><button className="button button-primary mt-4" onClick={() => notify("Downloaded labels.pdf")}>Download labels.pdf</button></DetailDrawer>;
}

function Track({ state }: { state: AppState }) {
  return <><PageHeader title="Passport Search" description="Filters by SKU, batch, serial, status, holder, geography, date, checkpoint, and dispatch." /><SectionCard title="Results"><DataTable rows={state.qrRows} columns={[{ key: "serial", header: "Serial", render: (row) => <Link className="mono underline" to={`/app/track/${row.serial}`}>{String(row.serial)}</Link> }, { key: "skuId", header: "SKU", render: (row) => getSku(String(row.skuId))?.name }, { key: "batchId", header: "Batch", render: (row) => <span className="mono">{getBatch(String(row.batchId))?.number}</span> }, { key: "status", header: "Status", render: (row) => <StatusChip>{String(row.status)}</StatusChip> }, { key: "holderId", header: "Holder", render: (row) => getPartner(String(row.holderId))?.name ?? "CropShield" }]} /></SectionCard></>;
}

function Passport({ state, setState }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>> }) {
  const { serial = "DT-7k3m9q" } = useParams();
  const qr = state.qrRows.find((row) => row.serial === serial) ?? getQr(serial) ?? state.qrRows[0];
  const events = scanEvents.filter((event) => event.serial === qr.serial);
  const { notify } = useToast();
  return (
    <>
      <PageHeader title={`Passport ${qr.serial}`} eyebrow={qr.uuid} description="Identity, linkage tree, timeline, holder, expiry state, and QR actions." actions={<><button className="button" onClick={() => notify("Detailed CSV exported")}>Export</button><button className="button" onClick={() => setState((current) => ({ ...current, qrRows: current.qrRows.map((item) => item.serial === qr.serial ? { ...item, status: "Voided" } : item) }))}>Void</button><button className="button button-primary" onClick={() => setState((current) => ({ ...current, qrRows: current.qrRows.map((item) => item.serial === qr.serial ? { ...item, status: "Frozen" } : item) }))}>Freeze</button></>} />
      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <SectionCard title="Identity"><FormGrid fields={[`SKU: ${getSku(qr.skuId)?.name}`, `Batch: ${getBatch(qr.batchId)?.number}`, `Level: ${qr.level}`, `Holder: ${getPartner(qr.holderId)?.name ?? "CropShield"}`, `Status: ${qr.status}`]} /><div className="mt-4"><StatusChip>{qr.status}</StatusChip></div></SectionCard>
        <SectionCard title="Scan timeline"><Timeline events={(events.length ? events : scanEvents.slice(0, 4)).map((event) => ({ title: event.action, subtitle: `${event.actor} / ${event.place}${event.viaParent ? ` / via ${event.viaParent}` : ""}`, time: event.timestamp, tone: event.flagged ? "destructive" : "primary" }))} /></SectionCard>
      </div>
      <SectionCard title="Parent-child linkage"><Linkage serial={qr.serial} /></SectionCard>
    </>
  );
}

function Linkage({ serial }: { serial: string }) {
  const qr = getQr(serial);
  const parent = qr?.parentSerial ? getQr(qr.parentSerial) : null;
  return <div className="grid gap-3 md:grid-cols-3"><div className="rounded-xl bg-[var(--secondary)] p-3"><p className="font-semibold">Parent</p><p className="mono">{parent?.serial ?? "Top level"}</p></div><div className="rounded-xl bg-[var(--foreground)] p-3 text-[var(--background)]"><p className="font-semibold">Current</p><p className="mono">{serial}</p></div><div className="rounded-xl bg-[var(--secondary)] p-3"><p className="font-semibold">Children</p><p className="mono">{qr?.children.join(", ") || "No children"}</p></div></div>;
}

function DispatchList({ state }: { state: AppState }) {
  return <><PageHeader title="Dispatch" actions={<Link className="button button-primary" to="/app/dispatch/new">Create Dispatch</Link>} /><SectionCard title="Dispatch orders"><DataTable rows={state.dispatchRows} columns={[{ key: "slipNo", header: "Slip", render: (row) => <Link className="mono underline" to={`/app/dispatch/${row.id}`}>{String(row.slipNo)}</Link> }, { key: "partnerId", header: "Partner", render: (row) => getPartner(String(row.partnerId))?.name }, { key: "status", header: "Status", render: (row) => <StatusChip>{String(row.status)}</StatusChip> }, { key: "plannedDate", header: "Planned" }, { key: "variance", header: "Variance" }]} /></SectionCard></>;
}

function DispatchNew({ state, setState }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>> }) {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const { notify } = useToast();
  const create = () => {
    const dispatch: Dispatch = { ...state.dispatchRows[0], id: `ds-new-${state.dispatchRows.length + 1}`, slipNo: "DS-2606110099", status: "PENDING" };
    setState((current) => ({ ...current, dispatchRows: [dispatch, ...current.dispatchRows] }));
    notify("Dispatch created with consignment QR");
    navigate(`/app/dispatch/${dispatch.id}`);
  };
  return <WizardPage title="Create Dispatch Order" steps={["Partner", "Lines and route", "Preview"]} active={active} setActive={setActive} panels={[<FormGrid key="partner" fields={["Partner: MahaAgro Distributors", "Compliance: 94%", "Type: Distributor"]} />, <FormGrid key="l" fields={["SKU: NeemGuard Plus 500ml", "Batch: NG500-2026-04-A", "FEFO: suggested", "Route: Factory to MahaAgro"]} />, <EmptyState key="p" title="Slip preview" body="Brand logo top-left, consignment QR top-right, transporter and vehicle optional." action={<button className="button button-primary" onClick={create}>Confirm dispatch</button>} />]} />;
}

function DispatchDetail({ state, setState }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>> }) {
  const { id = "ds-1" } = useParams();
  const dispatch = state.dispatchRows.find((row) => row.id === id || row.slipNo === id) ?? state.dispatchRows[0];
  const [pdf, setPdf] = useState(false);
  const { notify } = useToast();
  return <><PageHeader title={dispatch.slipNo} eyebrow={dispatch.status} actions={<><button className="button" onClick={() => setPdf(true)}>PDF Preview</button><button className="button button-primary" onClick={() => { setState((current) => ({ ...current, dispatchRows: current.dispatchRows.map((row) => row.id === dispatch.id ? { ...row, status: "DELIVERED", receivedCount: row.expectedCount, variance: 0 } : row) })); notify("Dispute resolved and dispatch delivered"); }}>Resolve dispute</button></>} /><div className="grid gap-5 xl:grid-cols-2"><SectionCard title="Manifest"><DataTable rows={dispatch.lines.map((line, index) => ({ id: index, ...line }))} columns={[{ key: "skuId", header: "SKU", render: (row) => getSku(String(row.skuId))?.name }, { key: "batchId", header: "Batch", render: (row) => getBatch(String(row.batchId))?.number }, { key: "cartons", header: "Cartons" }, { key: "units", header: "Units" }, { key: "serials", header: "Serials", render: (row) => String(row.serials).slice(0, 40) }]} /></SectionCard><SectionCard title="Reconciliation"><FormGrid fields={[`Expected: ${dispatch.expectedCount}`, `Received: ${dispatch.receivedCount}`, `Variance: ${dispatch.variance}`, `Route: ${dispatch.route.join(" to ")}`]} /></SectionCard></div><LabelModal open={pdf} onClose={() => setPdf(false)} /></>;
}

function Returns({ state, setState }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>> }) {
  const [tab, setTab] = useState("REQUESTED");
  const [selected, setSelected] = useState<ReturnRequest | null>(null);
  const { notify } = useToast();
  const rows = state.returnRows.filter((row) => row.status === tab);
  const decide = (status: "APPROVED" | "REJECTED") => {
    if (!selected) return;
    setState((current) => ({ ...current, returnRows: current.returnRows.map((row) => row.id === selected.id ? { ...row, status } : row), qrRows: current.qrRows.map((qr) => selected.serials.includes(qr.serial) && status === "APPROVED" ? { ...qr, status: "Returned" } : qr) }));
    notify(`Return ${selected.id} ${status.toLowerCase()}`);
    setSelected(null);
  };
  return <><PageHeader title="Returns" description="Requested / Approved / Rejected tabs with approve-reject drawer, including D2C consumer return." /><Tabs tabs={["REQUESTED", "APPROVED", "REJECTED"]} active={tab} setActive={setTab} /><SectionCard title={`${tab} returns`}><DataTable rows={rows} onRowClick={(row) => setSelected(row as ReturnRequest)} columns={[{ key: "id", header: "Return ID", render: (row) => <span className="mono">{String(row.id)}</span> }, { key: "initiatorId", header: "Initiator", render: (row) => getPartner(String(row.initiatorId))?.name ?? String(row.consumerName ?? "Consumer") }, { key: "reason", header: "Reason" }, { key: "units", header: "Units" }, { key: "status", header: "Status", render: (row) => <StatusChip>{String(row.status)}</StatusChip> }]} /></SectionCard><DetailDrawer open={!!selected} title={selected?.id ?? ""} onClose={() => setSelected(null)}>{selected ? <><FormGrid fields={[`Reason: ${selected.reason}`, `Location: ${selected.location}`, `Serials: ${selected.serials.join(", ")}`, `Linked dispatch: ${selected.linkedDispatchId ?? "D2C"}`]} /><div className="mt-4 flex gap-2"><button className="button button-primary" onClick={() => decide("APPROVED")}>Approve</button><button className="button" onClick={() => decide("REJECTED")}>Reject</button></div></> : null}</DetailDrawer></>;
}

function RecallsPage({ state }: { state: AppState }) {
  return <><PageHeader title="Recalls" actions={<Link className="button button-primary" to="/app/recalls/new">Create Recall</Link>} /><SectionCard title="Recall list"><DataTable rows={state.recallRows} columns={[{ key: "id", header: "Recall", render: (row) => <Link className="mono underline" to={`/app/recalls/${row.id}`}>{String(row.id)}</Link> }, { key: "severity", header: "Severity", render: (row) => <StatusChip>{String(row.severity)}</StatusChip> }, { key: "reason", header: "Reason" }, { key: "scope", header: "Scope" }, { key: "status", header: "Status", render: (row) => <StatusChip>{String(row.status)}</StatusChip> }]} /></SectionCard></>;
}

function RecallNew({ state, setState }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>> }) {
  void state;
  const [active, setActive] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const { notify } = useToast();
  const navigate = useNavigate();
  return <><WizardPage title="Create Recall" steps={["Reason and scope", "Distribution summary", "Double confirm"]} active={active} setActive={setActive} panels={[<FormGrid key="reason" fields={["Reason: Labeling Error", "Severity: Critical", "Scope: By Batch NG500-2026-04-A"]} />, <MetricRows key="m" rows={[["Manufacturer", 24], ["Distributors", 42], ["Dealers", 21], ["Retailers", 13]]} />, <EmptyState key="c" title="Destructive confirmation" body="Are you absolutely sure? A critical recall flags affected units chain-wide." action={<button className="button button-primary" onClick={() => setConfirm(true)}>Create critical recall</button>} />]} /><ConfirmModal open={confirm} title="Create critical recall?" body="This will notify every holding partner and require acknowledgment." onClose={() => setConfirm(false)} onConfirm={() => { setState((current) => ({ ...current, recallRows: [current.recallRows[0], ...current.recallRows] })); notify("Critical recall triggered"); navigate("/app/recalls/RCL-260611-02"); }} /></>;
}

function RecallDetail({ state, setState }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>> }) {
  const { id = "RCL-260611-02" } = useParams();
  const recall = state.recallRows.find((row) => row.id === id) ?? state.recallRows[0];
  const { notify } = useToast();
  const returned = Math.round(recall.partnerResponses.reduce((sum, row) => sum + row.returned, 0) / Math.max(1, recall.partnerResponses.reduce((sum, row) => sum + row.unitsHeld, 0)) * 100);
  return <><PageHeader title={recall.id} eyebrow={`${recall.severity} / ${recall.status}`} actions={<button className="button button-primary" onClick={() => { setState((current) => ({ ...current, recallRows: current.recallRows.map((row) => row.id === recall.id ? { ...row, status: "CLOSED" } : row) })); notify("Recall closed with partial reason captured"); }}>Close recall</button>} /><div className="grid gap-5 xl:grid-cols-[220px_1fr]"><SectionCard title="Returned dial"><div className="grid aspect-square place-items-center rounded-full border-[18px] border-[var(--foreground)]"><div className="text-center"><p className="mono text-4xl">{returned}%</p><p className="text-xs text-[var(--muted-foreground)]">returned</p></div></div></SectionCard><SectionCard title="Acknowledgment matrix"><DataTable rows={recall.partnerResponses.map((row) => ({ id: row.partnerId, ...row }))} columns={[{ key: "partnerId", header: "Partner", render: (row) => getPartner(String(row.partnerId))?.name }, { key: "unitsHeld", header: "Held" }, { key: "response", header: "Response", render: (row) => <StatusChip>{String(row.response)}</StatusChip> }, { key: "returned", header: "Returned" }, { key: "daysOverdue", header: "Overdue" }]} /></SectionCard></div></>;
}

function Expiry({ state }: { state: AppState }) {
  const [tab, setTab] = useState("All");
  const rows = batches.map((batch) => ({ ...batch, skuName: getSku(batch.skuId)?.name, days: Math.ceil((new Date(batch.expiryDate).getTime() - new Date("2026-06-11").getTime()) / 86400000) })).filter((row) => tab === "All" || (tab === "Near Expiry" ? row.days > 0 && row.days < 90 : row.days <= 0));
  return <><PageHeader title="Expiry Management" description="Expired units remain scannable with warning to scanner and alert to brand." /><Tabs tabs={["All", "Near Expiry", "Expired"]} active={tab} setActive={setTab} /><SectionCard title={`${tab} batches`}><DataTable rows={rows} columns={[{ key: "number", header: "Batch", render: (row) => <span className="mono">{String(row.number)}</span> }, { key: "skuName", header: "Product" }, { key: "expiryDate", header: "Expiry" }, { key: "days", header: "Days", render: (row) => <StatusChip>{Number(row.days) <= 0 ? "Expired" : `${row.days} days`}</StatusChip> }, { key: "currentUnits", header: "Units" }]} /></SectionCard><p className="mt-3 text-xs text-[var(--muted-foreground)]">Dataset contains {state.qrRows.filter((qr) => qr.status === "Expired").length} expired QR examples.</p></>;
}

function Partners() {
  return <><PageHeader title="Partners" actions={<><Link className="button" to="/app/partners/approvals">Pending approvals</Link><Link className="button" to="/app/partners/import">Bulk upload</Link><Link className="button button-primary" to="/app/partners/new">Add partner</Link></>} /><SectionCard title="Partner network"><DataTable rows={partners} columns={[{ key: "code", header: "Code", render: (row) => <Link className="mono underline" to={`/app/partners/${row.id}`}>{String(row.code)}</Link> }, { key: "name", header: "Name" }, { key: "type", header: "Type" }, { key: "city", header: "City" }, { key: "compliance", header: "Compliance", render: (row) => <div className="w-32"><Progress value={Number(row.compliance)} /></div> }, { key: "status", header: "Status", render: (row) => <StatusChip>{String(row.status)}</StatusChip> }]} /></SectionCard></>;
}

function PartnerApprovals() {
  const pending = partners.filter((partner) => partner.status === "Pending" || !partner.kycVerified);
  const { notify } = useToast();
  return <><PageHeader title="Partner approvals" description="Invites, self-registrations, KYC docs preview, and DigiTathya verification badge." /><SectionCard title="Pending approval drawer rows"><DataTable rows={pending} columns={[{ key: "code", header: "Proposed Code", render: (row) => <span className="mono">{String(row.code)}</span> }, { key: "name", header: "Partner" }, { key: "gstin", header: "GSTIN" }, { key: "kycVerified", header: "KYC", render: (row) => <StatusChip>{row.kycVerified ? "KYC-verified-by-DigiTathya" : "Needs KYC"}</StatusChip> }, { key: "id", header: "Action", render: () => <button className="button" onClick={() => notify("Partner approved and welcome notification sent")}>Approve</button> }]} /></SectionCard></>;
}

function PartnerNew() {
  const [active, setActive] = useState(0);
  return <WizardPage title="Add Partner" steps={["Basic info", "Business details", "Hierarchy", "Review"]} active={active} setActive={setActive} panels={[<FormGrid key="basic" fields={["Name: Narmada Farm Inputs", "Type: Dealer", "Contact: Priya Shah", "Phone: +91 90990 11022"]} />, <FormGrid key="b" fields={["GSTIN: 24AANFN2190C1Z1", "Existing GSTIN: code will be extended", "PAN: AANFN2190C", "State: GJ"]} />, <FormGrid key="h" fields={["Parent: Bharat Krishi Supply", "Assigned states: GJ, MP", "Informational only: yes"]} />, <EmptyState key="r" title="Pending record ready" body="Review creates a Pending partner and logs the action." />]} />;
}

function PartnerImport() {
  const [active, setActive] = useState(0);
  return <WizardPage title="Partner bulk upload" steps={["Upload", "Map and validate", "Import"]} active={active} setActive={setActive} panels={[<EmptyState key="upload" title="CSV/XLSX <=10MB" body="Sample template link and upload dropzone." />, <ValidationReport key="v" />, <EmptyState key="i" title="Rows created as Pending" body="Valid partners enter approvals with KYC preview." />]} />;
}

function PartnerDetail() {
  const { id = "p-dis-mahaagro" } = useParams();
  const [tab, setTab] = useState("Overview");
  const partner = getPartner(id) ?? partners[1];
  return <><PageHeader title={partner.name} eyebrow={partner.code} description="Overview, dispatches, returns, scan events, event log, geofence polygon mock." /><Tabs tabs={["Overview", "Dispatches", "Returns", "Scan Events", "Event Log"]} active={tab} setActive={setTab} /><SectionCard title={tab}>{tab === "Overview" && <><FormGrid fields={[`Compliance: ${partner.compliance}%`, `GSTIN: ${partner.gstin}`, `PAN: ${partner.pan}`, `Status: ${partner.status}`]} /><div className="mt-4 h-48 rounded-2xl border border-[var(--border)] bg-[var(--secondary)] p-4"><p className="font-semibold">Geofence polygon map mock</p><p className="mono mt-2">{partner.geofence.map((point) => point.join(",")).join(" / ")}</p></div></>}{tab === "Dispatches" && <DataTable rows={dispatches.filter((row) => row.partnerId === partner.id || row.fromId === partner.id)} columns={[{ key: "slipNo", header: "Slip" }, { key: "status", header: "Status", render: (row) => <StatusChip>{String(row.status)}</StatusChip> }, { key: "variance", header: "Variance" }]} />}{tab === "Returns" && <DataTable rows={returns.filter((row) => row.initiatorId === partner.id)} columns={[{ key: "id", header: "ID" }, { key: "reason", header: "Reason" }, { key: "status", header: "Status", render: (row) => <StatusChip>{String(row.status)}</StatusChip> }]} />}{tab === "Scan Events" && <Timeline events={scanEvents.filter((event) => event.entityId === partner.id).map((event) => ({ title: event.action, subtitle: event.serial, time: event.timestamp }))} />}{tab === "Event Log" && <Timeline events={[{ title: "Status updated", subtitle: "Active by Ananya Rao", time: "2026-06-02" }, { title: "GSTIN verified", subtitle: "KYC-verified-by-DigiTathya", time: "2026-05-29" }]} />}</SectionCard></>;
}

function ContractManufacturers() {
  return <><PageHeader title="Contract Manufacturers" description="Brand-side SKU assignment with per-SKU QR generation, factory-exit scanning, and pack/link permissions." /><SectionCard title="Sunrise Formulations permissions"><DataTable rows={skus.map((sku, index) => ({ id: sku.id, sku: sku.name, qr: index < 2, scan: true, pack: index !== 3 }))} columns={[{ key: "sku", header: "SKU" }, { key: "qr", header: "QR generation", render: (row) => <Toggle on={Boolean(row.qr)} /> }, { key: "scan", header: "Factory-exit scanning", render: (row) => <Toggle on={Boolean(row.scan)} /> }, { key: "pack", header: "Pack/link", render: (row) => <Toggle on={Boolean(row.pack)} /> }]} /></SectionCard></>;
}

function Toggle({ on }: { on: boolean }) {
  const [enabled, setEnabled] = useState(on);
  return <button className={`h-7 w-12 rounded-full p-1 ${enabled ? "bg-[var(--foreground)]" : "bg-[var(--border-strong)]"}`} onClick={() => setEnabled(!enabled)}><span className={`block h-5 w-5 rounded-full bg-[var(--card)] transition ${enabled ? "translate-x-5" : ""}`} /></button>;
}

function AlertsPage({ state, setState }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>> }) {
  const [tab, setTab] = useState("All");
  const rows = state.alerts.filter((alert) => tab === "All" || alert.severity === tab);
  const { notify } = useToast();
  return <><PageHeader title="Alerts" description="All six MVP alert types, deep links, tamper card, and resolved opacity." /><Tabs tabs={["All", "Critical", "Warning", "Info"]} active={tab} setActive={setTab} /><SectionCard title="Alert cards"><DataTable rows={rows} columns={[{ key: "severity", header: "Severity", render: (row) => <StatusChip>{String(row.severity)}</StatusChip> }, { key: "type", header: "Type" }, { key: "title", header: "Title", render: (row) => <Link className="underline" to={String(row.link)}>{String(row.title)}</Link> }, { key: "resolved", header: "Resolved", render: (row) => <StatusChip>{row.resolved ? "Resolved" : "Open"}</StatusChip> }, { key: "id", header: "Action", render: (row) => <button className="button" onClick={() => { setState((current) => ({ ...current, alerts: current.alerts.map((alert) => alert.id === row.id ? { ...alert, resolved: true } : alert) })); notify("Alert resolved"); }}>Resolve</button> }]} /></SectionCard><SectionCard title="Tamper alert detail"><FormGrid fields={["Scan A: Nagpur 18:42 IST", "Scan B: Mumbai 18:50 IST", "Impossible travel: Nagpur to Mumbai in 8 min", "Action: Freeze QR or Dismiss, never auto-freeze"]} /></SectionCard></>;
}

function Analytics() {
  const { notify } = useToast();
  return <><PageHeader title="Analytics and Reports" actions={<><button className="button" onClick={() => notify("Exported analytics.csv")}>CSV</button><button className="button button-primary" onClick={() => notify("Exported analytics.pdf")}>PDF</button></>} /><SectionCard title="Filters"><FormGrid fields={["SKU: All", "Batch: All", "Hierarchy: All", "Partner: All", "Geography: MH", "Date: Last 30 days"]} /></SectionCard><div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{["Scan volume by checkpoint", "Partner compliance ranking", "Geography heatmap of scans", "Expiry exposure", "Recall status summary", "Returns by reason"].map((title) => <SectionCard key={title} title={title}><MockChart /></SectionCard>)}</div></>;
}

function Settings() {
  return <><PageHeader title="Settings" /><SectionCard title="Grouped settings cards"><FormGrid fields={[`Expiry alert threshold: ${manufacturer.settings.expiryThreshold}%`, `Scan compliance threshold: ${manufacturer.settings.complianceThreshold}%`, `Recall SLA: ${manufacturer.settings.recallSlaHours}h`, `L2 approval band: >${manufacturer.settings.l2QuantityBand}`, "Cascading-scan defaults: enabled", "Scan-result fields: SKU, batch, expiry, mfg date, status", "Notification preferences: bell + push"]} /></SectionCard></>;
}

function Users() {
  const [invite, setInvite] = useState(false);
  const { notify } = useToast();
  return <><PageHeader title="User Management" actions={<button className="button button-primary" onClick={() => setInvite(true)}>Invite User</button>} /><SectionCard title="Internal users"><DataTable rows={internalUsers} columns={[{ key: "name", header: "Name" }, { key: "email", header: "Email" }, { key: "role", header: "Role" }, { key: "status", header: "Status", render: (row) => <StatusChip>{String(row.status)}</StatusChip> }]} /></SectionCard><DetailDrawer open={invite} title="Invite User" onClose={() => setInvite(false)}><FormGrid fields={["Email: new.user@cropshield.in", "Role: Field Operator"]} /><button className="button button-primary mt-4" onClick={() => { notify("Invite sent"); setInvite(false); }}>Send invite</button></DetailDrawer></>;
}

function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  const rows = appSearchIndex.filter((item) => JSON.stringify(item).toLowerCase().includes(q.toLowerCase()));
  return <><PageHeader title="Global Search" description={`Results for "${q || "all"}"`} /><SectionCard title="Results"><DataTable rows={rows} columns={[{ key: "type", header: "Type" }, { key: "label", header: "Result", render: (row) => <Link className="underline" to={String(row.path)}>{String(row.label)}</Link> }, { key: "meta", header: "Meta" }]} /></SectionCard></>;
}

function PartnerHome({ state }: { state: AppState }) {
  return <><PageHeader title="Partner Home" eyebrow="MahaAgro Distributors" description="Lighter sidebar with partner operations and recall blocking flow." /><div className="grid gap-4 md:grid-cols-3"><KpiCard label="Stock units" value={partnerStock.find((stock) => stock.partnerId === "p-dis-mahaagro")?.rows.reduce((sum, row) => sum + row.units, 0).toString() ?? "0"} caption="Compliance hidden from partner" /><KpiCard label="Open dispatches" value={state.dispatchRows.filter((row) => row.partnerId === "p-dis-mahaagro").length.toString()} caption="Receive or dispute" /><KpiCard label="Recall actions" value="3" caption="Acknowledge / Quarantine / Return" /></div></>;
}

function PartnerEvents() {
  const { notify } = useToast();
  return <><PageHeader title="Partner Events" actions={<button className="button button-primary" onClick={() => notify("Exported partner-events.csv")}>Export</button>} /><SectionCard title="Date range filtered events"><DataTable rows={scanEvents} columns={[{ key: "timestamp", header: "Time" }, { key: "serial", header: "Serial" }, { key: "action", header: "Action" }, { key: "place", header: "Location" }]} /></SectionCard></>;
}

function PartnerStockPage() {
  const rows = partnerStock.find((stock) => stock.partnerId === "p-dis-mahaagro")?.rows.map((row, index) => ({ id: index, ...row, sku: getSku(row.skuId)?.name, batch: getBatch(row.batchId)?.number, expiry: getBatch(row.batchId)?.expiryDate })) ?? [];
  return <><PageHeader title="Partner Stock" description="By SKU and batch, with expiry indicators. Compliance rate intentionally hidden." /><SectionCard title="Stock rows"><DataTable rows={rows} columns={[{ key: "sku", header: "SKU" }, { key: "batch", header: "Batch" }, { key: "expiry", header: "Expiry" }, { key: "units", header: "Units" }, { key: "serials", header: "Serials", render: (row) => String(row.serials).slice(0, 50) }]} /></SectionCard></>;
}

function PartnerReturns({ state, setState }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>> }) {
  const { notify } = useToast();
  return <><PageHeader title="Partner Returns" actions={<button className="button button-primary" onClick={() => { setState((current) => ({ ...current, returnRows: [{ ...current.returnRows[0], id: `RR-NEW-${current.returnRows.length + 1}`, status: "REQUESTED" }, ...current.returnRows] })); notify("Return request raised"); }}>Raise request</button>} /><SectionCard title="My returns"><DataTable rows={state.returnRows.filter((row) => row.initiatorId === "p-dis-mahaagro" || row.initiatorId === "p-dea-vidarbha")} columns={[{ key: "id", header: "ID" }, { key: "reason", header: "Reason" }, { key: "status", header: "Status", render: (row) => <StatusChip>{String(row.status)}</StatusChip> }]} /></SectionCard></>;
}

function PartnerRecalls() {
  const { notify } = useToast();
  return <><PageHeader title="Partner Recalls" /><div className="grid gap-5 md:grid-cols-2">{recalls.map((recall) => <SectionCard key={recall.id} title={`${recall.id} / ${recall.severity}`}><StatusChip>{recall.status}</StatusChip><p className="mt-3 text-sm text-[var(--muted-foreground)]">{recall.reason} / {recall.scope}</p><div className="mt-4 flex gap-2"><button className="button" onClick={() => notify("Recall acknowledged")}>Acknowledge</button><button className="button" onClick={() => notify("Stock quarantined")}>Quarantine</button><button className="button button-primary" onClick={() => notify("Return initiated")}>Return</button></div></SectionCard>)}</div></>;
}

function PartnerProfile() {
  return <><PageHeader title="Partner Profile" /><SectionCard title="Workspaces and operators"><FormGrid fields={["Workspace: MahaAgro Distributors", "Manufacturer: CropShield", "Operator: Nitin Patil", "Invite: KYC re-verification required", "Phone: +91 98230 55421"]} /></SectionCard></>;
}

function MobileFrame({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[var(--background)] p-6"><div className="mx-auto h-[844px] w-[390px] overflow-hidden rounded-[34px] border-[10px] border-[var(--foreground)] bg-[var(--card)] shadow-[var(--shadow-md)]"><div className="flex h-10 items-center justify-between bg-[var(--foreground)] px-6 text-xs font-bold text-[var(--background)]"><span>19:20</span><span>DigiTathya</span><span>5G</span></div><div className="h-[794px] overflow-y-auto p-4">{children}</div></div></div>;
}

function MobileTop({ title }: { title: string }) {
  return <><h1 className="text-2xl font-semibold tracking-[-0.04em]">{title}</h1><p className="mb-4 mt-1 text-sm text-[var(--muted-foreground)]">MahaAgro workspace / CropShield</p></>;
}

function MobileLogin() {
  return <><MobileTop title="Mobile login" /><FormGrid fields={["Email or phone: +91 98230 55421", "OTP: 482910"]} /><Link className="button button-primary mt-4 block text-center" to="/mobile/workspaces">Verify OTP</Link></>;
}

function MobileRegister() {
  const [active, setActive] = useState(0);
  return <><MobileTop title="Register partner" /><StepWizard steps={["Form", "KYC", "Verifying", "Sent"]} active={active} setActive={setActive}>{active === 0 && <FormGrid fields={["GSTIN", "Contact", "Phone"]} />}{active === 1 && <EmptyState title="Capture KYC" body="GSTIN proof image/PDF uploaded." />}{active === 2 && <EmptyState title="DigiTathya verifying" body="KYC verification in progress." />}{active === 3 && <EmptyState title="Sent to manufacturer" body="CropShield approval pending." />}</StepWizard></>;
}

function MobileWorkspaces() {
  return <><MobileTop title="Workspaces" /><ActionList rows={[["CropShield / MahaAgro", "/mobile/home", "Active"], ["New invite / EF Polymer", "/mobile/register", "KYC re-verification required"]]} /></>;
}

function MobileHome() {
  return <><MobileTop title="Scan-first actions" /><div className="grid grid-cols-2 gap-2">{mobileNav.slice(1).map(([path, label]) => <Link key={path} className="button min-h-20" to={path}>{label}</Link>)}</div></>;
}

function MobileScan({ state, setState }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>> }) {
  void state;
  const [variant, setVariant] = useState(0);
  const [error, setError] = useState<"gps" | "offline" | null>(null);
  const result = scanResultVariants[variant];
  const { notify } = useToast();
  if (error) return <><MobileTop title={error === "gps" ? "GPS is off" : "Offline"} /><EmptyState title={error === "gps" ? "Enable GPS to scan" : "No network"} body={error === "gps" ? "Location is mandatory for track-and-trace scan events." : "Scan queue is paused until connection returns."} action={<button className="button button-primary" onClick={() => setError(null)}>Retry</button>} /></>;
  return <><MobileTop title="Scan QR" /><div className="rounded-3xl border-4 border-[var(--foreground)] bg-[var(--secondary)] p-6 text-center"><div className="mx-auto grid h-52 w-52 place-items-center border-2 border-dashed border-[var(--border-strong)] mono">VIEWFINDER</div><button className="button button-primary mt-4" onClick={() => { setVariant((current) => (current + 1) % scanResultVariants.length); notify("Simulated scan picked next QR state"); }}>Simulate scan</button></div><div className="mt-4 rounded-2xl border border-[var(--border)] p-4"><StatusChip>{result.status}</StatusChip><h2 className="mt-2 text-xl font-semibold">{result.title}</h2><p className="mono mt-1">{result.serial}</p><p className="mt-2 text-sm text-[var(--muted-foreground)]">{result.message}</p><button className="button mt-3" onClick={() => setState((current) => ({ ...current, qrRows: current.qrRows.map((qr) => qr.serial === result.serial ? { ...qr, status: result.status } : qr) }))}>Record action</button></div><div className="mt-3 grid grid-cols-2 gap-2"><button className="button" onClick={() => setError("gps")}>GPS-off state</button><button className="button" onClick={() => setError("offline")}>Offline state</button></div></>;
}

function MobilePack() {
  const [count, setCount] = useState(14);
  const { notify } = useToast();
  return <><MobileTop title="Pack / Link" /><FormGrid fields={["Parent scanned: BX-NG-0001", `Child counter: ${count}/24`, "Partial-fill warning: active"]} /><div className="mt-4 flex gap-2"><button className="button" onClick={() => setCount(Math.max(0, count - 1))}>Swipe-remove child</button><button className="button button-primary" onClick={() => notify("Pack confirmed: parent-child links updated")}>Confirm</button></div></>;
}

function MobileReceive({ state, setState }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>> }) {
  void state;
  const [blocked, setBlocked] = useState(false);
  const { notify } = useToast();
  if (blocked) return <><MobileTop title="Wrong partner blocked" /><EmptyState title="Dispatch belongs to another partner" body="DS-2606100019 is assigned to Vidarbha Agro Dealer, not MahaAgro." action={<button className="button" onClick={() => setBlocked(false)}>Back</button>} /></>;
  return <><MobileTop title="Receive dispatch" /><FormGrid fields={["Dispatch QR: DS-2606110007", "Manifest: PL-NG-0001", "Cascade: 30 cartons, 2880 units"]} /><div className="mt-4 grid gap-2"><button className="button button-primary" onClick={() => { setState((current) => ({ ...current, dispatchRows: current.dispatchRows.map((row) => row.id === "ds-1" ? { ...row, status: "DELIVERED", receivedCount: row.expectedCount } : row) })); notify("Receipt confirmed with cascade success"); }}>Confirm Receipt</button><button className="button" onClick={() => notify("Mismatch flagged for reconciliation")}>Flag Mismatch</button><button className="button" onClick={() => setBlocked(true)}>Wrong-partner blocked state</button></div></>;
}

function MobileReturns({ state, setState }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>> }) {
  const { notify } = useToast();
  return <><MobileTop title="Raise return" /><FormGrid fields={["Scan: DT-7k3m9q", "Reason: Recall", "Submitted ID: RR-260611-001"]} /><button className="button button-primary mt-4" onClick={() => { setState((current) => ({ ...current, returnRows: [{ ...current.returnRows[0], id: `RR-MOB-${current.returnRows.length + 1}`, status: "REQUESTED" }, ...current.returnRows] })); notify("Return submitted"); }}>Submit return</button><SectionCard title="Status tracking"><DataTable rows={state.returnRows.slice(0, 3)} columns={[{ key: "id", header: "ID" }, { key: "status", header: "Status", render: (row) => <StatusChip>{String(row.status)}</StatusChip> }]} /></SectionCard></>;
}

function MobileRecall() {
  const { notify } = useToast();
  return <><MobileTop title="Recall notices" />{recalls.map((recall) => <div key={recall.id} className="mb-3 rounded-2xl border border-[var(--border)] p-4"><StatusChip>{recall.severity}</StatusChip><h2 className="mt-2 font-semibold">{recall.id}</h2><p className="text-sm text-[var(--muted-foreground)]">{recall.severity === "Critical" ? "Mandatory acknowledge." : "Acknowledge, quarantine, or return."}</p><div className="mt-3 flex gap-2"><button className="button" onClick={() => notify("Acknowledged")}>Ack</button><button className="button" onClick={() => notify("Quarantined")}>Quarantine</button><button className="button" onClick={() => notify("Return started")}>Return</button></div></div>)}</>;
}

function MobileHistory() {
  const { notify } = useToast();
  return <><MobileTop title="History" /><Timeline events={scanEvents.slice(0, 5).map((event) => ({ title: `${event.action} ${event.serial}`, subtitle: event.place, time: event.timestamp }))} /><button className="button mt-4" onClick={() => notify("Scan flagged as error")}>Flag-as-Error</button></>;
}

function MobileProfile() {
  return <><MobileTop title="Profile" /><FormGrid fields={["User: Nitin Patil", "Role: Distributor Admin", "Workspace: MahaAgro", "Operators: 4"]} /></>;
}

function NotFound() {
  return <EmptyState title="404" body="This route does not exist in the DigiTathya prototype." action={<Link className="button button-primary" to="/app/dashboard">Back to dashboard</Link>} />;
}
