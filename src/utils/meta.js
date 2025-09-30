// src/utils/meta.js
// SEO basique par vue : définit <title> et <meta name="description">.
// SSR-safe : protège l’accès si document inexistant.

export function setMeta({ title, description }) {
  if (typeof document === "undefined") return;

  if (title) {
    document.title = title;
  }

  if (description) {
    let tag = document.querySelector('meta[name="description"]');
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("name", "description");
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", description);
  }
}

/* --- Exemple d’usage ---
import { setMeta } from '@/utils/meta'

onMounted(() => {
  setMeta({
    title: 'Shadow | Portfolio Mode & Influence',
    description: 'Découvrez les créations, outfits et collaborations de Shadow.'
  })
})
*/
