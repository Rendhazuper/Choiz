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

if (isset($_POST['nama_produk']) && isset($_POST['sizes']) && isset($_POST['warna']) && isset($_POST['kategori']) && isset($_POST['stocks']) && isset($_POST['harga']) && isset($_FILES['gambar_produk']) && isset($_POST['deskripsi'])) {

    $nama_produk = $_POST['nama_produk'];
    $sizes = json_decode($_POST['sizes']); 
    $warna = $_POST['warna'];
    $kategori = $_POST['kategori'];
    $stocks = json_decode($_POST['stocks'], true); 
    $harga = intval($_POST['harga']);
    $deskripsi = $_POST['deskripsi'];

    // echo json_encode($stocks);

  
    if (
        strlen($nama_produk) > 255 || !is_array($sizes) ||
        array_filter($sizes, fn($size) => strlen($size) > 50) ||
        strlen($warna) > 50 || strlen($kategori) > 100 ||
        array_filter($stocks, fn($stok) => $stok < 0) ||
        $harga < 0 || strlen($deskripsi) > 65535
    ) {
        // echo json_encode(["error" => "Input tidak valid."]);
        exit;
    }

    // Process image upload
    if ($_FILES['gambar_produk']['error'] === UPLOAD_ERR_OK) {
        $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
        $max_file_size = 5 * 1024 * 1024; // 5MB

        // Validate file type and size
        if (!in_array($_FILES['gambar_produk']['type'], $allowed_types)) {
            // echo json_encode(["error" => "Tipe file tidak diizinkan."]);
            exit;
        }

        if ($_FILES['gambar_produk']['size'] > $max_file_size) {
            // echo json_encode(["error" => "Ukuran file terlalu besar."]);
            exit;
        }

        // Generate unique filename
        $file_extension = pathinfo($_FILES['gambar_produk']['name'], PATHINFO_EXTENSION);
        $unique_filename = uniqid() . '.' . $file_extension;
        $upload_directory = 'C:\\PUNYA SAYA\\Portofolio\\choiz - Copy\\frontend\\public\\asset\\produk\\';
        // $upload_directory = 'D:\\Code Activity\\Werk\\choiz\\Choiz\\frontend\\public\\asset\\produk\\'; //eits bagi dua

        // Ensure upload directory exists
        if (!file_exists($upload_directory)) {
            mkdir($upload_directory, 0777, true);
        }

        $upload_path = $upload_directory . $unique_filename;

        // Move uploaded file
        if (move_uploaded_file($_FILES['gambar_produk']['tmp_name'], $upload_path)) {
            // Save relative path to image in database
            $gambar_path = 'asset/produk/' . $unique_filename;

            // Begin transaction
            $conn->begin_transaction();

            try {
                $stmt = $conn->prepare("INSERT INTO produk (nama_produk, warna, kategori, harga, gambar_produk, deskripsi) VALUES (?, ?, ?, ?, ?, ?)");
                $stmt->bind_param("ssssss", $nama_produk, $warna, $kategori, $harga, $gambar_path, $deskripsi);
                $stmt->execute();
            
                // Ambil id_produk langsung dari insert terakhir
                $id_produk = $conn->insert_id;
            
                // Insert sizes ke size_produk
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
            
                // Ambil id_size dari size_produk yang baru saja dimasukkan
                $stmtIdSize = $conn->prepare("SELECT id_size FROM size_produk WHERE id_produk = ?");
                $stmtIdSize->bind_param("i", $id_produk);
                $stmtIdSize->execute();
                $resultIdSize = $stmtIdSize->get_result();
                $idSize = [];
                while ($row = $resultIdSize->fetch_assoc()) {
                    $idSize[] = $row;
                }
            
                // Insert stok berdasarkan id_size
                $querySize = "INSERT INTO stok_size_produk (id_size, stok) VALUES ";
                $valuesSize = [];
                $paramsSize = [];
                $typesSize = "";
            
                $i = 0;
                foreach ($stocks as $size => $stok) {
                    $valuesSize[] = "(?, ?)";
                    $paramsSize[] = $idSize[$i]['id_size'];
                    $paramsSize[] = $stok;
                    $typesSize .= "ii";
                    $i++;
                }
            
                $querySize .= implode(", ", $valuesSize);
            
                $stmtStok = $conn->prepare($querySize);
                $stmtStok->bind_param($typesSize, ...$paramsSize);
                $stmtStok->execute();
            

                $stmtSize->close();
                $stmt->close();
                $stmtIdSize->close();
                $stmtStok->close();
            
               
                $conn->commit();
               
            } catch (Exception $e) {
                $conn->rollback();
               
            }
        } else {
            echo json_encode(["error" => "Gagal memindahkan file yang diupload."]);
        }
    } else {
        echo json_encode(["error" => "Terjadi kesalahan saat mengupload gambar."]);
    }
} else {
    echo json_encode(["error" => "Input tidak lengkap. Harap periksa kembali."]);
}

$conn->close();