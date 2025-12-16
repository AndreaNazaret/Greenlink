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
        const video = slide.querySelector('video');

        if (index === currentSlideIndex) {
            slide.classList.add('active');
            if (video) {
                video.currentTime = 0;
                video.play().catch(e => console.warn("Auto-play prevented:", e));
            }
        } else {
            if (video) {
                video.pause();
            }
            if (index < currentSlideIndex) {
                slide.classList.add('prev');
            }
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


// Interaction for "Restrictions" Slide (Flip Cards)
document.addEventListener('DOMContentLoaded', () => {
    const flipCards = document.querySelectorAll('.flip-card');

    flipCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Prevent slide navigation if click is inside card (if nav was click-based, but here distinct)
            e.stopPropagation();
            const inner = card.querySelector('.flip-card-inner');
            if (inner) {
                inner.classList.toggle('is-flipped');
            }
        });
    });
});


// Interaction for "Functionalities" Slide (Slide 5)
document.addEventListener('DOMContentLoaded', () => {
    const featureCards = document.querySelectorAll('.feature-card');
    const placeholder = document.querySelector('.detail-placeholder');
    const allDetails = document.querySelectorAll('.detail-content');

    featureCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Stop propagation to prevent navigation
            e.stopPropagation();

            const featureId = card.getAttribute('data-feature');

            // 1. Highlight Card
            featureCards.forEach(c => c.classList.remove('is-active'));
            card.classList.add('is-active');

            // 2. Show Detail
            if (placeholder) placeholder.style.display = 'none'; // Hide placeholder once interacted

            // Hide all details
            allDetails.forEach(d => d.classList.remove('active'));

            // Show target
            const targetDetail = document.getElementById(`detail-${featureId}`);
            if (targetDetail) {
                targetDetail.classList.add('active');
            }
        });
    });
});
// Navigation Buttons Logic
document.addEventListener('DOMContentLoaded', () => {
    const prevBtn = document.getElementById('prev-slide-btn');
    const nextBtn = document.getElementById('next-slide-btn');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            navigate('prev');
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            navigate('next');
        });
    }
});

// Manejo de botones en diapositivas de Implementación Técnica
// CU1 DATA
const CU1_CONTROLLER_CODE = `<?php

namespace App\\Http\\Controllers\\Auth;

use App\\Http\\Controllers\\Controller;
use App\\Http\\Requests\\Auth\\LoginRequest;
use App\\Services\\CartManager;
use Illuminate\\Http\\RedirectResponse;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Auth;
use Illuminate\\View\\View;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): View
    {
        return view('auth.login');
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        if (Auth::check()) {
            CartManager::syncAfterLogin(Auth::id());
        }

        return redirect()->intended(route('portal.productos', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/miPortal/home');
    }
}`;

const CU1_VIEW_CODE = `@extends('portalTemplates.layout')

@section('content')

    <div class="login-container">
        <h1>Iniciar sesión</h1>

        <!-- MENSAJE DE ÉXITO DE REGISTRO AQUÍ -->
        @if (session('status'))
            <div class="registro-exito">
                {{ session('status') }}
            </div>
        @endif

        <form method="POST" action="{{ route('login') }} " class="login-form">
            @csrf

            <!-- Email -->
            <div>
                <x-input-label for="email" :value="__('Email')" />
                <x-text-input id="email" class="block mt-1 w-full" type="email" name="email"
                              :value="old('email')" required autofocus autocomplete="username" />
                <x-input-error :messages="$errors->get('email')" class="mt-2" />
            </div>

            <!-- Password -->
            <div class="mt-4">
                <x-input-label for="password" :value="__('Contraseña')" />
                <x-text-input id="password" class="block mt-1 w-full"
                              type="password" name="password" required autocomplete="current-password" />
                <x-input-error :messages="$errors->get('password')" class="mt-2" />
            </div>

            <!-- Remember -->
            <div class="block mt-4">
                <label for="remember_me" class="inline-flex items-center">
                    <input id="remember_me" type="checkbox"
                           class="rounded border-gray-300"
                           name="remember">
                    <span class="ms-2 text-sm text-gray-600">Recordarme</span>
                </label>
            </div>

            <div class="flex items-center justify-between mt-4">

                @if (Route::has('password.request'))
                    <a class="underline text-sm text-gray-600 hover:text-gray-900"
                       href="{{ route('password.request') }}">
                        ¿Olvidaste tu contraseña?
                    </a>
                @endif

                <x-primary-button class="ms-3">
                    {{ __('Entrar') }}
                </x-primary-button>
            </div>
        </form>

        <p class="skip-login">
            <a href="{{ route('portal.productos') }}">
                Saltar inicio de sesión
            </a>
        </p>
    </div>

@endsection`;


document.addEventListener('click', (e) => {
    // Check if it is a tech nav button
    if (e.target.classList.contains('tech-nav-btn')) {
        const navColumn = e.target.closest('.tech-nav-column');
        if (!navColumn) return;

        // Visual Active State
        navColumn.querySelectorAll('.tech-nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');

        // Logic for CU1 (Tab switching)
        const tab = e.target.getAttribute('data-tab');
        if (tab) {
            const codeBlock = document.getElementById('cu1-code-block');
            if (codeBlock) {
                if (tab === 'controller') {
                    codeBlock.textContent = CU1_CONTROLLER_CODE;
                } else if (tab === 'view') {
                    codeBlock.textContent = CU1_VIEW_CODE;
                }

                // Re-run Prism highlight
                if (window.Prism) {
                    Prism.highlightElement(codeBlock);
                }
            }
        }

        e.preventDefault();
        e.stopPropagation();
    }
});

// Init CU1 default content
document.addEventListener('DOMContentLoaded', () => {
    const cu1CodeBlock = document.getElementById('cu1-code-block');
    if (cu1CodeBlock) {
        cu1CodeBlock.textContent = CU1_CONTROLLER_CODE;
        // Prism will auto-highlight on load usually, but we ensure content is there first
    }
});
