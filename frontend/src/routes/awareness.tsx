import { useState } from "react";
import { Award, CalendarCheck, GraduationCap, Users } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { HeroSlider } from "@/components/HeroSlider";
import awarenessImg from "@/assets/awareness.jpg";
import heroImg from "@/assets/hero_pepper_spray.png";

export default Awareness;

function Awareness() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <SiteLayout>
      <HeroSlider />


      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-pink">Awareness Programs</span>
            <h1 className="mt-3 font-display text-4xl font-bold text-navy sm:text-5xl">Knowledge is the strongest defense.</h1>
            <p className="mt-4 text-navy/75">
              Our expert-led training equips women, students and professionals with practical
              safety skills — from situational awareness to confident response. Mentored by an
              Indian occupational safety specialist with <strong className="text-pink">25+ years</strong>
              of field expertise.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { icon: GraduationCap, title: "Expert-Led Sessions" },
                { icon: Users, title: "For Groups & Individuals" },
                { icon: Award, title: "25+ Years Mentorship" },
                { icon: CalendarCheck, title: "Flexible Scheduling" },
              ].map(({ icon: Icon, title }) => (
                <div key={title} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-pink-soft text-pink"><Icon className="h-5 w-5" /></span>
                  <span className="font-medium text-navy">{title}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-[3rem] bg-pink/20 blur-3xl" />
            <img src={awarenessImg} alt="Safety awareness workshop" loading="lazy" width={1280} height={896} className="w-full rounded-[2rem] object-cover shadow-soft" />
          </div>
        </div>
      </section>

      {/* BOOKING FORM */}
      <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-6 sm:p-10">
          <h2 className="font-display text-3xl font-bold text-navy">Book a Program</h2>
          <p className="mt-2 text-navy/70">Tell us about your group and we'll design a session tailored to your needs.</p>
          {submitted ? (
            <div className="mt-6 rounded-2xl bg-pink-soft p-6 text-center">
              <p className="font-display text-xl font-semibold text-navy">Thank you! 💌</p>
              <p className="mt-1 text-sm text-navy/70">We'll reach out within 24 hours to confirm your booking.</p>
            </div>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
              className="mt-6 grid gap-4 sm:grid-cols-2"
            >
              <Field label="Full Name" name="name" required />
              <Field label="Organisation" name="org" />
              <Field label="Email" name="email" type="email" required />
              <Field label="Phone" name="phone" type="tel" required />
              <Field label="Preferred Date" name="date" type="date" />
              <Field label="Group Size" name="size" type="number" placeholder="e.g. 30" />
              <label className="sm:col-span-2 flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-navy">Tell us about your goals</span>
                <textarea name="message" rows={4} className="rounded-2xl border border-input bg-background px-4 py-3 text-navy outline-none transition focus:border-pink focus:ring-2 focus:ring-pink/30" />
              </label>
              <button type="submit" className="btn-pink sm:col-span-2 mt-2 rounded-full py-3.5 font-semibold">
                Request Booking
              </button>
            </form>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({ label, name, type = "text", required, placeholder }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-navy">{label}{required && <span className="text-pink"> *</span>}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="rounded-2xl border border-input bg-background px-4 py-3 text-navy outline-none transition focus:border-pink focus:ring-2 focus:ring-pink/30"
      />
    </label>
  );
}
