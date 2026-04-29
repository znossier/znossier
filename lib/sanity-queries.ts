import { getFeaturedProjects, type Project } from './projects';
import {
  getAboutContent,
  getContactContent,
  getServicesContent,
  type AboutContent,
  type ContactContent,
  type Service,
} from './site-content';

export async function getProjects(): Promise<Project[]> {
  return getFeaturedProjects();
}

export async function getServices(): Promise<Service[]> {
  return getServicesContent();
}

export async function getAbout(): Promise<AboutContent> {
  return getAboutContent();
}

export async function getContact(): Promise<ContactContent> {
  return getContactContent();
}
