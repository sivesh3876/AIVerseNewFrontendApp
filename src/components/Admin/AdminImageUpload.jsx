import { useRef, useState } from "react";

const DEFAULT_ACCEPTED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
];

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read image file."));
    reader.readAsDataURL(file);
  });

const AdminImageUpload = ({
  id,
  label,
  value = "",
  required = false,
  onChange,
  onRemove,
  maxSizeMb = 5,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
  helpText,
  error: externalError = "",
  disabled = false,
}) => {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file) => {
    if (!file) return;
    if (!acceptedTypes.includes(file.type)) {
      setError("Upload a PNG, JPG, or WEBP image.");
      return;
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`Image must be ${maxSizeMb} MB or smaller.`);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const previewUrl = await readFileAsDataUrl(file);
      onChange?.(file, previewUrl);
    } catch (readError) {
      setError(readError.message || "Could not load the selected image.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setError("");
    if (inputRef.current) inputRef.current.value = "";
    onRemove?.();
  };

  return (
    <div className="admin_image_upload">
      <span className="admin_image_upload__label">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </span>
      <button
        type="button"
        className={`admin_image_upload__dropzone${value ? " has-preview" : ""}`}
        onClick={() => inputRef.current?.click()}
        disabled={disabled || loading}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={acceptedTypes.join(",")}
          hidden
          disabled={disabled}
          onChange={(event) => handleFile(event.target.files?.[0])}
        />
        {loading ? (
          <span>Loading image…</span>
        ) : value ? (
          <img src={value} alt={`${label} preview`} />
        ) : (
          <>
            <span className="admin_image_upload__icon" aria-hidden="true">
              +
            </span>
            <span>Choose image</span>
          </>
        )}
      </button>
      <div className="admin_image_upload__meta">
        <span>
          {helpText || `PNG, JPG, or WEBP up to ${maxSizeMb} MB.`}
        </span>
        {value && (
          <span className="admin_image_upload__actions">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={disabled || loading}
            >
              Replace
            </button>
            <button
              type="button"
              className="is-danger"
              onClick={handleRemove}
              disabled={disabled || loading}
            >
              Remove
            </button>
          </span>
        )}
      </div>
      {(error || externalError) && (
        <p className="admin_image_upload__error">{error || externalError}</p>
      )}
    </div>
  );
};

export default AdminImageUpload;
