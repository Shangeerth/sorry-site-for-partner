import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"

export default function LetterPage({ setCurrentPage }) {
  const canvasRef = useRef(null)
  const trailContainerRef = useRef(null)
  const [hearts, setHearts] = useState([])

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  const images = [
    { src: "/images/1.jpg", emoji: "💕", tapeColor: "yellow", floatingEmoji: "🌹" },
    { src: "/images/2.jpg", emoji: "✨", tapeColor: "green", floatingEmoji: "🌟" },
    { src: "/images/3.jpg", emoji: "🌸", tapeColor: "blue", floatingEmoji: "🦋" },
    { src: "/images/4.jpg", emoji: "💫", tapeColor: "pink", floatingEmoji: "🌺" },
    { src: "/images/5.jpg", emoji: "🌷", tapeColor: "red", floatingEmoji: "🌼" },
    { src: "/images/6.jpg", emoji: "🌻", tapeColor: "orange", floatingEmoji: "🍃" },
    { src: "/images/7.jpg", emoji: "🍒", tapeColor: "purple", floatingEmoji: "🍂" },
    { src: "/images/8.jpg", emoji: "🍀", tapeColor: "cyan", floatingEmoji: "✨" },
    { src: "/images/9.jpg", emoji: "🌈", tapeColor: "lime", floatingEmoji: "🌟" },
    { src: "/images/10.jpg", emoji: "🎀", tapeColor: "pink", floatingEmoji: "💖" },
  ]
// Auto-rotate effect every 6 seconds, but pause if zoomed (long press or preview)
useEffect(() => {
  if (isZoomed) return; // Skip auto-rotate while zoomed or long pressed

  const interval = setInterval(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }, 6000); // 6000 ms = 6 seconds

  return () => clearInterval(interval);
}, [images.length, isZoomed]);

// Navigate to next image on click (still works)
const handleImageClick = () => {
  setCurrentImageIndex((prev) => (prev + 1) % images.length);
};

