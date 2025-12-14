"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-accent/10 via-background to-background p-12 text-center shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">Join the design revolution</h2>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
              Be among the first to transform your design workflow with AI-powered UX insights.
            </p>

            <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
              <Input
                type="email"
                placeholder="Enter your email"
                className="h-12 rounded-full bg-background/50 backdrop-blur"
              />
              <Button size="lg" className="rounded-full bg-primary px-8 text-primary-foreground hover:bg-primary/90">
                Join waitlist
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              By clicking Sign Up you&apos;re confirming that you agree with our Terms and Conditions.
            </p>

            <div className="mt-12">
              <p className="text-sm text-muted-foreground">Trusted by the world&apos;s best companies</p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-8 opacity-60 grayscale">
                {["Webflow", "Relume", "Figma", "Notion", "Linear", "Framer"].map((company) => (
                  <div key={company} className="text-sm font-semibold">
                    {company}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}