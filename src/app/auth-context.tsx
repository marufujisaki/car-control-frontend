"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"


type User = {
  id: string
  name: string
  email: string
  image?: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: () => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';






export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const provider = new GoogleAuthProvider();

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  // Google OAuth login with popup
  const login = async () => {
    setIsLoading(true)
    try {

      signInWithPopup(auth, provider).then(async result => {
        const token = await result.user.getIdToken();
        // Send to your backend
        const res = await fetch('http://localhost:8080/auth/firebase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });
        const data = await res.json();
        console.log(data);
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user))
      });
      // // Simulate Google OAuth popup and login
      // // In a real app, this would use the Google OAuth API
      // await new Promise((resolve) => setTimeout(resolve, 1000))

      // // Mock user data (in a real app, this would come from Google)
      // const mockUser = {
      //   id: "google-" + Math.random().toString(36).substring(2, 11),
      //   name: "Demo User",
      //   email: "demo@example.com",
      //   image: "https://ui-avatars.com/api/?name=Demo+User&background=random",
      // }

      // setUser(mockUser)
      // localStorage.setItem("user", JSON.stringify(mockUser))
    } catch (error) {
      console.error("Login failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
