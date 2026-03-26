import { useState } from "react"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AuthCard({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const endpoint = isLogin ? "/api/login" : "/api/register"
      const payload = { 
        username: formData.username, 
        password: formData.password 
      }

      const { data } = await api.post(endpoint, payload)
      
      if (data.token) {
        localStorage.setItem("token", data.token)
        if (onAuthSuccess) onAuthSuccess({ username: data.username })
      } else if (!isLogin) {
        // Auto-login after registration
        const loginRes = await api.post("/api/login", payload)
        if (loginRes.data.token) {
          localStorage.setItem("token", loginRes.data.token)
          if (onAuthSuccess) onAuthSuccess({ username: loginRes.data.username })
        }
      }
    } catch (_err) {
      setError(_err.response?.data?.message || _err.response?.data?.error || "Connection failed. Please ensure backend is running.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{isLogin ? "Login" : "Sign Up"}</CardTitle>
          <CardDescription>
            {isLogin
              ? "Enter your credentials to access your account"
              : "Create an account to start taking quizzes"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <div className="text-destructive text-sm font-medium">{error}</div>}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username" 
              placeholder="johndoe" 
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit"
            className="w-full" 
            disabled={loading}
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
          </Button>
          <Button
            type="button"
            variant="link"
            className="text-sm"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Login"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
