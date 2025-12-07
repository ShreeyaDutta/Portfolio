// load.js — dynamically inject HTML partials into index.html
document.addEventListener("DOMContentLoaded", () => {
    const includeElements = document.querySelectorAll("[data-include]");

    includeElements.forEach(el => {
        const file = el.getAttribute("data-include");
        if (!file) return;

        fetch(file)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Could not load ${file}: ${response.statusText}`);
                }
                return response.text();
            })
            .then(data => {
                el.innerHTML = data;
            })
            .catch(err => {
                console.error(err);
                el.innerHTML = `<p style="color:red;">Error loading section: ${file}</p>`;
            });
    });
});
