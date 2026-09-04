import SignUpForm from '@/components/sign-up-form'

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const params = await searchParams
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <SignUpForm searchParams={params} />
    </div>
  )
}