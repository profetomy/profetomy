import { Navbar } from '@/components/Navbar';
import { LandingContent } from '@/components/LandingContent';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <LandingContent />
    </div>
  );
}
