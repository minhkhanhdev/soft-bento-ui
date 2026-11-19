import type { LucideProps } from 'lucide-react';
import {
  siFacebook,
  siInstagram,
  siTelegram,
  siThreads,
  siTiktok,
  siX,
  siYoutube,
  siZalo,
  type SimpleIcon,
} from 'simple-icons';

/**
 * Custom 3D-printing domain glyphs aligned with Lucide geometry (24x24, strokeWidth 1.75).
 * Replaces generic 2D office paper Printer and database Cylinder icons.
 */
export function Printer3DIcon({
  size = 16,
  strokeWidth = 1.75,
  className,
  ...props
}: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Gantry frame & build plate base */}
      <path d="M3.5 20h17" />
      <path d="M5.5 20V5a1.5 1.5 0 0 1 1.5-1.5h10A1.5 1.5 0 0 1 18.5 5v15" />
      {/* X-axis rail */}
      <path d="M5.5 9.5h13" />
      {/* Extruder head & nozzle */}
      <path d="M9.75 7.5h4.5v3.2L12 13.25 9.75 10.7V7.5Z" />
      {/* Printed 3D part on build plate */}
      <path d="M9.5 20v-3.5h5V20" />
    </svg>
  );
}

export function FilamentSpoolIcon({
  size = 16,
  strokeWidth = 1.75,
  className,
  ...props
}: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Spool flange */}
      <circle cx="11" cy="12" r="7.5" />
      {/* Inner hub core */}
      <circle cx="11" cy="12" r="2.75" />
      {/* Spool spokes / winding marks */}
      <path d="M11 6.75v1.25" />
      <path d="M11 16v1.25" />
      <path d="M5.75 12H7" />
      {/* Filament strand feeding out */}
      <path d="M17.5 16h1.5a2 2 0 0 0 2-2V6.5" />
    </svg>
  );
}

/**
 * Official brand social icons powered by `simple-icons` (always up-to-date vector paths).
 * Monochrome brands (TikTok, Threads, X) inherit `currentColor` for crisp Light/Dark contrast;
 * colored brands (Zalo, Facebook, Instagram, YouTube, Telegram) render in their official brand hex.
 */
function createSimpleBrandIcon(icon: SimpleIcon, useBrandColor: boolean) {
  return function BrandIcon({ size = 16, className, strokeWidth: _sw, style, ...props }: LucideProps) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={useBrandColor ? `#${icon.hex}` : 'currentColor'}
        className={className}
        style={style}
        {...props}
      >
        <path d={icon.path} />
      </svg>
    );
  };
}

export const TikTokIcon = createSimpleBrandIcon(siTiktok, false);
export const InstagramIcon = createSimpleBrandIcon(siInstagram, true);
export const ThreadsIcon = createSimpleBrandIcon(siThreads, false);
export const YouTubeIcon = createSimpleBrandIcon(siYoutube, true);
export const ZaloIcon = createSimpleBrandIcon(siZalo, true);
export const FacebookIcon = createSimpleBrandIcon(siFacebook, true);
export const XSocialIcon = createSimpleBrandIcon(siX, false);
export const TelegramIcon = createSimpleBrandIcon(siTelegram, true);
