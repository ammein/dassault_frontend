import './style.css'
import './reset.css'

import { gsap } from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import {BarbaOptions} from "./barba/index.js";
import barba from '@barba/core';
import {homepage} from "./barba/pages/main.js";

gsap.registerPlugin(ScrollTrigger);

const MyPages = new BarbaOptions()

MyPages.allViews = [
    homepage,
]

barba.init({
    views: [...MyPages.views],
})
