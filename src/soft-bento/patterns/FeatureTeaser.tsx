import { BentoIcon } from '../primitives/Icon';
import type { ReactNode } from 'react';
import { Card, Chip, Typography } from '@heroui/react';
import { Sparkles, type LucideIcon } from 'lucide-react';
import { PanelTitle, type PanelTitleTone } from './PanelTitle';

export interface FeatureTeaserHighlight {
  key?: string;
  label: string;
  icon: LucideIcon;
}

export interface FeatureTeaserProps {
  id?: string;
  ariaLabel: string;
  className?: string;
  title: string;
  titleIcon?: LucideIcon;
  titleTone?: PanelTitleTone;
  statusBadge?: ReactNode;
  stageBadge?: ReactNode;
  heading: ReactNode;
  description: ReactNode;
  illustration?: ReactNode;
  highlights?: FeatureTeaserHighlight[];
  highlightsAriaLabel?: string;
}

export function FeatureTeaser({
  id,
  ariaLabel,
  className,
  title,
  titleIcon,
  titleTone = 'blue',
  statusBadge,
  stageBadge,
  heading,
  description,
  illustration,
  highlights,
  highlightsAriaLabel = 'Các tính năng dự kiến',
}: FeatureTeaserProps) {
  const renderedStatusBadge =
    typeof statusBadge === 'string' ? (
      <Chip size="sm" variant="soft" className="feature-teaser-status">
        {statusBadge}
      </Chip>
    ) : (
      statusBadge
    );

  return (
    <Card
      id={id}
      role="region"
      className={`panel feature-teaser-panel ${className ?? ''}`.trim()}
      aria-label={ariaLabel}
    >
      <Card.Header className="panel-heading">
        <PanelTitle icon={titleIcon} tone={titleTone} title={title} />
        {renderedStatusBadge}
      </Card.Header>
      <Card.Content className="panel-body">
        <div className="feature-teaser">
          <div className="feature-teaser-stage">
            <div className="feature-teaser-media" aria-hidden="true">
              {illustration ?? <BentoIcon icon={Sparkles} size={32} />}
            </div>
            <div className="feature-teaser-content">
              {stageBadge && <span className="feature-teaser-beta">{stageBadge}</span>}
              <Typography
                type="h3"
                render={props => <h3 {...props} />}
                className="feature-teaser-heading"
              >
                {heading}
              </Typography>
              <Typography
                type="body-xs"
                render={props => <p {...props} />}
                className="feature-teaser-desc"
              >
                {description}
              </Typography>
            </div>
          </div>
          {highlights && highlights.length > 0 && (
            <div className="feature-teaser-pills" aria-label={highlightsAriaLabel}>
              {highlights.slice(0, 3).map((item, idx) => {
                const ItemIcon = item.icon;
                return (
                  <span key={item.key ?? idx} className="feature-teaser-pill">
                    <BentoIcon icon={ItemIcon} size={12} />
                    <span>{item.label}</span>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </Card.Content>
    </Card>
  );
}
