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

const days = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const quickSearches = ['swim', 'skate', 'art', 'dance', 'fitness', 'camp'];

function formatDate(value: string | null) {
  if (!value) return 'Date TBA';
  const date = new Date(`${value}T12:00:00`);
  return new Intl.DateTimeFormat('en-CA', { month: 'short', day: 'numeric' }).format(date);
}

function money(value: number | null) {
  if (value === null) return 'Price TBA';
  if (value === 0) return 'Free';
  return `$${value.toFixed(2)}`;
}

export default function ClassFinder() {
  const [age, setAge] = useState('8');
  const [maxPrice, setMaxPrice] = useState('100');
  const [day, setDay] = useState('');
  const [keyword, setKeyword] = useState('swim');
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (age) params.set('age', age);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (day) params.set('day', day);
    if (keyword) params.set('keyword', keyword);
    return params.toString();
  }, [age, maxPrice, day, keyword]);

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

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Live City of Calgary recreation data</p>
          <h1>YYC Class Finder</h1>
          <p className="lede">
            Find a city-run class without digging through hundreds of listings. Filter by age, budget, day, and activity.
          </p>
        </div>
        <form className="search-panel" onSubmit={onSubmit}>
          <label>
            Child or adult age
            <input min="0" max="99" type="number" value={age} onChange={(event) => setAge(event.target.value)} />
          </label>
          <label>
            Max price
            <input min="0" step="5" type="number" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} />
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
            Activity
            <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="swim, skate, camp..." />
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

      <section className="results-band">
        <div className="results-head">
          <div>
            <p className="eyebrow">Best matches</p>
            <h2>{loading ? 'Checking the city API...' : `${data?.programs.length ?? 0} active programs found`}</h2>
          </div>
          <a href="https://data.calgary.ca/Recreation-and-Culture/Recreation-Program-Listings/q9hh-gfbx" target="_blank" rel="noreferrer">
            City dataset
          </a>
        </div>

        {error ? <p className="notice">{error}</p> : null}

        <div className="program-grid" aria-live="polite">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => <div className="program-card skeleton" key={index} />)
            : data?.programs.map((program) => (
                <article className="program-card" key={`${program.id}-${program.date}-${program.startTime}`}>
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
                    <span>
                      Ages {program.minAge ?? '?'}-{program.maxAge ?? '?'}
                    </span>
                    <a href={program.sourceUrl} target="_blank" rel="noreferrer">
                      verify
                    </a>
                  </div>
                </article>
              ))}
        </div>

        {!loading && data?.programs.length === 0 ? (
          <p className="notice">No matches. Try a higher budget, clear the day, or search a broader activity.</p>
        ) : null}
      </section>
    </main>
  );
}
