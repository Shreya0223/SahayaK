import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, ChevronDown, Filter, Lightbulb, Sparkles, Users2 } from 'lucide-react'
import { BLUEPRINTS, type Blueprint } from '@/data/programs'
import { cx } from '@/ui/common'

const DOMAIN_FILTERS = [
  { id: 'all', label: 'All domains' },
  { id: 'agri', label: '🌾 Agriculture & Genetics' },
  { id: 'health', label: '🏥 Healthcare & Biotech' },
] as const

const DIFFICULTY_STYLE: Record<Blueprint['difficulty'], string> = {
  Starter: 'bg-pine-100 text-pine-800 border-pine-700/20',
  Intermediate: 'bg-royal-50 text-royal-700 border-royal-600/20',
  Advanced: 'bg-peach-100 text-peach-800 border-peach-700/25',
}

export default function Blueprints() {
  const [domain, setDomain] = useState<(typeof DOMAIN_FILTERS)[number]['id']>('all')
  const [openId, setOpenId] = useState<string | null>(null)

  const list = useMemo(
    () => BLUEPRINTS.filter((b) => domain === 'all' || b.domain === domain),
    [domain],
  )
  const open = list.find((b) => b.id === openId) ?? null

  return (
    <div className="container-p py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="chip inline-flex items-center gap-1.5 border-pine-700/20 bg-pine-100 px-3 py-1.5 text-pine-800">
            <BookOpen size={14} /> Solution Blueprints
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-pine-900 sm:text-4xl">
            Proven starting points, not blank pages
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-pine-900/60">
            Field-tested architectures from validated SahayaK projects. Adopt one, adapt it to your
            community, and still take it through expert review and validation — blueprints are a
            head start, never a shortcut.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-pine-900/40" />
          {DOMAIN_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setDomain(f.id)}
              className={cx(
                'rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors',
                domain === f.id
                  ? 'border-pine-900 bg-pine-900 text-white'
                  : 'border-stone-200 bg-white text-pine-900/60 hover:border-pine-700/40 hover:text-pine-800',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {list.map((b) => (
          <article
            key={b.id}
            className={cx(
              'card flex flex-col p-5 transition-shadow hover:shadow-card-lg',
              open?.id === b.id && 'ring-2 ring-pine-700/40',
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-pine-50 to-royal-50 text-2xl">
                {b.icon}
              </span>
              <span className={cx('chip border px-2.5 py-1 text-[11px]', DIFFICULTY_STYLE[b.difficulty])}>
                {b.difficulty}
              </span>
            </div>
            <h3 className="mt-3 font-display text-lg font-bold tracking-tight text-pine-900">{b.title}</h3>
            <p className="mt-1.5 line-clamp-3 text-[13px] leading-relaxed text-pine-900/60">{b.summary}</p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {b.disciplines.slice(0, 3).map((d) => (
                <span key={d} className="rounded-full bg-periwinkle-50 px-2.5 py-1 text-[11px] font-medium text-royal-700">
                  {d}
                </span>
              ))}
              {b.disciplines.length > 3 && (
                <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-pine-900/50">
                  +{b.disciplines.length - 3}
                </span>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3 text-[12px] text-pine-900/50">
              <span className="flex items-center gap-1.5">
                <Users2 size={13} /> {b.adoption} teams adopted
              </span>
              <span>{b.estDuration}</span>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => setOpenId(open?.id === b.id ? null : b.id)}
                className="btn flex-1 justify-center border border-pine-900/15 bg-white px-3 py-2 text-pine-900 hover:bg-pine-50"
              >
                View blueprint {open?.id === b.id ? '−' : '+'}
              </button>
              <Link
                to="/report"
                className="btn justify-center bg-pine-900 px-3 py-2 text-white hover:bg-pine-800"
                title="Start a project from this blueprint"
              >
                Use <ArrowRight size={14} />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {open && (
        <section className="card mt-6 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 bg-gradient-to-r from-pine-50/60 to-royal-50/40 px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{open.icon}</span>
              <div>
                <h2 className="font-display text-xl font-bold tracking-tight text-pine-900">{open.title}</h2>
                <p className="text-xs text-pine-900/55">
                  {open.disciplines.join(' · ')} — {open.estDuration}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="chip border-royal-600/20 bg-royal-50 px-3 py-1.5 text-royal-700">
                {open.domain === 'agri' ? '🌾 Agriculture & Genetics' : '🏥 Healthcare & Biotech'}
              </div>
              <button onClick={() => setOpenId(null)} className="btn border border-stone-200 bg-white px-3 py-1.5 text-xs text-pine-900/60">
                Close
              </button>
            </div>
          </div>

          <div className="grid gap-6 p-6 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-pine-900/45">Architecture</h4>
              <ol className="mt-3 space-y-3">
                {open.architecture.map((a, i) => (
                  <li key={a.step} className="flex gap-3">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-pine-900 text-[11px] font-bold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-pine-900">{a.step}</p>
                      <p className="text-[13px] leading-relaxed text-pine-900/60">{a.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
              {open.expertTip && (
                <div className="mt-4 flex gap-2.5 rounded-2xl border border-peach-700/20 bg-peach-50 p-3.5">
                  <Lightbulb size={17} className="mt-0.5 shrink-0 text-peach-700" />
                  <p className="text-[13px] leading-relaxed text-peach-900">
                    <strong className="font-semibold">Expert tip:</strong> {open.expertTip}
                  </p>
                </div>
              )}
            </div>

            <aside className="space-y-4">
              <div className="rounded-2xl border border-stone-100 bg-stone-50/60 p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-pine-900/45">Skills you'll need</h4>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {open.skills.map((s) => (
                    <span key={s} className="rounded-full border border-pine-700/15 bg-white px-2.5 py-1 text-[11px] font-medium text-pine-800">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              {open.basedOn && (
                <div className="rounded-2xl border border-stone-100 p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-pine-900/45">Proven in</h4>
                  <p className="mt-1.5 text-sm font-semibold text-pine-900">{open.basedOn}</p>
                  <p className="text-xs text-pine-900/50">
                    A validated SahayaK project — evidence available on its impact record.
                  </p>
                </div>
              )}
              <Link
                to="/discover"
                className="btn w-full justify-center bg-royal-600 px-4 py-2.5 text-sm text-white hover:bg-royal-700"
              >
                <Sparkles size={15} /> Find a problem that fits
              </Link>
              <p className="text-center text-[11px] leading-relaxed text-pine-900/45">
                Every blueprint still requires expert validation & community testing — the loop is the product.
              </p>
            </aside>
          </div>
        </section>
      )}

      <div className="mt-6 flex items-center gap-2 text-[12px] text-pine-900/45">
        <ChevronDown size={13} /> Blueprints connect to live problems — <Link to="/discover" className="font-semibold text-royal-700 underline-offset-2 hover:underline">browse open challenges</Link>
      </div>
    </div>
  )
}
