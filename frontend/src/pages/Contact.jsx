import { useState } from 'react';
import { Send, Mail, User, MessageSquare, CheckCircle2, Users, Briefcase } from 'lucide-react';

const teamMembers = [
  {
    name: "Rushikesh Sunil Patil",
    role: "Lead Developer",
    prn: "2251641245016",
    responsibilities: "Deployment & Infrastructure, Backend Architecture, ML Models"
  },
  {
    name: "Jay Kailas Patil",
    role: "Frontend Developer",
    prn: "",
    responsibilities: "Model Training & Dataset Management"
  },
  {
    name: "Kalpesh Madhav Patil",
    role: "Data Scientist",
    prn: "",
    responsibilities: "UI/UX & React Development"
  },
  {
    name: "Ghanshyam Hiralal Patil",
    role: "DevOps Engineer",
    prn: "",
    responsibilities: "UI/UX & React Development"
  }
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-20">
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          {/* Header */}
          <div className="text-center mb-12 fade-in">
            <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4 font-[family-name:var(--font-family-heading)]">
              Get in <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              Have a question, feedback, or partnership idea? We'd love to hear from you.
            </p>
          </div>

          {submitted ? (
            <div className="neu-container-lg p-12 text-center fade-in">
              <div className="clay-icon-success !w-20 !h-20 !rounded-full mx-auto mb-6">
                <CheckCircle2 size={40} className="text-white" />
              </div>
              <h2 className="font-[family-name:var(--font-family-heading)] text-2xl font-bold text-text-primary mb-3">
                Message Sent!
              </h2>
              <p className="text-text-secondary mb-6">
                Thank you for reaching out. We'll get back to you as soon as possible.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name: '', email: '', message: '' });
                }}
                className="px-6 py-2.5 rounded-[16px] text-text-secondary font-semibold neu-container-sm hover:text-text-primary transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="neu-container-lg p-8 space-y-6 fade-in fade-in-delay-1">
              {/* Name */}
              <div>
                <label htmlFor="contact-name" className="block text-sm font-semibold text-text-secondary mb-2">
                  <User size={14} className="inline mr-1.5" />
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="neu-input"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="contact-email" className="block text-sm font-semibold text-text-secondary mb-2">
                  <Mail size={14} className="inline mr-1.5" />
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="neu-input"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="contact-message" className="block text-sm font-semibold text-text-secondary mb-2">
                  <MessageSquare size={14} className="inline mr-1.5" />
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Tell us what's on your mind..."
                  className="neu-input resize-none"
                />
              </div>

              <button
                id="contact-submit-btn"
                type="submit"
                className="animated-compare-btn w-full"
              >
                <div className="btn-content justify-center">
                  <Send size={20} />
                  <span>Send Message</span>
                </div>
              </button>
            </form>
          )}

          {/* Info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 fade-in fade-in-delay-2">
            <div className="neu-container p-6 text-center">
              <div className="clay-icon !w-12 !h-12 !rounded-full mx-auto mb-3">
                <Mail size={20} className="text-white" />
              </div>
              <h3 className="text-text-primary font-semibold mb-1">Email</h3>
              <p className="text-text-secondary text-sm">contact@kinvision.ai</p>
            </div>
            <div className="neu-container p-6 text-center">
              <div className="clay-icon-purple !w-12 !h-12 !rounded-full mx-auto mb-3">
                <MessageSquare size={20} className="text-white" />
              </div>
              <h3 className="text-text-primary font-semibold mb-1">Response Time</h3>
              <p className="text-text-secondary text-sm">Within 24 hours</p>
            </div>
          </div>

          {/* Team Section */}
          <div className="mt-16 fade-in shadow-2xl neu-container p-8 border border-white/5 bg-surface-base">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center space-x-2 mb-3">
                <Users size={28} className="text-primary-violet" />
                <h2 className="text-3xl font-bold text-text-primary font-[family-name:var(--font-family-heading)]">
                  Technical <span className="gradient-text">Expert Team</span>
                </h2>
              </div>
              <p className="text-text-secondary text-base">
                Meet the minds behind our kinVision technology.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teamMembers.map((member, idx) => (
                <div key={idx} className="neu-container-sm p-6 relative overflow-hidden group transition-all duration-300 hover:scale-[1.02]">
                  {/* Subtle background glow effect on hover */}
                  <div className="absolute -inset-4 bg-gradient-to-tr from-primary-violet/10 to-primary-teal/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl z-0" />
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <h3 className="text-xl font-bold text-text-primary mb-2 tracking-tight group-hover:text-white transition-colors">{member.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg bg-surface-darker text-primary-violet border border-white/5 shadow-inner">
                        {member.role}
                      </span>
                      {member.prn && (
                        <span className="px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-lg bg-black/20 text-text-muted border border-white/5">
                          PRN: <span className="text-text-primary">{member.prn}</span>
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-white/5">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-text-secondary mb-2 flex items-center">
                        <Briefcase size={12} className="mr-1.5" /> Focus Areas
                      </p>
                      <p className="text-sm font-medium text-text-muted leading-relaxed">
                        {member.responsibilities}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
