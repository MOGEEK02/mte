import { useContact, whatsappLink } from "../contact";
import { useT } from "../i18n";
import { BrandIcon } from "./BrandIcon";

/** Round WhatsApp button in the corner of every page (switch in /admin → Paramètres). */
export function WhatsAppFloat() {
  const t = useT();
  const contact = useContact();
  if (!contact.whatsappButton) return null;
  return (
    <a
      href={whatsappLink(contact)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.whatsappFloat}
      title={t.whatsappFloat}
      className="fixed end-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex size-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg shadow-navy-950/25 transition hover:scale-105 hover:bg-[#1ebe5b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900 sm:end-6 sm:bottom-6"
    >
      <BrandIcon name="WhatsApp" className="size-7" />
    </a>
  );
}
