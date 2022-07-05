if (document.querySelector('#collapse-' + window.location.hash.substring(1))) {
    let AutoOpen = new bootstrap.Collapse('#collapse-' + window.location.hash.substring(1), {
        toggle: true
    });
}