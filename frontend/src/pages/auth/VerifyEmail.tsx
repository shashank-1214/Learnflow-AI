import React from "react"
import { Link, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MailCheck } from "lucide-react"

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get("email") || "your email"

  return (
    <Card className="border-0 shadow-none bg-transparent text-center">
      <CardHeader className="px-0 pt-0 flex flex-col items-center">
        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <MailCheck className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-3xl font-semibold tracking-tight">
          Check your email
        </CardTitle>
        <CardDescription className="text-base mt-2 max-w-sm">
          We sent a verification link to <span className="font-medium text-foreground">{email}</span>. Please click the link to verify your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 mt-4">
        <div className="space-y-4">
          <Button variant="outline" className="w-full">
            Open Email App
          </Button>
          <div className="text-sm text-muted-foreground mt-8">
            Didn't receive the email?{" "}
            <button className="font-medium text-primary hover:underline bg-transparent border-none p-0 cursor-pointer">
              Click to resend
            </button>
          </div>
          <div className="pt-6">
            <Link to="/auth/login" className="text-sm font-medium text-primary hover:underline">
              ← Back to login
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
