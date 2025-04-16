window.addEventListener("pageshow", function(event) {
    if (event.persisted) {
        // Effet de dézoom avant le rechargement pour les mobiles
        const imageCarte = document.querySelector(".carte-img");
        const carteContainer = document.querySelector(".carte-container");

        if (imageCarte && carteContainer) {
            imageCarte.style.transition = "transform 2s ease";
            carteContainer.style.transition = "transform 2s ease";
            imageCarte.style.transform = "scale(1)";
            carteContainer.style.transform = "translate(0, 0)";
        }

        const isMobile = navigator.userAgentData.mobile || window.innerWidth < 800;

        const delai = isMobile ? 2000 : 0;
        setTimeout(() => {
            window.location.reload();
        }, delai);
    }
});


document.addEventListener("DOMContentLoaded", function() {
    const conteneursMarqueurs = document.querySelectorAll(".marker-container");
    const conteneurCarte = document.querySelector(".carte-outer-container");
    const imageCarte = document.querySelector(".carte-img");
    const carteContainer = document.querySelector(".carte-container");
    
    const largeurEcranPetit = 900;
    let timeoutId;
    let isTransitioning = false;

    // Coordonnées de zoom pour chaque quartier (centre x%, centre y%, niveau de zoom)
    const zoomCoordinates = {
        'lavarenne': { x: 100, y: 70, scale: 1.75 },
        'leparcsm': { x: 70, y: 11, scale: 2.75 },
        'vieuxsm': { x: -20, y: -55, scale: 3.25 },
        'champignol': { x: 115, y: 20, scale: 2.75 },
        'smcreteil': { x: -50, y: -10, scale: 3 },
        'adamville': { x: 38.6, y: 60, scale: 2.25 },
        'lapie': { x: 15, y: 100, scale: 2 },
        'lesmuriers': { x: 95, y: 167, scale: 3.5 },
        'place-de-stalingrad': { x: 145, y: 80, scale: 5 },
        'rue-de-birhakeim': { x: -75, y: 47, scale: 4.5 },
        'place-du-marechal-juin': { x: 85, y: -10, scale: 5 },
        'rue-bayon': { x: 170, y: 290, scale: 6 },
        'place-de-la-resistance': { x: 45, y: 250, scale: 5 },
        'avenue-de-la-liberation': { x: 35, y: 50, scale: 2 },
        'avenue-de-lattre-de-tassigny': { x: 50, y: 20, scale: 2 },
        'avenue-du-general-leclerc': { x: 35, y: 35, scale: 2 },
        'rue-andre-bollier': { x: 70, y: 85, scale: 3.5 },
        'rue-edouard-vallerand': { x: 5, y: -100, scale: 4 },
        'square-emilie-tillion': { x: -20, y: 30, scale: 4 },
        'avenue-des-fusilles-de-chateaubriant': { x: 60, y: 60, scale: 3 },
        'avenue-gabriel-peri': { x: 90, y: 70, scale: 2 },
        'boulevard-du-general-giraud': { x: 40, y: 40, scale: 1.5 },
        'place-jean-moulin': { x: -80, y: -45, scale: 5 },
        'avenue-leopold-sedar-senghor': { x: -160, y: 30, scale: 6 },
        'avenue-pierre-brossolette': { x: -30, y: -40, scale: 3.5 },
        'rue-politzer': { x: -20, y: -68, scale: 3.5 },
        'carrefour-du-huit-mai-1945': { x: 120, y: -100, scale: 5 },
        'square-et-avenue-darromanches': { x: -10, y: 70, scale: 4 },
        'avenue-pierre-semard': { x: 50, y: 80, scale: 2 },
        'avenue-et-place-charles-de-gaulle': { x: 30, y: -130, scale: 4.5 },
        'square-victor-basch': { x: 165, y: 90, scale: 4 },
        'quai-winston-churchill': { x: 100, y: 20, scale: 2 },
        'rue-de-metz': { x: 80, y: 110, scale: 4.5 },
    };

    centrerCarteEtMarqueurs();
    
    window.addEventListener('resize', centrerCarteEtMarqueurs);
    
    function centrerCarteEtMarqueurs() {
        conteneurCarte.style.height = window.innerHeight + 'px';

        if (estPetitEcran()) {
            carteContainer.style.height = 'auto';
            carteContainer.style.width = '90vw';
            imageCarte.style.height = 'auto';
            imageCarte.style.width = '100%';
        } else {
            carteContainer.style.height = '100vh';
            carteContainer.style.width = 'auto';
            imageCarte.style.height = '100%';
            imageCarte.style.width = 'auto';
        }
    }

    function estPetitEcran() {
        return window.innerWidth < largeurEcranPetit;
    }

    function afficherInfoBulle(elementInfo, rect, rectConteneur, famille) {
        let positionGauche, positionHaut;
        
        switch(famille) {
            case 'lavarenne':
                positionGauche = rect.right - rectConteneur.left;
                positionHaut = rect.top - rectConteneur.top;
                break;
            case 'champignol':
                positionGauche = 2*rect.left + 2*rectConteneur.left;
                positionHaut = - rect.bottom + rectConteneur.top;
                break;
            case 'adamville':
                positionGauche = 2*rect.left + 2*rectConteneur.left;
                positionHaut = rect.bottom - rectConteneur.top;
                break;
            case 'rue-edouard-vallerand':
                positionGauche = rect.left - rectConteneur.left - 350;
                positionHaut = - rect.bottom + rectConteneur.top;
                break;
            default:
                positionGauche = rect.right - rectConteneur.left;
                positionHaut = rect.top - rectConteneur.top;
        }

        if (positionGauche + 310 > rectConteneur.width) {
            positionGauche = rect.left - rectConteneur.left - 350;
        }
        
        if (positionGauche < 0) {
            positionGauche = 10;
        }
        
        if (positionHaut + 400 > rectConteneur.height) {
            positionHaut = rect.top - rectConteneur.top - 200;
        }
        
        if (positionHaut < 0) {
            positionHaut = 10;
        }

        if (positionHaut < 0) {
            positionHaut = 10;
        }

        elementInfo.style.left = `${positionGauche}px`;
        elementInfo.style.top = `${positionHaut}px`;
        elementInfo.classList.add('visible');
    }

    function cacherInfoBulle(elementInfo) {
        elementInfo.classList.remove('visible');
    }

    function agrandirCarte() {
        imageCarte.style.filter = "brightness(0.9)";
    }

    function reinitialiserCarte() {
        if (!isTransitioning) {
            imageCarte.style.transform = "scale(1)";
            imageCarte.style.filter = "brightness(1)";
            carteContainer.style.transform = "translate(0, 0)";
        }
    }

    // Créer un overlay pour bloquer les interactions pendant la transition
    function creerOverlayTransition() {
        let overlay = document.getElementById('transition-overlay');
        
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'transition-overlay';
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.zIndex = '999';
            overlay.style.pointerEvents = 'all';
            overlay.style.background = 'transparent';
            document.body.appendChild(overlay);
        } else {
            overlay.style.display = 'block';
        }
        
        return overlay;
    }

    function supprimerOverlayTransition() {
        const overlay = document.getElementById('transition-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    function zoomSurQuartier(famille, callback) {
        if (isTransitioning) return;
        isTransitioning = true;

        // Créer un overlay pour bloquer toute interaction pendant la transition
        const overlay = creerOverlayTransition();

        const coords = zoomCoordinates[famille];
        
        // Cacher tous les marqueurs pendant l'animation
        conteneursMarqueurs.forEach(marqueur => {
            marqueur.style.opacity = '0';
            marqueur.style.transition = 'opacity 0.1s';
        });
        
        // Cacher le titre
        const titre = document.querySelector('.titre');
        if (titre) {
            titre.style.opacity = '0';
            titre.style.transition = 'opacity 0.5s ease';
        }
        
        // Arrêter tous les timeouts en cours
        clearTimeout(timeoutId);
        
        // Cacher toutes les infobulles visibles
        document.querySelectorAll('.famille-info.visible').forEach(div => {
            cacherInfoBulle(div);
        });
        
        // Centrer la carte sur le quartier et appliquer le zoom
        carteContainer.style.transition = 'transform 2s ease';
        imageCarte.style.transition = 'transform 2s ease';
        
        // Calcule le décalage pour centrer le point sur l'écran
        const xOffset = 50 - coords.x;
        const yOffset = 50 - coords.y;
        
        carteContainer.style.transform = `translate(${xOffset}%, ${yOffset}%)`;
        imageCarte.style.transform = `scale(${coords.scale})`;
        
        // Après la fin de l'animation, naviguer vers la page du quartier
        setTimeout(function() {
            // Supprimer l'overlay avant de naviguer
            supprimerOverlayTransition();
            
            // Appeler le callback (navigation)
            callback();
        }, 2000);
    }

    function zoomSurRue(famille, callback) {
        if (isTransitioning) return;
        isTransitioning = true;
    
        const overlay = creerOverlayTransition();
        const coords = zoomCoordinates[famille];
    
        conteneursMarqueurs.forEach(marqueur => {
            marqueur.style.opacity = '0';
            marqueur.style.transition = 'opacity 0.1s';
        });
    
        const soustitre = document.querySelector('.sous-titre');
        if (soustitre) {
            soustitre.style.opacity = '0';
            soustitre.style.transition = 'opacity 0.1s ease';
        }
    
        clearTimeout(timeoutId);
    
        document.querySelectorAll('.famille-info.visible').forEach(cacherInfoBulle);
    
        carteContainer.style.transition = 'transform 2s ease';
        imageCarte.style.transition = 'transform 2s ease';
    
        const xOffset = 50 - coords.x;
        const yOffset = 50 - coords.y;
    
        carteContainer.style.transform = `translate(${xOffset}%, ${yOffset}%)`;
        imageCarte.style.transform = `scale(${coords.scale})`;
    
        setTimeout(function() {
            // Supprimer l'overlay avant de naviguer
            supprimerOverlayTransition();
            
            // Appeler le callback (navigation)
            callback();
        }, 2000);
    }
    

    function gererSurvolMarqueur(conteneur) {
        conteneur.addEventListener("mouseenter", function() {
            if (estPetitEcran() || isTransitioning) return;
            
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
                if (isTransitioning) return;
                clearTimeout(timeoutId);
                this.style.transform = 'scale(1.05)';
            });

            elementInfo.addEventListener("mouseleave", function() {
                if (isTransitioning) return;
                this.style.transform = 'scale(1)';
                timeoutId = setTimeout(() => {
                    if (!isTransitioning) {
                        cacherInfoBulle(elementInfo);
                        reinitialiserCarte();
                    }
                }, 100);
            });
        });

        conteneur.addEventListener("mouseleave", function() {
            if (estPetitEcran() || isTransitioning) return;
            
            const famille = this.dataset.family;
            const elementInfo = document.getElementById(`info-${famille}`);
            
            timeoutId = setTimeout(() => {
                if (!isTransitioning && !elementInfo.matches(':hover')) {
                    cacherInfoBulle(elementInfo);
                    reinitialiserCarte();
                }
            }, 100);
        });
    }

    function gererClicMarqueur(conteneur) {
        conteneur.addEventListener("click", function(e) {
            if (isTransitioning) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            
            const famille = this.dataset.family;
            const elementInfo = document.getElementById(`info-${famille}`);
            const estDansQuartier = /\/quartier\//.test(window.location.pathname);
    
            if (estPetitEcran()) {
                e.preventDefault();
                const elementsInfoVisibles = document.querySelectorAll('.famille-info.visible');
                elementsInfoVisibles.forEach(cacherInfoBulle);
                afficherInfoBulleMobile(elementInfo);
            } else {
                e.preventDefault();
                cacherInfoBulle(elementInfo);
    
                if (estDansQuartier) {
                    zoomSurRue(famille, function() {
                        const lienRue = famille
                        window.location.href = `../rues/${lienRue}.html`;
                    });
                } else {
                    zoomSurQuartier(famille, function() {
                        const lienQuartier = famille
                            .replace('leparcsm', 'le-parc-saint-maur')
                            .replace('vieuxsm', 'vieux-saint-maur')
                            .replace('smcreteil', 'saint-maur-creteil')
                            .replace('lesmuriers', 'les-muriers')
                            .replace('lavarenne', 'la-varenne')
                            .replace('lapie', 'la-pie');
                        window.location.href = `quartier/${lienQuartier}.html`;
                    });
                }
            }
        });
    }
    

    function gererClicDocument(event) {
        if (estPetitEcran() && !isTransitioning) {
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
            boutonFermer.classList.add('bouton-fermer');
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

    // Gérer les clics sur les boutons "Découvrir"
    const boutonsDecouvrir = document.querySelectorAll('.btn-decouvrir');
    boutonsDecouvrir.forEach(bouton => {
        bouton.addEventListener('click', function(e) {
            if (isTransitioning) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            
            e.preventDefault();
            
            const familleInfo = this.closest('.famille-info');
            if (!familleInfo) return;
            
            // Extraire l'identifiant du quartier à partir de l'ID de l'élément info
            const infoId = familleInfo.id;
            const famille = infoId.replace('info-', '');
            
            // Fermer l'infobulle
            cacherInfoBulle(familleInfo);
            
            // Zoomer sur le quartier puis naviguer
            zoomSurQuartier(famille, function() {
                // Rediriger vers l'URL spécifiée dans le bouton
                window.location.href = bouton.getAttribute('href');
            });
        });
    });

    conteneursMarqueurs.forEach(conteneur => {
        gererSurvolMarqueur(conteneur);
        gererClicMarqueur(conteneur);
    });

    conteneurCarte.addEventListener("mouseleave", function() {
        if (estPetitEcran() || isTransitioning) return;
        
        timeoutId = setTimeout(() => {
            if (!isTransitioning) {
                const elementsInfo = document.querySelectorAll('.famille-info');
                elementsInfo.forEach(elementInfo => {
                    if (!elementInfo.matches(':hover')) {
                        cacherInfoBulle(elementInfo);
                        elementInfo.style.transform = 'scale(1)';
                        reinitialiserCarte();
                    }
                });
            }
        }, 100);
    });

    // Généralisation du zoom
if (localStorage.getItem('transitionRetour') === 'true') {
    let famille = localStorage.getItem('rueVisitee');
    if (!famille) {
        const quartier = localStorage.getItem('quartierVisite');

        const normalisations = {
            'le-parc-saint-maur': 'leparcsm',
            'vieux-saint-maur': 'vieuxsm',
            'saint-maur-creteil': 'smcreteil',
            'les-muriers': 'lesmuriers',
            'la-varenne': 'lavarenne',
            'la-pie': 'lapie'
        };
        
        famille = normalisations[quartier] || quartier;
    }

    if (famille && zoomCoordinates[famille]) {
        const coords = zoomCoordinates[famille];

        isTransitioning = true;
        creerOverlayTransition();

        conteneursMarqueurs.forEach(marqueur => marqueur.style.opacity = '0');
        const titre = document.querySelector('.titre');
        if (titre) titre.style.opacity = '0';

        const xOffset = 50 - coords.x;
        const yOffset = 50 - coords.y;

        carteContainer.style.transition = 'none';
        imageCarte.style.transition = 'none';
        carteContainer.style.transform = `translate(${xOffset}%, ${yOffset}%)`;
        imageCarte.style.transform = `scale(${coords.scale})`;

        void carteContainer.offsetWidth;

        setTimeout(() => {
            carteContainer.style.transition = 'transform 2s ease';
            imageCarte.style.transition = 'transform 2s ease';
            carteContainer.style.transform = 'translate(0, 0)';
            imageCarte.style.transform = 'scale(1)';

            setTimeout(() => {
                conteneursMarqueurs.forEach(marqueur => marqueur.style.opacity = '1');
                if (titre) titre.style.opacity = '1';
                isTransitioning = false;
                supprimerOverlayTransition();
            }, 2000);
        }, 100);

        localStorage.removeItem('transitionRetour');
        localStorage.removeItem('rueVisitee');
        localStorage.removeItem('quartierVisite');
    }
}

    document.body.classList.add('js-loaded');
});