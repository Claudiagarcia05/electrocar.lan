const { createApp } = Vue;

// Formulario de registro/login
const FormularioRegistro = {
    props: ['mostrarLogin'],
    emits: ['cambiar-formulario', 'registro-exitoso', 'login-exitoso'],
    template: `
        <div class="formulario-container">
            <div v-if="mensajeError" class="mensaje-error">
                <i class="fas fa-exclamation-circle"></i>
                <span>{{ mensajeError }}</span>
            </div>
            <div v-if="mensajeExito" class="mensaje-exito">
                <i class="fas fa-check-circle"></i>
                <span>{{ mensajeExito }}</span>
            </div>
            
            <div v-if="!mostrarLogin">
                <h2>{{ $t('registrarse') }}</h2>
                <div class="form-group">
                    <label for="reg-id">{{ $t('id_usuario') }} *</label>
                    <input type="text" id="reg-id" v-model="form.id" 
                           @blur="validarId" 
                           :class="{ 'error': errores.id }">
                    <div class="mensaje-validacion" :class="{ 'error': errores.id, 'success': !errores.id && form.id }">
                        {{ errores.id || (form.id && !errores.id ? $t('id_valido') : '') }}
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="reg-nombre">{{ $t('nombre') }} *</label>
                    <input type="text" id="reg-nombre" v-model="form.nombre" 
                           @blur="validarNombre"
                           :class="{ 'error': errores.nombre }">
                    <div class="mensaje-validacion" :class="{ 'error': errores.nombre, 'success': !errores.nombre && form.nombre }">
                        {{ errores.nombre || (form.nombre && !errores.nombre ? $t('nombre_valido') : '') }}
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="reg-email">{{ $t('email') }} *</label>
                    <input type="email" id="reg-email" v-model="form.email" 
                           @blur="validarEmail"
                           :class="{ 'error': errores.email }">
                    <div class="mensaje-validacion" :class="{ 'error': errores.email, 'success': !errores.email && form.email }">
                        {{ errores.email || (form.email && !errores.email ? $t('email_valido') : '') }}
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="reg-telefono">{{ $t('telefono') }} *</label>
                    <input type="tel" id="reg-telefono" v-model="form.telefono" 
                           @blur="validarTelefono"
                           :class="{ 'error': errores.telefono }">
                    <div class="mensaje-validacion" :class="{ 'error': errores.telefono, 'success': !errores.telefono && form.telefono }">
                        {{ errores.telefono || (form.telefono && !errores.telefono ? $t('telefono_valido') : '') }}
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="reg-password">{{ $t('password') }} *</label>
                    <input type="password" id="reg-password" v-model="form.password" 
                           @blur="validarPassword"
                           :class="{ 'error': errores.password }">
                    <div class="mensaje-validacion" :class="{ 'error': errores.password }">
                        {{ errores.password }}
                    </div>
                </div>
                
                <button class="btn-submit" @click="registrar" :disabled="registrando">
                    <span v-if="registrando">
                        <i class="fas fa-spinner fa-spin"></i> {{ $t('procesando') }}
                    </span>
                    <span v-else>
                        {{ $t('registrarse') }}
                    </span>
                </button>
                
                <p style="margin-top: 15px; text-align: center;">
                    <a href="#" @click.prevent="$emit('cambiar-formulario')">
                        {{ $t('tiene_cuenta') }}
                    </a>
                </p>
            </div>
            
            <!-- Formulario de Login -->
            <div v-else>
                <h2>{{ $t('inicio_sesion') }}</h2>
                <div class="form-group">
                    <label for="login-id">{{ $t('id_usuario') }} *</label>
                    <input type="text" id="login-id" v-model="loginForm.id" 
                           @blur="validarIdLogin"
                           :class="{ 'error': erroresLogin.id }">
                    <div class="mensaje-validacion" :class="{ 'error': erroresLogin.id }">
                        {{ erroresLogin.id }}
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="login-password">{{ $t('password') }} *</label>
                    <input type="password" id="login-password" v-model="loginForm.password">
                </div>
                
                <button class="btn-submit" @click="iniciarSesion" :disabled="logueando">
                    <span v-if="logueando">
                        <i class="fas fa-spinner fa-spin"></i> {{ $t('procesando') }}
                    </span>
                    <span v-else>
                        {{ $t('inicio_sesion') }}
                    </span>
                </button>
                
                <p style="margin-top: 15px; text-align: center;">
                    <a href="#" @click.prevent="$emit('cambiar-formulario')">
                        {{ $t('no_cuenta') }}
                    </a>
                </p>
            </div>
        </div>
    `,
    data() {
        return {
            form: {
                id: '',
                nombre: '',
                email: '',
                telefono: '',
                password: '',
                direccion: '',
                ciudad: '',
                codigo_postal: ''
            },
            loginForm: {
                id: '',
                password: ''
            },
            errores: {},
            erroresLogin: {},
            mensajeError: '',
            mensajeExito: '',
            registrando: false,
            logueando: false
        };
    },
    methods: {
        $t(key) {
            return window.obtenerTraduccion ? window.obtenerTraduccion(key) : key;
        },
        
        validarId() {
            if (!this.form.id) {
                this.errores.id = this.$t('id_requerido');
                return false;
            }
            const idRegex = /^[a-zA-Z0-9_-]{3,50}$/;
            if (!idRegex.test(this.form.id)) {
                this.errores.id = this.$t('id_invalido');
                return false;
            }
            delete this.errores.id;
            return true;
        },
        
        validarNombre() {
            if (!this.form.nombre) {
                this.errores.nombre = this.$t('nombre_requerido');
                return false;
            }
            const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,100}$/;
            if (!nombreRegex.test(this.form.nombre)) {
                this.errores.nombre = this.$t('nombre_invalido');
                return false;
            }
            delete this.errores.nombre;
            return true;
        },
        
        validarEmail() {
            if (!this.form.email) {
                this.errores.email = this.$t('email_requerido');
                return false;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this.form.email)) {
                this.errores.email = this.$t('email_invalido');
                return false;
            }
            delete this.errores.email;
            return true;
        },
        
        validarTelefono() {
            if (!this.form.telefono) {
                this.errores.telefono = this.$t('telefono_requerido');
                return false;
            }
            const telefonoRegex = /^[0-9]{9}$/;
            if (!telefonoRegex.test(this.form.telefono.replace(/\s/g, ''))) {
                this.errores.telefono = this.$t('telefono_invalido');
                return false;
            }
            delete this.errores.telefono;
            return true;
        },
        
        validarPassword() {
            if (!this.form.password) {
                this.errores.password = this.$t('password_requerido');
                return false;
            }
            if (this.form.password.length < 6) {
                this.errores.password = this.$t('password_invalido');
                return false;
            }
            if (!/[a-zA-Z]/.test(this.form.password) || !/\d/.test(this.form.password)) {
                this.errores.password = this.$t('password_invalido');
                return false;
            }
            delete this.errores.password;
            return true;
        },
        
        validarIdLogin() {
            if (!this.loginForm.id) {
                this.erroresLogin.id = this.$t('id_requerido');
                return false;
            }
            delete this.erroresLogin.id;
            return true;
        },
        
        // Enviar datos de registro al servidor y manejar la respuesta
        async registrar() {
            if (!this.validarId() || !this.validarNombre() || 
                !this.validarEmail() || !this.validarTelefono() || 
                !this.validarPassword()) {
                this.mensajeError = this.$t('campos_requeridos');
                return;
            }
            
            this.registrando = true;
            this.mensajeError = '';
            this.mensajeExito = '';
            
            try {
                const response = await fetch('server.php?action=registro', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(this.form)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    this.mensajeExito = this.$t('registro_exitoso');
                    // Limpiar formulario
                    this.form = {
                        id: '', nombre: '', email: '', telefono: '',
                        password: '', direccion: '', ciudad: '', codigo_postal: ''
                    };
                    this.errores = {};
                    
                    // Emitir evento de registro exitoso
                    this.$emit('registro-exitoso', result.usuario);
                    
                } else {
                    this.mensajeError = result.error || this.$t('error_registro');
                }
            } catch (error) {
                console.error('Error:', error);
                this.mensajeError = this.$t('error_conexion');
            } finally {
                this.registrando = false;
            }
        },
        
        // Enviar credenciales al servidor y emitir evento si el login es exitoso
        async iniciarSesion() {
            if (!this.validarIdLogin()) {
                this.mensajeError = this.$t('campos_requeridos');
                return;
            }
            
            this.logueando = true;
            this.mensajeError = '';
            
            try {
                const response = await fetch('server.php?action=login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(this.loginForm)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Emitir evento de login exitoso
                    this.$emit('login-exitoso', result.usuario);
                } else {
                    this.mensajeError = result.error || this.$t('credenciales_incorrectas');
                }
            } catch (error) {
                console.error('Error:', error);
                this.mensajeError = this.$t('error_conexion');
            } finally {
                this.logueando = false;
            }
        }
    }
};

