import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createSuccessStory,
  updateSuccessStory,
} from "../../services/successStoriesApiService";
import {
  buildSuccessStoryFormData,
  generateSuccessStorySlug,
  getEmptySuccessStoryForm,
  getSuccessStoryCategoryOptions,
  SUCCESS_STORY_ADD_NEW_CATEGORY,
  SUCCESS_STORY_CATEGORY_PRESETS,
  SUCCESS_STORY_STATUSES,
  successStoryToFormValues,
  validateSuccessStoryForm,
} from "../../utils/successStoryAdminUtils";
import AdminImageUpload from "./AdminImageUpload";
import { useSuccessStories } from "./useSuccessStories";
import "./AdminLayout.scss";
import "./AdminSuccessStories.scss";

const TextField = ({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  type = "text",
  placeholder = "",
}) => (
  <label className="admin_success_story_form__field">
    <span>
      {label}
      {required && " *"}
    </span>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      aria-invalid={Boolean(error)}
    />
    {error && <small className="admin_success_story_form__error">{error}</small>}
  </label>
);

const TextAreaField = ({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  rows = 5,
  placeholder = "",
}) => (
  <label className="admin_success_story_form__field admin_success_story_form__field--wide">
    <span>
      {label}
      {required && " *"}
    </span>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      placeholder={placeholder}
      aria-invalid={Boolean(error)}
    />
    {error && <small className="admin_success_story_form__error">{error}</small>}
  </label>
);

