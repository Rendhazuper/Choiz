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
    require_once "../Helper/DB.php"; // Adjust according to your DB path...
} catch (Exception $err) {
    echo json_encode(["error" => "Database connection error: " . $err->getMessage()]);
    exit;
}

if (isset($_POST['nama_produk']) && isset($_POST['sizes']) && isset($_POST['warna']) && isset($_POST['kategori']) && isset($_POST['stocks']) && isset($_POST['harga']) && isset($_FILES['gambar_produk']) && isset($_POST['deskripsi'])) {

    $nama_produk = $_POST['nama_produk'];
    $sizes = json_decode($_POST['sizes']); // Decode sizes from JSON
    $warna = $_POST['warna'];
    $kategori = $_POST['kategori'];
    $stocks = json_decode($_POST['stocks'], true); // Decode stocks from JSON
    $harga = intval($_POST['harga']);
    $deskripsi = $_POST['deskripsi'];

    // echo json_encode($stocks);

    // Validate input
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
        $upload_directory = 'D:\\Code Activity\\Werk\\choiz\\Choiz\\frontend\\src\\asset\\produk\\'; // Adjust this path as needed

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
                // Insert product data into database -----
                $stmt = $conn->prepare("INSERT INTO produk (nama_produk, warna, kategori, harga,gambar_produk, deskripsi) VALUES (?, ?, ?, ?, ?, ?)");
                $stmt->bind_param("ssssss", $nama_produk, $warna, $kategori, $harga, $gambar_path, $deskripsi);
                $stmt->execute();

                //ambil id dari produk ------
                $stmtIdProduk = $conn->prepare("SELECT * FROM produk WHERE nama_produk = ? and kategori = ?");
                $stmtIdProduk->bind_param("ss", $nama_produk, $kategori);
                $stmtIdProduk->execute();
                $resultIdProduk = $stmtIdProduk->get_result();
                $idProduk = $resultIdProduk->fetch_assoc();

                // Insert size data into database denagn string query dengan multi-insert ------
                $query = "INSERT INTO size_produk (id_produk, size) VALUES ";
                $values = [];
                $params = [];
                $types = "";

                // Mengisi values untuk setiap ukuran
                foreach ($sizes as $size) {
                    $values[] = "(?, ?)";
                    $params[] = $idProduk['id_produk'];
                    $params[] = $size;
                    $types .= "is";
                }

                // Gabungkan values ke dalam query
                $query .= implode(", ", $values);

                // Persiapkan dan eksekusi query
                $stmtSize = $conn->prepare($query);
                $stmtSize->bind_param($types, ...$params);
                $stmtSize->execute();

                //ambil id_size ------
                $stmtIdSize = $conn->prepare("SELECT id_size FROM size_produk WHERE id_produk = ?");
                $stmtIdSize->bind_param("i", $idProduk['id_produk']);
                $stmtIdSize->execute();
                $resultIdSize = $stmtIdSize->get_result();
                $idSize = [];
                while ($row = $resultIdSize->fetch_assoc()) {
                    $idSize[] = $row;
                }
                echo json_encode($idSize);

                // Insert stok berdasarkan id size -------
                $querySize = "INSERT INTO stok_size_produk (id_size, stok) VALUES ";
                $valuesSize = [];
                $paramsSize = [];
                $typesSize = "";

                // Mengisi values untuk setiap stok
                foreach ($stocks as $size => $stok) {
                    $i = 0;
                    $valuesSize[] = "(?, ?)";
                    $paramsSize[] = $idSize['id_size'][$i];
                    $paramsSize[] = $stok;
                    $typesSize .= "ii";
                    $i++;
                }

                // Gabungkan values ke dalam query
                $querySize .= implode(", ", $values);

                // Persiapkan dan eksekusi query
                $stmtStok = $conn->prepare($querySize);
                $stmtStok->bind_param($typesSize, ...$paramsSize);
                $stmtStok->execute();

                //tutup semua statement
                $stmtSize->close();
                $stmt->close();
                $stmtIdProduk->close();
                $stmtIdSize->close();
                $stmtStok->close();

                // Commit transaction
                $conn->commit();
                // echo json_encode(["success" => "Data berhasil disimpan."]);
            } catch (Exception $e) {
                $conn->rollback();
                // echo json_encode(["error" => "Transaksi gagal: " . $e->getMessage()]);
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
