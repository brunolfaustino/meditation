import { Button } from "@/components/ui/button"

interface NumericKeypadProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
}

export function NumericKeypad({ value, onChange, onSubmit }: NumericKeypadProps) {
  const handleKeyPress = (key: string) => {
    if (value.length < 4) {
      onChange(value + key)
    }
  }

  const handleBackspace = () => {
    onChange(value.slice(0, -1))
  }

  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="text-center mb-4">
        <span className="text-4xl font-bold">{value.padStart(4, "0").replace(/(\d{2})(\d{2})/, "$1:$2")}</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Button key={num} onClick={() => handleKeyPress(num.toString())} variant="outline">
            {num}
          </Button>
        ))}
        <Button onClick={handleBackspace} variant="outline">
          ←
        </Button>
        <Button onClick={() => handleKeyPress("0")} variant="outline">
          0
        </Button>
        <Button onClick={onSubmit} variant="default">
          Set
        </Button>
      </div>
    </div>
  )
}

