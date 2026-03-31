import { GalleryVerticalEnd, ArrowLeft } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import Link from 'next/link';

export default function LoginPage() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="size-4" />
                Back
            </Link>
            <div className="flex w-full max-w-sm flex-col gap-6">
                <a href="#" className="flex items-center gap-2 self-center font-medium">
                    <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <GalleryVerticalEnd className="size-4" />
                    </div>
                    Faith & Growth Tracker
                </a>
                <LoginForm />
            </div>
        </div>
    )
}