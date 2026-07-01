import { useState } from "react";
import { Mail, MapPin, Phone, User } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";

export default Contact;

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <header className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-pink">Contact Us</span>
          <h1 className="mt-3 font-display text-4xl font-bold text-navy sm:text-5xl">We'd love to hear from you.</h1>
          <p className="mx-auto mt-4 max-w-2xl text-navy/70">Questions, partnerships, or programs — reach out and we'll respond within 24 hours.</p>
        </header>

        <div className="mt-12 grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-4">
            <InfoCard icon={User} label="Owner" value="M. Savithiri" sub="Age 40 · Founder" />
            <InfoCard icon={MapPin} label="Address" value="40, P&K Gem field avenue, Vellakinar, Coimbatore 641029" />
            <InfoCard icon={Phone} label="Phone" value="9363941141" href="tel:9363941141" />
            <InfoCard icon={Mail} label="Email" value="ms.shesafein@gmail.com" href="mailto:ms.shesafein@gmail.com" />
          </div>

          <div className="glass-card lg:col-span-3 rounded-3xl p-6 sm:p-8">
            {sent ? (
              <div className="rounded-2xl bg-pink-soft p-8 text-center">
                <p className="font-display text-2xl font-semibold text-navy">Message sent! 💌</p>
                <p className="mt-2 text-navy/70">Thank you for reaching out. We'll get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" name="name" required />
                <Field label="Email" name="email" type="email" required />
                <Field label="Phone" name="phone" type="tel" />
                <Field label="Subject" name="subject" />
                <label className="sm:col-span-2 flex flex-col gap-1.5 text-sm">
                  <span className="font-medium text-navy">Message <span className="text-pink">*</span></span>
                  <textarea required name="message" rows={5} className="rounded-2xl border border-input bg-background px-4 py-3 text-navy outline-none transition focus:border-pink focus:ring-2 focus:ring-pink/30" />
                </label>
                <button type="submit" className="btn-pink sm:col-span-2 rounded-full py-3.5 font-semibold">Send Message</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function InfoCard({ icon: Icon, label, value, sub, href }: { icon: typeof Mail; label: string; value: string; sub?: string; href?: string }) {
  const inner = (
    <div className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-5 hover-lift">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-pink-soft text-pink"><Icon className="h-5 w-5" /></span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-pink">{label}</p>
        <p className="mt-0.5 font-medium text-navy">{value}</p>
        {sub && <p className="text-sm text-navy/60">{sub}</p>}
      </div>
    </div>
  );
  return href ? <a href={href}>{inner}</a> : inner;
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-navy">{label}{required && <span className="text-pink"> *</span>}</span>
      <input name={name} type={type} required={required} className="rounded-2xl border border-input bg-background px-4 py-3 text-navy outline-none transition focus:border-pink focus:ring-2 focus:ring-pink/30" />
    </label>
  );
}
