import { useState } from "react";
import {
  KeyRound,
  Copy,
  Download,
  RefreshCcw,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  CheckCheck,
} from "lucide-react";

const generateCodes = () =>
  Array.from({ length: 10 }, () => {
    const block = () => Math.random().toString(36).slice(2, 7).toUpperCase();
    return `${block()}-${block()}`;
  });

export default function BackupCodesPage() {
  const [codes, setCodes] = useState(generateCodes());
  const [usedIndexes, setUsedIndexes] = useState([2, 6]); // mock: some already used
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const remaining = codes.length - usedIndexes.length;

  const handleCopyAll = () => {
    navigator.clipboard.writeText(codes.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    const blob = new Blob([codes.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "backup-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      // TODO: replace with real API call
      await new Promise((res) => setTimeout(res, 1000));
      setCodes(generateCodes());
      setUsedIndexes([]);
      setRevealed(true);
      setConfirmOpen(false);
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white">
          Backup Codes
        </h1>
        <p className="text-zinc-500 text-xs sm:text-sm mt-1">
          Use these codes to sign in if you lose access to your authenticator.
        </p>
      </div>

      {/* Warning */}
      <div className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-900/40 rounded-xl px-4 py-3.5 mb-6">
        <AlertTriangle size={18} className="text-yellow-400 shrink-0 mt-0.5" />
        <p className="text-xs sm:text-sm text-yellow-200/90 leading-relaxed">
          Each code can be used only once. Store them somewhere safe — anyone
          with these codes can access your account.
        </p>
      </div>

      {/* Status */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-zinc-400">
          <span className="text-white font-medium">{remaining}</span> of{" "}
          {codes.length} codes remaining
        </span>
        <button
          onClick={() => setRevealed((r) => !r)}
          className="flex items-center gap-1.5 text-xs sm:text-sm text-zinc-400 active:text-white sm:hover:text-white transition"
        >
          {revealed ? <EyeOff size={14} /> : <Eye size={14} />}
          {revealed ? "Hide" : "Reveal"}
        </button>
      </div>

      {/* Codes card */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          {codes.map((code, idx) => {
            const used = usedIndexes.includes(idx);
            return (
              <div
                key={idx}
                className={`flex items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 border font-mono text-sm ${
                  used
                    ? "border-zinc-900 bg-zinc-900/40 text-zinc-600"
                    : "border-zinc-800 bg-black text-zinc-200"
                }`}
              >
                <span className={used ? "line-through" : ""}>
                  {revealed || used ? code : "••••-••••"}
                </span>
                {used && (
                  <span className="flex items-center gap-1 text-[10px] font-sans font-medium text-zinc-600 shrink-0">
                    <CheckCheck size={11} />
                    Used
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2.5 mt-6">
          <button
            onClick={handleCopyAll}
            className="flex-1 flex items-center justify-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl border border-zinc-800 text-zinc-300 active:bg-zinc-900 sm:hover:bg-zinc-900 transition"
          >
            {copied ? (
              <CheckCircle2 size={14} className="text-emerald-400" />
            ) : (
              <Copy size={14} />
            )}
            {copied ? "Copied" : "Copy All"}
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl border border-zinc-800 text-zinc-300 active:bg-zinc-900 sm:hover:bg-zinc-900 transition"
          >
            <Download size={14} />
            Download .txt
          </button>
        </div>
      </div>

      {/* Regenerate */}
      <div className="mt-6 bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-400 shrink-0">
            <KeyRound size={18} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">
              Generate new codes
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              This will invalidate all existing backup codes.
            </p>
          </div>
        </div>

        <button
          onClick={() => setConfirmOpen(true)}
          className="flex items-center justify-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl border border-red-900/50 text-red-400 active:bg-red-950/30 sm:hover:bg-red-950/30 transition shrink-0"
        >
          <RefreshCcw size={14} />
          Regenerate
        </button>
      </div>

      {/* Confirm modal */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center px-4 z-50">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 sm:p-6 max-w-sm w-full">
            <div className="w-11 h-11 rounded-xl bg-red-500/15 flex items-center justify-center text-red-400 mb-4">
              <AlertTriangle size={20} />
            </div>
            <h3 className="text-base font-semibold text-white mb-1.5">
              Regenerate backup codes?
            </h3>
            <p className="text-sm text-zinc-500 leading-relaxed mb-5">
              Your old codes will stop working immediately. Make sure to save
              the new ones.
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={() => setConfirmOpen(false)}
                disabled={regenerating}
                className="flex-1 text-sm font-medium px-4 py-2.5 rounded-xl border border-zinc-800 text-zinc-300 active:bg-zinc-900 sm:hover:bg-zinc-900 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRegenerate}
                disabled={regenerating}
                className="flex-1 flex items-center justify-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl bg-red-500 text-white active:bg-red-400 sm:hover:bg-red-400 transition disabled:opacity-60"
              >
                {regenerating && <Loader2 size={14} className="animate-spin" />}
                {regenerating ? "Generating..." : "Regenerate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
