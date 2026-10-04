import { useState, useEffect } from 'react';
import api from '../../api/api';

export default function Centres() {
  const [centres, setCentres] = useState([]);

  useEffect(() => {
    async function load() {
      const { data } = await api.get('/centres');
      setCentres(data);
    }
    load();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary-dark">खरीद केंद्र प्रबंधन</h2>
        <button className="bg-primary text-white px-4 py-2 rounded-md font-bold shadow-sm hover:bg-primary-dark transition-colors">
          + नया केंद्र जोड़ें
        </button>
      </div>

      <div className="bg-surface rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-paper text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">नाम</th>
                <th className="px-4 py-3 font-medium">जिला</th>
                <th className="px-4 py-3 font-medium">स्थिति</th>
                <th className="px-4 py-3 font-medium">कार्रवाई</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {centres.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-bold text-ink">{c.name}</td>
                  <td className="px-4 py-3 text-muted">{c.district}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${c.isActive ? 'bg-primary-light text-primary-dark' : 'bg-gray-200 text-gray-700'}`}>
                      {c.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-primary hover:underline font-medium">संपादित करें</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
