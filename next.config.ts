// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheLife: {
    // perfis reutilizáveis (exemplos)
    mutation: { revalidate: 0 }, // invalida imediatamente
    short: { revalidate: 60 }, // 1 min
    long: { revalidate: 60 * 60 } // 1 hora
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**' // aceita qualquer hostname HTTPS
      }
    ]
  }
}

export default nextConfig
