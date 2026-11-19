import illustration from '../../assets/printer-3d.png';

export interface EmptyPrintersIllustrationProps {
  className?: string;
  width?: number;
  height?: number;
}

/** Decorative studio 3D printer render; the surrounding state provides the accessible title. */
export function EmptyPrintersIllustration({
  className = '',
  width = 148,
  height = 148,
}: EmptyPrintersIllustrationProps) {
  return (
    <img
      src={illustration}
      alt=""
      aria-hidden="true"
      width={width}
      height={height}
      className={`state-illustration empty-printers-illustration ${className}`}
    />
  );
}
