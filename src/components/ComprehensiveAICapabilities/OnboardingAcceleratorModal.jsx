import "./OnboardingAcceleratorModal.scss";

const OnboardingAcceleratorModal = ({ title, subtitle, src, onClose }) => {
  return (
    <div
      className="onboarding_accelerator_modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-accelerator-title"
      onClick={onClose}
    >
      <div
        className="onboarding_accelerator_modal"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="onboarding_accelerator_modal__header">
          <div className="onboarding_accelerator_modal__header-copy">
            <h3 id="onboarding-accelerator-title">{title}</h3>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button
            type="button"
            className="onboarding_accelerator_modal__close"
            onClick={onClose}
            aria-label="Close onboarding accelerator"
          >
            &times;
          </button>
        </header>

        <div className="onboarding_accelerator_modal__frame-wrap">
          <iframe
            src={src}
            title={title}
            className="onboarding_accelerator_modal__frame"
            allow="fullscreen"
          />
        </div>
      </div>
    </div>
  );
};

export default OnboardingAcceleratorModal;
