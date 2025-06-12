import "./globals.css"

export const metadata = {
  title: "I'm Sorry",
  description: "I didn't mean to hurt you...  ",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
