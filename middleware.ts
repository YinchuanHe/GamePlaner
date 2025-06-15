import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      if (!token) return false
      const path = req.nextUrl.pathname
      if (path.startsWith('/manage') || path.startsWith('/api/users') || path.startsWith('/api/clubs') || path.startsWith('/api/events')) {
        return token.role === 'super-admin'
      }
      if (path.startsWith('/event-edit')) {
        return token.role === 'super-admin' || token.role === 'admin'
      }
      return true
    }
  }
})

export const config = {
  matcher: ['/profile', '/manage', '/event-edit', '/api/profile', '/api/users/:path*', '/api/clubs/:path*', '/api/events/:path*']
}
