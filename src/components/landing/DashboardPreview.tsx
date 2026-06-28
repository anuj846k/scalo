'use client';

import {
  Activity,
  AlertCircle,
  Bot,
  Sparkles,
  TrendingUp,
  MessageSquare,
  Search,
  Database,
  Network,
  FileText,
  LayoutDashboard,
  Settings,
  ArrowRight,
  TrendingDown,
  Smile,
  Frown,
  Meh,
} from 'lucide-react';
import { useMemo } from 'react';
import Image from 'next/image';

export default function DashboardPreview() {
  const waveformHeights = useMemo(
    () =>
      [1, 2, 3, 4, 5, 6, 7, 8].map((i) => Math.max(20, (i * 12.5 + 30) % 100)),
    [],
  );

  return (
    <div className="w-[1022px] h-[575px] rounded-2xl border border-gray-200 bg-white overflow-hidden flex shadow-2xl relative text-gray-900 font-sans [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200 bg-gray-50 p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white">
            <Image
              src="/logos/logo.svg"
              alt="Scalo Logo"
              width={28}
              height={28}
              className="w-7 h-7 object-contain"
            />
          </div>
          <span className="font-semibold text-gray-900 text-lg">Scalo</span>
        </div>

        <nav className="flex flex-col gap-1">
          {[
            { icon: LayoutDashboard, label: 'Overview', active: true },
            { icon: MessageSquare, label: 'Feedback Items' },
            { icon: Database, label: 'Theme Clusters' },
            { icon: Network, label: 'Connectors' },
            { icon: Bot, label: 'AI Chat Brain' },
            { icon: Settings, label: 'Settings' },
          ].map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                item.active
                  ? 'bg-gray-200 text-gray-900 font-medium'
                  : 'text-gray-500 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-gray-200 flex items-center justify-between px-6">
          <h1 className="text-lg font-medium text-gray-900">Overview</h1>
          <button className="flex items-center gap-2 bg-[#3a04ff] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-all shadow-md">
            <Sparkles size={16} />
            Ask Scalo AI
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
          {/* Metrics Row */}
          <div className="grid grid-cols-4 gap-4">
            {/* Metric 1 */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-[10px] font-medium uppercase tracking-wider">
                  Total Feedback
                </span>
                <TrendingUp size={14} className="text-gray-400" />
              </div>
              <div className="text-2xl font-semibold text-gray-900">1,240</div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <span className="text-green-600 font-medium">+15%</span> vs last
                month
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-[10px] font-medium uppercase tracking-wider">
                  Positive Sentiment
                </span>
                <Smile size={14} className="text-green-500" />
              </div>
              <div className="text-2xl font-semibold text-gray-900">74.2%</div>
              <div className="text-[10px] text-gray-500 flex items-center gap-1">
                <span className="text-green-600 font-medium">+3.1%</span>{' '}
                increase
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-[10px] font-medium uppercase tracking-wider">
                  Primary Theme
                </span>
                <Database size={14} className="text-gray-400" />
              </div>
              <div className="text-2xl font-semibold text-gray-900">
                Onboarding
              </div>
              <div className="text-xs text-gray-500">32% of total comments</div>
            </div>

            {/* Metric 4 */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-[10px] font-medium uppercase tracking-wider">
                  Active Connectors
                </span>
                <Network size={14} className="text-gray-400" />
              </div>
              <div className="text-2xl font-semibold text-gray-900">
                6 Active
              </div>
              <div className="text-[10px] text-gray-500">
                Google, Zendesk, Insta...
              </div>
            </div>
          </div>

          {/* Chart Area */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex flex-col gap-4 flex-1 min-h-[180px]">
            <div className="flex items-center justify-between">
              <h2 className="text-[13.7px] font-medium text-gray-900">
                Sentiment Trends Over Time
              </h2>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" /> Positive
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" /> Neutral
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500" /> Negative
                </div>
              </div>
            </div>
            {/* Mock Chart */}
            <div className="flex-1 relative w-full flex items-end gap-2">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-200/50 to-transparent rounded-lg" />
              <svg
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="none"
                viewBox="0 0 100 100"
              >
                {/* Positive trend line */}
                <path
                  d="M0,80 L20,70 Q40,45 60,50 T100,20 L100,100 Z"
                  fill="rgba(34,197,94,0.05)"
                />
                <path
                  d="M0,70 L20,65 Q40,45 60,50 T100,20"
                  fill="none"
                  stroke="rgba(34,197,94,0.8)"
                  strokeWidth="2"
                />

                {/* Negative trend line */}
                <path
                  d="M0,90 L20,85 Q40,90 60,80 T100,75 L100,100 Z"
                  fill="rgba(239,68,68,0.02)"
                />
                <path
                  d="M0,90 L20,85 Q40,90 60,80 T100,75"
                  fill="none"
                  stroke="rgba(239,68,68,0.5)"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
              </svg>
            </div>
          </div>

          {/* Live AI Activity Feed */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex flex-col gap-4">
            <h2 className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <Activity size={16} className="text-gray-500" />
              Live Feedback Ingestion Stream
            </h2>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white border border-gray-200">
                <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center shrink-0 border border-yellow-200">
                  <Meh size={14} className="text-yellow-600" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-sm text-gray-700">
                    <span className="font-medium text-gray-900">
                      Google Review:
                    </span>{' '}
                    &ldquo;The onboarding steps were a bit confusing but the
                    support team helped me out.&rdquo;
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <span>Just now</span>
                    <span>•</span>
                    <span className="bg-yellow-100 text-yellow-800 text-[10px] px-1.5 py-0.5 rounded font-medium">
                      Neutral Sentiment
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.5 rounded font-medium">
                      Theme: Onboarding
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-white border border-gray-200">
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0 border border-green-200">
                  <Smile size={14} className="text-green-600" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-sm text-gray-700">
                    <span className="font-medium text-gray-900">
                      App Store Review:
                    </span>{' '}
                    &ldquo;Scalo has completely changed how we track customer
                    pain points!&rdquo;
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <span>3 mins ago</span>
                    <span>•</span>
                    <span className="bg-green-100 text-green-800 text-[10px] px-1.5 py-0.5 rounded font-medium">
                      Positive Sentiment
                    </span>
                    <span className="bg-purple-100 text-purple-800 text-[10px] px-1.5 py-0.5 rounded font-medium">
                      Theme: Analytics
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating AI Agent Widget */}
      <div className="absolute bottom-6 right-6 bg-white border border-gray-200 rounded-2xl p-4 shadow-xl flex items-center gap-4 backdrop-blur-xl">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center z-10 relative">
            <Bot size={20} className="text-white" />
          </div>
          <div className="absolute inset-0 rounded-full bg-[#3a04ff]/10 animate-ping" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-sm font-medium text-gray-900">
            Scalo Brain is active
          </div>
          <div className="flex items-center gap-1 h-3">
            {/* Waveform */}
            {waveformHeights.map((height, i) => (
              <div
                key={i}
                className="w-1 bg-[#3a04ff] rounded-full animate-pulse"
                style={{
                  height: `${height}%`,
                  animationDelay: `${(i + 1) * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
