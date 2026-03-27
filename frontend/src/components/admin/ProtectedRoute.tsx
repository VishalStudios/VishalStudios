import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');

    if (!isLoggedIn) {
        return <Navigate to="/admin/login" replace />;
    }

    return <>{children}</>;
}
