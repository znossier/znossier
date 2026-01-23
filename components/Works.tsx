'use client';

import { mockProjects } from '@/lib/mock-data';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

function ProjectCard({ project, index }: { project: typeof mockProjects[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px', amount: 0.2 });
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const hasValidLink = project.link && project.link !== '#';
  const cardClassName = "group bg-foreground/5 rounded-lg overflow-hidden hover:bg-foreground/10 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-background block";

  const cardContent = (
    <>
        {/* Image on Top - with padding */}
        <div className="p-3 md:p-4">
          <div className="relative aspect-[4/3] bg-accent/10 overflow-hidden rounded-md">
            {project.image && !imageError ? (
              <>
                <Image
                  src={project.image}
                  alt={`${project.title} project preview`}
                  fill
                  className="object-cover"
                  loading="lazy"
                  onError={() => setImageError(true)}
                />
                {/* Hover Overlay - black with blurred description */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: isHovered ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-black/60 flex items-center justify-center"
                  aria-hidden="true"
                >
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-white text-sm md:text-base text-center px-6 backdrop-blur-sm"
                    >
                      {project.description}
                    </motion.div>
                  )}
                </motion.div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-accent/20 to-accent/10" aria-hidden="true">
                {project.emoji}
              </div>
            )}
          </div>
        </div>
        
        {/* Content Below Image */}
        <div className="px-4 md:px-5 pb-4 md:pb-5">
          <h4 className="text-lg md:text-xl font-semibold text-foreground mb-2">
            {project.title}
          </h4>
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2">
            {project.categories.map((category, idx) => (
              <span 
                key={idx} 
                className="text-xs text-foreground/60 bg-foreground/5 px-2 py-1 rounded"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
    </>
  );

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {hasValidLink ? (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className={cardClassName}
          data-project-card
          aria-label={`View project: ${project.title}`}
        >
          {cardContent}
        </a>
      ) : (
        <div
          className={cardClassName}
          data-project-card
          onClick={() => {
            if (project.link && project.link !== '#') {
              window.open(project.link, '_blank', 'noopener,noreferrer');
            }
          }}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && project.link && project.link !== '#') {
              e.preventDefault();
              window.open(project.link, '_blank', 'noopener,noreferrer');
            }
          }}
          role={project.link && project.link !== '#' ? 'button' : undefined}
          tabIndex={project.link && project.link !== '#' ? 0 : undefined}
          aria-label={project.link && project.link !== '#' ? `View project: ${project.title}` : undefined}
        >
          {cardContent}
        </div>
      )}
    </motion.article>
  );
}

export function Works() {
  const sectionRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    heroRef.current = document.getElementById('home') as HTMLElement;
  }, []);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start end', 'end start'],
  });

  // Works section moves up to cover hero - starts below viewport and scrolls up to cover
  const worksY = useTransform(scrollYProgress, [0, 1], ['100vh', '0vh']);

  return (
    <>
      {/* Spacer to prevent content jump when hero is fixed */}
      <div className="h-screen" aria-hidden="true" />
      <motion.section 
        ref={sectionRef} 
        id="works" 
        className="py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 relative z-20 bg-background"
        style={{ y: worksY }}
      >
      <div className="mx-auto max-w-7xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="mb-10 md:mb-12"
        >
          <div className="flex items-center gap-4 md:gap-6">
            {/* Horizontal line on left */}
            <div className="w-12 md:w-16 border-t border-border"></div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
              Selected Works
            </h2>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          {mockProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </motion.section>
    </>
  );
}
