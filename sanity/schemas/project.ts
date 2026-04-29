import { defineArrayMember, defineField, defineType } from 'sanity';

const projectMonthOptions = [
  { title: 'January', value: 'Jan' },
  { title: 'February', value: 'Feb' },
  { title: 'March', value: 'Mar' },
  { title: 'April', value: 'Apr' },
  { title: 'May', value: 'May' },
  { title: 'June', value: 'Jun' },
  { title: 'July', value: 'Jul' },
  { title: 'August', value: 'Aug' },
  { title: 'September', value: 'Sep' },
  { title: 'October', value: 'Oct' },
  { title: 'November', value: 'Nov' },
  { title: 'December', value: 'Dec' },
];

const projectSectionHeading = defineArrayMember({
  name: 'projectSectionHeading',
  title: 'Heading',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'text',
    },
    prepare({ title }) {
      return {
        title: title || 'Heading',
        subtitle: 'Heading block',
      };
    },
  },
});

const projectSectionParagraph = defineArrayMember({
  name: 'projectSectionParagraph',
  title: 'Paragraph',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      rows: 5,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'text',
    },
    prepare({ title }) {
      return {
        title: title || 'Paragraph',
        subtitle: 'Paragraph block',
      };
    },
  },
});

const projectSectionImage = defineArrayMember({
  name: 'projectSectionImage',
  title: 'Image',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'alt',
      media: 'image',
    },
    prepare({ title, media }) {
      return {
        title: title || 'Image',
        subtitle: 'Image block',
        media,
      };
    },
  },
});

const projectSectionTwoImages = defineArrayMember({
  name: 'projectSectionTwoImages',
  title: 'Two Images',
  type: 'object',
  fields: [
    defineField({
      name: 'leftImage',
      title: 'Left image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'leftAlt',
      title: 'Left alt text',
      type: 'string',
    }),
    defineField({
      name: 'rightImage',
      title: 'Right image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rightAlt',
      title: 'Right alt text',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      media: 'leftImage',
    },
    prepare({ media }) {
      return {
        title: 'Two images',
        subtitle: 'Two-up image block',
        media,
      };
    },
  },
});

const projectSchema = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'emoji',
      title: 'Emoji',
      type: 'string',
      description: 'Optional emoji icon for the project card.',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'projectDate',
      title: 'Project date',
      type: 'object',
      fields: [
        defineField({
          name: 'month',
          title: 'Month',
          type: 'string',
          options: {
            list: projectMonthOptions,
          },
        }),
        defineField({
          name: 'year',
          title: 'Year',
          type: 'number',
          validation: (Rule) =>
            Rule.integer().min(1900).max(2100),
        }),
      ],
      description: 'Month and year only.',
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
    }),
    defineField({
      name: 'service',
      title: 'Service',
      type: 'string',
    }),
    defineField({
      name: 'linkMode',
      title: 'Card behavior',
      type: 'string',
      initialValue: 'internal',
      options: {
        layout: 'radio',
        list: [
          { title: 'Internal case study', value: 'internal' },
          { title: 'External link', value: 'external' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      hidden: ({ parent }) => parent?.linkMode !== 'external',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { linkMode?: string } | undefined;
          if (parent?.linkMode === 'external' && !value) {
            return 'External URL is required when card behavior is set to External link.';
          }

          return true;
        }),
    }),
    defineField({
      name: 'published',
      title: 'Published case study',
      type: 'boolean',
      initialValue: false,
      description: 'Enables the public /works/[slug] page for internal case studies.',
      hidden: ({ parent }) => parent?.linkMode !== 'internal',
    }),
    defineField({
      name: 'cardImage',
      title: 'Card image',
      type: 'image',
      options: { hotspot: true },
      description: 'Used on the homepage project card.',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      options: { hotspot: true },
      description: 'Used at the top of the case study page.',
    }),
    defineField({
      name: 'video',
      title: 'Video URL',
      type: 'url',
      description: 'Optional video URL for the project.',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show this project in Selected Works.',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Lower numbers appear first.',
      initialValue: 0,
    }),
    defineField({
      name: 'nextProject',
      title: 'Next project',
      type: 'reference',
      to: [{ type: 'project' }],
      hidden: ({ parent }) => parent?.linkMode !== 'internal',
      description: 'Optional next-work card shown at the end of the case study.',
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      hidden: ({ parent }) => parent?.linkMode !== 'internal',
      of: [
        defineArrayMember({
          name: 'projectSection',
          title: 'Section',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Section title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'sectionId',
              title: 'Section anchor',
              type: 'string',
              description: 'Optional stable anchor id used in the page markup.',
            }),
            defineField({
              name: 'content',
              title: 'Fallback paragraph',
              type: 'text',
              rows: 4,
              description: 'Used only when the rich blocks array is empty.',
            }),
            defineField({
              name: 'blocks',
              title: 'Blocks',
              type: 'array',
              of: [
                projectSectionHeading,
                projectSectionParagraph,
                projectSectionImage,
                projectSectionTwoImages,
              ],
            }),
          ],
          preview: {
            select: {
              title: 'title',
            },
            prepare({ title }) {
              return {
                title: title || 'Section',
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'linkMode',
      emoji: 'emoji',
      media: 'cardImage',
    },
    prepare({ title, subtitle, emoji, media }) {
      return {
        title: emoji ? `${emoji} ${title}` : title,
        subtitle:
          subtitle === 'external' ? 'External link project' : 'Internal case study',
        media,
      };
    },
  },
});

export default projectSchema;
