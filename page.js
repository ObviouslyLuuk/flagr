BANNER_LOADED = false


const BARCHART_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bar-chart-line-fill" viewBox="0 0 16 16">
<path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1V2z"/>
</svg>`


function init_banner() {
    let stats_btn = create_and_append('div', document.getElementById("page_banner_left"), 'stats_btn', 'butn icon_btn')
    stats_btn.innerHTML = BARCHART_ICON
    stats_btn.setAttribute('onclick', 'set_visibility("stats_overlay", true)')      

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
    metrics_subscript.innerHTML = "Determines which flags are shown"

    let metrics_buttons_div = create_and_append('div', settings_overlay_content, 'metrics_buttons_div', "flex_container")

    let balanced_btn = create_and_append('button', metrics_buttons_div, 'metric_balanced_btn', 'butn btn btn-secondary disabled')
    balanced_btn.innerHTML = "Balanced"
    balanced_btn.setAttribute('onclick', 'set_metric_preset("balanced")')

    let color_btn = create_and_append('button', metrics_buttons_div, 'metric_color_btn', 'butn btn btn-secondary')
    color_btn.innerHTML = "Color"
    color_btn.setAttribute('onclick', 'set_metric_preset("color")')

    let flag_similarity_btn = create_and_append('button', metrics_buttons_div, 'flag_similarity_btn', 'butn btn btn-secondary')
    flag_similarity_btn.innerHTML = "Customize Metrics"
    flag_similarity_btn.setAttribute('onclick', 'init_flag_similarity(document.getElementById("settings_overlay_content"))')
}

init_settings_overlay()
init_banner()
