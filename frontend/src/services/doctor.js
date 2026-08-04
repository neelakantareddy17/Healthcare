import { sleep } from '../utils/helpers';

export const MOCK_DOCTORS = [
  { id: 1, name: 'Dr. Priya Nair', specialty: 'Cardiologist', experience: 12, rating: 4.9, reviews: 284, fee: 800, available: true, hospital: 'Apollo Hospital', city: 'Chennai', avatar: null, about: 'Expert in interventional cardiology with 12+ years of experience.' },
  { id: 2, name: 'Dr. Rahul Mehta', specialty: 'Neurologist', experience: 9, rating: 4.7, reviews: 196, fee: 1000, available: true, hospital: 'Fortis Hospital', city: 'Mumbai', avatar: null, about: 'Specializes in epilepsy, stroke, and neuromuscular disorders.' },
  { id: 3, name: 'Dr. Anjali Singh', specialty: 'Dermatologist', experience: 7, rating: 4.8, reviews: 312, fee: 600, available: false, hospital: 'Max Healthcare', city: 'Delhi', avatar: null, about: 'Expert in cosmetic and clinical dermatology.' },
  { id: 4, name: 'Dr. Suresh Kumar', specialty: 'Orthopedic', experience: 15, rating: 4.6, reviews: 421, fee: 900, available: true, hospital: 'Manipal Hospital', city: 'Bangalore', avatar: null, about: 'Joint replacement and sports injury specialist.' },
  { id: 5, name: 'Dr. Kavitha Reddy', specialty: 'Pediatrician', experience: 11, rating: 4.9, reviews: 538, fee: 700, available: true, hospital: 'Rainbow Hospital', city: 'Hyderabad', avatar: null, about: 'Passionate about child health and development.' },
  { id: 6, name: 'Dr. Amit Patel', specialty: 'General Physician', experience: 8, rating: 4.5, reviews: 267, fee: 500, available: true, hospital: 'Narayana Health', city: 'Ahmedabad', avatar: null, about: 'Primary care specialist with expertise in internal medicine.' },
];

export const getDoctors = async (filters = {}) => {
  await sleep(600);
  let docs = [...MOCK_DOCTORS];
  if (filters.specialty) docs = docs.filter((d) => d.specialty === filters.specialty);
  if (filters.city) docs = docs.filter((d) => d.city.toLowerCase().includes(filters.city.toLowerCase()));
  if (filters.search) docs = docs.filter((d) => d.name.toLowerCase().includes(filters.search.toLowerCase()) || d.specialty.toLowerCase().includes(filters.search.toLowerCase()));
  return docs;
};

export const getDoctorById = async (id) => {
  await sleep(400);
  return MOCK_DOCTORS.find((d) => d.id === Number(id)) || null;
};
