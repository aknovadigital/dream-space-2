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