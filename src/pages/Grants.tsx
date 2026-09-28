import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarClock, CheckCircle2, Landmark, Mail, ShieldCheck, Target } from 'lucide-react'
import { GRANTS, type Grant } from '@/data/programs'
import { useStore } from '@/data/store'
import { cx } from '@/ui/common'

const TYPE_STYLE: Record<Grant['type'], string> = {
  Government: 'bg-pine-100 text-pine-800 border-pine-700/20',
  CSR: 'bg-royal-50 text-royal-700 border-royal-600/20',
  University: 'bg-periwinkle-50 text-royal-700 border-royal-600/15',
  Incubator: 'bg-peach-100 text-peach-800 border-peach-700/25',
}

const STATUS_STYLE: Record<Grant['status'], string> = {
  Open: 'text-pine-700',
  'Closing soon': 'text-peach-700 font-semibold',
  Rolling: 'text-royal-600',
}

export default function Grants() {
  const currentUser = useStore((s) => s.currentUser)
  const toast = useStore((s) => s.toast)
  const setToast = useStore((s) => s.setToast)
  const [type, setType] = useState<'all' | Grant['type']>('all')
  const [expressed, setExpressed] = useState<Record<string, boolean>>({})

  const list = useMemo(() => GRANTS.filter((g) => type === 'all' || g.type === type), [type])
  const me = currentUser?.role === 'student' ? currentUser.name.split(' ')[0] : null

  return (
    <div className="container-p py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="chip inline-flex items-center gap-1.5 border-pine-700/20 bg-pine-100 px-3 py-1.5 text-pine-800">
            <Landmark size={14} /> Grants & Funding
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-pine-900 sm:text-4xl">
            Turn validated work into funded work
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-pine-900/60">
            Curated funding calls matched to SahayaK projects. Your platform evidence — expert
            reviews, community validation, impact metrics — doubles as grant application material.
            Industry is optional here: funding is need-based, never a dependency.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(['all', 'Government', 'CSR', 'University', 'Incubator'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={cx(
                'rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors',
                type === t
                  ? 'border-pine-900 bg-pine-900 text-white'
                  : 'border-stone-200 bg-white text-pine-900/60 hover:border-pine-700/40 hover:text-pine-800',
              )}
            >
              {t === 'all' ? 'All funders' : t}
            </button>
          ))}
        </div>
      </header>

      <div className="mt-8 space-y-4">
        {list.map((g) => (
          <article key={g.id} className="card p-5 sm:p-6">
            <div className="flex flex-wrap items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-pine-50 to-royal-50 text-2xl">
                {g.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-lg font-bold tracking-tight text-pine-900">{g.title}</h3>
                  <span className={cx('chip border px-2.5 py-0.5 text-[11px]', TYPE_STYLE[g.type])}>{g.type}</span>
                  {g.status === 'Closing soon' && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-peach-700">
                      <CalendarClock size={12} /> Closing soon
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs font-medium text-pine-900/50">{g.funder}</p>
                <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-pine-900/65">{g.summary}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {g.tags.map((t) => (
                    <span key={t} className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-pine-900/55">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex w-full flex-col items-start gap-3 sm:w-44 sm:items-end">
                <div className="text-right">
                  <p className="font-display text-lg font-extrabold text-pine-900">{g.amount}</p>
                  <p className={cx('text-[11px]', STATUS_STYLE[g.status])}>
                    {g.status === 'Rolling' ? 'Rolling deadline' : `Deadline ${g.deadline}`}
                  </p>
                </div>
                <div className="flex w-full items-center gap-2 sm:justify-end">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-stone-100 sm:max-w-[70px]">
                    <div
                      className={cx('h-full rounded-full', g.fit >= 85 ? 'bg-pine-600' : g.fit >= 75 ? 'bg-royal-500' : 'bg-peach-500')}
                      style={{ width: `${g.fit}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-pine-900/70">{g.fit}% fit</span>
                </div>
                <button
                  onClick={() => {
                    setExpressed((e) => ({ ...e, [g.id]: true }))
                    setToast(`Interest noted for “${g.title}” — the funder pack is in your inbox`)
                  }}
                  className={cx(
                    'btn w-full justify-center px-3 py-2 text-xs',
                    expressed[g.id]
                      ? 'border border-pine-700/25 bg-pine-100 text-pine-800'
                      : 'bg-pine-900 text-white hover:bg-pine-800',
                  )}
                >
                  {expressed[g.id] ? (
                    <>
                      <CheckCircle2 size={14} /> Interest noted
                    </>
                  ) : (
                    <>
                      <Mail size={14} /> Express interest
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-stone-100 pt-3 text-[12px] text-pine-900/55">
              <span className="flex items-center gap-1.5">
                <Target size={13} className="text-royal-600" /> Stages: {g.eligibleStages.join(' → ')}
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-pine-600" /> SahayaK validation records count as evidence
              </span>
              {me && expressed[g.id] && (
                <span className="ml-auto text-[11px] text-pine-900/45">
                  Application draft started for {me}'s team
                </span>
              )}
            </div>
          </article>
        ))}
      </div>

      <p className="mt-6 rounded-2xl border border-stone-200 bg-white/60 p-4 text-[12px] leading-relaxed text-pine-900/55">
        <strong className="font-semibold text-pine-800">Need-based, never required:</strong> projects
        do not wait for funding to start. Grants appear when a validated solution is ready to scale.
        To propose a funding partnership, <Link to="/knowledge" className="font-semibold text-royal-700 underline-offset-2 hover:underline">post in Knowledge Ground</Link> or contact the hub office.
      </p>

      {toast && <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-pine-900 px-4 py-2 text-xs font-semibold text-white shadow-card-lg">{toast}</div>}
    </div>
  )
}
