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


// CU2 DATA
const CU2_ROUTES_CODE = `// Catálogo público de productos (para el portal)
Route::get('/miPortal/productos', [ProductoController::class, 'catalogo'])
    ->name('portal.productos');

// Detalle de los productos incluyendo vendedores y stock
Route::get('/productos/{producto}', [ProductoController::class, 'show'])
    ->name('productos.show');`;

const CU2_VIEW_CAT_CODE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Catálogo de Productos - Greenlink</title>
    <link rel="stylesheet" href="{{ asset('css/grupo1.css') }}">
</head>

<body>

@include('portalTemplates.partials.header')

<header>
<div class="header-text">
    <h1>CATÁLOGO PRODUCTOS</h1>
    <p>A continuación encontrarás todos los productos que ponemos a tu disposición</p>
</div>
</header>

<div class="catalogo-container">

    <form method="GET" class="filtros">
        <div>
            <label>Categoría:</label>
            <select name="categoria" onchange="this.form.submit()">
                <option value="">Todas</option>
                @foreach($categorias as $cat)
                    <option value="{{ $cat }}" {{ request('categoria') === $cat ? 'selected' : '' }}>
                        {{ $cat }}
                    </option>
                @endforeach
            </select>
        </div>
    </form>

    <div class="productos-grid">
        @foreach($productos as $producto)
            <div class="producto-card">

                <h3>{{ $producto->nombre }}</h3>


                <div class="producto-detalle">
                    <strong>Categoría:</strong>
                    <span>{{ $producto->categoria }}</span>
                </div>

                @if($producto->certificacion)
                    <div class="producto-detalle">
                        <strong>Descripción:</strong>
                        <span>{{ $producto->descripcion }}</span>
                    </div>

                    <span class="badge-cert">
                     {{ $producto->certificacion }}
                    </span>
                @endif

                <a class="btn-comprar"
                   href="{{ route('productos.show', ['producto' => $producto->id_producto]) }}">
                    Ver detalles
                </a>

            </div>


        @endforeach
    </div>

</div>

@include('portalTemplates.partials.footer')

</body>
</html>`;

const CU2_VIEW_DET_CODE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>{{ $producto->nombre }} - Greenlink</title>
    <link rel="stylesheet" href="{{ asset('css/grupo1.css') }}">
</head>

<body>

@include('portalTemplates.partials.header')

<header class="catalogo-header">
    <div class="header-text">
        <h1>{{ $producto->nombre }}</h1>
        <p>Detalles del producto y vendedores disponibles</p>
    </div>
</header>

<div class="catalogo-container">

    @if (session('status'))
        <div class="alert alert-success">
            {{ session('status') }}
        </div>

        <div class="carrito-cta">
            <a href="{{ route('portal.productos') }}" class="cta-btn cta-btn-ghost">Seguir comprando</a>
            <a href="{{ route('carrito.index') }}" class="cta-btn cta-btn-primary">Ver carrito</a>
        </div>
    @endif

    @if ($errors->has('cantidad'))
        <div class="alert alert-danger">
            {{ $errors->first('cantidad') }}
        </div>
    @endif

    {{-- ====================
         DATOS DEL PRODUCTO
         ==================== --}}
    <section class="producto-detalle-principal detalle-producto-page">

    <h2>{{ $producto->nombre }}</h2>

        <div class="producto-detalle">
            <strong>Categoría:</strong>
            <span>{{ $producto->categoria }}</span>
        </div>

        <div class="producto-detalle">
            <strong>Descripción:</strong>
            <span>{{ $producto->descripcion }}</span>
        </div>

        @if($producto->certificacion)
            <div class="producto-detalle">
                <strong>Certificación:</strong>
                <span>{{ $producto->certificacion }}</span>
            </div>

            <span class="badge-cert">
                {{ $producto->certificacion }}
            </span>
        @endif
    </section>

    {{-- ====================
         LISTA DE VENDEDORES
         ==================== --}}
    <section class="producto-vendedores">
        <h2>Vendedores que ofrecen este producto</h2>

        @if($vendedores->isEmpty())
            <p>No hay vendedores disponibles para este producto.</p>
        @else
            <div class="productos-grid">

                @foreach($vendedores as $vendedor)
                    <div class="producto-card">

                        <h3>{{ $vendedor->nombre }}</h3>

                        <div class="producto-detalle">
                            <strong>Tipo comercio:</strong>
                            <span>{{ $vendedor->tipo_comercio }}</span>
                        </div>

                        <div class="producto-detalle">
                            <strong>Canal:</strong>
                            <span>{{ $vendedor->canal }}</span>
                        </div>

                        <div class="producto-detalle">
                            <strong>País:</strong>
                            <span>{{ $vendedor->pais }}</span>
                        </div>

                        <div class="producto-detalle">
                            <strong>Stock:</strong>
                            <span>{{ $vendedor->pivot->stock }}</span>
                        </div>

                        <span class="badge-cert">
                            {{ number_format($vendedor->pivot->precio, 2, ',', '.') }} €
                        </span>

                        <form action="{{ route('carrito.add') }}" method="POST" class="carrito-add-form">
                            @csrf
                            <input type="hidden" name="id_producto" value="{{ $producto->id_producto }}">
                            <input type="hidden" name="id_contenido" value="{{ $vendedor->pivot->id_contenido }}">

                            <label for="cantidad-{{ $vendedor->id_vendedor }}">Cantidad</label>
                            <input id="cantidad-{{ $vendedor->id_vendedor }}"
                                   type="number"
                                   name="cantidad"
                                   min="1"
                                   max="{{ $vendedor->pivot->stock }}"
                                   value="1">

                            <button type="submit" class="btn btn-primary">
                                Añadir al carrito
                            </button>
                        </form>

                    </div>
                @endforeach

            </div>
        @endif
    </section>

</div>

@include('portalTemplates.partials.footer')

</body>
</html>`;

