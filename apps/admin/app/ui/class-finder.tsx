'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

type Program = {
  id: string;
  title: string;
  section: string;
  venue: string;
  location: string;
  day: string;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  scheduleStart: string | null;
  scheduleEnd: string | null;
  price: number | null;
  minAge: number | null;
  maxAge: number | null;
  summary: string;
  sourceUrl: string;
};

type ApiResponse = {
  source: string;
  updated: string;
  programs: Program[];
  error?: string;
};

type Preset = {
  label: string;
  note: string;
  age: string;
  maxPrice: string;
  day: string;
  keyword: string;
};

const days = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const quickSearches = ['swim', 'skate', 'art', 'dance', 'fitness', 'camp', 'yoga', 'pickleball'];
const savedKey = 'yyc-class-finder-saved';

const presets: Preset[] = [
  { label: 'Weekend kids', note: 'Low-friction family classes', age: '8', maxPrice: '120', day: 'Saturday', keyword: 'swim' },
  { label: 'Free today-ish', note: 'City programs at $0', age: '', maxPrice: '0', day: '', keyword: '' },
  { label: 'Adult reset', note: 'Movement after work', age: '30', maxPrice: '160', day: '', keyword: 'fitness' },
  { label: 'Teen active', note: 'Affordable after-school ideas', age: '14', maxPrice: '90', day: '', keyword: 'skate' }
];

function formatDate(value: string | null) {
  if (!value) return 'Date TBA';
  const date = new Date(`${value}T12:00:00`);
  return new Intl.DateTimeFormat('en-CA', { month: 'short', day: 'numeric' }).format(date);
}

function formatDateLong(value: string | null) {
  if (!value) return 'Date TBA';
  const date = new Date(`${value}T12:00:00`);
  return new Intl.DateTimeFormat('en-CA', { weekday: 'short', month: 'short', day: 'numeric' }).format(date);
}

function money(value: number | null) {
  if (value === null) return 'Price TBA';
  if (value === 0) return 'Free';
  return `$${value.toFixed(2)}`;
}

function minutesFromTime(value: string | null) {
  if (!value) return 0;
  const match = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 0;
  const [, hourRaw, minuteRaw, meridian] = match;
  let hour = Number(hourRaw);
  const minute = Number(minuteRaw);
  if (meridian.toUpperCase() === 'PM' && hour !== 12) hour += 12;
  if (meridian.toUpperCase() === 'AM' && hour === 12) hour = 0;
  return hour * 60 + minute;
}

function dateTimeStamp(date: string | null, time: string | null) {
  if (!date) return '';
  const [year, month, day] = date.split('-');
  const totalMinutes = minutesFromTime(time);
  const hour = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
  const minute = String(totalMinutes % 60).padStart(2, '0');
  return `${year}${month}${day}T${hour}${minute}00`;
}

function calendarHref(program: Program) {
  const start = dateTimeStamp(program.date, program.startTime);
  const end = dateTimeStamp(program.date, program.endTime || program.startTime);
  const body = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `SUMMARY:${program.title}`,
    `DTSTART:${start}`,
    `DTEND:${end || start}`,
    `LOCATION:${program.location}`,
    `DESCRIPTION:${program.summary || 'City of Calgary recreation program'} ${program.sourceUrl}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\n');
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(body)}`;
}

function mapsHref(program: Program) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${program.location} Calgary`)}`;
}

function normalizeProgramKey(program: Program) {
  return `${program.id}-${program.date}-${program.startTime}`;
}

