import './globals.css';

export const metadata = {
  title: 'AURON AI — Voice Powered AI Assistant',
  description: 'Next-Generation Voice & Chat AI Assistant powered by Gemini AI and Web Speech APIs.',
  keywords: ['AI', 'Voice Assistant', 'Gemini AI', 'AURON', 'Speech Recognition', 'Next.js', 'Vercel'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
