import { ExternalLink, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

type ProjectCardLinkLabelProps = {
  variant: 'external' | 'case-study';
  className?: string;
};

const labelCopy = {
  external: 'External Link',
  'case-study': 'Case Study',
} as const;

export function ProjectCardLinkLabel({ variant, className }: ProjectCardLinkLabelProps) {
  const Icon = variant === 'external' ? ExternalLink : FileText;

  return (
    <span
      className={cn(
        'project-card-open type-meta inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap pt-1 text-right',
        className
      )}
    >
      <Icon className="project-card-link-icon h-3 w-3 shrink-0" strokeWidth={1.75} aria-hidden />
      {labelCopy[variant]}
    </span>
  );
}
