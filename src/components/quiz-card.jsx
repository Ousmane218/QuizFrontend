import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function QuizCard({ id, title, description, category, questionCount, onTakeQuiz }) {
  return (
    <Card className="flex flex-col border-border shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-xl font-bold tracking-tight">{title}</CardTitle>
          <Badge variant="secondary" className="px-2 py-0.5 text-[10px] sm:text-xs">
            {category}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2 text-zinc-500 dark:text-zinc-400">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pb-6 pt-0">
        <p className="text-sm font-medium text-muted-foreground">
          {questionCount} Questions
        </p>
      </CardContent>
      <CardFooter className="pt-0 pb-6 pr-6 pl-6">
        <Button 
          className="w-full font-bold bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          onClick={() => onTakeQuiz && onTakeQuiz(id)}
        >
          Take Quiz
        </Button>
      </CardFooter>
    </Card>
  )
}
