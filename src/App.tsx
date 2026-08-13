import React from "react";
import ShoppingContainer from "@/components/shopping/ShoppingContainer";
import PWARegistration from "@/components/PWARegistration";

export default function App() {
  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-blue-500 selection:text-white flex flex-col justify-center items-center overflow-x-hidden">
      {/* PWA Service Worker Registration */}
      <PWARegistration />

      {/* Ambient Glass Glow Filters (Siri Pulse) */}
      <div
        className="fixed -top-20 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-siri-pulse-1"
        aria-hidden="true"
      />
      <div
        className="fixed -bottom-10 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[150px] pointer-events-none -z-10 animate-siri-pulse-2"
        aria-hidden="true"
      />

      <main className="w-full flex-1 flex flex-col justify-center items-center">
        <ShoppingContainer />
      </main>
    </div>
  );
}
