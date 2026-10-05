import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ShieldCheck,
  ImageIcon,
  Youtube,
  FileText,
  BookOpen,
  Headphones,
  Video,
  MessageSquare,
  Layers,
  Languages,
  BookMarked,
  FileArchive,
  Image,
  ArrowRight,
  Check,
  Copy,
  Upload,
  Search,
  ExternalLink,
} from 'lucide-react';
import { NavTab } from './Navbar';

interface ToolsCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: NavTab) => void;
  onSendToHumanizer?: (text: string) => void;
}

type ActiveSubTool =
  | null
  | 'notes-gen'
  | 'ai-summarizer'
  | 'yt-transcript'
  | 'audio-text'
  | 'video-text'
  | 'ai-chat'
  | 'flashcards'
  | 'words-translate'
  | 'compress-pdf'
  | 'compress-image';

export const ToolsCenterModal: React.FC<ToolsCenterModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onSendToHumanizer,
}) => {
  const [activeSubTool, setActiveSubTool] = useState<ActiveSubTool>(null);

  // Subtool states
  const [inputText, setInputText] = useState('');
  const [toolResult, setToolResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Chat subtool messages
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([
    {
      role: 'ai',
      text: 'Hello! I am your AI Study & Writing Assistant. How can I help you improve or understand your content today?',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  if (!isOpen) return null;

  const handleLaunchTab = (tab: NavTab) => {
    onSelectTab(tab);
    onClose();
  };

  const handleRunSubTool = (tool: ActiveSubTool) => {
    if (!inputText.trim() && tool !== 'compress-pdf' && tool !== 'compress-image') return;
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      if (tool === 'notes-gen') {
        setToolResult({
          title: 'Structured Study Notes',
          notes: [
            'Core Subject: Fundamental conceptual synthesis and humanized articulation.',
            'Key Pillar 1: High burstiness (mixing short punchy sentences with compound clauses).',
            'Key Pillar 2: Low artificial perplexity through organic phrasing and contractions.',
            'Executive Summary: Removing AI cliches yields 100% human authenticity across Turnitin and ZeroGPT.',
          ],
        });
      } else if (tool === 'ai-summarizer') {
        setToolResult({
          title: 'Executive Summary',
          summary:
            'This content emphasizes that authentic human communication relies on asymmetric sentence patterns, natural cadence, and contextual relevance. By eliminating formulaic AI transitions, writing attains true 0.0% AI detection probability.',
        });
      } else if (tool === 'flashcards') {
        setToolResult({
          cards: [
            { q: 'What is Burstiness in AI detection?', a: 'Variation in sentence lengths and structural rhythm throughout a document.' },
            { q: 'What is Perplexity in linguistic models?', a: 'A measurement of how likely or predictable a sequence of words is.' },
            { q: 'How does Raheel Humanize guarantee 0.0% AI?', a: 'By combining multi-language structural deconstruction with deep human reconstruction.' },
          ],
        });
      } else if (tool === 'words-translate') {
        setToolResult({
          translation: 'Fast contextual translation complete with native idioms and authentic slang equivalents.',
        });
      } else if (tool === 'yt-transcript') {
        setToolResult({
          transcript:
            '[00:00] Welcome to today’s lecture on neural language detection.\n[00:15] Today we break down how AI classifiers evaluate syntax.\n[00:45] Notice how rigid formal patterns always raise flags.\n[01:20] When you rewrite using human cadences, AI probability drops to 0.0%.',
        });
      } else if (tool === 'audio-text' || tool === 'video-text') {
        setToolResult({
          transcript:
            'Transcription completed with 99.8% precision: "Modern enterprise workflows are shifting towards organic intelligence where humans and automated systems collaborate seamlessly without bureaucratic friction."',
        });
      } else if (tool === 'compress-pdf') {
        setToolResult({
          message: 'PDF compressed successfully! File size reduced by 64% from 4.8MB to 1.7MB.',
        });
      } else if (tool === 'compress-image') {
        setToolResult({
          message: 'Image compressed successfully! File size reduced by 72% from 3.2MB to 890KB without visible quality loss.',
        });
      }
    }, 900);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: `Great question regarding "${userMsg.slice(0, 30)}...". When refining this for maximum academic clarity, focus on varying sentence length and eliminating robotic connector words like "furthermore" and "delve".`,
        },
      ]);
    }, 600);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTransfer = (text: string) => {
    if (onSendToHumanizer) {
      onSendToHumanizer(text);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-200 px-3 py-0.5 text-xs font-bold text-indigo-700">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Powered Suite</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Tools Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Discover and launch powerful AI capabilities.
          </p>
        </div>

        {/* If Subtool is active, render interactive workspace */}
        {activeSubTool ? (
          <div className="rounded-2xl border border-indigo-100 bg-slate-50 p-5 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                {activeSubTool.replace('-', ' ').toUpperCase()}
              </span>
              <button
                onClick={() => {
                  setActiveSubTool(null);
                  setToolResult(null);
                  setInputText('');
                }}
                className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
              >
                ← Back to All Tools
              </button>
            </div>

            {/* Chat subtool */}
            {activeSubTool === 'ai-chat' ? (
              <div className="space-y-3">
                <div className="h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 space-y-3 text-xs">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-xl p-3 ${
                          msg.role === 'user'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask a question or paste text to discuss..."
                    className="flex-1 rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 cursor-pointer"
                  >
                    Send
                  </button>
                </div>
              </div>
            ) : activeSubTool === 'compress-pdf' || activeSubTool === 'compress-image' ? (
              /* Compression tools */
              <div className="space-y-4">
                <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white p-8 text-center space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Upload your {activeSubTool === 'compress-pdf' ? 'PDF document' : 'Image (PNG/JPG)'}
                    </p>
                    <p className="text-[11px] text-slate-400">Supports files up to 50MB</p>
                  </div>
                  <button
                    onClick={() => handleRunSubTool(activeSubTool)}
                    disabled={isProcessing}
                    className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:opacity-95 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? 'Compressing File...' : 'Select File & Compress'}
                  </button>
                </div>

                {toolResult && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-medium text-emerald-800 flex items-center justify-between">
                    <span>{toolResult.message}</span>
                    <button className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer">
                      Download
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Text-based subtools */
              <div className="space-y-3">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Paste content or URL here for ${activeSubTool.replace('-', ' ')}...`}
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none resize-none"
                />

                <div className="flex justify-end">
                  <button
                    onClick={() => handleRunSubTool(activeSubTool)}
                    disabled={isProcessing || !inputText.trim()}
                    className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-95 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? 'Generating...' : `Run ${activeSubTool.replace('-', ' ')}`}
                  </button>
                </div>

                {/* Subtool Results */}
                {toolResult && (
                  <div className="rounded-xl border border-indigo-100 bg-white p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h4 className="text-xs font-bold text-slate-800">
                        {toolResult.title || 'Generated Output'}
                      </h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleCopy(
                              toolResult.summary ||
                                toolResult.transcript ||
                                JSON.stringify(toolResult.notes || toolResult.cards)
                            )
                          }
                          className="flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900"
                        >
                          {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                          {copied ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    {toolResult.notes && (
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {toolResult.notes.map((note: string, i: number) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-indigo-600 font-bold">•</span>
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {toolResult.summary && (
                      <p className="text-xs leading-relaxed text-slate-700">{toolResult.summary}</p>
                    )}

                    {toolResult.transcript && (
                      <pre className="text-xs leading-relaxed text-slate-700 font-mono whitespace-pre-wrap">
                        {toolResult.transcript}
                      </pre>
                    )}

                    {toolResult.cards && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {toolResult.cards.map((c: any, i: number) => (
                          <div key={i} className="rounded-lg border border-indigo-100 bg-indigo-50/50 p-3 space-y-1 text-xs">
                            <div className="font-bold text-indigo-900">Q: {c.q}</div>
                            <div className="text-slate-600">A: {c.a}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {toolResult.translation && (
                      <p className="text-xs text-slate-800 font-medium">{toolResult.translation}</p>
                    )}

                    {/* Quick Transfer to Humanizer */}
                    {(toolResult.summary || toolResult.transcript) && onSendToHumanizer && (
                      <div className="pt-2">
                        <button
                          onClick={() =>
                            handleTransfer(toolResult.summary || toolResult.transcript)
                          }
                          className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 cursor-pointer"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          Transfer Directly to AI Humanizer Studio (0.0% AI)
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Grid of Categorized Tools */
          <div className="space-y-6">
            {/* Category 1: AI HUMANIZE & DETECT */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-700 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                AI HUMANIZE & DETECT
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* AI Humanizer */}
                <div
                  onClick={() => handleLaunchTab('pipeline')}
                  className="rounded-2xl border border-slate-200 bg-white p-4 hover:border-indigo-400 hover:shadow-sm transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-105 transition-transform">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">AI Humanizer</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Rewrite AI text to read naturally.
                  </p>
                </div>

                {/* AI Detector */}
                <div
                  onClick={() => handleLaunchTab('detector')}
                  className="rounded-2xl border border-slate-200 bg-white p-4 hover:border-rose-400 hover:shadow-sm transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 group-hover:scale-105 transition-transform">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">AI Detector</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Spot AI-written text instantly.
                  </p>
                </div>

                {/* AI Image Detector */}
                <div
                  onClick={() => handleLaunchTab('image-detector')}
                  className="rounded-2xl border border-slate-200 bg-white p-4 hover:border-indigo-400 hover:shadow-sm transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 group-hover:scale-105 transition-transform">
                      <ImageIcon className="h-5 w-5" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">AI Image Detector</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Detect AI-generated images.
                  </p>
                </div>
              </div>
            </div>

            {/* Category 2: AI LEARNING */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-700 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                AI LEARNING
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* YouTube Transcript */}
                <div
                  onClick={() => setActiveSubTool('yt-transcript')}
                  className="rounded-2xl border border-slate-200 bg-white p-3.5 hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 mb-2">
                    <Youtube className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">YouTube Transcript</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Extract video captions</p>
                </div>

                {/* YouTube Summarizer */}
                <div
                  onClick={() => handleLaunchTab('youtube')}
                  className="rounded-2xl border border-slate-200 bg-white p-3.5 hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 mb-2">
                    <Youtube className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">YouTube Summarizer</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Summarize & humanize</p>
                </div>

                {/* AI Notes Generator */}
                <div
                  onClick={() => setActiveSubTool('notes-gen')}
                  className="rounded-2xl border border-slate-200 bg-white p-3.5 hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 mb-2">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">AI Notes Generator</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Structured study notes</p>
                </div>

                {/* AI Summarizer */}
                <div
                  onClick={() => setActiveSubTool('ai-summarizer')}
                  className="rounded-2xl border border-slate-200 bg-white p-3.5 hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 mb-2">
                    <FileText className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">AI Summarizer</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Condense long text</p>
                </div>

                {/* Video to Text */}
                <div
                  onClick={() => setActiveSubTool('video-text')}
                  className="rounded-2xl border border-slate-200 bg-white p-3.5 hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 mb-2">
                    <Video className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">Video to Text</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Transcribe videos</p>
                </div>

                {/* Audio to Text */}
                <div
                  onClick={() => setActiveSubTool('audio-text')}
                  className="rounded-2xl border border-slate-200 bg-white p-3.5 hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 mb-2">
                    <Headphones className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">Audio to Text</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Transcribe recordings</p>
                </div>

                {/* AI Chat */}
                <div
                  onClick={() => setActiveSubTool('ai-chat')}
                  className="rounded-2xl border border-slate-200 bg-white p-3.5 hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 mb-2">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">AI Chat</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Study AI assistant</p>
                </div>

                {/* Auto Flashcards */}
                <div
                  onClick={() => setActiveSubTool('flashcards')}
                  className="rounded-2xl border border-slate-200 bg-white p-3.5 hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 mb-2">
                    <Layers className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">Auto Flashcards</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Interactive revision</p>
                </div>
              </div>
            </div>

            {/* Category 3: OTHER TOOLS */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-700 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                OTHER TOOLS
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Doc Translate */}
                <div
                  onClick={() => handleLaunchTab('translator')}
                  className="rounded-2xl border border-slate-200 bg-white p-3.5 hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 mb-2">
                    <Languages className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">Doc Translate</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Humanized document translation</p>
                </div>

                {/* Words Translate */}
                <div
                  onClick={() => setActiveSubTool('words-translate')}
                  className="rounded-2xl border border-slate-200 bg-white p-3.5 hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 mb-2">
                    <BookMarked className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">Words Translate</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Idiomatic vocabulary</p>
                </div>

                {/* Compress PDF */}
                <div
                  onClick={() => setActiveSubTool('compress-pdf')}
                  className="rounded-2xl border border-slate-200 bg-white p-3.5 hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 mb-2">
                    <FileArchive className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">Compress PDF</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Reduce PDF file size</p>
                </div>

                {/* Compress Image */}
                <div
                  onClick={() => setActiveSubTool('compress-image')}
                  className="rounded-2xl border border-slate-200 bg-white p-3.5 hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 mb-2">
                    <Image className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">Compress Image</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Reduce image file size</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
