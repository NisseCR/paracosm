// shared/js/typewriter.js

export function makeCursor() {
    const cursor = document.createElement('span');
    cursor.className = 'tw-cursor';
    return cursor;
}

/**
 * Types text into an element one character at a time.
 */
export function typeInto(el, text, speed, onDone) {
    if (!el) return;

    el.textContent = '';
    const cursor = makeCursor();
    el.appendChild(cursor);

    let index = 0;
    const tick = setInterval(() => {
        if (index < text.length) {
            el.insertBefore(document.createTextNode(text[index]), cursor);
            index += 1;
            return;
        }

        clearInterval(tick);

        window.setTimeout(() => {
            cursor.classList.add('done');
            cursor.addEventListener('animationend', () => cursor.remove(), { once: true });

            if (typeof onDone === 'function') {
                onDone();
            }
        }, 500);
    }, speed);
}