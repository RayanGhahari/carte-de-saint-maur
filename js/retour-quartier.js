window.addEventListener("beforeunload", function () {
    const matchQuartier = window.location.pathname.match(/quartier\/([a-z0-9\-]+)\.html/);
    const matchRue = window.location.pathname.match(/rues\/([a-z0-9\-]+)\.html/);
    
    const famille = matchQuartier?.[1] || matchRue?.[1];
    if (famille) {
        localStorage.setItem('transitionRetour', 'true');
        localStorage.setItem('famille', famille);
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

            
            setTimeout(function() {
                if (famille) {
                    localStorage.setItem('famille', famille);
                    localStorage.setItem('transitionRetour', 'true');
                }
                window.location.href = btnRetour.getAttribute('href');
            }, 500);
        });
    }
});
