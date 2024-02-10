BANNER_LOADED = false


const BARCHART_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bar-chart-line-fill" viewBox="0 0 16 16">
<path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1V2z"/>
</svg>`


function init_banner() {
    let stats_btn = create_and_append('div', document.getElementById("page_banner_left"), 'stats_btn', 'butn icon_btn')
    stats_btn.innerHTML = BARCHART_ICON
    stats_btn.setAttribute('onclick', 'if (!document.getElementById("stats_overlay")) init_stats_overlay(); set_visibility("stats_overlay", true)')      

    let settings_btn = create_and_append('div', document.getElementById("page_banner_right"), 'settings_btn', 'butn icon_btn')
    create_and_append("span", settings_btn, null, "glyphicon glyphicon-cog")
    settings_btn.setAttribute('onclick', 'set_visibility("settings_overlay", true)')

    BANNER_LOADED = true
}

function init_settings_overlay() {
    let settings_overlay = create_and_append('div', document.body, 'settings_overlay', 'overlay')
    add_close_button('settings_overlay')

    let settings_overlay_content = create_and_append('div', settings_overlay, 'settings_overlay_content', 'overlay_content')

    // GAMEMODES
    let gamemodes_title = create_and_append('h2', settings_overlay_content, 'gamemodes_title')
    gamemodes_title.innerHTML = "Gamemodes"

    let gamemodes_buttons_div = create_and_append('div', settings_overlay_content, 'gamemodes_buttons_div', "flex_container")

    let endless_mode_btn = create_and_append('button', gamemodes_buttons_div, 'endless_mode_btn', 'butn btn btn-secondary disabled')
    endless_mode_btn.innerHTML = "Endless"
    endless_mode_btn.setAttribute('onclick', 'set_gamemode("endless")')

    let all_flags_mode_btn = create_and_append('button', gamemodes_buttons_div, 'all_flags_mode_btn', 'butn btn btn-secondary')
    all_flags_mode_btn.innerHTML = "All Flags"
    all_flags_mode_btn.setAttribute('onclick', 'set_gamemode("all_flags"); set_visibility("settings_overlay", false)')

    let fifteen_mode_btn = create_and_append('button', gamemodes_buttons_div, 'fifteen_mode_btn', 'butn btn btn-secondary')
    fifteen_mode_btn.innerHTML = "15 Flags"
    fifteen_mode_btn.setAttribute('onclick', 'set_gamemode("fifteen"); set_visibility("settings_overlay", false)')

    // let training_mode_btn = create_and_append('button', gamemodes_buttons_div, 'training_mode_btn', 'butn btn btn-secondary')
    // training_mode_btn.innerHTML = "Training"
    // training_mode_btn.setAttribute('onclick', 'set_gamemode("training")')

    // METRICS
    let metrics_title = create_and_append('h2', settings_overlay_content, 'metrics_title')
    metrics_title.innerHTML = "Similarity Presets"
    let metrics_subscript = create_and_append('p', settings_overlay_content, 'metrics_subscript', "subscript")
    metrics_subscript.innerHTML = "Determines which flags accompany the correct one"

    let metrics_buttons_div = create_and_append('div', settings_overlay_content, 'metrics_buttons_div', "flex_container")

    let balanced_btn = create_and_append('button', metrics_buttons_div, 'metric_balanced_btn', 'butn btn btn-secondary disabled')
    balanced_btn.innerHTML = "Balanced"
    balanced_btn.setAttribute('onclick', 'set_metric_preset("balanced"); sort_sim_lists();')

    let color_btn = create_and_append('button', metrics_buttons_div, 'metric_color_btn', 'butn btn btn-secondary')
    color_btn.innerHTML = "Color"
    color_btn.setAttribute('onclick', 'set_metric_preset("color"); sort_sim_lists();')

    let flag_similarity_btn = create_and_append('button', metrics_buttons_div, 'flag_similarity_btn', 'butn btn btn-secondary')
    flag_similarity_btn.innerHTML = "Customize Metrics"
    flag_similarity_btn.setAttribute('onclick', 'init_flag_similarity(document.getElementById("settings_overlay_content"))')
}

function init_stats_overlay() {
    let stats_overlay = create_and_append('div', document.body, 'stats_overlay', 'overlay')
    add_close_button('stats_overlay')

    let stats_overlay_content = create_and_append('div', stats_overlay, 'stats_overlay_content', 'overlay_content')

    let stats_title = create_and_append('h1', stats_overlay_content, 'stats_title')
    stats_title.innerHTML = "Statistics"

    // Record Times
    let record_times_div = create_and_append('div', stats_overlay_content, 'record_times_div', 'flex_container')
    let record_times_title = create_and_append('h2', record_times_div, 'record_times_title')
    record_times_title.innerHTML = "Your Record Times"

    let record_times_table = create_and_append('table', record_times_div, 'record_times_table', 'table')

    let record_times_table_head = create_and_append('thead', record_times_table, 'record_times_table_head')
    let record_times_table_head_row = create_and_append('tr', record_times_table_head, 'record_times_table_head_row')
    let record_times_table_head_name = create_and_append('th', record_times_table_head_row, 'record_times_table_head_name')
    record_times_table_head_name.innerHTML = "Flags"
    let record_times_table_head_score = create_and_append('th', record_times_table_head_row, 'record_times_table_head_score')
    record_times_table_head_score.innerHTML = "Score"
    let record_times_table_head_time = create_and_append('th', record_times_table_head_row, 'record_times_table_head_time')
    record_times_table_head_time.innerHTML = "Time (s)"

    let record_times_table_body = create_and_append('tbody', record_times_table, 'record_times_table_body')

    // Flag Scores
    let flag_scores_div = create_and_append('div', stats_overlay_content, 'flag_scores_div', 'flex_container')
    let flag_scores_title = create_and_append('h2', flag_scores_div, 'flag_scores_title')
    flag_scores_title.innerHTML = "Your Flag Scores"

    let flag_scores_table_div = create_and_append('div', flag_scores_div, 'flag_scores_table_div')
    flag_scores_table_div.style.overflow = "auto"
    flag_scores_table_div.style["max-height"] = "300px"
    let flag_scores_table = create_and_append('table', flag_scores_table_div, 'flag_scores_table', 'table')

    let flag_scores_table_head = create_and_append('thead', flag_scores_table, 'flag_scores_table_head')
    let flag_scores_table_head_row = create_and_append('tr', flag_scores_table_head, 'flag_scores_table_head_row')
    let flag_scores_table_head_flag = create_and_append('th', flag_scores_table_head_row, 'flag_scores_table_head_flag')
    flag_scores_table_head_flag.innerHTML = "Flag"
    let flag_scores_table_head_name = create_and_append('th', flag_scores_table_head_row, 'flag_scores_table_head_name')
    flag_scores_table_head_name.innerHTML = "Country"
    let flag_scores_table_head_total = create_and_append('th', flag_scores_table_head_row, 'flag_scores_table_head_total')
    flag_scores_table_head_total.innerHTML = "Total"
    let flag_scores_table_head_score = create_and_append('th', flag_scores_table_head_row, 'flag_scores_table_head_score')
    flag_scores_table_head_score.innerHTML = "Score <a><span class='glyphicon glyphicon-sort'></span></a>"

    // Sort the table by score if you click on the score header sort icon, and reverse it if you click again
    flag_scores_table_head_score.setAttribute('onclick', 'sort_table("flag_scores_table", 3, (str)=>{return Number(str.replace("%", ""))} )')
    flag_scores_table_head_score.setAttribute('data-sort', '0')

    let flag_scores_table_body = create_and_append('tbody', flag_scores_table, 'flag_scores_table_body')
    
    update_stats_overlay()
}

function sort_table(table_id, column, item_fn) {
    let table, rows, switching, i, x, y, shouldSwitch
    table = document.getElementById(table_id)
    switching = true
    while (switching) {
        switching = false
        rows = table.rows
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false
            x = rows[i].getElementsByTagName("TD")[column]
            y = rows[i + 1].getElementsByTagName("TD")[column]
            if (table.rows[0].getElementsByTagName("TH")[column].getAttribute('data-sort') == '1') {
                if (item_fn(x.innerHTML) > item_fn(y.innerHTML)) {
                    shouldSwitch = true
                    break
                }
            }
            else {
                if (item_fn(x.innerHTML) < item_fn(y.innerHTML)) {
                    shouldSwitch = true
                    break
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i])
            switching = true
        }
    }
    let sort = table.rows[0].getElementsByTagName("TH")[column].getAttribute('data-sort')
    if (sort == '0') {
        table.rows[0].getElementsByTagName("TH")[column].setAttribute('data-sort', '1')
    }
    else {
        table.rows[0].getElementsByTagName("TH")[column].setAttribute('data-sort', '0')
    }
}

function update_stats_overlay() {
    let stats = get_stats()
    let record_times, flag_scores
    // If no stats
    if (stats == null) {
        record_times = {15: [], 197: []}
        flag_scores = {}
    } else {
        record_times = stats.times
        flag_scores = stats.flag_stats
    }

    // Empty the table
    let record_times_table_body = document.getElementById('record_times_table_body')
    record_times_table_body.innerHTML = ''

    // For each flag_count entry in record_times
    for (let flag_count of Object.keys(record_times)) {
        let best = get_best_time(record_times[flag_count])

        let record_times_table_body_row = create_and_append('tr', record_times_table_body, 'record_times_table_body_row_' + flag_count)
        let record_times_table_body_name = create_and_append('td', record_times_table_body_row, 'record_times_table_body_name_' + flag_count)
        record_times_table_body_name.innerHTML = flag_count
        let record_times_table_body_score = create_and_append('td', record_times_table_body_row, 'record_times_table_body_score_' + flag_count)
        let record_times_table_body_time = create_and_append('td', record_times_table_body_row, 'record_times_table_body_time_' + flag_count)
        record_times_table_body_score.innerHTML = (best.score / flag_count * 100) + "%"
        record_times_table_body_time.innerHTML = best.time
    }

    // Flag Scores
    // Empty the table
    let flag_scores_table_body = document.getElementById('flag_scores_table_body')
    flag_scores_table_body.innerHTML = ''

    // For each flag entry in flag_scores
    for (let code of Object.keys(flag_scores)) {
        let stat = flag_scores[code]
        let total = stat.total
        let correct = stat.correct

        let flag_scores_table_body_row = create_and_append('tr', flag_scores_table_body, 'flag_scores_table_body_row_' + code)
        let flag_scores_table_body_flag = create_and_append('td', flag_scores_table_body_row, 'flag_scores_table_body_flag_' + code)
        // Place a small image of the flag
        let flag_img = create_and_append('img', flag_scores_table_body_flag, 'stats_flag_img_' + code)
        flag_img.src = get_flag_src(code)
        flag_img.height = 20
        let flag_scores_table_body_name = create_and_append('td', flag_scores_table_body_row, 'flag_scores_table_body_name_' + code)
        flag_scores_table_body_name.innerHTML = code2country[code]
        let flag_scores_table_body_total = create_and_append('td', flag_scores_table_body_row, 'flag_scores_table_body_total_' + code)
        flag_scores_table_body_total.innerHTML = total
        let flag_scores_table_body_score = create_and_append('td', flag_scores_table_body_row, 'flag_scores_table_body_score_' + code)
        if (total)
            flag_scores_table_body_score.innerHTML = (correct / total * 100).toFixed(1) + "%"
    }
    sort_table("flag_scores_table", 2, (str)=>{return Number(str)} )
}

function get_best_time(times) {
    // times is a list of entries of the form {time: time, score: score}
    let best = {time: Infinity, score: 0}
    for (let entry of times) {
        if (entry.score > best.score) {
            best = entry
        } else if (entry.score == best.score && entry.time < best.time) {
            best = entry
        }
    }
    return best
}

init_settings_overlay()
init_banner()
