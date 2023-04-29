const checkSlide = $('.slides-mobile__block');
const slider = document.querySelector('.story-slider');
const timerSlide = 3000;

const closeSlider = (interval) => {
    setTimeout(() => {
        $(slider).children('div').remove();
    }, 300)
    $(slider).removeClass('open');
    $('body').removeClass('overflow');
    clearInterval(interval);
}

const defineFisrtLast = (slides) => {
    $(slides[0]).attr('data-id', 'first');
    $(slides[slides.length - 1]).attr('data-id', 'last');
}

const createListTimers = (block, slides) => {
    const listCount = $('<section>').attr('class', 'story-slider__list').css('grid-template-columns', `repeat(${slides.length}, 1fr)`);
    $(block).append(listCount);
    $(slides).each((id, item) => {
        const listCountBlock = $('<div>').attr('class', 'story-slider__list-block').attr('data-id', `${id}`)
        $(listCount).append(listCountBlock);
    })
}

const fillListTimer = (slides, list, id) => {
    $(slider).find('.story-slider__block').length > 1 ? 
    list = $(slider).find(`.story-slider__block--${$(checkSlide[id]).data('item')}`).find('.story-slider__list-block') :
    list = $(slider).find('.story-slider__list-block');
    $(slides).each((id, item) => {
        const timerBLock = $('<div>');
        $(list[id]).append(timerBLock);
    })
    return list;
}

const sendAnimateTimer = (block, storyId, slideId, slides, timerSlides, interval) => {
    $(block).children('div').remove();
    slideId++;
    $(block).append($(slides[slideId]).clone());
    animationSlide(timerSlides, slideId);
    if (slideId === slides.length) {
        storyId++;
        clearInterval(interval);
        slides = nextSlide('next', block, storyId, slides);
        slideId = 0;
    }
    return [storyId, slideId, slides];
}

const nextSlide = (param, el, id, slides, interval) => {
    let nextBlock = $('<div>')
    .attr('class', `story-slider__block story-slider__block--${$(checkSlide[id]).data('item')}`);
    param === 'next' ?
    $(slider).removeClass(`story-slider--${$(checkSlide[id - 1]).data('item')}`) :
    $(slider).removeClass(`story-slider--${$(checkSlide[id + 1]).data('item')}`);
    if (id < checkSlide.length && param === 'next') {
        $(el).addClass('story-slider__block--animation-out-left');
        $(slider).addClass(`story-slider--${$(checkSlide[id]).data('item')}`)
    } else if (id > -1 && param === 'prew') {
        $(el).addClass('story-slider__block--animation-onset-left');
        $(slider).addClass(`story-slider--${$(checkSlide[id]).data('item')}`)
    }
    setTimeout(() => {
        $(el).remove();
    }, 500)
    $(slider).append(nextBlock);
    param === 'next' ?
    $(nextBlock).addClass('story-slider__block--animation-onset-left') :
    $(nextBlock).addClass('story-slider__block--animation-out-left');
    setTimeout(() => {
        param === 'next' ?
        $(nextBlock).removeClass('story-slider__block--animation-onset-left') :
        $(nextBlock).removeClass('story-slider__block--animation-out-left');
    }, 100);
    slides = $($(checkSlide[id])).find('.slides-mobile__slides').children();
    defineFisrtLast(slides);
    $(nextBlock).append($(slides[0]).clone());
    clearInterval(interval);
    if (id > checkSlide.length - 1 && param === 'next') {
        closeSlider(interval);
    } else if (id < 0 && param === 'prew') {
        closeSlider(interval);
    }
    return slides;
}

const animationSlide = (block, id) => { 
    $(block[id]).find('div').addClass('start-animation');
}

export { checkSlide, slider, nextSlide, closeSlider, animationSlide, defineFisrtLast, createListTimers, fillListTimer, sendAnimateTimer, timerSlide};
