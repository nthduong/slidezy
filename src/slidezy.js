function Slidezy(selector, options = {}) {
    this.container = document.querySelector(selector);
    if (!this.container) {
        console.error(`Slidezy: container ${selector} not found!`);
        return;
    }

    this.opt = Object.assign(
        {
            items: 3,
            loop: false,
        },
        options
    );
    this.slides = Array.from(this.container.children);
    this.currentIndex = this.opt.loop ? this.opt.items : 0;
    this._init();
    this._updatePosition();
}

Slidezy.prototype._init = function () {
    this.container.classList.add("slidezy-wrapper");
    this._createTrack();
    this._createNavigation();
};

Slidezy.prototype._createTrack = function () {
    this.slideTrack = document.createElement("div");
    this.slideTrack.classList.add("slidezy-track");

    if (this.opt.loop) {
        const cloneHead = this.slides
            .slice(-this.opt.items)
            .map((node) => node.cloneNode(true));

        const cloneTail = this.slides
            .slice(0, this.opt.items)
            .map((node) => node.cloneNode(true));

        this.slides = cloneHead.concat(this.slides.concat(cloneTail));
    }
    this.slides.forEach((slide) => {
        slide.classList.add("slide");
        slide.style.width = `${100 / this.opt.items}%`;
        this.slideTrack.appendChild(slide);
    });

    this.container.append(this.slideTrack);
};

Slidezy.prototype._createNavigation = function () {
    this.prevBtn = document.createElement("button");
    this.nextBtn = document.createElement("button");

    this.prevBtn.textContent = "Prev";
    this.nextBtn.textContent = "Next";

    this.prevBtn.className = "slidezy-prev";
    this.nextBtn.className = "slidezy-next";

    this.prevBtn.onclick = () => this.move(-1);
    this.nextBtn.onclick = () => this.move(1);

    this.container.append(this.prevBtn, this.nextBtn);
};

Slidezy.prototype.move = function (step) {
    if (this._isAnimating) return;
    this._isAnimating = true;
    if (this.opt.loop) {
        this.currentIndex =
            (this.currentIndex + step + this.slides.length) %
            this.slides.length;
        this.slideTrack.ontransitionend = () => {
            const maxIndex = this.slides.length - this.opt.items;
            if (this.currentIndex <= 0) {
                this.currentIndex = maxIndex - this.opt.items;
            } else if (this.currentIndex >= maxIndex) {
                this.currentIndex = this.opt.items;
            }
            this._updatePosition(true);
            this._isAnimating = false;
        };
    } else {
        this.currentIndex = Math.min(
            Math.max(this.currentIndex + step, 0),
            this.slides.length - this.opt.items
        );
    }
    console.log(this.currentIndex);
    console.log(this.slides.length);

    this._updatePosition();
};

Slidezy.prototype._updatePosition = function (instant = false) {
    this.slideTrack.style.transition = instant ? "none" : "transform ease 0.3s";
    const offset = -(this.currentIndex * (100 / this.opt.items));
    this.slideTrack.style.transform = `translateX(${offset}%)`;
};
