window.addEventListener("beforeunload", function () {
    const matchQuartier = window.location.pathname.match(/quartier\/([a-z0-9\-]+)\.html/);
    const matchRue = window.location.pathname.match(/rues\/([a-z0-9\-]+)\.html/);
    
    const famille = matchQuartier?.[1] || matchRue?.[1];
    if (famille) {
        localStorage.setItem('transitionRetour', 'true');
        localStorage.setItem('famille', famille);
        // Ajouter un timestamp pour garantir que la transition est récente
        localStorage.setItem('transitionTimestamp', Date.now());
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
            const famille = matchQuartier?.[1] || matchRue?.[1];
            
            // Forcer l'animation à se terminer proprement avant de naviguer
            document.body.classList.add('transition-active');
            
            setTimeout(function() {
                if (famille) {
                    localStorage.setItem('famille', famille);
                    localStorage.setItem('transitionRetour', 'true');
                    localStorage.setItem('transitionTimestamp', Date.now());
                }
                window.location.href = btnRetour.getAttribute('href');
            }, 500);
        });
    }
});