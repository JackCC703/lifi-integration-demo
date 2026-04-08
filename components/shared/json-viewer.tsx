type JsonViewerProps = {
  data: unknown;
  title?: string;
  defaultOpen?: boolean;
};

export function JsonViewer({
  data,
  title = "Raw JSON",
  defaultOpen = false,
}: JsonViewerProps) {
  return (
    <details
      open={defaultOpen}
      className="rounded-2xl border border-line bg-[#0d1720] text-slate-100"
    >
      <summary className="flex items-center justify-between px-4 py-3 text-sm font-semibold">
        <span>{title}</span>
        <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
          toggle
        </span>
      </summary>
      <pre className="overflow-x-auto border-t border-white/10 px-4 py-4 text-xs leading-6 text-slate-200">
        {JSON.stringify(data, null, 2)}
      </pre>
    </details>
  );
}
