<?php
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');

    // Configuración de la base de datos
    $servername = "127.0.0.1";
    $username = "root";
    $password = "";
    $database = "autoelectro";

    // $servername = "127.0.0.1";
    // $username = "lanzarote";
    // $password = "1979";
    // $database = "autoelectro";

    // Crear conexión
    $conn = new mysqli($servername, $username, $password, $database);

    // Verificar conexión
    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
        exit();
    }

    // Establecer charset
    $conn->set_charset("utf8");

    // Obtener el método de la solicitud
    $method = $_SERVER['REQUEST_METHOD'];

    // Manejar OPTIONS request (para CORS)
    if ($method === 'OPTIONS') {
        http_response_code(200);
        exit();
    }

    // Obtener la ruta de la solicitud
    $request = $_GET['action'] ?? '';

    // Manejar diferentes acciones
    switch ($request) {
        case 'get_productos': getProductos($conn); break;
        case 'get_producto': 
            if (isset($_GET['id'])) { getProducto($conn, $_GET['id']); } 
            else { http_response_code(400); echo json_encode(["error" => "ID de producto no especificado"]); }
            break;
        case 'get_categorias': getCategorias($conn); break;
        case 'login': 
            if ($method === 'POST') { loginUsuario($conn); } 
            else { http_response_code(405); echo json_encode(["error" => "Método no permitido"]); }
            break;
        case 'registro': 
            if ($method === 'POST') { registrarUsuario($conn); } 
            else { http_response_code(405); echo json_encode(["error" => "Método no permitido"]); }
            break;
        case 'crear_pedido': 
            if ($method === 'POST') { crearPedido($conn); } 
            else { http_response_code(405); echo json_encode(["error" => "Método no permitido"]); }
            break;
        default: http_response_code(404); echo json_encode(["error" => "Acción no encontrada"]); break;
    }

    $conn->close();

    // Funciones para manejar las solicitudes
    function getProductos($conn) {
        $sql = "SELECT p.*, c.nombre as categoria_nombre FROM productos p LEFT JOIN categorias c ON p.categoria_id = c.id ORDER BY p.destacado DESC, p.nombre ASC";
        $result = $conn->query($sql);
        $productos = [];
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                // Convertir tipos de datos
                $row['destacado'] = (bool)$row['destacado'];
                $row['oferta'] = (bool)$row['oferta'];
                $row['mas_vendido'] = (bool)$row['mas_vendido'];
                $row['precio'] = (float)$row['precio'];
                $row['precio_original'] = $row['precio_original'] ? (float)$row['precio_original'] : null;
                $row['disponibilidad'] = (int)$row['disponibilidad'];
                $row['descuento'] = $row['descuento'] ? (int)$row['descuento'] : null;
                $productos[] = $row;
            }
        }
        echo json_encode($productos);
    }

    function getProducto($conn, $id) {
        $stmt = $conn->prepare("SELECT p.*, c.nombre as categoria_nombre FROM productos p LEFT JOIN categorias c ON p.categoria_id = c.id WHERE p.id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $producto = $result->fetch_assoc();
            $producto['destacado'] = (bool)$producto['destacado'];
            $producto['oferta'] = (bool)$producto['oferta'];
            $producto['mas_vendido'] = (bool)$producto['mas_vendido'];
            $producto['precio'] = (float)$producto['precio'];
            $producto['precio_original'] = $producto['precio_original'] ? (float)$producto['precio_original'] : null;
            $producto['disponibilidad'] = (int)$producto['disponibilidad'];
            $producto['descuento'] = $producto['descuento'] ? (int)$producto['descuento'] : null;
            echo json_encode($producto);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Producto no encontrado"]);
        }
        $stmt->close();
    }

    function getCategorias($conn) {
        $sql = "SELECT * FROM categorias ORDER BY nombre ASC";
        $result = $conn->query($sql);
        $categorias = [];
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) { 
                $categorias[] = $row; 
            }
        }
        echo json_encode($categorias);
    }

    function loginUsuario($conn) {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['id']) || !isset($data['password'])) {
            http_response_code(400);
            echo json_encode(["error" => "ID y contraseña requeridos"]);
            return;
        }
        $id = $conn->real_escape_string($data['id']);
        $password = $data['password'];
        
        // Validar formato de ID
        if (!preg_match('/^[a-zA-Z0-9_-]{3,50}$/', $id)) {
            http_response_code(400);
            echo json_encode(["error" => "Formato de ID inválido"]);
            return;
        }
        
        // Preparar consulta para obtener datos del usuario por ID
        $stmt = $conn->prepare("SELECT id, nombre, email, telefono, direccion, ciudad, codigo_postal, fecha_registro, password_hash FROM usuarios WHERE id = ? AND activo = 1");
        // Vincular parámetro ID a la consulta preparada
        $stmt->bind_param("s", $id);
        // Ejecutar la consulta
        $stmt->execute();
        // Obtener resultado de la consulta
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            // Extraer fila del resultado
            $usuario = $result->fetch_assoc();
            // Comparar contraseña recibida con el hash almacenado
            // Nota: idealmente usar `password_verify()` con hashes generados por `password_hash()`
            if ($password === $usuario['password_hash']) {
                // Eliminar campo sensible antes de devolver el usuario
                unset($usuario['password_hash']);
                // Responder con éxito y datos de usuario
                echo json_encode(["success" => true, "usuario" => $usuario]);
            } else {
                http_response_code(401);
                echo json_encode(["error" => "Credenciales incorrectas"]);
            }
        } else {
            http_response_code(401);
            echo json_encode(["error" => "Usuario no encontrado"]);
        }
        // Cerrar la sentencia preparada
        $stmt->close();
    }

    function registrarUsuario($conn) {
        // Leer y decodificar JSON entrante
        $data = json_decode(file_get_contents('php://input'), true);
        // Campos obligatorios para el registro
        $required = ['nombre', 'email', 'password', 'id', 'telefono'];
        foreach ($required as $field) {
            // Comprobar que cada campo requerido esté presente y no vacío
            if (!isset($data[$field]) || empty(trim($data[$field]))) {
                http_response_code(400);
                echo json_encode(["error" => "El campo $field es requerido"]);
                return;
            }
        }
        
        $regex_patterns = [
            'nombre' => '/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,100}$/',
            'id' => '/^[a-zA-Z0-9_-]{3,50}$/',
            'email' => '/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/',
            'telefono' => '/^[0-9]{9}$/'
        ];
        
        // Validar formatos de los campos usando expresiones regulares
        foreach ($regex_patterns as $field => $pattern) {
            if (!preg_match($pattern, trim($data[$field]))) {
                http_response_code(400);
                echo json_encode(["error" => "Formato inválido para el campo $field"]);
                return;
            }
        }
        
        // Verificar longitud mínima de la contraseña
        if (strlen($data['password']) < 6) {
            http_response_code(400);
            echo json_encode(["error" => "La contraseña debe tener al menos 6 caracteres"]);
            return;
        }
        
        // Comprobar que la contraseña contenga letras y números
        if (!preg_match('/[a-zA-Z]/', $data['password']) || !preg_match('/[0-9]/', $data['password'])) {
            http_response_code(400);
            echo json_encode(["error" => "La contraseña debe contener al menos una letra y un número"]);
            return;
        }
        
        // Escapar y comprobar si el ID ya existe
        $id = $conn->real_escape_string($data['id']);
        $check_id = $conn->query("SELECT id FROM usuarios WHERE id = '$id'");
        if ($check_id->num_rows > 0) {
            http_response_code(409);
            echo json_encode(["error" => "El ID de usuario ya está registrado"]);
            return;
        }
        
        // Escapar y comprobar si el email ya está registrado
        $email = $conn->real_escape_string($data['email']);
        $check_email = $conn->query("SELECT id FROM usuarios WHERE email = '$email'");
        if ($check_email->num_rows > 0) {
            http_response_code(409);
            echo json_encode(["error" => "El email ya está registrado"]);
            return;
        }
        
        // Preparar valores para inserción
        $nombre = $conn->real_escape_string($data['nombre']);
        $password_hash = $data['password'];
        $telefono = $conn->real_escape_string($data['telefono']);
        $direccion = $conn->real_escape_string($data['direccion'] ?? '');
        $ciudad = $conn->real_escape_string($data['ciudad'] ?? '');
        $codigo_postal = $conn->real_escape_string($data['codigo_postal'] ?? '');
        $fecha_registro = date('Y-m-d');
        
        // Construir consulta de inserción (usar consultas preparadas sería más seguro)
        $sql = "INSERT INTO usuarios (id, nombre, email, telefono, password_hash, fecha_registro, direccion, ciudad, codigo_postal) VALUES ('$id', '$nombre', '$email', '$telefono', '$password_hash', '$fecha_registro', '$direccion', '$ciudad', '$codigo_postal')";
        
        // Ejecutar inserción y devolver resultado
        if ($conn->query($sql) === TRUE) {
            echo json_encode([
                "success" => true, 
                "message" => "Usuario registrado correctamente",
                "usuario" => [
                    "id" => $id,
                    "nombre" => $nombre,
                    "email" => $email,
                    "telefono" => $telefono,
                    "direccion" => $direccion,
                    "ciudad" => $ciudad,
                    "codigo_postal" => $codigo_postal,
                    "fecha_registro" => $fecha_registro
                ]
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Error al registrar usuario: " . $conn->error]);
        }
    }

    function crearPedido($conn) {
        // Crear un nuevo pedido a partir de datos JSON
        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['usuario_id']) || !isset($data['items']) || !is_array($data['items'])) {
            http_response_code(400);
            echo json_encode(["error" => "Datos del pedido incompletos"]);
            return;
        }
        
        // Escapar usuario_id y preparar acumuladores
        $usuario_id = $conn->real_escape_string($data['usuario_id']);
        $total = 0;
        $items_detalle = [];

        $conn->begin_transaction();
        
        try {
            // Generar metadatos del pedido e insertar registro inicial
            $fecha_pedido = date('Y-m-d H:i:s');
            $estado = 'pendiente';
            $numero_pedido = 'PED' . date('YmdHis') . rand(100, 999);

            $sql_pedido = "INSERT INTO pedidos (numero_pedido, usuario_id, fecha_pedido, estado, total) VALUES ('$numero_pedido', '$usuario_id', '$fecha_pedido', '$estado', 0)";

            if (!$conn->query($sql_pedido)) {
                // Si falla la inserción del pedido, lanzar excepción para rollback
                throw new Exception("Error al crear pedido: " . $conn->error);
            }

            // ID del pedido recién creado
            $pedido_id = $conn->insert_id;
            
            foreach ($data['items'] as $item) {
                // Normalizar tipos de datos del ítem
                $producto_id = intval($item['producto_id']);
                $cantidad = intval($item['cantidad']);
                $precio = floatval($item['precio']);
                
                // Comprobar disponibilidad en base de datos
                $stock_result = $conn->query("SELECT disponibilidad, nombre FROM productos WHERE id = $producto_id");
                if ($stock_result->num_rows > 0) {
                    $producto = $stock_result->fetch_assoc();
                    $stock = $producto['disponibilidad'];
                    if ($stock < $cantidad) {
                        // Si no hay stock suficiente, abortar transacción
                        throw new Exception("Stock insuficiente para el producto: " . $producto['nombre']);
                    }
                } else {
                    // Producto no encontrado
                    throw new Exception("Producto no encontrado ID: $producto_id");
                }
                
                // Reducir stock en la base de datos
                if (!$conn->query("UPDATE productos SET disponibilidad = disponibilidad - $cantidad WHERE id = $producto_id")) {
                    throw new Exception("Error al actualizar stock: " . $conn->error);
                }
                
                $items_detalle[] = [
                    'producto_id' => $producto_id,
                    'cantidad' => $cantidad,
                    'precio' => $precio
                ];
                
                $subtotal = $cantidad * $precio;
                $total += $subtotal;
                
                $sql_item = "INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio) VALUES ($pedido_id, $producto_id, $cantidad, $precio)";
                
                if (!$conn->query($sql_item)) {
                    throw new Exception("Error al agregar item al pedido: " . $conn->error);
                }
            }
            
            // Actualizar total del pedido y confirmar transacción
            if (!$conn->query("UPDATE pedidos SET total = $total WHERE id = $pedido_id")) {
                throw new Exception("Error al actualizar total del pedido: " . $conn->error);
            }
            
            // Commit: hacer persistentes los cambios
            $conn->commit();
            
            echo json_encode([
                "success" => true,
                "message" => "Pedido creado correctamente",
                "pedido_id" => $pedido_id,
                "numero_pedido" => $numero_pedido,
                "total" => $total,
                "items" => $items_detalle,
                "fecha" => $fecha_pedido
            ]);
            
        } catch (Exception $e) {
            $conn->rollback();
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
    }

?>