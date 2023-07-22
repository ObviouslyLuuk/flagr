
function create_and_append(type, parent=null, id=null, class_=null) {
    if (parent == null)
        parent = document.body

    let element = document.createElement(type)

    if (id != null)
        element.id = id
    if (class_ != null)
        element.setAttribute('class', class_)

    parent.appendChild(element)
    return element
}

/** Adds button on top of element that makes it invisible */
function add_close_button(element_id) {
    let close_settings_btn = create_and_append('div', document.getElementById(element_id), element_id+'_close_btn', 'butn close_btn icon_btn')
    create_and_append("span", close_settings_btn, null, "glyphicon glyphicon-remove")        
    close_settings_btn.setAttribute('onclick', `set_visibility("${element_id}", false)`)
}

/** Make all buttons in the container group enabled */
function enable_buttons(container_id) {
    let preset_buttons = document.getElementById(container_id).getElementsByTagName("button")
    for (let button of preset_buttons) {
        button.disabled = false
        // Remove disabled from class list
        button.classList.remove("disabled")
    }
}

/** Creates switch input in parent. Relies on Bootstrap */
function create_switch(parent, label_text, id) {
    div = create_and_append("div", parent, id, "form-check form-switch")
    input = create_and_append("input", div, id+"_input", "form-check-input")
    input.setAttribute("type", "checkbox")
    label = create_and_append("label", div, null, "form-check-label")
    label.setAttribute("for", id+"_input")
    label.innerHTML = label_text
    return input
}

/** Creates number input for incrementing in parent, def=default value. Relies on Bootstrap */
function create_incrementer(parent, id, def, title) {
    div = create_and_append("div", parent, id, "input-group")

    left_div = create_and_append("div", div, null, "input-group-prepend")
    left_button = create_and_append("button", left_div, null, "btn")
    left_button.type = "button"
    left_button.setAttribute("onclick", `let elem = document.getElementById('${id}_input'); if (elem.value > elem.min) {elem.value -= 1; elem.dispatchEvent(new Event("change"))}`)
    create_and_append("span", left_button, null, "glyphicon glyphicon-minus")

    input = create_and_append("input", div, id+"_input", "form-control")
    input.type = "number"
    input.setAttribute("value", def)
    input.max = 20
    input.min = 1   

    right_div = create_and_append("div", div, null, "input-group-append")
    right_button = create_and_append("button", right_div, null, "btn")
    right_button.type = "button"
    right_button.setAttribute("onclick", `let elem = document.getElementById('${id}_input'); if (+elem.value < +elem.max) { elem.value = +elem.value + 1; elem.dispatchEvent(new Event("change"))}`)
    create_and_append("span", right_button, null, "glyphicon glyphicon-plus")

    div.innerHTML += title 

    return input
}

/** Moves element to new parent */
function move_element(element, new_parent) {
    element.parentElement.removeChild(element)
    new_parent.appendChild(element)
}

/** Removes all children from element */
function empty_element(element) {
    while(element.firstChild){
        element.removeChild(element.firstChild);
    }
}

/** Sets style.display of element to grid if vis, none otherwise */
function set_visibility(element_id, vis=true) {
    element = document.getElementById(element_id)
    // If element doesn't exist, return
    if (!element) {
        console.log(`Element ${element_id} does not exist`)
        return
    }

    if (vis)
        element.style['display'] = "grid"
        // unfade(element)
    else
        element.style['display'] = 'none'
        // fade(element)
}

/** Overlay loader symbol on page if it exists */
function set_loader(display="block") {
    loader = document.getElementById("loader_div")
    if (!loader) {
        return
    }
    
    loader.style.display = display
    loader.style.left = `${document.body.offsetWidth / 2 - loader.offsetWidth / 2}px`
    loader.style.top = `${document.body.offsetHeight / 2 - loader.offsetHeight / 2}px`
}

/** Randomises order of elements in parent */
function shuffle_elements(parent) {
    for (let i = parent.children.length; i >= 0; i--) {
        parent.appendChild(parent.children[Math.random() * i | 0]);
    }
}

/** Add animation that makes the image smaller and then bigger again */
function add_pop_animation(elem) {
    elem.style.animation = "pop 0.5s"
    elem.style.animationFillMode = "forwards"
    // Remove animation after 0.5s
    setTimeout(function() {
        elem.style.animation = ""
    }, 500)
}

/** NOT TESTED! Create overlay absolutely positioned on elem */
function overlay_element(elem) {
    // If parent of elem is not a container div class, create one
    if (!elem.parentElement.className.includes("container_div")) {
        let container_div = create_and_append("div", elem.parentElement, null, "container_div")
        container_div.appendChild(elem)
    }
    // Make overlay div and append to container div
    let overlay_div = create_and_append("div", elem.parentElement, null, "overlay_div")
    overlay_div.style.width = elem.offsetWidth + "px"
    overlay_div.style.height = elem.offsetHeight + "px"
    overlay_div.style.top = elem.offsetTop + "px"
    overlay_div.style.left = elem.offsetLeft + "px"

    // This stuff should be in CSS
    overlay_div.style["background-color"] = "rgba(0, 0, 0, 0.5)"
    overlay_div.style.position = "absolute"
    overlay_div.style["z-index"] = "1"

    return overlay
}
