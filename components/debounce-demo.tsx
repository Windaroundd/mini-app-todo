"use client"

import { useState, useEffect } from "react"
import { useDebounce } from "@/hooks/useDebounce"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Clock, Zap } from "lucide-react"

interface SearchResult {
  id: number
  title: string
  description: string
}

// Mock API function
const mockSearchAPI = async (query: string): Promise<SearchResult[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  if (!query.trim()) return []

  const mockData: SearchResult[] = [
    { id: 1, title: "React Hooks Guide", description: "Learn about useState, useEffect, and custom hooks" },
    { id: 2, title: "Redux Toolkit Tutorial", description: "Modern Redux with Redux Toolkit" },
    { id: 3, title: "TypeScript Best Practices", description: "Writing better TypeScript code" },
    { id: 4, title: "Next.js App Router", description: "Building apps with Next.js 13+" },
    { id: 5, title: "Tailwind CSS Tips", description: "Utility-first CSS framework" },
  ]

  return mockData.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()),
  )
}

export default function DebounceDemo() {
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [apiCallCount, setApiCallCount] = useState(0)

  // Debounce the search term with 500ms delay
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsLoading(true)
      setApiCallCount((prev) => prev + 1)

      mockSearchAPI(debouncedSearchTerm)
        .then(setResults)
        .finally(() => setIsLoading(false))
    } else {
      setResults([])
    }
  }, [debouncedSearchTerm])

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <Search className="w-6 h-6" />
            useDebounce Hook Demo
          </CardTitle>
          <div className="flex justify-center gap-4 mt-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              API Calls: {apiCallCount}
            </Badge>
            <Badge variant={isLoading ? "default" : "secondary"} className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {isLoading ? "Loading..." : "Ready"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search for tutorials... (try 'react', 'redux', 'typescript')"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Debug Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded">
              <strong>Current Input:</strong>
              <div className="font-mono text-blue-600">"{searchTerm}"</div>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <strong>Debounced Value:</strong>
              <div className="font-mono text-green-600">"{debouncedSearchTerm}"</div>
            </div>
          </div>

          {/* Search Results */}
          <div className="space-y-3">
            {isLoading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Searching...</p>
              </div>
            )}

            {!isLoading && results.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-800">Search Results:</h3>
                {results.map((result) => (
                  <div key={result.id} className="p-3 border rounded-lg hover:bg-gray-50">
                    <h4 className="font-medium text-gray-800">{result.title}</h4>
                    <p className="text-sm text-gray-600">{result.description}</p>
                  </div>
                ))}
              </div>
            )}

            {!isLoading && searchTerm && results.length === 0 && debouncedSearchTerm && (
              <div className="text-center py-8 text-gray-500">No results found for "{debouncedSearchTerm}"</div>
            )}
          </div>

          {/* useDebounce Explanation */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">useDebounce Benefits:</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Reduces API calls by waiting for user to stop typing</li>
              <li>• Improves performance and user experience</li>
              <li>• Prevents spam requests to your backend</li>
              <li>• Customizable delay (500ms in this example)</li>
            </ul>
          </div>

          {/* Code Example */}
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono">
            <div className="text-green-400">// useDebounce Hook</div>
            <div className="text-blue-400">const</div> debouncedValue ={" "}
            <div className="text-yellow-400">useDebounce</div>(searchTerm, <div className="text-orange-400">500</div>)
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
