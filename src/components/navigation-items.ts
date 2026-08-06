import {
  BookOpenText,
  BriefcaseBusiness,
  FileText,
  Globe,
  Images,
  KeyRound,
  LayoutDashboard,
  Users
} from 'lucide-react'

export const primaryNavigation = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Publicações', href: '/posts', icon: FileText },
  { label: 'Portfólio', href: '/portfolio', icon: BriefcaseBusiness },
  { label: 'Mídia', href: '/media', icon: Images },
  { label: 'Usuários', href: '/users', icon: Users, adminOnly: true },
  { label: 'Integrações', href: '/integrations', icon: KeyRound }
] as const

export const externalNavigation = [
  { label: 'Site Certifica', href: 'https://certifica.eng.br', icon: Globe },
  {
    label: 'Blog Certifica',
    href: 'https://blog.certifica.eng.br',
    icon: BookOpenText
  }
] as const
