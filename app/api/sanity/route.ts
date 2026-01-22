import { getProjects, getServices, getAbout, getContact } from '@/lib/sanity-queries';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    switch (type) {
      case 'projects':
        return NextResponse.json(await getProjects());
      case 'services':
        return NextResponse.json(await getServices());
      case 'about':
        return NextResponse.json(await getAbout());
      case 'contact':
        return NextResponse.json(await getContact());
      default:
        return NextResponse.json(
          { error: 'Invalid type parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
