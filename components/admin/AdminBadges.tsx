import { AdminRole, AdminStatus } from "@/lib/admin-users";

const STATUS_STYLES: Record<AdminStatus, string> = {
  active: "bg-forest/10 text-forest",
  pending_invitation: "bg-gold/15 text-gold-dark",
  inactive: "bg-charcoal/10 text-charcoal/60",
  suspended: "bg-red-50 text-red-600",
  resigned: "bg-charcoal/10 text-charcoal/50",
};

const STATUS_LABELS: Record<AdminStatus, string> = {
  active: "Active",
  pending_invitation: "Pending Invitation",
  inactive: "Inactive",
  suspended: "Suspended",
  resigned: "Resigned",
};

export function AdminStatusBadge({ status }: { status: AdminStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

const ROLE_LABELS: Record<AdminRole, string> = {
  admin: "Admin",
  super_admin: "Super Admin",
};

const ROLE_STYLES: Record<AdminRole, string> = {
  admin: "bg-blue-50 text-blue-700",
  super_admin: "bg-gold/15 text-gold-dark",
};

export function RoleBadge({ role }: { role: AdminRole }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${ROLE_STYLES[role]}`}>
      {ROLE_LABELS[role]}
    </span>
  );
}