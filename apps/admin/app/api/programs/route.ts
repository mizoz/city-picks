import { NextResponse } from 'next/server';

const SOCRATA_ENDPOINT = 'https://data.calgary.ca/resource/q9hh-gfbx.json';

type CalgaryProgramRow = {
  course_id?: string;
  course_name?: string;
  brochure_section?: string;
  venue_name?: string;
  location_name?: string;
  class_date_day?: string;
  class_date?: string;
  course_start_time?: string;
  course_end_time?: string;
  course_schedule_start_date?: string;
  course_schedule_end_date?: string;
  course_default_price?: string;
  course_min_age_allowed?: string;
  course_max_age_allowed?: string;
  course_status?: string;
  course_type_web_description?: string;
};

function cleanText(value?: string) {
  return (value ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function toNumber(value?: string) {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const age = toNumber(searchParams.get('age') ?? undefined);
  const maxPrice = toNumber(searchParams.get('maxPrice') ?? undefined);
  const keyword = searchParams.get('keyword')?.trim();
  const day = searchParams.get('day')?.trim();
  const today = new Date().toISOString().slice(0, 10);

  const where: string[] = ["course_status = 'Active'", `class_date >= '${today}'`];

  if (age !== null) {
    where.push(`course_min_age_allowed <= ${age}`);
    where.push(`course_max_age_allowed >= ${age}`);
  }

  if (maxPrice !== null) {
    where.push(`course_default_price <= ${maxPrice}`);
  }

  if (day) {
    where.push(`upper(class_date_day) = '${day.toUpperCase().replace(/'/g, "''")}'`);
  }

  if (keyword) {
    const safeKeyword = keyword.toLowerCase().replace(/'/g, "''");
    where.push(`lower(course_name) like '%${safeKeyword}%'`);
  }

  const url = new URL(SOCRATA_ENDPOINT);
  url.searchParams.set('$limit', '60');
  url.searchParams.set('$order', 'class_date ASC, course_default_price ASC');
  url.searchParams.set('$where', where.join(' AND '));

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 900 }
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'City of Calgary API request failed' }, { status: response.status });
    }

    const rows = (await response.json()) as CalgaryProgramRow[];
    const programs = rows.map((row) => ({
      id: row.course_id ?? `${row.course_name}-${row.class_date}`,
      title: row.course_name ?? 'Untitled program',
      section: row.brochure_section ?? 'Recreation',
      venue: row.venue_name ?? row.location_name ?? 'City facility',
      location: row.location_name ?? row.venue_name ?? 'City facility',
      day: row.class_date_day ?? 'TBD',
      date: row.class_date ?? row.course_schedule_start_date ?? null,
      startTime: row.course_start_time ?? null,
      endTime: row.course_end_time ?? null,
      scheduleStart: row.course_schedule_start_date ?? null,
      scheduleEnd: row.course_schedule_end_date ?? null,
      price: toNumber(row.course_default_price),
      minAge: toNumber(row.course_min_age_allowed),
      maxAge: toNumber(row.course_max_age_allowed),
      summary: cleanText(row.course_type_web_description).slice(0, 220),
      sourceUrl: 'https://data.calgary.ca/Recreation-and-Culture/Recreation-Program-Listings/q9hh-gfbx'
    }));

    return NextResponse.json({
      source: 'City of Calgary Open Data - Recreation Program Listings',
      updated: new Date().toISOString(),
      programs
    });
  } catch {
    return NextResponse.json({ error: 'Could not reach City of Calgary API' }, { status: 502 });
  }
}
