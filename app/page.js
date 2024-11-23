// app/page.js

import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white">
      <h1 className="text-6xl font-extrabold text-center mb-12 drop-shadow-lg">
        Hellooo Welcome!!!
      </h1>
      <div className="space-x-4">
        <Link href="/docs">
          <a className="px-8 py-4 bg-transparent border-2 border-white text-xl font-semibold rounded-full text-white transition-all duration-300 hover:bg-white hover:text-gray-800 hover:border-gray-800 transform hover:scale-110">
            View Documentation
          </a>
        </Link>
      </div>
    </div>
  )
}
