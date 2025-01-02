<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

session_start();

// Debug logs
error_log('Checking session...');
error_log('Session data: ' . print_r($_SESSION, true));
error_log('Current time: ' . time());

if (isset($_SESSION['expire_time'])) {
    if (time() > $_SESSION['expire_time']) {
        // Session expired
        error_log('Session expired');
        session_destroy();
        echo json_encode(['status' => 'expired']);
    } else {
        error_log('Session still active');
        echo json_encode(['status' => 'active']);
    }
} else {
    error_log('No session found');
    echo json_encode(['status' => 'no_session']);
} 