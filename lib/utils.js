import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export async function loadConfig() {
  try {
    const response = await fetch('/config.json');  // Ensure this is the correct path
    const config = await response.json();
    return config;
  } catch (error) {
    console.error('Error loading config:', error);
    return {};
  }
}

export function memoize(fn) {
  const cache = new Map()
  const cached = function (val) {
    return cache.has(val)
      ? cache.get(val)
      : cache.set(val, fn.call(this, val)) && cache.get(val)
  }
  cached.cache = cache
  return cached
}

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

export const range = (x, x1, y1, x2, y2) =>
  ((x - x1) * (y2 - x2)) / (y1 - x1) + x2
