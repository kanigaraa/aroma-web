"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, Loader2 } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

export default function AIChat() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", content: "Halo! Tanya data harga pangan AROMA, misal: \"berapa harga beras rata-rata?\" atau \"komoditas termahal?\"" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading]);

  const send = async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput("");
    setErr("");
    setMsgs((m) => [...m, { role: "user", content: q }]);
    setLoading(true);
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: msgs.concat({ role: "user", content: q }) }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Gagal");
      setMsgs((m) => [...m, { role: "assistant", content: d.text }]);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute bottom-16 right-6 z-50 flex h-[480px] w-[360px] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-xl">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 text-white">
          <Bot className="h-4 w-4" />
        </span>
        <div>
          <div className="text-sm font-semibold text-primary">Asisten AROMA</div>
          <div className="flex items-center gap-1 text-[10px] text-teal-600">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500" /> AI data harga pangan
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm ${
                m.role === "user"
                  ? "rounded-br-md bg-teal-600 text-white"
                  : "rounded-bl-md border border-border bg-muted text-primary"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-border bg-muted px-3.5 py-2 text-sm text-secondary">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Mengetik...
            </div>
          </div>
        )}
        {err && <div className="text-xs text-red-500">{err}</div>}
        <div ref={endRef} />
      </div>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Tanya harga, prediksi, cuaca..."
            className="flex-1 rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-primary outline-none focus:border-accent"
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white transition-colors hover:bg-teal-700 disabled:opacity-40"
            aria-label="Kirim"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
