import {gsap} from "gsap";
import {onLoad} from "../../inc/scripts/dependencies/onLoad";

onLoad(() => {
    const elements = document.querySelectorAll<HTMLElement>('[data-job-offers]');
    const cursor = document.querySelector<HTMLElement>('[data-cursor], [data-cursor="active"]');

    if (cursor) {
        cursorLabel(elements, cursor);
    }
})

function cursorLabel(elements: NodeListOf<HTMLElement>, cursor: HTMLElement) {
    let label: HTMLSpanElement | null = null;
    let currentThumbnailUrl: string | null = null;
    let prevMouseY: number | null = null;
    let prevMouseX: number | null = null;
    let rotateLabel: Function;
    let resetRotationTimer: number;

    elements.forEach(element => {
        element.addEventListener('mouseover', (e) => {
            if (!label) {
                setLabel();
            }
        });

        element.addEventListener('mouseleave', () => {
            if (label) {
                removeLabel();
            }
        });

        element.addEventListener('mousemove', (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const deltaY = (event.clientY - prevMouseY) * -1;

            if (target.classList.contains('vacature')) {
                setLabelBg(target);
            }

            moveLabel(deltaY);

            prevMouseY = event.clientY;
            prevMouseX = event.clientX;
        });
    });

    window.addEventListener('wheel', (e) => {
        if (!prevMouseY || !prevMouseX) {
            return
        }

        const els: Element[] = document.elementsFromPoint(prevMouseX, prevMouseY);
        let target: Element = null;

        els.forEach(el => {
            if (el.parentElement?.hasAttribute('data-job-offers')) {
                target = el;
            }
        })

        if (!target && label) {
            removeLabel()
        } else if (target) {
            if (!label) {
                setLabel();
            } else {
                setLabelBg(target);
                moveLabel(e.deltaY * -1);
            }
        }
    });

    //ADD LABEL AND SET GSAP MOVEMENTS

    function setLabel() {
        label = document.createElement('span');
        label.setAttribute('data-cursor-label', '');
        label.style.transform = 'translate(0, -160px)';
        cursor.appendChild(label);

        const quickRotate = gsap.quickTo(label, 'rotation', {duration: 1, ease: "elastic.out"});
        const quickTranslateX = gsap.quickTo(label, 'x', {duration: 1, ease: "elastic.out"});
        const quickTranslateY = gsap.quickTo(label, 'y');

        rotateLabel = (valTranslateX: number, valRotation: number) => {
            valRotation = Math.max(Math.min(valRotation, 30), -30);
            valTranslateX = Math.max(Math.min(valTranslateX, 251), -251);

            quickRotate(valRotation);
            quickTranslateX(valTranslateX * 0.5);
            quickTranslateY(-160);

            clearTimeout(resetRotationTimer);
            resetRotationTimer = setTimeout(() => {
                quickRotate(0);
                quickTranslateX(0);
            }, 100);
        }
    }

    //REMOVE LABEL

    function removeLabel() {
        label.remove();
        label = null;
        currentThumbnailUrl = null;
        rotateLabel = () => {
        };
    }

    //ANIMATE LABEL MOVEMENT

    function moveLabel(deltaY: number) {
        if (prevMouseY !== null && label) {
            const radians = deltaY * (Math.PI / 180);
            const hypotenuse = 0.5 * label.querySelector('img')?.getBoundingClientRect().height;
            const opposite = hypotenuse * Math.sin(radians);

            rotateLabel(opposite * 2, deltaY);
        }
    }

    //SET IMAGE SRC OF BACKGROUND

    function setLabelBg(target: Element) {
        const bg = target.getAttribute('data-thumbnail-url');

        if (bg !== currentThumbnailUrl) {
            currentThumbnailUrl = bg;

            if (bg && label) {
                label.innerHTML = '';
                const labelImage = document.createElement('img');
                labelImage.src = bg;
                labelImage.alt = 'Vacature';
                label.appendChild(labelImage);
            } else if (label) {
                label.innerHTML = '';
            }
        }
    }
}
