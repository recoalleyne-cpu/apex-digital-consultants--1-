
import DigitalSolutionsCatalog from '../components/DigitalSolutionsCatalog';
import { PageHeader } from '../components/PageHeader';

export const DigitalSolutions = () => {
  return (
    <div className="pt-12">
      <PageHeader
        title="Digital Solutions for Modern Business Growth."
        subtitle="Tailored tools & workflows"
        description="Practical digital tools, automation, customer experiences, and business systems designed to help your organisation move faster and work smarter."
      />
      <DigitalSolutionsCatalog />
    </div>
  );
};