const DynamicBulletList = ({
  label,
  singularLabel,
  items,
  onChange,
  error,
}) => {
  const updateItem = (index, value) =>
    onChange(items.map((item, itemIndex) => (itemIndex === index ? value : item)));
  const move = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="admin_success_story_form__bullets">
      <div className="admin_success_story_form__bullets-header">
        <span>{label} *</span>
        <button type="button" onClick={() => onChange([...items, ""])}>
          + Add {singularLabel}
        </button>
      </div>
      {items.map((item, index) => (
        <div className="admin_success_story_form__bullet" key={`${index}-${items.length}`}>
          <textarea
            value={item}
            rows={2}
            onChange={(event) => updateItem(index, event.target.value)}
            aria-label={`${singularLabel} ${index + 1}`}
          />
          <div className="admin_success_story_form__bullet-actions">
            <button
              type="button"
              onClick={() => move(index, -1)}
              disabled={index === 0}
              aria-label={`Move ${singularLabel} ${index + 1} up`}
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => move(index, 1)}
              disabled={index === items.length - 1}
              aria-label={`Move ${singularLabel} ${index + 1} down`}
            >
              ↓
            </button>
            <button
              type="button"
              className="is-danger"
              onClick={() => {
                const next = items.filter((_, itemIndex) => itemIndex !== index);
                onChange(next.length ? next : [""]);
              }}
              aria-label={`Remove ${singularLabel} ${index + 1}`}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      {error && <small className="admin_success_story_form__error">{error}</small>}
    </div>
  );
};

const AdminSuccessStoryForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const {
    stories,
    loadStory,
    loading: loadingStory,
    error: loadError,
  } = useSuccessStories({ autoLoad: true });
  const [values, setValues] = useState(getEmptySuccessStoryForm);
  const [categorySelect, setCategorySelect] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [errors, setErrors] = useState({});
  const [pageError, setPageError] = useState("");
  const [saving, setSaving] = useState(false);
  const [heroImage, setHeroImage] = useState({ file: null, preview: "" });
  const [clientLogo, setClientLogo] = useState({ file: null, preview: "" });
  const [additionalImages, setAdditionalImages] = useState([]);
  const [removedAdditionalImages, setRemovedAdditionalImages] = useState([]);
  const [removeHeroImage, setRemoveHeroImage] = useState(false);
  const [removeClientLogo, setRemoveClientLogo] = useState(false);

  const categoryOptions = useMemo(
    () => getSuccessStoryCategoryOptions(stories),
    [stories],
  );

  useEffect(() => {
    if (!isEdit) return;
    loadStory({ id })
      .then((story) => {
        const formValues = successStoryToFormValues(story);
        setValues(formValues);
        setSlugEdited(true);

        const current = String(formValues.category || "").trim();
        if (!current) {
          setCategorySelect("");
          setCustomCategory("");
          return;
        }
        const presetMatch = SUCCESS_STORY_CATEGORY_PRESETS.find(
          (option) => option.toLowerCase() === current.toLowerCase(),
        );
        if (presetMatch) {
          setCategorySelect(presetMatch);
          setCustomCategory("");
          setValues((prev) => ({ ...prev, category: presetMatch }));
        } else {
          setCategorySelect(SUCCESS_STORY_ADD_NEW_CATEGORY);
          setCustomCategory(current);
        }
      })
      .catch(() => {});
  }, [id, isEdit, loadStory]);

  useEffect(() => {
    if (!isEdit) return;
    const current = String(values.category || "").trim();
    if (!current || categorySelect === SUCCESS_STORY_ADD_NEW_CATEGORY) return;
    const matched = categoryOptions.find(
      (option) => option.toLowerCase() === current.toLowerCase(),
    );
    if (matched && matched !== categorySelect) {
      setCategorySelect(matched);
    }
  }, [categoryOptions, isEdit, values.category, categorySelect]);

  const handleCategorySelectChange = (event) => {
    const next = event.target.value;
    setCategorySelect(next);
    setErrors((current) => ({ ...current, category: "" }));
    if (next === SUCCESS_STORY_ADD_NEW_CATEGORY) {
      setValues((current) => ({
        ...current,
        category: customCategory.trim(),
      }));
      return;
    }
    setCustomCategory("");
    setValues((current) => ({ ...current, category: next }));
  };

  const handleCustomCategoryChange = (event) => {
    const next = event.target.value;
    setCustomCategory(next);
    setValues((current) => ({ ...current, category: next }));
    setErrors((current) => ({ ...current, category: "" }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => {
      const next = { ...current, [name]: value };
      if (name === "title" && !slugEdited) {
        next.slug = generateSuccessStorySlug(value);
      }
      return next;
    });
    if (name === "slug") setSlugEdited(true);
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const setList = (name, items) => {
    setValues((current) => ({ ...current, [name]: items }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const removeExistingAdditionalImage = (url) => {
    setValues((current) => ({
      ...current,
      additionalImageUrls: current.additionalImageUrls.filter(
        (imageUrl) => imageUrl !== url,
      ),
    }));
    setRemovedAdditionalImages((current) => [...current, url]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const resolvedCategory =
      categorySelect === SUCCESS_STORY_ADD_NEW_CATEGORY
        ? customCategory.trim()
        : categorySelect.trim();
    const nextValues = {
      ...values,
      category: resolvedCategory,
      heroImageFile: heroImage.file,
    };
    const nextErrors = validateSuccessStoryForm(nextValues, {
      requireHeroImage: true,
    });
    if (
      categorySelect === SUCCESS_STORY_ADD_NEW_CATEGORY &&
      !customCategory.trim()
    ) {
      nextErrors.category = "Please enter a new category name.";
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setPageError("Complete the required fields before saving.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSaving(true);
    setPageError("");
    try {
      const formData = buildSuccessStoryFormData(nextValues, {
        id,
        heroImageFile: heroImage.file,
        clientLogoFile: clientLogo.file,
        additionalImageFiles: additionalImages.map((image) => image.file),
        removeHeroImage,
        removeClientLogo,
        removedAdditionalImages,
      });
      if (isEdit) {
        await updateSuccessStory(formData);
      } else {
        await createSuccessStory(formData);
      }
      navigate("/admin/success-stories", { replace: true });
    } catch (saveError) {
      setPageError(saveError.message || "Failed to save success story.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSaving(false);
    }
  };

  if (isEdit && loadingStory && !values.id) {
    return (
      <section className="admin_success_story_form">
        <p>Loading success story…</p>
      </section>
    );
  }

  if (isEdit && loadError && !values.id) {
    return (
      <section className="admin_success_story_form">
        <Link to="/admin/success-stories">← Back to Success Stories</Link>
        <div className="admin_success_stories__error" role="alert">
          <p>{loadError}</p>
          <button
            type="button"
            onClick={() =>
              loadStory({ id })
                .then((story) => {
                  setValues(successStoryToFormValues(story));
                  setSlugEdited(true);
                })
                .catch(() => {})
            }
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="admin_success_story_form">
      <header className="admin_success_story_form__header">
        <div>
          <Link to="/admin/success-stories">← Back to Success Stories</Link>
          <h1>{isEdit ? "Edit Success Story" : "Add Success Story"}</h1>
          <p>
            Add the content shown on Strategic Partnership cards and story
            detail pages.
          </p>
        </div>
      </header>

      {pageError && (
        <p className="admin_success_story_form__page-error" role="alert">
          {pageError}
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <fieldset disabled={saving}>
          <section className="admin_success_story_form__card">
            <h2>Basic Information</h2>
            <div className="admin_success_story_form__grid">
              <TextField
                label="Client / Organization Name"
                name="client"
                value={values.client}
                onChange={handleChange}
                error={errors.client}
                required
              />
              <div className="admin_success_story_form__field">
                <span>Category / Industry *</span>
                <select
                  name="category"
                  value={categorySelect}
                  onChange={handleCategorySelectChange}
                  aria-invalid={Boolean(errors.category)}
                  required
                >
                  <option value="">Select category</option>
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                  <option value={SUCCESS_STORY_ADD_NEW_CATEGORY}>
                    + Add new category
                  </option>
                </select>
                {categorySelect === SUCCESS_STORY_ADD_NEW_CATEGORY && (
                  <input
                    type="text"
                    className="admin_success_story_form__inline-input"
                    value={customCategory}
                    onChange={handleCustomCategoryChange}
                    placeholder="Enter new category name"
                    aria-invalid={Boolean(errors.category)}
                  />
                )}
                {errors.category && (
                  <small className="admin_success_story_form__error">
                    {errors.category}
                  </small>
                )}
              </div>
              <TextField
                label="Story Title"
                name="title"
                value={values.title}
                onChange={handleChange}
                error={errors.title}
                required
              />
              <TextField
                label="Slug"
                name="slug"
                value={values.slug}
                onChange={handleChange}
                error={errors.slug}
                required
                placeholder="modernizing-member-experience"
              />
              <TextAreaField
                label="Short Description"
                name="shortDescription"
                value={values.shortDescription}
                onChange={handleChange}
                error={errors.shortDescription}
                required
                rows={4}
              />
              <div className="admin_success_story_form__metric-grid">
                <TextField
                  label="Key Metric"
                  name="keyMetric"
                  value={values.keyMetric}
                  onChange={handleChange}
                  error={errors.keyMetric}
                  required
                  placeholder="Stronger"
                />
                <TextField
                  label="Metric Description"
                  name="metricDescription"
                  value={values.metricDescription}
                  onChange={handleChange}
                  error={errors.metricDescription}
                  required
                />
              </div>
              <label className="admin_success_story_form__field">
                <span>Publication Status *</span>
                <select
                  name="status"
                  value={values.status}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.status)}
                >
                  {SUCCESS_STORY_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                {errors.status && (
                  <small className="admin_success_story_form__error">
                    {errors.status}
                  </small>
                )}
              </label>
            </div>
            <div className="admin_success_story_form__image-grid">
              <AdminImageUpload
                id="success-story-hero"
                label="Hero Image"
                required
                value={heroImage.preview || values.heroImageUrl}
                error={errors.heroImage}
                onChange={(file, preview) => {
                  setHeroImage({ file, preview });
                  setRemoveHeroImage(false);
                  setErrors((current) => ({ ...current, heroImage: "" }));
                }}
                onRemove={() => {
                  setHeroImage({ file: null, preview: "" });
                  setValues((current) => ({ ...current, heroImageUrl: "" }));
                  setRemoveHeroImage(true);
                }}
              />
              <AdminImageUpload
                id="success-story-client-logo"
                label="Client Logo"
                value={clientLogo.preview || values.clientLogoUrl}
                onChange={(file, preview) => {
                  setClientLogo({ file, preview });
                  setRemoveClientLogo(false);
                }}
                onRemove={() => {
                  setClientLogo({ file: null, preview: "" });
                  setValues((current) => ({ ...current, clientLogoUrl: "" }));
                  setRemoveClientLogo(true);
                }}
              />
            </div>
          </section>

          <section className="admin_success_story_form__card">
            <h2>The Challenge</h2>
            <TextAreaField
              label="Challenge Description"
              name="challenge"
              value={values.challenge}
              onChange={handleChange}
              error={errors.challenge}
              required
              rows={7}
            />
          </section>

          <section className="admin_success_story_form__card">
            <h2>The Solution</h2>
            <TextAreaField
              label="Solution Description"
              name="solutionDescription"
              value={values.solutionDescription}
              onChange={handleChange}
              rows={5}
            />
            <DynamicBulletList
              label="Solution Bullet Points"
              singularLabel="Bullet"
              items={values.solutionBullets}
              onChange={(items) => setList("solutionBullets", items)}
              error={errors.solutionBullets}
            />
          </section>

          <section className="admin_success_story_form__card">
            <h2>Results</h2>
            <DynamicBulletList
              label="Result Bullet Points"
              singularLabel="Result"
              items={values.results}
              onChange={(items) => setList("results", items)}
              error={errors.results}
            />
          </section>

          <section className="admin_success_story_form__card">
            <h2>Optional Details</h2>
            <div className="admin_success_story_form__grid">
              <TextField
                label="Technologies"
                name="technologies"
                value={values.technologies}
                onChange={handleChange}
                placeholder="Sitecore AI, Azure AI, React"
              />
              <TextField
                label="Services"
                name="services"
                value={values.services}
                onChange={handleChange}
                placeholder="Experience Design, Managed Services"
              />
              <TextAreaField
                label="Testimonial"
                name="testimonial"
                value={values.testimonial}
                onChange={handleChange}
                rows={4}
              />
              <TextField
                label="Testimonial Author"
                name="testimonialAuthor"
                value={values.testimonialAuthor}
                onChange={handleChange}
              />
              <TextField
                label="CTA Text"
                name="ctaText"
                value={values.ctaText}
                onChange={handleChange}
              />
              <TextField
                label="CTA URL"
                name="ctaUrl"
                type="url"
                value={values.ctaUrl}
                onChange={handleChange}
                error={errors.ctaUrl}
                placeholder="https://example.com"
              />
            </div>

            <div className="admin_success_story_form__additional">
              <h3>Additional Images</h3>
              <div className="admin_success_story_form__additional-grid">
                {values.additionalImageUrls.map((url) => (
                  <div
                    className="admin_success_story_form__additional-image"
                    key={url}
                  >
                    <img src={url} alt="Existing story attachment" />
                    <button
                      type="button"
                      onClick={() => removeExistingAdditionalImage(url)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {additionalImages.map((image, index) => (
                  <div
                    className="admin_success_story_form__additional-image"
                    key={`${image.file.name}-${index}`}
                  >
                    <img src={image.preview} alt={image.file.name} />
                    <button
                      type="button"
                      onClick={() =>
                        setAdditionalImages((current) =>
                          current.filter((_, itemIndex) => itemIndex !== index),
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <AdminImageUpload
                key={additionalImages.length}
                id="success-story-additional-image"
                label="Add another image"
                onChange={(file, preview) =>
                  setAdditionalImages((current) => [
                    ...current,
                    { file, preview },
                  ])
                }
                onRemove={() => {}}
              />
            </div>
          </section>
        </fieldset>

        <footer className="admin_success_story_form__footer">
          <Link
            className="admin_request_demos__btn admin_request_demos__btn--secondary"
            to="/admin/success-stories"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="admin_request_demos__btn admin_request_demos__btn--primary"
            disabled={saving}
          >
            {saving
              ? "Saving…"
              : isEdit
                ? "Update Success Story"
                : "Create Success Story"}
          </button>
        </footer>
      </form>
    </section>
  );
};

export default AdminSuccessStoryForm;
