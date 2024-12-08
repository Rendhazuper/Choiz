<?php

$host = "localhost";
$user = "root";
$password = "";
$dbname = "choiz";

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    echo "Koneksi Gagal";
}