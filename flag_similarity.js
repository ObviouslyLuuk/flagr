///////////////////////////////////////////////////////////////////////////////
// Flag similarity settings and demo
///////////////////////////////////////////////////////////////////////////////

NUM_LISTS = 5

function remove_element(e) {
    e.parentNode.removeChild(e)
}

/** Initialize flag similarity settings and demo */
function init_flag_similarity(parent=document.getElementById("settings_overlay_content"), weights=DEFAULT_WEIGHTS) {
    // remove_element(document.getElementById("top_div"))
    // remove_element(document.getElementById("flag_grid"))
    // document.body.style.height = "auto"

    // Remove similarity metrics button
    remove_element(document.getElementById("flag_similarity_btn"))

    let similarity_div = create_and_append("div", parent, "similarity_div")

    let sliders_div = create_and_append("div", similarity_div, "sim_sliders_div", "flex_container")

    // Add slider for each metric in METRICS
    for (let i in METRICS) {
        // Add div for slider and label
        let slider_div = create_and_append("div", sliders_div, METRICS[i]+"_slider_div", "slider_div")

        // Add label for slider
        let label = create_and_append("label", slider_div, METRICS[i]+"_label")
        label.innerHTML = METRIC_NAMES[i]

        // Add slider
        let slider = create_and_append("input", slider_div, METRICS[i]+"_slider")
        slider.type = "range"
        slider.value = weights[i]
        slider.oninput = () => {sort_sim_lists(); enable_buttons("metrics_buttons_div")}
    }

    let sim_lists_div = create_and_append("div", similarity_div, "sim_lists_div")
    // Make elements of sim_lists_div display inline
    sim_lists_div.style.display = "flex"
    sim_lists_div.style["max-height"] = "45vh"
    sim_lists_div.style["overflow-y"] = "scroll"

    // Add n sim_list_grids to sim_lists_div
    for (let i = 0; i < NUM_LISTS; i++) {
        let sim_list_grid = create_and_append("div", sim_lists_div, "sim_grid_"+i, "image_grid")
        // sim_list_grid.dataset.idx = Math.floor(Math.random() * country_codes.length)
        sim_list_grid.dataset.idx = countries.indexOf(EXAMPLE_COUNTRIES[i])
        sim_list_grid.style["max-width"] = "20%"

        // Add countries.length img elements to sim_list_div
        for (let c of country_codes) {
            let img = create_and_append("img", sim_list_grid)
            img.src = DATA_DIR + c + IMG_EXT
            img.dataset.idx = country_codes.indexOf(c)
            img.onclick = () => {
                img.parentElement.dataset.idx = img.dataset.idx
                sort_sim_list(img.parentElement.id.split("_")[2])
            }
        }

        sort_sim_list(i)
    }
}

/** Calculate distance values for each img in sim_list_div */
function calc_dist_values(grid_num) {
    let weights = []
    for (let i in METRICS) {
        weights.push(document.getElementById(METRICS[i]+"_slider").value)
    }

    // console.log(weights)

    // Set .dataset.dist for each img in sim_list_div
    let imgs = document.getElementById("sim_grid_"+grid_num).getElementsByTagName("img")
    for (let i = 0; i < imgs.length; i++) {
        let img = imgs[i]
        
        let idx1 = img.parentElement.dataset.idx
        let idx2 = img.dataset.idx

        // Dist is the weighted sum of distances in each matrix
        let dist = 0
        for (let j in METRICS) {
            dist += weights[j] * [flag_color_dist, flag_mse, flag_mse_flips, flag_mse_rotations, flag_edges_mse][j][idx1][idx2]
        }
        img.dataset.dist = dist
    }
}

/** Sort sim_list based on distance values */
function sort_sim_list(grid_num) {
    calc_dist_values(grid_num)

    let grid = document.getElementById("sim_grid_"+grid_num)
    sort_elements(grid, (e) => parseFloat(e.dataset.dist))
}

/** Sort all sim_lists */
function sort_sim_lists() {
    for (let i = 0; i < NUM_LISTS; i++) {
        sort_sim_list(i)
    }
}


/** Sort elements in parent based on given attribute function */
function sort_elements(parent, attr_fn=(e)=>e.innerHTML) {
    let children = parent.children
    let sorted = Array.from(children).sort((a, b) => {
        let a_val = attr_fn(a)
        let b_val = attr_fn(b)
        if (a_val < b_val)
            return -1
        if (a_val > b_val)
            return 1
        return 0
    })
    for (let i = 0; i < sorted.length; i++) {
        parent.appendChild(sorted[i])
    }
}
