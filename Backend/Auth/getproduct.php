<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
include('../helper/DB.php'); 



$sql = "SELECT * FROM produk";
$result = $conn->query($sql);
$produk = [];

if ($result->num_rows > 0) {
    // Menyimpan data produk dalam array
    while($row = $result->fetch_assoc()) {
        $produk[] = $row;
    }
}

$conn->close();

echo json_encode($produk);
?>
