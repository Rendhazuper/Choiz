<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

try {
    require_once "../Helper/DB.php";

    $stmt = $conn->prepare("SELECT id_kategori, nama_kategori FROM kategori");
    $stmt->execute();
    $result = $stmt->get_result();

    $kategori = [];
    while ($row = $result->fetch_assoc()) {
        $kategori[] = $row;
    }

    echo json_encode($kategori);
} catch (Exception $e) {
    echo json_encode(["error" => "Gagal memuat kategori."]);
    exit;
}
?>
