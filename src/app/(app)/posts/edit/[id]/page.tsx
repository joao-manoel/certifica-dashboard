import { notFound } from 'next/navigation'
import { EditPostForm } from './edit-post-form'
import { getPostById } from '@/http/get-post-by-id'

type Params = { id: string }

export default async function EditPostPage(props: { params: Promise<Params> }) {
  const { id } = await props.params

  let post: Awaited<ReturnType<typeof getPostById>>
  try {
    post = await getPostById(id)
  } catch {
    notFound()
  }

  if (!post) notFound()

  return (
    <div className="space-y-6">
      <EditPostForm
        post={{
          id: post.id,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          coverId: post.coverId,
          coverUrl: post.coverUrl ?? null,
          status: post.status,
          visibility: post.visibility,
          scheduledFor: post.scheduledFor,
          categories: post.categories ?? [],
          tags: post.tags ?? []
        }}
      />
    </div>
  )
}
