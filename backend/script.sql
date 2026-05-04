CREATE DATABASE IF NOT EXISTS zeroxmotors;
USE zeroxmotors;

CREATE TABLE clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo_documento ENUM('DNI','RUC','Pasaporte') DEFAULT 'DNI',
  numero_documento VARCHAR(20),
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  telefono VARCHAR(20),
  email VARCHAR(100),
  direccion VARCHAR(200),
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol ENUM('administrador','vendedor','almacenero','repartidor') DEFAULT 'vendedor',
  activo TINYINT(1) DEFAULT 1,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0,
  categoria VARCHAR(50),
  imagen VARCHAR(255) DEFAULT NULL,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ventas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  estado ENUM('pendiente','pagado','anulado') DEFAULT 'pendiente',
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

CREATE TABLE detalle_ventas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  venta_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (venta_id) REFERENCES ventas(id),
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);

CREATE TABLE cotizaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  estado ENUM('pendiente','aprobado','rechazado') DEFAULT 'pendiente',
  vigencia DATE,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

CREATE TABLE detalle_cotizaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cotizacion_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (cotizacion_id) REFERENCES cotizaciones(id),
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);



USE zeroxmotors;

INSERT INTO clientes (tipo_documento,numero_documento,nombre, apellido, telefono, email, direccion) VALUES
('DNI','12345678','Carlos', 'Ramirez', '987654321', 'carlos@gmail.com', 'Av. Lima 123'),
('DNI','25368574','Maria', 'Torres', '912345678', 'maria@gmail.com', 'Jr. Cusco 456'),
('RUC','12345678548','Juan', 'Perez', '945678123', 'juan@gmail.com', 'Av. Arequipa 789'),
('DNI','24458575','Ana', 'Lopez', '978123456', 'ana@gmail.com', 'Calle Miraflores 321'),
('DNI','66478955','Luis', 'Garcia', '956789012', 'luis@gmail.com', 'Av. Brasil 654');

INSERT INTO productos (nombre, descripcion, precio, stock, categoria,imagen) VALUES
('Motor 150cc', 'Motor de alto rendimiento', 2500.00, 10, 'Motores','https://motosdelpiero.com/wp-content/uploads/2025/05/Diseno-sin-titulo-47.jpg'),
('Llanta Delantera', 'Llanta para moto 17 pulgadas', 180.00, 25, 'Llantas','https://http2.mlstatic.com/D_NQ_NP_750186-MLU78095104528_082024-O.webp'),
('Freno de Disco', 'Kit de freno delantero', 320.00, 15, 'Frenos','https://www.motopartes.com.co/3231-large_default/jc100-jc110-disco-de-freno-delantero.jpg'),
('Aceite 10W40', 'Aceite para motor 4 tiempos', 45.00, 50, 'Lubricantes','https://socopur.com.pe/wp-content/uploads/2021/02/MOT836311.webp'),
('Filtro de Aire', 'Filtro de aire universal', 35.00, 40, 'Filtros','https://vp-motors.com/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-31-at-11.54.08-AM.jpeg');

