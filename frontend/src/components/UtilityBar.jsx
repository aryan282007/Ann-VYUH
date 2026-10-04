import { useLanguage, SUPPORTED_LANGS } from '../context/LanguageContext.jsx';
import { Link } from 'react-router-dom';

export default function UtilityBar() {
  const { lang, setLang, t } = useLanguage();

  return (
    <div className="border-b border-border bg-white text-small text-muted">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-1">
        <div className="flex items-center gap-2 font-semibold">
          कृषि उपज मंडी समिति, मध्य प्रदेश
          <span className="badge bg-danger/10 text-danger px-1.5 py-0.5 text-[10px]">डेमो</span>
        </div>
        <label className="flex items-center gap-1.5">
          <span className="font-bold">{t('common.language')}</span>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="min-w-[92px] rounded-sm border border-border bg-white px-1.5 py-0.5 text-ink"
          >
            {SUPPORTED_LANGS.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

