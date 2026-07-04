import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  Trash2,
  Shield,
  ShieldOff,
  Ban,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Download,
  UserPlus,
  RefreshCcw,
  Eye,
  Mail,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* ── mock data ── */
const mockUsers = [
  {
    id: "USR-001",
    fullName: "Prince Kumar",
    email: "prince@example.com",
    username: "prince",
    role: "admin",
    status: "active",
    joined: "2026-01-12",
    sessions: 3,
    lastActive: "2 min ago",
  },
  {
    id: "USR-002",
    fullName: "Aarav Sharma",
    email: "aarav@example.com",
    username: "aarav",
    role: "user",
    status: "active",
    joined: "2026-01-15",
    sessions: 1,
    lastActive: "1 hr ago",
  },
  {
    id: "USR-003",
    fullName: "Priya Verma",
    email: "priya@example.com",
    username: "priya",
    role: "user",
    status: "active",
    joined: "2026-01-18",
    sessions: 2,
    lastActive: "3 hr ago",
  },
  {
    id: "USR-004",
    fullName: "Rohan Mehta",
    email: "rohan@example.com",
    username: "rohan",
    role: "user",
    status: "banned",
    joined: "2026-01-20",
    sessions: 0,
    lastActive: "5 days ago",
  },
  {
    id: "USR-005",
    fullName: "Sneha Kapoor",
    email: "sneha@example.com",
    username: "sneha",
    role: "user",
    status: "inactive",
    joined: "2026-02-01",
    sessions: 0,
    lastActive: "2 wks ago",
  },
  {
    id: "USR-006",
    fullName: "Vikram Singh",
    email: "vikram@example.com",
    username: "vikram",
    role: "mod",
    status: "active",
    joined: "2026-02-05",
    sessions: 1,
    lastActive: "Yesterday",
  },
  {
    id: "USR-007",
    fullName: "Ananya Joshi",
    email: "ananya@example.com",
    username: "ananya",
    role: "user",
    status: "active",
    joined: "2026-02-10",
    sessions: 2,
    lastActive: "4 hr ago",
  },
  {
    id: "USR-008",
    fullName: "Karan Patel",
    email: "karan@example.com",
    username: "karan",
    role: "user",
    status: "inactive",
    joined: "2026-02-15",
    sessions: 0,
    lastActive: "1 mo ago",
  },
  {
    id: "USR-009",
    fullName: "Divya Nair",
    email: "divya@example.com",
    username: "divya",
    role: "user",
    status: "active",
    joined: "2026-03-01",
    sessions: 1,
    lastActive: "6 hr ago",
  },
  {
    id: "USR-010",
    fullName: "Rahul Gupta",
    email: "rahul@example.com",
    username: "rahul",
    role: "user",
    status: "banned",
    joined: "2026-03-10",
    sessions: 0,
    lastActive: "3 wks ago",
  },
  {
    id: "USR-011",
    fullName: "Meera Iyer",
    email: "meera@example.com",
    username: "meera",
    role: "mod",
    status: "active",
    joined: "2026-03-15",
    sessions: 2,
    lastActive: "30 min ago",
  },
  {
    id: "USR-012",
    fullName: "Arjun Reddy",
    email: "arjun@example.com",
    username: "arjun",
    role: "user",
    status: "active",
    joined: "2026-04-01",
    sessions: 1,
    lastActive: "2 days ago",
  },
];

const PAGE_SIZE = 8;

const roleBadge = {
  admin: "bg-purple-500/15 text-purple-400 border border-purple-500/20",
  mod: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  user: "bg-zinc-800 text-zinc-400 border border-zinc-700",
};

const statusBadge = {
  active: "bg-emerald-500/15 text-emerald-400",
  inactive: "bg-zinc-800 text-zinc-500",
  banned: "bg-red-500/15 text-red-400",
};

const statusDot = {
  active: "bg-emerald-500",
  inactive: "bg-zinc-600",
  banned: "bg-red-500",
};

