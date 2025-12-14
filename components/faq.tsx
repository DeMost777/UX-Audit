import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQ() {
  const faqs = [
    {
      question: "How secure is my design data?",
      answer:
        "We use bank-grade encryption to protect your design files. All uploads are processed privately and securely. No human eyes review your confidential work.",
    },
    {
      question: "What file types are supported?",
      answer:
        "Flow UX AI currently supports Figma JSON and PNG files. We're continuously expanding our file type compatibility to serve more design workflows.",
    },
    {
      question: "How accurate are the AI insights?",
      answer:
        "Our machine learning models are trained on thousands of professional design examples. Insights are data-driven and benchmarked against industry UX standards.",
    },
    {
      question: "Is there a pricing plan?",
      answer:
        "We offer flexible pricing for teams of all sizes. Early adopters can expect special introductory rates and comprehensive beta testing options.",
    },
    {
      question: "Can I cancel anytime?",
      answer:
        "Absolutely. We provide transparent, commitment-free subscriptions. You can pause or cancel your account without any hidden fees or long-term contracts.",
    },
  ]

  return (
    <section id="faq" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">FAQs</h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Get clarity on how Flow UX AI transforms your design workflow with intelligent insights.
          </p>
        </div>

        <Accordion type="single" collapsible className="mt-12">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-lg font-semibold">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}