import { getCloudflareContext } from "@opennextjs/cloudflare";

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export class AIError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export async function completeChat(messages: ChatMessage[]): Promise<string> {
  let env: Partial<CloudflareEnv> = {};
  try {
    env = getCloudflareContext().env;
  } catch {
    // Node.js scripts and local tests may run without a Workers context.
  }
  const key = process.env.GROQ_API_KEY?.trim() || env.GROQ_API_KEY?.trim();
  const model = process.env.GROQ_MODEL?.trim() || env.GROQ_MODEL?.trim() || "qwen/qwen3.8-27b";
  if (!key) throw new AIError("AI belum dikonfigurasi. Hubungi pengelola AROMA.", 503);

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model, messages, max_completion_tokens: 700, temperature: 0.3 }),
      signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok) {
      if (response.status === 429) throw new AIError("Batas permintaan AI tercapai. Coba lagi sebentar.", 429);
      if (response.status === 413) throw new AIError("Konteks melebihi batas AI. Coba pertanyaan tentang satu komoditas atau provinsi.", 413);
      throw new AIError("Layanan AI belum dapat merespons. Coba lagi nanti.", 502);
    }
    const data = await response.json() as { choices?: { message?: { content?: unknown } }[] } | null;
    const text = data?.choices?.[0]?.message?.content;
    if (typeof text !== "string" || !text.trim()) throw new AIError("AI mengembalikan respons kosong. Coba lagi.", 502);
    return text.trim();
  } catch (error) {
    if (error instanceof AIError) throw error;
    if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) {
      throw new AIError("Waktu respons AI habis. Coba lagi.", 504);
    }
    throw new AIError("Gagal terhubung ke layanan AI. Coba lagi.", 502);
  }
}
