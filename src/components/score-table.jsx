import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function ScoreTable({ scores }) {
  return (
    <Table>
      <TableCaption>A list of your recent quiz results.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Quiz</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Score</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {scores.map((score, index) => (
          <TableRow key={score.id || index}>
            <TableCell className="font-medium">{score.Quiz?.title || "Unknown Quiz"}</TableCell>
            <TableCell>{new Date(score.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>{Math.round(score.score)}%</TableCell>
            <TableCell className="text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                Review
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
