import { useCallback, useEffect, useMemo, useState } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import AdminDemoPageShell from "../../components/Admin/AdminDemoPageShell";
import AdminBlogPagination from "../../components/Admin/AdminBlogPagination";
import ContactRequestSummary from "../../components/ContactRequest/ContactRequestSummary";
import ContactRequestToolbar from "../../components/ContactRequest/ContactRequestToolbar";
import ContactRequestKanban from "../../components/ContactRequest/ContactRequestKanban";
import ContactRequestTable from "../../components/ContactRequest/ContactRequestTable";
import ContactRequestFilterPanel, {
  EMPTY_LEAD_FILTERS,
} from "../../components/ContactRequest/ContactRequestFilterPanel";
import ContactRequestDrawer from "../../components/ContactRequest/ContactRequestDrawer";
import ContactRequestToast from "../../components/ContactRequest/ContactRequestToast";
import LeadDeleteModal from "../../components/ContactRequest/LeadDeleteModal";
import {
  getContactRequests,
  updateStoredContactRequestStage,
  deleteContactRequest,
  getDeletedLeadKeys,
  markLeadDeleted,
} from "../../utils/contactRequestStorage";
import {
  getContactRequestsFromApi,
  isContactRequestsApiConfigured,
  updateContactRequestStageOnApi,
} from "../../services/contactRequestApiService";
import { updateContactRequestStageApi } from "../../services/contactRequestStageService";
import {
  buildFollowUpScheduleToast,
  createFollowUpApi,
  fetchFollowUpsApi,
} from "../../services/contactRequestFollowUpService";
import { createNoteApi } from "../../services/contactRequestNoteService";
import { leadMatchesAssigneeFilter } from "../../components/ContactRequest/followUpUtils";
import "../../components/Admin/AdminLayout.scss";

const PAGE_SIZE = 10;

const buildStats = (requests) => ({
  total: requests.length,
  contacted: requests.filter((r) => r.stage === "Contacted").length,
  qualified: requests.filter((r) => r.stage === "Qualified").length,
  won: requests.filter((r) => r.stage === "Won").length,
  lost: requests.filter((r) => r.stage === "Lost").length,
  closed: requests.filter((r) => r.stage === "Closed").length,
});

const normalizeLead = (request) => ({
  ...request,
  stage: request.stage === "New" ? "Contacted" : request.stage || "Contacted",
  type:
    request.type ||
    (request.reason === "Contact Us" ? "Mail" : "Contact Request"),
});

const leadDedupeKey = (lead) =>
  `${String(lead.email || "").trim().toLowerCase()}|${String(lead.submittedAt || "").slice(0, 10)}|${String(lead.reason || lead.type || "").trim().toLowerCase()}`;

/** Real browser submissions (Schedule / Register / Contact / Demo) — not demo placeholders. */
const buildStoredLocalLeads = () =>
  getContactRequests().map((request) => ({
    ...normalizeLead(request),
    requestKey: `stored-${request.id}`,
    isStored: true,
    isApi: false,
  }));

const mergeApiAndStoredLeads = (apiLeads, storedLeads) => {
  const covered = new Set(apiLeads.map(leadDedupeKey));
  const uniqueStored = storedLeads.filter(
    (lead) => !covered.has(leadDedupeKey(lead)),
  );
  return [...apiLeads.map(normalizeLead), ...uniqueStored.map(normalizeLead)];
};

const filterDeletedLeads = (leads) => {
  const deletedKeys = new Set(getDeletedLeadKeys());
  if (deletedKeys.size === 0) return leads;
  return leads.filter((lead) => !deletedKeys.has(lead.requestKey));
};

const appendStageActivity = (request, stage) => ({
  ...request,
  stage,
  activities: [
    ...(request.activities || []),
    {
      id: `a-${Date.now()}`,
      label: `Stage changed to ${stage}`,
      at: new Date().toISOString(),
    },
  ],
});

const appendActivity = (request, label) => ({
  ...request,
  activities: [
    ...(request.activities || []),
    {
      id: `a-${Date.now()}`,
      label,
      at: new Date().toISOString(),
    },
  ],
});

/** YYYY-MM-DD in local timezone for date-input comparison. */
const toLocalDateKey = (value) => {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    const raw = String(value).slice(0, 10);
    return /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : "";
  }

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const normalizeFilterText = (value) => {
  const text = String(value || "").trim().toLowerCase();
  if (!text || text === "—" || text === "-") return "";
  return text;
};

