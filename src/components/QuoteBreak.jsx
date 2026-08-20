export default function QuoteBreak({ eyebrow, quote, attribution }) {
  return (
    <section className="quote-break">
      {eyebrow && <div className="qeyebrow">{eyebrow}</div>}
      <blockquote>&ldquo;{quote}&rdquo;</blockquote>
      {attribution && <cite>{attribution}</cite>}
    </section>
  );
}
