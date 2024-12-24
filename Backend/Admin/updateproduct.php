<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: multipart/form-data");

require_once "../Helper/DB.php"; 

$id_produk = $_POST['id'];
$nama_produk = $_POST['name'];
$warna = $_POST['color'];
$harga = $_POST['price'];
$deskripsi = $_POST['description'];
$image = isset($_FILES['image']) ? $_FILES['image'] : null;

$response = ["success" => false, "message" => "Unknown error occurred"];

// Mulai transaksi
$conn->begin_transaction();
try {
    $sql_update_product = "UPDATE produk SET nama_produk = ?, warna = ?, harga = ?, deskripsi = ? WHERE id_produk = ?";
    $stmt = $conn->prepare($sql_update_product);
    $stmt->bind_param("ssdsi", $nama_produk, $warna, $harga, $deskripsi, $id_produk);
    $stmt->execute();

     // Process image upload
     if ($image && $image['tmp_name']) {
        $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
        $max_file_size = 5 * 1024 * 1024; // 5MB

        // Validate file type
        if (!in_array($image['type'], $allowed_types)) {
            throw new Exception("File type not allowed.");
        }

        // Validate file size
        if ($image['size'] > $max_file_size) {
            throw new Exception("File size exceeds the maximum limit of 5MB.");
        }

        // Generate unique filename
        $file_extension = pathinfo($image['name'], PATHINFO_EXTENSION);
        $unique_filename = uniqid() . '.' . $file_extension;
        $upload_directory = 'C:\\PUNYA SAYA\\Portofolio\\choiz - Copy\\frontend\\public\\asset\\produk\\'; 

        // Ensure upload directory exists
        if (!file_exists($upload_directory)) {
            if (!mkdir($upload_directory, 0777, true)) {
                throw new Exception("Failed to create upload directory.");
            }
        }

        $upload_path = $upload_directory . $unique_filename;

        // Move uploaded file
        if (move_uploaded_file($image['tmp_name'], $upload_path)) {
            $gambar_path = 'asset/produk/' . $unique_filename; 
            $sql_update_image = "UPDATE produk SET gambar_produk = ? WHERE id_produk = ?";
            $stmt = $conn->prepare($sql_update_image);
            $stmt->bind_param("si", $gambar_path, $id_produk);
            $stmt->execute();
        } else {
            throw new Exception("Failed to upload image.");
        }
    }
 $sizes = json_decode($_POST['sizes'], true); 
 $stocks = json_decode($_POST['stocks'], true); 


 $sql_delete_sizes = "DELETE FROM size_produk WHERE id_produk = ?";
 $stmt = $conn->prepare($sql_delete_sizes);
 $stmt->bind_param("i", $id_produk);
 $stmt->execute();


 $sql_insert_size = "INSERT INTO size_produk (id_produk, size) VALUES (?, ?)";
 $stmt = $conn->prepare($sql_insert_size);

 foreach ($sizes as $size) {
     $stmt->bind_param("is", $id_produk, $size);
     $stmt->execute();
 }

 $sql_get_size_ids = "SELECT id_size, size FROM size_produk WHERE id_produk = ?";
 $stmt = $conn->prepare($sql_get_size_ids);
 $stmt->bind_param("i", $id_produk);
 $stmt->execute();
 $result = $stmt->get_result();

 $size_ids = [];
 while ($row = $result->fetch_assoc()) {
     $size_ids[$row['size']] = $row['id_size']; 
 }


 $sql_update_stock = "INSERT INTO stok_size_produk (id_size, stok) VALUES (?, ?) ON DUPLICATE KEY UPDATE stok = ?";
 $stmt = $conn->prepare($sql_update_stock);

 foreach ($sizes as $size) {
     $stock = isset($stocks[$size]) ? $stocks[$size] : 0; 
     if (isset($size_ids[$size])) {
         $stmt->bind_param("iii", $size_ids[$size], $stock, $stock);
         $stmt->execute();
     }
 }


 $conn->commit();
 $response = ["success" => true, "message" => "Product updated successfully"];
} catch (Exception $e) {

 $conn->rollback();
 $response = ["success" => false, "message" => $e->getMessage()];
}


$conn->close();


echo json_encode($response);
?>
