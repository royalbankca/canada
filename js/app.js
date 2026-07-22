// ====================================================
// RBC Royal Bank
// Fichier JavaScript principal
// ====================================================

document.addEventListener("DOMContentLoaded", () => {
    console.log("RBC Royal Bank - Application chargée.");
});

// ====================================================
// Galerie de l'agence de Montréal
// ====================================================

function changeAgencyImage(imageSrc) {

    const mainImage = document.getElementById("mainAgencyImage");

    if (!mainImage) return;

    mainImage.style.opacity = "0.3";

    setTimeout(() => {

        mainImage.src = imageSrc;

        mainImage.style.opacity = "1";

    }, 200);

}
const menuToggle = document.getElementById("menuToggle");
const navbar = document.querySelector(".navbar");

if (menuToggle && navbar) {

    menuToggle.addEventListener("click", () => {

        navbar.classList.toggle("active");

    });

}

// ====================================================
// FAQ
// ====================================================

const faqButtons = document.querySelectorAll(".faq-question");

faqButtons.forEach(button => {

    button.addEventListener("click", () => {

        const item = button.parentElement;

        item.classList.toggle("active");

    });

});
