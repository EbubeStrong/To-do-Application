"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "../../components/components/ui/button"
import "../styles/landingPage.css"
import Header from "../components/Header"

const words: string[] = ["Welcome", "To", "Your", "To-do", "App"]

const LandingPage: React.FC = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length)
    }, 2500)

    return () => clearInterval(interval) 
  }, [])

  return (
    <>
      <Header />
      <div className="landing-container">
        <div className="text-center">
          <div className="slide-up-wrapper">
            <h1 key={currentWordIndex} className="slide-up-text font-bold">
              {words[currentWordIndex]}
            </h1>
          </div>
          <p className="text-2xl mb-8">
            To check your To-do, click below <br />👇
          </p>
          <Button asChild>
            <Link
              to="/todos"
              className="btn text-blue-900 px-6 py-3 rounded-full text-xl font-semibold hover:text-white transition duration-300"
            >
              View Todos
            </Link>
          </Button>
        </div>
      </div>
    </>
  )
}

export default LandingPage
