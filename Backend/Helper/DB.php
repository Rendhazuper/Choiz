<?php

function connectToDatabase() {
    $host = "localhost";
    $user = "root";
    $password = "";
    $dbname = "choiz";

    $conn = new \MySQLi($host, $user, $password, $dbname);
    return $conn;
}

$conn = connectToDatabase();