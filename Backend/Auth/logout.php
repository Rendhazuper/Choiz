<?php
session_destroy();

session_unset();

echo json_encode(['status' => 'success']);
?>