const CU2_CONTROLLER_CODE = `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Producto;
use Illuminate\\Http\\Request;

class ProductoController extends Controller
{
    public function index()
    {
        $productos = Producto::all();
        return view('productos.index', compact('productos'));
    }

    public function show(Producto $producto)
    {
        // Cargar vendedores relacionados (tabla contenido)
        $producto->load('vendedores');

        return view('productos.show', [
            'producto' => $producto,
            'vendedores' => $producto->vendedores
        ]);
    }

    public function create()
    {
        return view('productos.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre'        => 'required|string|max:100',
            'categoria'     => 'required|string|max:50',
            'descripcion'   => 'required|string|max:1000',
            'certificacion' => 'nullable|string|max:100'
        ]);

        Producto::create($validated);

        return redirect()->route('productos.index');
    }

    public function edit($id)
    {
        $producto = Producto::findOrFail($id);
        return view('productos.edit', compact('producto'));
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nombre'        => 'required|string|max:100',
            'categoria'     => 'required|string|max:50',
            'descripcion'   => 'required|string|max:1000',
            'certificacion' => 'nullable|string|max:100'
        ]);

        $producto = Producto::findOrFail($id);
        $producto->update($validated);

        return redirect()->route('productos.index');
    }

    public function destroy($id)
    {
        Producto::destroy($id);
        return redirect()->route('productos.index');
    }

    /* -----------------------------
    *   CATÁLOGO PÚBLICO DEL PORTAL
    * -----------------------------*/
    public function catalogo(Request $request)
    {
        // recoger categorías únicas
        $categorias = Producto::select('categoria')
            ->distinct()
            ->orderBy('categoria')
            ->pluck('categoria');

        // base query
        $query = Producto::query();

        // filtrar por categoría si existe
        if ($request->filled('categoria')) {
            $query->where('categoria', $request->categoria);
        }

        /*
         * ELIMINAMOS EL ORDEN POR PRECIO
         * porque precio ya NO existe en productos
         * Más adelante podemos ordenar por precio mínimo en tabla contenido.
         */

        $productos = $query->get();

        return view('productos.catalogo', compact('productos', 'categorias'));
    }
}`;

