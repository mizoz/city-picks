const sections = ['Cities', 'Events', 'Submissions', 'Venues', 'Promotions', 'Data Sources'];

export default function AdminHome() {
  return (
    <section>
      <p className="muted">Multi-city local discovery platform</p>
      <h2>Admin overview</h2>
      <p>Phase 1 shell only. Future phases connect these views to Supabase with city-scoped permissions and workflows.</p>
      <div className="card-grid">
        {sections.map((section) => <div className="card" key={section}><h3>{section}</h3><p className="muted">City-aware table placeholder.</p></div>)}
      </div>
    </section>
  );
}
