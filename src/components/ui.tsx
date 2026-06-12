import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

type Tone = "primary" | "muted" | "success" | "warning" | "destructive" | "info";

const toneClass: Record<Tone, string> = {
  primary: "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]",
  muted: "border-[var(--border)] bg-[var(--muted)] text-[var(--muted-foreground)]",
  success: "border-transparent bg-[color-mix(in_srgb,var(--success)_14%,transparent)] text-[var(--success)]",
  warning: "border-transparent bg-[color-mix(in_srgb,var(--warning)_16%,transparent)] text-[var(--warning)]",
  destructive: "border-transparent bg-[color-mix(in_srgb,var(--destructive)_13%,transparent)] text-[var(--destructive)]",
  info: "border-transparent bg-[color-mix(in_srgb,var(--info)_12%,transparent)] text-[var(--info)]",
};

export function inferTone(value: string): Tone {
  if (["Active", "Approved", "APPROVED", "DELIVERED", "Success", "Verified", "In Circulation", "Approved - Awaiting Activation", "Done"].includes(value)) return "success";
  if (["Critical", "Frozen", "Recalled", "Voided", "DISPUTED", "REJECTED", "Rejected", "Expired", "Not Recognized", "Suspended"].includes(value)) return "destructive";
  if (["Warning", "Pending", "REQUESTED", "PENDING", "IN_TRANSIT", "Pending Activation", "Not Activated", "DRAFT", "L2 Pending", "Invited", "INVITED", "Waiting"].includes(value)) return "warning";
  if (["Info", "Standard"].includes(value)) return "info";
  return "muted";
}

