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
    this.currentIndex = 0;
    this._init();
}

Slidezy.prototype._init = function () {
    this.container.classList.add("slidezy-wrapper");
    this._createTrack();
    this._createNavigation();
};

Slidezy.prototype._createTrack = function () {
    this.slideTrack = document.createElement("div");
    this.slideTrack.classList.add("slidezy-track");

    this.slides.forEach((slide) => {
        slide.className = "slide";
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
    if (this.opt.loop) {
        this.currentIndex =
            (this.currentIndex + step + this.slides.length) %
            this.slides.length;
    } else {
        this.currentIndex = Math.min(
            Math.max(this.currentIndex + step, 0),
            this.slides.length - this.opt.items
        );
    }
    console.log(this.currentIndex);
    console.log(this.slides.length);
    const offset = -(this.currentIndex * (100 / this.opt.items));
    this.slideTrack.style.transform = `translateX(${offset}%)`;
};
