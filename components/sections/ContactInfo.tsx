'use client'

import { motion } from 'framer-motion'
import { FiMail, FiPhone, FiMapPin, FiClock } from 'react-icons/fi'

export function ContactInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="space-y-8"
    >
      <div>
        <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
          Contact Information
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
              <FiMapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">Head Office</h4>
              <p className="text-gray-600 dark:text-gray-400">
                2130 Crescent Road<br />
                Victoria, BC, V8S 2H3<br />
                Canada
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
              <FiPhone className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">Phone</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Main: +1 (604) 555-0123<br />
                Investor Relations: +1 (604) 555-0124
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
              <FiMail className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">Email</h4>
              <p className="text-gray-600 dark:text-gray-400">
                General: info@luxormetals.com<br />
                Investors: ir@luxormetals.com<br />
                Media: media@luxormetals.com
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
              <FiClock className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">Office Hours</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Monday - Friday: 8:00 AM - 6:00 PM EST<br />
                Saturday - Sunday: Closed
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="glass rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
          Quick Response Time
        </h4>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          We typically respond to all inquiries within 24-48 business hours. For urgent matters,
          please call our main office directly.
        </p>
      </div>
    </motion.div>
  )
}