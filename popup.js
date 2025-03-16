// popup.js - Final Version with Clean Display

let shortenBtn = document.querySelector("#shortenBtn");
let urlInput = document.querySelector("#urlInput");
let shortenedUrl = document.querySelector("#shortenedUrl");
let copyMessage = document.querySelector("#copyMessage");
let toastError = document.querySelector(".toast-error");
let loader = document.createElement("p");
loader.textContent = "Loading...";
loader.style.display = "none";
document.body.appendChild(loader);

const apiUrl = "https://t.ly/api/v1/link/shorten";
let headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};

shortenBtn.addEventListener("click", () => {
    if (urlInput.value) {
        loader.style.display = "block";
        chrome.storage.local.get(["API"], function (result) {
            fetch(apiUrl, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    "long_url": urlInput.value,
                    "domain": "https://t.ly/",
                    "api_token": result.API
                })
            }).then(response => response.json())
                .then(json => {
                    loader.style.display = "none";
                    shortenedUrl.textContent = json.short_url;
                    shortenedUrl.href = json.short_url;
                    shortenedUrl.style.display = "inline-block"; // Ensure it's visible
                })
                .catch(err => {
                    loader.style.display = "none";
                    alert("Error: " + err);
                });
        });
    } else {
        toastError.classList.remove("d-hide");
        setTimeout(() => {
            toastError.classList.add("d-hide");
        }, 1500);
    }
});

// Click-to-Copy functionality for shortened URL
shortenedUrl.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent accidental navigation
    let urlText = shortenedUrl.textContent;
    
    if (urlText) {
        navigator.clipboard.writeText(urlText).then(() => {
            copyMessage.style.display = "block";
            setTimeout(() => { copyMessage.style.display = "none"; }, 1500);
        }).catch(err => {
            console.error("Failed to copy:", err);
        });
    }
});
