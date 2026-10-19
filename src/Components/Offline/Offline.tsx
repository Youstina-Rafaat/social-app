import { FiWifiOff } from "react-icons/fi";

export default function Offline() {
  return (
    <div
      role="alert"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0C1E]/70 p-5 font-['Outfit']"
    >
      <div className="w-full max-w-[400px] rounded-[18px] bg-card p-8 text-center shadow-[0_12px_32px_rgba(20,25,60,.25)]">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-soft text-acc">
          <FiWifiOff size={30} />
        </div>
        <h2 className="mb-1.5 text-2xl font-bold text-ink">
          You are offline
        </h2>
        <p className="text-mute">
          Check your internet connection. We'll reconnect as soon as you're back online.
        </p>
      </div>
    </div>
  )
}