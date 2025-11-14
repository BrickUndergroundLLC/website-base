import React from 'react'

export interface TestimonialBlockData {
  quote: string
  author: string
  role: string
  company: string
  image?: string
  rating?: number
}

interface TestimonialBlockProps {
  data: TestimonialBlockData
}

export const TestimonialBlock: React.FC<TestimonialBlockProps> = ({ data }) => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 my-6 shadow-md">
      {/* Rating */}
      {data.rating && (
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 ${i < data.rating! ? 'text-yellow-400' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      )}
      
      {/* Quote */}
      <blockquote className="text-xl italic text-gray-700 mb-6 relative">
        <span className="text-5xl text-primary-600 absolute -top-2 -left-2 opacity-30">"</span>
        <p className="relative z-10">{data.quote}</p>
      </blockquote>
      
      {/* Author Info */}
      <div className="flex items-center gap-4 border-t border-gray-200 pt-4">
        {data.image && (
          <img 
            src={data.image} 
            alt={data.author}
            className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
          />
        )}
        <div>
          <div className="font-bold text-gray-900 text-lg">{data.author}</div>
          <div className="text-sm text-gray-600">
            {data.role} {data.company && `at ${data.company}`}
          </div>
        </div>
      </div>
    </div>
  )
}

