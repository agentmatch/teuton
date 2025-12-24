'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { FiCalendar, FiArrowRight } from 'react-icons/fi'

const news = [
  {
    id: 1,
    title: 'Luxor Metals Announces Major Gold Discovery at Aurora Project',
    excerpt: 'Initial drilling results show significant high-grade gold mineralization extending over 500 meters.',
    date: '2024-01-15',
    category: 'Exploration Update',
  },
  {
    id: 2,
    title: 'Strategic Partnership with Global Mining Technologies Inc.',
    excerpt: 'New collaboration to implement AI-driven exploration techniques across all projects.',
    date: '2024-01-10',
    category: 'Corporate News',
  },
  {
    id: 3,
    title: 'Q4 2023 Financial Results Exceed Expectations',
    excerpt: 'Strong operational performance drives record quarterly revenue and expanded exploration budget.',
    date: '2024-01-05',
    category: 'Financial Update',
  },
]

export function NewsSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient from-primary-500 to-primary-700">
              Latest
            </span>{' '}
            <span className="text-gray-900 dark:text-white">News</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Stay updated with our latest discoveries, corporate updates, and industry insights
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group"
            >
              <div className="glass rounded-2xl p-6 h-full flex flex-col hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <FiCalendar className="w-4 h-4" />
                  <time dateTime={article.date}>
                    {new Date(article.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
                
                <span className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm mb-4 self-start">
                  {article.category}
                </span>
                
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">
                  {article.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">
                  {article.excerpt}
                </p>
                
                <Link
                  href={`/news/${article.id}`}
                  className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:gap-3 transition-all"
                >
                  Read More <FiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link href="/news">
            <Button size="lg" variant="outline">
              View All News
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}