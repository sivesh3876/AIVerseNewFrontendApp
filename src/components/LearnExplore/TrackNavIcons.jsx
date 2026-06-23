const iconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
};

export const GridIcon = () => (
  <svg {...iconProps}>
    <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.75" />
    <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.75" />
    <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.75" />
    <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.75" />
  </svg>
);

export const SparklesIcon = () => (
  <svg {...iconProps}>
    <path d="M12 3 13.2 8.8 19 10l-5.8 1.2L12 17l-1.2-5.8L5 10l5.8-1.2L12 3Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const BeakerIcon = () => (
  <svg {...iconProps}>
    <path d="M9 3h6M10 3v6.5L4.5 20a1 1 0 0 0 .9 1.5h13.2a1 1 0 0 0 .9-1.5L14 9.5V3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CloudIcon = () => (
  <svg {...iconProps}>
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const SearchIcon = () => (
  <svg {...iconProps}>
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.75" />
    <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

export const LayersIcon = () => (
  <svg {...iconProps}>
    <path d="M12 2 2 7l10 5 10-5-10-5Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    <path d="m2 12 10 5 10-5M2 17l10 5 10-5" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
  </svg>
);

export const ShieldIcon = () => (
  <svg {...iconProps}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
