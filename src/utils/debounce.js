/**
 * Debounce Function
 *
 * Real life examples:
 * 1. Submit button:When you click a submit button on a website, it doesn’t send the data immediately, but waits for a few milliseconds to see if you click it again. This way, it prevents accidental double submissions and errors.
 * 2. Elevator: When you press the button to call the elevator, it doesn’t move immediately, but waits for a few seconds to see if anyone else wants to get on or off. This way, it avoids going up and down too frequently and saves energy and time.
 * 3. Search box: When you type something in a search box, it doesn’t show suggestions on every keystroke, but waits until you stop typing for a while. This way, it avoids making too many requests to the server and improves the performance and user experience.
 * @param {function} func
 * @param {number} delay
 * @returns {(function(...[*]): void)|*}
 * @see https://dev.to/jeetvora331/javascript-debounce-easiest-explanation--29hc
 * @example
 * // Define a function called 'searchData' that logs a message to the console
 * function searchData() {
 *   console.log("searchData executed");
 * }
 *
 * // Create a new debounced version of the 'searchData' function with a delay of 3000 milliseconds (3 seconds)
 * const debouncedSearchData = debounce(searchData, 3000);
 *
 * // Call the debounced version of 'searchData'
 * debouncedSearchData();
 */
export const debounce = (func, delay) => {
    let timerId; // Holds a reference to the timeout between calls.
    return (...args) => {
        clearTimeout(timerId); // Clears the current timeout, if any, to reset the debounce timer.
        timerId = setTimeout(() => {
            func.apply(this, args); // Calls the passed function after the specified delay with the correct context and arguments.
        }, delay);
    };
};
