import { NextResponse } from 'next/server'
import { Retell } from "retell-sdk"

export async function POST(request: Request) {
  const body = await request.json()
  const signature = request.headers.get('x-retell-signature') as string

  if (!Retell.verify(JSON.stringify(body), process.env.RETELL_API_KEY!, signature)) {
    console.error("Invalid signature")
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const { event, call } = body

  switch (event) {
    case "call_started":
      console.log("Call started event received", call.call_id)
      // Update call status in your database or state management
      break
    case "call_ended":
      console.log("Call ended event received", call.call_id)
      // Update call status and duration in your database or state management
      break
    case "call_analyzed":
      console.log("Call analyzed event received", call.call_id)
      // Update call summary in your database or state management
      break
    default:
      console.log("Received an unknown event:", event)
  }

  return NextResponse.json({ received: true }, { status: 200 })
}