import { defineArrayMember, defineField, defineType } from 'sanity';

const experienceRole = defineArrayMember({
  name: 'experienceRole',
  title: 'Role',
  type: 'object',
  fields: [
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'period',
      title: 'Period',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'bullets',
      title: 'Bullets',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
  ],
  preview: {
    select: {
      title: 'role',
      subtitle: 'period',
    },
  },
});

const aboutSchema = defineType({
  name: 'about',
  title: 'About',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 6,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bioShort',
      title: 'Short bio',
      type: 'text',
      rows: 4,
      description: 'Used in the About card beside the portrait.',
    }),
    defineField({
      name: 'heroHeadline',
      title: 'Hero headline',
      type: 'string',
    }),
    defineField({
      name: 'heroSubhead',
      title: 'Hero subhead',
      type: 'string',
    }),
    defineField({
      name: 'heroSupport',
      title: 'Hero support',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Profile image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'experience',
      title: 'Experience',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'experienceEntry',
          title: 'Experience entry',
          type: 'object',
          fields: [
            defineField({
              name: 'entryType',
              title: 'Entry type',
              type: 'string',
              initialValue: 'single',
              options: {
                layout: 'radio',
                list: [
                  { title: 'Single role', value: 'single' },
                  { title: 'Grouped company roles', value: 'group' },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'company',
              title: 'Company',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'logo',
              title: 'Logo',
              type: 'image',
              options: { hotspot: true },
            }),
            defineField({
              name: 'role',
              title: 'Role',
              type: 'string',
              hidden: ({ parent }) => parent?.entryType !== 'single',
            }),
            defineField({
              name: 'period',
              title: 'Period',
              type: 'string',
              hidden: ({ parent }) => parent?.entryType !== 'single',
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 4,
              hidden: ({ parent }) => parent?.entryType !== 'single',
            }),
            defineField({
              name: 'bullets',
              title: 'Bullets',
              type: 'array',
              of: [defineArrayMember({ type: 'string' })],
              hidden: ({ parent }) => parent?.entryType !== 'single',
            }),
            defineField({
              name: 'roles',
              title: 'Roles',
              type: 'array',
              of: [experienceRole],
              hidden: ({ parent }) => parent?.entryType !== 'group',
            }),
          ],
          preview: {
            select: {
              entryType: 'entryType',
              company: 'company',
              role: 'role',
              media: 'logo',
            },
            prepare({ entryType, company, role, media }) {
              return {
                title: company || 'Experience entry',
                subtitle:
                  entryType === 'group'
                    ? 'Grouped company roles'
                    : role || 'Single role',
                media,
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'title',
      media: 'image',
    },
  },
});

export default aboutSchema;
