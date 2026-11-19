import illustration from '../../assets/empty-search-3d.png';

export interface EmptySearchIllustrationProps {
  className?: string;
  width?: number;
  height?: number;
}

/** Decorative studio render; the surrounding state provides the accessible title. */
export function EmptySearchIllustration({ className = '', width = 150, height = 130 }: EmptySearchIllustrationProps) {
  return <img src={illustration} alt="" aria-hidden="true" width={width} height={height} className={`state-illustration empty-search-illustration ${className}`} />;
}
