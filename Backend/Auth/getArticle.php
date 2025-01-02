<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

require_once "../Helper/DB.php";

$id = isset($_GET['id']) ? $_GET['id'] : null;

if ($id) {
    // Get specific article
    try {
        $stmt = $conn->prepare("SELECT id_artikel, judul, deskripsi, author, kategori, konten, gambar, date FROM artikel WHERE id_artikel = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($row = $result->fetch_assoc()) {
            // Debug: cek apakah ada data gambar
            error_log("Image data exists: " . (!empty($row['gambar']) ? "yes" : "no"));
            
            // Convert gambar BLOB to base64
            if (!empty($row['gambar'])) {
                $row['gambar'] = base64_encode($row['gambar']);
                // Debug: cek hasil konversi
                error_log("Base64 length: " . strlen($row['gambar']));
            }
            
            echo json_encode([
                "status" => "success",
                "data" => $row
            ]);
        } else {
            echo json_encode([
                "status" => "error",
                "message" => "Article not found"
            ]);
        }
        
        $stmt->close();
    } catch (Exception $e) {
        echo json_encode([
            "status" => "error",
            "message" => $e->getMessage()
        ]);
    }
} else {
    // Get all articles
    try {
        $sql = "SELECT id_artikel, judul, deskripsi, author, kategori, gambar, date FROM artikel ORDER BY date DESC";
        $result = $conn->query($sql);
        $articles = [];
        
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                // Convert gambar BLOB to base64
                if ($row['gambar']) {
                    $row['gambar'] = base64_encode($row['gambar']);
                }
                $articles[] = $row;
            }
            echo json_encode([
                "status" => "success",
                "data" => $articles
            ]);
        } else {
            echo json_encode([
                "status" => "success",
                "data" => []
            ]);
        }
    } catch (Exception $e) {
        echo json_encode([
            "status" => "error",
            "message" => $e->getMessage()
        ]);
    }
}

$conn->close(); 