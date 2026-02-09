// import engine first
import * as ENG from "./engine";

window.ENG = ENG;

// import js libs here
// import "pixi-projection"
// import "pixi-filters";

// get setup and enter the application
import App from "./App";
import {isCordova} from "./engine/utils";

if (isCordova()) {
    document.addEventListener("deviceready", onDeviceReady, false);
} else {
    new App().init();
}

function onDeviceReady() {
    document.addEventListener("backbutton", function (e) {
        e.preventDefault();
    }, false);

    new App().init();

    if (window.StatusBar) {
        StatusBar.hide();
    }
}