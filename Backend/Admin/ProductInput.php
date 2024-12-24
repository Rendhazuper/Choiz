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

    if (
        strlen($nama_produk) > 255 || !is_array($sizes) ||
        array_filter($sizes, fn($size) => strlen($size) > 50) ||
        strlen($warna) > 50 || strlen($kategori) > 100 ||
        array_filter($stocks, fn($stok) => $stok < 0) ||
        $harga < 0 || strlen($deskripsi) > 65535
    ) {
        exit;
    }

    // Process image upload
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

        // Generate unique filename
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

    // Check if product already exists
    $stmtCheck = $conn->prepare("SELECT id_produk FROM produk WHERE nama_produk = ?");
    $stmtCheck->bind_param("s", $nama_produk);
    $stmtCheck->execute();
    $resultCheck = $stmtCheck->get_result();

    if ($resultCheck->num_rows > 0) {
        // Product exists, update stock only
        $row = $resultCheck->fetch_assoc();
        $id_produk = $row['id_produk'];

        // Update size_produk and stok_size_produk
        // Update size_produk
        $querySize = "UPDATE size_produk SET size = CASE ";
        $paramsSize = [];
        $typesSize = "";

        foreach ($sizes as $i => $size) {
            $querySize .= "WHEN id_produk = ? AND size = ? THEN ? ";
            $paramsSize[] = $id_produk;
            $paramsSize[] = $size;
            $paramsSize[] = $size;
            $typesSize .= "iss";
        }
        $querySize .= "END WHERE id_produk = ?";

        // Update stok_size_produk
        $queryStok = "UPDATE stok_size_produk SET stok = CASE ";
        $paramsStok = [];
        $typesStok = "";

        foreach ($stocks as $i => $stok) {
            $queryStok .= "WHEN id_size = ? THEN ? ";
            $paramsStok[] = $id_produk;
            $paramsStok[] = $stok;
            $typesStok .= "ii";
        }
        $queryStok .= "END WHERE id_size IN (SELECT id_size FROM size_produk WHERE id_produk = ?)";

        // Execute queries
        try {
            $conn->begin_transaction();

            // Update size_produk
            $stmtSize = $conn->prepare($querySize);
            $stmtSize->bind_param($typesSize, ...$paramsSize);
            $stmtSize->execute();

            // Update stok_size_produk
            $stmtStok = $conn->prepare($queryStok);
            $stmtStok->bind_param($typesStok, ...$paramsStok);
            $stmtStok->execute();

            // Commit transaction
            $conn->commit();
            $stmtSize->close();
            $stmtStok->close();
            echo json_encode(["message" => "Produk stok diperbarui."]);
        } catch (Exception $e) {
            $conn->rollback();
            echo json_encode(["error" => "Terjadi kesalahan saat memperbarui data."]);
            exit;
        }

    } else {
        // Product doesn't exist, insert new product
        $conn->begin_transaction();

        try {
            // Insert new product
            $stmt = $conn->prepare("INSERT INTO produk (nama_produk, warna, kategori, harga, gambar_produk, deskripsi) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("ssssss", $nama_produk, $warna, $kategori, $harga, $gambar_path, $deskripsi);
            $stmt->execute();
            
            // Get the last inserted product ID
            $id_produk = $conn->insert_id;

            // Insert sizes into size_produk
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

            // Insert stok into stok_size_produk
            $querySize = "INSERT INTO stok_size_produk (id_size, stok) VALUES ";
            $valuesSize = [];
            $paramsSize = [];
            $typesSize = "";

            $stmtIdSize = $conn->prepare("SELECT id_size FROM size_produk WHERE id_produk = ?");
            $stmtIdSize->bind_param("i", $id_produk);
            $stmtIdSize->execute();
            $resultIdSize = $stmtIdSize->get_result();
            $idSize = [];
            while ($row = $resultIdSize->fetch_assoc()) {
                $idSize[] = $row;
            }

            $i = 0;
            foreach ($stocks as $stok) {
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

            $conn->commit();
            $stmt->close();
            $stmtSize->close();
            $stmtIdSize->close();
            $stmtStok->close();
            echo json_encode(["message" => "Produk berhasil ditambahkan."]);
        } catch (Exception $e) {
            $conn->rollback();
            echo json_encode(["error" => "Terjadi kesalahan saat memasukkan data."]);
            exit;
        }
    }

} else {
    echo json_encode(["error" => "Input tidak lengkap. Harap periksa kembali."]);
}

$conn->close();
?>
