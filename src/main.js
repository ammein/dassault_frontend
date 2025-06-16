import './style.css'
import './reset.css'

import { gsap } from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import {BarbaOptions} from "./barba/index.js";
import barba from '@barba/core';
import {homepageViews, homepageTransition} from "./barba/pages/home.js";

gsap.registerPlugin(ScrollTrigger);

const MyPages = new BarbaOptions()

MyPages.allViews = [
    homepageViews,
]

MyPages.allTransitions = [
    homepageTransition,
]

barba.init({
    views: [...MyPages.views],
    transitions: [...MyPages.transitions]
})
