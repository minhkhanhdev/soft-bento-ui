import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { BentoIcon } from '../soft-bento';

interface MediaImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  compact?: boolean;
  kind?: 'product' | 'qr';
  readyCaption?: string;
  loading?: 'lazy' | 'eager';
}

export function MediaImage(props: MediaImageProps) {
  return <ImageContent key={props.src || 'empty'} {...props} />;
}

function ImageContent({ src, alt, className = '', compact = false, kind = 'product', readyCaption, loading }: MediaImageProps) {
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const missing = !src || failed;
  const message = kind === 'qr'
    ? (src ? 'Không tải được mã QR' : 'Chưa có mã QR thanh toán')
    : 'Chưa có ảnh sản phẩm';
  return (
    <div className={`media-image ${className}`}>
      {missing ? (
        <div className={`media-fallback ${compact ? 'is-compact' : ''}`} role="img" aria-label={`${message}: ${alt}`}>
          <BentoIcon icon={ImageOff} size={compact ? 18 : 28} />
          {!compact && <span>{message}</span>}
        </div>
      ) : (
        <img src={src} alt={alt} loading={loading} onLoad={() => setReady(true)} onError={() => { setFailed(true); setReady(false); }} />
      )}
      {ready && !missing && readyCaption && <p className="media-caption">{readyCaption}</p>}
    </div>
  );
}
