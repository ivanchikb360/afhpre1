"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import styles from "./admin.module.css";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  searching_for: string;
  care_level: string;
  mobility_level: string;
  memory_care: string;
  medical_needs: string;
  price_range: string;
  timeline: string;
  source: string;
  submitted_at: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("submitted_at", { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error(
        "Error fetching leads (Supabase may not be configured):",
        error
      );
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const checkAuth = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/admin/login");
      return;
    }

    setUser(session.user);
    fetchLeads();
  }, [supabase, router, fetchLeads]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatValue = (value: string) => {
    return value
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const filteredLeads = useMemo(() => {
    if (!searchQuery) return leads;
    const query = searchQuery.toLowerCase();
    return leads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        (lead.phone && lead.phone.includes(query)) ||
        formatValue(lead.searching_for).toLowerCase().includes(query) ||
        formatValue(lead.price_range).toLowerCase().includes(query)
    );
  }, [leads, searchQuery]);

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thisWeek = new Date(today);
    thisWeek.setDate(today.getDate() - 7);

    const todayLeads = leads.filter(
      (lead) => new Date(lead.submitted_at) >= today
    ).length;
    const weekLeads = leads.filter(
      (lead) => new Date(lead.submitted_at) >= thisWeek
    ).length;

    return {
      total: leads.length,
      today: todayLeads,
      thisWeek: weekLeads,
    };
  }, [leads]);

  const exportToCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Searching For",
      "Care Level",
      "Mobility Level",
      "Memory Care",
      "Medical Needs",
      "Price Range",
      "Timeline",
      "Submitted At",
    ];

    const rows = leads.map((lead) => [
      lead.name,
      lead.email,
      lead.phone || "",
      formatValue(lead.searching_for),
      formatValue(lead.care_level),
      formatValue(lead.mobility_level),
      formatValue(lead.memory_care),
      formatValue(lead.medical_needs),
      formatValue(lead.price_range),
      formatValue(lead.timeline),
      formatFullDate(lead.submitted_at),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const openLeadDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedLead(null);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Prelander Leads Dashboard</h1>
          <p className={styles.subtitle}>
            Manage and track all lead submissions
          </p>
        </div>
        <div className={styles.headerActions}>
          <span className={styles.userEmail}>{user?.email}</span>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.total}</div>
          <div className={styles.statLabel}>Total Leads</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.thisWeek}</div>
          <div className={styles.statLabel}>This Week</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.today}</div>
          <div className={styles.statLabel}>Today</div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className={styles.actionsBar}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search by name, email, phone, or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.actionButtons}>
          <button
            onClick={fetchLeads}
            className={styles.refreshButton}
            title="Refresh leads"
          >
            ↻ Refresh
          </button>
          <button
            onClick={exportToCSV}
            className={styles.exportButton}
            disabled={leads.length === 0}
          >
            📥 Export CSV
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className={styles.tableContainer}>
        {filteredLeads.length === 0 ? (
          <div className={styles.emptyState}>
            {searchQuery ? (
              <>
                <p>No leads match your search.</p>
                <button
                  onClick={() => setSearchQuery("")}
                  className={styles.clearSearchButton}
                >
                  Clear search
                </button>
              </>
            ) : (
              <p>No leads yet. Submissions will appear here.</p>
            )}
          </div>
        ) : (
          <>
            {searchQuery && (
              <div className={styles.searchResults}>
                Showing {filteredLeads.length} of {leads.length} leads
              </div>
            )}
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Submitted</th>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Searching For</th>
                  <th>Budget</th>
                  <th>Timeline</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td className={styles.dateCell}>
                      <div className={styles.dateWrapper}>
                        <span className={styles.dateRelative}>
                          {formatDate(lead.submitted_at)}
                        </span>
                        <span className={styles.dateFull} title={formatFullDate(lead.submitted_at)}>
                          {formatFullDate(lead.submitted_at)}
                        </span>
                      </div>
                    </td>
                    <td className={styles.nameCell}>{lead.name}</td>
                    <td className={styles.contactCell}>
                      <div className={styles.contactInfo}>
                        <a
                          href={`mailto:${lead.email}`}
                          className={styles.emailLink}
                        >
                          {lead.email}
                        </a>
                        {lead.phone && (
                          <a
                            href={`tel:${lead.phone}`}
                            className={styles.phoneLink}
                          >
                            {lead.phone}
                          </a>
                        )}
                      </div>
                    </td>
                    <td>{formatValue(lead.searching_for)}</td>
                    <td>{formatValue(lead.price_range)}</td>
                    <td>{formatValue(lead.timeline)}</td>
                    <td>
                      <button
                        onClick={() => openLeadDetails(lead)}
                        className={styles.detailsButton}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* Lead Details Modal */}
      {showModal && selectedLead && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Lead Details</h2>
              <button
                onClick={closeModal}
                className={styles.modalClose}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.modalSection}>
                <h3>Contact Information</h3>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Name:</span>
                  <span className={styles.detailValue}>{selectedLead.name}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Email:</span>
                  <a
                    href={`mailto:${selectedLead.email}`}
                    className={styles.detailLink}
                  >
                    {selectedLead.email}
                  </a>
                </div>
                {selectedLead.phone && (
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Phone:</span>
                    <a
                      href={`tel:${selectedLead.phone}`}
                      className={styles.detailLink}
                    >
                      {selectedLead.phone}
                    </a>
                  </div>
                )}
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Submitted:</span>
                  <span className={styles.detailValue}>
                    {formatFullDate(selectedLead.submitted_at)}
                  </span>
                </div>
              </div>

              <div className={styles.modalSection}>
                <h3>Qualification Details</h3>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Searching For:</span>
                  <span className={styles.detailValue}>
                    {formatValue(selectedLead.searching_for)}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Care Level:</span>
                  <span className={styles.detailValue}>
                    {formatValue(selectedLead.care_level)}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Mobility Level:</span>
                  <span className={styles.detailValue}>
                    {formatValue(selectedLead.mobility_level)}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Memory Care:</span>
                  <span className={styles.detailValue}>
                    {formatValue(selectedLead.memory_care)}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Medical Needs:</span>
                  <span className={styles.detailValue}>
                    {formatValue(selectedLead.medical_needs)}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Budget:</span>
                  <span className={styles.detailValue}>
                    {formatValue(selectedLead.price_range)}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Timeline:</span>
                  <span className={styles.detailValue}>
                    {formatValue(selectedLead.timeline)}
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button onClick={closeModal} className={styles.modalButton}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
