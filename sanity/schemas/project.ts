export default {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'emoji',
      title: 'Emoji',
      type: 'string',
      description: 'Emoji icon for the project',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'video',
      title: 'Video URL',
      type: 'url',
      description: 'Optional video URL for the project',
    },
    {
      name: 'link',
      title: 'Project Link',
      type: 'url',
      description: 'Link to view the project',
    },
    {
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show this project in featured works',
      initialValue: false,
    },
    {
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Display order (lower numbers appear first)',
      initialValue: 0,
    },
  ],
  preview: {
    select: {
      title: 'title',
      emoji: 'emoji',
      media: 'image',
    },
    prepare({ title, emoji, media }: any) {
      return {
        title: emoji ? `${emoji} ${title}` : title,
        media,
      };
    },
  },
};
