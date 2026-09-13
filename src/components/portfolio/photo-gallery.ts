class PhotoGallery extends HTMLElement {
  private cleanup?: () => void;

  connectedCallback() {
    if (this.cleanup) return;
    const slides = Array.from(this.querySelectorAll<HTMLElement>('.gallery-slide'));
    const stage = this.querySelector<HTMLElement>('.gallery-stage')!;
    const pause = this.querySelector<HTMLButtonElement>('.gallery-pause')!;
    const status = this.querySelector<HTMLElement>('.gallery-status')!;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const controller = new AbortController();
    const {signal} = controller;
    // One permutation per page load; arrows and gestures follow the same ring.
    for (let i = slides.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [slides[i], slides[j]] = [slides[j], slides[i]];
    }
    try {
      const previous = sessionStorage.getItem('gallery-first');
      if (slides.length > 1 && slides[0].dataset.photoId === previous) {
        [slides[0], slides[1]] = [slides[1], slides[0]];
      }
      sessionStorage.setItem('gallery-first', slides[0].dataset.photoId!);
    } catch { /* Storage may be unavailable; the shuffle still works. */ }
    slides.forEach((slide, i) => slide.setAttribute('aria-label', `${i + 1} / ${slides.length}`));
    let index = 0, visible = false, hover = false, focused = false, userPaused = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let busy = false, request = 0, animations: Animation[] = [];
    let drag: {id:number; x:number; y:number; dx:number; horizontal:boolean} | undefined;
    const wrap = (i:number) => (i + slides.length) % slides.length;
    const stop = () => { clearTimeout(timer); timer = undefined; };
    const canPlay = () => visible && !hover && !focused && !userPaused && !reduced.matches && !document.hidden && !drag;
    const schedule = () => { stop(); if (canPlay() && !busy && slides.length > 1) timer = setTimeout(() => void show(1, false), 6000); };
    const load = async (i:number) => {
      const img = slides[wrap(i)].querySelector('img')!;
      img.loading = 'eager';
      await img.decode();
    };
    const reset = () => slides.forEach((slide,i) => {
      slide.style.cssText = '';
      slide.toggleAttribute('data-active', i === index);
      slide.setAttribute('aria-hidden', String(i !== index));
    });
    const preload = () => { void load(index + 1).catch(() => {}); void load(index - 1).catch(() => {}); };
    const label = () => {
      pause.disabled = reduced.matches;
      pause.dataset.paused = String(userPaused || reduced.matches);
      pause.setAttribute('aria-label', userPaused ? this.dataset.playLabel! : this.dataset.pauseLabel!);
    };
    const run = async (element:HTMLElement, frames:Keyframe[], duration:number) => {
      const animation = element.animate(frames, {duration, easing:'cubic-bezier(.22,.68,0,1)', fill:'both'});
      animations.push(animation);
      await animation.finished.catch(() => {});
    };
    const show = async (direction:number, manual = true, offset = 0, fromDrag = false) => {
      if (busy || slides.length < 2) return;
      stop(); busy = true;
      const ticket = ++request, next = wrap(index + direction);
      try { await load(next); } catch { busy = false; reset(); schedule(); return; }
      if (ticket !== request || !this.isConnected) return;
      if (!manual && !canPlay()) { busy = false; schedule(); return; }
      const outgoing = slides[index], incoming = slides[next];
      const width = stage.clientWidth;
      incoming.style.opacity = '1'; incoming.style.zIndex = '1'; outgoing.style.zIndex = '0';
      const mode = fromDrag ? 'slide' : this.dataset.transition || 'zoom';
      const duration = reduced.matches ? 0 : fromDrag ? 360 : 700;
      let a:Keyframe[], b:Keyframe[];
      if (mode === 'fade') {
        a = [{opacity:1}, {opacity:0}]; b = [{opacity:0}, {opacity:1}];
      } else if (mode === 'zoom') {
        a = [{opacity:1,transform:'scale(1)'},{opacity:0,transform:'scale(1.035)'}];
        b = [{opacity:0,transform:'scale(1.06)'},{opacity:1,transform:'scale(1)'}];
      } else if (mode === 'reveal') {
        a = [{transform:'scale(1)'},{transform:'scale(.98)'}];
        b = [{clipPath:direction > 0 ? 'inset(0 0 0 100%)':'inset(0 100% 0 0)'},{clipPath:'inset(0 0 0 0)'}];
      } else {
        a = [{transform:`translateX(${offset}px)`},{transform:`translateX(${-direction*width}px)`}];
        b = [{transform:`translateX(${direction*width+offset}px)`},{transform:'translateX(0px)'}];
      }
      await Promise.all([run(outgoing,a,duration), run(incoming,b,duration)]);
      if (ticket !== request) return;
      index = next; animations.forEach(a => a.cancel()); animations = []; reset(); busy = false;
      if (manual) status.textContent = `${index+1} / ${slides.length}: ${incoming.querySelector('img')!.alt}`;
      preload(); schedule();
    };
    reset(); this.dataset.ready = 'true'; void load(index).catch(() => {}); preload();
    this.querySelector('.gallery-prev')!.addEventListener('click', () => void show(-1), {signal});
    this.querySelector('.gallery-next')!.addEventListener('click', () => void show(1), {signal});
    pause.addEventListener('click', () => { userPaused = !userPaused; label(); schedule(); }, {signal});
    stage.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); void show(e.key === 'ArrowLeft' ? -1 : 1); }
    }, {signal});
    this.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { hover = true; schedule(); } }, {signal});
    this.addEventListener('pointerleave', () => { hover = false; schedule(); }, {signal});
    this.addEventListener('focusin', () => { focused = !!this.querySelector(':focus-visible'); schedule(); }, {signal});
    this.addEventListener('pointerdown', () => { focused = false; schedule(); }, {signal});
    this.addEventListener('keydown', () => { focused = true; schedule(); }, {signal});
    this.addEventListener('focusout', e => { if (!this.contains(e.relatedTarget as Node)) { focused = false; schedule(); } }, {signal});
    stage.addEventListener('pointerdown', e => {
      if (busy || !e.isPrimary || e.button !== 0 || (e.target as Element).closest('button')) return;
      drag = {id:e.pointerId,x:e.clientX,y:e.clientY,dx:0,horizontal:false}; stop();
      stage.setPointerCapture(e.pointerId);
    }, {signal});
    stage.addEventListener('pointermove', e => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX-drag.x, dy = e.clientY-drag.y;
      if (!drag.horizontal && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) { finish(true); return; }
      if (!drag.horizontal && Math.abs(dx) < 6) return;
      drag.horizontal = true; drag.dx = Math.max(-stage.clientWidth, Math.min(stage.clientWidth,dx));
      this.dataset.dragging = 'true';
      const direction = drag.dx < 0 ? 1 : -1;
      reset();
      slides[index].style.transform = `translateX(${drag.dx}px)`;
      const neighbor = slides[wrap(index+direction)];
      neighbor.style.opacity = '1'; neighbor.style.transform = `translateX(${direction*stage.clientWidth+drag.dx}px)`;
    }, {signal});
    const finish = (cancel = false) => {
      if (!drag) return;
      const gesture = drag; drag = undefined; delete this.dataset.dragging;
      if (stage.hasPointerCapture(gesture.id)) stage.releasePointerCapture(gesture.id);
      if (!cancel && gesture.horizontal && Math.abs(gesture.dx) > Math.min(90,stage.clientWidth*.18)) {
        void show(gesture.dx < 0 ? 1 : -1,true,gesture.dx,true);
      } else if (gesture.horizontal) {
        busy = true;
        const direction = gesture.dx < 0 ? 1 : -1, width = stage.clientWidth;
        void Promise.all([
          run(slides[index],[{transform:`translateX(${gesture.dx}px)`},{transform:'translateX(0px)'}],reduced.matches?0:250),
          run(slides[wrap(index+direction)],[{transform:`translateX(${direction*width+gesture.dx}px)`},{transform:`translateX(${direction*width}px)`}],reduced.matches?0:250),
        ]).then(() => { animations.forEach(a=>a.cancel()); animations=[];reset();busy=false;schedule(); });
      } else { reset(); schedule(); }
    };
    stage.addEventListener('pointerup', () => finish(), {signal});
    stage.addEventListener('pointercancel', () => finish(true), {signal});
    stage.addEventListener('lostpointercapture', () => finish(true), {signal});
    document.addEventListener('visibilitychange', schedule, {signal});
    reduced.addEventListener('change', () => { label(); schedule(); }, {signal});
    const observer = new IntersectionObserver(entries => {visible=entries[0].isIntersecting;schedule();},{threshold:.2});
    observer.observe(this); label();
    this.cleanup = () => {stop();request++;animations.forEach(a=>a.cancel());observer.disconnect();controller.abort();};
  }
  disconnectedCallback() { this.cleanup?.(); this.cleanup=undefined; }
}
if (!customElements.get('photo-gallery')) customElements.define('photo-gallery', PhotoGallery);
