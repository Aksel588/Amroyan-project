import { useEffect } from 'react';
import ArmenianPayrollCalculator from '@/components/calculators/ArmenianPayrollCalculator';

const ArmenianPayrollPage = () => {
  useEffect(() => {
    document.title = 'Հայաստանի աշխատավարձի հաշվիչ | Amroyan Consulting';
    const desc = 'Հաշվեք կեղտոտ/մաքուր աշխատավարձը՝ եկամտահարկ, սոցիալական վճարներ և դրոշմանիշային վճար: Armenian payroll calculator with complex tax calculations.';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { 
      meta = document.createElement('meta'); 
      meta.setAttribute('name', 'description'); 
      document.head.appendChild(meta); 
    }
    meta.setAttribute('content', desc);
    
    // Set keywords
    const keywords = 'հայաստան, աշխատավարձ, հաշվիչ, եկամտահարկ, սոցիալական վճար, դրոշմանիշային վճար, payroll, tax calculator, Armenia';
    let keywordsMeta = document.querySelector('meta[name="keywords"]');
    if (!keywordsMeta) { 
      keywordsMeta = document.createElement('meta'); 
      keywordsMeta.setAttribute('name', 'keywords'); 
      document.head.appendChild(keywordsMeta); 
    }
    keywordsMeta.setAttribute('content', keywords);
  }, []);

  return <ArmenianPayrollCalculator />;
};

export default ArmenianPayrollPage;
