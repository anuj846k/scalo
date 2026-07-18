'use client';

import { useState } from 'react';
import { MyChevronDown } from '../icons';
import Link from 'next/link';

type FAQItem = {
  que: string;
  ans: string;
};

const FAQ = () => {
  const faqs: FAQItem[] = [
    {
      que: 'How does semantic search work?',
      ans: 'Scalo generates vector embeddings for each feedback item (reviews, tickets, comments). Instead of matching exact keywords, our AI understands the semantic meaning and intent of your query, letting you search for concepts like "onboarding confusion" even if that exact phrase was never used.',
    },
    {
      que: 'Which sources can I connect?',
      ans: 'We support Google Reviews, Instagram comments, Zendesk support tickets, and direct CSV uploads, with more connectors (like Intercom and App Store) added weekly. You can sync multiple accounts for each source.',
    },
    {
      que: 'Are the AI answers reliable?',
      ans: 'Yes. Scalo utilizes Retrieval-Augmented Generation (RAG). Every answer generated in the chat interface is grounded in your customer feedback database. Best of all, every answer lists exact citations linking back to the raw feedback items.',
    },
    {
      que: 'How long does ingestion and analysis take?',
      ans: 'Ingestion is near real-time. Once connected, new feedback items are analyzed for sentiment, clustered into themes, and embedded within seconds.',
    },
    {
      que: 'Is my customer data secure?',
      ans: 'Absolutely. We store all data in secure, isolated Postgres databases with row-level security enabled and encrypt it both in transit and at rest. We never use your customer data to train public models.',
    },
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="flex w-full flex-col items-center gap-16 bg-[#F5F5F5] py-16 md:py-30 px-4 md:px-8">
      <div className="flex w-full max-w-3xl flex-col items-center gap-8 md:gap-16 mx-auto">
        {/* Upper section */}
        <div className="flex flex-col items-center gap-[13.3px] self-stretch pt-[2.75px]">
          <h1 className="flex flex-col items-center self-stretch text-center text-[#0A0A0A] text-4xl md:text-[48px] font-semibold leading-tight md:leading-12 ">
            Everything you need to know
          </h1>

          <div className="flex w-full max-w-xl flex-col items-center pt-[2.7px] text-center text-[#737373] text-[16.9px] font-normal leading-7">
            Can&apos;t find the answer you&apos;re looking for? Reach out!
          </div>

          <div className="flex flex-wrap content-center items-center justify-center self-stretch gap-x-3 gap-y-0 pt-[18.7px]">
            <Link
              href="/signup"
              className="flex items-center justify-center px-6 py-2.5 text-center text-[#F5F5F5] text-[13.7px] font-[590] leading-5 rounded-xl bg-[#0A0A0A] hover:opacity-90"
            >
              Get Started
            </Link>

            <a
              href="mailto:anuj@scalocx.com"
              className="flex items-center justify-center rounded-xl border border-[#E5E5E5] bg-white px-6 py-2.5 text-center text-[#0A0A0A] text-[13.7px] font-[590] leading-5 hover:bg-gray-50"
            >
              Contact Support
            </a>
          </div>
        </div>

        {/* Questions and answers */}
        <div className="flex flex-col items-start gap-3 self-stretch w-full">
          {faqs.map((faq, index) => (
            <button
              key={index}
              onClick={() => toggleFAQ(index)}
              className="flex flex-col items-start self-stretch p-6 rounded-3xl bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10)] w-full text-left"
            >
              <div className="flex items-center justify-between self-stretch w-full">
                <h1 className="flex flex-col items-start text-[#0A0A0A] text-[16.9px] font-[510] leading-7 ">
                  {faq.que}
                </h1>

                <MyChevronDown
                  className={`flex flex-col items-start w-5 h-5 transition-transform duration-300 ${
                    activeIndex === index ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </div>

              {activeIndex === index && (
                <div className="flex flex-col items-start self-stretch pt-4">
                  <p className="self-stretch text-[#737373] text-[15.3px] font-normal leading-relaxed">
                    {faq.ans}
                  </p>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
