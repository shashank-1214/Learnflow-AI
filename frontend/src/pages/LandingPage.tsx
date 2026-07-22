import React from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { UploadCloud, BookOpen, BrainCircuit, Zap, CheckCircle2, FileText, FileAudio, FileVideo } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Premium Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-background -z-10" />
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none -z-10" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            LearnFlow AI is now in early access
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-foreground max-w-4xl mx-auto leading-tight"
          >
            Upload Anything. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Learn Everything.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            The world's most advanced AI study companion. Transform your lectures, PDFs, and notes into interactive study sessions in seconds.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" className="rounded-full w-full sm:w-auto px-8 text-base h-14" asChild>
              <Link to="/auth/register">Start Learning Free</Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full w-full sm:w-auto px-8 text-base h-14 bg-white/50 backdrop-blur-sm">
              See How It Works
            </Button>
          </motion.div>
        </div>
      </section>

      {/* 2. Animated Upload Box */}
      <section className="pb-24 pt-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto rounded-3xl p-1 bg-gradient-to-b from-border/50 to-transparent shadow-premium"
          >
            <div className="bg-card rounded-[23px] overflow-hidden">
              <div className="p-8 md:p-12 text-center border-b border-border/50 bg-muted/30">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <UploadCloud className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">Drag and drop your materials</h3>
                <p className="text-muted-foreground mb-8">PDFs, Word Docs, PowerPoints, Audio, or Video</p>
                
                <div className="flex flex-wrap justify-center gap-3">
                  <div className="flex items-center gap-2 bg-background px-4 py-2 rounded-full text-sm border shadow-sm">
                    <FileText className="w-4 h-4 text-blue-500" /> Syllabus.pdf
                  </div>
                  <div className="flex items-center gap-2 bg-background px-4 py-2 rounded-full text-sm border shadow-sm">
                    <FileAudio className="w-4 h-4 text-purple-500" /> Lecture_03.mp3
                  </div>
                  <div className="flex items-center gap-2 bg-background px-4 py-2 rounded-full text-sm border shadow-sm">
                    <FileVideo className="w-4 h-4 text-red-500" /> Math_Tutorial.mp4
                  </div>
                </div>
              </div>
              <div className="bg-background p-6 flex items-center justify-between">
                 <div className="flex -space-x-2">
                   {[1, 2, 3, 4].map((i) => (
                     <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                       U{i}
                     </div>
                   ))}
                 </div>
                 <div className="text-sm font-medium text-muted-foreground">
                   Trusted by 10,000+ students globally
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section id="features" className="py-24 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Supercharge your studies</h2>
            <p className="text-lg text-muted-foreground">Everything you need to master complex topics in half the time.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <BrainCircuit className="w-6 h-6 text-primary" />,
                title: "Instant Summaries",
                description: "Get concise, accurate summaries of any document instantly. Focus on what matters."
              },
              {
                icon: <Zap className="w-6 h-6 text-accent" />,
                title: "Smart Flashcards",
                description: "Automatically generate flashcards from your notes and let spaced repetition handle the rest."
              },
              {
                icon: <BookOpen className="w-6 h-6 text-secondary" />,
                title: "Interactive Q&A",
                description: "Chat directly with your documents. Ask questions and get cited answers instantly."
              }
            ].map((feature, i) => (
              <Card key={i} className="bg-background border-border/50 shadow-sm hover:shadow-premium-hover transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. How It Works */}
      <section id="how-it-works" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">How it works</h2>
            <p className="text-lg text-muted-foreground">Three simple steps to transform the way you learn.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20 -z-10" />
            
            {[
              { step: "01", title: "Upload", desc: "Drag and drop any study material into the platform." },
              { step: "02", title: "Analyze", desc: "Our AI processes and understands the context perfectly." },
              { step: "03", title: "Learn", desc: "Start chatting, taking quizzes, and reviewing flashcards." }
            ].map((item, i) => (
              <div key={i} className="text-center relative">
                <div className="w-16 h-16 rounded-full bg-background border-2 border-primary text-primary flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-sm">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Testimonials */}
      <section className="py-24 bg-foreground text-background rounded-[3rem] mx-4 md:mx-8 mb-24 overflow-hidden relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8888882e_1px,transparent_1px),linear-gradient(to_bottom,#8888882e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Loved by students</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { quote: "This app literally saved my GPA. I can digest 100-page readings in 15 minutes.", author: "Sarah J.", role: "Law Student" },
              { quote: "The flashcard generation is magic. It knows exactly what will be on the exam.", author: "Michael T.", role: "Med Student" },
              { quote: "I upload my professor's confusing audio lectures and get perfect notes back.", author: "Emily R.", role: "Comp Sci Major" }
            ].map((t, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-background/10 backdrop-blur-md p-8 rounded-2xl border border-background/20"
              >
                <div className="flex text-accent mb-4">
                  {[...Array(5)].map((_, j) => <svg key={j} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}
                </div>
                <p className="text-lg leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-background/20"></div>
                  <div>
                    <div className="font-medium">{t.author}</div>
                    <div className="text-sm opacity-70">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Pricing Preview */}
      <section id="pricing" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-muted-foreground">Start for free, upgrade when you need more power.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <Card className="border-border/50 p-8 shadow-sm">
              <h3 className="text-2xl font-bold mb-2">Basic</h3>
              <div className="text-muted-foreground mb-6">For casual learners</div>
              <div className="text-4xl font-bold mb-8">$0<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8">
                {['5 documents per month', 'Basic summaries', 'Standard support'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" /> {feature}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/auth/register">Get Started</Link>
              </Button>
            </Card>

            {/* Pro Tier */}
            <Card className="border-primary/50 p-8 shadow-premium relative overflow-hidden bg-primary/5">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold rounded-bl-lg">POPULAR</div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="text-muted-foreground mb-6">For serious students</div>
              <div className="text-4xl font-bold mb-8">$12<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8">
                {['Unlimited documents', 'Advanced AI models (GPT-4)', 'Video/Audio processing', 'Priority support'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" /> {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full" asChild>
                <Link to="/auth/register">Upgrade to Pro</Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section id="faq" className="py-24 bg-muted/30 border-t border-border/50">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-6">
            {[
              { q: "What types of files can I upload?", a: "You can upload PDFs, Word documents, PowerPoints, plain text, and even audio or video files. Our system will transcribe and analyze them all." },
              { q: "Is there a limit on file size?", a: "Free users can upload files up to 10MB. Pro users can upload files up to 100MB, including hour-long lecture videos." },
              { q: "How accurate are the answers?", a: "Very accurate. We use state-of-the-art RAG architecture, meaning every answer the AI gives is directly cited from the documents you uploaded, preventing hallucinations." }
            ].map((faq, i) => (
              <div key={i} className="bg-background border rounded-xl p-6 shadow-sm">
                <h4 className="text-lg font-semibold mb-2">{faq.q}</h4>
                <p className="text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
