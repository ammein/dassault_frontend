// noinspection JSUnusedGlobalSymbols
import Barba from '@barba/core';
export class BarbaOptions {
    /**
     * BarbaJS Transitions
     * @see {@link Barba.ITransitionPage[]}
     */
    allTransitions = []
    /**
     * BarbaJS Views
     * @see {@link Barba.IView[]}
     */
    allViews = []

    /**
     * BarbaJS Schema
     * @type {typeof Barba.schema}
     */
    allSchema = {}

    /**
     * Returns Transition Page
     * @returns {@link Barba.ITransitionPage[]}
     */
    get transitions() {
        return this.allTransitions;
    }

    /**
     * Returns Views
     * @returns {@link Barba.IView[]}
     */
    get views(){
        return this.allViews;
    }

    /**
     * Returns Schema
     * @returns {Barba.schema}
     */
    get schema(){
        return this.allSchema;
    }

    /**
     * Set Barba Transitions
     * @param transitions
     */
    set allTransitions(transitions) {
        this.allTransitions = transitions;
    }

    /**
     * Set Views Custom Code
     * @param views
     */
    set allViews(views) {
        this.allViews = views;
    }

    /**
     * Set Schema BarbaJS
     * @param schema
     */
    set allSchema(schema) {
        this.allSchema = schema;
    }

}
