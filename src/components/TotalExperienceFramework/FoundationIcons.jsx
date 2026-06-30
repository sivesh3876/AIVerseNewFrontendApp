const iconProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  "aria-hidden": true,
};

export const AzureOpenAIFoundationIcon = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.25" />
    <path stroke="currentColor" strokeWidth="1.25" d="M12 4.5v15" />
    <path
      fill="currentColor"
      d="M7.4 12 10.2 9.2v2.1l2.8-1.6-2.8-1.5v2.1L7.4 12Z"
    />
  </svg>
);

export const AzureFoundationIcon = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.25" />
    <path
      fill="currentColor"
      d="M11.35 7.2 7.1 15.8h2.45l.75-1.55h3.4l.75 1.55h2.45L12.65 7.2h-1.3Zm-.15 5.95 1.5-3.1 1.5 3.1h-3Z"
    />
  </svg>
);

export const OpenAIFoundationIcon = () => (
  <svg {...iconProps} fill="currentColor">
    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A5.985 5.985 0 0 0 4.981 4.18a6.046 6.046 0 0 0-3.917 2.9 5.985 5.985 0 0 0 .742 7.097 5.985 5.985 0 0 0 .511 4.911 6.051 6.051 0 0 0 6.515 2.9A5.986 5.986 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 5.993 5.993 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.039l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.365-1.972V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.896zm16.597 3.855-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135-2.02-1.163a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365 2.602-1.499 2.607 1.5v2.998l-2.597 1.5-2.607-1.5z" />
  </svg>
);

export const ClaudeFoundationIcon = () => (
  <svg {...iconProps} stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round">
    <path d="M9.2 8.8C6.8 10.5 6 13 6.8 15.4c.8 2.4 3 4 5.2 4.1" />
    <path d="M14.8 8.8c2.4 1.7 3.2 4.2 2.4 6.6-.8 2.4-3 4-5.2 4.1" />
    <path d="M10.2 10.2c.8 1.2 1.2 2.4 1.2 3.1s-.4 1.9-1.2 3.1" />
    <path d="M13.8 10.2c-.8 1.2-1.2 2.4-1.2 3.1s.4 1.9 1.2 3.1" />
  </svg>
);

export const CursorFoundationIcon = () => (
  <svg {...iconProps}>
    <path
      fill="currentColor"
      d="M6.2 16.8 12 7.2l5.8 9.6H6.2Z"
      opacity="0.35"
    />
    <path
      fill="currentColor"
      d="M8.1 14.9h7.8l-1.2 2.1H9.3l-1.2-2.1Z"
    />
    <path
      fill="currentColor"
      d="M9.4 13h5.2l-1 1.8h-3.2l-1-1.8Z"
    />
    <path
      fill="currentColor"
      d="M10.6 11.2h2.8l-.8 1.4h-1.2l-.8-1.4Z"
    />
  </svg>
);

export const GitHubCopilotFoundationIcon = () => (
  <svg
    {...iconProps}
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 9 6 12l2 3" />
    <path d="m16 9 2 3-2 3" />
    <path d="M13 8.5 11 15.5" />
  </svg>
);

export const foundationIconMap = {
  "azure-openai": AzureOpenAIFoundationIcon,
  azure: AzureFoundationIcon,
  "open-ai": OpenAIFoundationIcon,
  "github-copilot": GitHubCopilotFoundationIcon,
  claude: ClaudeFoundationIcon,
  cursor: CursorFoundationIcon,
};

export const getFoundationIcons = (foundation) => {
  if (!foundation || typeof foundation === "string") {
    return [];
  }

  const iconIds = foundation.icons?.length
    ? foundation.icons
    : foundation.id
      ? [foundation.id]
      : [];

  return iconIds
    .map((iconId) => ({
      id: iconId,
      Icon: foundationIconMap[iconId] || null,
    }))
    .filter((entry) => entry.Icon);
};

export const getFoundationIcon = (foundationId) =>
  foundationIconMap[foundationId] || null;
