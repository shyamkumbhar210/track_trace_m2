type Tone =
  | "primary"
  | "muted"
  | "success"
  | "warning"
  | "destructive"
  | "info";

const navItems = [
  "Dashboard",
  "Products",
  "QR Management",
  "Approvals",
  "Track & Trace",
  "Dispatch",
  "Returns",
  "Recalls",
  "Expiry",
  "Alerts",
  "Partners",
  "Analytics",
  "Settings",
];

const kpis = [
  { label: "Total Active QRs", value: "12.84L", delta: "+8.4%", caption: "CropShield portfolio" },
  { label: "Scan Events Today", value: "18,426", delta: "+12.1%", caption: "Updated 19:04 IST" },
  { label: "Active Partners", value: "248", delta: "+6", caption: "Across 9 states" },
  { label: "Scan Compliance", value: "84.7%", delta: "-2.3%", caption: "Threshold 70%" },
];

const attention = [
  { label: "QR activation approvals", value: "7 pending", tone: "warning" as Tone },
  { label: "Suspected duplicate / tamper alerts", value: "2 critical", tone: "destructive" as Tone },
  { label: "Recall acknowledgments pending", value: "11 partners", tone: "destructive" as Tone },
  { label: "Near-expiry batches", value: "5 batches", tone: "warning" as Tone },
];

const approvals = [
  {
    requester: "Asha Iyer",
    sku: "NeemGuard Plus 500ml",
    batch: "NG500-2026-04-A",
    levels: "Unit, Carton",
    qty: "10,000",
    route: "L1",
    status: "Awaiting L1",
  },
  {
    requester: "Sunrise Formulations",
    sku: "SoilMax BioStim 1L",
    batch: "SM1L-2026-03-C",
    levels: "Unit, Box, Carton",
    qty: "28,500",
    route: "L1 -> L2",
    status: "L1 approved",
  },
  {
    requester: "Rohan Kale",
    sku: "CropShield TraceTag",
    batch: "CST-2026-05-B",
    levels: "Pallet",
    qty: "50,000",
    route: "L1 -> L2",
    status: "Awaiting L2",
  },
];

const products = [
  { sku: "NGP-500", name: "NeemGuard Plus 500ml", batch: "NG500-2026-04-A", expiry: "18 Apr 2027", ratio: "24 units/carton", qrs: "1.8L" },
  { sku: "SMB-1L", name: "SoilMax BioStim 1L", batch: "SM1L-2026-03-C", expiry: "06 Mar 2027", ratio: "12 units/carton", qrs: "84K" },
  { sku: "FGO-250", name: "FungiOff Granules 250g", batch: "FGO250-2026-02-B", expiry: "11 Feb 2027", ratio: "48 units/carton", qrs: "2.2L" },
];

const passports = [
  { serial: "DT-948201", uuid: "8f7c-41b2-9d3a", status: "In Circulation", holder: "MahaAgro Distributors, Nagpur", time: "11 Jun 2026, 18:42 IST" },
  { serial: "DT-948202", uuid: "3d21-77c9-0a44", status: "Frozen", holder: "Route anomaly: Delhi / Mumbai", time: "11 Jun 2026, 16:08 IST" },
  { serial: "DT-948203", uuid: "ae91-4f12-b810", status: "Recalled", holder: "Krishi Dealer Hub, Pune", time: "10 Jun 2026, 20:14 IST" },
];

const dispatches = [
  { slip: "DS-2606110007", partner: "MahaAgro Distributors, Nagpur", sku: "NGP-500 / 417 cartons", status: "IN_TRANSIT", variance: "0" },
  { slip: "DS-2606100019", partner: "Vidarbha Agro Dealer, Akola", sku: "SMB-1L / 88 cartons", status: "DISPUTED", variance: "14 missing" },
  { slip: "DS-2606090031", partner: "Kisan Retail Point, Nashik", sku: "FGO-250 / 42 cartons", status: "DELIVERED", variance: "0" },
];

const partners = [
  { code: "DIS-MH-000045", name: "MahaAgro Distributors", type: "Distributor", city: "Nagpur", compliance: 94, status: "Active" },
  { code: "DEA-MH-000219", name: "Vidarbha Agro Dealer", type: "Dealer", city: "Akola", compliance: 72, status: "Active" },
  { code: "RET-MH-000884", name: "Kisan Retail Point", type: "Retailer", city: "Nashik", compliance: 61, status: "Pending" },
  { code: "CM-GJ-000012", name: "Sunrise Formulations", type: "Contract Mfr", city: "Vadodara", compliance: 88, status: "Active" },
];

const recallPartners = [
  { name: "MahaAgro Distributors", held: 4200, response: "Acknowledge", returned: 58, overdue: "0d" },
  { name: "Vidarbha Agro Dealer", held: 1180, response: "Quarantine", returned: 36, overdue: "2d" },
  { name: "Kisan Retail Point", held: 260, response: "Silent", returned: 0, overdue: "4d" },
];

