import filamentImg from '../../assets/empty-filament-3d.png';
import accessoriesImg from '../../assets/empty-accessories-3d.png';
import productsImg from '../../assets/empty-products-3d.png';
import financeImg from '../../assets/empty-finance-3d.png';
import worksheetsImg from '../../assets/empty-worksheets-3d.png';
import contentImg from '../../assets/empty-content-3d.png';

export interface EntityIllustrationProps {
  className?: string;
  width?: number;
  height?: number;
}

function makeIllustration(src: string, modifier: string) {
  return function Illustration({ className = '', width = 148, height = 148 }: EntityIllustrationProps) {
    return (
      <img
        src={src}
        alt=""
        aria-hidden="true"
        width={width}
        height={height}
        className={`state-illustration ${modifier} ${className}`.trim()}
      />
    );
  };
}

export const EmptyFilamentsIllustration = makeIllustration(filamentImg, 'empty-filaments-illustration');
export const EmptyAccessoriesIllustration = makeIllustration(accessoriesImg, 'empty-accessories-illustration');
export const EmptyProductsIllustration = makeIllustration(productsImg, 'empty-products-illustration');
export const EmptyFinanceIllustration = makeIllustration(financeImg, 'empty-finance-illustration');
export const EmptyWorksheetsIllustration = makeIllustration(worksheetsImg, 'empty-worksheets-illustration');
export const EmptyContentIllustration = makeIllustration(contentImg, 'empty-content-illustration');
