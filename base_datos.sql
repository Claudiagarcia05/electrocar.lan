DROP DATABASE IF EXISTS autoelectro;
CREATE DATABASE autoelectro;
USE autoelectro;

CREATE TABLE productos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    descripcion_corta VARCHAR(200),
    precio DECIMAL(10, 2) NOT NULL,
    categoria_id INT NOT NULL,
    disponibilidad INT DEFAULT 0,
    imagen VARCHAR(255),
    destacado BOOLEAN DEFAULT FALSE,
    oferta BOOLEAN DEFAULT FALSE,
    precio_original DECIMAL(10, 2),
    descuento INT,
    mas_vendido BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usuarios (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    fecha_registro DATE NOT NULL,
    direccion TEXT,
    ciudad VARCHAR(50),
    codigo_postal VARCHAR(10),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categorias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    icono VARCHAR(50),
    descripcion TEXT
);

CREATE TABLE pedidos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero_pedido VARCHAR(50) UNIQUE NOT NULL,
    usuario_id VARCHAR(50) NOT NULL,
    fecha_pedido DATETIME NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente',
    total DECIMAL(10, 2) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE pedido_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

INSERT INTO categorias (nombre, icono, descripcion) VALUES
('Sistemas de Audio', 'fas fa-music', 'Altavoces, amplificadores y sistemas multimedia para coche'),
('Navegación GPS', 'fas fa-map-marker-alt', 'Sistemas de navegación y localización por satélite'),
('Cámaras y Sensores', 'fas fa-camera', 'Cámaras de marcha atrás y sensores de aparcamiento'),
('Iluminación LED', 'fas fa-lightbulb', 'Luces LED para interior y exterior del vehículo'),
('Herramientas', 'fas fa-tools', 'Herramientas y equipos para instalación y mantenimiento');

INSERT INTO productos (nombre, descripcion, descripcion_corta, precio, categoria_id, disponibilidad, imagen, destacado, oferta, precio_original, descuento, mas_vendido) VALUES
('Sistema de Navegación GPS 7"', 'GPS con pantalla táctil de 7 pulgadas, actualizaciones en tiempo real, alertas de radar, puntos de interés y conectividad Bluetooth.', 'GPS profesional para tu coche', 199.99, 2, 1000, 'gps-navegacion.jpg', TRUE, FALSE, NULL, NULL, TRUE),
('Altavoces Pioneer 6x9', 'Par de altavoces Pioneer de 6x9 pulgadas, 300W de potencia, respuesta en frecuencia 35Hz-22kHz, cono compuesto IMPP.', 'Altavoces de alta calidad para automóvil', 89.99, 1, 1000, 'altavoces-pioneer.jpg', TRUE, TRUE, 109.99, 18, TRUE),
('Cámara de Marcha Atrás HD', 'Cámara para marcha atrás con resolución 720p, visión nocturna, ángulo de 170 grados, resistente al agua.', 'Cámara HD para mejor visibilidad', 49.99, 3, 1000, 'camara-marcha-atras.jpeg', FALSE, FALSE, NULL, NULL, FALSE),
('Kit Luces LED Interiores', 'Kit completo de 12 luces LED para interior del coche, varios colores, control remoto, fácil instalación.', 'Ilumina el interior de tu vehículo', 29.99, 4, 1000, 'luces-led-interior.jpg', FALSE, TRUE, 39.99, 25, FALSE),
('Scanner Diagnóstico OBD2', 'Scanner profesional para diagnóstico de vehículos, compatible con la mayoría de marcas, lectura y borrado de códigos de error.', 'Herramienta esencial para diagnóstico', 79.99, 5, 1000, 'scanner-obd2.png', FALSE, FALSE, NULL, NULL, FALSE),
('Pantalla Multimedia Android 10"', 'Pantalla táctil Android de 10.1 pulgadas, GPS integrado, Bluetooth, WiFi, compatible con Apple CarPlay y Android Auto.', 'Centro de entretenimiento completo', 299.99, 1, 1000, 'pantalla-android.jpg', TRUE, FALSE, NULL, NULL, FALSE),
('Sensores de Aparcamiento 4 Uds', 'Kit de 4 sensores de aparcamiento ultrasónicos, pantalla LCD, alerta audible y visual, instalación profesional recomendada.', 'Aparca con total seguridad', 69.99, 3, 1000, 'sensores-aparcamiento.jpg', FALSE, TRUE, 89.99, 22, TRUE);

INSERT INTO usuarios (id, nombre, email, telefono, password_hash, fecha_registro, direccion, ciudad, codigo_postal) VALUES
('usr_demo', 'Cliente Demo', 'demo@electrocar.com', '123456789', 'demo123', CURDATE(), 'Calle Falsa 123', 'Madrid', '28001');