
import React from 'react';

import { PageHeader } from '../components/PageHeader';

export const Terms = () => {
  return (
    <div className="pt-12">
      <PageHeader 
        title="Terms & Conditions"
        description="By accessing and using the services provided by APEX Digital Marketing & Consulting, you agree to be bound by these Terms & Conditions."
      />
      <section className="section-padding">
        <div className="container-wide max-w-4xl">
          <div className="prose prose-lg prose-apple max-w-none text-apple-gray-300 leading-relaxed space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-apple-gray-500 mb-4">1. Acceptance of Terms</h2>
              <p>By accessing and using the services provided by APEX Digital Marketing & Consulting, you agree to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use our services.</p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-apple-gray-500 mb-4">2. Services Provided</h2>
              <p>APEX provides digital marketing, website design, business consulting, and brand development services. The specific scope of work for any project will be outlined in a separate agreement or proposal.</p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-apple-gray-500 mb-4">3. Payment Terms</h2>
              <p>Payment for services is required as outlined in the project proposal. Consulting sessions must be paid for in advance of the scheduled time.</p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-apple-gray-500 mb-4">4. Intellectual Property</h2>
              <p>Unless otherwise agreed, all creative work produced by APEX remains the intellectual property of APEX until full payment is received, at which point ownership of the final deliverables is transferred to the client.</p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
};
