(function(){
  const keys=['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','gbraid','wbraid'];
  const params=new URLSearchParams(location.search);
  keys.forEach(key=>{const incoming=params.get(key);if(incoming) sessionStorage.setItem(key,incoming);const field=document.querySelector(`[name="${key}"]`);if(field) field.value=incoming||sessionStorage.getItem(key)||'';});
  const landing=document.querySelector('[name="landing_page"]');if(landing) landing.value=location.href;
  const preserved=new URLSearchParams();keys.forEach(k=>{const v=params.get(k)||sessionStorage.getItem(k);if(v)preserved.set(k,v)});
  const next=document.getElementById('next-url');if(next){const thankYou=document.documentElement.lang==='ar'?'thank-you-ar.html':'thank-you.html';next.value=new URL(thankYou,location.href).href+(preserved.size?'?'+preserved.toString():'');}
  document.querySelectorAll('[data-language-link]').forEach(link=>{link.href=link.getAttribute('href')+(preserved.size?'?'+preserved.toString():'');});
  const form=document.getElementById('lead-form');
  if(form) form.addEventListener('submit',async event=>{
    event.preventDefault();
    const button=form.querySelector('button[type="submit"]');
    const status=document.getElementById('form-status');
    const original=button.innerHTML;
    const isArabic=document.documentElement.lang==='ar';
    button.disabled=true;button.textContent=isArabic?'جارٍ الإرسال…':'Sending…';status.textContent='';status.className='form-status';
    try{
      const response=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});
      if(!response.ok) throw new Error('Submission failed');
      window.dataLayer=window.dataLayer||[];
      window.dataLayer.push({event:'lead_form_submit',form_id:'ready_mix_quote'});
      status.textContent=isArabic?'شكراً لك — تم استلام استفسارك.':'Thank you — your enquiry has been received.';status.classList.add('success');
      window.location.assign(next.value);
    }catch(error){
      status.textContent=isArabic?'تعذر إرسال طلبك. حاول مرة أخرى أو اتصل على 800 8687.':'We could not send your enquiry. Please try again or call 800 8687.';status.classList.add('error');
      button.disabled=false;button.innerHTML=original;
    }
  });
  const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
})();
