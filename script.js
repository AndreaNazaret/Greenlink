// Variables de estado
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.slide');
const progressBar = document.getElementById('progress-bar');
const totalSlides = slides.length;
const fullscreenBtn = document.getElementById('fullscreen-btn');
const container = document.getElementById('presentation-container');

// Inicialización
updateSlideClasses();
loadImages();

// Navegación principal
function navigate(direction) {
    const currentSlide = slides[currentSlideIndex];
    const fragments = currentSlide.querySelectorAll('.fragment');
    const visibleFragments = currentSlide.querySelectorAll('.fragment.visible');

    // AVANZAR
    if (direction === 'next') {
        // Si hay fragments pendientes en la diapositiva actual
        if (visibleFragments.length < fragments.length) {
            fragments[visibleFragments.length].classList.add('visible');
        } else {
            // Si no hay fragments o ya se mostraron todos, pasar de diapo
            if (currentSlideIndex < totalSlides - 1) {
                currentSlideIndex++;
                updateSlideClasses();
            }
        }
    }
    // RETROCEDER
    else if (direction === 'prev') {
        // Si hay fragments visibles, ocultar el último
        if (visibleFragments.length > 0) {
            visibleFragments[visibleFragments.length - 1].classList.remove('visible');
        } else {
            // Si no hay fragments visibles, volver a la diapo anterior
            if (currentSlideIndex > 0) {
                currentSlideIndex--;
                updateSlideClasses();
            }
        }
    }
}

// Actualizar clases CSS y barra de progreso
function updateSlideClasses() {
    slides.forEach((slide, index) => {
        slide.classList.remove('active', 'prev');
        if (index === currentSlideIndex) {
            slide.classList.add('active');
        } else if (index < currentSlideIndex) {
            slide.classList.add('prev');
        }
    });
    progressBar.textContent = `${currentSlideIndex + 1} / ${totalSlides}`;
}

// Manejo de teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        navigate('next');
    } else if (e.key === 'ArrowLeft') {
        navigate('prev');
    }
});

// Función de carga de imágenes (Placeholders)
function loadImages() {
    const placeholders = document.querySelectorAll('.placeholder-img');
    placeholders.forEach(div => {
        const imgPath = div.getAttribute('data-img');
        if (imgPath) {
            const img = new Image();
            img.src = imgPath;
            img.onload = () => {
                // Si carga bien, mostramos la imagen y ocultamos el texto placeholder
                const imgElement = document.createElement('img');
                imgElement.src = imgPath;
                div.innerHTML = '';
                div.appendChild(imgElement);
                div.style.border = 'none';
                div.style.backgroundColor = 'transparent';
            };
            img.onerror = () => {
                // Si falla (lo normal en este ejemplo), se queda el placeholder
                console.log(`Imagen no encontrada: ${imgPath}, mostrando placeholder.`);
            };
        }
    });
}

// Pantalla completa
fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        container.requestFullscreen().catch(err => {
            alert(`Error al intentar pantalla completa: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
});

// Interaction for "What is GreenLink" Slide (Slide 3)
document.addEventListener('DOMContentLoaded', () => {
    const modelBtns = document.querySelectorAll('.model-btn');

    modelBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');

            // Deactivate all buttons and panes
            document.querySelectorAll('.model-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.model-pane').forEach(p => p.classList.remove('active'));

            // Activate clicked button and target pane
            btn.classList.add('active');
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
});
