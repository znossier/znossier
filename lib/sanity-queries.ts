import { client } from './sanity';
import { mockProjects, mockServices, mockAbout, mockContact } from './mock-data';
import type { Project, Service } from './mock-data';

const projectFields = `
  _id,
  title,
  emoji,
  description,
  categories,
  "image": image.asset->url,
  video,
  link,
  featured,
  order
`;

const serviceFields = `
  _id,
  title,
  description,
  skills,
  order
`;

const aboutFields = `
  _id,
  name,
  title,
  location,
  bio,
  tagline,
  stats,
  skills,
  "image": image.asset->url
`;

const contactFields = `
  _id,
  email,
  socialLinks
`;

export async function getProjects(): Promise<Project[]> {
  if (!client) {
    return mockProjects;
  }

  try {
    const projects = await client.fetch(
      `*[_type == "project" && featured == true] | order(order asc) {${projectFields}}`
    );
    return projects.length > 0 ? projects : mockProjects;
  } catch (error) {
    console.error('Error fetching projects from Sanity:', error);
    return mockProjects;
  }
}

export async function getServices(): Promise<Service[]> {
  if (!client) {
    return mockServices;
  }

  try {
    const services = await client.fetch(
      `*[_type == "service"] | order(order asc) {${serviceFields}}`
    );
    return services.length > 0 ? services : mockServices;
  } catch (error) {
    console.error('Error fetching services from Sanity:', error);
    return mockServices;
  }
}

export async function getAbout() {
  if (!client) {
    return mockAbout;
  }

  try {
    const about = await client.fetch(
      `*[_type == "about"][0] {${aboutFields}}`
    );
    return about || mockAbout;
  } catch (error) {
    console.error('Error fetching about from Sanity:', error);
    return mockAbout;
  }
}

export async function getContact() {
  if (!client) {
    return mockContact;
  }

  try {
    const contact = await client.fetch(
      `*[_type == "contact"][0] {${contactFields}}`
    );
    return contact || mockContact;
  } catch (error) {
    console.error('Error fetching contact from Sanity:', error);
    return mockContact;
  }
}
