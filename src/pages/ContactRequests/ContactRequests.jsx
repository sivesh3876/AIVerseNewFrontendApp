import { useCallback, useEffect, useMemo, useState } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import AdminDemoPageShell from "../../components/Admin/AdminDemoPageShell";
import AdminBlogPagination from "../../components/Admin/AdminBlogPagination";
import ContactRequestSummary from "../../components/ContactRequest/ContactRequestSummary";
import ContactRequestToolbar from "../../components/ContactRequest/ContactRequestToolbar";
import ContactRequestKanban from "../../components/ContactRequest/ContactRequestKanban";
import ContactRequestTable from "../../components/ContactRequest/ContactRequestTable";
import ContactRequestFilterPanel from "../../components/ContactRequest/ContactRequestFilterPanel";
import ContactRequestDrawer from "../../components/ContactRequest/ContactRequestDrawer";
import ContactRequestToast from "../../components/ContactRequest/ContactRequestToast";
import LeadDeleteModal from "../../components/ContactRequest/LeadDeleteModal";
import { PLACEHOLDER_REQUESTS } from "../../components/ContactRequest/placeholders";
import {
  getContactRequests,
  updateStoredContactRequestStage,
  deleteContactRequest,
  getDeletedDemoLeadKeys,
  markDemoLeadDeleted,
} from "../../utils/contactRequestStorage";
import { updateContactRequestStageApi } from "../../services/contactRequestStageService";
import { createFollowUpApi } from "../../services/contactRequestFollowUpService";
import { createNoteApi } from "../../services/contactRequestNoteService";
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
    (request.reason === "Contact Us" ? "Mail" : "Message"),
});

const buildInitialRequests = () => {
  const deletedDemoKeys = new Set(getDeletedDemoLeadKeys());

  const stored = getContactRequests().map((request) => ({
    ...normalizeLead(request),
    requestKey: `stored-${request.id}`,
    isStored: true,
  }));

  const demo = PLACEHOLDER_REQUESTS.map((request) => ({
    ...normalizeLead(request),
    requestKey: `demo-${request.id}`,
    isStored: false,
  })).filter((request) => !deletedDemoKeys.has(request.requestKey));

  return [...stored, ...demo];
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

const ContactRequests = () => {
  const { adminEmail } = useAdminAuth();
  const authorName = adminEmail || "Admin";

  const [viewMode, setViewMode] = useState("kanban");
  const [filterOpen, setFilterOpen] = useState(false);
  const [requests, setRequests] = useState(buildInitialRequests);
  const [followUpsByLead, setFollowUpsByLead] = useState({});
  const [notesByLead, setNotesByLead] = useState({});
  const [selectedRequestKey, setSelectedRequestKey] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [savingFollowUp, setSavingFollowUp] = useState(false);
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

  const stats = useMemo(() => buildStats(requests), [requests]);

  const totalPages = Math.max(1, Math.ceil(requests.length / PAGE_SIZE));

  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return requests.slice(start, start + PAGE_SIZE);
  }, [requests, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleRefresh = useCallback(() => {
    setRequests(buildInitialRequests());
    setFollowUpsByLead({});
    setNotesByLead({});
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    const refreshRequests = () => setRequests(buildInitialRequests());
    window.addEventListener("aiverse:contact-requests-updated", refreshRequests);
    return () =>
      window.removeEventListener("aiverse:contact-requests-updated", refreshRequests);
  }, []);

  const openDrawer = (request) => {
    setSelectedRequestKey(request.requestKey);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedRequestKey(null);
  };

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
      } else {
        markDemoLeadDeleted(leadToDelete.requestKey);
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
      setToast({ type: "success", message: "Lead deleted successfully." });
    } finally {
      setDeletingLead(false);
    }
  };

  const handleStageChange = useCallback(
    async (newStage) => {
      if (!selectedRequest) return;

      const { requestKey } = selectedRequest;

      await updateContactRequestStageApi(requestKey, newStage);

      setRequests((prev) =>
        prev.map((request) => {
          if (request.requestKey !== requestKey) return request;

          if (request.isStored) {
            const persisted = updateStoredContactRequestStage(request.id, newStage);
            return persisted
              ? { ...persisted, requestKey: request.requestKey, isStored: true }
              : appendStageActivity(request, newStage);
          }

          return appendStageActivity(request, newStage);
        }),
      );
    },
    [selectedRequest],
  );

  const handleSaveFollowUp = useCallback(
    async (payload) => {
      if (!selectedRequest) return;

      setSavingFollowUp(true);
      try {
        const saved = await createFollowUpApi(
          selectedRequest.requestKey,
          payload,
        );

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

        setToast({ type: "success", message: "Follow-up scheduled successfully." });
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
      description="Manage and track all inquiries submitted through the website Contact Us form."
    >
      <ContactRequestSummary stats={stats} />

      <ContactRequestToolbar
        viewMode={viewMode}
        onViewChange={setViewMode}
        onFilterOpen={() => setFilterOpen(true)}
        filterActive={filterOpen}
        onRefresh={handleRefresh}
      />

      {viewMode === "kanban" ? (
        <ContactRequestKanban requests={requests} onCardClick={openDrawer} />
      ) : (
        <>
          <ContactRequestTable
            requests={paginatedRequests}
            onRowAction={handleTableAction}
          />
          <AdminBlogPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={requests.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
            itemLabel="leads"
          />
        </>
      )}

      <ContactRequestFilterPanel
        open={filterOpen}
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
        notes={currentNotes}
        onSaveFollowUp={handleSaveFollowUp}
        savingFollowUp={savingFollowUp}
        onSaveNote={handleSaveNote}
        savingNote={savingNote}
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
