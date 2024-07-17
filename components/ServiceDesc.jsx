import { Link } from 'react-router-dom'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function ServiceDesc({ card_title, description }) {
    return (
        <div className="flex flex-col justify-center items-center gap-5 w-80 h-80 bg-white border-2 border-orange-200 rounded-3xl">
            <CardHeader>
                <CardTitle>{card_title}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription className="text-center">{description}</CardDescription>
            </CardContent>
            <CardFooter>
                <Button className="text-white bg-indigo-500" variant="outline" asChild>
                    <Link to="/latency">Start here</Link>
                </Button>
            </CardFooter>
        </div>
    )
}