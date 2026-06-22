import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./AddNewAISolution.scss";
import { getServiceIdForDomain, mapFormToCapability, persistSubmittedCapability, serializeCapabilityForNavigation } from "../../utils/solutionMapper";
import {
  DocumentIcon,
  FileDocIcon,
  InfoIcon,
  LinkIcon,
  PlayIcon,
  SparkleIcon,
  UploadIcon,
} from "./FormIcons";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://func-aiverse-backend-dwgpguatgadjezae.centralindia-01.azurewebsites.net/api";

const DEMO_VIDEOS_SHAREPOINT_URL =
  "https://espireinfolab.sharepoint.com/:f:/r/sites/BETeam/Shared%20Documents/ESPIRE_AI%20Verse/Demo%20Videos?csf=1&web=1&e=xqbPma";

const AZURE_DEFAULT_BODY_LIMIT = 100 * 1024 * 1024;
const AZURE_BODY_LIMIT_WARN_THRESHOLD = 0.8 * AZURE_DEFAULT_BODY_LIMIT;

const CHAR_LIMITS = {
  Title: 100,
  SolutionContext: 1000,
  TechHighlights: 150,
};

const PLACEHOLDER_EVANGELIST = "Undefined";

const initialFormState = {
  Title: "",
  BusinessDomain: "",
  OwnershipDetails: "",
  AiEvangelists: [PLACEHOLDER_EVANGELIST],
  SolutionContext: "",
  TechHighlights: "",
  RepositoryUrl: "",
  Client: "",
  DemoLink: "",
};

const normalizeEvangelists = (evangelists) => {
  const selected = evangelists.filter((name) => name !== PLACEHOLDER_EVANGELIST);
  return selected.length > 0 ? selected : [PLACEHOLDER_EVANGELIST];
};

