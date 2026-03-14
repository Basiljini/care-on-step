// app/api/sendStaffMail/route.ts
import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: NextRequest) {
  try {
    const { fullName, dob } = await req.json()

    if (!fullName || !dob) {
      return NextResponse.json(
        { error: "Missing fullName or dob" },
        { status: 400 }
      )
    }

    // Create transporter (Gmail example)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // your email to receive notifications
      subject: " Staff Removal Request",
      html: `<p><strong>Full Name:</strong> ${fullName}</p>
             <p><strong>DOB:</strong> ${dob}</p>`,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("removeStaff error:", err)
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    )
  }
}