// CU3 DATA
const CU3_ROUTES_CODE = `// Carrito
Route::get('/carrito', [CartController::class, 'index'])->name('carrito.index');
Route::post('/carrito/add', [CartController::class, 'add'])->name('carrito.add');
Route::post('/carrito/update', [CartController::class, 'update'])->name('carrito.update');
Route::post('/carrito/remove', [CartController::class, 'remove'])->name('carrito.remove');
Route::post('/carrito/checkout', [CartController::class, 'checkout'])->name('carrito.checkout');`;

const CU3_CONTROLLER_CODE = `<?php

namespace App\\Http\\Controllers;

use App\\Models\\CartItem;
use App\\Models\\Contenido;
use App\\Models\\Producto;
use App\\Services\\CartManager;
use Illuminate\\Http\\RedirectResponse;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\DB;
use Illuminate\\View\\View;

class CartController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth')->only('checkout');
    }

    public function index(): View
    {
        $cart = CartManager::currentCart()->load('items');
        $items = $cart->items;

        $contenidos = Contenido::whereIn('id_contenido', $items->pluck('id_contenido')->filter())
            ->get()
            ->keyBy('id_contenido');

        return view('portalTemplates.carrito', [
            'cart' => $cart,
            'items' => $items,
            'contenidos' => $contenidos,
            'total' => $cart->total(),
        ]);
    }

    public function add(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'id_producto' => 'required|integer|exists:productos,id_producto',
            'id_contenido' => 'required|integer|exists:contenido,id_contenido',
            'cantidad' => 'nullable|integer|min:1',
        ]);

        $cantidad = $data['cantidad'] ?? 1;

        $contenido = Contenido::where('id_contenido', $data['id_contenido'])
            ->where('id_producto', $data['id_producto'])
            ->firstOrFail();

        if ($cantidad > $contenido->stock) {
            return back()->withErrors([
                'cantidad' => 'La cantidad solicitada supera el stock disponible.',
            ])->withInput();
        }

        $cart = CartManager::currentCart();

        $existing = $cart->items()
            ->where('id_contenido', $contenido->id_contenido)
            ->first();

        if ($existing) {
            $nuevoTotal = $existing->cantidad + $cantidad;
            if ($nuevoTotal > $contenido->stock) {
                return back()->withErrors([
                    'cantidad' => 'No hay stock suficiente para incrementar la cantidad solicitada.',
                ]);
            }

            $existing->cantidad = $nuevoTotal;
            $existing->fecha_actualizacion = now();
            $existing->save();
        } else {
            $producto = $contenido->producto ?? Producto::findOrFail($data['id_producto']);

            $cart->items()->create([
                'id_producto' => $producto->id_producto,
                'id_contenido' => $contenido->id_contenido,
                'id_vendedor' => $contenido->id_vendedor,
                'cantidad' => $cantidad,
                'precio_unitario' => $contenido->precio,
                'nombre_producto' => $producto->nombre,
                'nombre_vendedor' => optional($contenido->vendedor)->nombre,
                'fecha_creacion' => now(),
                'fecha_actualizacion' => now(),
            ]);
        }

        CartManager::refreshCounter($cart->fresh('items'));

        return back()->with('status', 'Producto añadido al carrito correctamente.');
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'id_item' => 'required|integer|exists:carrito_items,id_item',
            'cantidad' => 'required|integer|min:1',
        ]);

        $cart = CartManager::currentCart();

        /** @var CartItem $item */
        $item = $cart->items()
            ->where('id_item', $data['id_item'])
            ->firstOrFail();

        $contenido = $item->id_contenido ? Contenido::find($item->id_contenido) : null;

        if ($contenido && $data['cantidad'] > $contenido->stock) {
            return back()->withErrors([
                'cantidad' => 'La cantidad solicitada supera el stock disponible.',
            ]);
        }

        $item->cantidad = $data['cantidad'];
        $item->fecha_actualizacion = now();
        $item->save();

        CartManager::refreshCounter($cart->fresh('items'));

        return back()->with('status', 'Cantidad actualizada.');
    }

    public function remove(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'id_item' => 'required|integer|exists:carrito_items,id_item',
        ]);

        $cart = CartManager::currentCart();

        $item = $cart->items()
            ->where('id_item', $data['id_item'])
            ->first();

        if ($item) {
            $item->delete();
        }

        CartManager::refreshCounter($cart->fresh('items'));

        return back()->with('status', 'Producto eliminado del carrito.');
    }

    public function checkout(): RedirectResponse
    {
        if (!auth()->check()) {
            return redirect()->route('login')
                ->with('status', 'Inicia sesión para confirmar tu compra.');
        }

        $cart = CartManager::currentCart();

        if ($cart->items()->count() === 0) {
            return back()->withErrors([
                'checkout' => 'Tu carrito está vacío.',
            ]);
        }

        return redirect()->route('payment.gateway');
    }
}`;

