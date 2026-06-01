import { createFileRoute } from '@tanstack/react-router'
import { TwoFactorPage } from '../components/auth/TwoFactorPage'

export const Route = createFileRoute('/2fa')({
  component: TwoFactorPage,
})
