import { FocusTrap } from "../src";

const toggleActiveClass = {
    escDisables: true,
    onAfterEnable(trap: FocusTrap) {
        for (const c of trap.containers) {
            c.classList.add("active");
        }
    },
    onAfterDisable(trap: FocusTrap) {
        for (const c of trap.containers) {
            c.classList.remove("active");
        }
    },
};

function onClick(testid: string, cb: VoidFunction) {
    document
        .querySelector(`[data-testid="${testid}"]`)!
        .addEventListener("click", cb, false);
}

function createLink() {
    const newLink = document.createElement("a");
    newLink.href = "#";
    newLink.dataset.testid = "new-link";
    newLink.innerHTML = "new link";

    return newLink;
}

const examples = {
    "/basic"() {
        const trap = new FocusTrap({
            ...toggleActiveClass,
            containers: document.querySelectorAll(".container"),
        });

        onClick("focus", () => {
            trap.enable();
        });

        onClick("exit-button", () => {
            trap.disable();
        });
    },
    "/basic#outsideClick"() {
        const trap = new FocusTrap({
            ...toggleActiveClass,
            outsideClickDisables: true,
            containers: document.querySelectorAll(".container"),
        });

        onClick("focus", () => {
            trap.enable();
        });

        onClick("exit-button", () => {
            trap.disable();
        });
    },
    "/multi-container"() {
        const trap = new FocusTrap({
            ...toggleActiveClass,
            _name: "first",
            containers: document.querySelectorAll(".container"),
        });
        onClick("focus", () => {
            trap.enable();
        });
    },

    "/empty-container"() {
        const trap = new FocusTrap({
            ...toggleActiveClass,
            containers: document.querySelectorAll(".container"),
            validateTabbable(tabbable) {
                return !tabbable.dataset.skip;
            },
        });
        onClick("focus", () => {
            trap.enable();
        });
    },

    "/tabbable-container"() {
        const trap = new FocusTrap({
            ...toggleActiveClass,
            _name: "first",
            containers: document.querySelectorAll(".container"),
        });
        onClick("focus", () => {
            trap.enable();
        });
    },

    "/nested-traps"() {
        const trap1 = new FocusTrap({
            ...toggleActiveClass,
            outsideClickDisables: true,
            containers: document.querySelectorAll(".first-group"),
        });

        const trap2 = new FocusTrap({
            ...toggleActiveClass,
            outsideClickDisables: true,
            containers: document.querySelectorAll(".second-group"),
        });

        const trap3 = new FocusTrap({
            ...toggleActiveClass,
            outsideClickDisables: true,
            containers: document.querySelectorAll(".third-group"),
        });

        onClick("focus-first", () => {
            trap1.enable();
        });

        onClick("disable-first", () => {
            trap1.disable();
        });

        onClick("focus-second", () => {
            trap2.enable();
        });

        onClick("disable-second", () => {
            trap2.disable();
        });

        onClick("focus-third", () => {
            trap3.enable();
        });

        onClick("disable-third", () => {
            trap3.disable();
        });
    },

    "/nested-containers"() {
        const trap1 = new FocusTrap({
            ...toggleActiveClass,
            outsideClickDisables: true,
            containers: document.querySelectorAll(".first-group"),
        });

        const trap2 = new FocusTrap({
            ...toggleActiveClass,
            outsideClickDisables: true,
            containers: document.querySelectorAll(".second-group"),
        });

        const trap3 = new FocusTrap({
            ...toggleActiveClass,
            outsideClickDisables: true,
            containers: document.querySelectorAll(".third-group"),
        });

        onClick("focus-first", () => {
            trap1.enable();
        });

        onClick("disable-first", () => {
            trap1.disable();
        });

        onClick("focus-second", () => {
            trap2.enable();
        });

        onClick("disable-second", () => {
            trap2.disable();
        });

        onClick("focus-third", () => {
            trap3.enable();
        });

        onClick("disable-third", () => {
            trap3.disable();
        });
    },

    "/dynamic"() {
        const trap = new FocusTrap({
            ...toggleActiveClass,
            _name: "first",
            containers: document.querySelectorAll(".container"),
        });
        onClick("focus", () => {
            trap.enable();
        });

        onClick("prepend-link-to-second", () => {
            const container2 = document.querySelector(
                "[data-testid=container2]",
            );
            container2.insertBefore(createLink(), container2.firstChild);
        });

        onClick("append-link-to-first", () => {
            const container1 = document.querySelector(
                "[data-testid=container1]",
            );
            container1.appendChild(createLink());
        });
    },
};

function getExample() {
    let path = window.location.pathname;
    if (path.endsWith(".html")) {
        path = path.slice(0, -".html".length);
    }

    return path + window.location.hash;
}

const fn = examples[getExample()];

if (fn) {
    const backLink = document.createElement("a");
    backLink.href = "/";
    backLink.innerHTML = "Back to index";
    backLink.tabIndex = -1;
    document.body.insertBefore(backLink, document.body.firstChild);
    fn();
} else {
    document.body.innerHTML = "Unknown example :(";
}
