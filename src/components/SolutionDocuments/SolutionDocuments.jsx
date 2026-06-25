import "./SolutionDocuments.scss";

const DocumentIcon = ({ type }) => {
  if (type === "architecture-diagram") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="4" width="8" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
        <rect x="13" y="4" width="8" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
        <rect x="8" y="14" width="8" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
        <path d="M7 10v2h2v2M17 10v2h-2v2M12 12v2" stroke="currentColor" strokeWidth="1.75" />
      </svg>
    );
  }

  if (type === "lld") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M8 6h8M8 10h8M8 14h5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.75" />
      </svg>
    );
  }

  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 4h8l4 4v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path d="M16 4v4h4M9 13h6M9 17h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
};

const ExternalIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M14 5h5v5M10 14 19 5M19 14v5H5V5h5"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 4v10M8 11l4 4 4-4M5 20h14"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArchitecturePreview = () => (
  <div className="solution_documents__diagram-preview" aria-hidden="true">
    <div className="solution_documents__diagram-node solution_documents__diagram-node--primary">
      Agent Orchestrator
    </div>
    <div className="solution_documents__diagram-row">
      <div className="solution_documents__diagram-node">LLM Gateway</div>
      <div className="solution_documents__diagram-node">Tool Registry</div>
    </div>
    <div className="solution_documents__diagram-row">
      <div className="solution_documents__diagram-node">Enterprise APIs</div>
      <div className="solution_documents__diagram-node">Data Services</div>
    </div>
  </div>
);

const SolutionDocuments = ({
  documents = [],
  variant = "full",
  title = "Solution Resources",
  subtitle = "Download solution documents, LLD, and architecture diagrams.",
  className = "",
  onActionClick,
}) => {
  if (!documents.length) return null;

  const handleActionClick = (event) => {
    event.stopPropagation();
    onActionClick?.(event);
  };

  if (variant === "compact") {
    return (
      <div
        className={`solution_documents solution_documents--compact ${className}`.trim()}
        onClick={handleActionClick}
      >
        <span className="solution_documents__compact-label">Attachments</span>
        <div className="solution_documents__compact-list">
          {documents.slice(0, 3).map((document) => (
            <a
              key={document.id}
              href={document.url}
              target="_blank"
              rel="noopener noreferrer"
              className="solution_documents__compact-chip"
              style={{
                "--doc-accent": document.accent,
                "--doc-bg": document.bg,
              }}
              onClick={handleActionClick}
            >
              <DocumentIcon type={document.type} />
              <span>{document.badge}</span>
            </a>
          ))}
          {documents.length > 3 && (
            <span className="solution_documents__compact-more">
              +{documents.length - 3} more
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <section className={`solution_documents solution_documents--full ${className}`.trim()}>
      <header className="solution_documents__header">
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
        <span className="solution_documents__count">
          {documents.length} file{documents.length === 1 ? "" : "s"}
        </span>
      </header>

      <div className="solution_documents__grid">
        {documents.map((document) => (
          <article
            key={document.id}
            className="solution_documents__card"
            style={{
              "--doc-accent": document.accent,
              "--doc-bg": document.bg,
            }}
          >
            <div className="solution_documents__card-top">
              <span className="solution_documents__icon-wrap">
                <DocumentIcon type={document.type} />
              </span>
              <span className="solution_documents__badge">{document.badge}</span>
            </div>

            <h4>{document.label}</h4>
            <p>{document.description}</p>
            <span className="solution_documents__filename">{document.fileName}</span>

            {document.type === "architecture-diagram" && <ArchitecturePreview />}

            <div className="solution_documents__actions">
              <a
                href={document.url}
                target="_blank"
                rel="noopener noreferrer"
                className="solution_documents__action solution_documents__action--primary"
                onClick={handleActionClick}
              >
                View
                <ExternalIcon />
              </a>
              <a
                href={document.url}
                download={document.fileName}
                className="solution_documents__action"
                onClick={handleActionClick}
              >
                Download
                <DownloadIcon />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default SolutionDocuments;