const matchesLeadFilters = (lead, filters) => {
  if (!filters) return true;

  if (filters.stage && filters.stage !== "all") {
    if (String(lead.stage || "") !== filters.stage) return false;
  }

  if (filters.assignedTo && filters.assignedTo !== "all") {
    if (!leadMatchesAssigneeFilter(lead.assignedTo, filters.assignedTo)) {
      return false;
    }
  }

  if (filters.industry && filters.industry !== "all") {
    if (
      normalizeFilterText(lead.industry) !==
      normalizeFilterText(filters.industry)
    ) {
      return false;
    }
  }

  if (filters.country && filters.country !== "all") {
    if (
      normalizeFilterText(lead.country) !==
      normalizeFilterText(filters.country)
    ) {
      return false;
    }
  }

  if (filters.submissionDate) {
    if (toLocalDateKey(lead.submittedAt) !== filters.submissionDate) {
      return false;
    }
  }

  return true;
};

const areLeadFiltersActive = (filters = EMPTY_LEAD_FILTERS) =>
  (filters.stage && filters.stage !== "all") ||
  (filters.assignedTo && filters.assignedTo !== "all") ||
  (filters.industry && filters.industry !== "all") ||
  (filters.country && filters.country !== "all") ||
  Boolean(filters.submissionDate);

