import Image from "next/image"
import { Quote } from "lucide-react"

interface TestimonialProps {
  quote: string
  author: string
  role: string
  avatar: string
}

const Testimonial = ({ quote, author, role, avatar }: TestimonialProps) => {
  return (
    <div className="glass-effect rounded-lg p-6 transition-all duration-300 hover:translate-y-[-5px]">
      <Quote className="h-8 w-8 text-primary/50 mb-4" />
      <p className="mb-6 text-muted-foreground">{quote}</p>
      <div className="flex items-center">
        <div className="relative h-10 w-10 mr-3 overflow-hidden rounded-full">
          <Image src={avatar || "/placeholder.svg"} alt={author} fill className="object-cover" />
        </div>
        <div>
          <h4 className="font-medium">{author}</h4>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
    </div>
  )
}

export default Testimonial
