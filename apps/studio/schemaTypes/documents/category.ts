import { defineField, defineType } from "sanity";

// what: created a new schema for categories
// why: This schema defines a category document type with fields for title, slug, description, and SEO metadata.
export const category = defineType({
  name: 'category',
  title: 'Categories',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The display name of the category (e.g., "Web Development").',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'A URL-friendly version of the title, automatically generated from the title.',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'A short summary describing what this category is about.',
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title Override',
      type: 'string',
      description: 'Optional. Custom title for SEO purposes, overrides the default.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description Override',
      type: 'text',
      description: 'Optional. Custom description for SEO purposes, overrides the default.',
    }),
  ],
});
