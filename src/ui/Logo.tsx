import { cx } from '@/ui/common'

export function LogoMark({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <img
      src="/logo.png"
      alt="SahayaK logo"
      width={size}
      height={size}
      className={cx('shrink-0 object-contain drop-shadow-sm', className)}
      style={{ width: size, height: size }}
      draggable={false}
    />
  )
}

export function LogoLockup({ subtitle }: { subtitle?: string }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark size={40} className="rounded-xl bg-paper p-0.5 ring-1 ring-pine-900/10" />
      <span>
        <span className="flex items-center gap-1.5">
          <span className="text-lg font-extrabold tracking-tight text-pine-800">SahayaK</span>
        </span>
        {subtitle && (
          <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-pine-900/45">
            {subtitle}
          </span>
        )}
      </span>
    </span>
  )
}
