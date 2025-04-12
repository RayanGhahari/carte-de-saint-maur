document.addEventListener("DOMContentLoaded", function() {



    const conteneursMarqueurs = document.querySelectorAll(".marker-container");
    const conteneurCarte = document.querySelector(".carte-outer-container");
    const imageCarte = document.querySelector(".carte-img");
    
    const largeurEcranPetit = 800;
    let timeoutId;

    function estPetitEcran() {
        return window.innerWidth < largeurEcranPetit;
    }

    function afficherInfoBulle(elementInfo, rect, rectConteneur, famille) {
        let positionGauche, positionHaut;

        if (famille === 'emmanuelli') {
            positionGauche = rect.right - rectConteneur.left;
            positionHaut = rect.top - rectConteneur.top;
        } else {
            positionGauche = rect.left - rectConteneur.left;
            positionHaut = rect.bottom - rectConteneur.top;
        }

        if (positionGauche + 300 > rectConteneur.width) {
            positionGauche = rect.left - rectConteneur.left - 300;
        }

        elementInfo.style.left = `${positionGauche}px`;
        elementInfo.style.top = `${positionHaut}px`;
        elementInfo.classList.add('visible');
    }

    function cacherInfoBulle(elementInfo) {
        elementInfo.classList.remove('visible');
    }

    function agrandirCarte() {
        imageCarte.style.transform = "scale(1.02)";
        imageCarte.style.filter = "brightness(0.9)";
    }

    function reinitialiserCarte() {
        imageCarte.style.transform = "scale(1)";
        imageCarte.style.filter = "brightness(1)";
    }

    function gererSurvolMarqueur(conteneur) {
        conteneur.addEventListener("mouseenter", function() {
            if (estPetitEcran()) return;
            
            const famille = this.dataset.family;
            const elementInfo = document.getElementById(`info-${famille}`);
            const rect = this.getBoundingClientRect();
            const rectConteneur = conteneurCarte.getBoundingClientRect();

        // Fermer tous les autres divs
        document.querySelectorAll('.famille-info.visible').forEach(div => {
            if (div !== elementInfo) {
                cacherInfoBulle(div);
            }
        });
            
            clearTimeout(timeoutId);
            afficherInfoBulle(elementInfo, rect, rectConteneur, famille);
            agrandirCarte();

            // Ajouter des écouteurs d'événements à l'info-bulle
            elementInfo.addEventListener("mouseenter", function() {
                clearTimeout(timeoutId);
                this.style.transform = 'scale(1.05)';
            });

            elementInfo.addEventListener("mouseleave", function() {
                this.style.transform = 'scale(1)';
                timeoutId = setTimeout(() => {
                    cacherInfoBulle(elementInfo);
                    reinitialiserCarte();
                }, 100);
            });
        });

        conteneur.addEventListener("mouseleave", function() {
            if (estPetitEcran()) return;
            
            const famille = this.dataset.family;
            const elementInfo = document.getElementById(`info-${famille}`);
            
            timeoutId = setTimeout(() => {
                if (!elementInfo.matches(':hover')) {
                    cacherInfoBulle(elementInfo);
                    reinitialiserCarte();
                }
        }, 100);
    });
}

    function gererClicMarqueur(conteneur) {
        conteneur.addEventListener("click", function(e) {
            const famille = this.dataset.family;
            const elementInfo = document.getElementById(`info-${famille}`);
            
            if (estPetitEcran()) {
                e.preventDefault();
                const elementsInfoVisibles = document.querySelectorAll('.famille-info.visible');
                elementsInfoVisibles.forEach(cacherInfoBulle);
                afficherInfoBulleMobile(elementInfo);
            } else {
                window.location.href = `les-Justes/famille-${famille}`;
            }
        });
    }

    function gererClicDocument(event) {
        if (estPetitEcran()) {
            const elementsInfo = document.querySelectorAll('.famille-info.visible');
            elementsInfo.forEach(elementInfo => {
                if (!elementInfo.contains(event.target) && !event.target.closest('.marker-container')) {
                    cacherInfoBulle(elementInfo);
                    elementInfo.style.transform = 'scale(0)';
                }
            });
        }
    }
    
    document.addEventListener('click', gererClicDocument);

    function afficherInfoBulleMobile(elementInfo) {
        elementInfo.classList.add('visible');
        elementInfo.style.left = '50%';
        elementInfo.style.top = '50%';
        elementInfo.style.transform = 'translate(-50%, -50%)';
        
        ajouterBoutonFermer(elementInfo);
        gererBoutonDecouvrirMobile(elementInfo);
    }

    function ajouterBoutonFermer(elementInfo) {
        let boutonFermer = elementInfo.querySelector('button');
        if (!boutonFermer) {
            boutonFermer = document.createElement('button');
            boutonFermer.textContent = 'X';
            boutonFermer.style.position = 'absolute';
            boutonFermer.style.top = '10px';
            boutonFermer.style.right = '10px';
            boutonFermer.addEventListener('click', function() {
                cacherInfoBulle(elementInfo);
            });
            elementInfo.appendChild(boutonFermer);
        }
    }

    function gererBoutonDecouvrirMobile(elementInfo) {
        const boutonDecouvrir = elementInfo.querySelector('.btn-decouvrir');
        if (boutonDecouvrir) {
            boutonDecouvrir.addEventListener('click', function(event) {
                event.stopPropagation();
            });
        }
    }

    conteneursMarqueurs.forEach(conteneur => {
        gererSurvolMarqueur(conteneur);
        gererClicMarqueur(conteneur);
    });

    conteneurCarte.addEventListener("mouseleave", function() {
        if (estPetitEcran()) return;
        
        timeoutId = setTimeout(() => {
            const elementsInfo = document.querySelectorAll('.famille-info');
            elementsInfo.forEach(elementInfo => {
                if (!elementInfo.matches(':hover')) {
                    cacherInfoBulle(elementInfo);
                    elementInfo.style.transform = 'scale(1)'; // Réinitialiser l'échelle
                    reinitialiserCarte();
                }
            });
        }, 100);
    });

});