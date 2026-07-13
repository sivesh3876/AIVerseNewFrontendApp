import { useRef, useState } from "react";

const MAX_FILE_SIZE_MB = 2;

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read image file."));
    reader.readAsDataURL(file);
  });

const AdminCertificationImageUpload = ({
  id,
  label,
  value = "",
  onChange,
  helpText = "PNG, JPG, or WEBP up to 2 MB.",
}) => {
  const inputRef = useRef(null);
  const [error, setError] = useState("");

  const handleFiles = async (files) => {
    const file = files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`Image must be smaller than ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setError("");
      onChange?.(dataUrl);
    } catch (readError) {
      setError(readError.message || "Could not upload image.");
    }
  };

  const handleRemove = () => {
    setError("");
    onChange?.("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="admin_certification_form__upload">
      <span className="admin_certification_form__upload-label">{label}</span>

      <div
        className={`admin_certification_form__dropzone${value ? " has-preview" : ""}`}
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
          accept="image/png,image/jpeg,image/jpg,image/webp"
          hidden
          onChange={(event) => handleFiles(event.target.files)}
        />

        {value ? (
          <img
            src={value}
            alt={`${label} preview`}
            className="admin_certification_form__preview"
          />
        ) : (
          <>
            <span className="admin_certification_form__dropzone-icon" aria-hidden="true">
              +
            </span>
            <p>Click to upload image</p>
          </>
        )}
      </div>

      <p className="admin_blog_form__help">{helpText}</p>

      {value && (
        <button
          type="button"
          className="admin_certification_form__remove"
          onClick={handleRemove}
        >
          Remove image
        </button>
      )}

      {error && <p className="admin_request_demos__error">{error}</p>}
    </div>
  );
};

export default AdminCertificationImageUpload;
