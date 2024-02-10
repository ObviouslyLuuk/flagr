///////////////////////////////////////////////////////////////////////////////
// This file contains an adaptation of the game where there are no
// options, just a "show" button that shows the correct answer.
///////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////
// VARIABLES
///////////////////////////////////////////////////////////////////////////////

// Constants
DATA_DIR = "images/png/countries/"
IMG_EXT = ".png"
DATA_DIR = "images/svg/"
IMG_EXT = ".svg"

function get_flag_src(code) {
    return DATA_DIR + code + IMG_EXT
}

// Global variables
var code2country = null
var gdp_probs = null
var country_codes = []
var countries = []

// Stats variables
var recent_flags = []
var recently_correct = []
var recent_outcomes = []
var EMA = 0.5 // Exponential moving average of recent_outcomes
EMA_ALPHA = 0.3 // Smoothing factor for EMA

// Game mode variables
var max_flags, timed, get_flag_fn, start_time, timer
var game_mode = null


///////////////////////////////////////////////////////////////////////////////
// GENERAL FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

// Numeric functions
function sum(arr) {
    return arr.reduce((a, b) => a + b, 0)
}
function mean(arr) {
    return sum(arr) / arr.length
}
function normalise(arr) {
    let total = sum(arr)
    return arr.map(x => x / total)
}
function multinomial_sample(array, probs, seed=null) {
    let rand = Math.random()
    if (seed) {rand = random(seed)}
    let sum = 0
    for (let i in array) {
        sum += probs[i]
        if (sum > rand) {
            return array[i]
        }
    }
}
function sample_from_normal_distribution(mean, std) {
    let u1 = Math.random()
    let u2 = Math.random()
    let z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
    return z0 * std + mean
}
/** Get probability for sampling a number inside a bin in the normal distribution */
function gaussian(x, mean, std) {
    let variance = std ** 2;
    let numerator = Math.exp(-((x - mean) ** 2) / (2 * variance));
    let denominator = Math.sqrt(2 * Math.PI * variance);
    return numerator / denominator;
}

// DOM functions
function capitalize(str) {
    return str.split(" ").map(word => word[0].toUpperCase() + word.slice(1)).join(" ")
}


///////////////////////////////////////////////////////////////////////////////
// FETCH DATA
///////////////////////////////////////////////////////////////////////////////

// Read countries from file code2country.json
fetch('json/code2country.json')
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        code2country = data
        country_codes = Object.keys(code2country)
        countries = Object.values(code2country)
        init_flag_game(true)

        // Set all flags button to N flags
        document.getElementById("all_flags_mode_btn").innerHTML = country_codes.length + " Flags"
    })
    // .catch(function (err) {
    //     console.log('error: ' + err);
    // });
fetch('json/GDP_probabilities.json')
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        gdp_probs = data
        init_flag_game(true)
    })


///////////////////////////////////////////////////////////////////////////////
// GAME FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

function init_stats() {
    if (localStorage.getItem("flagr_stats") == null) {

        let flag_stats = {}
        for (let code of country_codes) {
            flag_stats[code] = {
                correct: 0,
                total: 0,
            }
        }
        let stats = {
            flag_stats: flag_stats,
            times: {
                197: [],
                15: [],
            },
        }
        localStorage.setItem("flagr_stats", JSON.stringify(stats))
    }
}
function get_stats() {
    return JSON.parse(localStorage.getItem("flagr_stats"))
}
function save_stats(stats) {
    localStorage.setItem("flagr_stats", JSON.stringify(stats))
}

