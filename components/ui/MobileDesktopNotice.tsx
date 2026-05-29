"use client";

interface Props {
  title?: string;
  message?: string;
}

export default function MobileDesktopNotice({
  title = "Desktop Recommended",
  message = "For the best experience, please use a computer.",
}: Props) {
  return (
    <div className="w-full flex items-center justify-center min-h-[60vh] px-6">
      <div className="max-w-md w-full rounded-2xl border border-yellow-500/20 bg-zinc-900 p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-3xl">💻</div>

          <div>
            <h2 className="text-xl font-semibold text-white">
              {title}
            </h2>

            <p className="text-sm text-zinc-400">
              Desktop experience required
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/20 p-4">
          <p className="text-sm leading-relaxed text-yellow-100">
            {message}
          </p>
        </div>

        <div className="mt-5 text-xs text-zinc-500">
          Connect WhatsApp, settings, subscriptions and account management
          are still available on mobile devices.
        </div>
      </div>
    </div>
  );
}