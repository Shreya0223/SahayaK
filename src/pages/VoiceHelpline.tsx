import { useState } from 'react'
import { CalendarCheck, Headset, Mic, PhoneCall, FileText, Users, Volume2, MapPinned } from 'lucide-react'
import { useStore } from '@/data/store'
import { cx } from '@/ui/common'

const STEPS = [
  { icon: PhoneCall, title: '1 · Call the toll-free number', detail: 'Works from any phone — smartphone or basic handset. No internet, no app, no typing needed.' },
  { icon: Mic, title: '2 · Explain in your own words', detail: 'Record your problem as a voice note in Hindi or English. Plain words are fine — say what you see.' },
  { icon: FileText, title: '3 · Volunteers file it with AI help', detail: 'Trained field volunteers transcribe your note; the AI classifies it and creates a tracked problem — the same as an online report.' },
  { icon: Volume2, title: '4 · Updates come back by voice', detail: 'You get status updates by automated voice call and SMS, in your language, at every stage — team matched, prototype ready, validation result.' },
]

const CAN_DO = [
  'Report a new problem — crops, health, water, roads',
  'Ask “what is happening on my report?” and hear the latest stage',
  'Get connected to your problem’s community circle',
  'Request a village visit from a SahayaK field volunteer',
]

const VISITS = [
  { when: 'Every Tuesday', where: 'Angara block — weekly chaupal, 10 am–1 pm' },
  { when: 'Every Thursday', where: 'Bundu block — PHC notice board help desk, 11 am–2 pm' },
  { when: '2nd Saturday', where: 'Panchayat office camps — on request via the helpline' },
]

export default function VoiceHelpline() {
  const setToast = useStore((s) => s.setToast)
  const [name, setName] = useState('')
  const [village, setVillage] = useState('')
  const [phone, setPhone] = useState('')
  const [slot, setSlot] = useState('Morning (9 am – 12 pm)')

  const book = () => {
    if (!name.trim() || !phone.trim()) {
      setToast('Please add your name and phone number')
      return
    }
    setToast(`Callback booked for ${name.trim()} — a field volunteer will call within 2 hours (demo)`)
    setName(''); setVillage(''); setPhone('')
  }

  return (
    <div className="container-p max-w-5xl py-8">
      {/* hero */}
      <div className="card relative overflow-hidden bg-pine-900 text-paper">
        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-royal-600/40 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-pine-700/50 blur-3xl" aria-hidden />
        <div className="relative flex flex-wrap items-center gap-6 p-8 sm:p-10">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-3xl bg-paper/10 ring-1 ring-paper/25">
            <Headset size={30} />
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-3xl font-extrabold tracking-tight">Voice Helpline</h1>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-paper/70">
              Toll-free 24/7 farmer hotline. No smartphone, no typing, no internet — one call
              creates a tracked problem on SahayaK, and updates come back to you by voice.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="chip bg-paper/10 text-paper ring-1 ring-paper/20">⏱ 24 / 7 · toll-free</span>
              <span className="chip bg-paper/10 text-paper ring-1 ring-paper/20">🗣 Hindi & English voice notes</span>
              <span className="chip bg-paper/10 text-paper ring-1 ring-paper/20">📱 Works on any handset</span>
            </div>
          </div>
          <div className="w-full max-w-xs rounded-2xl bg-paper p-5 text-center text-ink shadow-pop sm:w-auto">
            <div className="text-[10px] font-bold uppercase tracking-widest text-pine-900/45">Call now — free</div>
            <a href="tel:18002664242" className="mt-1 block font-display text-2xl font-black tracking-tight text-pine-900">
              1800-266-4242
            </a>
            <a href="tel:18002664242" className="btn-primary mt-3 w-full justify-center">
              <PhoneCall size={15} /> Call the helpline
            </a>
          </div>
        </div>
      </div>

      {/* how it works */}
      <h2 className="mt-8 font-display text-xl font-extrabold tracking-tight text-ink">
        How a phone call becomes a tracked problem
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {STEPS.map((s) => (
          <div key={s.title} className="card flex items-start gap-3.5 p-5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-pine-50 text-pine-800 ring-1 ring-pine-900/10">
              <s.icon size={19} />
            </span>
            <div>
              <h3 className="text-sm font-extrabold text-ink">{s.title}</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-pine-900/60">{s.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        {/* callback form */}
        <section className="card p-6">
          <h2 className="flex items-center gap-2 font-extrabold text-ink">
            <CalendarCheck size={18} className="text-pine-700" /> Request a callback
          </h2>
          <p className="mt-1 text-[13px] text-pine-900/55">
            Can’t call right now? Leave your number — a SahayaK field volunteer calls you back,
            listens, and files the problem with you.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="label">Your name *</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ramesh Patil" className="input" />
            </label>
            <label className="block">
              <span className="label">Village / district</span>
              <input value={village} onChange={(e) => setVillage(e.target.value)} placeholder="e.g. Angara, Ranchi" className="input" />
            </label>
            <label className="block">
              <span className="label">Phone number *</span>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile" inputMode="tel" className="input" />
            </label>
            <label className="block">
              <span className="label">Best time to call</span>
              <select value={slot} onChange={(e) => setSlot(e.target.value)} className="input">
                {['Morning (9 am – 12 pm)', 'Afternoon (12 – 4 pm)', 'Evening (4 – 8 pm)'].map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
          </div>
          <button className="btn-primary mt-4 w-full sm:w-auto" onClick={book}>
            Book my callback
          </button>
          <div className="mt-3 rounded-xl bg-pine-900/[0.04] p-3 text-[11px] font-semibold leading-relaxed text-pine-900/55">
            Privacy: your number is used only for this callback and never appears on any public
            problem page. Healthcare details are handled only by verified health workers.
          </div>
        </section>

        {/* side cards */}
        <div className="space-y-6">
          <section className="card p-6">
            <h2 className="flex items-center gap-2 font-extrabold text-ink">
              <Users size={17} className="text-pine-700" /> What we can do over a call
            </h2>
            <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-pine-900/70">
              {CAN_DO.map((c) => (
                <li key={c} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pine-700" />{c}</li>
              ))}
            </ul>
          </section>

          <section className="card p-6">
            <h2 className="flex items-center gap-2 font-extrabold text-ink">
              <MapPinned size={17} className="text-pine-700" /> Village visit schedule
            </h2>
            <div className="mt-3 space-y-2.5">
              {VISITS.map((v) => (
                <div key={v.when} className="rounded-xl border border-pine-900/10 p-3">
                  <div className={cx('text-xs font-bold text-pine-800')}>{v.when}</div>
                  <div className="mt-0.5 text-[12px] text-pine-900/60">{v.where}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