const CU3_VIEW_CODE = `@extends('portalTemplates.layout')

@section('content')
    <section class="carrito-wrapper">
        <div class="carrito-header">
            <h1>Tu carrito de compra</h1>
            <p>Gestiona tus productos antes de confirmar la compra.</p>
        </div>

        @if (session('status'))
            <div class="alert alert-success">
                {{ session('status') }}
            </div>
        @endif

        @if ($errors->any())
            <div class="alert alert-danger">
                {{ $errors->first() }}
            </div>
        @endif

        @if ($items->isEmpty())
            <div class="carrito-empty">
                <p>Tu carrito está vacío por ahora.</p>
                <a class="btn btn-primary" href="{{ route('portal.productos') }}">Explorar catálogo</a>
            </div>
        @else
            <div class="portal-table">
                <table>
                    <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Vendedor</th>
                        <th>Precio unitario</th>
                        <th>Stock disponible</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    @foreach($items as $item)
                        @php
                            $contenido = $contenidos[$item->id_contenido] ?? null;
                            $stockDisponible = $contenido?->stock ?? 'N/D';
                        @endphp
                        <tr>
                            <td>
                                <strong>{{ $item->nombre_producto ?? 'Producto' }}</strong>
                            </td>
                            <td>{{ $item->nombre_vendedor ?? 'Vendedor' }}</td>
                            <td>{{ number_format($item->precio_unitario, 2, ',', '.') }} €</td>
                            <td>{{ $stockDisponible }}</td>
                            <td>
                                <form action="{{ route('carrito.update') }}" method="POST" class="carrito-form-inline">
                                    @csrf
                                    <input type="hidden" name="id_item" value="{{ $item->id_item }}">
                                    <input type="number"
                                           min="1"
                                           @if(is_numeric($stockDisponible)) max="{{ $stockDisponible }}" @endif
                                           name="cantidad"
                                           value="{{ $item->cantidad }}">
                                    <button type="submit">Actualizar</button>
                                </form>
                            </td>
                            <td>{{ number_format($item->subtotal(), 2, ',', '.') }} €</td>
                            <td>
                                <form action="{{ route('carrito.remove') }}" method="POST" class="carrito-form">
                                    @csrf
                                    <input type="hidden" name="id_item" value="{{ $item->id_item }}">
                                    <button type="submit">Eliminar</button>
                                </form>
                            </td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>
            </div>

            <div class="carrito-summary">
                <div class="carrito-total-bar">
                    <div class="total-info">
                        <span>Total:</span>
                        <strong>{{ number_format($total, 2, ',', '.') }} €</strong>
                    </div>
                </div>

                <div class="pago-container">
                    <a href="{{ route('portal.productos') }}" class="btn btn-outline btn-seguir">
                        Seguir comprando
                    </a>

                    <form action="{{ route('carrito.checkout') }}" method="POST" class="carrito-form">
                        @csrf
                        <div class="tooltip-container">
                            <button type="submit" class="btn btn-primary btn-confirm">
                                Confirmar compra
                            </button>
                            <span class="tooltip-text">Al confirmar se reenviará a la pasarela de pago.</span>
                        </div>
                    </form>
                </div>

                @guest
                    <p class="login-hint">
                        Necesitas iniciar sesión para confirmar el pedido. Conservaremos tu carrito durante el proceso.
                    </p>
                    <div class="carrito-actions">
                        <a class="btn btn-secondary" href="{{ route('login') }}">Iniciar sesión</a>
                        <a class="btn btn-outline" href="{{ route('register') }}">Registrarme</a>
                    </div>
                @endguest
            </div>
        @endif
    </section>
@endsection`;

