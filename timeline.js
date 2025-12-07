window.onload = () => {
  gsap.registerPlugin(ScrollTrigger);

  const wrapper = document.querySelector(".timeline-wrapper");
  const section = document.querySelector(".timeline-section");
  const items = document.querySelectorAll(".timeline-item");

  if (!wrapper || !section || items.length === 0) return;

  const lastItem = items[items.length - 1];

  // Where the last card ends horizontally
  const lastItemRight = lastItem.offsetLeft + lastItem.offsetWidth;

  // How much we need to translate for full timeline reveal
  const stopX = lastItemRight - window.innerWidth + 100;

  if (window.innerWidth > 900) {
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=" + stopX,
        scrub: 1,
        pin: true,
        markers: false
      }
    });

    // --------- Move the entire timeline ---------
    tl.to(wrapper, {
      x: -stopX,
      ease: "none"
    });

    // --------- Move the circle (timeline-progress) ---------
    tl.to(".timeline-progress", {
      x: stopX,
      ease: "none"
    }, 0); // synced start

    // --------- Wave effect and glow ---------
    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=" + stopX,
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;        // 0 → 1 through entire scroll
        const wave = Math.sin(p * Math.PI * 6) * 35; // wave intensity
        const glow = (Math.sin(p * Math.PI * 6) + 1) * 15;

        gsap.set(".timeline-progress", {
          y: wave,
          boxShadow: `0 0 ${10 + glow}px #ff2ea6`
        });
      }
    });
  }
};
