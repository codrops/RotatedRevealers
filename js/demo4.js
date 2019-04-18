/**
 * demo4.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2019, Codrops
 * http://www.codrops.com
 */
{
    class Revealer {
        constructor(el, options) {
            this.options = {
                angle: 0
            };
            Object.assign(this.options, options);

            this.DOM = {};
            this.DOM.el = el;
            this.DOM.inner = this.DOM.el.firstElementChild;
            
            this.DOM.inner.style.width = `calc(100vw * ${Math.abs(Math.cos(this.options.angle * Math.PI/180))} + 100vh * ${Math.abs(Math.sin(this.options.angle * Math.PI/180))})`;
            this.DOM.inner.style.height = `calc(100vw * ${Math.abs(Math.sin(this.options.angle * Math.PI/180))} + 100vh * ${Math.abs(Math.cos(this.options.angle * Math.PI/180))})`;
            this.DOM.el.style.transform = `rotate3d(0,0,1,${this.options.angle}deg)`;

            this.DOM.reverse = this.DOM.inner.querySelector('.content__reverse');
            if ( this.DOM.reverse ) {
                TweenMax.set(this.DOM.reverse, {rotation: -1*this.options.angle});
            }
        }
    }

    // Content elements
    const content = {
        first: document.querySelector('.content--first'),
        second: document.querySelector('.content--second')
    };

    // First page's content.
    const firstPageContent = {
        img: content.first.querySelector('.intro__img'),
        title: content.first.querySelector('.intro__title'),
        enter: content.first.querySelector('.intro__enter')
    };

    // Splitting letters for the firstPageContent.title element (just adding a bit more feeling to it)
    charming(firstPageContent.title);
    firstPageContent.titleLetters = [...firstPageContent.title.querySelectorAll('span')];
    firstPageContent.titleLetters.sort(() => Math.round(Math.random())-0.5);
    // some random letters
    let letters = firstPageContent.titleLetters.filter(_ => Math.random() < .5);
    // remaining
    let otherletters = firstPageContent.titleLetters.filter(el => letters.indexOf(el) < 0);

    // Second page's content.
    const secondPageContent = {
        menuLinks: content.second.querySelectorAll('.menu__link'),
        backCtrl: content.second.querySelector('.content__back'),
        overlayElems: [...content.second.querySelectorAll('.overlay')]
    };

    // Angle of rotation
    const angle = -60;

    // overlays
    const overlays = [];
    const overlaysTotal = secondPageContent.overlayElems.length;
    secondPageContent.overlayElems.forEach((overlay,i) => overlays.push(new Revealer(overlay, {angle: i % 2 === 0 ? -1*angle : angle})));

    // Revealer element (first page)
    const revealer = new Revealer(content.first, {angle: angle});
    
    // Animate things: show revealer animation, animate first page elements out (optional) and animate second page elements in (optional)
    const showNextPage = () => {
        // Pointer events related class
        content.first.classList.add('content--hidden');

        const ease = Expo.easeInOut;
        const duration = 1.3;
        
        this.pageToggleTimeline = new TimelineMax()
        // Animate first page elements (optional)
        .to(firstPageContent.img, duration, {
            ease: ease,
            x: -150,
            opacity: 0
        }, 0)
        .staggerTo(otherletters, duration*0.8, {
            ease: ease,
            y: '-100%',
            scaleX: 0.8,
            scaleY: 1.5,
            opacity: 0
        }, 0.04, 0)
        .to(firstPageContent.enter, duration*0.5, {
            ease: ease,
            opacity: 0
        }, 0)
        
        // "Unreveal effect" (inner moves to one direction and reverse moves to the opposite one)
        .to(revealer.DOM.inner, duration, {
            ease: ease,
            y: '-100%'
        }, 0)
        .to(revealer.DOM.reverse, duration, {
            ease: ease,
            y: '100%'
        }, 0)

        .set(secondPageContent.menuLinks[overlaysTotal], {x: angle > 0 ? '140%' : '-140%'}, 0)
        .to(secondPageContent.menuLinks[overlaysTotal], duration, {
            ease: Expo.easeOut,
            x: '0%'
        }, 0);
        
        // Animate overlays
        let t = 0;
        for (let i = 0; i <= overlaysTotal-1; ++i) {
            t = 0.35*i+0.35;
            this.pageToggleTimeline
            .to(overlays[overlaysTotal-1-i].DOM.inner, duration, {
                ease: ease,
                y: '-100%'
            }, t)
            .set(secondPageContent.menuLinks[overlaysTotal-1-i], {x: i % 2 === 0 ? '140%' : '-140%'}, t)
            .to(secondPageContent.menuLinks[overlaysTotal-1-i], duration, {
                ease: Expo.easeOut,
                x: '0%'
            }, t+0.1);
        }
    };
    firstPageContent.enter.addEventListener('click', showNextPage);

    // Animate back
    const showIntro = () => {
        // Pointer events related class
        content.first.classList.remove('content--hidden');
        this.pageToggleTimeline.reverse();
    };
    secondPageContent.backCtrl.addEventListener('click', showIntro);

    // Hover animation on the intro "enter" element
    let enterHoverAnimationRunning = false;
    const onEnterHoverFn = () => {
        if ( enterHoverAnimationRunning ) {
            return false;
        }
        enterHoverAnimationRunning = true;
        
        letters = firstPageContent.titleLetters.filter(_ => Math.random() < .5);
        otherletters = firstPageContent.titleLetters.filter(el => letters.indexOf(el) < 0);

        new TimelineMax({onComplete: () => enterHoverAnimationRunning = false})
        .staggerTo(letters, 0.2, {
            ease: Quad.easeIn,
            y: '-100%',
            opacity: 0
        }, 0.04, 0)
        .staggerTo(letters, 0.6, {
            ease: Quint.easeOut,
            startAt: {y: '35%'},
            y: '0%',
            opacity: 1
        }, 0.04, 0.2);
    };
    firstPageContent.enter.addEventListener('mouseenter', onEnterHoverFn);
}