const mobileActions = {
  distributor: ["Receive", "Dispatch", "Return", "Verify"],
  retailer: ["Receive", "Return", "Verify"],
  operator: ["Dispatch", "Verify"],
};

const toneClasses: Record<Tone, string> = {
  primary: "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]",
  muted: "border-[var(--border)] bg-[var(--muted)] text-[var(--muted-foreground)]",
  success: "border-transparent bg-[color-mix(in_srgb,var(--success)_14%,transparent)] text-[var(--success)]",
  warning: "border-transparent bg-[color-mix(in_srgb,var(--warning)_16%,transparent)] text-[var(--warning)]",
  destructive: "border-transparent bg-[color-mix(in_srgb,var(--destructive)_13%,transparent)] text-[var(--destructive)]",
  info: "border-transparent bg-[color-mix(in_srgb,var(--info)_12%,transparent)] text-[var(--info)]",
};

function statusTone(status: string): Tone {
  if (["Active", "In Circulation", "DELIVERED", "Approved"].includes(status)) return "success";
  if (["Frozen", "Recalled", "DISPUTED", "Critical", "Rejected"].includes(status)) return "destructive";
  if (["Pending", "Awaiting L1", "Awaiting L2", "L1 approved", "IN_TRANSIT"].includes(status)) return "warning";
  if (["Expired"].includes(status)) return "warning";
  return "muted";
}

function StatusChip({ children, tone }: { children: React.ReactNode; tone?: Tone }) {
  const resolvedTone = tone ?? (typeof children === "string" ? statusTone(children) : "muted");

  return <span className={`dt-chip ${toneClasses[resolvedTone]}`}>{children}</span>;
}

function Card({
  title,
  eyebrow,
  children,
  action,
  className = "",
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  action?: string;
  className?: string;
}) {
  return (
    <section className={`dt-card dt-fade-in p-5 ${className}`}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          {eyebrow ? <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">{eyebrow}</p> : null}
          <h2 className="text-lg font-semibold tracking-[-0.025em] text-[var(--card-foreground)]">{title}</h2>
        </div>
        {action ? <button className="dt-button border border-[var(--border)] bg-[var(--secondary)]">{action}</button> : null}
      </div>
      {children}
    </section>
  );
}

function Progress({ value }: { value: number }) {
  const color = value >= 90 ? "var(--success)" : value >= 70 ? "var(--warning)" : "var(--destructive)";
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-[var(--muted)]">
      <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

function MiniLineChart() {
  return (
    <div>
      <svg viewBox="0 0 520 180" className="h-48 w-full" role="img" aria-label="Scan activity over time">
        <path d="M20 150 H500" stroke="var(--border)" />
        <path d="M20 110 H500" stroke="var(--border)" />
        <path d="M20 70 H500" stroke="var(--border)" />
        <path d="M20 30 H500" stroke="var(--border)" />
        <path d="M20 132 C80 118 105 76 150 91 C195 106 205 42 260 56 C318 71 330 122 382 89 C430 58 455 42 500 28" fill="none" stroke="var(--chart-1)" strokeLinecap="round" strokeWidth="3" />
        <path d="M20 146 C85 126 110 134 150 120 C210 98 220 92 260 104 C315 120 340 106 382 96 C432 86 460 79 500 72" fill="none" stroke="var(--chart-3)" strokeLinecap="round" strokeWidth="2" />
      </svg>
      <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
        <span>Source: Mock scan events, last 7 days IST</span>
        <span>Legend: dark = all scans, gray = verified scans</span>
      </div>
    </div>
  );
}

function BarChart() {
  const bars = [
    ["Factory Exit", 96],
    ["Distributor Receive", 88],
    ["Dealer Dispatch", 74],
    ["Retail Verify", 62],
  ] as const;

  return (
    <div className="space-y-4">
      {bars.map(([label, value]) => (
        <div key={label} className="grid grid-cols-[130px_1fr_44px] items-center gap-3">
          <span className="text-xs font-medium text-[var(--muted-foreground)]">{label}</span>
          <Progress value={value} />
          <span className="dt-mono text-right">{value}%</span>
        </div>
      ))}
      <p className="text-xs text-[var(--muted-foreground)]">Checkpoint compliance by required scan step, current month.</p>
    </div>
  );
}

function SectionHeader({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <div className="mb-5">
      <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">{eyebrow}</p>
      <h2 className="text-2xl font-semibold tracking-[-0.035em]">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm text-[var(--muted-foreground)]">{copy}</p>
    </div>
  );
}

function ModulePill({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-[var(--border)] bg-[var(--secondary)] px-3 py-1 text-xs font-semibold">{children}</span>;
}

function MobileShell({
  role,
  partner,
  actions,
  children,
}: {
  role: string;
  partner: string;
  actions: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="dt-scale-in rounded-[28px] border border-[var(--border-strong)] bg-[var(--foreground)] p-2 text-[var(--background)] shadow-[var(--shadow-md)]">
      <div className="rounded-[22px] bg-[var(--card)] p-4 text-[var(--foreground)]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">{role}</p>
            <h3 className="text-base font-semibold tracking-[-0.025em]">{partner}</h3>
          </div>
          <div className="h-9 w-9 rounded-full bg-[var(--foreground)] text-center text-xs font-bold leading-9 text-[var(--background)]">DT</div>
        </div>
        <div className="mb-4 rounded-2xl border border-[var(--border)] bg-[var(--secondary)] p-4">
          <p className="text-xs text-[var(--muted-foreground)]">Last scan</p>
          <p className="dt-mono mt-1">DT-948201</p>
          <p className="mt-1 text-sm font-semibold">NeemGuard Plus 500ml</p>
          <StatusChip tone="success">Verified</StatusChip>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action) => (
            <button key={action} className="dt-button border border-[var(--border)] bg-[var(--secondary)] text-left">
              {action}
            </button>
          ))}
        </div>
        {children}
      </div>
    </div>
  );
}

