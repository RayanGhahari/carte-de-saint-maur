window.addEventListener("beforeunload", function () {
    const matchQuartier = window.location.pathname.match(/quartier\/([a-z0-9\-]+)\.html/);
    const matchRue = window.location.pathname.match(/rues\/([a-z0-9\-]+)\.html/);
    
    if (matchRue?.[1]) {
        // Si c'est une rue, on enregistre la rue ET on efface le quartier
        localStorage.setItem('transitionRetour', 'true');
        localStorage.setItem('rueVisitee', matchRue[1]);
        localStorage.removeItem('quartierVisite');
    } else if (matchQuartier?.[1]) {
        if (!localStorage.getItem('rueVisitee')) {
            localStorage.setItem('transitionRetour', 'true');
            localStorage.setItem('quartierVisite', matchQuartier[1]);
        }
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const btnRetour = document.getElementById('btn-retour-accueil');
    
    if (btnRetour) {
        btnRetour.addEventListener('click', function(e) {
            e.preventDefault();
            
            const path = window.location.pathname;
            const matchQuartier = path.match(/quartier\/([a-z0-9\-]+)\.html/);
            const matchRue = path.match(/rues\/([a-z0-9\-]+)\.html/);
            
            setTimeout(function() {
                if (matchRue?.[1]) {
                    localStorage.setItem('rueVisitee', matchRue[1]);
                    localStorage.removeItem('quartierVisite');
                    localStorage.setItem('transitionRetour', 'true');
                } else if (matchQuartier?.[1] && !localStorage.getItem('rueVisitee')) {
                    localStorage.setItem('quartierVisite', matchQuartier[1]);
                    localStorage.setItem('transitionRetour', 'true');
                }
                window.location.href = btnRetour.getAttribute('href');
            }, 500);
        });
    }
});