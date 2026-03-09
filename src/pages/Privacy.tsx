
import React from 'react';

import { PageHeader } from '../components/PageHeader';

export const Privacy = () => {
  return (
    <div className="pt-12">
      <PageHeader 
        title="Privacy Policy"
        description="At APEX Digital Marketing & Consulting, we are committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your personal information."
      />
      <section className="section-padding">
        <div className="container-wide max-w-4xl">
          <div className="prose prose-lg prose-apple max-w-none text-apple-gray-300 leading-relaxed space-y-8">
            <p>At APEX Digital Marketing & Consulting, we are committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your personal information.</p>
            <section>
              <h2 className="text-2xl font-bold text-apple-gray-500 mb-4">Information Collection</h2>
              <p>We collect information that you provide directly to us, such as when you fill out a contact form, book a session, or communicate with us via email.</p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-apple-gray-500 mb-4">Use of Information</h2>
              <p>We use the information we collect to provide and improve our services, communicate with you, and send you relevant updates if you have opted in to receive them.</p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-apple-gray-500 mb-4">Data Security</h2>
              <p>We implement industry-standard security measures to protect your data from unauthorized access, disclosure, or alteration.</p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-apple-gray-500 mb-4">Your Rights</h2>
              <p>You have the right to access, correct, or delete your personal information. Please contact us at info@apexdigitalconsultants.com to exercise these rights.</p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
};
