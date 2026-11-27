const body=document.body;
const loader=document.querySelector(".loader");
const themeToggle=document.querySelector(".theme-toggle");
const menuToggle=document.querySelector(".menu-toggle");
const menuClose=document.querySelector(".menu-close");
const mobileMenu=document.querySelector(".mobile-menu");

window.addEventListener("load",()=>{
  setTimeout(()=>loader.classList.add("done"),450);
  document.querySelectorAll(".hero-content > *,.hero-kicker,.hero-scroll").forEach((el,i)=>{
    el.animate([{opacity:0,transform:"translateY(24px)"},{opacity:1,transform:"translateY(0)"}],{duration:900,delay:650+i*130,easing:"cubic-bezier(.2,.7,.2,1)",fill:"both"});
  });
});

themeToggle.addEventListener("click",()=>{
  body.classList.toggle("dark");
  const dark=body.classList.contains("dark");
  themeToggle.querySelector(".theme-label").textContent=dark?"DARK":"LIGHT";
  themeToggle.querySelector(".theme-icon").textContent=dark?"☾":"☼";
});

menuToggle.addEventListener("click",()=>mobileMenu.classList.add("open"));
menuClose.addEventListener("click",()=>mobileMenu.classList.remove("open"));
mobileMenu.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>mobileMenu.classList.remove("open")));

if(window.gsap&&window.ScrollTrigger){
  gsap.registerPlugin(ScrollTrigger);
  gsap.to(".hero-image",{scale:1, duration:1.8,ease:"power2.out"});
  gsap.utils.toArray(".intro h2,.section-heading,.property-card,.manifesto-content,.closing h2,.closing-bottom").forEach(el=>{
    gsap.fromTo(el,{y:45,opacity:0},{y:0,opacity:1,duration:1,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 86%",once:true}});
  });
  gsap.to(".manifesto-image",{yPercent:12,ease:"none",scrollTrigger:{trigger:".manifesto",start:"top bottom",end:"bottom top",scrub:true}});
  gsap.to(".hero-image",{yPercent:10,ease:"none",scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:true}});
}else{
  document.querySelectorAll(".intro h2,.section-heading,.property-card,.manifesto-content,.closing h2,.closing-bottom").forEach(el=>el.style.opacity=1);
}
/* Property category selector: each tab swaps to its own image and copy. */
(()=>{
  const collection=[
    {id:"villas",tag:"VILLAS · NORTH GOA",title:"The art of<br><em>slowing down.</em>",description:"Private villas, thoughtful details and room to make every day your own.",image:"https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1800&q=90",className:"photo-villas"},
    {id:"apartments",tag:"APARTMENTS · NORTH GOA",title:"A new view<br><em>every morning.</em>",description:"Contemporary apartments close to the energy, dining and ease of Goa.",image:"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=90",className:"photo-apartments"},
    {id:"homes",tag:"PRIVATE HOMES · ASSAGAO",title:"Room to<br><em>be yourself.</em>",description:"Distinctive homes with privacy, character and space to settle in.",image:"https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1800&q=90",className:"photo-homes"},
    {id:"land",tag:"LAND & PLOTS · GOA",title:"Make space<br><em>for possibility.</em>",description:"A canvas for your own vision, in a place worth putting down roots.",image:"https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=90",className:"photo-land"}
  ];
  let active=0;
  const photo=document.querySelector(".featured-photo");
  const tabs=[...document.querySelectorAll(".property-tab")];
  const thumbs=[...document.querySelectorAll(".property-thumb")];
  const tag=document.querySelector("#featured-tag");
  const title=document.querySelector("#featured-title");
  const description=document.querySelector("#featured-description");
  const count=document.querySelector("#featured-count");
  const lightbox=document.querySelector(".photo-lightbox");
  const lightboxImage=lightbox.querySelector("img");
  function selectProperty(index){
    active=(index+collection.length)%collection.length;
    const item=collection[active];
    photo.className="featured-photo "+item.className;
    tag.textContent=item.tag;
    title.innerHTML=item.title;
    description.textContent=item.description;
    count.textContent=String(active+1).padStart(2,"0")+" / 04 — THE COLLECTION";
    tabs.forEach((tab,i)=>{const selected=i===active;tab.classList.toggle("active",selected);tab.setAttribute("aria-selected",String(selected));});
    thumbs.forEach((thumb,i)=>thumb.classList.toggle("selected",i===active));
    if(window.gsap){gsap.fromTo([tag,title,description],{y:18,opacity:0},{y:0,opacity:1,duration:.55,stagger:.08,ease:"power2.out"});gsap.fromTo(photo,{opacity:.65,scale:.985},{opacity:1,scale:1,duration:.7,ease:"power2.out"});}
    else{[tag,title,description].forEach(el=>{el.animate([{opacity:0,transform:"translateY(12px)"},{opacity:1,transform:"translateY(0)"}],{duration:450,fill:"both"});});}
  }
  tabs.forEach((tab,i)=>tab.addEventListener("click",()=>selectProperty(i)));
  thumbs.forEach((thumb,i)=>thumb.addEventListener("click",()=>selectProperty(i)));
  document.querySelector(".feature-arrow.previous").addEventListener("click",()=>selectProperty(active-1));
  document.querySelector(".feature-arrow.next").addEventListener("click",()=>selectProperty(active+1));
  photo.addEventListener("click",()=>{lightboxImage.src=collection[active].image;lightbox.classList.add("open");lightbox.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";});
  function closeLightbox(){lightbox.classList.remove("open");lightbox.setAttribute("aria-hidden","true");document.body.style.overflow="";}
  lightbox.querySelector(".lightbox-close").addEventListener("click",closeLightbox);
  lightbox.addEventListener("click",e=>{if(e.target===lightbox)closeLightbox();});
  document.addEventListener("keydown",e=>{if(e.key==="Escape")closeLightbox();});
})();
