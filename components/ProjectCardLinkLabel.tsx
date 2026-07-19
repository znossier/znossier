import { ExternalLink, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

type ProjectCardLinkLabelProps = {
  variant: 'external' | 'case-study';
  className?: string;
};

/** Figma Project Type 398:7046 — External Link (text → icon) / Case Study (icon → text) */
const variants = {
  external: {
    label: 'External Link',
    Icon: ExternalLink,
    iconFirst: false,
  },
  'case-study': {
    label: 'Case Study',
    Icon: FolderOpen,
    iconFirst: true,
  },
} as const;

export function ProjectCardLinkLabel({ variant, className }: ProjectCardLinkLabelProps) {
  const { label, Icon, iconFirst } = variants[variant];

  const icon = (
    <Icon className="project-card-link-icon h-3 w-3 shrink-0" strokeWidth={1.5} aria-hidden />
  );

  return (
    <span
      className={cn(
        'project-card-open project-type inline-flex h-6 shrink-0 items-center gap-2 whitespace-nowrap',
        className
      )}
    >
      {iconFirst ? (
        <>
          {icon}
          {label}
        </>
      ) : (
        <>
          {label}
          {icon}
        </>
      )}
    </span>
  );
}
