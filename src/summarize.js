// Bahut simple "extractive" summarizer: sentence word-frequency based.
// Fully offline — Hindi and English both supported.
const STOP = new Set(
  `the a an and or of to in is are was were be been being for on with as by at this that these those it its from but not we you your he she they them his her their have has had do does did will would can could should may might must if then than so no yes about into over after before also more most some such only very own just even out up down between because while when where what which who whom how why
  के का की को है हैं था थे थी में से पर और यह वह ये वे कि भी एक दो तीन तक लिए नहीं इस उस इन उन सब हो होता होती होते करते करना कर गया गई गए रहा रही रहे अपने अपनी जो जब तो अब क्या कैसे कहाँ साथ बाद पहले बहुत लेकिन अथवा या सबसे आप हम मैं तुम वे उनके इसके उसके कौन फिर जिस जिसे`
    .split(/\s+/)
)

function words(str) {
  return (str.toLowerCase().match(/[\p{L}\p{N}]+/gu) || []).filter(w => w.length > 1 && !STOP.has(w))
}

/** Return the top `max` sentences as summary bullet points (in original order). */
export function summarize(text, max = 5) {
  const sentences = text
    .split(/(?<=[.!?।])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 20)
  if (sentences.length <= max) return sentences
  const freq = {}
  for (const s of sentences) for (const w of words(s)) freq[w] = (freq[w] || 0) + 1
  const scored = sentences.map((s, i) => ({
    i,
    score: words(s).reduce((a, w) => a + (freq[w] || 0), 0) / Math.sqrt(s.split(/\s+/).length),
  }))
  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, max).map(x => x.i).sort((a, b) => a - b).map(i => sentences[i])
}
