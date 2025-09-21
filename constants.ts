
export const PLANE_SVG_ICON = (isSelected: boolean) => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" 
    class="w-6 h-6 transition-all duration-300" 
    style="filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.5));">
    <path fill="${isSelected ? '#0ea5e9' : '#f8fafc'}" 
      d="M381.4 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L306.7 256 176.1 125.4c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" 
      transform="rotate(90 192 256)"/>
  </svg>
`.replace(/\s\s+/g, ' ').trim();
