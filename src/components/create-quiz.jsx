import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Plus, Trash2, CheckCircle2, Circle } from "lucide-react"
import api from "@/lib/api"

export function CreateQuiz({ onCreated, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    questions: [
      {
        text: "",
        answers: [
          { text: "", isCorrect: true },
          { text: "", isCorrect: false }
        ]
      }
    ]
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          text: "",
          answers: [
            { text: "", isCorrect: true },
            { text: "", isCorrect: false }
          ]
        }
      ]
    })
  }

  const removeQuestion = (qIndex) => {
    if (formData.questions.length === 1) return
    const newQuestions = formData.questions.filter((_, i) => i !== qIndex)
    setFormData({ ...formData, questions: newQuestions })
  }

  const addAnswer = (qIndex) => {
    const newQuestions = [...formData.questions]
    newQuestions[qIndex].answers.push({ text: "", isCorrect: false })
    setFormData({ ...formData, questions: newQuestions })
  }

  const removeAnswer = (qIndex, aIndex) => {
    if (formData.questions[qIndex].answers.length === 2) return
    const newQuestions = [...formData.questions]
    newQuestions[qIndex].answers = newQuestions[qIndex].answers.filter((_, i) => i !== aIndex)
    setFormData({ ...formData, questions: newQuestions })
  }

  const updateQuestionText = (qIndex, text) => {
    const newQuestions = [...formData.questions]
    newQuestions[qIndex].text = text
    setFormData({ ...formData, questions: newQuestions })
  }

  const updateAnswerText = (qIndex, aIndex, text) => {
    const newQuestions = [...formData.questions]
    newQuestions[qIndex].answers[aIndex].text = text
    setFormData({ ...formData, questions: newQuestions })
  }

  const setCorrectAnswer = (qIndex, aIndex) => {
    const newQuestions = [...formData.questions]
    newQuestions[qIndex].answers = newQuestions[qIndex].answers.map((a, i) => ({
      ...a,
      isCorrect: i === aIndex
    }))
    setFormData({ ...formData, questions: newQuestions })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await api.post("/api/quizzes", formData)
      if (onCreated) onCreated()
    } catch (_err) {
      setError("Failed to create quiz. Please check fields.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg border-border">
      <form onSubmit={handleSubmit}>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">Create New Quiz</CardTitle>
          <CardDescription>Define your challenge with titles, descriptions, and questions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {error && <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm font-medium">{error}</div>}
          
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Quiz Title</Label>
              <Input 
                id="title" 
                placeholder="e.g. React Fundamentals" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input 
                id="description" 
                placeholder="Briefly explain what this quiz covers" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Questions</h3>
              <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
                <Plus className="mr-2 h-4 w-4" /> Add Question
              </Button>
            </div>

            {formData.questions.map((q, qIndex) => (
              <div key={qIndex} className="p-6 rounded-xl border bg-muted/50 space-y-4 relative group">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeQuestion(qIndex)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                
                <div className="grid gap-2">
                  <Label>Question {qIndex + 1}</Label>
                  <Input 
                    placeholder="Enter question text" 
                    value={q.text}
                    onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {q.answers.map((a, aIndex) => (
                    <div key={aIndex} className="flex items-center gap-2">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className={a.isCorrect ? "text-primary" : "text-muted-foreground"}
                        onClick={() => setCorrectAnswer(qIndex, aIndex)}
                      >
                        {a.isCorrect ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                      </Button>
                      <Input 
                        placeholder={`Option ${aIndex + 1}`} 
                        value={a.text}
                        onChange={(e) => updateAnswerText(qIndex, aIndex, e.target.value)}
                        className={a.isCorrect ? "border-primary/50 bg-primary/5" : ""}
                        required
                      />
                      {q.answers.length > 2 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeAnswer(qIndex, aIndex)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="ghost" size="sm" className="h-9 border-dashed border-2" onClick={() => addAnswer(qIndex)}>
                    <Plus className="mr-2 h-3 w-3" /> Add Option
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-6">
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Save Quiz"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
