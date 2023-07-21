BANNER_LOADED = false


const BARCHART_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bar-chart-line-fill" viewBox="0 0 16 16">
<path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1V2z"/>
</svg>`


function init_banner() {
    let stats_btn = create_and_append('div', document.getElementById("page_banner_left"), 'stats_btn', 'butn')
    stats_btn.innerHTML = BARCHART_ICON
    stats_btn.setAttribute('onclick', 'set_visibility("win_overlay", true)')      

    let settings_btn = create_and_append('div', document.getElementById("page_banner_right"), 'settings_btn', 'butn')
    create_and_append("span", settings_btn, null, "glyphicon glyphicon-cog")
    settings_btn.setAttribute('onclick', 'set_visibility("settings_overlay", true)')

    BANNER_LOADED = true
}

function init_settings_overlay() {
    let settings_overlay = create_and_append('div', document.body, 'settings_overlay', 'overlay')
    add_close_button('settings_overlay')

    let settings_overlay_content = create_and_append('div', settings_overlay, 'settings_overlay_content', 'overlay_content')
    
    let flag_similarity_btn = create_and_append('button', settings_overlay_content, 'flag_similarity_btn', 'butn btn btn-secondary')
    flag_similarity_btn.innerHTML = "Similarities View"
    flag_similarity_btn.setAttribute('onclick', 'init_flag_similarity()')
}

init_settings_overlay()
init_banner()