// Handle zoom on mouse down or touch start
const handleZoomStart = () => setIsZoomed(true);
const handleZoomEnd = () => setIsZoomed(false);

  // Handle navigation with confetti
  const handleContinue = () => {
    fireConfetti()
    setTimeout(() => {
      setCurrentPage("hug")
    }, 1000)
  }

  // Confetti logic
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    let particles = []

    function resizeCanvas() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const colors = ["#ff6bcb", "#ff9a8b", "#ffc3a0", "#a1c4fd", "#c2e9fb"]

    window.fireConfetti = () => {
      for (let i = 0; i < 100; i++) {
        particles.push({
          x: canvas.width / 2,
          y: canvas.height - 50,
          speedX: Math.random() * 6 - 3,
          speedY: Math.random() * -8 - 4,
          size: Math.random() * 6 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 100,
        })
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p, index) => {
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()

        p.x += p.speedX
        p.y += p.speedY
        p.speedY += 0.2
        p.life--

        if (p.life <= 0) {
          particles.splice(index, 1)
        }
      })
      requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  // Heart trail effect following cursor
  useEffect(() => {
    const trailContainer = document.createElement("div")
    trailContainerRef.current = trailContainer
    trailContainer.style.position = "fixed"
    trailContainer.style.top = "0"
    trailContainer.style.left = "0"
    trailContainer.style.width = "100vw"
    trailContainer.style.height = "100vh"
    trailContainer.style.pointerEvents = "none"
    trailContainer.style.overflow = "visible"
    trailContainer.style.zIndex = "9999"
    document.body.appendChild(trailContainer)

    const createHeart = (x, y) => {
      const heart = document.createElement("div")
      heart.textContent = "💗"
      heart.style.position = "fixed"
      heart.style.left = `${x}px`
      heart.style.top = `${y}px`
      heart.style.fontSize = "16px"
      heart.style.opacity = "1"
      heart.style.pointerEvents = "none"
      heart.style.userSelect = "none"
      heart.style.transition = "transform 1s ease, opacity 1s ease"
      trailContainer.appendChild(heart)

      requestAnimationFrame(() => {
        heart.style.transform = "translateY(-60px)"
        heart.style.opacity = "0"
      })

      setTimeout(() => {
        heart.remove()
      }, 1000)
    }

    const onMouseMove = (e) => {
      if (window.innerWidth > 768) {
        createHeart(e.clientX, e.clientY)
      }
    }

    window.addEventListener("mousemove", onMouseMove)
    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      trailContainer.remove()
    }
  }, [])

  // Floating random hearts (optional)
  useEffect(() => {
    const interval = setInterval(() => {
      setHearts((prev) => [
        ...prev,
        {
          id: Date.now(),
          left: Math.random() * 100,
          size: Math.random() * 20 + 10,
          emoji: ["💖", "💕", "💘", "💞", "💗", "❤️‍🔥"][Math.floor(Math.random() * 6)],
        },
      ])
    }, 600)

    const cleanup = setInterval(() => {
      setHearts((prev) => prev.filter((heart) => Date.now() - heart.id < 4000))
    }, 1000)

    return () => {
      clearInterval(interval)
      clearInterval(cleanup)
    }
  }, [])

  // For tape colors
  const tapeClasses = {
    yellow: "bg-gradient-to-r from-yellow-200 to-yellow-300 border border-yellow-400/30",
    green: "bg-gradient-to-r from-green-200 to-green-300 border border-green-400/30",
    blue: "bg-gradient-to-r from-blue-200 to-blue-300 border border-blue-400/30",
    pink: "bg-gradient-to-r from-pink-200 to-pink-300 border border-pink-400/30",
    red: "bg-gradient-to-r from-red-200 to-red-300 border border-red-400/30",
    orange: "bg-gradient-to-r from-orange-200 to-orange-300 border border-orange-400/30",
    purple: "bg-gradient-to-r from-purple-200 to-purple-300 border border-purple-400/30",
    cyan: "bg-gradient-to-r from-cyan-200 to-cyan-300 border border-cyan-400/30",
    lime: "bg-gradient-to-r from-lime-200 to-lime-300 border border-lime-400/30",
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden bg-gradient-to-br from-purple-900 via-pink-900 to-purple-800 text-pink-200">
      {/* Floating random hearts */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 1, 0], y: -200 }}
            transition={{ duration: 4 }}
            style={{
              position: "absolute",
              left: `${heart.left}%`,
              fontSize: `${heart.size}px`,
              top: "100%",
              zIndex: 0,
              userSelect: "none",
            }}
          >
            {heart.emoji}
          </motion.div>
        ))}
      </div>

      {/* Confetti canvas */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
      />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-2xl text-center space-y-8 z-10"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-2xl text-pink-300 mb-8 mt-10 md:mt-0"
        >
          I've been staring at these all night…🌙
        </motion.h2>

        {/* Single image with switching and zoom */}
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0, rotate: -8 + Math.random() * 16, y: 30 }}
          animate={{ opacity: 1, rotate: -3 + Math.random() * 6, y: 0, scale: isZoomed ? 1.3 : 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="relative group cursor-pointer mx-auto max-w-[300px]"
          onClick={handleImageClick}
          onMouseDown={handleZoomStart}
          onMouseUp={handleZoomEnd}
          onMouseLeave={handleZoomEnd}
          onTouchStart={handleZoomStart}
          onTouchEnd={handleZoomEnd}
          onTouchCancel={handleZoomEnd}
          style={{ userSelect: "none" }}
        >
          <div className="bg-white p-3 rounded-2xl shadow-lg transform transition-all duration-300 group-hover:shadow-pink-200/40">
            <div className="relative rounded-xl overflow-hidden">
              <img
                src={images[currentImageIndex].src}
                alt="Cute girl"
                className={`w-full h-auto object-cover rounded-xl select-none pointer-events-none transition-transform duration-300 ${
                  isZoomed ? "scale-110" : "scale-100"
                }`}
                draggable={false}
              />
              {/* Tape */}
              <div
                className={`absolute top-0 left-0 w-full h-10 rounded-t-xl ${tapeClasses[images[currentImageIndex].tapeColor]} flex items-center justify-center text-xl select-none`}
              >
                {images[currentImageIndex].emoji}
              </div>
              {/* Floating emoji */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-5 right-5 text-3xl select-none pointer-events-none"
              >
                {images[currentImageIndex].floatingEmoji}
              </motion.div>
            </div>
          </div>
          <p className="mt-2 text-sm text-pink-400 select-none">Tap/click to see another</p>
          <p className="text-xs text-pink-500 select-none">Hold/tap and hold to zoom</p>
        </motion.div>

       <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-xl text-lg font-serif text-pink-100 space-y-4"
          >
            <p>
              I just want to say thank you for being with me for these six amazing months.
            </p>
            <p>
              From our first conversation on December 24, 2023, to our first kiss on April 25, 2024 — every moment with you is unforgettable.
            </p>
            <p>
              Hugging you in class, our peaceful park visits, and how we support and motivate each other mean the world to me.
            </p>
            <p>
              I'm so grateful to have you by my side.
            </p>
          </motion.div>


        {/* Continue button */}
        <motion.button
          onClick={handleContinue}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 bg-gradient-to-r from-pink-400 via-red-400 to-pink-500 text-white py-3 px-10 rounded-full shadow-lg cursor-pointer select-none"
        >
          Take Me Back 💖
        </motion.button>
      </motion.div>
    </div>
  )
}
