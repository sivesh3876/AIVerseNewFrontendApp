const iconProps = {
  width: 28,
  height: 28,
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const HomeSolutionIconOne = () => (
  <svg {...iconProps}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
    <circle cx="9" cy="11.5" r="1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="11.5" r="1" fill="currentColor" stroke="none" />
    <circle cx="15" cy="11.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const HomeSolutionIconTwo = () => (
  <svg {...iconProps}>
    <rect x="5" y="9" width="14" height="10" rx="2" />
    <path d="M9 9V7a3 3 0 0 1 6 0v2" />
    <circle cx="9.5" cy="14" r="1" fill="currentColor" stroke="none" />
    <circle cx="14.5" cy="14" r="1" fill="currentColor" stroke="none" />
    <path d="M12 4v1" />
    <circle cx="12" cy="3" r="0.75" fill="currentColor" stroke="none" />
  </svg>
);

export const HomeSolutionIconThree = () => (
  <svg {...iconProps}>
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588 4 4 0 0 0 7.636 2.106 3 3 0 0 0 .331-1.579 4 4 0 0 0 2.526-5.77 4 4 0 0 0-.556-6.588A4 4 0 0 0 12 5Z" />
    <path d="M12 5v14" />
  </svg>
);

export const HomeSolutionIconFour = () => (
  <svg {...iconProps}>
    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />
  </svg>
);

export const HomeSolutionIconFive = () => (
  <svg {...iconProps}>
    <path d="M3 3v18h18" />
    <path d="m7 14 4-4 3 3 5-6" />
    <circle cx="18" cy="6" r="2" fill="currentColor" stroke="none" />
  </svg>
);

export const HomeSolutionIconSix = () => (
  <svg {...iconProps}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6" />
    <path d="M8 13h8M8 17h5" />
  </svg>
);

export const HomeSolutionIconSeven = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="9" />
    <path d="M2 12h20" />
    <path d="M12 3a15.3 15.3 0 0 1 4 9 15.3 15.3 0 0 1-4 9 15.3 15.3 0 0 1-4-9 15.3 15.3 0 0 1 4-9Z" />
  </svg>
);

export const HomeSolutionIconEight = () => (
  <svg {...iconProps}>
    <path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" />
    <path d="M19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75L19 14Z" />
  </svg>
);

export const HOME_SOLUTION_ICONS = [
  HomeSolutionIconOne,
  HomeSolutionIconTwo,
  HomeSolutionIconThree,
  HomeSolutionIconFour,
  HomeSolutionIconFive,
  HomeSolutionIconSix,
  HomeSolutionIconSeven,
  HomeSolutionIconEight,
];
