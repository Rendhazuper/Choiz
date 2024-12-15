<?php

function connectToDatabase() {
    $host = "localhost";
    $user = "u606402596_secchoiz";
    $password = "Semuaitufana123";
    $dbname = "u606402596_secondchoiz";

    $conn = new \MySQLi($host, $user, $password, $dbname);
    return $conn;
}

$conn = connectToDatabase();