import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 18, children, ...rest }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const ArrowRight = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </Base>
);

export const ArrowUpRight = (p: IconProps) => (
  <Base {...p}>
    <path d="M7 17L17 7" />
    <path d="M8 7h9v9" />
  </Base>
);

export const ArrowDown = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 5v14" />
    <path d="M6 13l6 6 6-6" />
  </Base>
);

export const Download = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 4v11" />
    <path d="M7 11l5 5 5-5" />
    <path d="M5 20h14" />
  </Base>
);

export const Mail = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="M4 8l8 6 8-6" />
  </Base>
);

export const Person = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" />
  </Base>
);

export const FileDoc = (p: IconProps) => (
  <Base {...p}>
    <path d="M7 3h7l5 5v13H7z" />
    <path d="M14 3v5h5" />
  </Base>
);

export const Sun = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2" />
    <path d="M12 19.5v2" />
    <path d="M4.6 4.6l1.4 1.4" />
    <path d="M18 18l1.4 1.4" />
    <path d="M2.5 12h2" />
    <path d="M19.5 12h2" />
    <path d="M4.6 19.4L6 18" />
    <path d="M18 6l1.4-1.4" />
  </Base>
);

export const Moon = (p: IconProps) => (
  <Base {...p}>
    <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
  </Base>
);

export const Chevron = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 9l6 6 6-6" />
  </Base>
);

export const Check = (p: IconProps) => (
  <Base strokeWidth={2.4} {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Base>
);

export const Spinner = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3a9 9 0 1 0 9 9" />
  </Base>
);

export function ZondasMark({ label, ...rest }: SVGProps<SVGSVGElement> & { label: string }) {
  return (
    <svg role="img" aria-label={label} width={34} height={30} viewBox="0 0 540 480" fill="currentColor" {...rest}>
      <path d="M145 55C231 7 331-7 415 5c62 9 99 44 117 105 16 54 17 127-4 162-13 22-37 25-63 19-44-10-83-44-111-88-50-80-94-147-209-148Z" />
      <path d="M2 197c8-60 45-93 104-90 100 4 159 72 214 159 43 67 73 113 143 138 21 8 41 14 57 23 27 15 20 31-16 40-47 12-111 17-177 13-139-8-228-35-276-83C4 350-9 267 2 197Z" />
    </svg>
  );
}