const ContactRequests = () => {
  const { adminEmail } = useAdminAuth();
  const authorName = adminEmail || "Admin";

  const [viewMode, setViewMode] = useState("kanban");
  const [filterOpen, setFilterOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState(EMPTY_LEAD_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_LEAD_FILTERS);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followUpsByLead, setFollowUpsByLead] = useState({});
  const [notesByLead, setNotesByLead] = useState({});
  const [selectedRequestKey, setSelectedRequestKey] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [savingFollowUp, setSavingFollowUp] = useState(false);
  const [loadingFollowUps, setLoadingFollowUps] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [deletingLead, setDeletingLead] = useState(false);

  const selectedRequest = useMemo(
    () => requests.find((r) => r.requestKey === selectedRequestKey) || null,
    [requests, selectedRequestKey],
  );

  const currentFollowUps = selectedRequestKey
    ? followUpsByLead[selectedRequestKey] || []
    : [];

  const currentNotes = selectedRequestKey
    ? notesByLead[selectedRequestKey] || []
    : [];

  const filteredRequests = useMemo(
    () => requests.filter((lead) => matchesLeadFilters(lead, appliedFilters)),
    [requests, appliedFilters],
  );

  const stats = useMemo(
    () => buildStats(filteredRequests),
    [filteredRequests],
  );

  const filtersActive = areLeadFiltersActive(appliedFilters);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRequests.length / PAGE_SIZE),
  );

  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredRequests.slice(start, start + PAGE_SIZE);
  }, [filteredRequests, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [appliedFilters]);

  const loadRequests = useCallback(async ({ showToast = false } = {}) => {
    setLoading(true);
    const storedLeads = buildStoredLocalLeads();

    try {
      if (!isContactRequestsApiConfigured()) {
        setRequests(filterDeletedLeads(storedLeads));
        if (showToast || storedLeads.length === 0) {
          setToast({
            type: storedLeads.length ? "success" : "error",
            message: storedLeads.length
              ? `Showing ${storedLeads.length} locally saved lead(s). API base URL is not configured.`
              : "Leads API is not configured. Submit Contact Us / Schedule / Register / Request Demo to create leads.",
          });
        }
        return;
      }

      try {
        const apiLeads = await getContactRequestsFromApi();
        setRequests(
          filterDeletedLeads(mergeApiAndStoredLeads(apiLeads, storedLeads)),
        );

        if (showToast) {
          setToast({
            type: "success",
            message: `Leads refreshed (${apiLeads.length} from server${
              storedLeads.length
                ? `, plus local submissions not yet on server`
                : ""
            }).`,
          });
        }
      } catch (apiError) {
        // Keep Schedule/Register/Contact local cards visible when API is down.
        setRequests(filterDeletedLeads(storedLeads));
        setToast({
          type: "error",
          message:
            apiError?.message ||
            "Could not load leads from server. Showing locally saved submissions.",
        });
      }
    } catch (error) {
      setRequests(filterDeletedLeads(storedLeads));
      setToast({
        type: "error",
        message: error?.message || "Could not load leads.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(() => {
    setFollowUpsByLead({});
    setNotesByLead({});
    setCurrentPage(1);
    loadRequests({ showToast: true });
  }, [loadRequests]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  useEffect(() => {
    const refreshRequests = () => loadRequests();
    window.addEventListener("aiverse:contact-requests-updated", refreshRequests);
    return () =>
      window.removeEventListener(
        "aiverse:contact-requests-updated",
        refreshRequests,
      );
  }, [loadRequests]);

  const openDrawer = (request) => {
    setSelectedRequestKey(request.requestKey);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedRequestKey(null);
  };

  useEffect(() => {
    if (!drawerOpen || !selectedRequestKey) {
      return undefined;
    }

    let isMounted = true;

    const loadFollowUps = async () => {
      setLoadingFollowUps(true);
      try {
        const followUps = await fetchFollowUpsApi(selectedRequestKey);
        if (isMounted) {
          setFollowUpsByLead((prev) => ({
            ...prev,
            [selectedRequestKey]: followUps,
          }));
        }
      } catch (error) {
        if (isMounted) {
          setFollowUpsByLead((prev) => ({
            ...prev,
            [selectedRequestKey]: prev[selectedRequestKey] || [],
          }));
          setToast({
            type: "error",
            message:
              error?.message ||
              "Unable to load follow-ups from the server.",
          });
        }
      } finally {
        if (isMounted) {
          setLoadingFollowUps(false);
        }
      }
    };

    loadFollowUps();

    return () => {
      isMounted = false;
    };
  }, [drawerOpen, selectedRequestKey]);

  const handleTableAction = (request, action) => {
    if (action === "view" || action === "edit") {
      openDrawer(request);
      return;
    }

    if (action === "delete") {
      setLeadToDelete(request);
    }
  };

  const handleConfirmDeleteLead = () => {
    if (!leadToDelete) return;

    setDeletingLead(true);

    try {
      if (leadToDelete.isStored) {
        deleteContactRequest(leadToDelete.id);
      } else if (leadToDelete.isApi) {
        markLeadDeleted(leadToDelete.requestKey);
      }

      setRequests((prev) =>
        prev.filter((item) => item.requestKey !== leadToDelete.requestKey),
      );

      setFollowUpsByLead((prev) => {
        const next = { ...prev };
        delete next[leadToDelete.requestKey];
        return next;
      });

      setNotesByLead((prev) => {
        const next = { ...prev };
        delete next[leadToDelete.requestKey];
        return next;
      });

      if (selectedRequestKey === leadToDelete.requestKey) {
        closeDrawer();
      }

      setLeadToDelete(null);
      setToast({
        type: "success",
        message: leadToDelete.isApi
          ? "Lead removed. It will stay hidden until server delete is available."
          : "Lead deleted successfully.",
      });
    } finally {
      setDeletingLead(false);
    }
  };

  const handleStageChange = useCallback(
    async (newStage) => {
      if (!selectedRequest) return;

      const { requestKey } = selectedRequest;

      // Persist stage to backend for API leads; surface errors to the drawer.
      if (selectedRequest.isApi) {
        await updateContactRequestStageOnApi({
          id: selectedRequest.id,
          stage: newStage,
        });
      }

      await updateContactRequestStageApi(requestKey, newStage);

      setRequests((prev) =>
        prev.map((request) => {
          if (request.requestKey !== requestKey) return request;

          if (request.isStored) {
            const persisted = updateStoredContactRequestStage(
              request.id,
              newStage,
            );
            return persisted
              ? {
                  ...persisted,
                  requestKey: request.requestKey,
                  isStored: true,
                }
              : appendStageActivity(request, newStage);
          }

          return appendStageActivity(request, newStage);
        }),
      );
    },
    [selectedRequest],
  );

  const handleAssigneesChange = useCallback((lead, assignedToLabel) => {
    if (!lead?.requestKey) return;

    setRequests((prev) =>
      prev.map((request) =>
        request.requestKey === lead.requestKey
          ? { ...request, assignedTo: assignedToLabel || "Unassigned" }
          : request,
      ),
    );
  }, []);

  const handleSaveFollowUp = useCallback(
    async (payload) => {
      if (!selectedRequest) return;

      setSavingFollowUp(true);
      try {
        const saved = await createFollowUpApi(selectedRequest, payload);

        setFollowUpsByLead((prev) => ({
          ...prev,
          [selectedRequest.requestKey]: [
            saved,
            ...(prev[selectedRequest.requestKey] || []),
          ],
        }));

        const label = saved.customLabel || saved.type;
        setRequests((prev) =>
          prev.map((request) =>
            request.requestKey === selectedRequest.requestKey
              ? appendActivity(request, `Follow-up scheduled: ${label}`)
              : request,
          ),
        );

        setToast({
          type: "success",
          message: buildFollowUpScheduleToast(saved),
        });
      } catch (error) {
        setToast({
          type: "error",
          message: error?.message || "Failed to schedule follow-up.",
        });
        throw error;
      } finally {
        setSavingFollowUp(false);
      }
    },
    [selectedRequest],
  );

  const handleSaveNote = useCallback(
    async (content, onClear) => {
      if (!selectedRequest) return;

      setSavingNote(true);
      try {
        const saved = await createNoteApi(selectedRequest.requestKey, {
          content,
          author: authorName,
        });

        setNotesByLead((prev) => ({
          ...prev,
          [selectedRequest.requestKey]: [
            saved,
            ...(prev[selectedRequest.requestKey] || []),
          ],
        }));

        setRequests((prev) =>
          prev.map((request) =>
            request.requestKey === selectedRequest.requestKey
              ? appendActivity(request, "Internal note added")
              : request,
          ),
        );

        onClear?.();
        setToast({ type: "success", message: "Note saved successfully." });
      } catch (error) {
        setToast({
          type: "error",
          message: error?.message || "Failed to save note.",
        });
      } finally {
        setSavingNote(false);
      }
    },
    [selectedRequest, authorName],
  );

  return (
    <AdminDemoPageShell
      title="Leads"
      description="Manage and track Contact Us, Schedule a Call, Register, and Request Demo inquiries (API + locally saved submissions)."
    >
      <ContactRequestSummary stats={stats} />

      <ContactRequestToolbar
        viewMode={viewMode}
        onViewChange={setViewMode}
        onFilterOpen={() => {
          setDraftFilters(appliedFilters);
          setFilterOpen(true);
        }}
        filterActive={filtersActive || filterOpen}
        onRefresh={handleRefresh}
      />

      {loading ? (
        <p style={{ margin: "16px 0", color: "#6b7280" }}>Loading leads...</p>
      ) : viewMode === "kanban" ? (
        <ContactRequestKanban
          requests={filteredRequests}
          onCardClick={openDrawer}
        />
      ) : (
        <>
          <ContactRequestTable
            requests={paginatedRequests}
            onRowAction={handleTableAction}
          />
          <AdminBlogPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredRequests.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
            itemLabel="leads"
          />
        </>
      )}

      <ContactRequestFilterPanel
        open={filterOpen}
        values={draftFilters}
        onChange={setDraftFilters}
        onApply={() => setAppliedFilters(draftFilters)}
        onReset={() => {
          setDraftFilters(EMPTY_LEAD_FILTERS);
          setAppliedFilters(EMPTY_LEAD_FILTERS);
        }}
        onClose={() => setFilterOpen(false)}
      />

      <ContactRequestDrawer
        request={selectedRequest}
        open={drawerOpen}
        onClose={closeDrawer}
        onStageChange={handleStageChange}
        onStageSuccess={(message) => setToast({ type: "success", message })}
        onStageError={(message) => setToast({ type: "error", message })}
        followUps={currentFollowUps}
        loadingFollowUps={loadingFollowUps}
        notes={currentNotes}
        onSaveFollowUp={handleSaveFollowUp}
        savingFollowUp={savingFollowUp}
        onSaveNote={handleSaveNote}
        savingNote={savingNote}
        onAssigneesChange={handleAssigneesChange}
      />

      <LeadDeleteModal
        lead={leadToDelete}
        deleting={deletingLead}
        onClose={() => {
          if (!deletingLead) setLeadToDelete(null);
        }}
        onConfirm={handleConfirmDeleteLead}
      />

      <ContactRequestToast toast={toast} onClose={() => setToast(null)} />
    </AdminDemoPageShell>
  );
};

export default ContactRequests;
