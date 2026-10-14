export function Mark() {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path
        d="M2 21h8l5-13 8 26 6-13h9"
        pathLength="1"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function Chart({ variant = 0 }) {
  const paths = [
    'M0 71L18 73L35 64L52 68L67 48L80 58L93 30L103 47L119 53L132 36L147 56L158 61L174 50L188 57L202 37L217 48L231 32L243 57L262 61L279 41L300 49',
    'M0 60L21 58L39 51L53 62L69 58L86 48L103 52L123 44L142 48L157 41L177 50L196 39L214 43L234 37L252 46L268 43L284 38L300 40',
    'M0 82L23 75L39 77L56 63L72 69L94 55L110 60L130 30L145 55L162 41L182 58L201 46L221 57L236 43L253 51L277 29L300 41',
  ];
  return (
    <svg
      viewBox="0 0 300 100"
      preserveAspectRatio="none"
      role="img"
      aria-label="Illustrative telemetry chart"
    >
      <path
        d="M0 25H300M0 50H300M0 75H300M50 0V100M100 0V100M150 0V100M200 0V100M250 0V100"
        className="graph-grid"
        fill="none"
      />
      <path d={paths[variant % paths.length]} className="graph-path" />
      <path d={paths[variant % paths.length] + 'L300 100H0Z'} className="graph-fill" opacity=".4" />
    </svg>
  );
}
