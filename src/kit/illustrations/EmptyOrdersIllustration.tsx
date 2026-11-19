import illustration from '../../assets/empty-box-3d.png';

export interface EmptyOrdersIllustrationProps {
  className?: string;
  width?: number;
  height?: number;
}

/** Decorative studio render; the surrounding state provides the accessible title. */
export function EmptyOrdersIllustration({ className = '', width = 160, height = 140 }: EmptyOrdersIllustrationProps) {
  return <img src={illustration} alt="" aria-hidden="true" width={width} height={height} className={`state-illustration empty-orders-illustration ${className}`} />;
}