export function StatusChip({ children, tone }: { children: ReactNode; tone?: Tone }) {
  const resolved = tone ?? (typeof children === "string" ? inferTone(children) : "muted");
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.05em] ${toneClass[resolved]}`}>
      {children}
    </span>
  );
}

export function KpiCard({ label, value, caption, onClick }: { label: string; value: string; caption: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="card w-full cursor-pointer p-5 text-left transition hover:bg-[var(--foreground)] hover:text-[var(--background)]">
      <p className="text-xs font-semibold text-[var(--muted-foreground)]">{label}</p>
      <p className="mono mt-3 text-3xl font-semibold">{value}</p>
      <p className="mt-3 text-xs">{caption}</p>
    </button>
  );
}

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        {eyebrow ? <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">{eyebrow}</p> : null}
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-sm text-[var(--muted-foreground)]">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function SectionCard({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="card fade-in p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-[-0.025em]">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export type Column<T> = {
  key: keyof T | string;
  header: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
};

export function DataTable<T extends Record<string, unknown>>({
  rows,
  columns,
  searchPlaceholder = "Search",
  pageSize = 6,
  onRowClick,
}: {
  rows: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  pageSize?: number;
  onRowClick?: (row: T) => void;
}) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const filtered = useMemo(() => {
    const normalized = query.toLowerCase();
    const list = rows.filter((row) => JSON.stringify(row).toLowerCase().includes(normalized));
    if (!sortKey) return list;
    return [...list].sort((a, b) => String(a[sortKey] ?? "").localeCompare(String(b[sortKey] ?? "")));
  }, [query, rows, sortKey]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <div>
      <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <input
          className="field md:max-w-sm"
          placeholder={searchPlaceholder}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
        />
        <p className="text-xs text-[var(--muted-foreground)]">
          Showing {pageRows.length} of {filtered.length} records
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)} className="px-3 py-2 text-left text-[11px] font-bold uppercase tracking-[0.07em] text-[var(--muted-foreground)]">
                  <button
                    onClick={() => column.sortable && setSortKey(String(column.key))}
                    className={column.sortable ? "cursor-pointer" : "cursor-default"}
                  >
                    {column.header}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row, rowIndex) => (
              <tr key={String(row.id ?? rowIndex)} onClick={() => onRowClick?.(row)} className={onRowClick ? "cursor-pointer hover:bg-[var(--secondary)]" : ""}>
                {columns.map((column) => (
                  <td key={String(column.key)} className="border-t border-[var(--border)] px-3 py-3 align-middle">
                    {column.render ? column.render(row) : String(row[column.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center justify-end gap-2">
        <button className="button" onClick={() => setPage((current) => Math.max(1, current - 1))}>Previous</button>
        <span className="mono px-2">Page {safePage} / {totalPages}</span>
        <button className="button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>Next</button>
      </div>
    </div>
  );
}

export function DetailDrawer({ open, title, children, onClose }: { open: boolean; title: string; children: ReactNode; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/20" onClick={onClose}>
      <aside
        className="absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto border-l border-[var(--border)] bg-[var(--card)] p-5"
        style={{ animation: "slide-in-right 0.25s ease-out both" }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-[-0.025em]">{title}</h2>
          <button className="button" onClick={onClose}>Close</button>
        </div>
        {children}
      </aside>
    </div>
  );
}

export function ConfirmModal({
  open,
  title,
  body,
  confirmLabel = "Confirm",
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  body: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/25 p-4">
      <div className="card max-w-md p-5">
        <h2 className="text-xl font-semibold tracking-[-0.025em]">{title}</h2>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">{body}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button className="button" onClick={onClose}>Cancel</button>
          <button className="button button-primary" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

export function Timeline({ events }: { events: Array<{ title: string; subtitle: string; time?: string; tone?: Tone }> }) {
  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <div key={`${event.title}-${index}`} className="flex gap-3">
          <span className={`mt-1 h-3 w-3 rounded-full ${event.tone === "destructive" ? "bg-[var(--destructive)]" : "bg-[var(--foreground)]"}`} />
          <div>
            <p className="font-semibold">{event.title}</p>
            <p className="text-sm text-[var(--muted-foreground)]">{event.subtitle}</p>
            {event.time ? <p className="mono mt-1 text-[var(--muted-foreground)]">{event.time}</p> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--secondary)] p-8 text-center">
      <h3 className="font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted-foreground)]">{body}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function StepWizard({
  steps,
  active,
  setActive,
  children,
}: {
  steps: string[];
  active: number;
  setActive: (step: number) => void;
  children: ReactNode;
}) {
  return (
    <div className="card p-5">
      <div className="mb-5 grid gap-2 md:grid-cols-4">
        {steps.map((step, index) => (
          <button
            key={step}
            className={`rounded-xl border px-3 py-2 text-left text-sm font-semibold ${index === active ? "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]" : "border-[var(--border)] bg-[var(--secondary)]"}`}
            onClick={() => setActive(index)}
          >
            <span className="mono mr-2">{index + 1}</span>
            {step}
          </button>
        ))}
      </div>
      {children}
      <div className="mt-5 flex justify-between">
        <button className="button" onClick={() => setActive(Math.max(0, active - 1))}>Back</button>
        <button className="button button-primary" onClick={() => setActive(Math.min(steps.length - 1, active + 1))}>
          {active === steps.length - 1 ? "Finish" : "Continue"}
        </button>
      </div>
    </div>
  );
}

type ToastContextValue = { notify: (message: string) => void };
const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Array<{ id: number; message: string }>>([]);
  const notify = (message: string) => {
    const id = Date.now();
    setToasts((current) => [...current, { id, message }]);
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 2600);
  };

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="fixed right-5 top-16 z-[70] space-y-2">
        {toasts.map((toast) => (
          <div key={toast.id} className="card bg-[var(--foreground)] px-4 py-3 text-sm font-semibold text-[var(--background)]">
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const value = useContext(ToastContext);
  if (!value) throw new Error("useToast must be used inside ToastProvider");
  return value;
}

export function Progress({ value }: { value: number }) {
  const color = value >= 90 ? "var(--success)" : value >= 70 ? "var(--warning)" : "var(--destructive)";
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-[var(--muted)]">
      <div className="h-full rounded-full" style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: color }} />
    </div>
  );
}

export function MockChart({ bars = [44, 78, 52, 66, 34] }: { bars?: number[] }) {
  return (
    <div>
      <div className="flex h-36 items-end gap-2 border-b border-l border-[var(--border)] px-3">
        {bars.map((height, index) => (
          <div key={`${height}-${index}`} className="flex-1 rounded-t-md bg-[var(--chart-1)]" style={{ height: `${height}%`, opacity: 1 - index * 0.1 }} />
        ))}
      </div>
      <p className="mt-2 text-xs text-[var(--muted-foreground)]">Source: connected mock dataset, IST date range.</p>
    </div>
  );
}
