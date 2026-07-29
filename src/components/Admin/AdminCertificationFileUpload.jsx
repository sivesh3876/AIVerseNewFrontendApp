import { useRef, useState } from "react";

const MAX_FILE_SIZE_MB = 10;

const ACCEPTED_EXTENSIONS = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"];
const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/jpg",
  "image/png",
];

const DEFAULT_ACCEPT =
  ".pdf,.doc,.docx,.jpg,.jpeg,.png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png";

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });

const getExtension = (fileName = "") => {
  const parts = String(fileName).toLowerCase().split(".");
  return parts.length > 1 ? `.${parts.pop()}` : "";
};

const isAcceptedFile = (file) => {
  if (!file) return false;

  const extension = getExtension(file.name);
  if (ACCEPTED_EXTENSIONS.includes(extension)) return true;

  return ACCEPTED_MIME_TYPES.includes(file.type);
};

const getFileLabel = (fileName = "", mimeType = "") => {
  const extension = getExtension(fileName).replace(".", "").toUpperCase();
  if (extension) return extension;

  if (mimeType.includes("pdf")) return "PDF";
  if (mimeType.includes("word") || mimeType.includes("msword")) return "WORD";
  if (mimeType.includes("jpeg") || mimeType.includes("jpg")) return "JPG";
  if (mimeType.includes("png")) return "PNG";
  return "FILE";
};

const AdminCertificationFileUpload = ({
  id,
  label = "File Upload",
  value = "",
  fileName = "",
  onChange,
  accept = DEFAULT_ACCEPT,
  helpText = "PDF, Word, JPG, or PNG up to 10 MB.",
}) => {
  const inputRef = useRef(null);
  const [error, setError] = useState("");

  const handleFiles = async (files) => {
    const file = files?.[0];
    if (!file) return;

    if (!isAcceptedFile(file)) {
      setError("Please upload a PDF, Word, JPG, or PNG file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File must be smaller than ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setError("");
      onChange?.({
        dataUrl,
        fileName: file.name,
        mimeType: file.type || "",
      });
    } catch (readError) {
      setError(readError.message || "Could not upload file.");
    }
  };

  const handleRemove = (event) => {
    event.stopPropagation();
    setError("");
    onChange?.({
      dataUrl: "",
      fileName: "",
      mimeType: "",
    });
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const hasFile = Boolean(value);
  const displayName = fileName || "File uploaded";
  const typeLabel = getFileLabel(fileName, value?.startsWith?.("data:image") ? "image" : "");

  return (
    <div className="admin_certification_form__upload">
      <span className="admin_certification_form__upload-label">{label}</span>

      <div
        className={`admin_certification_form__dropzone${hasFile ? " has-preview" : ""}`}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            inputRef.current?.click();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          hidden
          onChange={(event) => handleFiles(event.target.files)}
        />

        {hasFile ? (
          <div className="admin_certification_form__file-preview">
            {value.startsWith("data:image") ? (
              <img
                src={value}
                alt={displayName}
                className="admin_certification_form__preview"
              />
            ) : (
              <span className="admin_certification_form__file-type">{typeLabel}</span>
            )}
            <p className="admin_certification_form__file-name">{displayName}</p>
          </div>
        ) : (
          <>
            <span
              className="admin_certification_form__dropzone-icon"
              aria-hidden="true"
            >
              +
            </span>
            <p>Click to upload file</p>
          </>
        )}
      </div>

      <p className="admin_blog_form__help">{helpText}</p>

      {hasFile && (
        <button
          type="button"
          className="admin_certification_form__remove"
          onClick={handleRemove}
        >
          Remove file
        </button>
      )}

      {error && <p className="admin_request_demos__error">{error}</p>}
    </div>
  );
};

export default AdminCertificationFileUpload;