/* ── Sortable column header ── */
const ColHeader = ({ label, field, sort, onSort, className = "" }) => {
  const active = sort.field === field;
  return (
    <th
      className={`px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500 cursor-pointer select-none hover:text-zinc-300 transition whitespace-nowrap ${className}`}
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        {active ? (
          sort.dir === "asc" ? (
            <ChevronUp size={12} className="text-emerald-400" />
          ) : (
            <ChevronDown size={12} className="text-emerald-400" />
          )
        ) : (
          <ChevronsUpDown size={12} className="opacity-30" />
        )}
      </div>
    </th>
  );
};

/* ── Row action menu ── */
const ActionMenu = ({ user, onAction, onClose }) => (
  <div className="absolute right-8 top-0 z-50 w-44 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden">
    <div className="px-3 py-2 border-b border-zinc-800">
      <p className="text-[11px] text-zinc-500 truncate">{user.email}</p>
    </div>
    {[
      { icon: Eye, label: "View profile", action: "view", color: "" },
      { icon: Mail, label: "Send email", action: "email", color: "" },
      { icon: Shield, label: "Make admin", action: "admin", color: "" },
      { icon: ShieldOff, label: "Remove role", action: "demote", color: "" },
      {
        icon: user.status === "banned" ? CheckCircle2 : Ban,
        label: user.status === "banned" ? "Unban user" : "Ban user",
        action: "ban",
        color:
          user.status === "banned" ? "text-emerald-400" : "text-yellow-400",
      },
      {
        icon: Trash2,
        label: "Delete user",
        action: "delete",
        color: "text-red-400",
      },
    ].map((item) => {
      const Icon = item.icon;
      return (
        <button
          key={item.action}
          onClick={() => {
            onAction(user, item.action);
            onClose();
          }}
          className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-zinc-800 transition ${item.color || "text-zinc-300"}`}
        >
          <Icon size={13} />
          {item.label}
        </button>
      );
    })}
  </div>
);

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState({ field: "fullName", dir: "asc" });
  const [selected, setSelected] = useState(new Set());
  const [page, setPage] = useState(1);
  const [openMenu, setOpenMenu] = useState(null);
  const [detailUser, setDetailUser] = useState(null);

  /* ── filter + sort ── */
  const filtered = useMemo(() => {
    let list = [...users];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.fullName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q) ||
          u.id.toLowerCase().includes(q),
      );
    }
    if (roleFilter !== "all") list = list.filter((u) => u.role === roleFilter);
    if (statusFilter !== "all")
      list = list.filter((u) => u.status === statusFilter);
    list.sort((a, b) => {
      const av = a[sort.field] ?? "";
      const bv = b[sort.field] ?? "";
      return sort.dir === "asc"
        ? av.toString().localeCompare(bv.toString())
        : bv.toString().localeCompare(av.toString());
    });
    return list;
  }, [users, search, roleFilter, statusFilter, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (field) => {
    setSort((s) => ({
      field,
      dir: s.field === field && s.dir === "asc" ? "desc" : "asc",
    }));
    setPage(1);
  };

  /* ── selection ── */
  const allOnPage = paginated.every((u) => selected.has(u.id));
  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      allOnPage
        ? paginated.forEach((u) => next.delete(u.id))
        : paginated.forEach((u) => next.add(u.id));
      return next;
    });
  };
  const toggleOne = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  /* ── row actions ── */
  const handleAction = (user, action) => {
    if (action === "delete") {
      setUsers((p) => p.filter((u) => u.id !== user.id));
      setSelected((p) => {
        const n = new Set(p);
        n.delete(user.id);
        return n;
      });
    } else if (action === "ban") {
      setUsers((p) =>
        p.map((u) =>
          u.id === user.id
            ? { ...u, status: u.status === "banned" ? "active" : "banned" }
            : u,
        ),
      );
    } else if (action === "admin") {
      setUsers((p) =>
        p.map((u) => (u.id === user.id ? { ...u, role: "admin" } : u)),
      );
    } else if (action === "demote") {
      setUsers((p) =>
        p.map((u) => (u.id === user.id ? { ...u, role: "user" } : u)),
      );
    } else if (action === "view") {
      setDetailUser(user);
    }
  };

  /* ── bulk delete ── */
  const bulkDelete = () => {
    setUsers((p) => p.filter((u) => !selected.has(u.id)));
    setSelected(new Set());
  };

  /* ── export CSV ── */
  const exportCSV = () => {
    const cols = [
      "id",
      "fullName",
      "username",
      "email",
      "role",
      "status",
      "joined",
      "sessions",
      "lastActive",
    ];
    const rows = filtered.map((u) => cols.map((c) => u[c]).join(","));
    const csv = [cols.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ── stats ── */
  const stats = [
    { label: "Total", value: users.length, color: "text-white" },
    {
      label: "Active",
      value: users.filter((u) => u.status === "active").length,
      color: "text-emerald-400",
    },
    {
      label: "Inactive",
      value: users.filter((u) => u.status === "inactive").length,
      color: "text-zinc-400",
    },
    {
      label: "Banned",
      value: users.filter((u) => u.status === "banned").length,
      color: "text-red-400",
    },
  ];

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Users</h1>
          <p className="text-zinc-500 text-xs sm:text-sm mt-0.5">
            {filtered.length} of {users.length} users
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl border border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white transition"
          >
            <Download size={13} /> Export CSV
          </button>
          <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 transition">
            <UserPlus size={13} /> Add User
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-2">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-center"
          >
            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-zinc-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name, email, username, ID..."
            className="w-full h-9 bg-zinc-950 border border-zinc-800 rounded-xl pl-8.5 pr-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/60 transition pl-8"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Role filter */}
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          className="h-9 bg-zinc-950 border border-zinc-800 rounded-xl px-3 text-sm text-zinc-300 focus:outline-none focus:border-emerald-500/60 transition"
        >
          <option value="all">All roles</option>
          <option value="admin">Admin</option>
          <option value="mod">Mod</option>
          <option value="user">User</option>
        </select>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="h-9 bg-zinc-950 border border-zinc-800 rounded-xl px-3 text-sm text-zinc-300 focus:outline-none focus:border-emerald-500/60 transition"
        >
          <option value="all">All status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="banned">Banned</option>
        </select>

        <button
          onClick={() => {
            setSearch("");
            setRoleFilter("all");
            setStatusFilter("all");
            setPage(1);
          }}
          className="h-9 px-3 rounded-xl border border-zinc-800 text-zinc-500 hover:bg-zinc-900 hover:text-white transition flex items-center gap-1.5 text-sm"
        >
          <RefreshCcw size={13} /> Reset
        </button>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2.5">
          <span className="text-sm text-emerald-400 font-medium">
            {selected.size} selected
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={bulkDelete}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 border border-red-500/20 transition"
            >
              <Trash2 size={12} /> Delete selected
            </button>
            <button
              onClick={() => setSelected(new Set())}
              className="text-xs text-zinc-500 hover:text-white transition"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div
        className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden"
        onClick={() => setOpenMenu(null)}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/60">
                <th className="px-3 py-2.5 w-10">
                  <input
                    type="checkbox"
                    checked={allOnPage && paginated.length > 0}
                    onChange={toggleAll}
                    className="accent-emerald-500 w-3.5 h-3.5 cursor-pointer"
                  />
                </th>
                <ColHeader
                  label="User"
                  field="fullName"
                  sort={sort}
                  onSort={handleSort}
                />
                <ColHeader
                  label="Role"
                  field="role"
                  sort={sort}
                  onSort={handleSort}
                  className="hidden sm:table-cell"
                />
                <ColHeader
                  label="Status"
                  field="status"
                  sort={sort}
                  onSort={handleSort}
                />
                <ColHeader
                  label="Sessions"
                  field="sessions"
                  sort={sort}
                  onSort={handleSort}
                  className="hidden md:table-cell"
                />
                <ColHeader
                  label="Joined"
                  field="joined"
                  sort={sort}
                  onSort={handleSort}
                  className="hidden lg:table-cell"
                />
                <ColHeader
                  label="Last active"
                  field="lastActive"
                  sort={sort}
                  onSort={handleSort}
                  className="hidden lg:table-cell"
                />
                <th className="px-3 py-2.5 w-10" />
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-800/60">
              {paginated.map((user) => {
                const initials = user.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("");
                const isSelected = selected.has(user.id);

                return (
                  <tr
                    key={user.id}
                    className={`group transition-colors ${
                      isSelected ? "bg-emerald-500/5" : "hover:bg-zinc-900/40"
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="px-3 py-3 w-10">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleOne(user.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="accent-emerald-500 w-3.5 h-3.5 cursor-pointer"
                      />
                    </td>

                    {/* User */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-emerald-500/15 flex items-center justify-center text-[11px] font-semibold text-emerald-400 shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white leading-snug truncate">
                            {user.fullName}
                          </p>
                          <p className="text-[11px] text-zinc-500 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-3 py-3 hidden sm:table-cell">
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${roleBadge[user.role]}`}
                      >
                        {user.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot[user.status]}`}
                        />
                        <span
                          className={`text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${statusBadge[user.status]}`}
                        >
                          {user.status}
                        </span>
                      </div>
                    </td>

                    {/* Sessions */}
                    <td className="px-3 py-3 hidden md:table-cell">
                      <span className="text-sm text-zinc-400">
                        {user.sessions}
                      </span>
                    </td>

                    {/* Joined */}
                    <td className="px-3 py-3 hidden lg:table-cell">
                      <span className="text-xs text-zinc-500">
                        {new Date(user.joined).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </td>

                    {/* Last active */}
                    <td className="px-3 py-3 hidden lg:table-cell">
                      <span className="text-xs text-zinc-500">
                        {user.lastActive}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-3 w-10 relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenu(openMenu === user.id ? null : user.id);
                        }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-600 hover:bg-zinc-800 hover:text-zinc-300 transition opacity-0 group-hover:opacity-100"
                      >
                        <MoreHorizontal size={15} />
                      </button>
                      {openMenu === user.id && (
                        <ActionMenu
                          user={user}
                          onAction={handleAction}
                          onClose={() => setOpenMenu(null)}
                        />
                      )}
                    </td>
                  </tr>
                );
              })}

              {paginated.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="py-14 text-center text-zinc-600 text-sm"
                  >
                    No users match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800">
          <p className="text-xs text-zinc-500">
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–
            {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-500 hover:bg-zinc-800 hover:text-white transition disabled:opacity-30"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-7 h-7 rounded-lg text-xs font-medium transition ${
                  p === page
                    ? "bg-emerald-500 text-black"
                    : "text-zinc-500 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-500 hover:bg-zinc-800 hover:text-white transition disabled:opacity-30"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* User detail modal */}
      {detailUser && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4"
          onClick={() => setDetailUser(null)}
        >
          <div
            className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/15 flex items-center justify-center text-sm font-semibold text-emerald-400">
                  {detailUser.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {detailUser.fullName}
                  </p>
                  <p className="text-xs text-zinc-500">
                    @{detailUser.username}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDetailUser(null)}
                className="text-zinc-500 hover:text-white transition"
              >
                <X size={16} />
              </button>
            </div>
            <div className="space-y-2 text-sm">
              {[
                ["ID", detailUser.id],
                ["Email", detailUser.email],
                ["Role", detailUser.role],
                ["Status", detailUser.status],
                ["Sessions", detailUser.sessions],
                ["Joined", detailUser.joined],
                ["Last active", detailUser.lastActive],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between items-center py-1.5 border-b border-zinc-800 last:border-0"
                >
                  <span className="text-zinc-500 text-xs">{k}</span>
                  <span className="text-white text-xs font-medium">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
