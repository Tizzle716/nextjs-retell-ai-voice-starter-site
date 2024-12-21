import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Check your email</CardTitle>
          <CardDescription>
            We&apos;ve sent you a verification link. Please check your email to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              We&apos;ve sent you an email
            </h1>
            <p className="text-sm text-muted-foreground">
              Please check your inbox and click the verification link to verify your email. If you don&apos;t see the email, please check your spam folder.
            </p>
            <p className="text-sm text-muted-foreground">
              Haven&apos;t received an email? Please try again in a few minutes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
