import { ref, onMounted, onBeforeUnmount } from "vue";

export function useHeaderScroll() {
  const elevated = ref(false);
  const onScroll = () => {
    elevated.value = (window.scrollY || 0) > 4;
  };

  onMounted(() => {
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  });
  onBeforeUnmount(() => window.removeEventListener("scroll", onScroll));

  return { elevated };
}