// Aplicación principal Vue
const app = createApp({
    data() {
        return {
            // Datos reactivos
            productos: [],
            categorias: [],
            carrito: JSON.parse(localStorage.getItem('carrito')) || [],
            usuario: JSON.parse(sessionStorage.getItem('usuario')) || null,
            idiomaActual: localStorage.getItem('idioma') || 'es',
            
            // Estado de la aplicación
            vistaActual: 'inicio',
            productoSeleccionado: null,
            cargando: false,
            mostrarDropdown: false,
            mostrarLoginForm: false,
            
            // Datos para formularios
            cantidadProducto: 1,
            
            // Carrusel
            carruselIndex: 0,
            carruselInterval: null,
            
            // Categorías
            categoriaActual: null,
            productosCategoriaActual: [],
            
            // Pago
            metodoPago: 'tarjeta',
            formPago: {
                titular: '',
                numero_tarjeta: '',
                fecha_vencimiento: '',
                cvv: ''
            },
            formDireccion: {
                direccion: '',
                ciudad: '',
                codigo_postal: '',
                telefono: ''
            },
            mostrarModificarDireccion: false,
            procesandoPago: false,
            pedidoConfirmado: null,
            metodoPagoTexto: ''
        };
    },
    
    computed: {
        // Propiedades calculadas
        totalCarrito() {
            return this.carrito.reduce((total, item) => {
                const producto = this.obtenerProducto(item.productoId);
                return total + (producto ? parseFloat(producto.precio) * item.cantidad : 0);
            }, 0);
        },
        
        cantidadTotalCarrito() {
            return this.carrito.reduce((total, item) => total + item.cantidad, 0);
        },
        
        productosDestacados() {
            return this.productos.filter(p => p.destacado).slice(0, 6);
        },
        
        productosEnCarrusel() {
            const destacados = this.productos.filter(p => p.destacado);
            return destacados.length > 0 ? destacados.slice(0, 5) : this.productos.slice(0, 5);
        }
    },
    
    async mounted() {
        await this.cargarDatos();
        this.iniciarCarrusel();
        
        // Cargar traducciones
        if (window.cargarTraducciones) {
            await window.cargarTraducciones();
        }
        
        // Actualizar carrito cuando cambia en otra pestaña
        window.addEventListener('storage', (e) => {
            if (e.key === 'carrito') {
                this.carrito = JSON.parse(e.newValue) || [];
            }
        });
    },
    
    methods: {
        // Métodos de la aplicación
        // Cargar datos iniciales desde el servidor: productos y categorías
        async cargarDatos() {
            this.cargando = true;
            try {
                const [productosRes, categoriasRes] = await Promise.all([
                    fetch('server.php?action=get_productos'),
                    fetch('server.php?action=get_categorias')
                ]);
                
                this.productos = await productosRes.json();
                this.categorias = await categoriasRes.json();
                
                // Procesar productos
                this.productos = this.productos.map(p => ({
                    ...p,
                    destacado: Boolean(p.destacado),
                    oferta: Boolean(p.oferta),
                    mas_vendido: Boolean(p.mas_vendido),
                    precio: parseFloat(p.precio),
                    precio_original: p.precio_original ? parseFloat(p.precio_original) : null,
                    disponibilidad: parseInt(p.disponibilidad)
                }));
                
            } catch (error) {
                console.error('Error cargando datos:', error);
                // Cargar datos de ejemplo si hay error
                this.cargarDatosEjemplo();
            } finally {
                this.cargando = false;
            }
        },
        
        // Datos de ejemplo (fallback cuando falla la carga remota)
        cargarDatosEjemplo() {
            this.productos = [
                {
                    id: 1,
                    nombre: "Sistema de Navegación GPS 7\"",
                    descripcion: "GPS con pantalla táctil de 7 pulgadas...",
                    descripcion_corta: "GPS profesional para tu coche",
                    precio: 199.99,
                    categoria_id: 2,
                    categoria_nombre: "Navegación GPS",
                    disponibilidad: 1000,
                    imagen: "gps-navegacion.jpg",
                    destacado: true,
                    oferta: false,
                    precio_original: null,
                    descuento: null,
                    mas_vendido: true
                }
            ];
            
            this.categorias = [
                {id:1,nombre:"Sistemas de Audio",icono:"fas fa-music"},
                {id:2,nombre:"Navegación GPS",icono:"fas fa-map-marker-alt"},
                {id:3,nombre:"Cámaras y Sensores",icono:"fas fa-camera"},
                {id:4,nombre:"Iluminación LED",icono:"fas fa-lightbulb"},
                {id:5,nombre:"Herramientas",icono:"fas fa-tools"}
            ];
        },
        
        // Cambiar la vista actual de la aplicación
        cambiarVista(vista) {
            this.vistaActual = vista;
            this.productoSeleccionado = null;
            this.mostrarLoginForm = false;
            
            if (vista === 'inicio') {
                this.iniciarCarrusel();
            }
        },
        
        // Mostrar la página de detalle para `productoId`
        mostrarProducto(productoId) {
            const producto = this.productos.find(p => p.id == productoId);
            if (producto) {
                this.productoSeleccionado = producto;
                this.vistaActual = 'detalle-producto';
                this.cantidadProducto = 1;
            }
        },
        
        // Añadir un producto al carrito
        agregarAlCarrito(productoId) {
            if (!this.usuario) {
                this.mostrarNotificacionLoginRequerido();
                this.cambiarVista('registro');
                return;
            }
            
            const producto = this.productos.find(p => p.id == productoId);
            if (!producto) return;
            
            if (producto.disponibilidad <= 0) {
                this.mostrarNotificacion(this.$t('sin_stock'), 'error');
                return;
            }
            
            const cantidad = this.vistaActual === 'detalle-producto' ? this.cantidadProducto : 1;
            
            if (cantidad > producto.disponibilidad) {
                this.mostrarNotificacion(this.$t('stock_insuficiente'), 'error');
                return;
            }
            
            const itemExistente = this.carrito.find(item => item.productoId == productoId);
            
            if (itemExistente) {
                const nuevaCantidad = itemExistente.cantidad + cantidad;
                if (nuevaCantidad > producto.disponibilidad) {
                    this.mostrarNotificacion(this.$t('stock_insuficiente'), 'error');
                    return;
                }
                itemExistente.cantidad = nuevaCantidad;
            } else {
                this.carrito.push({
                    productoId: productoId,
                    cantidad: cantidad,
                    precio: parseFloat(producto.precio),
                    fecha: new Date().toISOString()
                });
            }
            
            this.guardarCarrito();
            this.mostrarNotificacion(`${producto.nombre} ${this.$t('agregado_carrito')}`, 'success');
        },
        
        // Eliminar un ítem del carrito por índice
        eliminarDelCarrito(index) {
            this.carrito.splice(index, 1);
            this.guardarCarrito();
            this.mostrarNotificacion(this.$t('producto_eliminado'), 'success');
        },
        
        // Cambiar la cantidad de un ítem en el carrito respetando stock
        cambiarCantidadCarrito(index, nuevaCantidad) {
            if (nuevaCantidad < 1) {
                this.eliminarDelCarrito(index);
                return;
            }
            
            const item = this.carrito[index];
            const producto = this.productos.find(p => p.id == item.productoId);
            
            if (producto && nuevaCantidad > producto.disponibilidad) {
                this.mostrarNotificacion(this.$t('stock_insuficiente'), 'error');
                return;
            }
            
            item.cantidad = nuevaCantidad;
            this.guardarCarrito();
        },
        
        // Persistir carrito en localStorage para mantenerlo entre sesiones/pestañas
        guardarCarrito() {
            localStorage.setItem('carrito', JSON.stringify(this.carrito));
        },
        
        // Iniciar/renovar intervalo del carrusel
        iniciarCarrusel() {
            if (this.carruselInterval) clearInterval(this.carruselInterval);
            
            if (this.productosEnCarrusel.length > 1) {
                this.carruselInterval = setInterval(() => {
                    this.carruselIndex = (this.carruselIndex + 1) % this.productosEnCarrusel.length;
                }, 5000);
            }
        },
        
        // Navegar manualmente a una slide del carrusel
        cambiarSlide(index) {
            this.carruselIndex = index;
            clearInterval(this.carruselInterval);
            this.iniciarCarrusel();
        },
        
        // Mostrar una notificación en pantalla; usa la implementación global si existe
        mostrarNotificacion(mensaje, tipo = 'success') {
            if (window.mostrarNotificacionMejorada) {
                window.mostrarNotificacionMejorada(mensaje, tipo);
            } else {
                alert(mensaje);
            }
        },
        
        // Mostrar notificación especializada cuando el usuario debe iniciar sesión
        mostrarNotificacionLoginRequerido() {
            if (window.mostrarNotificacionLoginRequerido) {
                window.mostrarNotificacionLoginRequerido();
            }
        },
        
        // Alternar idioma y persistir selección en localStorage
        cambiarIdioma() {
            this.idiomaActual = this.idiomaActual === 'es' ? 'en' : 'es';
            localStorage.setItem('idioma', this.idiomaActual);
            
            if (window.cambiarIdioma) {
                window.cambiarIdioma();
            }
        },
        
        // Actualizar estado cuando hay registro/login exitoso
        // Guarda información en sessionStorage y muestra mensaje de bienvenida
        setUsuario(usuario) {
            this.usuario = usuario;
            sessionStorage.setItem('usuario', JSON.stringify(usuario));
            this.cambiarVista('inicio');
            this.mostrarNotificacion(this.$t('bienvenido_usuario').replace('{nombre}', usuario.nombre), 'success');
        },
        
        // Cerrar sesión localmente y notificar al servidor si es posible
        // Limpia sessionStorage y carrito local
        async cerrarSesion() {
            try {
                // Intentar notificar al servidor (si existe manejo de sesión servidor)
                await fetch('server.php?action=logout', { method: 'POST' }).catch(() => {});
            } catch (e) {
                // Ignorar errores de red al notificar al servidor
            }

            this.usuario = null;
            sessionStorage.removeItem('usuario');
            this.carrito = [];
            this.guardarCarrito();
            this.cambiarVista('inicio');
            this.mostrarNotificacion(this.$t('sesion_cerrada'), 'success');
        },

        // Pedir confirmación al usuario antes de cerrar sesión
        confirmarCerrarSesion() {
            const mensaje = this.$t('confirmar_cerrar_sesion') || '¿Deseas cerrar la sesión?';
            if (confirm(mensaje)) {
                this.cerrarSesion();
            }
        },
        
        // Helper de traducción que delega a la función global si existe
        $t(key) {
            return window.obtenerTraduccion ? window.obtenerTraduccion(key) : key;
        },
        
        // Formateo seguro del precio (usa la función global si está disponible)
        formatearPrecio(precio) {
            if (window.formatearPrecio) {
                return window.formatearPrecio(precio);
            }
            return parseFloat(precio || 0).toFixed(2);
        },
        
        // Buscar un producto por su id en el array de productos cargados
        obtenerProducto(productoId) {
            return this.productos.find(p => p.id == productoId);
        },
        
        // Devolver lista de productos filtrada por categoría
        productosPorCategoria(categoriaId) {
            return this.productos.filter(p => p.categoria_id == categoriaId);
        },
        
        // Navegar a la vista que muestra todos los productos
        cargarTodosProductos() {
            this.vistaActual = 'todos-productos';
        },
        
        // Cargar productos de una categoría concreta y cambiar la vista
        cargarProductosPorCategoria(categoriaId) {
            const categoria = this.categorias.find(c => c.id == categoriaId);
            if (categoria) {
                this.categoriaActual = categoria;
                this.productosCategoriaActual = this.productosPorCategoria(categoriaId);
                this.vistaActual = `categoria-${categoriaId}`;
            }
        },
        
        // Helper: formatea número de tarjeta en grupos de 4 dígitos mientras se escribe
        formatearNumeroTarjeta(event) {
            let value = event.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            let formatted = '';
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) formatted += ' ';
                formatted += value[i];
            }
            this.formPago.numero_tarjeta = formatted.substring(0, 19);
        },
        
        // Helper: formatea fecha de vencimiento MM/YY
        formatearFechaVencimiento(event) {
            let value = event.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            if (value.length >= 2) value = value.substring(0, 2) + '/' + value.substring(2, 4);
            this.formPago.fecha_vencimiento = value.substring(0, 5);
        },
        
        // Procesar el pago: validar datos, enviar pedido al servidor y vaciar carrito
        async procesarPago() {
            if (this.carrito.length === 0) {
                this.mostrarNotificacion(this.$t('carrito_vacio'), 'error');
                return;
            }
            
            if (!this.usuario) {
                this.mostrarNotificacionLoginRequerido();
                this.cambiarVista('registro');
                return;
            }
            
            // Validar datos de pago
            if (this.metodoPago !== 'paypal') {
                if (!this.formPago.titular.trim()) {
                    this.mostrarNotificacion(this.$t('titular_requerido'), 'error');
                    return;
                }
                
                const numeroLimpiado = this.formPago.numero_tarjeta.replace(/\s/g, '');
                if (numeroLimpiado.length !== 16) {
                    this.mostrarNotificacion(this.$t('tarjeta_invalida'), 'error');
                    return;
                }
                
                if (!/^\d{2}\/\d{2}$/.test(this.formPago.fecha_vencimiento)) {
                    this.mostrarNotificacion(this.$t('fecha_invalida'), 'error');
                    return;
                }
                
                if (!/^\d{3}$/.test(this.formPago.cvv)) {
                    this.mostrarNotificacion(this.$t('cvv_invalido'), 'error');
                    return;
                }
            }
            
            this.procesandoPago = true;
            
            try {
                const pedidoData = {
                    usuario_id: this.usuario.id,
                    items: this.carrito.map(item => ({
                        producto_id: item.productoId,
                        cantidad: item.cantidad,
                        precio: item.precio
                    }))
                };
                
                const response = await fetch('server.php?action=crear_pedido', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(pedidoData)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    this.pedidoConfirmado = result;
                    this.metodoPagoTexto = this.metodoPago === 'tarjeta' ? this.$t('tarjeta_credito') : 
                                          this.metodoPago === 'debito' ? this.$t('tarjeta_debito') : 
                                          this.$t('paypal');
                    
                    // Vaciar carrito
                    this.carrito = [];
                    this.guardarCarrito();
                    
                    // Actualizar stock local
                    if (result.items) {
                        result.items.forEach(itemComprado => {
                            const producto = this.productos.find(p => p.id == itemComprado.producto_id);
                            if (producto) {
                                producto.disponibilidad -= itemComprado.cantidad;
                                if (producto.disponibilidad < 0) producto.disponibilidad = 0;
                            }
                        });
                    }
                    
                    this.vistaActual = 'confirmacion-pago';
                } else {
                    throw new Error(result.error || this.$t('error_pago'));
                }
            } catch (error) {
                console.error('Error:', error);
                this.mostrarNotificacion(this.$t('error_pago_detalle') + ': ' + error.message, 'error');
            } finally {
                this.procesandoPago = false;
            }
        },
        
        // Guardar/actualizar la dirección del usuario en sessionStorage
        guardarDireccion() {
            // Actualizar datos del usuario
            this.usuario.direccion = this.formDireccion.direccion;
            this.usuario.ciudad = this.formDireccion.ciudad;
            this.usuario.codigo_postal = this.formDireccion.codigo_postal;
            this.usuario.telefono = this.formDireccion.telefono;
            
            sessionStorage.setItem('usuario', JSON.stringify(this.usuario));
            this.mostrarModificarDireccion = false;
            this.mostrarNotificacion(this.$t('direccion_actualizada'), 'success');
        }
    },
    
    watch: {
        carrito: {
            handler() {
                this.guardarCarrito();
            },
            deep: true
        }
    }
});

// Registrar componentes
app.component('formulario-registro', FormularioRegistro);

// Montar la aplicación
app.mount('#app');