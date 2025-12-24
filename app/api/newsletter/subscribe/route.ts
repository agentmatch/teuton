import { NextRequest, NextResponse } from 'next/server'

// MailerLite API configuration
const MAILERLITE_API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiMjM1MWZiZWU2MjM0MWQ5MDUxZTZjODAzYmUxYmY5OGMxZjkxYjYwMTY4YmEyZTUzYzQwNDE0YzNmN2UyMzBjYzYzMWQ1Njc0NjM5Y2U3NmMiLCJpYXQiOjE3NTgxMjQyMzYuMzQ5MzE4LCJuYmYiOjE3NTgxMjQyMzYuMzQ5MzIxLCJleHAiOjQ5MTM3OTc4MzYuMzQxODY5LCJzdWIiOiIxODAzMjk5Iiwic2NvcGVzIjpbXX0.mHKWwLvXBHx4ioEsGs6ni0bOala8oLZkftt4JP8vpLeSb86YZSkM1gRR039SBSceCokR3HxeHn28BYv4Zai5euGDsZl7rk4N4kFlUBCjJHL4xKatMbP_Q7WC_xp_zVbKbIdq9g4FF9ASqIKwv0xjsA3xEk4lkBTqARthILIgRxts-nGinrKmFh0mRhhYpAfDl0EM_sU7eoP2npZJ-EaOxeydiY5-LUwEfodAZCZrB5a8bfOEKn1N9aZZJ0ua1B-CF2qe7A_Zc09EqyX3EYDzFZjZF_xEQ-3ZxPQdYVYU9ExqPDfgRzZ_Opv4I5TFcCrBnS3l_8-ZNam5DWaYIS9zK1o_FdxuuurEvhVwG936VClXbN4hOReyn7SIq0rhK1Wy0dqZ_pvuDEoIgjLDG08_Rap8bFYH-NEftveTmwjN1cQ7QrH3WwdZ54iDXYWyjFFjl9y0aY3W89vAkY5iadQbyxbb5O_ahF0Tv-py10xCV_tyM3pHO_JfscntfYpVL2aghYeOt-vSP8aXm0e3tYk673Olrk3hKjoa5mzrQ2g_Yzob-hALu9ti574QZn6iwBz4lupRi8LTgqhKZwMUZ3ICTcL6EM4VJcbQeeEK6gkEjZAsLhlfCXhP_Z7i30yPa4J5PDu51B2iCHOXexTBDl1YPcSQTYQpSCE0fMba2v9UA74'
const MAILERLITE_API_URL = 'https://connect.mailerlite.com/api'

export async function POST(request: NextRequest) {
  try {
    const { email, source = 'website', type = 'general' } = await request.json()

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'Invalid email format' }, { status: 400 })
    }

    // Add subscriber to MailerLite
    try {
      const response = await fetch(`${MAILERLITE_API_URL}/subscribers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${MAILERLITE_API_KEY}`
        },
        body: JSON.stringify({
          email: email,
          fields: {
            signup_source: source === 'teaser_page' ? 'Teaser Page' : 'Website Footer',
            signup_type: type === 'site_launch' ? 'Site Launch' : 'General Updates',
            signup_date: new Date().toISOString().split('T')[0]
          },
          // You can add groups here if you have them set up in MailerLite
          // groups: ['group_id_here']
        })
      })

      const data = await response.json()

      if (response.ok) {
        console.log('MailerLite subscription successful:', { email, source, type })
        return NextResponse.json({ 
          success: true, 
          message: 'Thank you! We\'ll notify you when we launch.',
          subscriber_id: data.data?.id
        })
      } else {
        console.error('MailerLite API error:', data)
        
        // Handle specific MailerLite errors
        if (data.message?.includes('already exists') || data.errors?.email?.includes('already exists')) {
          // If email already exists, still return success (they want updates anyway)
          return NextResponse.json({ 
            success: true,
            message: 'Thank you! You\'re already on our list and will be notified.'
          })
        }

        if (data.errors?.email) {
          return NextResponse.json({ 
            message: 'Invalid email address. Please check and try again.'
          }, { status: 400 })
        }

        return NextResponse.json({ 
          message: 'Failed to subscribe. Please try again later.'
        }, { status: 500 })
      }

    } catch (fetchError) {
      console.error('MailerLite fetch error:', fetchError)
      
      // Log the signup attempt even if API fails
      console.log('Email signup attempt (API failed):', { 
        email, 
        source, 
        type, 
        timestamp: new Date().toISOString() 
      })
      
      // Return success to user even if API fails (we logged it)
      return NextResponse.json({ 
        success: true, 
        message: 'Thank you! We\'ll notify you when we launch.'
      })
    }

  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json({ 
      message: 'Failed to process subscription. Please try again later.'
    }, { status: 500 })
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}