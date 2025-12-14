import { Clock, TrendingUp, CheckCircle } from "lucide-react"

export function Benefits() {
  const benefits = [
    {
      icon: Clock,
      title: "Save time",
      description: "Reduce UX review cycles from weeks to minutes.",
    },
    {
      icon: TrendingUp,
      title: "Improve design quality",
      description: "Leverage AI-driven insights to elevate user experience.",
    },
    {
      icon: CheckCircle,
      title: "Eliminate manual reviews",
      description: "Automated analysis replaces tedious, error-prone manual processes.",
    },
  ]

  return (
    <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
      <div className="container relative mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex flex-col items-start">
              <div className="mb-4 rounded-lg bg-accent/10 p-3">
                <benefit.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold">{benefit.title}</h3>
              <p className="mt-2 text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}