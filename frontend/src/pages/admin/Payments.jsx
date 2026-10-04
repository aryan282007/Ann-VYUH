import { useState, useEffect } from 'react';
import api from '../../api/api';

export default function Payments() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get('/payments/requests');
        setRequests(data);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-primary-dark">भुगतान (PFMS Tracking)</h2>
      
      <div className="bg-surface rounded-lg shadow-sm border border-border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">टोकन</th>
              <th className="px-4 py-3 font-medium">किसान</th>
              <th className="px-4 py-3 font-medium">राशि</th>
              <th className="px-4 py-3 font-medium">स्थिति</th>
              <th className="px-4 py-3 font-medium">कार्रवाई</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {requests.map((r) => (
              <tr key={r._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-bold text-ink">{r.token}</td>
                <td className="px-4 py-3 text-muted">{r.farmer?.name}</td>
                <td className="px-4 py-3 font-medium">₹{r.estimatedValue}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${r.paymentStatus === 'processing' ? 'bg-accent-light text-accent-dark' : 'bg-gray-200'}`}>
                    {r.paymentStatus}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-primary hover:underline font-medium">PFMS शुरू करें</button>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-muted">कोई लंबित भुगतान अनुरोध नहीं है।</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
