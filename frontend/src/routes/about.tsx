import { Heart, ShieldCheck, Sparkles, Target } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import heroImg from "@/assets/hero_pepper_spray.png";

export default About;

function About() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-pink">Our Story</span>
            <h1 className="mt-3 font-display text-4xl font-bold text-navy sm:text-5xl lg:text-6xl">
              By Women, For Women.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-navy/75">
              Shesafein is a women proprietorship firm born from a simple belief — every woman deserves
              to move through the world feeling safe, confident, and seen. We blend trusted safety
              products with expert-led education to make that belief a daily reality.
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-[3rem] bg-gradient-to-br from-pink-soft to-blue-50 blur-2xl" />
            <img src={heroImg} alt="Shesafein Mission" className="rounded-[2.5rem] w-full drop-shadow-2xl" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          <Card icon={Target} title="Vision">
            To earn the trust of one million women in India by 2029 as the leading provider of
            reliable and sustainable safety solutions, by women for women.
          </Card>
          <Card icon={Heart} title="Mission">
            Mentored and led by occupational safety experts, our mission is to:
            <ol className="mt-3 space-y-2 text-sm text-navy/80">
              <li>1. Deliver women's safety products and risk-free solutions.</li>
              <li>2. Provide expert-led safety awareness programs to educate, train, and build awareness for women.</li>
            </ol>
          </Card>
        </div>

        <div className="mt-6 rounded-3xl border border-pink/30 bg-gradient-to-br from-pink-soft to-background p-8 sm:p-10">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-pink text-white"><ShieldCheck className="h-6 w-6" /></span>
            <div>
              <h3 className="font-display text-2xl font-bold text-navy">Policy Statement</h3>
              <p className="mt-3 text-navy/80 leading-relaxed">
                <em>“By women, for women: We commit to protecting and earning the trust of one
                million women in India by 2029 through women's safety products, risk-free
                solutions, and expert-led safety awareness programs delivered by occupational
                safety experts.”</em>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-6 text-center md:grid-cols-3">
          {[
            { k: "25+", v: "Years of mentorship" },
            { k: "1M", v: "Women by 2029" },
            { k: "100%", v: "Woman-led" },
          ].map((s) => (
            <div key={s.k} className="rounded-3xl border border-border/60 bg-card p-8">
              <p className="font-display text-4xl font-bold text-pink">{s.k}</p>
              <p className="mt-1 text-navy/70">{s.v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <Sparkles className="mx-auto h-8 w-8 text-pink" />
        <p className="mt-4 font-display text-2xl font-semibold leading-snug text-navy sm:text-3xl">
          Safety isn't a luxury — it's a right. Shesafein exists to make it the standard.
        </p>
      </section>
    </SiteLayout>
  );
}

function Card({ icon: Icon, title, children }: { icon: typeof Heart; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border/60 bg-card p-8">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-pink-soft text-pink"><Icon className="h-6 w-6" /></span>
      <h3 className="mt-4 font-display text-2xl font-bold text-navy">{title}</h3>
      <div className="mt-3 text-navy/80 leading-relaxed">{children}</div>
    </div>
  );
}
