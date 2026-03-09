import React from 'react';
import { PageHeader } from '../components/PageHeader';

const founderImage = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAx
NDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIy
MjIyMjIyMjL/wAARCADIAMgDASIAAhEBAxEB/8QAHQAAAQQDAQEAAAAAAAAAAAAABQYDBAcCAQj/xABHEAACAQIEAwUEBwYEBQUB
AAABAhEAAwQSITEFQVEGEyJhcYGRMqGxwdEHFCNS8BYjYnKCkqLxM1PC4fEWJENTY7PS/8QAGQEBAAMBAQAAAAAAAAAAAAAAAAEC
AwQF/8QAJhEBAAICAgICAgIDAQAAAAAAAAECEQMhEjEEQRMiUWEUMnGBsf/aAAwDAQACEQMRAD8A+rREQBERAEREAREQBERAERE
AREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREDx9/VotN1nWvYaQh0m81tQv6Ww4L0s0Fj0J7kKkKcQd7
0g8f8Ap3c7g7lM1L8x9qHfRr7Jv8AWz6QdSg8xq2e3l2mZ8pV1kmdSgk7D8q6nQ0uN7FhQ8q+M2h9y1r9z7ykm8aZbS3L6rS5hVJ0
0jJk7+1c2sVv7hdO5eL2sK9w1N+9v8A8B9U4Qz1B0Z2x2m0K6hLqH7xTq1Nw4zB2n7W4HjL0c6x4dB+2y7S9N1+Q4u8lHf0rNq7g
1k9i9Q4k6aQwNQqkzB7g9Q9a7Lq2mB0c0q9aT9p8eY6zY4eK1P6tQ1nZ+3tI+XqR1T4r6m6K5uK6i5jz7o0m3s7VwX1A2fH0r3
8mZ1m7uJ8fE6M2mJqM2Qh2V8yQeQfWt6L8S1M2k9j6uJk8r9S7f1rX+3N9q8uM7kU9nY1K0+Fqv7n6i1b7T6HjvM6ZfL2wT8Vx3
j3m7cY8N7p8zSx7a1w3Vw9g9QK6m8g4x2Jr7U1vLwL0pYcP5kqS7j0o6n1m6m1bVt1b2J0zvG2uY6tXQ9W8c8h0VY1S+oV3ZJdO
xVJX4m1fKqQqX4lJ0jNwBz8K4W5S1n3cZK0w1s0vWqjW5a9j9Q8tK6m5k8o7t2c6r2kM5dU9lQ6j2mR1wNn7V3z9Dk1m5W2xv6
y8Y9w8j0KXK0m4l1bS2p8T9N4j3l9g1cH6K7b2l+1dM0+S2r8V7V0rV1m0cZ6c2KqQy6i9J1I8xA9a9Jv+H0c8mL6u8Z2t7b0/
hV3u6qv4uV0m4b6S1nXGk7m8oXqKqS9iO1Xg7h1r5qv2Wn4y8X4v0N2j3Y6w3Z2m3k0q9y2rXKc2YV7hVQq0gZ2O7H1qX7a4e1v
U1c8T1V1G6fN7Qz7W6s7Hj1b4Zf2H2qX2J6+Wv0kV2h9Nn0o8m0b2u0WfY9t3j1K7j4m6l5eMZKfU1o4n7uW3W9l0fH8qRZkK6k
ZL+4q4X3Xz1v4Vf+Qm7k0dN5xW+06P1Y+Qv0qjYfP8A6u7k9m7v2Y6VnS3eS6r2m9mXKZ8vI8h3b9K6+M9tLw8m0+V6d3Nn6l8
WvN9v4o7L6f8AHv8AGrM7f9v9K/8Aqv8A2n8d8y+Y6m0m3c9t1r9b2h8qv+0x+H+f8Apb/4f/2Q==";

