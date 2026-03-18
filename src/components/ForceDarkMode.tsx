'use client';

import { useEffect } from 'react';

export default function ForceDarkMode() {
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('data-theme', 'dark');
    html.classList.add('dark');
    html.style.colorScheme = 'dark';
  }, []);

  return null;
}