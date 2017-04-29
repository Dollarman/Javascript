// ==UserScript==
// @name         Hide Youtube Navbar by Default and show it on F7 press.
// @namespace    http://cssanchez.com/
// @version      1
// @description  It hides masthead and its offset on youtube.com/* pages. This means it hides the navbar and shrinks the offset gap between it and the video so a video in theater mode can fit fullscreen. 
// @author       Carlos Sanchez 
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var elem1, elem2, navbarHidden;
    navbarHidden = true;
    elem1 = document.getElementById("masthead-positioner");
    elem2 = document.getElementById("masthead-positioner-height-offset");
    // Your code here...
    hidenavbar(elem1,elem2);
    document.addEventListener("keydown", function(event) {
        switch (event.keyCode) {
            case 118: // F7 button press
                if (navbarHidden) {shownavbar(elem1,elem2);}
                else {hidenavbar(elem1,elem2);}
                navbarHidden = !navbarHidden;
                break;
        }});
})();

function hidenavbar (elem1, elem2) {
    if (elem1) {
        elem1.style.display = "none"; // Hides it
    }
    if (elem2) {
        elem2.style.display = "none"; // Hides it
    }
}

function shownavbar(elem1, elem2) {
    if (elem1) {
        elem1.style.display = "initial"; // Shows it
    }
    if (elem2) {
        elem2.style.display = "initial"; // Shows it
    }
}