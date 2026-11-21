import { WhatsAppIcon } from "./Icons";

export default function WhatsAppButton() {
  const num = process.env.NEXT_PUBLIC_WHATSAPP || "923000000000";
  const msg = encodeURIComponent("Hi JAHM! I'd like to ask about a piece / custom order.");
  return (
    <a
      href={`https://wa.me/${num}?text=${msg}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-soft transition hover:scale-110"
    >
      <WhatsAppIcon />
    </a>
  );
}
