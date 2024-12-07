<?php
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

    $resetLink = "http://localhost:3000/reset?token=$token"; // Ganti dengan URL reset password Anda

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