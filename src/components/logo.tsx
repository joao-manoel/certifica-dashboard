'use client'
import { Anton } from 'next/font/google'
import Image from 'next/image'
import LogoIcon from '@/assets/images/certifica-icon-verde.png'
const _anton = Anton({ subsets: ['latin'], weight: '400' })

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
}

export default function Logo({ size = 'md' }: LogoProps) {
  return (
    <>
      <div
        className={`${
          size === 'lg' ? 'w-12 h-12' : size === 'md' ? 'w-10 h-10' : 'w-8 h-8'
        } flex items-center justify-center -mt-2`}
      >
        <Image
          src={LogoIcon}
          alt="Certifica"
          width={20}
          height={20}
          className={`${
            size === 'lg'
              ? 'w-12 h-12'
              : size === 'md'
              ? 'w-10 h-10'
              : 'w-8 h-8'
          }`}
          priority
        />
      </div>
      <div className="flex flex-col leading-tight text-[#406054]">
        <span
          className={`${
            size === 'lg' ? 'text-7xl' : size === 'md' ? 'text-4xl' : 'text-3xl'
          } font-bold uppercase ${_anton.className}`}
        >
          Certifica
        </span>
        <span
          className={`uppercase ${
            size === 'lg'
              ? 'text-[14px]'
              : size === 'md'
              ? 'text-[10px]'
              : 'text-[8px]'
          }`}
        >
          Engenharia e Avaliações
        </span>
      </div>
    </>
  )
}
