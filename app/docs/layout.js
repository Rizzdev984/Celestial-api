// app/docs/layout.js
// custom

export const metadata = {
  title: "Celestial APIs",
  description: "Rest APIs Made With🔥",
  keywords: "Api",
  openGraph: {
    title: "Celestial APIs",
    description:
      "Free Rest APIs Made With🥰",
    url: "https://api.celestial.us.kg",
    type: "website",
    images: [
      {
        url: "https://pomf2.lain.la/f/frd1xzm6.jpg",
        width: 800,
        height: 600,
        alt: "anjing",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
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
