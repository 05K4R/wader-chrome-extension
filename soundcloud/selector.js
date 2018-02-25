class Selector {
    constructor(selectorString) {
        this.selectorString = selectorString;
    }

    getElement() {
        document.querySelector(selectorString);
    }
}
