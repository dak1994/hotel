/* Booking forms for rooms.html, dining.html, events.html, recreation.html. Edit the fields here. */
/* FIELDS: the booking form for each page. Each field is
   [id, label, type, required (1/0), options (for select lists)].
   Add, remove or reorder fields here. */
const FIELDS={
 "rooms": [
  [
   "ci",
   "Check-in",
   "date",
   1
  ],
  [
   "co",
   "Check-out",
   "date",
   1
  ],
  [
   "room",
   "Room type",
   "select",
   1,
   [
    "Standard Room",
    "Premium Room",
    "Family Suite",
    "Executive Suite",
    "Presidential Suite"
   ]
  ],
  [
   "ad",
   "Adults",
   "select",
   1,
   [
    "1",
    "2",
    "3",
    "4"
   ]
  ],
  [
   "ch",
   "Children",
   "select",
   1,
   [
    "0",
    "1",
    "2",
    "3",
    "4"
   ]
  ],
  [
   "name",
   "Full name",
   "text",
   1
  ],
  [
   "phone",
   "Phone number",
   "tel",
   1
  ],
  [
   "email",
   "Email",
   "email",
   1
  ],
  [
   "note",
   "Special requests (optional)",
   "textarea",
   0
  ]
 ],
 "dining": [
  [
   "date",
   "Date",
   "date",
   1
  ],
  [
   "time",
   "Time",
   "time",
   1
  ],
  [
   "gu",
   "Guests",
   "select",
   1,
   [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12"
   ]
  ],
  [
   "area",
   "Where",
   "select",
   1,
   [
    "Restaurant",
    "Bar and lounge",
    "No preference"
   ]
  ],
  [
   "name",
   "Full name",
   "text",
   1
  ],
  [
   "phone",
   "Phone number",
   "tel",
   1
  ],
  [
   "note",
   "Notes, such as allergies (optional)",
   "textarea",
   0
  ]
 ],
 "events": [
  [
   "et",
   "Event type",
   "select",
   1,
   [
    "Meeting or conference",
    "Wedding",
    "Tailor-made event"
   ]
  ],
  [
   "date",
   "Event date",
   "date",
   1
  ],
  [
   "gu",
   "Number of guests",
   "number",
   1
  ],
  [
   "name",
   "Full name",
   "text",
   1
  ],
  [
   "phone",
   "Phone number",
   "tel",
   1
  ],
  [
   "email",
   "Email",
   "email",
   1
  ],
  [
   "note",
   "Tell us about your event (optional)",
   "textarea",
   0
  ]
 ],
 "recreation": [
  [
   "act",
   "Activity",
   "select",
   1,
   [
    "Indoor pool",
    "Spa and massage",
    "Fitness"
   ]
  ],
  [
   "date",
   "Date",
   "date",
   1
  ],
  [
   "time",
   "Time",
   "time",
   1
  ],
  [
   "gu",
   "Guests",
   "select",
   1,
   [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6"
   ]
  ],
  [
   "name",
   "Full name",
   "text",
   1
  ],
  [
   "phone",
   "Phone number",
   "tel",
   1
  ],
  [
   "note",
   "Notes (optional)",
   "textarea",
   0
  ]
 ]
};

// fld(field): builds the HTML for one form field (input, select or textarea)
function fld([id,l,t,r,o]){const i='f_'+id,full=t=='textarea'?' full':'';let c;
 if(t=='select')c=`<select id="${i}">${o.map(x=>`<option>${esc(x)}</option>`).join('')}</select>`;
 else if(t=='textarea')c=`<textarea id="${i}"></textarea>`;
 else c=`<input id="${i}" type="${t}"${t=='number'?' min="1"':''}${t=='tel'?' inputmode="tel" autocomplete="tel"':''}${t=='email'?' autocomplete="email"':''}${t=='text'&&id=='name'?' autocomplete="name"':''}>`;
 return `<div class="${full.trim()}"><label for="${i}">${l}</label>${c}${t=='textarea'||t=='select'?'':'<div class="err"></div>'}</div>`}

// Build this page's form. The page name comes from <body data-page="...">
const d={f:FIELDS[document.body.dataset.page]};
$('#pf-fields').innerHTML=d.f.map(fld).join('');

/* Form checks: required fields, email format, phone length (7+ digits), guests 1+,
   check-out after check-in. On success a confirmation pop-up lists the answers. */
const f=$('#pf'),T=iso(new Date());$$('#pf input[type=date]').forEach(x=>x.min=T);
 const ci=$('#f_ci'),co=$('#f_co');if(ci)ci.onchange=()=>{if(ci.value){const n=new Date(ci.value);n.setDate(n.getDate()+1);co.min=iso(n);if(co.value&&co.value<=ci.value)co.value=iso(n)}};
 f.onsubmit=e=>{e.preventDefault();let first=null;const out=[];
  d.f.forEach(([id,l,t,r])=>{const el=$('#f_'+id),v=el.value.trim();let m='';
   if(r&&!v)m=`Enter ${l.toLowerCase()}.`;
   else if(t=='email'&&!/^\S+@\S+\.\S+$/.test(v))m='Enter a valid email, like name@example.com.';
   else if(t=='tel'&&v.replace(/\D/g,'').length<7)m='Enter a phone number with at least 7 digits.';
   else if(t=='number'&&v&&+v<1)m='Enter at least 1 guest.';
   else if(id=='co'&&v&&ci.value&&v<=ci.value)m='Choose a date after check-in.';
   const er=el.nextElementSibling;if(er&&er.classList.contains('err')){er.textContent=m;el.classList.toggle('bad',!!m)}
   if(m&&!first)first=el;if(v)out.push([l.replace(' (optional)','').replace(/,.*/,''),v])});
  if(first){first.focus();return}
  modal(`<h3>Request received</h3><p>Thank you. Here is what we have:</p><p>${out.map(([a,b])=>`<b>${esc(a)}:</b> ${esc(b)}`).join('<br>')}</p><p>Our team will confirm by phone or email.</p><button class="btn d" id="ok">Done</button>`);f.reset()}
