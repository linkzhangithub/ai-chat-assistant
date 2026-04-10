// src/directives/tooltip.js
export default {
  mounted(el, binding) {
    // 检测是否为移动端（简单通过 UA 判断）
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );
    if (isMobile) return; // 移动端不启用 tooltip

    const text = binding.value || el.getAttribute("title");
    if (!text) return;
    el.removeAttribute("title");

    const tooltip = document.createElement("div");
    tooltip.className = "custom-tooltip";
    tooltip.textContent = text;
    document.body.appendChild(tooltip);

    function updatePosition() {
      const rect = el.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      let top = rect.top - tooltipRect.height - 8;
      let left = rect.left + (rect.width - tooltipRect.width) / 2;

      if (top < 0) {
        top = rect.bottom + 8;
        tooltip.classList.add("bottom");
      } else {
        tooltip.classList.remove("bottom");
      }

      if (left < 8) left = 8;
      if (left + tooltipRect.width > window.innerWidth - 8) {
        left = window.innerWidth - tooltipRect.width - 8;
      }

      tooltip.style.top = `${top + window.scrollY}px`;
      tooltip.style.left = `${left + window.scrollX}px`;
    }

    function show() {
      updatePosition();
      tooltip.classList.add("show");
    }
    function hide() {
      tooltip.classList.remove("show");
    }

    el.addEventListener("mouseenter", show);
    el.addEventListener("mouseleave", hide);
    window.addEventListener("scroll", updatePosition);
    window.addEventListener("resize", updatePosition);

    el._tooltipCleanup = () => {
      el.removeEventListener("mouseenter", show);
      el.removeEventListener("mouseleave", hide);
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
      tooltip.remove();
    };
  },
  unmounted(el) {
    if (el._tooltipCleanup) el._tooltipCleanup();
  },
};
