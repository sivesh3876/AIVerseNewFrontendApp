import { useRef, useState } from "react";
import "./AddNewAISolution.scss";
import {
  DocumentIcon,
  FileDocIcon,
  InfoIcon,
  LinkIcon,
  PlayIcon,
  SparkleIcon,
  UploadIcon,
} from "./FormIcons";

const initialFormState = {
  solutionTitle: "",
  businessDomain: "",
  coeName: "",
  evangelistInput: "",
  evangelists: [],
  solutionContext: "",
  technologyHighlights: "",
  repositoryUrl: "",
  clientName: "",
  demoLink: "",
};

const businessDomains = [
  "Select domain",
  "Healthcare",
  "Financial Services",
  "Retail",
  "Education",
  "Manufacturing",
  "Technology",
];

const FileDropzone = ({
  id,
  label,
  accept,
  hint,
  note,
  large = false,
  onFileSelect,
}) => {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    setFileName(file.name);
    onFileSelect?.(file);
  };

  return (
    <div className="add_ai_solution__field">
      {label && <label htmlFor={id}>{label}</label>}

      <div
        className={`add_ai_solution__dropzone ${large ? "add_ai_solution__dropzone--large" : ""} ${isDragging ? "is-dragging" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          handleFile(event.dataTransfer.files[0]);
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
          hidden
          onChange={(event) => handleFile(event.target.files?.[0])}
        />

        {large ? <UploadIcon /> : <FileDocIcon />}

        <p className="add_ai_solution__dropzone-title">{hint}</p>
        {large && (
          <span className="add_ai_solution__dropzone-meta">MP4, MOV up to 500MB</span>
        )}
        {fileName && (
          <span className="add_ai_solution__dropzone-file">{fileName}</span>
        )}
      </div>

      {note && <p className="add_ai_solution__note">{note}</p>}
    </div>
  );
};

const AddNewAISolution = ({ onSubmit, onReset }) => {
  const [form, setForm] = useState(initialFormState);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddEvangelist = () => {
    const name = form.evangelistInput.trim();
    if (!name || form.evangelists.includes(name)) return;

    setForm((prev) => ({
      ...prev,
      evangelists: [...prev.evangelists, name],
      evangelistInput: "",
    }));
  };

  const handleReset = () => {
    setForm(initialFormState);
    onReset?.();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(form);
  };

  return (
    <form className="add_ai_solution" onSubmit={handleSubmit} onReset={handleReset}>
      <header className="add_ai_solution__banner">
        <div className="add_ai_solution__banner-icon">
          <SparkleIcon />
        </div>
        <div>
          <h1>Add New AI Solution</h1>
          <p>
            Fill in the details below to register a new AI solution in the
            catalog.
          </p>
        </div>
      </header>

      <section className="add_ai_solution__card">
        <h2>
          <InfoIcon />
          Basic Information
        </h2>

        <div className="add_ai_solution__field">
          <label htmlFor="solutionTitle">
            Solution Title <span className="required">*</span>
          </label>
          <input
            id="solutionTitle"
            type="text"
            placeholder="e.g. AI-powered Customer Service Chatbot"
            value={form.solutionTitle}
            onChange={(event) => updateField("solutionTitle", event.target.value)}
            required
          />
        </div>

        <div className="add_ai_solution__row">
          <div className="add_ai_solution__field">
            <label htmlFor="businessDomain">
              Business Domain <span className="required">*</span>
            </label>
            <select
              id="businessDomain"
              value={form.businessDomain}
              onChange={(event) => updateField("businessDomain", event.target.value)}
              required
            >
              {businessDomains.map((domain) => (
                <option key={domain} value={domain === "Select domain" ? "" : domain}>
                  {domain}
                </option>
              ))}
            </select>
          </div>

          <div className="add_ai_solution__field">
            <label htmlFor="coeName">COE Name</label>
            <input
              id="coeName"
              type="text"
              placeholder="e.g. AI Center of Excellence"
              value={form.coeName}
              onChange={(event) => updateField("coeName", event.target.value)}
            />
          </div>
        </div>

        <div className="add_ai_solution__field">
          <label htmlFor="evangelistInput">AI Evangelists</label>
          <div className="add_ai_solution__input-action">
            <input
              id="evangelistInput"
              type="text"
              placeholder="Add evangelist names"
              value={form.evangelistInput}
              onChange={(event) =>
                updateField("evangelistInput", event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleAddEvangelist();
                }
              }}
            />
            <button type="button" onClick={handleAddEvangelist}>
              + Add
            </button>
          </div>
          {form.evangelists.length > 0 && (
            <div className="add_ai_solution__tags">
              {form.evangelists.map((name) => (
                <span key={name}>{name}</span>
              ))}
            </div>
          )}
        </div>

        <div className="add_ai_solution__field">
          <label htmlFor="solutionContext">
            Solution Context <span className="required">*</span>
          </label>
          <textarea
            id="solutionContext"
            rows={4}
            placeholder="Describe the business problem, target users, and expected outcomes."
            value={form.solutionContext}
            onChange={(event) => updateField("solutionContext", event.target.value)}
            required
          />
        </div>

        <div className="add_ai_solution__field">
          <label htmlFor="technologyHighlights">
            Technology Highlights <span className="required">*</span>
          </label>
          <textarea
            id="technologyHighlights"
            rows={3}
            placeholder="e.g. GPT-4, LangChain, Azure OpenAI"
            value={form.technologyHighlights}
            onChange={(event) =>
              updateField("technologyHighlights", event.target.value)
            }
            required
          />
        </div>

        <div className="add_ai_solution__field">
          <label htmlFor="repositoryUrl">Repository URL</label>
          <div className="add_ai_solution__input-icon">
            <LinkIcon />
            <input
              id="repositoryUrl"
              type="url"
              placeholder="https://"
              value={form.repositoryUrl}
              onChange={(event) => updateField("repositoryUrl", event.target.value)}
            />
          </div>
        </div>

        <div className="add_ai_solution__field">
          <label htmlFor="clientName">Client Name</label>
          <input
            id="clientName"
            type="text"
            placeholder="e.g. Acme Corp"
            value={form.clientName}
            onChange={(event) => updateField("clientName", event.target.value)}
          />
        </div>
      </section>

      <section className="add_ai_solution__card">
        <h2>
          <PlayIcon />
          Demo and Media (At least one required)
        </h2>

        <div className="add_ai_solution__field">
          <label htmlFor="demoLink">Demo Link</label>
          <div className="add_ai_solution__input-icon">
            <LinkIcon />
            <input
              id="demoLink"
              type="url"
              placeholder="https://"
              value={form.demoLink}
              onChange={(event) => updateField("demoLink", event.target.value)}
            />
          </div>
        </div>

        <FileDropzone
          id="demoVideo"
          label="Demo Recorded Video"
          accept="video/mp4,video/quicktime,.mp4,.mov"
          hint="Drag & drop video or click to browse"
          large
          note="Note: If your demo video is larger than 50 MB, please upload it to the Demo Videos SharePoint folder, copy the shareable URL, and paste that URL into the Demo Link field."
        />
      </section>

      <section className="add_ai_solution__card">
        <h2>
          <DocumentIcon />
          Documentation
        </h2>

        <FileDropzone
          id="solutionDetailsDoc"
          label="Solution Details Document"
          accept=".pdf,.doc,.docx,application/pdf"
          hint="Upload solution details PDF or Word doc"
        />

        <FileDropzone
          id="additionalDocs"
          label="Additional Documents"
          accept=".pdf,.doc,.docx,application/pdf"
          hint="Upload solution details PDF or Word doc"
        />
      </section>

      <div className="add_ai_solution__actions">
        <button type="reset" className="add_ai_solution__reset">
          Reset Form
        </button>
        <button type="submit" className="add_ai_solution__submit">
          Submit Solution
        </button>
      </div>
    </form>
  );
};

export default AddNewAISolution;
