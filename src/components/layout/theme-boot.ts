/** First visit is always light. Dark only after the visitor toggles. Never follow the OS. */
export const themeBootScript = `(function(){try{if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark');else document.documentElement.classList.remove('dark')}catch(e){}})()`
