import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth();
  
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="px-4 lg:px-6 h-20 flex items-center border-b bg-white dark:bg-slate-950 shadow-sm">
        <Link className="flex items-center justify-center gap-2" href="/">
          <div className="bg-primary text-white p-2 rounded-lg font-bold text-xl">
            Agentify
          </div>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          {userId ? (
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
          ) : (
            <Link href="/sign-in">
              <Button variant="outline">Sign In</Button>
            </Link>
          )}
          <UserButton />
        </nav>
      </header>
      
      <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-white to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4 max-w-3xl">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  Build AI Agents <br />
                  <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
                    Without Code
                  </span>
                </h1>
                <p className="mx-auto max-w-[700px] text-slate-600 md:text-xl dark:text-slate-400">
                  Create, customize, and deploy intelligent AI assistants for your business in minutes. The easiest way to build your AI workforce.
                </p>
              </div>
              <div className="space-x-4 flex items-center justify-center gap-4">
                <Link href={userId ? "/dashboard" : "/sign-in"}>
                  <Button size="lg" className="h-14 px-8 text-lg font-medium shadow-lg hover:shadow-xl transition-all">
                    Get Started for Free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
