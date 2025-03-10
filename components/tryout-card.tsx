"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Users } from "lucide-react"
import type { Tryout } from "@/lib/api"
import Link from "next/link"
import { motion } from "framer-motion"

interface TryoutCardProps {
  tryout: Tryout
  index: number
}

export default function TryoutCard({ tryout, index }: TryoutCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className="overflow-hidden h-full flex flex-col transition-shadow hover:shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="hover:bg-secondary/80 transition-colors">
              {tryout.category}
            </Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-1 h-3.5 w-3.5" />
              <span>{tryout.createdAt}</span>
            </div>
          </div>
          <CardTitle className="mt-2 line-clamp-1">{tryout.title}</CardTitle>
          <CardDescription className="line-clamp-2">{tryout.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex justify-between text-sm">
            <div className="flex items-center">
              <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
              <span>{tryout.duration} mins</span>
            </div>
            <div className="flex items-center">
              <Users className="mr-1 h-4 w-4 text-muted-foreground" />
              <span>{tryout.participants} participants</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/50 px-6 py-3">
          <Button asChild className="w-full transition-all hover:scale-[1.02]">
            <Link href={`/tryouts/${tryout.id}`}>View Details</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

