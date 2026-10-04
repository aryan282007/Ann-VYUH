import { useState, useEffect } from 'react';
import api from '../../api/api';

export default function Farmers() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFarmers() {
      try {
        const { data } = await api.get('/farmers');
        setFarmers(data);
      } catch (err) {
        console.error('Failed to fetch farmers', err);
      } finally {
        setLoading(false);
      }
    }
    fetchFarmers();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-primary-dark">किसान KYC समीक्षा (Farmer KYC Review)</h2>
      
      <div className="bg-surface rounded-lg shadow-sm border border-border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">नाम (Name)</th>
              <th className="px-4 py-3 font-medium">मोबाईल (Mobile)</th>
              <th className="px-4 py-3 font-medium">Aadhaar KYC</th>
              <th className="px-4 py-3 font-medium">Land Record</th>
              <th className="px-4 py-3 font-medium">कार्रवाई (Action)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading && <tr><td colSpan="5" className="px-4 py-4 text-center text-muted">Loading...</td></tr>}
            {!loading && farmers.length === 0 && (
              <tr><td colSpan="5" className="px-4 py-4 text-center text-muted">No farmers found.</td></tr>
            )}
            {!loading && farmers.map((f) => (
              <tr key={f._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-bold text-ink">{f.name}</td>
                <td className="px-4 py-3 text-muted">{f.mobileNumber}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${f.aadharVerified ? 'bg-primary-light text-primary-dark' : 'bg-red-100 text-red-700'}`}>
                    {f.aadharVerified ? 'Verified' : 'Pending'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${f.landVerificationStatus === 'manual_review' ? 'bg-accent-light text-accent-dark' : f.landVerificationStatus === 'verified' ? 'bg-primary-light text-primary-dark' : 'bg-gray-200'}`}>
                    {f.landVerificationStatus}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-primary hover:underline font-medium text-xs">
                    {f.landVerificationStatus === 'manual_review' || !f.aadharVerified ? 'समीक्षा करें (Review)' : 'विवरण देखें (View)'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
