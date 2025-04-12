document.addEventListener("DOMContentLoaded", function() {
    // Gestion du bouton de retour avec transition
    const btnRetour = document.getElementById('btn-retour-accueil');
    
    btnRetour.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Redirection après l'animation
        setTimeout(function() {
            // Stocker l'information sur le quartier d'origine pour la transition inverse
            const quartier = window.location.pathname.split('/').pop().replace('.html', '');
            localStorage.setItem('quartierId', quartier);
            localStorage.setItem('transitionRetour', 'true');
            
            window.location.href = btnRetour.getAttribute('href');
        }, 500);
    });
});