let traducciones = {};
let idiomaActual = localStorage.getItem('idioma') || 'es';

// Carga las traducciones según el idioma seleccionado
async function cargarTraducciones() {
    return new Promise((resolve, reject) => {
        const archivoTraduccion = idiomaActual === 'es' ? 'translations_es.js' : 'translations_en.js';
        
        // Verificar si ya están cargadas
        if ((idiomaActual === 'es' && typeof traduccionesES !== 'undefined') || 
            (idiomaActual === 'en' && typeof traduccionesEN !== 'undefined')) {
            traducciones = idiomaActual === 'es' ? traduccionesES : traduccionesEN;
            actualizarIdiomaUI();
            resolve();
            return;
        }
        
        // Cargar dinámicamente
        const script = document.createElement('script');
        script.src = archivoTraduccion;
        script.onload = function() {
            if (idiomaActual === 'es' && typeof traduccionesES !== 'undefined') {
                traducciones = traduccionesES;
            } else if (idiomaActual === 'en' && typeof traduccionesEN !== 'undefined') {
                traducciones = traduccionesEN;
            } else if (typeof traduccionesES !== 'undefined') {
                traducciones = traduccionesES;
            } else {
                traducciones = {};
            }
            actualizarIdiomaUI();
            resolve();
        };
        script.onerror = function() { 
            traducciones = {}; 
            reject(new Error("No se pudo cargar las traducciones")); 
        };
        document.head.appendChild(script);
    });
}

// Función global para obtener traducciones
window.obtenerTraduccion = function(clave) {
    if (typeof traducciones === 'undefined' || Object.keys(traducciones).length === 0) { 
        return clave; 
    }
    if (traducciones[clave]) { 
        return traducciones[clave]; 
    }
    return clave;
};

// Función global para formatear precios
window.formatearPrecio = function(precio) {
    if (precio === null || precio === undefined || precio === '') return '0.00';
    const numero = parseFloat(precio);
    if (isNaN(numero)) return '0.00';
    return numero.toFixed(2);
};

// Mostrar notificaciones
window.mostrarNotificacionMejorada = function(mensaje, tipo = 'success') {
    // Eliminar notificaciones anteriores
    const notificacionesAnteriores = document.querySelectorAll('.notificacion-flotante');
    notificacionesAnteriores.forEach(n => n.remove());
    
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion-flotante';
    notificacion.innerHTML = `
        <i class="fas ${tipo === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${mensaje}</span>
    `;
    
    // Estilos
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${tipo === 'success' ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' : 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
    `;
    
    document.body.appendChild(notificacion);
    
    // Auto-eliminar después de 3 segundos
    setTimeout(() => {
        notificacion.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => { 
            if (notificacion.parentNode) {
                document.body.removeChild(notificacion); 
            }
        }, 300);
    }, 3000);
};

// Notificación específica para login requerido
window.mostrarNotificacionLoginRequerido = function() {
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion-flotante';
    notificacion.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${window.obtenerTraduccion('debe_iniciar_sesion')}</span>
        <button onclick="document.querySelector('#app').__vue_app__.config.globalProperties.cambiarVista('registro')" 
                style="background: white; color: #1a237e; border: none; padding: 5px 10px; border-radius: 4px; font-weight: 600; cursor: pointer; margin-left: 10px;">
            ${window.obtenerTraduccion('inicio_sesion')}
        </button>
    `;
    
    notificacion.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 8px 20px rgba(26, 35, 126, 0.3);
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
    `;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => { 
            if (notificacion.parentNode) {
                document.body.removeChild(notificacion); 
            }
        }, 300);
    }, 5000);
};

// Cambiar idioma globalmente
window.cambiarIdioma = function() {
    idiomaActual = idiomaActual === 'es' ? 'en' : 'es';
    localStorage.setItem('idioma', idiomaActual);
    
    // Recargar traducciones
    cargarTraducciones().then(() => {
        // Forzar actualización de la vista
        const app = document.querySelector('#app').__vue_app__;
        if (app) {
            app.config.globalProperties.$forceUpdate();
        }
    }).catch(console.error);
};

// Actualizar idioma
function actualizarIdiomaUI() {
    const idiomaTexto = document.getElementById('idioma-texto');
    
    if (idiomaTexto) {
        idiomaTexto.textContent = idiomaActual.toUpperCase();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async function() {
    try {
        await cargarTraducciones();
    } catch (error) {
        console.error("Error cargando traducciones:", error);
        traducciones = {};
    }
    
    // Asegurar que cargarTraducciones esté disponible
    window.cargarTraducciones = cargarTraducciones;
});

// Estilos para animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;

document.head.appendChild(style);