import { useEffect, useState } from 'react';
import PatientLayout from '../../layouts/PatientLayout';
import DoctorCard from '../../components/doctor/DoctorCard';
import SearchBar from '../../components/common/SearchBar';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { getDoctors } from '../../services/doctor';
import { SPECIALTIES } from '../../utils/constants';
import './FindDoctor.css';

function FindDoctor() {
  const [doctors, setDoctors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [activeSpec, setActiveSpec] = useState('All');
  const [loading, setLoading] = useState(true);

  const specs = ['All', ...SPECIALTIES.slice(0, 6)];

  useEffect(() => {
    getDoctors().then((d) => { setDoctors(d); setFiltered(d); setLoading(false); });
  }, []);

  useEffect(() => {
    let result = [...doctors];
    if (search) result = result.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase()));
    if (activeSpec !== 'All') result = result.filter((d) => d.specialty === activeSpec);
    setFiltered(result);
  }, [search, activeSpec, doctors]);

  return (
    <PatientLayout>
      <h2 className="page-title">Find a Doctor</h2>
      <SearchBar placeholder="Search by name or specialty..." value={search} onChange={(e) => setSearch(e.target.value)} />

      <div className="spec-chips">
        {specs.map((s) => (
          <button key={s} className={`spec-chip ${activeSpec === s ? 'spec-chip--active' : ''}`} onClick={() => setActiveSpec(s)}>
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : filtered.length === 0 ? (
        <EmptyState icon="🩺" title="No doctors found" description="Try different filters or search terms" />
      ) : (
        filtered.map((doc) => <DoctorCard key={doc.id} doctor={doc} />)
      )}
    </PatientLayout>
  );
}

export default FindDoctor;
