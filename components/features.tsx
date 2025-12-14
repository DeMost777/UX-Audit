import { Upload, Zap, Target } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: Upload,
      title: "Upload your design files",
      description: "Seamlessly import Figma JSON or PNG files with a single click.",
    },
    {
      icon: Zap,
      title: "Instant AI-powered audit",
      description: "Receive comprehensive UX evaluation in seconds, not weeks.",
    },
    {
      icon: Target,
      title: "Prioritized recommendations",
      description: "Get targeted suggestions ranked by potential impact on user experience.",
    },
  ]

  return (
    <section id="features" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">Features</p>
          <h2 className="mt-3 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Powerful AI analysis for your design workflow
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
            Flow UX AI transforms complex design challenges into clear, actionable insights. Our machine learning engine
            cuts through design noise with surgical precision.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative rounded-2xl border border-border bg-card p-8 transition-all hover:border-accent/50 hover:shadow-lg"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="mt-2 text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}