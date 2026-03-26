import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Trophy, Loader2 } from "lucide-react"
import api from "@/lib/api"

export function Leaderboard() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true)
        const response = await api.get("/api/leaderboard")
        setData(response.data)
        setError(null)
      } catch (err) {
        console.error("Error fetching leaderboard:", err)
        setError("Failed to load leaderboard data.")
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium animate-pulse">Fetching global rankings...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-10 text-center border-2 border-dashed border-red-200 rounded-2xl bg-red-50/30">
        <p className="text-red-500 font-semibold">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 text-sm font-bold text-red-600 hover:underline"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col mb-2">
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Global Leaderboard</h2>
        <p className="text-muted-foreground mt-1 font-medium">See how you stack up against the best learners in the community.</p>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="w-[100px] font-bold">Rank</TableHead>
              <TableHead className="font-bold">User</TableHead>
              <TableHead className="text-center font-bold">Quizzes Taken</TableHead>
              <TableHead className="text-right font-bold">Global Score (%)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((entry, index) => (
                <TableRow key={entry.id || index} className="group transition-colors">
                  <TableCell className="font-bold">
                    <div className="flex items-center gap-2">
                      <span>#{index + 1}</span>
                      {index === 0 && <Trophy className="h-4 w-4 text-yellow-500 fill-yellow-500/20" />}
                      {index === 1 && <Trophy className="h-4 w-4 text-slate-400 fill-slate-400/20" />}
                      {index === 2 && <Trophy className="h-4 w-4 text-amber-600 fill-amber-600/20" />}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500 uppercase border border-border">
                        {entry.User?.username?.charAt(0) || "U"}
                      </div>
                      <span className="font-semibold group-hover:text-primary transition-colors">
                        {entry.User?.username || "Anonymous"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-medium">{entry.quizzesTaken}</TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">
                      {parseFloat(entry.avgScore || 0).toFixed(1)}%
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground italic font-medium">
                  No rankings available yet. Be the first to take a quiz!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
