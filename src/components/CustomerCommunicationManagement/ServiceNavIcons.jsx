const iconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
};

export const MessageSquareIcon = () => (
  <svg {...iconProps}>
    <path
      d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SmileIcon = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.75" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    <line x1="9" y1="9" x2="9.01" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="15" y1="9" x2="15.01" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const SparklesIcon = () => (
  <svg {...iconProps}>
    <path
      d="M12 3 13.2 8.8 19 10l-5.8 1.2L12 17l-1.2-5.8L5 10l5.8-1.2L12 3Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M5 3v2M19 19v2M3 5h2M19 17h2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

export const BuildingIcon = () => (
  <svg {...iconProps}>
    <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.75" />
    <path d="M9 7h.01M9 11h.01M9 15h.01M15 7h.01M15 11h.01M15 15h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const CpuIcon = () => (
  <svg {...iconProps}>
    <rect x="7" y="7" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="1.75" />
    <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

export const DatabaseIcon = () => (
  <svg {...iconProps}>
    <ellipse cx="12" cy="5" rx="8" ry="3" stroke="currentColor" strokeWidth="1.75" />
    <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" stroke="currentColor" strokeWidth="1.75" />
    <path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" stroke="currentColor" strokeWidth="1.75" />
  </svg>
);

export const BotIcon = () => (
  <svg {...iconProps}>
    <path d="M12 8V4H8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="4" y="8" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.75" />
    <path d="M2 14h2M20 14h2M9 13h.01M15 13h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
