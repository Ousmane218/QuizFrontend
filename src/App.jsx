import { useState, useEffect } from "react"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/sidebar-nav"
import { AuthCard } from "@/components/auth-card"
import { QuizCard } from "@/components/quiz-card"
import { ScoreTable } from "@/components/score-table"
import { QuizPlay } from "@/components/quiz-play"
import { CreateQuiz } from "@/components/create-quiz"
import { Separator } from "@/components/ui/separator"
import api from "@/lib/api"
import { Loader2 } from "lucide-react"

export default function App() {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState("home")
  const [activeQuizId, setActiveQuizId] = useState(null)
  const [quizzes, setQuizzes] = useState([])
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const { data } = await api.get("/api/user")
          setUser(data)
          setIsAuthenticated(true)
        } catch (_err) {
          localStorage.removeItem("token")
          setIsAuthenticated(false)
        }
      }
      setLoading(false)
    }
    checkAuth()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated])

  const fetchData = async () => {
    try {
      const [quizzesRes, resultsRes] = await Promise.all([
        api.get("/api/quizzes"),
        api.get("/api/results"),
      ])
      setQuizzes(quizzesRes.data)
      setResults(resultsRes.data)
    } catch (_err) {
      console.error("Failed to fetch dashboard data", _err)
    }
  }

  const handleAuthSuccess = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    setIsAuthenticated(false)
    setUser(null)
  }

  const handleQuizComplete = () => {
    setActiveQuizId(null)
    setActiveTab("home")
    fetchData() 
  }

  const handleQuizCreated = () => {
    setActiveTab("home")
    fetchData()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tighter text-zinc-900 dark:text-zinc-50">QuizPlatform</h1>
            <p className="text-muted-foreground mt-2 font-medium">Elevate your learning through interactive assessments.</p>
          </div>
          <AuthCard onAuthSuccess={handleAuthSuccess} />
        </div>
      </div>
    )
  }

  if (activeQuizId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
        <button 
          onClick={() => setActiveQuizId(null)}
          className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors z-50"
        >
          <span className="sr-only">Exit Quiz</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        <QuizPlay 
          quizId={activeQuizId} 
          onComplete={handleQuizComplete} 
          onCancel={() => setActiveQuizId(null)} 
        />
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background selection:bg-zinc-200 dark:selection:bg-zinc-800">
        <DashboardSidebar 
          user={user} 
          activeTab={activeTab} 
          onNavigate={(tab) => {
            setActiveTab(tab)
            if (tab === "home") fetchData()
          }} 
        />
        <SidebarInset className="flex flex-col bg-muted/20">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur px-4 sticky top-0 z-10 transition-all">
            <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground transition-colors" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-sm font-bold tracking-tight uppercase text-muted-foreground">{activeTab}</h1>
            <div className="ml-auto flex items-center gap-4">
               <span className="text-sm font-medium hidden sm:inline-block">Welcome back, {user?.username}</span>
               <button 
                 onClick={handleLogout}
                 className="text-xs font-bold uppercase tracking-wider text-red-500 hover:text-red-600 transition-colors"
               >
                 Logout
               </button>
            </div>
          </header>
          
          <main className="flex-1 overflow-y-auto p-6 md:p-10 space-y-12 max-w-7xl mx-auto w-full">
            {activeTab === "home" && (
              <section>
                <div className="flex flex-col mb-8 text-center sm:text-left transition-all duration-300">
                  <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Available Quizzes</h2>
                  <p className="text-muted-foreground mt-1 font-medium">Challenge yourself with our curated list of topics.</p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {quizzes.length > 0 ? (
                    quizzes.map((quiz) => (
                      <QuizCard 
                        key={quiz.id} 
                        id={quiz.id}
                        title={quiz.title}
                        description={quiz.description}
                        category={quiz.category || "General"}
                        questionCount={quiz.Questions?.length || quiz.questions?.length || 0}
                        onTakeQuiz={(id) => setActiveQuizId(id)}
                      />
                    ))
                  ) : (
                    <div className="col-span-full p-20 text-center border-2 border-dashed rounded-2xl bg-muted/30">
                      <p className="text-muted-foreground font-semibold text-lg">No quizzes available yet.</p>
                      <button onClick={() => setActiveTab("create quiz")} className="mt-4 text-primary font-bold hover:underline underline-offset-4">
                        Create your first quiz now →
                      </button>
                    </div>
                  )}
                </div>
              </section>
            )}

            {activeTab === "my scores" && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col mb-8">
                  <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Recent Performance</h2>
                  <p className="text-muted-foreground mt-1 font-medium">Review your journey and celebrate your scores.</p>
                </div>
                <div className="rounded-xl border bg-card shadow-sm overflow-hidden min-h-[100px] flex items-stretch">
                  {results.length > 0 ? (
                      <ScoreTable scores={results} />
                  ) : (
                      <div className="flex-1 p-20 text-center text-muted-foreground flex flex-col items-center justify-center italic bg-muted/20 font-medium">
                          No recent results. Take your first quiz to see your performance!
                          <button onClick={() => setActiveTab("home")} className="mt-2 text-primary not-italic font-bold hover:underline">Browse Quizzes</button>
                      </div>
                  )}
                </div>
              </section>
            )}

            {activeTab === "create quiz" && (
              <section className="animate-in zoom-in-95 fade-in duration-300">
                <CreateQuiz 
                  onCreated={handleQuizCreated} 
                  onCancel={() => setActiveTab("home")} 
                />
              </section>
            )}

            {activeTab === "settings" && (
              <div className="p-20 text-center border-2 border-dashed rounded-2xl bg-muted/30">
                <h3 className="text-xl font-bold text-foreground capitalize">Settings Coming Soon</h3>
                <p className="text-muted-foreground mt-2 font-semibold">We're working hard to bring you this feature. Stay tuned!</p>
              </div>
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
