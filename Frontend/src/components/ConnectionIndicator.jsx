export const CONNECTION_STATUS = {
  CHECKING: "checking",
  CONNECTED: "connected",
  DISCONNECTED: "disconnected",
};

export function ConnectionIndicator({ status }) {
  const config = {
    checking: {
      label: "Checking connection",
      dotClass: "bg-warning animate-pulse",
      textClass: "text-warning",
      ringClass: "ring-warning/30",
    },
    connected: {
      label: "Connected",
      dotClass: "bg-success",
      textClass: "text-success",
      ringClass: "ring-success/30",
    },
    disconnected: {
      label: "Disconnected",
      dotClass: "bg-error",
      textClass: "text-error",
      ringClass: "ring-error/30",
    },
  };

  const cfg = config[status] || config.checking;

  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-border bg-card/50 px-3 py-2.5">
      <span className={`relative flex h-2.5 w-2.5 ${cfg.ringClass}`}>
        <span className={`absolute inline-flex h-full w-full rounded-full opacity-60 ${cfg.dotClass} ring-4 ${cfg.ringClass}`} />
        <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${cfg.dotClass}`} />
      </span>
      <span className={`text-xs font-medium ${cfg.textClass}`}>{cfg.label}</span>
    </div>
  );
}
