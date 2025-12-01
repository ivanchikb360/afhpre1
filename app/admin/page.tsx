"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
// import { useRouter } from "next/navigation"; // Commented out - not needed without auth
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
  // const [user, setUser] = useState<any>(null); // Commented out - not needed without auth
  // const router = useRouter(); // Commented out - not needed without auth
  const supabase = createClient();

  const fetchLeads = useCallback(async () => {
    try {
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
      setLeads([]); // Set empty array on error - allows you to work on UI without Supabase
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Auth check commented out - uncomment when Supabase is configured
  /*
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
  */

  useEffect(() => {
    // checkAuth(); // Commented out
    fetchLeads(); // Directly fetch leads without auth check
  }, [fetchLeads]);

  // Logout handler commented out - uncomment when Supabase is configured
  /*
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };
  */

  const formatDate = (dateString: string) => {
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

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Prelander Leads Dashboard</h1>
          <p className={styles.subtitle}>
            {leads.length} total submission{leads.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className={styles.headerActions}>
          {/* Auth UI commented out - uncomment when Supabase is configured */}
          {/* <span className={styles.userEmail}>{user?.email}</span>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button> */}
        </div>
      </header>

      <div className={styles.tableContainer}>
        {leads.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No leads yet. Submissions will appear here.</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Submitted</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Searching For</th>
                <th>Care Level</th>
                <th>Budget</th>
                <th>Timeline</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className={styles.dateCell}>
                    {formatDate(lead.submitted_at)}
                  </td>
                  <td className={styles.nameCell}>{lead.name}</td>
                  <td>
                    <a
                      href={`mailto:${lead.email}`}
                      className={styles.emailLink}
                    >
                      {lead.email}
                    </a>
                  </td>
                  <td>
                    {lead.phone ? (
                      <a
                        href={`tel:${lead.phone}`}
                        className={styles.phoneLink}
                      >
                        {lead.phone}
                      </a>
                    ) : (
                      <span className={styles.noPhone}>—</span>
                    )}
                  </td>
                  <td>{formatValue(lead.searching_for)}</td>
                  <td>{formatValue(lead.care_level)}</td>
                  <td>{formatValue(lead.price_range)}</td>
                  <td>{formatValue(lead.timeline)}</td>
                  <td>
                    <button
                      onClick={() => {
                        const details = `Mobility: ${formatValue(
                          lead.mobility_level
                        )}\nMemory Care: ${formatValue(
                          lead.memory_care
                        )}\nMedical Needs: ${formatValue(lead.medical_needs)}`;
                        alert(details);
                      }}
                      className={styles.detailsButton}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
