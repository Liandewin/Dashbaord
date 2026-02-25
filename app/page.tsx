import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-white mb-4">
        Your App Name Here
      </h1>
      <p className="text-xl text-white/70 max-w-md mb-8">
        A short description of what your app does. Keep it simple and compelling.
      </p>
      <div className="flex items-start gap-2">
        <Button variant="outline">
          Get Started
        </Button>
      </div>
    </main>
  );
}