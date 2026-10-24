/* Shared on every page: helpers, menu, dialog, toast, feedback */

// $(selector) finds one element on the page, $$(selector) finds all of them
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];

// esc(text): makes visitor-typed text safe before it is shown inside HTML
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// iso(date): turns a date into YYYY-MM-DD, the format date inputs use
const iso=d=>d.toISOString().slice(0,10);

/* ---- MENU ----
   Phone menu button, dropdown buttons (.dd), and closing the menu after a link is clicked. */
const nav=$('#nav'),closeAll=()=>$$('nav li').forEach(l=>{l.classList.remove('open');const b=l.querySelector('.dd');b&&b.setAttribute('aria-expanded','false')});
$('#bg').onclick=e=>{const o=nav.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',o);e.currentTarget.setAttribute('aria-label',o?'Close menu':'Open menu')};
$$('.dd').forEach(b=>b.onclick=()=>{const li=b.parentElement,o=li.classList.contains('open');closeAll();if(!o){li.classList.add('open');b.setAttribute('aria-expanded','true')}});
$$('nav a').forEach(a=>a.addEventListener('click',()=>{closeAll();nav.classList.remove('open')}));
document.addEventListener('click',e=>{if(!e.target.closest('nav')&&!e.target.closest('#bg')){closeAll()}});

/* ---- TOAST & DIALOG ----
   toast(msg): short message at the bottom of the screen.
   modal(html): opens the pop-up (#md) with any HTML inside.
   close(): shuts it and returns keyboard focus to where the visitor was.
   Esc and clicking outside the box also close it. */
let lastF;function toast(m){const t=$('#toast');t.textContent=m;t.style.display='block';clearTimeout(t._t);t._t=setTimeout(()=>t.style.display='none',3600)}
function modal(h,w){lastF=document.activeElement;$('.mb').classList.toggle('wide',!!w);$('#mc').innerHTML=h;$('#md').classList.add('on');const f=$('#mc input,#mc .btn');f&&f.focus()}
function close(){$('#md').classList.remove('on');lastF&&lastF.focus()}
$('#mx').onclick=close;$('#md').onclick=e=>{if(e.target.id=='md')close()};document.addEventListener('keydown',e=>{if(e.key=='Escape'&&$('#md').classList.contains('on'))close()});

// Buttons inside the pop-up: Done / Close, and sending the feedback form
$('#mc').addEventListener('click',e=>{if(e.target.id=='ok'||e.target.id=='cl')close();if(e.target.id=='fs'){const m=$('#ft');if(!m.value.trim()){m.classList.add('bad');m.focus();return}close();toast('Thank you for your feedback.')}});

// Social links without an address yet show a short notice
$$('[data-soon]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();toast('Social links will be added soon.')}));

/* ---- FEEDBACK ----
   Opens the feedback form in the pop-up when the floating button is pressed. */
$('#fb').onclick=()=>modal(`<h3>Feedback</h3><p>Tell us how we can do better.</p><label for="fe">Email (optional)</label><input id="fe" type="email"><label for="ft">Message</label><input id="ft"><div class="err">Write a short message first.</div><button class="btn d" id="fs">Send feedback</button>`);