function init_flag_game(reset=false, flag=null) {
    // Wait for all data to be loaded
    if (code2country == null || gdp_probs == null)
        return

    // Remove previous flag grid and top div
    if (document.getElementById("flag_grid"))
        document.getElementById("flag_grid").remove()
    if (document.getElementById("top_div"))
        document.getElementById("top_div").remove()
    if (reset) {
        if (timer)
            clearInterval(timer)

        // Reset score
        recent_flags = []
        recently_correct = []
        recent_outcomes = []

        // If it doesn't exist, initialize the stats variable in local storage
        init_stats()
    }
    already_guessed = false

    // Create top div
    let top_div = add_top_div(document.body)

    // Gamemode config
    switch (game_mode) {
        default:
            max_flags = Infinity
            timed = false
            get_flag_fn = get_new_flag 
            break;
    }

    // Display SCORE and score percentage
    let score_div = create_and_append("h2", top_div, "score_div")
    update_score()
    let question_div = create_and_append("div", top_div, "question_div")
    let timer_div = create_and_append("h2", top_div, "timer_div")
    if (timed && reset) {
        start_time = Date.now()
        timer = start_timer()
    }

    // Select country
    if (flag == null) {
        correct_code = get_flag_fn()
    } else {
        correct_code = country_codes[countries.indexOf(flag)]
    }
    let idx = country_codes.indexOf(correct_code)
    add_to_recent_flags(correct_code)
    let country = code2country[correct_code]
    question_div.innerHTML = country

    let div = add_image_grid(document.body, id="flag_grid")

    // For each image in the grid set the src to the flag of the country
    let imgs = div.getElementsByTagName("img")
    imgs[0].src = DATA_DIR + correct_code + IMG_EXT
    imgs[0].dataset.code = correct_code
    imgs[0].dataset.dist = 0
    for (let i = 1; i < imgs.length; i++) {
        let img = imgs[i]
        let country_code = closest_flags[i-1]
        img.dataset.code = country_code
        img.dataset.dist = distances[i-1]

        // Set src to the flag of the country
        img.src = DATA_DIR + country_code + IMG_EXT
    }

    // Add function onclick to each image to show the flag
    for (let i = 0; i < imgs.length; i++) {
        let img = imgs[i]
        img.onclick = function() {
            let outcome = true
            img.style.filter = "brightness(1)"

            // Make country_name_overlay fade out with animation "fade_out"
            let overlay = img.parentElement.getElementsByClassName("country_name_overlay")[0]
            overlay.style.animation = "fade_out 0.5s"
            overlay.style.animationFillMode = "forwards"

            update_score()
            if (check_if_over()) return

            if (outcome == true) {
                recently_correct.unshift(img.dataset.code)

                if (["all_flags", "fifteen"].includes(game_mode)) {
                    init_flag_game()
                }
                else {
                    // Add click event to next flag
                    img.onclick = function() {
                        init_flag_game()
                    }
                }
            }
            add_pop_animation(img)
        }
        // Set cursor to pointer
        img.style.cursor = "pointer"
    }
}

function set_gamemode(gamemode) {
    game_mode = gamemode
    init_flag_game(reset=true)

    enable_buttons("gamemodes_buttons_div")

    // Disable button that was just clicked if gamemode is endless or training
    if (gamemode == "endless" || gamemode == "training") {
        let button = document.getElementById(gamemode + "_mode_btn")
        button.disabled = true

        // Add disabled class to button
        button.classList.add("disabled")
    }
}

function start_timer() {
    let timer = setInterval(function() {
        update_timer()
    }, 100); // check every .1 seconds
    return timer
}
function update_timer() {
    let timer_div = document.getElementById("timer_div")
    // Round to 1 decimal place
    let time = (Date.now() - start_time) / 1000
    timer_div.innerHTML = time.toFixed(1) + "s"
}

/** Function to check if the game is over */
function check_if_over() {
    if (recent_outcomes.length >= max_flags) {
        // Stop timer
        clearInterval(timer)

        disable_all_flags()

        show_end_screen_overlay()

        return true
    }
    return false
}


///////////////////////////////////////////////////////////////////////////////
// GET NEW FLAG FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

/** Function for getting new "question" flag based on different probabilities. No repeats */
function get_new_flag() {
    let success_rate = mean(recent_outcomes.slice(0, 10))
    // If no outcomes yet, set to 0.5
    if (recent_outcomes.length < 5)
        success_rate = 0.5
    console.log("\nrecent success rate: ", success_rate)
    console.log("EMA: ", EMA)

    let difficulty = success_to_difficulty(success_rate)
    difficulty = difficulty*0.8 + 0.05
    console.log("difficulty: ", difficulty)

    let gaussian_mean = Math.round((difficulty) * country_codes.length)
    console.log("gaussian_mean: ", gaussian_mean)

    // Assign probabilities to each flag
    let probabilities = []
    for (let i = 0; i < country_codes.length; i++) {
        let code = country_codes[i]

        // Get rank of country in gdp_probs
        let rank = country_codes.map(c => gdp_probs[c]).sort((a, b) => b - a).indexOf(gdp_probs[code])

        // Get corresponding probability for rank from gaussian
        let gdp_prob = gaussian(rank, gaussian_mean, 10)

        let prob = get_recency_probability(code) * gdp_prob

        probabilities.push(prob)
    }
    // Normalise probabilities
    probabilities = normalise(probabilities)

    // Sample from the distribution
    let code = multinomial_sample(country_codes, probabilities)
    // Greedy
    // let code = country_codes[probabilities.indexOf(Math.max(...probabilities))]

    // Print info
    console.log(code2country[code])
    console.log("GDP probability: ", gdp_probs[code])
    let final_prob = probabilities[country_codes.indexOf(code)]
    probabilities.sort((a, b) => b - a)
    console.log("Final probability rank: ", probabilities.indexOf(probabilities.find(p => p == final_prob)))

    return code
}

