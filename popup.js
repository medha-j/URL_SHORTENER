let generateBtn = document.querySelector("#shortURL");
let api = document.querySelector("#myurl");
let toastError = document.querySelector('.toast-error');
let toastSuccess = document.querySelector('.toast-success');
let loader = document.querySelector('.loading');

const url = new URL("https://t.ly/api/v1/link/shorten");
let headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};

generateBtn.addEventListener('click', () => {
    if (api.value) {
        loader.classList.remove('d-hide');
        chrome.storage.local.get(['API'], function (result) {
            fetch(url, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    "long_url": api.value,
                    "domain": "https://t.ly/",
                    "api_token": result.API
                })
            }).then(response => response.json())
                .then(json => {
                    loader.classList.add('d-hide');
                    toastSuccess.classList.remove('d-hide'); // Show success message
                    toastSuccess.textContent = json.short_url;
                    toastSuccess.setAttribute("data-url", json.short_url);
                    toastSuccess.style.cursor = "pointer"; // Make it look clickable

                    // Add "Click to copy" text dynamically
                    let clickText = document.createElement("p");
                    clickText.textContent = "Click to copy";
                    clickText.style.fontSize = "12px";
                    clickText.style.color = "gray";
                    clickText.style.marginTop = "5px";
                    clickText.id = "clickText";

                    // Remove old text if it exists (avoid duplication)
                    let oldText = document.getElementById("clickText");
                    if (oldText) oldText.remove();

                    toastSuccess.after(clickText); // Insert below the URL
                })
                .catch(err => { alert(err); });
        });
    } else {
        toastError.classList.remove('d-hide');
        setTimeout(() => {
            toastError.classList.add('d-hide');
        }, 1500);
    }
});

// Ensure event listener is added after URL is generated
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("toast-success") && event.target.getAttribute("data-url")) {
        let shortUrl = event.target.getAttribute("data-url");
        navigator.clipboard.writeText(shortUrl).then(() => {
            event.target.textContent = "Copied!";

            // Change the "Click to copy" text temporarily
            let clickText = document.getElementById("clickText");
            if (clickText) clickText.textContent = "Copied!";

            setTimeout(() => {
                event.target.textContent = shortUrl;
                if (clickText) clickText.textContent = "Click to copy";
            }, 1500);
        }).catch(err => {
            console.error("Failed to copy:", err);
        });
    }
});
