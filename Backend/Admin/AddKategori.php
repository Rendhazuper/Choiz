<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "../Helper/DB.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['nama_kategori']) || empty($data['nama_kategori'])) {
    echo json_encode(["success" => false, "message" => "Nama kategori tidak boleh kosong"]);
    exit;
}

try {
    $nama_kategori = $data['nama_kategori'];
    
    // Check if kategori already exists
    $check_query = "SELECT id_kategori FROM kategori WHERE nama_kategori = ?";
    $stmt = $conn->prepare($check_query);
    $stmt->bind_param("s", $nama_kategori);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "Kategori sudah ada"]);
        exit;
    }
    
    // Insert new kategori
    $insert_query = "INSERT INTO kategori (nama_kategori) VALUES (?)";
    $stmt = $conn->prepare($insert_query);
    $stmt->bind_param("s", $nama_kategori);
    
    if ($stmt->execute()) {
        $id_kategori = $conn->insert_id;
        echo json_encode([
            "success" => true, 
            "message" => "Kategori berhasil ditambahkan",
            "id_kategori" => $id_kategori
        ]);
    } else {
        throw new Exception("Gagal menambahkan kategori");
    }
    
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

$conn->close();
?> 