
import { checkSlide, slider, closeSlider, nextSlide, animationSlide, defineFisrtLast, createListTimers, fillListTimer, sendAnimateTimer, timerSlide } from './functionsSlider.js';

$( document ).ready(() => {

    $(checkSlide).each((id, item) => {
        $(item).on('click', () => {
            if ($(slider).children().length === 1) {
                let storyId = id, slideId = 0, thisSlides, timerSlides, callElements = [], startAnimate, startAnimateFunction;
                $('body').addClass('overflow');
                $(slider).addClass('open');
                let addedBlock = $('<div>')
                .attr('class', `story-slider__block story-slider__block--${$(item).data('item')}`);
                $(slider).addClass(`story-slider--${$(checkSlide[storyId]).data('item')}`)
                thisSlides = $(item).find('.slides-mobile__slides').children()
                $(slider).off('DOMNodeInserted').on('DOMNodeInserted', function(event) {                  
                    if ($(event.target).hasClass('story-slider__block')) {
                        setTimeout(() => {
                            addedBlock = $(slider).find('.story-slider__block');
                            createListTimers(addedBlock, thisSlides);
                            if (storyId < checkSlide.length && storyId != -1 ) {
                                setTimeout(() => {
                                    timerSlides = fillListTimer(thisSlides, timerSlides, storyId); 
                                    animationSlide(timerSlides, slideId);
                                    startAnimate = setInterval(() => {
                                        callElements = sendAnimateTimer(addedBlock, storyId, slideId++, thisSlides, timerSlides, startAnimate);
                                        storyId = callElements[0];
                                        slideId = callElements[1];
                                        thisSlides = callElements[2];
                                    }, timerSlide);
                                }, 300)
                                defineFisrtLast(thisSlides)
                            }
                        }, 1) 
                    }
                });
                $(slider).append(addedBlock);
                $(addedBlock).append($(thisSlides[0]).clone());

                let initialPoint;
                let finalPoint;
    
                $(slider).off('touchstart', '.story-slider__block').on('touchstart', '.story-slider__block', function(e) {
                    initialPoint = e.originalEvent.changedTouches[0];
                });

                $(slider).off('touchend', '.story-slider__block').on('touchend', '.story-slider__block', function(e) {
                    finalPoint = e.originalEvent.changedTouches[0]
                    let xAbs = Math.abs(initialPoint.pageX - finalPoint.pageX);
                    let yAbs = Math.abs(initialPoint.pageY - finalPoint.pageY);
                    if (xAbs > 30 || yAbs > 150) {
                        if (startAnimate && $(slider).find('.story-slider__block').length === 1) {
                            if (yAbs > xAbs) {
                                if (finalPoint.pageY > initialPoint.pageY) {
                                    closeSlider(startAnimate);
                                }
                            } else {
                                if (finalPoint.pageX < initialPoint.pageX) {
                                    storyId++;
                                    thisSlides = nextSlide('next', this, storyId, thisSlides, startAnimate);
                                    slideId = 0;
                                } else {
                                    storyId--;
                                    thisSlides = nextSlide('prew', this, storyId, thisSlides, startAnimate);
                                    slideId = 0;
                                }
                            }
                        }
                    }
                })
                $(slider).off('click', '.story-slider__block').on('click', '.story-slider__block', function(e) {
                    if (startAnimate && $(slider).find('.story-slider__block').length === 1) {
                        const halfWidth = $(this).width() / 2;
                        timerSlides = $(slider).find('.story-slider__list-block');
                        if (e.clientX > halfWidth) {
                            if ($(thisSlides[slideId]).data('id') === 'last') {
                                storyId++;
                                thisSlides = nextSlide('next', this, storyId, thisSlides, startAnimate);
                                slideId = 0;
                            } else {
                                $(this).children('div').remove();
                                clearInterval(startAnimate);
                                $(timerSlides[slideId]).find('div').removeClass('start-animation')
                                $(timerSlides[slideId]).find('div').addClass('end-animation')
                                slideId++;
                                $(this).append($(thisSlides[slideId]).clone());
                                animationSlide(timerSlides, slideId);
                                startAnimate = setInterval(() => {
                                    callElements = sendAnimateTimer(addedBlock, storyId, slideId, thisSlides, timerSlides, startAnimate);
                                    storyId = callElements[0];
                                    slideId = callElements[1];
                                    thisSlides = callElements[2];
                                }, timerSlide);
                            }
                        } else {
                            if (($(thisSlides[slideId]).data('id') === 'first' && thisSlides.length > 1) || ($(thisSlides[slideId]).data('id') === 'last' && thisSlides.length === 1)) {
                                storyId--;
                                thisSlides = nextSlide('prew', this, storyId, thisSlides, startAnimate);
                                slideId = 0;
                            } else {
                                $(this).children('div').remove();
                                clearInterval(startAnimate);
                                $(timerSlides[slideId]).find('div').removeClass('start-animation')
                                $(timerSlides[slideId]).find('div').removeClass('end-animation');
                                slideId--;
                                
                                $(timerSlides[slideId]).find('div').removeClass('start-animation')
                                $(this).append($(thisSlides[slideId]).clone());
                                setTimeout(() => {
                                    animationSlide(timerSlides, slideId);
                                    startAnimate = setInterval(() => {
                                        callElements = sendAnimateTimer(addedBlock, storyId, slideId, thisSlides, timerSlides, startAnimate);
                                        storyId = callElements[0];
                                        slideId = callElements[1];
                                        thisSlides = callElements[2];
                                    }, timerSlide);
                                }, 1)
                            }
                        }
                    }
                })

                $('.story-slider__cross').off('click').on('click', () => {
                    closeSlider(startAnimate)
                })
            }
        })
    })
})