import { Plus } from 'lucide-react'
import Link from 'next/link'

import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import PortfolioManager from './portfolio-manager'

export default function PortfolioPage() {
  return <div className="space-y-6"><PageHeader title="Portfólio" description="Gerencie projetos, galerias e categorias exibidos no site." action={<Button asChild><Link href="/portfolio/create"><Plus className="size-4" />Novo projeto</Link></Button>} /><PortfolioManager /></div>
}
