import React from 'react';

export default function Card({ children, className = '', ...props }) {
    return (
        <div className={`glass-panel rounded-2xl p-6 ${className}`} {...props}>
            {children}
        </div>
    );
}
