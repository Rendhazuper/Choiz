<?php

$host = "localhost";
$user = "root";
$password = "";
$dbname = "choiz";

$conn = new \MySQLi($host, $user, $password, $dbname);

if ($conn->connect_error) {
    echo "Koneksi Gagal";
}else{
    echo "Koneksi Berhasil";
}