export default function ClassFinder() {
  const [age, setAge] = useState('8');
  const [maxPrice, setMaxPrice] = useState('100');
  const [day, setDay] = useState('');
  const [keyword, setKeyword] = useState('swim');
  const [sort, setSort] = useState('soonest');
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const existing = window.localStorage.getItem(savedKey);
      return existing ? (JSON.parse(existing) as string[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem(savedKey, JSON.stringify(saved));
  }, [saved]);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (age) params.set('age', age);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (day) params.set('day', day);
    if (keyword) params.set('keyword', keyword);
    return params.toString();
  }, [age, maxPrice, day, keyword]);

  const programs = useMemo(() => {
    const items = [...(data?.programs ?? [])];
    if (sort === 'cheapest') return items.sort((a, b) => (a.price ?? 99999) - (b.price ?? 99999));
    if (sort === 'saved') return items.sort((a, b) => Number(saved.includes(normalizeProgramKey(b))) - Number(saved.includes(normalizeProgramKey(a))));
    return items.sort((a, b) => `${a.date ?? ''}${a.startTime ?? ''}`.localeCompare(`${b.date ?? ''}${b.startTime ?? ''}`));
  }, [data?.programs, saved, sort]);

  const stats = useMemo(() => {
    const venues = new Set(programs.map((program) => program.venue));
    const free = programs.filter((program) => program.price === 0).length;
    const savedVisible = programs.filter((program) => saved.includes(normalizeProgramKey(program))).length;
    return {
      venues: venues.size,
      free,
      savedVisible,
      next: programs[0]?.date ? formatDateLong(programs[0].date) : 'No match yet'
    };
  }, [programs, saved]);

  async function loadPrograms() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/programs?${query}`);
      const payload = (await response.json()) as ApiResponse;
      if (!response.ok || payload.error) throw new Error(payload.error ?? 'Program search failed');
      setData(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Program search failed');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPrograms();
  }, [query]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    loadPrograms();
  }

  function applyPreset(preset: Preset) {
    setAge(preset.age);
    setMaxPrice(preset.maxPrice);
    setDay(preset.day);
    setKeyword(preset.keyword);
  }

  function toggleSaved(program: Program) {
    const key = normalizeProgramKey(program);
    setSaved((current) => (current.includes(key) ? current.filter((item) => item !== key) : [...current, key]));
  }

  return (
    <main>
      <header className="site-header">
        <a href="/" className="brand">
          <span>YYC</span>
          <strong>Class Finder</strong>
        </a>
        <nav aria-label="Page sections">
          <a href="#search">Search</a>
          <a href="#results">Results</a>
          <a href="https://github.com/mizoz/city-picks" target="_blank" rel="noreferrer">GitHub</a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">City recreation, filtered for real life</p>
          <h1>Find the Calgary class worth booking.</h1>
          <p className="lede">
            Search live City of Calgary program listings by age, price, day, and activity. Save your shortlist, open maps, and add promising classes to your calendar.
          </p>
          <div className="hero-stats" aria-label="Live search summary">
            <div><strong>{loading ? '--' : programs.length}</strong><span>matches</span></div>
            <div><strong>{loading ? '--' : stats.venues}</strong><span>venues</span></div>
            <div><strong>{loading ? '--' : stats.free}</strong><span>free</span></div>
          </div>
        </div>

        <form className="search-panel" id="search" onSubmit={onSubmit}>
          <div className="panel-head">
            <div>
              <p className="eyebrow">Smart filters</p>
              <h2>Start with the constraints.</h2>
            </div>
            <span className="live-pill">Live API</span>
          </div>
          <div className="field-grid">
            <label>
              Age
              <input min="0" max="99" type="number" value={age} onChange={(event) => setAge(event.target.value)} placeholder="Any" />
            </label>
            <label>
              Max price
              <input min="0" step="5" type="number" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} placeholder="Any" />
            </label>
            <label>
              Day
              <select value={day} onChange={(event) => setDay(event.target.value)}>
                {days.map((item) => (
                  <option key={item || 'Any'} value={item}>
                    {item || 'Any day'}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Sort
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="soonest">Soonest first</option>
                <option value="cheapest">Cheapest first</option>
                <option value="saved">Saved first</option>
              </select>
            </label>
          </div>
          <label>
            Activity, venue, or category
            <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="swim, skate, camp, art..." />
          </label>
          <div className="quick-row">
            {quickSearches.map((item) => (
              <button type="button" key={item} onClick={() => setKeyword(item)} className={keyword === item ? 'active' : ''}>
                {item}
              </button>
            ))}
          </div>
        </form>
      </section>

      <section className="preset-band" aria-label="Search presets">
        {presets.map((preset) => (
          <button className="preset-card" type="button" key={preset.label} onClick={() => applyPreset(preset)}>
            <strong>{preset.label}</strong>
            <span>{preset.note}</span>
          </button>
        ))}
      </section>

      <section className="results-band" id="results">
        <aside className="insight-panel">
          <p className="eyebrow">Plan snapshot</p>
          <h2>{loading ? 'Reading the city feed' : stats.next}</h2>
          <dl>
            <div><dt>Visible venues</dt><dd>{stats.venues}</dd></div>
            <div><dt>Free options</dt><dd>{stats.free}</dd></div>
            <div><dt>Saved here</dt><dd>{stats.savedVisible}</dd></div>
          </dl>
          <p>
            Source: City of Calgary Open Data. Listings refresh through this app every 15 minutes.
          </p>
          <a href="https://data.calgary.ca/Recreation-and-Culture/Recreation-Program-Listings/q9hh-gfbx" target="_blank" rel="noreferrer">
            Audit source data
          </a>
        </aside>

        <div className="results-main">
          <div className="results-head">
            <div>
              <p className="eyebrow">Best matches</p>
              <h2>{loading ? 'Checking live listings...' : `${programs.length} active programs`}</h2>
            </div>
            <button type="button" className="ghost-button" onClick={() => { setAge(''); setMaxPrice(''); setDay(''); setKeyword(''); }}>
              Reset filters
            </button>
          </div>

          {error ? <p className="notice">{error}</p> : null}

          <div className="program-grid" aria-live="polite">
            {loading
              ? Array.from({ length: 6 }).map((_, index) => <div className="program-card skeleton" key={index} />)
              : programs.map((program) => {
                  const key = normalizeProgramKey(program);
                  const isSaved = saved.includes(key);
                  return (
                    <article className="program-card" key={key}>
                      <div className="card-topline">
                        <span>{program.section}</span>
                        <strong>{money(program.price)}</strong>
                      </div>
                      <h3>{program.title}</h3>
                      <p className="venue">{program.venue}</p>
                      <div className="details">
                        <span>{program.day}</span>
                        <span>{formatDate(program.date)}</span>
                        <span>
                          {program.startTime ?? 'Time TBA'}
                          {program.endTime ? `-${program.endTime}` : ''}
                        </span>
                      </div>
                      <p>{program.summary || 'No description supplied in the city listing.'}</p>
                      <div className="card-footer">
                        <span>Ages {program.minAge ?? '?'}-{program.maxAge ?? '?'}</span>
                        <div className="action-row">
                          <button type="button" onClick={() => toggleSaved(program)} className={isSaved ? 'saved-button active' : 'saved-button'}>
                            {isSaved ? 'Saved' : 'Save'}
                          </button>
                          <a href={mapsHref(program)} target="_blank" rel="noreferrer">Map</a>
                          <a href={calendarHref(program)} download={`${program.title}.ics`}>Calendar</a>
                        </div>
                      </div>
                    </article>
                  );
                })}
          </div>

          {!loading && programs.length === 0 ? (
            <p className="notice">No matches. Try a higher budget, clear the day, or search a broader activity.</p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
