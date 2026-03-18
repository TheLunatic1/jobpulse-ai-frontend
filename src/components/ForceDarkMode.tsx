// src/components/ForceDarkMode.tsx
'use client';

import { useEffect } from 'react';

export default function ForceDarkMode() {
  useEffect(() => {
    // Set data-theme="dark" on html element
    document.documentElement.setAttribute('data-theme', 'dark');
    
    // Optional: also add class 'dark' for any legacy dark: variants
    document.documentElement.classList.add('dark');
    
    // Prevent flash of light theme
    document.documentElement.style.colorScheme = 'dark';
  }, []);

  return null;
}