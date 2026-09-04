import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Shield, Trophy, Users, Gamepad2, Award, HelpCircle, MessageCircle, Zap, BookOpen } from 'lucide-react';

const Rules = () => {
  const rules = [
    {
      icon: <Shield className="w-5 h-5 text-gold flex-shrink-0" />,
      title: 'General Rules',
      items: [
        'All players must register with their full name and valid WhatsApp number.',
        'Each player may only register for one tournament at a time.',
        'Tournament slots are limited and filled on a first-come, first-served basis.',
        'Players must be present at the venue 15 minutes before the scheduled start time.',
        'Use of any cheat software or exploits is strictly prohibited and will result in immediate disqualification.'
      ]
    },
    {
      icon: <Gamepad2 className="w-5 h-5 text-gold flex-shrink-0" />,
      title: 'Tournament Format',
      items: [
        'Matches are played on PlayStation 4 (PS4) using the latest EA FC title.',
        'Tournament brackets are randomly generated after registration closes.',
        'All matches are single elimination unless otherwise specified.',
        'Each match is a single game with standard settings (6 minutes halves, no extra time).',
        'In case of a draw, a replay will be played with golden goal (first to score wins).'
      ]
    },
    {
      icon: <Users className="w-5 h-5 text-gold flex-shrink-0" />,
      title: 'Registration & Slots',
      items: [
        'Each tournament has a fixed number of slots (e.g., 16, 32, or 64 players).',
        'Registration closes when all slots are filled or 24 hours before the event.',
        'You can choose up to 3 teams (club or national) during registration.',
        'Your selected teams are final – no changes are allowed after registration.',
        'If you cannot attend, please cancel at least 12 hours in advance so we can open your slot.'
      ]
    },
    {
      icon: <Award className="w-5 h-5 text-gold flex-shrink-0" />,
      title: 'Prizes & Entry Fee',
      items: [
        'Entry fees are non‑refundable unless the tournament is cancelled by the host.',
        'Prize pool is distributed to the top 3 players (1st: 60%, 2nd: 25%, 3rd: 15%).',
        'Prize money is paid via mobile money (e.g., eWallet, SendNow) within 24 hours.',
        'In case of a tie, prize money is split equally between the tied players.'
      ]
    },
    {
      icon: <MessageCircle className="w-5 h-5 text-gold flex-shrink-0" />,
      title: 'Conduct & Sportsmanship',
      items: [
        'All players are expected to show good sportsmanship and respect for opponents.',
        'Toxic behaviour, hate speech, or excessive trash talk may result in disqualification.',
        'Players must follow the instructions of the tournament host or referees at all times.',
        'Any disputes should be raised with the host immediately – do not argue in public channels.'
      ]
    }
  ];

  const faqs = [
    {
      question: 'How do I register for a tournament?',
      answer: 'Browse the Tournaments page, find an OPEN tournament, and click “Secure My Slot”. Fill in your details, choose your teams, and submit – you’ll receive a WhatsApp confirmation and your slot will be reserved.'
    },
    {
      question: 'What if the tournament is full?',
      answer: 'If a tournament shows “FULL”, all slots have been taken. You can check back in case someone cancels, or join our waiting list (contact us via WhatsApp).'
    },
    {
      question: 'Can I change my team choices after registering?',
      answer: 'No, team choices are locked once you register. Please double‑check your selections before submitting.'
    },
    {
      question: 'What happens if I can’t attend on the day?',
      answer: 'Please notify the host via WhatsApp at least 12 hours before the start. Your slot will be released to the next player in line. Refunds are not provided for late cancellations.'
    },
    {
      question: 'Do I need to bring my own controller?',
      answer: 'Yes, players are expected to bring their own controller (wired or wireless). The host will provide the console and game.'
    },
    {
      question: 'How are brackets determined?',
      answer: 'Brackets are generated randomly using a computerised system. Seeding is not used – all players have an equal chance.'
    },
    {
      question: 'What if there’s a dispute during a match?',
      answer: 'Pause the game immediately and call the host/referee. They will make a final decision. The host’s decision is final and cannot be contested.'
    },
    {
      question: 'How do I get my prize money?',
      answer: 'Winners will be contacted via WhatsApp within 24 hours of the tournament. Payments are made via mobile money (eWallet, SendNow, or similar).'
    }
  ];

  return (
    <div className="pt-16 md:pt-20 min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Back button */}
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-[#888] hover:text-gold transition-colors text-sm font-medium mb-6 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:translate-x-[-2px] transition-transform" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-[#0a0a0a]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Rules & FAQ</h1>
          </div>
          <p className="text-[#888] text-sm md:text-base max-w-2xl">
            Everything you need to know about competing in the EKASI LEAGUE – from registration to prize payouts, and common questions answered.
          </p>
        </div>

        {/* Rules sections */}
        <div className="space-y-6 mb-12">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-gold" />
            Tournament Rules
          </h2>
          <div className="grid gap-4">
            {rules.map((section, idx) => (
              <div key={idx} className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-5 md:p-6">
                <div className="flex items-center gap-2 mb-3">
                  {section.icon}
                  <h3 className="text-base font-bold text-white">{section.title}</h3>
                </div>
                <ul className="space-y-2 text-sm text-[#aaa] pl-2">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-gold text-xs mt-0.5">▸</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ section */}
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
            <HelpCircle className="w-5 h-5 text-gold" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-5 md:p-6">
                <h4 className="text-sm font-bold text-white mb-1 flex items-start gap-2">
                  <span className="text-gold text-base">Q:</span>
                  {faq.question}
                </h4>
                <p className="text-sm text-[#aaa] pl-6 mt-1">
                  <span className="text-gold font-medium">A:</span> {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 md:p-8 text-center glow-gold-sm">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 gold-gradient rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-[#0a0a0a]" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-white">Still have questions?</h3>
          <p className="text-[#888] text-sm mt-1 max-w-sm mx-auto">
            Reach out to the host directly on WhatsApp – we’re here to help!
          </p>
          <a
            href={`https://wa.me/27664171598`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 btn-gold px-6 py-2.5 rounded-xl text-sm font-bold"
          >
            Chat with Host
          </a>
        </div>
      </div>
    </div>
  );
};

export default Rules;