// CU4 DATA
const CU4_ROUTES_CODE = `// Pasarela de Pago (Simulada)
Route::get('/pago/iniciar', [\\App\\Http\\Controllers\\PaymentController::class, 'showGateway'])->name('payment.gateway');
Route::post('/pago/procesar', [\\App\\Http\\Controllers\\PaymentController::class, 'processPayment'])->name('payment.process');
Route::get('/pago/completado', [\\App\\Http\\Controllers\\PaymentController::class, 'showSuccess'])->name('payment.success');`;

const CU4_CONTROLLER_CODE = `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Contenido;
use App\\Models\\Order;
use App\\Models\\OrderItem;
use App\\Services\\CartManager;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\DB;
use Illuminate\\View\\View;

class PaymentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function showGateway()
    {
        $cart = CartManager::currentCart()->load('items');

        if ($cart->items->isEmpty()) {
            return redirect()->route('carrito.index')
                ->withErrors(['checkout' => 'Tu carrito está vacío.']);
        }

        return view('portalTemplates.payment.gateway', [
            'cart' => $cart,
            'items' => $cart->items,
            'total' => $cart->total(),
        ]);
    }

    public function processPayment()
    {
        $cart = CartManager::currentCart()->load('items');

        if ($cart->items->isEmpty()) {
            return redirect()->route('carrito.index')
                ->withErrors(['checkout' => 'Tu carrito está vacío.']);
        }

        $errores = [];

        try {
            DB::transaction(function () use ($cart, &$errores) {

                $contenidosSeleccionados = [];

                foreach ($cart->items as $item) {
                    $contenido = Contenido::where('id_contenido', $item->id_contenido)
                        ->lockForUpdate()
                        ->first();

                    if (!$contenido) {
                        $errores[] = "El vendedor ya no ofrece {$item->nombre_producto}.";
                        continue;
                    }

                    if ($contenido->stock < $item->cantidad) {
                        $errores[] = "Stock insuficiente para {$item->nombre_producto}.";
                    }

                    $contenidosSeleccionados[$item->id_contenido] = $contenido;
                }

                if (!empty($errores)) {
                    throw new \\RuntimeException('Stock insuficiente');
                }

                $order = Order::create([
                    'user_id' => auth()->id(),
                    'total' => $cart->total(),
                    'estado' => 'pagado',
                ]);

                foreach ($cart->items as $item) {
                    $contenido = $contenidosSeleccionados[$item->id_contenido];

                    $contenido->stock -= $item->cantidad;
                    $contenido->save();

                    OrderItem::create([
                        'order_id' => $order->id,
                        'id_contenido' => $item->id_contenido,
                        'nombre_producto' => $item->nombre_producto,
                        'nombre_vendedor' => $item->nombre_vendedor,
                        'precio_unitario' => $item->precio_unitario,
                        'cantidad' => $item->cantidad,
                        'subtotal' => $item->subtotal(),
                    ]);
                }

                $cart->items()->delete();
                $cart->estado = 'confirmado';
                $cart->save();

                session()->forget('cart_token');
                session()->forget('cart_count');
                session(['cart_count' => 0]);

            }, 3);

        } catch (\\Throwable $e) {
            report($e);
            $errores[] = 'Ocurrió un problema al procesar el pago.';
        }

        if (!empty($errores)) {
            return redirect()->route('carrito.index')
                ->withErrors(['checkout' => implode(' | ', $errores)]);
        }

        return redirect()->route('payment.success');
    }

    public function showSuccess(): View
    {
        return view('portalTemplates.payment.success');
    }
}`;

