<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "../Helper/DB.php";

try {
    $query = "SELECT id_warna, nama_warna FROM warna";
    $result = $conn->query($query);
    
    $warna = array();
    while($row = $result->fetch_assoc()) {
        $warna[] = array(
            'id_warna' => $row['id_warna'],
            'nama_warna' => $row['nama_warna']
        );
    }
    
    echo json_encode($warna);
} catch (Exception $e) {
    echo json_encode(["error" => "Error fetching warna: " . $e->getMessage()]);
}

$conn->close();
?> 