import { Landmark } from 'lucide-react';

const TaxCard = ({ estimatedTax, effectiveRate }) => {
  return (
    <div className="glass-card flex flex-col gap-4 bg-gradient-to-br from-primary to-secondary border-transparent">
      <div className="flex justify-between items-center">
        <h3 className="text-white/90 text-base font-medium m-0">
          Est. Tax Liability (FY 24-25)
        </h3>
        <div className="bg-white/20 p-2 rounded-full text-white">
          <Landmark size={20} />
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-bold m-0 text-white">
          ₹{(estimatedTax || 0).toLocaleString('en-IN')}
        </h2>
        <p className="text-white/80 text-sm mt-1">
          Effective Tax Rate: {effectiveRate || 0}%
        </p>
      </div>
    </div>
  );
};

export default TaxCard;