const CU4_VIEW_CODE = `@extends('portalTemplates.layout')

@section('content')
    <section class="pago-wrapper">
        <div class="pago-header">
            <h1>Pasarela de Pago Segura</h1>
            <p>Revisa tu pedido antes de confirmar el pago.</p>
        </div>

        <div class="pago-container">
            <div class="pago-resumen">
                <h2>Resumen del Pedido</h2>
                <ul class="pago-lista-items">
                    @foreach($items as $item)
                        <li>
                            <span class="item-nombre">{{ $item->nombre_producto }}</span>
                            <span class="item-cantidad">x{{ $item->cantidad }}</span>
                            <span class="item-precio">{{ number_format($item->subtotal(), 2, ',', '.') }} €</span>
                        </li>
                    @endforeach
                </ul>
                <div class="pago-total">
                    <span>Total a pagar:</span>
                    <strong>{{ number_format($total, 2, ',', '.') }} €</strong>
                </div>
            </div>

            <div class="pago-metodo">
                <h3>Método de Pago</h3>
                <input type="text" id="card_number"
                       placeholder="Indicar aquí tarjeta de crédito o débito"
                       required minlength="16" pattern="\\d{16,}">
            </div>

            <form action="{{ route('payment.process') }}" method="POST">
                @csrf
                <a href="{{ route('carrito.index') }}" class="btn btn-outline">Cancelar</a>
                <button type="submit" class="btn btn-primary btn-confirm">
                    Confirmar y Pagar
                </button>
            </form>
        </div>
    </section>
@endsection`;

// CU5 DATA
const CU5_ROUTES_CODE = `// Sensores
Route::get('sensores', [SensorApiController::class, 'index']);
Route::get('sensores/{id}', [SensorApiController::class, 'show']);
Route::post('sensores', [SensorApiController::class, 'store']);

// Medidas
Route::get('medidas', [MedidaApiController::class, 'index']);
Route::get('medidas/{id}', [MedidaApiController::class, 'show']);
Route::post('medidas', [MedidaApiController::class, 'store']);`;

const CU5_CONTROLLER_CODE = `<?php
namespace App\\Http\\Controllers;

use App\\Http\\Requests\\SensorStoreRequest;
use App\\Http\\Resources\\SensorResource;
use App\\Models\\Sensor;

class SensorApiController extends Controller
{
    public function index()
    {
        $sensores = Sensor::orderByDesc('id_sensor')->get();
        return SensorResource::collection($sensores);
    }

    public function show($id)
    {
        $sensor = Sensor::where('id_sensor', $id)->first();
        if (!$sensor) {
            return response()->json(['error' => 'Sensor no encontrado'], 404);
        }
        return new SensorResource($sensor);
    }

    public function store(SensorStoreRequest $request)
    {
        $sensor = Sensor::create($request->validated());
        return (new SensorResource($sensor))
            ->response()
            ->setStatusCode(201);
    }
}`;

const CU5_REQUEST_CODE = `<?php

namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class SensorStoreRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'modelo'       => ['required', 'string', 'max:100'],
            'ubicacion'    => ['nullable', 'string', 'max:150'],
            'unidad'       => ['required', 'string', 'max:20'],
            'id_proveedor' => ['required', 'integer', 'exists:proveedores,id_proveedor'],
        ];
    }
}`;

