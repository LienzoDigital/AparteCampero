// Confirmar nuevo evento
document.getElementById('confirmNewEvent').addEventListener('click', () => {
    // Borrar todos los datos del localStorage
    localStorage.removeItem('camperoTeams');
    localStorage.removeItem('camperoTimes');
    
    // Recargar la página
    window.location.reload();
    
    // Cerrar el modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('confirmModal'));
    modal.hide();
});