import React from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { Button, Typography, Card } from '@/components'

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <Card variant="elevated" padding="lg" className="max-w-md w-full text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-cp-negative/10 text-cp-negative mx-auto flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <Typography variant="h2">Page Under Construction</Typography>
        <Typography variant="body" color="secondary">
          This route will be implemented in subsequent development steps. The foundation design system and layout are active.
        </Typography>
        <Link to="/" className="inline-block pt-2">
          <Button variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Return to Design System
          </Button>
        </Link>
      </Card>
    </div>
  )
}

export default NotFound
