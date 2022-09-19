

class Carousel {

    /**
     * 
     * @callback moveCallback
     * @param {number} index
     */



    /**
     * 
     * @param {HTMLElement} element
     * @param {Object} options
     * @param {Object} [options.slidesToScroll=1] Nombre d'éléments à faire défiler
     * @param {Object} [options.slidesVisible=1] Nombre d'éléments visible dans un slide
     * @param {boolean} [options.loop=false] Reviens au début à la fin du carousel
     * @param {boolean} [options.pagination=false] Pagine le Carousel
     * @param {boolean} [options.navigation=true] Ajoute la navigation du Carousel
     * 
     */
    constructor(element, options = {}){
        this.element = element
        this.options = Object.assign({}, {
            slidesToScroll: 1,
            slidesVisible: 1,
            loop: false,
            pagination: false,
            nagigation: true
        }, options)
        let children = [].slice.call(element.children)
        this.isMobile = false
        this.currentItem = 0
        this.moveCallbacks = []

        // DOM modification
        this.root = this.createDivWithClass('carousel')
        this.root.setAttribute('tabindex', '0')
        this.container = this.createDivWithClass('carousel__container')
        this.root.appendChild(this.container)
        this.element.appendChild(this.root)
        this.items = children.map(child => {
            let item = this.createDivWithClass('carousel__item')
            item.appendChild(child)
            this.container.appendChild(item)
            return item
        });
        this.setSyle()
        if(this.options.nagigation ===true) {
            this.createNavigation()
        }
        if(this.options.pagination === true) {
            this.createPagination()
        }

        // Events
        this.moveCallbacks.forEach(cb => cb(0))
        this.onResize()
        window.addEventListener('resize', this.onResize.bind(this))
        this.root.addEventListener('keyup', (e) => {
            if(e.key === 'ArrowRight' || e.key === 'Right') {
                this.next()
            } else if(e.key === 'ArrowLeft' || e.key === 'Left') {
                this.prev()
            }

        })
    }

    /**
     * Donne les dimensions au carousel
     */
    setSyle() {
        let ratio = this.items.length / this.slidesVisible
        this.container.style.width = (ratio * 100) + "%"
        this.items.forEach(item => {
            item.style.width = ((100 / this.slidesVisible) / ratio) + "%"
            
        });
    }

    createNavigation() {
        let nextButton = this.createDivWithClass('carousel__next')
        let prevButton = this.createDivWithClass('carousel__prev')
        this.root.appendChild(prevButton)
        this.root.appendChild(nextButton)
        nextButton.addEventListener('click', this.next.bind(this))
        prevButton.addEventListener('click', this.prev.bind(this))
        if(this.options.loop === true) {
            return
        }
        this.onMove(index => {
            if(index=== 0) {
                prevButton.classList.add('carousel__prev--hidden')
            } else {
                prevButton.classList.remove('carousel__prev--hidden')
            }
            if(this.items[this.currentItem + this.slidesVisible] === undefined) {
                nextButton.classList.add('carousel__next--hidden')
            } else {
                nextButton.classList.remove('carousel__next--hidden')
            }
        })
    }

    createPagination() {
        let pagination = this.createDivWithClass('carousel__pagination')
        let buttons = []
        this.root.appendChild(pagination)
        for(let i = 0; i < this.items.length; i = i + this.options.slidesToScroll) {
            let button = this.createDivWithClass('carousel__pagination__button')
            button.addEventListener('click', () => this.gotoItem(i))
            pagination.appendChild(button)
            buttons.push(button)
        }
        this.onMove(index => {
            let activeButton = buttons[Math.floor(index / this.options.slidesToScroll)]
            if (activeButton) {
                buttons.forEach(button => button.classList.remove('carousel__pagination__button--active'))
                activeButton.classList.add('carousel__pagination__button--active')
            }
        })
    }

    next() {
        this.gotoItem(this.currentItem + this.slidesToScroll)

    }

    prev() {
        this.gotoItem(this.currentItem - this.slidesToScroll)
    }

    /**
     * 
     * @param {number} index 
     */
    gotoItem(index) {
        if(index < 0 ) {
            if(this.options.loop){
                index = this.items.length - this.slidesVisible
            } else {
                return
            }
        } else if(index >= this.items.length || (this.items[this.currentItem + this.slidesVisible] === undefined && index > this.currentItem)) {
            if(this.options.loop){
                index = 0
            } else {
                return
            }
        }
        let translateX = index * -100 / this.items.length
        this.container.style.transform = 'translate3d('+ translateX +'%, 0, 0)'
        this.currentItem = index;
        this.moveCallbacks.forEach(cb => cb(index))
    }

    /**
     * 
     * @param {moveCallback} cb 
     */
    onMove(cb) {
        this.moveCallbacks.push(cb)
    }

    onResize() {
        let mobile = window.innerWidth < 800
        if(mobile !== this.isMobile) {
            this.isMobile = mobile
            this.setSyle()
            this.moveCallbacks.forEach(cb => cb(this.currentItem))
        }
    }

    /**
     * @param {string} className
     * @returns {HTMLElement}
     * 
     */
    createDivWithClass(className) {
        let div = document.createElement('div')
        div.setAttribute('class', className) 
        return div
    }

    /**
     * @returns {number}
     */
    get slidesToScroll() {
        return this.isMobile ? 2: this.options.slidesToScroll
    }

    
    /**
     * @returns {number}
     */
    get slidesVisible() {
        return this.isMobile ? 2: this.options.slidesVisible
    }
}

export default Carousel

