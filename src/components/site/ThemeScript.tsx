// Sets the theme before first paint to avoid a flash. Reads localStorage
// ("ferums-theme"), falling back to the OS preference. Runs inline in <head>.
export function ThemeScript() {
  const js = `(function(){try{var t=localStorage.getItem('ferums-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}
