<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: multipart/form-data");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "../Helper/DB.php";

// Debug log
error_log("Received POST data: " . print_r($_POST, true));
error_log("Received FILES data: " . print_r($_FILES, true));

// Validasi input
if (empty($_POST['judul']) || empty($_POST['deskripsi']) || 
    empty($_POST['author']) || empty($_POST['kategori']) || 
    empty($_POST['konten']) || empty($_FILES['gambar_artikel'])) {
    
    echo json_encode([
        "status" => "error",
        "message" => "Semua field harus diisi termasuk gambar"
    ]);
    exit;
}

try {
    // Validasi file
    $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
    if (!in_array($_FILES['gambar_artikel']['type'], $allowed_types)) {
        throw new Exception("Hanya file JPG, JPEG, PNG & GIF yang diperbolehkan");
    }
    
    if ($_FILES["gambar_artikel"]["size"] > 5000000) { // 5MB
        throw new Exception("File terlalu besar (maksimal 5MB)");
    }
    
    // Baca file gambar sebagai binary
    $gambar_binary = file_get_contents($_FILES['gambar_artikel']['tmp_name']);
    
    $stmt = $conn->prepare("INSERT INTO artikel (judul, deskripsi, author, kategori, konten, gambar, date) VALUES (?, ?, ?, ?, ?, ?, ?)");
    
    $date = !empty($_POST['date']) ? $_POST['date'] : date('Y-m-d');
    
    $stmt->bind_param("sssssss", 
        $_POST['judul'],
        $_POST['deskripsi'],
        $_POST['author'],
        $_POST['kategori'],
        $_POST['konten'],
        $gambar_binary,
        $date
    );

    if ($stmt->execute()) {
        echo json_encode([
            "status" => "success",
            "message" => "Artikel berhasil ditambahkan"
        ]);
    } else {
        throw new Exception($stmt->error);
    }

} catch (Exception $e) {
    error_log("Error: " . $e->getMessage());
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}

$stmt->close();
$conn->close(); 