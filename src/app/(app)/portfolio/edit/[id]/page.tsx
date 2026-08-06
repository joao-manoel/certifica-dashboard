import PortfolioForm from '../../portfolio-form'
export default async function EditPortfolioPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <PortfolioForm projectId={id} /> }