/** Probability penalty based on recency */
function get_recency_probability(code) {
    // If the flag is in the recent_flags list, return 0
    if (recent_flags.includes(code))
        return 0
    return 1
}

function success_to_difficulty(success_rate) {
    return 1 - (1-success_rate)**0.2
}


///////////////////////////////////////////////////////////////////////////////
// UI FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

function add_top_div(parent) {
    let top_div = create_and_append("div", parent, "top_div")
    top_div.style.display = "grid"
    top_div.style["align-items"] = "center"
    top_div.style["justify-items"] = "center"
    top_div.style.gridTemplateColumns = "1fr 1fr 1fr"
    top_div.style.width = "90vw"
    top_div.style["text-align"] = "center"
    top_div.style["min-height"] = "2em"
    return top_div
};
/** Add div with 3x3 image grid to the parent element */
function add_image_grid(parent, id="flag_grid") {
    // Create div element
    let div = create_and_append("div", parent, id, "image_grid")
    div.style["min-height"] = "45vh"

    // Create 1x1 image grid
    let img_container = create_and_append("div", div, null, "img_container")
    let overlay = create_and_append("div", img_container, null, "country_name_overlay")
    overlay.style["font-size"] = "5em"
    overlay.style["font-weight"] = "bold"
    overlay.style["pointer-events"] = "none"
    overlay.innerHTML = "?"

    let img = create_and_append("img", img_container, null, "flag")
    img.style.filter = "brightness(0)" // Make it black
    img.style["max-height"] = "40vh"
    return div
}

function get_score_str() {
    let str = sum(recent_outcomes) + " / " + recent_outcomes.length

    if (recent_outcomes.length > 0) {
        str += " (" + Math.round(mean(recent_outcomes) * 100) + "%)"
    }
    return str
}
function update_score() {
    // score_div.innerHTML = "Score: " + get_score_str()
    console.log("update score not implemented")
}

function show_end_screen_overlay() {
    // Remove overlay if it already exists
    let overlay = document.getElementById("end_screen_overlay")
    if (overlay != null) {
        overlay.remove()
    }

    // Create overlay
    overlay = create_and_append("div", document.body, "end_screen_overlay", "overlay")
    overlay.style.display = "grid"
    overlay.style["place-items"] = "center"
    add_close_button("end_screen_overlay")

    let end_screen_div = create_and_append("div", overlay, "end_screen_div")
    let end_screen_title = create_and_append("h1", end_screen_div, "end_screen_title")
    end_screen_title.innerHTML = "Well done!"

    let end_screen_text = create_and_append("p", end_screen_div, "end_screen_text")
    let time = (Date.now() - start_time) / 1000

    end_screen_text.innerHTML = `
    Score: ${get_score_str()} <br>
    Time: ${time.toFixed(2)}s <br>
    Time per flag: ${(time / max_flags).toFixed(2)}s <br>
    `
    let stats = get_stats()
    stats["times"][max_flags].unshift({
        date: new Date(),
        score: sum(recent_outcomes),
        time: time,
    })
    save_stats(stats)

    update_stats_overlay()
}


///////////////////////////////////////////////////////////////////////////////
// MISCELLANEOUS FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

function add_to_recent_flags(code) {
    recent_flags.unshift(code)
    if (recent_flags.length > country_codes.length)
        recent_flags.pop()
}
function add_to_recent_outcomes(outcome) {
    recent_outcomes.unshift(outcome)
    // if (recent_outcomes.length > 20)
    //     recent_outcomes.pop()
}