export const About = () => {
  return (
    <div className="pt-16 md:pt-20">
      <PageHeader 
        title="Forward-Thinking Digital Solutions."
        subtitle="About Apex Digital Consultants"
        description="Apex Digital Consultants is a forward-thinking digital solutions company dedicated to helping businesses establish, grow, and optimize their online presence."
      />

      {/* Mission / Details */}
      <section className="section-padding bg-apple-gray-50">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200" 
                alt="Our Mission" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="space-y-8 md:space-y-10">
              <h2 className="heading-lg leading-tight">Our Approach</h2>

              <p className="text-lg text-apple-gray-300 leading-8">
                The company specializes in delivering strategic digital services including website development, branding and logo design, digital marketing solutions, and custom digital tools that empower businesses to operate more efficiently in the modern digital landscape.
              </p>

              <p className="text-lg text-apple-gray-300 leading-8">
                At Apex Digital Consultants, the focus is on combining creativity, technology, and practical business strategy to produce solutions that not only look exceptional but also deliver measurable results. From professional websites and brand identities to custom digital solutions and automation tools, the company works with businesses to build strong digital foundations that support long-term growth.
              </p>

              <p className="text-lg text-apple-gray-300 leading-8">
                Apex Digital Consultants takes a client-focused approach to every project, ensuring that each solution is tailored to the unique goals and needs of the business it serves. By prioritizing quality, innovation, and reliability, the company aims to provide digital solutions that help organizations strengthen their brand, improve customer engagement, and unlock new opportunities online.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="order-2 lg:order-1 space-y-8 md:space-y-10">
              <span className="text-sm font-semibold tracking-widest text-apex-yellow uppercase block">
                The Visionary
              </span>

              <h2 className="heading-lg leading-tight">
                Meet Our Founder
              </h2>

              <p className="text-lg text-apple-gray-300 leading-8">
                Apex Digital Consultants was founded by Reco Alleyne, a digital strategist and technology professional with a passion for helping businesses leverage digital platforms to achieve meaningful growth.
              </p>

              <p className="text-lg text-apple-gray-300 leading-8">
                Reco established Apex Digital Consultants with the vision of creating a company that bridges the gap between technology and business strategy. With experience managing digital projects, building online platforms, and implementing practical digital solutions, he recognized the growing need for businesses to have access to reliable expertise that could guide them through the evolving digital landscape.
              </p>

              <p className="text-lg text-apple-gray-300 leading-8">
                Under Reco’s leadership, Apex Digital Consultants focuses on delivering high-quality digital services that combine thoughtful design, smart technology, and strategic insight. His commitment to innovation and continuous improvement drives the company’s mission to provide modern digital solutions that enable businesses to compete effectively in an increasingly digital world.
              </p>
            </div>

            <div className="order-1 lg:order-2 relative">
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative z-10">
                <img 
                  src={founderImage}
                  alt="Reco Alleyne - Founder" 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-apex-yellow/10 rounded-full blur-3xl -z-0" />
              <div className="absolute top-12 -left-12 w-24 h-24 border-t-2 border-l-2 border-apex-yellow rounded-tl-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-apple-gray-500 text-white">
        <div className="container-wide">
          <div className="text-center mb-14 md:mb-16">
            <h2 className="heading-lg mb-6">
              Our Core Values
            </h2>
            <p className="text-apple-gray-200 max-w-2xl mx-auto leading-8">
              The principles that guide every project we deliver and every partnership we build.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            <div className="space-y-5">
              <h3 className="text-2xl font-bold text-apex-yellow">Strategy</h3>
              <p className="text-apple-gray-200 leading-8">
                We don't just execute; we plan. Every move is backed by data and market analysis.
              </p>
            </div>

            <div className="space-y-5">
              <h3 className="text-2xl font-bold text-apex-yellow">Creativity</h3>
              <p className="text-apple-gray-200 leading-8">
                We bring fresh perspectives and innovative designs that make your brand stand out.
              </p>
            </div>

            <div className="space-y-5">
              <h3 className="text-2xl font-bold text-apex-yellow">Precision</h3>
              <p className="text-apple-gray-200 leading-8">
                Attention to detail is at the core of everything we do, from code to copy.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};