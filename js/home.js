/* Home page only: slideshow, booking bar, gallery, subscribe */
// Line-icon drawings (SVG paths) used for the six highlight boxes
const IC={plane:'<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',bed:'<path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"/>',inst:'<path d="M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M12 2 3 7h18z"/>',bus:'<path d="M8 6v6M15 6v6M2 12h19.6M5 18H2V8a2 2 0 0 1 2-2h14c1.1 0 2.1.8 2.4 1.8l1.4 5c.1.4.2.8.2 1.2V18h-3M9 18h5"/><circle cx="7" cy="18" r="2"/><circle cx="16" cy="18" r="2"/>',wifi:'<path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/>',shield:'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>'};
const ic=n=>`<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${IC[n]}</svg>`;
[['plane','Transfers arranged on request'],['bed','Comfortable, spacious rooms'],['inst','Meeting and event spaces'],['bus','Shuttle on request'],['wifi','Free Wi-Fi'],['shield','Safe and secure']].forEach(([i,t])=>$('#feat').insertAdjacentHTML('beforeend',`<div>${ic(i)}${t}</div>`));

// Show today's date above the welcome title
$('#today').textContent=new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'});

/* ---- HERO SLIDESHOW ----
   Auto-advances every 6.5 seconds. Stops on hover, on keyboard focus, when paused,
   and for visitors who prefer reduced motion. */
const sl=$$('.slide'),rm=matchMedia('(prefers-reduced-motion:reduce)');let i=0,t,paused=rm.matches,hov=false;
sl.forEach((_,n)=>{const d=document.createElement('button');d.setAttribute('aria-label','Go to slide '+(n+1));d.onclick=()=>go(n);$('#dots').append(d)});
// go(n): show slide n (wraps around), update the dots, hide other slides from screen readers
function go(n){i=(n+sl.length)%sl.length;sl.forEach((s,k)=>{s.classList.toggle('on',k==i);s.toggleAttribute('inert',k!=i)});$$('#dots button').forEach((d,k)=>d.classList.toggle('on',k==i))}
// tick(): (re)starts the auto-advance timer unless the slideshow is paused
function tick(){clearInterval(t);if(!paused)t=setInterval(()=>{if(!hov)go(i+1)},6500)}
// setP(true/false): pause or play, and update the button icon and label
function setP(p){paused=p;$('#pp').setAttribute('aria-label',p?'Play slideshow':'Pause slideshow');$('#pp').innerHTML=p?'<svg class="i" viewBox="0 0 24 24"><path d="m6 4 14 8-14 8z"/></svg>':'<svg class="i" viewBox="0 0 24 24"><path d="M8 5v14M16 5v14"/></svg>';tick()}
$('#pp').onclick=()=>setP(!paused);$('#prev').onclick=()=>go(i-1);$('#next').onclick=()=>go(i+1);
$('#home').addEventListener('mouseenter',()=>hov=true);$('#home').addEventListener('mouseleave',()=>hov=false);
$('#home').addEventListener('focusin',()=>hov=true);$('#home').addEventListener('focusout',()=>hov=false);
$('#home').addEventListener('keydown',e=>{if(e.key=='ArrowLeft')go(i-1);if(e.key=='ArrowRight')go(i+1)});
go(0);setP(paused);

/* ---- READ MORE ----
   Expands and collapses the extra welcome text. */
$('#rm').onclick=()=>{const o=$('#more').classList.toggle('open');$('#rm').textContent=o?'Read less':'Read more';$('#rm').setAttribute('aria-expanded',o)};

/* ---- QUICK BOOKING BAR ----
   Dates cannot be in the past; check-out must be after check-in.
   On success a confirmation pop-up shows the request (nothing is sent anywhere yet). */
const td=iso(new Date());$('#ci').min=td;$('#co').min=td;
$('#ci').onchange=()=>{const c=$('#ci').value;if(c){const n=new Date(c);n.setDate(n.getDate()+1);$('#co').min=iso(n);if($('#co').value&&$('#co').value<=c)$('#co').value=iso(n)}};
$('#bf').onsubmit=e=>{e.preventDefault();const c=$('#ci'),o=$('#co');c.classList.toggle('bad',!c.value);o.classList.toggle('bad',!o.value||o.value<=c.value);if(!c.value||!o.value||o.value<=c.value){(c.value?o:c).focus();return}
 const n=Math.round((new Date(o.value)-new Date(c.value))/864e5);
 modal(`<h3>Request received</h3><p>${n} night${n>1?'s':''}: ${c.value} to ${o.value}<br>${$('#ad').value} adult(s), ${$('#ch').value} child(ren)</p><p>Our reservations team will confirm availability and rates by email or phone.</p><button class="btn d" id="ok">Done</button>`)};
$$('[data-pre]').forEach(a=>a.addEventListener('click',()=>{toast('Pick your dates to book: '+a.dataset.pre);setTimeout(()=>$('#ci').focus({preventScroll:true}),500)}));
/* sightseeing */

/* ---- GALLERY ----
   Builds the photo cards from this list: [caption, image class]. Clicking one opens the photo large. */
[['Evening at the entrance','p1'],['Spa corridor','p3'],['Lobby and reception','p5'],['Indoor pool','p6'],['Bathroom','p9'],['The grounds at night','p8']].forEach(([n,p])=>{const b=document.createElement('button');b.className='card';b.setAttribute('aria-label','Enlarge photo: '+n);b.innerHTML=`<div class="ph ${p}"></div><h3>${n}</h3><span>View photo</span>`;b.onclick=()=>{modal(`<h3>${n}</h3><img alt="${n}" src="images/${p}.jpg"><button class="btn d" id="cl">Close</button>`,1)};$('#sg').append(b)});

/* ---- NEWSLETTER ----
   Checks the email address, then shows a thank-you message. */
$('#sf').onsubmit=e=>{e.preventDefault();const s=$('#se'),ok=/^\S+@\S+\.\S+$/.test(s.value);s.classList.toggle('bad',!ok);if(!ok){s.focus();return}toast('Subscribed. Thank you!');e.target.reset()};