function ModuleGrid() {
  const modules = [
    {
      title: "Auth & First Run",
      text: "Email OTP login with resend timer, wrong / expired OTP states, four-step brand onboarding, hierarchy lock note, and user invites.",
      tags: ["OTP 6-digit", "Logo <=500KB", "L1-L4 templates"],
    },
    {
      title: "Products & Hierarchy",
      text: "Category tree, SKU tabs, packaging ratios, QR-enabled levels, cascading scan toggles, batch lifecycle, and CSV dry-run import.",
      tags: ["Future changes only", "Open -> Closed -> Archived", "20 inline errors"],
    },
    {
      title: "QR Management",
      text: "Generation wizard, request limit, parent-child preview, approval queue, label download modal, void, freeze, and status chips.",
      tags: ["Max 50,000", "L1 / L2 routing", "Terminal void"],
    },
    {
      title: "Track & Trace",
      text: "Passport search, detailed event timeline, route deviation markers, cascade indicators, GPS accuracy flags, and current holder state.",
      tags: ["DT serial", "UUID", "Export CSV"],
    },
    {
      title: "Dispatch",
      text: "Slip list, route-aware create wizard, FEFO suggestions, consignment QR PDF preview, reconciliation, and mismatch details.",
      tags: ["DS-YYMMDDNNNN", "Cancel pre-transit", "Variance"],
    },
    {
      title: "Returns Log",
      text: "Read-only partner return event visibility with reasons, affected serials, GPS pin, and linked dispatch reference.",
      tags: ["No approval", "Recall / Damage", "Event facts"],
    },
    {
      title: "Recalls",
      text: "Critical or standard recall wizard, live distribution summary, double confirm, partner acknowledgment matrix, and closure lifecycle.",
      tags: ["4h SLA", "Returned dial", "ACTIVE -> CLOSED"],
    },
    {
      title: "Expiry",
      text: "SKU or batch-level expiry settings, 70% shelf-life threshold, near-expiry tabs, holder breakdown, and scanner warning copy.",
      tags: ["Scannable expired", "Threshold visible", "Location split"],
    },
    {
      title: "Partners",
      text: "Partner approval, KYC preview, generated state-coded partner IDs, bulk upload, detail tabs, and logged state transitions.",
      tags: ["DIS-MH-000045", "GSTIN validation", "Suspend / Reactivate"],
    },
    {
      title: "Analytics & Settings",
      text: "Shared filters, exports, scan volume, compliance ranking, heatmap, recall summary, returns reason report, and policy cards.",
      tags: ["CSV / PDF", "Partner rate hidden", "Field toggles"],
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {modules.map((module) => (
        <div key={module.title} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
          <h3 className="font-semibold tracking-[-0.025em]">{module.title}</h3>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">{module.text}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {module.tags.map((tag) => (
              <ModulePill key={tag}>{tag}</ModulePill>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="dt-glass sticky top-0 z-30 flex h-14 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--foreground)] text-sm font-extrabold text-[var(--background)]">DT</div>
          <div>
            <p className="text-sm font-semibold tracking-[-0.025em]">DigiTathya</p>
            <p className="text-[11px] text-[var(--muted-foreground)]">Track & Trace for CropShield</p>
          </div>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <span className="dt-mono rounded-full bg-[var(--secondary)] px-3 py-1">11 Jun 2026, 19:06 IST</span>
          <button className="dt-button border border-[var(--border)] bg-[var(--card)]">Alerts 9</button>
          <button className="dt-button bg-[var(--foreground)] text-[var(--background)]">Brand Admin</button>
        </div>
      </header>

      <div className="border-b border-[color-mix(in_srgb,var(--destructive)_35%,var(--border))] bg-[color-mix(in_srgb,var(--destructive)_10%,var(--card))] px-4 py-3 text-[var(--destructive)] lg:px-6">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-2 text-sm font-semibold md:flex-row md:items-center md:justify-between">
          <span>Active Recall RCL-260611-02 / Batch NG500-2026-04-A / Labeling Error / Day 3 / 72% acknowledged / 41% returned</span>
          <a className="underline underline-offset-4" href="#recalls">View Recall</a>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1600px] gap-6 px-4 py-6 lg:grid-cols-[240px_1fr] lg:px-6">
        <aside className="hidden lg:block">
          <div className="dt-card sticky top-20 p-3">
            <div className="mb-4 rounded-xl bg-[var(--secondary)] p-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">Role</p>
              <p className="mt-1 font-semibold">Brand / Manufacturer Admin</p>
            </div>
            <nav className="space-y-1">
              {navItems.map((item, index) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replaceAll(" ", "-").replaceAll("&", "and")}`}
                  className={`block rounded-xl px-3 py-2 text-sm font-semibold transition hover:bg-[var(--foreground)] hover:text-[var(--background)] ${index === 0 ? "bg-[var(--foreground)] text-[var(--background)]" : ""}`}
                >
                  {item}
                </a>
              ))}
            </nav>
            <div className="mt-5 rounded-xl border border-[var(--border)] p-3">
              <p className="text-xs text-[var(--muted-foreground)]">Co-brand</p>
              <p className="mt-1 font-semibold">EF Polymer</p>
            </div>
          </div>
        </aside>

        <div className="space-y-8">
          <section id="dashboard" className="dt-fade-in">
            <div className="mb-6 grid gap-5 xl:grid-cols-[1.45fr_0.8fr]">
              <div className="dt-card overflow-hidden p-6">
                <div className="max-w-3xl">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">MVP 1.0 Prototype</p>
                  <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] md:text-6xl">QR lifecycle intelligence for Indian agrochemical supply chains.</h1>
                  <p className="mt-4 max-w-2xl text-base text-[var(--muted-foreground)]">
                    Two applications share one monochrome design system: a full manufacturer dashboard for CropShield and a B2B mobile app for manufacturers, distributors, dealers, retailers, and operators.
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-2">
                  <ModulePill>Mock data only</ModulePill>
                  <ModulePill>Email OTP auth</ModulePill>
                  <ModulePill>All dates in IST</ModulePill>
                  <ModulePill>No real backend</ModulePill>
                </div>
              </div>
              <Card title="First-run onboarding" eyebrow="Auth & Setup" action="Finish setup">
                <div className="space-y-3">
                  {["Brand profile + logo <=500KB", "Hierarchy template L1-L4", "Default thresholds: 70%, 70%, 4h", "Review and finish"].map((step, index) => (
                    <div key={step} className="flex gap-3 rounded-xl border border-[var(--border)] p-3">
                      <span className="dt-mono flex h-7 w-7 items-center justify-center rounded-full bg-[var(--foreground)] text-[var(--background)]">{index + 1}</span>
                      <div>
                        <p className="font-semibold">{step}</p>
                        {index === 1 ? <p className="text-xs text-[var(--muted-foreground)]">Locked after first QR generation</p> : null}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {kpis.map((kpi) => (
                <div key={kpi.label} className="dt-card cursor-pointer p-5 transition hover:bg-[var(--foreground)] hover:text-[var(--background)]">
                  <p className="text-xs font-semibold text-[var(--muted-foreground)]">{kpi.label}</p>
                  <p className="dt-mono mt-3 text-3xl font-semibold">{kpi.value}</p>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span>{kpi.caption}</span>
                    <span className="font-bold">{kpi.delta}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
            <Card title="Requires Attention" eyebrow="Deep links">
              <div className="space-y-3">
                {attention.map((item) => (
                  <a key={item.label} href="#alerts" className="flex items-center justify-between rounded-xl border border-[var(--border)] p-3 transition hover:bg-[var(--accent)]">
                    <span className="font-medium">{item.label}</span>
                    <StatusChip tone={item.tone}>{item.value}</StatusChip>
                  </a>
                ))}
              </div>
            </Card>
            <Card title="Scan activity over time" eyebrow="Charts">
              <MiniLineChart />
            </Card>
          </section>

          <section className="grid gap-5 xl:grid-cols-3">
            <Card title="Checkpoint compliance" eyebrow="Current month">
              <BarChart />
            </Card>
            <Card title="Expiry exposure" eyebrow="Next 12 months">
              <div className="space-y-3">
                {[
                  ["0-30 days", 14, "destructive" as Tone],
                  ["31-90 days", 31, "warning" as Tone],
                  ["91-180 days", 42, "muted" as Tone],
                  ["181-365 days", 13, "success" as Tone],
                ].map(([label, value, tone]) => (
                  <div key={label as string}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span>{label}</span>
                      <span className="dt-mono">{value}%</span>
                    </div>
                    <Progress value={value as number} />
                    <div className="mt-1"><StatusChip tone={tone as Tone}>{label as string}</StatusChip></div>
                  </div>
                ))}
              </div>
            </Card>
            <Card title="Recent activity" eyebrow="Latest events">
              <div className="space-y-4">
                {["Factory dispatch scanned by Meera Pawar at Pune", "Return initiated by Vidarbha Agro Dealer", "QR DT-948202 flagged for impossible travel"].map((event, index) => (
                  <div key={event} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[var(--foreground)]" />
                    <div>
                      <p className="text-sm font-medium">{event}</p>
                      <p className="dt-mono text-[var(--muted-foreground)]">{index + 17}:4{index} IST</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          <section id="products">
            <SectionHeader eyebrow="Application 1" title="Web dashboard screens" copy="The dashboard is organized as production screens with static data, realistic entities, state chips, drawers, modals, and wizard previews represented inline." />
            <ModuleGrid />
          </section>

          <section id="qr-management" className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
            <Card title="Activation Approvals Queue" eyebrow="Critical screen" action="Review selected">
              <div className="overflow-x-auto">
                <table className="dt-table min-w-[760px]">
                  <thead>
                    <tr>
                      <th>Requester</th>
                      <th>SKU / Batch</th>
                      <th>Levels</th>
                      <th>Qty</th>
                      <th>Routing</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvals.map((approval) => (
                      <tr key={`${approval.sku}-${approval.qty}`}>
                        <td className="font-medium">{approval.requester}</td>
                        <td>
                          <p className="font-semibold">{approval.sku}</p>
                          <p className="dt-mono text-[var(--muted-foreground)]">{approval.batch}</p>
                        </td>
                        <td>{approval.levels}</td>
                        <td className="dt-mono">{approval.qty}</td>
                        <td><StatusChip tone={approval.route === "L1" ? "info" : "warning"}>{approval.route}</StatusChip></td>
                        <td><StatusChip>{approval.status}</StatusChip></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {["Requested", "L1 approval", "L2 approval / Active"].map((step, index) => (
                  <div key={step} className="rounded-xl border border-[var(--border)] p-3">
                    <p className="dt-mono">0{index + 1}</p>
                    <p className="mt-1 font-semibold">{step}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">Reason required on rejection</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Generate QRs" eyebrow="Wizard state" action="Confirm">
              <div className="space-y-3 text-sm">
                {[
                  ["SKU", "NeemGuard Plus 500ml (active)"],
                  ["Batch", "NG500-2026-04-A"],
                  ["Levels", "Unit + Carton"],
                  ["Quantity", "10,000 units"],
                  ["Expiry", "18 Apr 2027"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between rounded-xl bg-[var(--secondary)] px-3 py-2">
                    <span className="text-[var(--muted-foreground)]">{label}</span>
                    <span className="font-semibold">{value}</span>
                  </div>
                ))}
                <div className="rounded-xl border border-[var(--border-strong)] p-4">
                  <p className="font-semibold">Parent-child preview</p>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">10,000 units to 417 cartons, 24/carton; last carton has 16 units. Max request limit: 50,000.</p>
                </div>
              </div>
            </Card>
          </section>

          <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
            <Card title="Catalog and SKU Detail" eyebrow="Product hierarchy" action="+ Create SKU">
              <div className="grid gap-4 md:grid-cols-[0.85fr_1.15fr]">
                <div className="rounded-xl border border-[var(--border)] p-3">
                  {["Agrochemicals", "Bio Pesticides", "NeemGuard", "Plus", "NGP-500"].map((node, index) => (
                    <div key={node} className="border-l border-[var(--border)] py-2 pl-3" style={{ marginLeft: `${index * 8}px` }}>
                      <span className={index === 4 ? "font-bold" : "text-[var(--muted-foreground)]"}>{node}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  {products.map((product) => (
                    <div key={product.sku} className="rounded-xl border border-[var(--border)] p-3">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{product.name}</p>
                        <span className="dt-mono">{product.sku}</span>
                      </div>
                      <p className="mt-1 text-xs text-[var(--muted-foreground)]">{product.batch} / Expiry {product.expiry} / {product.ratio} / {product.qrs} QRs</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card title="Bulk Import Dry Run" eyebrow="CSV wizard">
              <div className="grid gap-3 md:grid-cols-3">
                {["Download template", "Upload + validate", "Confirm atomic creation"].map((step, index) => (
                  <div key={step} className="rounded-xl bg-[var(--secondary)] p-4">
                    <p className="dt-mono">Step {index + 1}</p>
                    <p className="mt-2 font-semibold">{step}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl border border-[var(--border)] p-3">
                <div className="mb-2 flex gap-2">
                  <StatusChip tone="destructive">12 Errors</StatusChip>
                  <StatusChip tone="warning">7 Warnings</StatusChip>
                  <StatusChip tone="success">231 Valid</StatusChip>
                </div>
                <p className="dt-mono text-[var(--muted-foreground)]">Row 18 / GTIN / Invalid checksum / Full error CSV available</p>
              </div>
            </Card>
          </section>

          <section id="track-and-trace" className="grid gap-5 xl:grid-cols-[1fr_1fr]">
            <Card title="Passport Search" eyebrow="Track & Trace" action="Export detailed CSV">
              <div className="mb-4 grid gap-2 md:grid-cols-4">
                {["SKU", "Batch", "Serial / UUID", "Checkpoint"].map((filter) => (
                  <div key={filter} className="dt-input text-[var(--muted-foreground)]">{filter}</div>
                ))}
              </div>
              <div className="overflow-x-auto">
                <table className="dt-table min-w-[680px]">
                  <thead>
                    <tr><th>Serial</th><th>UUID</th><th>Status</th><th>Current holder</th><th>Last scan</th></tr>
                  </thead>
                  <tbody>
                    {passports.map((passport) => (
                      <tr key={passport.serial}>
                        <td className="dt-mono">{passport.serial}</td>
                        <td className="dt-mono">{passport.uuid}</td>
                        <td><StatusChip>{passport.status}</StatusChip></td>
                        <td>{passport.holder}</td>
                        <td className="dt-mono">{passport.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card title="Passport Detail Drawer" eyebrow="DT-948202" action="Freeze QR">
              <div className="rounded-xl border border-[var(--border)] p-4">
                <p className="dt-mono">UUID 3d21-77c9-0a44 / Unit / Parent carton C-0001 / 24 children</p>
                <p className="mt-2 font-semibold">NeemGuard Plus 500ml / Batch NG500-2026-04-A</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <StatusChip>Frozen</StatusChip>
                  <StatusChip tone="warning">Approaching Expiry</StatusChip>
                </div>
              </div>
              <div className="mt-4 space-y-4">
                {[
                  ["Dispatch", "Meera Pawar / Field Operator / Pune factory", "11 Jun 2026, 09:12 IST", "via parent carton C-0001"],
                  ["Verify", "MahaAgro Distributors / Nagpur", "11 Jun 2026, 14:28 IST", "low GPS accuracy"],
                  ["Tamper", "Conflicting scan: Delhi -> Mumbai in 8 min", "11 Jun 2026, 16:08 IST", "flagged as error"],
                ].map(([action, actor, time, note], index) => (
                  <div key={`${action}-${time}`} className="flex gap-3">
                    <span className={`mt-1 h-3 w-3 rounded-full ${index === 2 ? "animate-[pulse-red_2s_cubic-bezier(0.4,0,0.6,1)_infinite] bg-[var(--destructive)]" : "bg-[var(--foreground)]"}`} />
                    <div>
                      <p className="font-semibold">{action}</p>
                      <p className="text-sm text-[var(--muted-foreground)]">{actor}</p>
                      <p className="dt-mono text-[var(--muted-foreground)]">{time} / {note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          <section id="dispatch" className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
            <Card title="Dispatch List" eyebrow="Orders and reconciliation" action="+ Create Dispatch">
              <div className="overflow-x-auto">
                <table className="dt-table min-w-[700px]">
                  <thead><tr><th>Slip</th><th>Partner</th><th>SKUs / Qty</th><th>Status</th><th>Variance</th></tr></thead>
                  <tbody>
                    {dispatches.map((dispatch) => (
                      <tr key={dispatch.slip}>
                        <td className="dt-mono">{dispatch.slip}</td>
                        <td>{dispatch.partner}</td>
                        <td>{dispatch.sku}</td>
                        <td><StatusChip>{dispatch.status}</StatusChip></td>
                        <td>{dispatch.variance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
            <Card title="Dispatch Detail Drawer" eyebrow="DS-2606100019">
              <div className="space-y-3">
                <div className="rounded-xl bg-[var(--secondary)] p-4">
                  <p className="font-semibold">Manifest</p>
                  <p className="text-sm text-[var(--muted-foreground)]">SMB-1L / 88 cartons / Serials DT-771200 to DT-773311 / Consignment QR aggregates carton QRs.</p>
                </div>
                <div className="rounded-xl border border-[color-mix(in_srgb,var(--destructive)_35%,var(--border))] p-4">
                  <StatusChip>DISPUTED</StatusChip>
                  <p className="mt-2 font-semibold">Expected 2,112 QRs vs 2,098 receive-scanned QRs</p>
                  <p className="text-sm text-[var(--muted-foreground)]">Partner confirmation by Nitin Patil in Akola. Route deviation flagged because expected route was Pune to Nagpur to Akola.</p>
                </div>
              </div>
            </Card>
          </section>

          <section id="recalls" className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
            <Card title="Create Recall Wizard" eyebrow="Critical flow">
              <div className="space-y-3">
                {[
                  "Reason: Labeling Error / Severity: Critical / Scope: By Batch",
                  "Distribution Summary: Manufacturer 8,400 / Distributors 18,200 / Dealers 6,710 / Retailers 1,260",
                  "Destructive double confirmation: Are you absolutely sure?",
                ].map((step) => (
                  <div key={step} className="rounded-xl border border-[var(--border)] p-3 font-medium">{step}</div>
                ))}
              </div>
            </Card>
            <Card title="Recall Tracker" eyebrow="RCL-260611-02" action="Close recall">
              <div className="grid gap-4 md:grid-cols-[180px_1fr]">
                <div className="flex aspect-square items-center justify-center rounded-full border-[18px] border-[var(--foreground)] bg-[var(--secondary)] text-center">
                  <div>
                    <p className="dt-mono text-3xl">41%</p>
                    <p className="text-xs text-[var(--muted-foreground)]">Returned</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {recallPartners.map((partner) => (
                    <div key={partner.name} className="rounded-xl border border-[var(--border)] p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold">{partner.name}</p>
                          <p className="text-xs text-[var(--muted-foreground)]">{partner.held.toLocaleString("en-IN")} units held / {partner.overdue} overdue</p>
                        </div>
                        <StatusChip tone={partner.response === "Silent" ? "destructive" : "success"}>{partner.response}</StatusChip>
                      </div>
                      <div className="mt-3"><Progress value={partner.returned} /></div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </section>

          <section id="expiry" className="grid gap-5 xl:grid-cols-[1fr_1fr]">
            <Card title="Expiry Management" eyebrow="SKU and batch level" action="View in Track & Trace">
              <div className="mb-4 flex gap-2">
                <StatusChip tone="primary">All 38</StatusChip>
                <StatusChip tone="warning">Near Expiry 5</StatusChip>
                <StatusChip tone="destructive">Expired 2</StatusChip>
              </div>
              <div className="space-y-3">
                {products.map((product, index) => (
                  <div key={product.sku} className="rounded-xl border border-[var(--border)] p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{product.batch}</p>
                      <StatusChip tone={index === 0 ? "warning" : "success"}>{index === 0 ? "82 days left" : "Valid"}</StatusChip>
                    </div>
                    <p className="text-sm text-[var(--muted-foreground)]">{product.name} / Units remaining at Nagpur, Pune, Nashik</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 rounded-xl bg-[var(--secondary)] p-3 text-sm text-[var(--muted-foreground)]">Expired units remain scannable. Scanner sees a warning and the brand receives a Product Expired alert.</p>
            </Card>

            <Card title="Alerts & Notifications" eyebrow="MVP alert set">
              <div className="space-y-3">
                {[
                  ["Suspected Duplicate / Tamper", "Delhi and Mumbai scans 8 min apart", "destructive" as Tone],
                  ["Route Deviation", "DS-2606100019 left expected route", "destructive" as Tone],
                  ["Expiry Approaching", "NG500-2026-04-A crossed 70% shelf life", "warning" as Tone],
                  ["Low Scan Compliance", "Retail verify checkpoint below 70%", "warning" as Tone],
                  ["Recall Notice sent", "Partner notification delivered", "info" as Tone],
                ].map(([title, copy, tone]) => (
                  <div key={title as string} className="rounded-xl border border-[var(--border)] p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{title}</p>
                      <StatusChip tone={tone as Tone}>{tone as string}</StatusChip>
                    </div>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">{copy}</p>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          <section id="partners">
            <Card title="Partners" eyebrow="Network and KYC" action="+ Add Partner">
              <div className="mb-4 grid gap-3 md:grid-cols-4">
                {[
                  ["Total", "286"],
                  ["Active", "248"],
                  ["Pending approvals", "19"],
                  ["Avg compliance", "82%"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-[var(--secondary)] p-3">
                    <p className="text-xs text-[var(--muted-foreground)]">{label}</p>
                    <p className="dt-mono mt-1 text-2xl">{value}</p>
                  </div>
                ))}
              </div>
              <div className="overflow-x-auto">
                <table className="dt-table min-w-[820px]">
                  <thead><tr><th>Partner code</th><th>Name</th><th>Type</th><th>City</th><th>Compliance</th><th>Status</th></tr></thead>
                  <tbody>
                    {partners.map((partner) => (
                      <tr key={partner.code}>
                        <td className="dt-mono">{partner.code}</td>
                        <td className="font-medium">{partner.name}</td>
                        <td>{partner.type}</td>
                        <td>{partner.city}</td>
                        <td><div className="flex items-center gap-3"><div className="w-24"><Progress value={partner.compliance} /></div><span className="dt-mono">{partner.compliance}%</span></div></td>
                        <td><StatusChip>{partner.status}</StatusChip></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>

          <section id="analytics" className="grid gap-5 xl:grid-cols-[1fr_1fr]">
            <Card title="Analytics & Reports" eyebrow="Shared filter bar" action="Export PDF">
              <div className="mb-4 grid gap-2 md:grid-cols-3">
                {["SKU: All", "Geography: MH", "Date: Last 30 days", "Checkpoint: All", "Partner: All", "Batch: All"].map((filter) => (
                  <div key={filter} className="dt-input">{filter}</div>
                ))}
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {["Scan volume by checkpoint", "Partner compliance ranking", "Geography heatmap", "Returns by reason"].map((widget) => (
                  <div key={widget} className="rounded-xl border border-[var(--border)] p-4">
                    <p className="font-semibold">{widget}</p>
                    <div className="mt-3 flex h-20 items-end gap-2">
                      {[36, 58, 44, 78, 52].map((height, index) => (
                        <div key={`${widget}-${height}-${index}`} className="flex-1 rounded-t-md bg-[var(--chart-1)]" style={{ height: `${height}%`, opacity: 1 - index * 0.12 }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-[var(--muted-foreground)]">Partners never see their own compliance rate in the mobile app.</p>
            </Card>

            <Card title="Settings" eyebrow="Policy cards">
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  ["Expiry alert threshold", "70% shelf life consumed"],
                  ["Scan compliance threshold", "70%"],
                  ["Recall acknowledgment SLA", "4 hours"],
                  ["QR activation rules", "L1 approver, L2 >10,000"],
                  ["Cascading defaults", "Enabled for cartons"],
                  ["Partner scan-result fields", "SKU, batch, expiry, status"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-[var(--secondary)] p-4">
                    <p className="text-xs font-semibold text-[var(--muted-foreground)]">{label}</p>
                    <p className="mt-1 font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          <section id="settings" className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
            <Card title="Contract Manufacturer View" eyebrow="Role-switched demo">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--secondary)] p-4">
                <p className="font-semibold">Operating as Sunrise Formulations on behalf of CropShield.</p>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">Stripped sidebar: Dashboard, QR Generation, Generation History, Scan log. Assigned SKUs only.</p>
              </div>
              <div className="mt-4 space-y-3">
                {products.slice(0, 2).map((product, index) => (
                  <div key={product.sku} className="flex items-center justify-between rounded-xl border border-[var(--border)] p-3">
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="dt-mono text-[var(--muted-foreground)]">{product.sku}</p>
                    </div>
                    <div className="flex gap-2">
                      <StatusChip tone={index === 0 ? "success" : "muted"}>QR Gen {index === 0 ? "Y" : "N"}</StatusChip>
                      <StatusChip tone="success">Factory Scan Y</StatusChip>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="User Management" eyebrow="Internal access" action="Invite User">
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  ["Ananya Rao", "ananya@cropshield.in", "Admin", "Active"],
                  ["Dev Mehta", "dev@cropshield.in", "L1 Approver", "Active"],
                  ["Kavita Shah", "kavita@cropshield.in", "L2 Approver", "Invited"],
                  ["Meera Pawar", "meera@cropshield.in", "Field Operator", "Active"],
                ].map(([name, email, role, status]) => (
                  <div key={email} className="rounded-xl border border-[var(--border)] p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{name}</p>
                      <StatusChip>{status}</StatusChip>
                    </div>
                    <p className="text-sm text-[var(--muted-foreground)]">{email}</p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.08em]">{role}</p>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          <section id="mobile">
            <SectionHeader eyebrow="Application 2" title="B2B mobile app" copy="Partner and field-operator screens use the same monochrome tokens but optimize for scan-first workflows, role-restricted action menus, warnings, and partner notifications." />
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <MobileShell role="Distributor Admin" partner="MahaAgro Distributors" actions={mobileActions.distributor}>
                <div className="mt-4 rounded-2xl border border-[var(--border)] p-4">
                  <p className="font-semibold">Inbound dispatch</p>
                  <p className="dt-mono mt-1 text-[var(--muted-foreground)]">DS-2606110007</p>
                  <p className="mt-2 text-sm text-[var(--muted-foreground)]">Receive all carton QRs from CropShield Pune. Variance reconciliation appears after scan.</p>
                </div>
              </MobileShell>

              <MobileShell role="Retailer Admin" partner="Kisan Retail Point" actions={mobileActions.retailer}>
                <div className="mt-4 rounded-2xl border border-[color-mix(in_srgb,var(--destructive)_35%,var(--border))] p-4">
                  <StatusChip tone="destructive">Recall Notice</StatusChip>
                  <p className="mt-2 font-semibold">NG500-2026-04-A affected</p>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">Retailer can Receive, Return, Verify. Dispatch is intentionally hidden.</p>
                </div>
              </MobileShell>

              <MobileShell role="Manufacturer Field Operator" partner="CropShield Pune WH" actions={mobileActions.operator}>
                <div className="mt-4 rounded-2xl border border-[var(--border)] p-4">
                  <p className="font-semibold">Factory-exit scan</p>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">Actions limited to Dispatch + Verify. No config, no analytics, no partner management.</p>
                </div>
              </MobileShell>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
