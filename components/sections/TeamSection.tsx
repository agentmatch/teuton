'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import { FiLinkedin, FiMail } from 'react-icons/fi'

const team = [
  {
    name: 'Dr. Sarah Mitchell',
    role: 'Chief Executive Officer',
    bio: 'With over 25 years in mineral exploration, Dr. Mitchell leads Luxor Metals with vision and expertise.',
    image: '/images/team/ceo.jpg',
    linkedin: '#',
    email: 'smitchell@luxormetals.com',
  },
  {
    name: 'James Chen',
    role: 'Chief Operating Officer',
    bio: 'James brings 20 years of operational excellence in mining projects across four continents.',
    image: '/images/team/coo.jpg',
    linkedin: '#',
    email: 'jchen@luxormetals.com',
  },
  {
    name: 'Maria Rodriguez',
    role: 'VP of Exploration',
    bio: 'A renowned geologist, Maria has discovered multiple world-class mineral deposits.',
    image: '/images/team/vp-exploration.jpg',
    linkedin: '#',
    email: 'mrodriguez@luxormetals.com',
  },
  {
    name: 'David Thompson',
    role: 'Chief Financial Officer',
    bio: 'David ensures financial excellence with his extensive background in mining finance.',
    image: '/images/team/cfo.jpg',
    linkedin: '#',
    email: 'dthompson@luxormetals.com',
  },
]

export function TeamSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section id="leadership" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-primary">
              Leadership
            </span>{' '}
            <span className="text-foreground">Team</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Meet the experienced professionals driving Luxor Metals forward
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group"
            >
              <div className="bento bento-hover overflow-hidden">
                <div className="relative h-80 bg-muted">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {member.name}
                    </h3>
                    <p className="text-primary">{member.role}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-muted-foreground mb-4">
                    {member.bio}
                  </p>
                  
                  <div className="flex gap-4">
                    <a
                      href={member.linkedin}
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label={`${member.name} LinkedIn`}
                    >
                      <FiLinkedin className="w-5 h-5" />
                    </a>
                    <a
                      href={`mailto:${member.email}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label={`Email ${member.name}`}
                    >
                      <FiMail className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}