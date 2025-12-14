"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent">
                <svg
                  className="h-5 w-5 text-accent-foreground"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-lg font-semibold">Flow UX AI</span>
            </div>
            <div className="mt-6">
              <p className="text-sm font-semibold">Newsletter</p>
              <div className="mt-3 flex gap-2">
                <Input type="email" placeholder="Enter email" className="h-10" />
                <Button className="h-10 rounded-full">Subscribe</Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                By subscribing, you agree to our privacy policy and consent to receive product updates.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:col-span-8 lg:grid-cols-4">
            <div>
              <h3 className="font-semibold">Product</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="transition-colors hover:text-foreground">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-foreground">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold">Resources</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="transition-colors hover:text-foreground">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-foreground">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold">Company</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="transition-colors hover:text-foreground">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-foreground">
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold">Legal</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="transition-colors hover:text-foreground">
                    Privacy policy
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-foreground">
                    Terms of service
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-foreground">
                    Cookie settings
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 Flow UX AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}