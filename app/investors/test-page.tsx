'use client'

export default function TestPage() {
  return (
    <div className="min-h-screen bg-white pt-24 flex items-center justify-center">
      <div className="text-center px-4">
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#1A3C40', marginBottom: '1rem' }}>
          Test Headline Size
        </h1>
        <p style={{ fontSize: '1.5rem', color: '#666' }}>
          This is 3rem (48px) on mobile
        </p>
        <div className="mt-8 space-y-4">
          <div style={{ fontSize: '2rem' }}>2rem (32px)</div>
          <div style={{ fontSize: '2.5rem' }}>2.5rem (40px)</div>
          <div style={{ fontSize: '3rem' }}>3rem (48px)</div>
          <div style={{ fontSize: '3.5rem' }}>3.5rem (56px)</div>
          <div style={{ fontSize: '4rem' }}>4rem (64px)</div>
        </div>
      </div>
    </div>
  )
}