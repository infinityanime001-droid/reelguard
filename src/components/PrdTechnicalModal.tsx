import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Code2, 
  CheckCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Copy, 
  Check, 
  Smartphone,
  Layers,
  Database
} from 'lucide-react';

interface PrdTechnicalModalProps {
  onClose: () => void;
}

export const PrdTechnicalModal: React.FC<PrdTechnicalModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'prd' | 'kotlin' | 'policy'>('prd');
  const [copiedCode, setCopiedCode] = useState(false);

  const kotlinServiceSnippet = `// ReelAccessibilityService.kt
package com.reelguard.service

import android.accessibilityservice.AccessibilityService
import android.content.Intent
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo
import com.reelguard.data.AppDatabase
import com.reelguard.overlay.LockOverlayService
import kotlinx.coroutines.*

class ReelAccessibilityService : AccessibilityService() {

    private val serviceScope = CoroutineScope(Dispatchers.IO + SupervisorJob())
    private var lastRecordedReelTime = 0L

    companion object {
        private const val PKG_INSTAGRAM = "com.instagram.android"
        private const val PKG_YOUTUBE = "com.google.android.youtube"
        private const val PKG_FACEBOOK = "com.facebook.katana"

        // Known view ID heuristics
        private const val IG_REELS_CONTAINER = "com.instagram.android:id/reels_viewer_container"
        private const val YT_SHORTS_RECYCLER = "com.google.android.youtube:id/reel_recycler"
        private const val FB_REELS_VIEW = "com.facebook.katana:id/fb_reels_fullscreen_fragment"
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event == null) return

        val packageName = event.packageName?.toString() ?: return
        if (packageName !in listOf(PKG_INSTAGRAM, PKG_YOUTUBE, PKG_FACEBOOK)) return

        val rootNode = rootInActiveWindow ?: return

        // Heuristic 1: Check view IDs in active window hierarchy
        val isReelActive = detectReelInHierarchy(rootNode, packageName)

        if (isReelActive) {
            val now = System.currentTimeMillis()
            // Throttle duplicate scroll events (minimum 4 seconds between reels)
            if (now - lastRecordedReelTime > 4000) {
                lastRecordedReelTime = now
                checkAndEnforceLimits(packageName)
            }
        }
    }

    private fun detectReelInHierarchy(node: AccessibilityNodeInfo, pkg: String): Boolean {
        return when (pkg) {
            PKG_INSTAGRAM -> node.findAccessibilityNodeInfosByViewId(IG_REELS_CONTAINER).isNotEmpty()
            PKG_YOUTUBE -> node.findAccessibilityNodeInfosByViewId(YT_SHORTS_RECYCLER).isNotEmpty()
            PKG_FACEBOOK -> node.findAccessibilityNodeInfosByViewId(FB_REELS_VIEW).isNotEmpty()
            else -> false
        }
    }

    private fun checkAndEnforceLimits(pkg: String) {
        serviceScope.launch {
            val db = AppDatabase.getInstance(applicationContext)
            val todayCount = db.reelSessionDao().getTodayCount(pkg)
            val limit = db.dailyLimitDao().getLimitForPackage(pkg)

            if (todayCount >= limit) {
                withContext(Dispatchers.Main) {
                    // Trigger SYSTEM_ALERT_WINDOW full screen blocker overlay
                    val lockIntent = Intent(applicationContext, LockOverlayService::class.java).apply {
                        putExtra("PACKAGE_NAME", pkg)
                        putExtra("REEL_COUNT", todayCount)
                        putExtra("LIMIT_VALUE", limit)
                    }
                    startService(lockIntent)
                }
            } else {
                db.reelSessionDao().insert(ReelSessionEntity(pkg, System.currentTimeMillis()))
            }
        }
    }

    override fun onInterrupt() {}
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(kotlinServiceSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl max-h-[88vh] rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">ReelGuard Technical Blueprint & PRD</h2>
              <p className="text-[11px] text-slate-400">Architecture Specification & Android Implementation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-slate-800 bg-slate-950/40 text-xs">
          <button
            onClick={() => setActiveTab('prd')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'prd'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            1-Page PRD
          </button>
          <button
            onClick={() => setActiveTab('kotlin')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'kotlin'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Kotlin Architecture
          </button>
          <button
            onClick={() => setActiveTab('policy')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'policy'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Play Store Compliance
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs leading-relaxed text-slate-300">
          {activeTab === 'prd' && (
            <div className="space-y-4">
              {/* Product Overview */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-rose-400" />
                  Executive Summary
                </h3>
                <p>
                  <strong>ReelGuard</strong> is an offline-first Android digital wellbeing tool designed specifically to break short-form video addiction (Instagram Reels, YouTube Shorts, Facebook Reels). By combining Android's privileged <code>AccessibilityService</code> and <code>UsageStatsManager</code> APIs, ReelGuard detects discrete reel swipes, enforces daily limits via full-screen overlay lock, and substitutes mindless scrolling with task-linked rewards.
                </p>
              </div>

              {/* iOS Limitation Alert */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
                <div className="flex items-center gap-2 font-bold text-amber-300 mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Platform Feasibility Notice: Android Exclusivity</span>
                </div>
                <p className="text-[11px] text-amber-200/90 leading-normal">
                  An iOS counterpart is <strong>technically impossible</strong> for third-party developers. Apple’s sandbox strictly prohibits monitoring UI view hierarchies of third-party apps, drawing system overlay windows, or intercepting scrolling gestures without private entitlements or MDM profiles.
                </p>
              </div>

              {/* Core Feature Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800">
                  <span className="font-bold text-white block mb-1">A. Reel & Shorts Counter</span>
                  <p className="text-[11px] text-slate-400">
                    AccessibilityService monitors view hierarchy changes (e.g. <code>reels_viewer_container</code>) and vertical fling gestures to record each individual reel watch.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800">
                  <span className="font-bold text-white block mb-1">B. Screen Time Tracking</span>
                  <p className="text-[11px] text-slate-400">
                    Queries <code>UsageStatsManager.queryUsageStats()</code> for total foreground duration per target package without battery drain.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800">
                  <span className="font-bold text-white block mb-1">C. Limit & Overlay Blocker</span>
                  <p className="text-[11px] text-slate-400">
                    Draws a <code>TYPE_APPLICATION_OVERLAY</code> window immediately when the limit is breached, requiring a 60s friction timer or task completion.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800">
                  <span className="font-bold text-white block mb-1">D. Task & Alarm System</span>
                  <p className="text-[11px] text-slate-400">
                    Schedules reminders via <code>AlarmManager.setExactAndAllowWhileIdle()</code>. Checking off productive tasks earns bonus reel time.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'kotlin' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">ReelAccessibilityService.kt Implementation</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 hover:text-rose-300 cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>

              <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-3.5 font-mono text-[11px] overflow-x-auto text-slate-300">
                <pre>{kotlinServiceSnippet}</pre>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <span className="font-bold text-white block">Android Manifest Requirements</span>
                <p className="text-[11px] text-slate-400">
                  Must declare permissions in <code>AndroidManifest.xml</code>:
                </p>
                <code className="text-purple-300 block text-[10px] bg-slate-900 p-2 rounded-lg font-mono">
                  &lt;uses-permission android:name="android.permission.PACKAGE_USAGE_STATS" tools:ignore="ProtectedPermissions" /&gt;<br />
                  &lt;uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" /&gt;<br />
                  &lt;uses-permission android:name="android.permission.POST_NOTIFICATIONS" /&gt;<br />
                  &lt;uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" /&gt;
                </code>
              </div>
            </div>
          )}

          {activeTab === 'policy' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <h3 className="font-bold text-white text-sm">
                  Google Play Accessibility API Policy Compliance
                </h3>
                <p>
                  Google Play restricts the use of <code>AccessibilityService</code> to apps that assist users with disabilities or explicitly fall under declared Digital Wellbeing / Child Safety exemptions.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-white">Prominent In-App Disclosure</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      The app must show a standalone full-screen explanation before requesting accessibility permission, detailing that it only inspects package names and view IDs for Instagram, YouTube, and Facebook.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-white">Zero Third-Party Data Transmission</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      All view hierarchy heuristics and session counters are stored locally in the on-device SQLite / Room database. No data is synced or sold.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-white">Maintenance Strategy for View ID Breakage</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Since Instagram and YouTube regularly obfuscate class names and update view IDs, production apps use a remote config rule JSON (or fallback gesture heuristics like vertical swipe detection on target packages).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};
