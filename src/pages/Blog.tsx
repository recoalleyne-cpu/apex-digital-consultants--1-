
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User } from 'lucide-react';

import { PageHeader } from '../components/PageHeader';

export const Blog = () => {
  const posts = [
    {
      title: 'AI in Caribbean Healthcare: Improving Patient Care and Streamlining Medical Services',
      excerpt: 'Exploring how artificial intelligence is revolutionizing healthcare delivery across the Caribbean region.',
      date: 'March 15, 2026',
      author: 'Tamika Williams',
      category: 'Healthcare',
      img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Boosting Caribbean E-Commerce with AI: Strategies for Increasing Sales and Customer Engagement',
      excerpt: 'How local businesses can leverage AI to compete in the global e-commerce landscape.',
      date: 'March 10, 2026',
      author: 'Tamika Williams',
      category: 'E-Commerce',
      img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'AI and Education in the Caribbean: How Technology is Enhancing Learning and Access to Resources',
      excerpt: 'The role of AI in bridging the educational gap and providing better resources for Caribbean students.',
      date: 'March 5, 2026',
      author: 'Tamika Williams',
      category: 'Education',
      img: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800'
    }
  ];

  return (
    <div className="pt-12">
      <PageHeader 
        title="The APEX Journal."
        subtitle="Insights"
        description="Expert perspectives on digital strategy, design, and business innovation."
      />

      <section className="pb-24">
        <div className="container-wide px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {posts.map((post, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="aspect-[16/10] rounded-[2.5rem] overflow-hidden mb-8 bg-apple-gray-50">
                  <img 
                    src={post.img} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="px-4">
                  <div className="flex items-center gap-4 text-xs font-bold text-apple-gray-300 uppercase tracking-widest mb-4">
                    <span>{post.category}</span>
                    <span className="w-1 h-1 rounded-full bg-apple-gray-200" />
                    <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-apple-gray-300 transition-colors leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-apple-gray-300 leading-relaxed mb-6 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <div className="w-6 h-6 rounded-full bg-apple-gray-100 flex items-center justify-center">
                        <User size={12} />
                      </div>
                      {post.author}
                    </div>
                    <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
