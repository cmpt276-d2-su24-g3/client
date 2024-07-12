export async function resolveHostIp(host) {
  const res = await fetch(`https://dns.google/resolve?name=${host}`)
  const json = await res.json()

  return json.Answer[0].data
}

// TODO: Implement
export async function resolveIpLocation(ip) {
  return {
    latitude: Math.random() * 180 - 90,
    longitude: Math.random() * 360 - 180,
  }
}

// TODO: Implement
export async function resolveClientLocation() {
  return {
    latitude: Math.random() * 180 - 90,
    longitude: Math.random() * 360 - 180,
  }
}

export function isIp(host) {
  return /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)
}
