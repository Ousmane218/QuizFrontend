import { useState, useEffect } from "react"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ChevronLeft, ChevronRight, CheckCircle2, Trophy, ArrowLeft, Loader2, RotateCcw, Home } from "lucide-react"

export function QuizPlay({ quizId, onComplete, onCancel }) {
  const [quiz, setQuiz] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({}) // { questionId: answerId }
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [score, setScore] = useState(null)

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await api.get(`/api/quizzes/${quizId}`)
        setQuiz(data)
      } catch (_err) {
        setError("Failed to load quiz questions")
      } finally {
        setLoading(false)
      }
    }
    fetchQuiz()
  }, [quizId])

  const handleAnswerSelect = (answerId) => {
    const questions = quiz.Questions || quiz.questions || []
    const questionId = questions[currentQuestionIndex].id
    setAnswers({ ...answers, [questionId]: answerId })
  }

  const handleFinish = async () => {
    setSubmitting(true)
    try {
      // Format answers as an array of { questionId, answerId }
      const submission = Object.entries(answers).map(([questionId, answerId]) => ({
        questionId: parseInt(questionId),
        answerId: parseInt(answerId),
      }))

      const { data } = await api.post(`/api/quizzes/${quizId}/submit`, { userAnswers: submission })
      setScore(data.score)
    } catch (_err) {
      setError("Failed to submit quiz results")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="p-8 text-center text-muted-foreground transition-all animate-pulse">Loading quiz details...</div>
  if (error) return <div className="p-8 text-center text-destructive">{error}</div>
  
  const questions = quiz?.Questions || quiz?.questions || []
  if (!quiz || !questions.length) return <div className="p-8 text-center">No questions found for this quiz.</div>
  
  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const selectedAnswerId = answers[currentQuestion.id]

  if (score !== null) {
    return (
      <Card className="w-full max-w-md mx-auto border-border shadow-xl animate-in fade-in zoom-in duration-300">
        <CardHeader className="text-center pt-10 pb-6 border-b bg-muted/30">
          <div className="flex justify-center mb-4">
            {score >= 50 ? (
              <div className="bg-primary/10 p-4 rounded-full ring-8 ring-primary/5">
                <Trophy className="h-16 w-16 text-primary animate-bounce" />
              </div>
            ) : (
              <div className="bg-muted p-4 rounded-full">
                <CheckCircle2 className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">Quiz Complete!</CardTitle>
          <CardDescription className="text-lg mt-1 font-medium italic">
            {score >= 50 ? "Excellent work!" : "Keep practicing!"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-10 pb-10 text-center space-y-4">
          <div className="space-y-1">
            <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Your Score</span>
            <div className="text-7xl font-black tracking-tighter text-foreground drop-shadow-sm">
              {Math.round(score)}%
            </div>
          </div>
          <p className="text-muted-foreground max-w-[250px] mx-auto text-sm leading-relaxed">
            You've completed <strong>{quiz.title}</strong>. Your results have been saved to your profile.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 p-6 border-t bg-muted/30">
          <div className="grid grid-cols-2 gap-3 w-full">
            <Button 
              variant="outline"
              onClick={() => {
                setScore(null)
                setCurrentQuestionIndex(0)
                setAnswers({})
                setError(null)
              }} 
              className="font-bold border-2 hover:bg-muted"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Retry Quiz
            </Button>
            <Button 
              onClick={() => onComplete && onComplete()} 
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-md"
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </div>
        </CardFooter>
      </Card>
    )
  }

  if (submitting) {
    return (
      <Card className="w-full max-w-md mx-auto border-border shadow-lg p-12 flex flex-col items-center justify-center space-y-6">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold">Calculating Score...</h3>
          <p className="text-muted-foreground text-sm">Hold tight, we're checking your answers.</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto border-border shadow-lg">
      <CardHeader className="border-b bg-muted/50">
        <div className="flex justify-between items-center mb-2">
          <CardTitle className="text-xl font-bold">{quiz.title}</CardTitle>
          <span className="text-sm font-medium text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-full">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>
        <CardDescription className="text-muted-foreground">
          Select the best answer for the question below.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-8 pb-8 space-y-6">
        <h3 className="text-lg font-semibold leading-relaxed text-foreground">
          {currentQuestion.text}
        </h3>
        <RadioGroup 
          value={selectedAnswerId?.toString()} 
          onValueChange={(val) => handleAnswerSelect(parseInt(val))}
          className="grid gap-3"
        >
          {(currentQuestion.Answers || currentQuestion.answers || []).map((answer) => (
            <div 
              key={answer.id}
              className={`flex items-center space-x-3 p-4 rounded-xl border transition-all cursor-pointer hover:border-ring/40 ${
                selectedAnswerId === answer.id 
                ? "border-primary bg-primary/5 shadow-sm" 
                : "border-border"
              }`}
              onClick={() => handleAnswerSelect(answer.id)}
            >
              <RadioGroupItem value={answer.id.toString()} id={`ans-${answer.id}`} className="mt-0.5" />
              <Label htmlFor={`ans-${answer.id}`} className="flex-1 cursor-pointer font-medium leading-tight text-foreground/80">
                {answer.text}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-6 bg-muted/30">
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="hover:bg-muted"
        >
          Cancel
        </Button>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
            className="hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Prev
          </Button>
          {isLastQuestion ? (
            <Button 
              onClick={handleFinish} 
              disabled={submitting || !selectedAnswerId}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6 border-2 border-primary/20 shadow-sm"
            >
              Submit Quiz
              <CheckCircle2 className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
              disabled={!selectedAnswerId}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
