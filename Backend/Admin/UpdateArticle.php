<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "../Helper/DB.php";

try {
    if (!isset($_POST['id_artikel'])) {
        throw new Exception("Article ID is required");
    }

    $id_artikel = $_POST['id_artikel'];
    $judul = $_POST['judul'];
    $deskripsi = $_POST['deskripsi'];
    $author = $_POST['author'];
    $kategori = $_POST['kategori'];
    $konten = $_POST['konten'];

    // Start transaction
    $conn->begin_transaction();

    if (isset($_FILES['gambar_artikel']) && $_FILES['gambar_artikel']['error'] === UPLOAD_ERR_OK) {
        // Handle new image upload
        $image_data = file_get_contents($_FILES['gambar_artikel']['tmp_name']);
        
        $stmt = $conn->prepare("UPDATE artikel SET judul=?, deskripsi=?, author=?, kategori=?, konten=?, gambar=? WHERE id_artikel=?");
        $stmt->bind_param("ssssssi", $judul, $deskripsi, $author, $kategori, $konten, $image_data, $id_artikel);
    } else {
        // Update without changing the image
        $stmt = $conn->prepare("UPDATE artikel SET judul=?, deskripsi=?, author=?, kategori=?, konten=? WHERE id_artikel=?");
        $stmt->bind_param("sssssi", $judul, $deskripsi, $author, $kategori, $konten, $id_artikel);
    }

    if ($stmt->execute()) {
        $conn->commit();
        echo json_encode([
            "status" => "success",
            "message" => "Article updated successfully"
        ]);
    } else {
        throw new Exception($stmt->error);
    }

} catch (Exception $e) {
    if (isset($conn)) {
        $conn->rollback();
    }
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}

if (isset($stmt)) {
    $stmt->close();
}
$conn->close(); 