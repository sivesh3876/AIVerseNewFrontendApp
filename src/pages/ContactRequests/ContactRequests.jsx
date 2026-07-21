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
import { PLACEHOLDER_REQUESTS } from "../../components/ContactRequest/placeholders";
import {
  getContactRequests,
  updateStoredContactRequestStage,
} from "../../utils/contactRequestStorage";
import { updateContactRequestStageApi } from "../../services/contactRequestStageService";
import { createFollowUpApi } from "../../services/contactRequestFollowUpService";
import { createNoteApi } from "../../services/contactRequestNoteService";
import "../../components/Admin/AdminLayout.scss";

const PAGE_SIZE = 10;

const buildStats = (requests) => ({
  total: requests.length,
  new: requests.filter((r) => r.stage === "New").length,
  qualified: requests.filter((r) => r.stage === "Qualified").length,
  won: requests.filter((r) => r.stage === "Won").length,
  lost: requests.filter((r) => r.stage === "Lost").length,
  closed: requests.filter((r) => r.stage === "Closed").length,
});

const buildInitialRequests = () => {
  const stored = getContactRequests().map((request) => ({
    ...request,
    requestKey: `stored-${request.id}`,
    isStored: true,
  }));

  const demo = PLACEHOLDER_REQUESTS.map((request) => ({
    ...request,
    requestKey: `demo-${request.id}`,
    isStored: false,
  }));

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

  const handleRefresh = useCallback(() => {
    setRequests(buildInitialRequests());
    setFollowUpsByLead({});
    setNotesByLead({});
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
      title="Contact Requests"
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
            requests={requests}
            onRowAction={handleTableAction}
          />
          <AdminBlogPagination
            currentPage={1}
            totalPages={Math.max(1, Math.ceil(requests.length / PAGE_SIZE))}
            totalItems={requests.length}
            pageSize={PAGE_SIZE}
            onPageChange={() => {}}
            itemLabel="requests"
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

      <ContactRequestToast toast={toast} onClose={() => setToast(null)} />
    </AdminDemoPageShell>
  );
};

export default ContactRequests;
