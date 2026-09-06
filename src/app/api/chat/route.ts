import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";
import chatContext from "@/generated/chat-context.json";

const API = "https://api.groq.com/openai/v1/chat/completions";

type ChatMessage = { role: "user" | "assistant"; content: string };
type GroqResponse = {
  choices?: { message?: { content?: string } }[];
  error?: { message?: string };
};

function buildContext(): string {
  return chatContext.text;
}

export async function POST(req: Request) {
  const key = env.GROQ_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "AI belum dikonfigurasi." }, { status: 500 });
  }
  try {
    const body = await req.json() as { messages?: ChatMessage[] };
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const sys = [
      "Kamu asisten data harga pangan AROMA. Jawab dalam Bahasa Indonesia, ringkas, faktual, pakai angka dari data yang diberikan.",
      "Kalau data tak mendukung, bilang jujur 'tidak ada data itu'. Jangan mengarang.",
      buildContext(),
    ].join("\n\n");
    const r = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: env.GROQ_MODEL,
        messages: [{ role: "system", content: sys }, ...messages],
        max_tokens: 500,
      }),
    });
    if (!r.ok) {
      const e = await r.json().catch(() => null) as GroqResponse | null;
      return NextResponse.json(
        { error: e?.error?.message || "Layanan AI sedang sibuk, coba lagi." },
        { status: 502 }
      );
    }
    const d = await r.json() as GroqResponse;
    const text = d.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ text });
  } catch {
    return NextResponse.json({ error: "Gagal memproses permintaan." }, { status: 500 });
  }
}
