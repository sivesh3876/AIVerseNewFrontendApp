import { useCallback, useEffect, useState } from "react";

export const PIPELINE_STAGE_OPTIONS = [
  "Contacted",
  "Qualified",
  "Meeting Scheduled",
  "Proposal Sent",
  "Won",
  "Lost",
  "Closed",
];

export const PIPELINE_STAGE_LABELS = {
  "Proposal Sent": "Proposal",
};

const getStageLabel = (stage) => PIPELINE_STAGE_LABELS[stage] || stage;

/**
 * Interactive pipeline stage selector with optimistic updates, loading state,
 * and rollback on failure. Calls the async onStageChange handler provided
 * by the parent (mock API today, real API later).
 */
const PipelineStage = ({
  stage: stageProp = "Contacted",
  onStageChange,
  onSuccess,
  onError,
}) => {
  const [selectedStage, setSelectedStage] = useState(stageProp);
  const [pendingStage, setPendingStage] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!isUpdating) {
      setSelectedStage(stageProp);
    }
  }, [stageProp, isUpdating]);

  const handleClick = useCallback(
    async (newStage) => {
      if (isUpdating || newStage === selectedStage) return;

      const previousStage = selectedStage;
      setSelectedStage(newStage);
      setPendingStage(newStage);
      setIsUpdating(true);

      try {
        await onStageChange?.(newStage);
        onSuccess?.(`Stage updated to ${getStageLabel(newStage)}`);
      } catch (error) {
        setSelectedStage(previousStage);
        onError?.(error?.message || "Failed to update stage.");
      } finally {
        setIsUpdating(false);
        setPendingStage(null);
      }
    },
    [isUpdating, selectedStage, onStageChange, onSuccess, onError],
  );

  return (
    <div
      className={`admin_pipeline_stage${isUpdating ? " is-updating" : ""}`}
      aria-busy={isUpdating}
    >
      <div className="admin_contact_drawer__stages">
        {PIPELINE_STAGE_OPTIONS.map((stage) => {
          const isActive = selectedStage === stage;
          const isPending = pendingStage === stage;

          return (
            <button
              key={stage}
              type="button"
              className={`admin_contact_drawer__stage-btn${
                isActive ? " is-active" : ""
              }${isPending ? " is-pending" : ""}`}
              onMouseDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                handleClick(stage);
              }}
              disabled={isUpdating}
              aria-pressed={isActive}
              aria-busy={isPending}
            >
              {isPending ? "Updating…" : getStageLabel(stage)}
            </button>
          );
        })}
      </div>
      {isUpdating && (
        <p className="admin_pipeline_stage__loading" role="status">
          Saving stage change…
        </p>
      )}
    </div>
  );
};

export default PipelineStage;
