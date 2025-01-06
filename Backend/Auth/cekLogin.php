<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

session_start();

// Debug logs
error_log('Session check initiated');
error_log('SESSION data: ' . print_r($_SESSION, true));
error_log('Current time: ' . time());

// Check if session exists and not expired
if (isset($_SESSION['username']) && isset($_SESSION['expire_time'])) {
    if (time() < $_SESSION['expire_time']) {
        // Session still valid
        echo json_encode([
            'status' => 'active',
            'username' => $_SESSION['username'],
            'level' => $_SESSION['level']
        ]);
    } else {
        // Session expired
        session_destroy();
        echo json_encode(['status' => 'expired']);
    }
} else {
    // No valid session
    echo json_encode(['status' => 'no_session']);
}