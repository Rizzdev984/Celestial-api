// app/layout.js
// https://nextjs.org/docs/app/getting-started/installation

export const metadata = {
  title: "Celestial APIs",
  description: "Rest Api Made With🔥",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}