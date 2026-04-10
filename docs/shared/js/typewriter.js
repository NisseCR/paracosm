// shared/js/typewriter.js
export function makeCursor() {
    const c = document.createElement('span');
    c.className = 'tw-cursor';
    return c;
}

export function typeInto(el, text, speed, onDone) {
    el.textContent = '';
    const cursor = makeCursor();
    el.appendChild(cursor);

    let i = 0;
    const tick = setInterval(() => {
        el.insertBefore(document.createTextNode(text[i]), cursor);
        i++;

        if (i >= text.length) {
            clearInterval(tick);
            setTimeout(() => {
                cursor.classList.add('done');
                cursor.addEventListener('animationend', () => cursor.remove(), { once: true });
                if (onDone) onDone();
            }, 500);
        }
    }, speed);
}