<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: multipart/form-data");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    require_once "../Helper/DB.php"; 
} catch (Exception $err) {
    echo json_encode(["error" => "Database connection error: " . $err->getMessage()]);
    exit;
}

error_log("Received POST data: " . print_r($_POST, true));
error_log("Received FILES data: " . print_r($_FILES, true));

if (isset($_POST['nama_produk']) && isset($_POST['sizes']) && isset($_POST['warna']) && isset($_POST['kategori']) && isset($_POST['stocks']) && isset($_POST['harga']) && isset($_FILES['gambar_produk']) && isset($_POST['deskripsi'])) {

    $nama_produk = $_POST['nama_produk'];
    $sizes = json_decode($_POST['sizes']); 
    $warna = json_decode($_POST['warna'], true);
    $kategori = $_POST['kategori'];
    $stocks = json_decode($_POST['stocks'], true);
    $harga = intval($_POST['harga']);
    $deskripsi = $_POST['deskripsi'];

    error_log("Decoded data:");
    error_log("sizes: " . print_r($sizes, true));
    error_log("warna: " . print_r($warna, true));
    error_log("stocks: " . print_r($stocks, true));

    if (
        strlen($nama_produk) > 255 || !is_array($sizes) ||
        array_filter($sizes, fn($size) => strlen($size) > 50) ||
        !is_array($warna) || strlen($kategori) > 100 ||
        $harga < 0 || strlen($deskripsi) > 65535
    ) {
        exit;
    }


    $gambar_path = '';
    if ($_FILES['gambar_produk']['error'] === UPLOAD_ERR_OK) {
        $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
        $max_file_size = 5 * 1024 * 1024; // 5MB

        // Validate file type and size
        if (!in_array($_FILES['gambar_produk']['type'], $allowed_types)) {
            exit;
        }

        if ($_FILES['gambar_produk']['size'] > $max_file_size) {
            exit;
        }


        $file_extension = pathinfo($_FILES['gambar_produk']['name'], PATHINFO_EXTENSION);
        $unique_filename = uniqid() . '.' . $file_extension;
        $upload_directory = 'C:\\PUNYA SAYA\\Portofolio\\choiz - Copy\\frontend\\public\\asset\\produk\\';

        // Ensure upload directory exists
        if (!file_exists($upload_directory)) {
            mkdir($upload_directory, 0777, true);
        }

        $upload_path = $upload_directory . $unique_filename;

        // Move uploaded file
        if (move_uploaded_file($_FILES['gambar_produk']['tmp_name'], $upload_path)) {
            $gambar_path = 'asset/produk/' . $unique_filename;
        } else {
            echo json_encode(["error" => "Gagal memindahkan file yang diupload."]);
            exit;
        }
    }
  
        $conn->begin_transaction();

        try {
            $stmt = $conn->prepare("INSERT INTO produk (nama_produk, id_kategori, harga, gambar_produk, deskripsi) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("sisss", $nama_produk, $kategori, $harga, $gambar_path, $deskripsi);
            $result = $stmt->execute();
            
            // Debug: Log query result
            error_log("Product insert result: " . ($result ? "success" : "failed"));
            
            $id_produk = $conn->insert_id;
            error_log("Generated product ID: " . $id_produk);

            // Insert sizes
            $query = "INSERT INTO size_produk (id_produk, size) VALUES ";
            $values = [];
            $params = [];
            $types = "";
        
            foreach ($sizes as $size) {
                $values[] = "(?, ?)";
                $params[] = $id_produk;
                $params[] = $size;
                $types .= "is";
            }

            $query .= implode(", ", $values);
            $stmtSize = $conn->prepare($query);
            $stmtSize->bind_param($types, ...$params);
            $stmtSize->execute();

            // Get inserted size IDs
            $stmtIdSize = $conn->prepare("SELECT id_size, size FROM size_produk WHERE id_produk = ?");
            $stmtIdSize->bind_param("i", $id_produk);
            $stmtIdSize->execute();
            $resultIdSize = $stmtIdSize->get_result();
            $sizeMap = [];
            while ($row = $resultIdSize->fetch_assoc()) {
                $sizeMap[$row['size']] = $row['id_size'];
            }

            // Insert stok untuk setiap kombinasi size dan warna
            $queryStok = "INSERT INTO stok_size_produk (id_size, id_warna, stok) VALUES ";
            $valuesStok = [];
            $paramsStok = [];
            $typesStok = "";

            foreach ($stocks as $size => $warnaStok) {
                $id_size = $sizeMap[$size];
                foreach ($warnaStok as $id_warna => $stok) {
                    $valuesStok[] = "(?, ?, ?)";
                    $paramsStok[] = $id_size;
                    $paramsStok[] = $id_warna;
                    $paramsStok[] = $stok;
                    $typesStok .= "iii";
                }
            }

            $queryStok .= implode(", ", $valuesStok);
            $stmtStok = $conn->prepare($queryStok);
            $stmtStok->bind_param($typesStok, ...$paramsStok);
            $stmtStok->execute();

            $conn->commit();
            echo json_encode(["message" => "Produk berhasil ditambahkan.", "id_produk" => $id_produk]);
        } catch (Exception $e) {
            $conn->rollback();
            error_log("Error in transaction: " . $e->getMessage());
            echo json_encode(["error" => "Terjadi kesalahan saat memasukkan data: " . $e->getMessage()]);
            exit;
        }
    

} else {
    $missing = [];
    if (!isset($_POST['nama_produk'])) $missing[] = 'nama_produk';
    if (!isset($_POST['sizes'])) $missing[] = 'sizes';
    if (!isset($_POST['warna'])) $missing[] = 'warna';
    if (!isset($_POST['kategori'])) $missing[] = 'kategori';
    if (!isset($_POST['stocks'])) $missing[] = 'stocks';
    if (!isset($_POST['harga'])) $missing[] = 'harga';
    if (!isset($_FILES['gambar_produk'])) $missing[] = 'gambar_produk';
    if (!isset($_POST['deskripsi'])) $missing[] = 'deskripsi';
    
    error_log("Missing fields: " . implode(", ", $missing));
    echo json_encode(["error" => "Input tidak lengkap. Fields yang hilang: " . implode(", ", $missing)]);
}

$conn->close();
?>
