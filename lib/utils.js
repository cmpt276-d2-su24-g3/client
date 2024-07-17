import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import Cookies from 'js-cookie';

export function cn(...inputs) {
  return twMerge(clsx(inputs))
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

export function isAuthorized() {
  return (Cookies.get("id_token") != null)
}
 
export function isAdmin() {
  const token = Cookies.get('id_token');
  console.log(jwtDecode(token));
  const decoded = jwtDecode(token);
  console.log(decoded['cognito:groups'] && Array.isArray(decoded['cognito:groups']) && decoded['cognito:groups'].includes('admin'));
  return (decoded['cognito:groups'] && Array.isArray(decoded['cognito:groups']) && decoded['cognito:groups'].includes('admin'));
}