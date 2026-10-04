import { useState } from 'react';

export default function Queue() {
  const [board] = useState({
    waiting: [{ id: 1, token: 'MP-BHO-001' }, { id: 2, token: 'MP-BHO-002' }],
    weighing: [{ id: 3, token: 'MP-BHO-003' }],
    quality: [],
    completed: [{ id: 4, token: 'MP-BHO-004' }]
  });

  const columns = [
    { key: 'waiting', label: 'प्रतीक्षारत (Waiting)' },
    { key: 'weighing', label: 'वजन (Weighing)' },
    { key: 'quality', label: 'गुणवत्ता जाँच (QC)' },
    { key: 'completed', label: 'पूर्ण (Completed)' },
  ];

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary-dark">स्लॉट और कतार (Kanban)</h2>
      </div>

      <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
        {columns.map(col => (
          <div key={col.key} className="bg-paper rounded-lg p-3 border border-border w-72 flex-shrink-0 flex flex-col">
            <h3 className="font-bold text-ink mb-3 px-1">{col.label} ({board[col.key].length})</h3>
            <div className="flex-1 space-y-2 overflow-y-auto">
              {board[col.key].map(item => (
                <div key={item.id} className="bg-surface p-3 rounded shadow-sm border border-border cursor-grab hover:border-primary transition-colors">
                  <p className="font-bold text-ink">{item.token}</p>
                  <p className="text-xs text-muted mt-1">गेहूं • 50 क्विंटल</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
