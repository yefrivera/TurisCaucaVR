document.addEventListener("DOMContentLoaded", function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menuContent = document.querySelector('.menu-content');
    const dropdowns = document.querySelectorAll('.dropdown');

    function toggleMenu() {
        if (window.innerWidth <= 768) {
            menuContent.classList.toggle('show');
        }
    }

    function toggleDropdown(event) {
        if (window.innerWidth <= 768) {
            event.preventDefault();

            const dropdownContent = this.nextElementSibling;

            // Cierra todos los dropdowns antes de abrir el seleccionado
            dropdowns.forEach(function(item) {
                const content = item.querySelector('.dropdown-content');
                if (content !== dropdownContent) {
                    content.classList.remove('show');
                }
            });

            // Abre el dropdown actual
            dropdownContent.classList.toggle('show');
        }
    }

    // Toggle del menú principal al hacer clic en el ícono de hamburguesa
    menuToggle.addEventListener('click', toggleMenu);

    // Toggle de los dropdowns
    dropdowns.forEach(function(dropdown) {
        const dropbtn = dropdown.querySelector('.dropbtn');
        dropbtn.addEventListener('click', toggleDropdown);
    });

    // Escuchar cambios en el tamaño de la ventana para cerrar los menús si se vuelve a escritorio
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            menuContent.classList.remove('show');
            dropdowns.forEach(function(item) {
                const content = item.querySelector('.dropdown-content');
                content.classList.remove('show');
            });
        }
    });
});
