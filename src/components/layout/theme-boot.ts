/** First visit is always light. Dark only after the visitor toggles. Never follow the OS. */
export const themeBootScript = `(function(){try{if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark');else document.documentElement.classList.remove('dark')}catch(e){}})()`

/** Payload otherwise uses the OS scheme when the theme cookie is missing. */
export const adminThemeBootScript = `(function(){try{if(!/(?:^|; )payload-theme=/.test(document.cookie)){document.cookie='payload-theme=light;path=/;max-age=31536000';document.documentElement.setAttribute('data-theme','light')}}catch(e){}})()`
