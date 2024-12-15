<?php
require_once "./DB.php";

function GenerateToken64()
{
    $token = '';
    $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ($i = 0; $i < 64; $i++) {
        $token .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $token;
}

//Send an email (example implementation; replace with your email logic).

function sendResetEmail($email, $token)
{
    $apiKey = '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'; // Ganti dengan API key Anda
    $url = 'https://api.brevo.com/v3/smtp/email';

    $resetLink = "http:/lightcoral-rat-258584.hostingersite.com/reset?token=$token"; // Ganti dengan URL reset password Anda

    $data = [
        'sender' => ['Administrator' => 'Polinema Career', 'email' => 'giojio936@gmail.com'],
        'to' => [['email' => $email]],
        'subject' => 'Password Reset Request',
        'htmlContent' => "<html><body><p>Hai,</p>
                   <p>Klik link berikut untuk mereset password Anda:</p>
                   <p><a href='$resetLink'>Reset Password</a></p>
                   <p>Link ini akan kedaluwarsa dalam 1 jam.</p></body></html>"
    ];

    $options = [
        'http' => [
            'header'  => "Content-Type: application/json\r\n" .
                "api-key: $apiKey\r\n",
            'method'  => 'POST',
            'content' => json_encode($data),
        ],
    ];

    $context  = stream_context_create($options);
    $result = file_get_contents($url, false, $context);

    return $result !== false;
}

function generateOtp()
{
    $otp = '';
    for ($i = 0; $i < 6; $i++) {
        $otp .= rand(0, 9);
    }
    return $otp;
}

function sortProductsByPriceAscending($products)
{
    usort($products, function($a, $b) {
        return $a['harga'] - $b['harga'];
    });
    return $products;
}

function sortProductsByPriceDescending($products)
{
    usort($products, function($a, $b) {
        return $b['harga'] - $a['harga'];
    });
    return $products;
}

function sortProductsByNameAscending($products)
{
    usort($products, function($a, $b) {
        return strcmp($a['nama_produk'], $b['nama_produk']);
    });
    return $products;
}

function sortProductsByNameDescending($products)
{
    usort($products, function($a, $b) {
        return strcmp($b['nama_produk'], $a['nama_produk']);
    });
    return $products;
}

function getProductById($id_produk) {
    $conn = connectToDatabase();
    $sql = "SELECT pr.nama_produk, pr.warna, pr.kategori, pr.harga, pr.gambar_produk, pr.deskripsi, sz.size, st.stok
            FROM produk pr
            INNER JOIN size_produk sz ON pr.id_produk = sz.id_produk
            INNER JOIN stok_size_produk st ON sz.id_size = st.id_size
            WHERE pr.id_produk = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id_produk);
    $stmt->execute();
    $result = $stmt->get_result();

    $data = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();
    $conn->close();

    return $data;
}

function deleteProductById($id_produk) {
    $conn = connectToDatabase();

    // Hapus data di tabel stok_size_produk terlebih dahulu
    $sql1 = "DELETE st FROM stok_size_produk st 
             INNER JOIN size_produk sz ON st.id_size = sz.id_size
             WHERE sz.id_produk = ?";
    $stmt1 = $conn->prepare($sql1);
    $stmt1->bind_param("i", $id_produk);
    $stmt1->execute();

    // Hapus data di tabel size_produk
    $sql2 = "DELETE FROM size_produk WHERE id_produk = ?";
    $stmt2 = $conn->prepare($sql2);
    $stmt2->bind_param("i", $id_produk);
    $stmt2->execute();

    // Hapus data di tabel produk
    $sql3 = "DELETE FROM produk WHERE id_produk = ?";
    $stmt3 = $conn->prepare($sql3);
    $stmt3->bind_param("i", $id_produk);
    $stmt3->execute();

    $stmt1->close();
    $stmt2->close();
    $stmt3->close();
    $conn->close();
}

function updateProductData($id_produk, $fields, $id_size, $size, $stok) {
    $conn = connectToDatabase();

    try {
        // Mulai transaksi
        $conn->begin_transaction();

        // Update tabel produk
        if (!empty($fields)) {
            $setClauses = [];
            $params = [];
            $types = "";

            foreach ($fields as $key => $value) {
                $setClauses[] = "$key = ?";
                $params[] = $value;
                $types .= is_int($value) ? "i" : "s";
            }

            $params[] = $id_produk;
            $types .= "i";

            $sql = "UPDATE produk SET " . implode(", ", $setClauses) . " WHERE id_produk = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param($types, ...$params);
            $stmt->execute();
            $stmt->close();
        }

        // Update tabel size_produk
        $sql = "UPDATE size_produk SET size = ? WHERE id_size = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("si", $size, $id_size);
        $stmt->execute();
        $stmt->close();

        // Update tabel stok_size_produk
        $sql = "UPDATE stok_size_produk SET stok = ? WHERE id_size = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ii", $stok, $id_size);
        $stmt->execute();
        $stmt->close();

        // Commit transaksi
        $conn->commit();

        $conn->close();
        return "Data produk, size, dan stok berhasil diperbarui.";

    } catch (Exception $e) {
        // Rollback jika ada kesalahan
        $conn->rollback();
        $conn->close();
        return "Terjadi kesalahan: " . $e->getMessage();
    }
}