const CU5_RESOURCE_CODE = `<?php

namespace App\\Http\\Resources;

use Illuminate\\Http\\Resources\\Json\\JsonResource;

class SensorResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id_sensor'   => $this->id_sensor,
            'modelo'      => $this->modelo,
            'ubicacion'   => $this->ubicacion,
            'unidad'      => $this->unidad,
            'id_proveedor'=> $this->id_proveedor,
        ];
    }
}`;

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

        // CU1 Handling
        if (tab === 'controller' || tab === 'view') {
            const cu1CodeBlock = document.getElementById('cu1-code-block');
            if (cu1CodeBlock) {
                if (tab === 'controller') cu1CodeBlock.textContent = CU1_CONTROLLER_CODE;
                else if (tab === 'view') cu1CodeBlock.textContent = CU1_VIEW_CODE;
                if (window.Prism) Prism.highlightElement(cu1CodeBlock);
            }
        }

        // CU2 Handling
        if (tab && tab.startsWith('cu2-')) {
            const cu2CodeBlock = document.getElementById('cu2-code-block');
            if (cu2CodeBlock) {
                if (tab === 'cu2-routes') cu2CodeBlock.textContent = CU2_ROUTES_CODE;
                else if (tab === 'cu2-view-cat') cu2CodeBlock.textContent = CU2_VIEW_CAT_CODE;
                else if (tab === 'cu2-view-det') cu2CodeBlock.textContent = CU2_VIEW_DET_CODE;
                else if (tab === 'cu2-controller') cu2CodeBlock.textContent = CU2_CONTROLLER_CODE;

                if (window.Prism) Prism.highlightElement(cu2CodeBlock);
            }
        }

        // CU3 Handling
        if (tab && tab.startsWith('cu3-')) {
            const cu3CodeBlock = document.getElementById('cu3-code-block');
            if (cu3CodeBlock) {
                if (tab === 'cu3-routes') cu3CodeBlock.textContent = CU3_ROUTES_CODE;
                else if (tab === 'cu3-controller') cu3CodeBlock.textContent = CU3_CONTROLLER_CODE;
                else if (tab === 'cu3-view') cu3CodeBlock.textContent = CU3_VIEW_CODE;

                if (window.Prism) Prism.highlightElement(cu3CodeBlock);
            }
        }

        // CU4 Handling
        if (tab && tab.startsWith('cu4-')) {
            const cu4CodeBlock = document.getElementById('cu4-code-block');
            if (cu4CodeBlock) {
                if (tab === 'cu4-routes') cu4CodeBlock.textContent = CU4_ROUTES_CODE;
                else if (tab === 'cu4-controller') cu4CodeBlock.textContent = CU4_CONTROLLER_CODE;
                else if (tab === 'cu4-view') cu4CodeBlock.textContent = CU4_VIEW_CODE;

                if (window.Prism) Prism.highlightElement(cu4CodeBlock);
            }
        }

        // CU5 Handling
        if (tab && tab.startsWith('cu5-')) {
            const cu5CodeBlock = document.getElementById('cu5-code-block');
            if (cu5CodeBlock) {
                if (tab === 'cu5-routes') cu5CodeBlock.textContent = CU5_ROUTES_CODE;
                else if (tab === 'cu5-controller') cu5CodeBlock.textContent = CU5_CONTROLLER_CODE;
                else if (tab === 'cu5-request') cu5CodeBlock.textContent = CU5_REQUEST_CODE;
                else if (tab === 'cu5-resource') cu5CodeBlock.textContent = CU5_RESOURCE_CODE;

                if (window.Prism) Prism.highlightElement(cu5CodeBlock);
            }
        }

        e.preventDefault();
        e.stopPropagation();
    }
});

// Init CU1 default content
document.addEventListener('DOMContentLoaded', () => {
    // CU1 Init
    const cu1CodeBlock = document.getElementById('cu1-code-block');
    if (cu1CodeBlock) {
        cu1CodeBlock.textContent = CU1_CONTROLLER_CODE;
    }

    // CU2 Init
    const cu2CodeBlock = document.getElementById('cu2-code-block');
    if (cu2CodeBlock) {
        cu2CodeBlock.textContent = CU2_ROUTES_CODE;
    }

    // CU3 Init
    const cu3CodeBlock = document.getElementById('cu3-code-block');
    if (cu3CodeBlock) {
        cu3CodeBlock.textContent = CU3_ROUTES_CODE;
    }

    // CU4 Init
    const cu4CodeBlock = document.getElementById('cu4-code-block');
    if (cu4CodeBlock) {
        cu4CodeBlock.textContent = CU4_ROUTES_CODE;
    }

    // CU5 Init
    const cu5CodeBlock = document.getElementById('cu5-code-block');
    if (cu5CodeBlock) {
        cu5CodeBlock.textContent = CU5_ROUTES_CODE;
    }
});
```