const isValidUrl = (value) => {
  const trimmed = value.trim();
  if (!trimmed) return true;

  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const FileDropzone = ({
  id,
  label,
  accept,
  hint,
  uploadTitle,
  formatHint,
  note,
  sharePointUrl,
  insideNote = false,
  large = false,
  multiple = false,
  error,
  files = [],
  onFilesChange,
}) => {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileList = Array.isArray(files) ? files : files ? [files] : [];
  const displayTitle = uploadTitle || hint;

  const handleFiles = (selectedFiles) => {
    if (!selectedFiles?.length) return;

    if (multiple) {
      const incoming = Array.from(selectedFiles);
      const existing = fileList;
      const seen = new Set(
        existing.map((file) => `${file.name}|${file.size}|${file.lastModified}`),
      );
      const merged = [...existing];

      incoming.forEach((file) => {
        const key = `${file.name}|${file.size}|${file.lastModified}`;
        if (!seen.has(key)) {
          seen.add(key);
          merged.push(file);
        }
      });

      onFilesChange?.(merged);
      return;
    }

    onFilesChange?.(selectedFiles[0]);
  };

  const removeFile = (index) => {
    if (multiple) {
      onFilesChange?.(fileList.filter((_, fileIndex) => fileIndex !== index));
      return;
    }

    onFilesChange?.(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="add_ai_solution__field">
      {label && <label htmlFor={id}>{label}</label>}

      <div
        className={`add_ai_solution__dropzone ${large ? "add_ai_solution__dropzone--large" : ""} ${isDragging ? "is-dragging" : ""} ${error ? "has-error" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          handleFiles(event.dataTransfer.files);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            inputRef.current?.click();
          }
        }}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          hidden
          onChange={(event) => handleFiles(event.target.files)}
        />

        {large ? <UploadIcon /> : <FileDocIcon />}

        <p className="add_ai_solution__dropzone-title">{displayTitle}</p>
        {formatHint && (
          <span className="add_ai_solution__dropzone-meta">{formatHint}</span>
        )}

        {insideNote && note && (
          <p className="add_ai_solution__dropzone-note">{note}</p>
        )}

        {sharePointUrl && (
          <a
            href={sharePointUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="add_ai_solution__demo-video-link"
            onClick={(event) => event.stopPropagation()}
          >
            📁 Open Demo Videos SharePoint Folder
          </a>
        )}
      </div>

      {fileList.length > 0 && (
        <div className="add_ai_solution__file-list">
          {fileList.map((file, index) => (
            <div className="add_ai_solution__file-item" key={`${file.name}-${index}`}>
              <div className="add_ai_solution__file-item-info">
                <span>{file.name}</span>
                <span className="add_ai_solution__file-item-size">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
              <button type="button" onClick={() => removeFile(index)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {!insideNote && note && <p className="add_ai_solution__note">{note}</p>}
      {error && <p className="add_ai_solution__error">{error}</p>}
    </div>
  );
};

const AddNewAISolution = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editId = new URLSearchParams(location.search).get("id");
  const isEditMode = Boolean(editId);

  const [form, setForm] = useState(initialFormState);
  const [files, setFiles] = useState({
    SolutionDetailsDoc: null,
    OtherDocuments: [],
    DemoRecordedVideo: null,
  });
  const [existingFiles, setExistingFiles] = useState({
    SolutionDetailsDoc: null,
    OtherDocuments: [],
    DemoRecordedVideoLink: null,
  });
  const [businessDomains, setBusinessDomains] = useState([]);
  const [solutionOwners, setSolutionOwners] = useState([]);
  const [aiEvangelists, setAiEvangelists] = useState([]);
  const [loadingDomains, setLoadingDomains] = useState(true);
  const [loadingOwners, setLoadingOwners] = useState(true);
  const [loadingEvangelists, setLoadingEvangelists] = useState(true);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [evangelistSearch, setEvangelistSearch] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const fetchBusinessDomains = async () => {
    try {
      setLoadingDomains(true);
      const response = await fetch(`${API_BASE_URL}/get-business-domains`);
      const result = await response.json();

      if (response.ok && result.status === "success") {
        setBusinessDomains(result.data);
      } else {
        setSubmitStatus({
          type: "error",
          message: "Failed to load business domains. Please refresh the page.",
        });
      }
    } catch {
      setSubmitStatus({
        type: "error",
        message: "Network error while loading business domains.",
      });
    } finally {
      setLoadingDomains(false);
    }
  };

  const fetchSolutionOwners = async () => {
    try {
      setLoadingOwners(true);
      const response = await fetch(`${API_BASE_URL}/get-solution-owners`);
      const result = await response.json();

      if (response.ok && result.status === "success") {
        setSolutionOwners(result.data);
      }
    } catch (error) {
      console.error("Error fetching solution owners:", error);
    } finally {
      setLoadingOwners(false);
    }
  };

  const fetchAIEvangelists = async () => {
    try {
      setLoadingEvangelists(true);
      const response = await fetch(`${API_BASE_URL}/get-ai-evangelists`);
      const result = await response.json();

      if (response.ok && result.status === "success") {
        setAiEvangelists(result.data);
      }
    } catch (error) {
      console.error("Error fetching AI evangelists:", error);
    } finally {
      setLoadingEvangelists(false);
    }
  };

  useEffect(() => {
    fetchBusinessDomains();
    fetchSolutionOwners();
    fetchAIEvangelists();
  }, []);

  useEffect(() => {
    if (!isEditMode) return;

    const fetchExisting = async () => {
      try {
        setLoadingExisting(true);
        const response = await fetch(`${API_BASE_URL}/get-usecases?id=${editId}`);
        const result = await response.json();

        if (response.ok && result.status === "success" && result.data) {
          const solution = result.data;
          const evangelistList = solution.AiEvangelists
            ? solution.AiEvangelists.split(",")
                .map((value) => value.trim())
                .filter(Boolean)
            : [];

          setForm({
            Title: solution.Title || "",
            BusinessDomain: solution.BusinessDomain || "",
            OwnershipDetails: solution.OwnershipDetails || "",
            AiEvangelists: normalizeEvangelists(evangelistList),
            SolutionContext: solution.SolutionContext || "",
            TechHighlights: solution.TechHighlights || "",
            RepositoryUrl: solution.RepositoryUrl || "",
            Client: solution.Client || "",
            DemoLink: solution.DemoLink || "",
          });

          setExistingFiles({
            SolutionDetailsDoc: solution.SolutionDetailsDoc || null,
            OtherDocuments: Array.isArray(solution.OtherDocuments)
              ? solution.OtherDocuments
              : [],
            DemoRecordedVideoLink: solution.DemoRecordedVideoLink || null,
          });
        } else {
          setSubmitStatus({
            type: "error",
            message: result.message || "Failed to load solution for editing",
          });
        }
      } catch (error) {
        setSubmitStatus({
          type: "error",
          message: `Network error while loading solution: ${error.message}`,
        });
      } finally {
        setLoadingExisting(false);
      }
    };

    fetchExisting();
  }, [editId, isEditMode]);

  useEffect(() => {
    const combinedSize = (files.OtherDocuments || []).reduce(
      (sum, file) => sum + (file?.size || 0),
      0,
    );

    if (combinedSize >= AZURE_DEFAULT_BODY_LIMIT) {
      const combinedMB = (combinedSize / (1024 * 1024)).toFixed(2);
      const limitMB = (AZURE_DEFAULT_BODY_LIMIT / (1024 * 1024)).toFixed(0);
      setErrors((prev) => ({
        ...prev,
        OtherDocuments: `Combined size ${combinedMB} MB exceeds Azure's default ${limitMB} MB request body limit.`,
      }));
    } else {
      setErrors((prev) =>
        prev.OtherDocuments ? { ...prev, OtherDocuments: "" } : prev,
      );
    }
  }, [files.OtherDocuments]);

  const toggleEvangelist = (name, checked) => {
    setForm((prev) => {
      const selected = prev.AiEvangelists.filter(
        (value) => value !== PLACEHOLDER_EVANGELIST,
      );
      const next = checked
        ? [...selected, name]
        : selected.filter((value) => value !== name);

      return {
        ...prev,
        AiEvangelists: normalizeEvangelists(next),
      };
    });
  };

  const removeEvangelist = (name) => {
    setForm((prev) => ({
      ...prev,
      AiEvangelists: normalizeEvangelists(
        prev.AiEvangelists.filter((value) => value !== name),
      ),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.Title.trim()) {
      newErrors.Title = "Solution title is required";
    }

    if (!form.BusinessDomain.trim()) {
      newErrors.BusinessDomain = "Business domain is required";
    }

    if (!form.SolutionContext.trim()) {
      newErrors.SolutionContext = "Solution context is required";
    }

    if (!form.TechHighlights.trim()) {
      newErrors.TechHighlights = "Technology highlights are required";
    }

    if (form.RepositoryUrl.trim() && !isValidUrl(form.RepositoryUrl)) {
      newErrors.RepositoryUrl = "Enter a valid repository URL (e.g. https://github.com/your-repo)";
    }

    if (form.DemoLink.trim() && !isValidUrl(form.DemoLink)) {
      newErrors.DemoLink = "Enter a valid demo URL starting with http:// or https://";
    }

    if (
      !form.DemoLink.trim() &&
      !files.DemoRecordedVideo &&
      !existingFiles.DemoRecordedVideoLink
    ) {
      newErrors.DemoLink = "Either Demo Link or Demo Video is required";
      newErrors.DemoRecordedVideo = "Either Demo Link or Demo Video is required";
    }

    if (files.DemoRecordedVideo && files.DemoRecordedVideo.size > 98 * 1024 * 1024) {
      newErrors.DemoRecordedVideo = "Video file size should not exceed 98MB";
    }

    if (files.SolutionDetailsDoc && files.SolutionDetailsDoc.size > 50 * 1024 * 1024) {
      newErrors.SolutionDetailsDoc = "Document file size should not exceed 50MB";
    }

    const otherDocsCombined = (files.OtherDocuments || []).reduce(
      (sum, file) => sum + (file?.size || 0),
      0,
    );

    if (otherDocsCombined >= AZURE_DEFAULT_BODY_LIMIT) {
      const combinedMB = (otherDocsCombined / (1024 * 1024)).toFixed(2);
      const limitMB = (AZURE_DEFAULT_BODY_LIMIT / (1024 * 1024)).toFixed(0);
      newErrors.OtherDocuments = `Combined size ${combinedMB} MB exceeds Azure's default ${limitMB} MB request body limit.`;
    }

    return newErrors;
  };

  const resetFormFields = () => {
    setForm(initialFormState);
    setFiles({
      SolutionDetailsDoc: null,
      OtherDocuments: [],
      DemoRecordedVideo: null,
    });
    setErrors({});
    setEvangelistSearch("");
  };

  const handleReset = () => {
    resetFormFields();
    setSubmitStatus(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitStatus({
        type: "error",
        message: `Please fix the errors in the form: ${Object.values(validationErrors).join(" ")}`,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const formDataToSend = new FormData();

      if (isEditMode) {
        formDataToSend.append("ID", editId);
      }

      Object.keys(form).forEach((key) => {
        if (!form[key]) return;

        if (key === "AiEvangelists") {
          if (Array.isArray(form[key]) && form[key].length > 0) {
            formDataToSend.append(key, form[key].join(", "));
          }
          return;
        }

        formDataToSend.append(key, form[key]);
      });

      if (files.DemoRecordedVideo) {
        formDataToSend.append("DemoRecordedVideo", files.DemoRecordedVideo);
      }

      if (files.SolutionDetailsDoc) {
        formDataToSend.append("SolutionDetailsDoc", files.SolutionDetailsDoc);
      }

      if (files.OtherDocuments.length > 0) {
        files.OtherDocuments.forEach((file) => {
          formDataToSend.append("OtherDocuments", file);
        });
      }

      const endpoint = isEditMode ? "update-usecase" : "save-usecase";
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: "POST",
        body: formDataToSend,
      });

      let result;
      try {
        result = await response.json();
      } catch {
        setSubmitStatus({
          type: "error",
          message: `Server error (${response.status}). Please try again.`,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      if (response.ok && result.status === "success") {
        const savedBusinessDomain = form.BusinessDomain;
        const solutionId =
          result.data?.solution_id ??
          result.data?.ID ??
          (isEditMode ? editId : null);
        const submittedSolution = mapFormToCapability(form, {
          solutionId,
          evangelistDirectory: aiEvangelists,
          solutionOwners,
        });
        const serializedSolution = serializeCapabilityForNavigation(submittedSolution);
        persistSubmittedCapability(serializedSolution);

        if (!isEditMode) {
          resetFormFields();
        }

        const serviceId =
          getServiceIdForDomain(savedBusinessDomain) || "agentic-automation";
        const params = new URLSearchParams({
          service: serviceId,
          submitted: "1",
        });

        if (solutionId) {
          params.set("highlight", String(solutionId));
        }

        navigate(`/explore-solutions?${params.toString()}`, {
          state: {
            submittedSolution: serializedSolution,
          },
        });
        return;
      } else {
        setSubmitStatus({
          type: "error",
          message:
            result.message ||
            (isEditMode ? "Failed to update solution" : "Failed to save solution"),
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: `Network error: ${error.message}`,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredEvangelists = aiEvangelists.filter((evangelist) =>
    evangelist.Name.toLowerCase().startsWith(evangelistSearch.trim().toLowerCase()),
  );

  const totalUploadSize =
    (files.OtherDocuments || []).reduce((sum, file) => sum + (file?.size || 0), 0) +
    (files.SolutionDetailsDoc?.size || 0) +
    (files.DemoRecordedVideo?.size || 0);

  return (
    <form
      className="add_ai_solution"
      onSubmit={handleSubmit}
      onReset={handleReset}
      noValidate
    >
      <header className="add_ai_solution__banner">
        <div className="add_ai_solution__banner-icon">
          <SparkleIcon />
        </div>
        <div>
          <h1>{isEditMode ? "Edit AI Solution" : "Add New AI Solution"}</h1>
          <p>
            {isEditMode
              ? "Update the details of an existing solution. Leave a file empty to keep the existing one."
              : "Fill in the details below to register a new AI solution in the catalog."}
          </p>
          {loadingExisting && <p>Loading existing solution...</p>}
        </div>
      </header>

      {submitStatus && (
        <div className={`add_ai_solution__status add_ai_solution__status--${submitStatus.type}`}>
          <strong>{submitStatus.type === "success" ? "Success" : "Error"}</strong>
          <p>{submitStatus.message}</p>
          {submitStatus.type === "success" && (
            <Link to="/solutions" className="add_ai_solution__status-link">
              View saved solutions
            </Link>
          )}
        </div>
      )}

      <section className="add_ai_solution__card">
        <h2>
          <InfoIcon />
          Basic Information
        </h2>

        <div className="add_ai_solution__field">
          <label htmlFor="Title">
            Solution Title <span className="required">*</span>
            <span className="add_ai_solution__char-count">
              {form.Title.length}/{CHAR_LIMITS.Title}
            </span>
          </label>
          <input
            id="Title"
            type="text"
            placeholder="e.g. AI-powered Customer Service Chatbot"
            value={form.Title}
            maxLength={CHAR_LIMITS.Title}
            onChange={(event) => updateField("Title", event.target.value)}
            required
          />
          {errors.Title && <p className="add_ai_solution__error">{errors.Title}</p>}
        </div>

        <div className="add_ai_solution__row">
          <div className="add_ai_solution__field">
            <label htmlFor="BusinessDomain">
              Business Domain <span className="required">*</span>
            </label>
            <select
              id="BusinessDomain"
              value={form.BusinessDomain}
              onChange={(event) => updateField("BusinessDomain", event.target.value)}
              disabled={loadingDomains}
              required
            >
              <option value="">
                {loadingDomains ? "Loading domains..." : "Select a business domain"}
              </option>
              {businessDomains.map((domain) => (
                <option key={domain.DomainCode} value={domain.DomainCode}>
                  {domain.DomainName}
                </option>
              ))}
            </select>
            {errors.BusinessDomain && (
              <p className="add_ai_solution__error">{errors.BusinessDomain}</p>
            )}
          </div>

          <div className="add_ai_solution__field">
            <label htmlFor="OwnershipDetails">COE Name</label>
            <select
              id="OwnershipDetails"
              value={form.OwnershipDetails}
              onChange={(event) => updateField("OwnershipDetails", event.target.value)}
              disabled={loadingOwners}
            >
              <option value="">
                {loadingOwners ? "Loading COE options..." : "Select COE"}
              </option>
              {solutionOwners.map((owner) => (
                <option
                  key={owner.Email}
                  value={`${owner.Name} (${owner.Email})`}
                >
                  {owner.Name} ({owner.Email})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="add_ai_solution__field">
          <label htmlFor="evangelistSearch">AI Evangelist</label>
          <input
            id="evangelistSearch"
            type="text"
            className="add_ai_solution__evangelist-search"
            placeholder="Type to search evangelists..."
            value={evangelistSearch}
            onChange={(event) => setEvangelistSearch(event.target.value)}
          />

          <div className="add_ai_solution__evangelist-checkboxes">
            {loadingEvangelists ? (
              <p>Loading evangelists...</p>
            ) : filteredEvangelists.length === 0 ? (
              <p>No evangelists available</p>
            ) : (
              filteredEvangelists.map((evangelist) => (
                <label
                  key={evangelist.Name}
                  className="add_ai_solution__checkbox-item"
                >
                  <input
                    type="checkbox"
                    value={evangelist.Name}
                    checked={form.AiEvangelists.includes(evangelist.Name)}
                    onChange={(event) =>
                      toggleEvangelist(evangelist.Name, event.target.checked)
                    }
                  />
                  {evangelist.Name} - {evangelist.Department}
                </label>
              ))
            )}
          </div>

          <div className="add_ai_solution__selected-items">
            <span className="add_ai_solution__selected-label">Selected:</span>
            {form.AiEvangelists.map((name) => (
              <span key={name} className="add_ai_solution__selected-badge">
                {name}
                <button
                  type="button"
                  className="add_ai_solution__badge-remove"
                  onClick={() => removeEvangelist(name)}
                  aria-label={`Remove ${name}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="add_ai_solution__field">
          <label htmlFor="SolutionContext">
            Solution Context <span className="required">*</span>
            <span className="add_ai_solution__char-count">
              {form.SolutionContext.length}/{CHAR_LIMITS.SolutionContext}
            </span>
          </label>
          <textarea
            id="SolutionContext"
            rows={4}
            placeholder="Describe the business problem, target users, and expected outcomes."
            value={form.SolutionContext}
            maxLength={CHAR_LIMITS.SolutionContext}
            onChange={(event) => updateField("SolutionContext", event.target.value)}
            required
          />
          {errors.SolutionContext && (
            <p className="add_ai_solution__error">{errors.SolutionContext}</p>
          )}
        </div>

        <div className="add_ai_solution__field">
          <label htmlFor="TechHighlights">
            Technology Highlights <span className="required">*</span>
            <span className="add_ai_solution__char-count">
              {form.TechHighlights.length}/{CHAR_LIMITS.TechHighlights}
            </span>
          </label>
          <textarea
            id="TechHighlights"
            rows={3}
            placeholder="e.g. GPT-4, LangChain, Azure OpenAI"
            value={form.TechHighlights}
            maxLength={CHAR_LIMITS.TechHighlights}
            onChange={(event) => updateField("TechHighlights", event.target.value)}
            required
          />
          {errors.TechHighlights && (
            <p className="add_ai_solution__error">{errors.TechHighlights}</p>
          )}
        </div>

        <div className="add_ai_solution__field">
          <label htmlFor="RepositoryUrl">Repository URL</label>
          <div className="add_ai_solution__input-icon">
            <LinkIcon />
            <input
              id="RepositoryUrl"
              type="text"
              inputMode="url"
              placeholder="https://github.com/your-repo"
              value={form.RepositoryUrl}
              onChange={(event) => updateField("RepositoryUrl", event.target.value)}
            />
          </div>
          {errors.RepositoryUrl && (
            <p className="add_ai_solution__error">{errors.RepositoryUrl}</p>
          )}
        </div>

        <div className="add_ai_solution__field">
          <label htmlFor="Client">Client Name</label>
          <input
            id="Client"
            type="text"
            placeholder="e.g. Acme Corp"
            value={form.Client}
            onChange={(event) => updateField("Client", event.target.value)}
          />
        </div>
      </section>

      <section className="add_ai_solution__card">
        <h2>
          <PlayIcon />
          Demo and Media (At least one required)
        </h2>

        <div className="add_ai_solution__field">
          <label htmlFor="DemoLink">Demo Link</label>
          <div className="add_ai_solution__input-icon">
            <LinkIcon />
            <input
              id="DemoLink"
              type="text"
              inputMode="url"
              placeholder="https://demo.yoursolution.com"
              value={form.DemoLink}
              onChange={(event) => updateField("DemoLink", event.target.value)}
            />
          </div>
          <p className="add_ai_solution__field-hint">
            Provide a link to a live demo or hosted version
          </p>
          {errors.DemoLink && (
            <p className="add_ai_solution__error">{errors.DemoLink}</p>
          )}
        </div>

        <FileDropzone
          id="DemoRecordedVideo"
          label="Demo Recorded Video"
          accept="video/*"
          uploadTitle={
            files.DemoRecordedVideo ? "Change Video" : "Upload Demo Video"
          }
          formatHint="MP4, AVI, MOV (Max 98MB)"
          large
          insideNote
          sharePointUrl={DEMO_VIDEOS_SHAREPOINT_URL}
          files={files.DemoRecordedVideo}
          error={errors.DemoRecordedVideo}
          onFilesChange={(file) =>
            setFiles((prev) => ({ ...prev, DemoRecordedVideo: file }))
          }
          note="Note: If your demo video is larger than 50 MB, please upload it to the Demo Videos SharePoint folder, copy the shareable URL, and paste that URL into the Demo Link field."
        />

        {isEditMode && !files.DemoRecordedVideo && existingFiles.DemoRecordedVideoLink && (
          <p className="add_ai_solution__existing-file">
            Current video:{" "}
            <a
              href={existingFiles.DemoRecordedVideoLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              View attached demo video
            </a>
          </p>
        )}
      </section>

      <section className="add_ai_solution__card">
        <h2>
          <DocumentIcon />
          Documentation
        </h2>

        <FileDropzone
          id="SolutionDetailsDoc"
          label="Solution Details Document"
          accept=".pdf,.doc,.docx,application/pdf"
          hint="Upload solution details PDF or Word doc"
          files={files.SolutionDetailsDoc}
          error={errors.SolutionDetailsDoc}
          onFilesChange={(file) =>
            setFiles((prev) => ({ ...prev, SolutionDetailsDoc: file }))
          }
        />

        {isEditMode && !files.SolutionDetailsDoc && existingFiles.SolutionDetailsDoc && (
          <p className="add_ai_solution__existing-file">
            Current document:{" "}
            <a
              href={existingFiles.SolutionDetailsDoc}
              target="_blank"
              rel="noopener noreferrer"
            >
              View attached document
            </a>
          </p>
        )}

        <FileDropzone
          id="OtherDocuments"
          label="Additional Documents"
          accept=".pdf,.doc,.docx,application/pdf"
          hint="Upload additional PDF or Word docs"
          multiple
          files={files.OtherDocuments}
          error={errors.OtherDocuments}
          onFilesChange={(updatedFiles) =>
            setFiles((prev) => ({ ...prev, OtherDocuments: updatedFiles }))
          }
        />

        {isEditMode &&
          files.OtherDocuments.length === 0 &&
          existingFiles.OtherDocuments.length > 0 && (
            <div className="add_ai_solution__existing-file">
              <span>Current additional documents:</span>
              <ul>
                {existingFiles.OtherDocuments.map((url) => (
                  <li key={url}>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {url.split("/").pop()}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

        {totalUploadSize > 0 && (
          <p className="add_ai_solution__upload-size">
            Total upload size: {(totalUploadSize / (1024 * 1024)).toFixed(2)} MB /{" "}
            {(AZURE_DEFAULT_BODY_LIMIT / (1024 * 1024)).toFixed(0)} MB
            {totalUploadSize >= AZURE_BODY_LIMIT_WARN_THRESHOLD &&
              totalUploadSize < AZURE_DEFAULT_BODY_LIMIT &&
              " — approaching Azure request body limit"}
          </p>
        )}
      </section>

      <div className="add_ai_solution__actions">
        <button
          type="reset"
          className="add_ai_solution__reset"
          disabled={isSubmitting}
        >
          Reset Form
        </button>
        <button
          type="submit"
          className="add_ai_solution__submit"
          disabled={isSubmitting || loadingExisting}
        >
          {isSubmitting
            ? "Submitting..."
            : isEditMode
              ? "Update Solution"
              : "Submit Solution"}
        </button>
      </div>
    </form>
  );
};

export default AddNewAISolution;
