import React, { useEffect, useState } from "react";
import { PageHeader } from "../components/PageHeader";

type MediaItem = {
  id: number;
  title: string;
  file_url: string;
};

export const About = () => {
  const [founderImage, setFounderImage] = useState<string | null>(null);

  useEffect(() => {
    const loadFounderImage = async () => {
      try {
        const res = await fetch("/api/media?placement=about-founder-image");
        const data = await res.json();

        if (data?.items?.length) {
          setFounderImage(data.items[0].file_url);
        }
      } catch (err) {
        console.warn("Failed to load founder image", err);
      }
    };

    loadFounderImage();
  }, []);

  return (
    <div className="pt-12">
      <PageHeader
        title="About Apex Digital Consultants"
        subtitle="Our Story"
        description="Helping businesses grow through modern digital solutions and strategic design."
      />

      <section className="section-padding">
        <div className="container-wide grid md:grid-cols-2 gap-16 items-center">

          <div>
            {founderImage ? (
              <img
                src={founderImage}
                alt="Founder"
                className="rounded-3xl shadow-xl w-full object-cover"
              />
            ) : (
              <div className="rounded-3xl bg-apple-gray-100 h-[400px] flex items-center justify-center">
                <span className="text-apple-gray-400">Founder Image</span>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h2 className="heading-lg">Meet the Founder</h2>

            <p className="text-lg text-apple-gray-300 leading-relaxed">
              Apex Digital Consultants was founded with a simple mission: to help businesses grow through modern digital solutions, strategic design, and powerful automation tools.
            </p>

            <p className="text-lg text-apple-gray-300 leading-relaxed">
              With a strong background in digital marketing, web development, and business strategy, we work closely with organizations across the Caribbean and beyond to create impactful digital experiences.
            </p>

            <p className="text-lg text-apple-gray-300 leading-relaxed">
              Our focus is not just building websites — it’s building scalable digital systems that support long-term business growth.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
};