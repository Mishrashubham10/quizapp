import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import PageWrapper from '../../components/PageWrapper';

export default function CountdownPage() {
  const navigate = useNavigate();

  const [count, setCount] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (count < 0) {
      navigate('/quiz');
    }
  }, [count, navigate]);

  return (
    <PageWrapper>
      <div className="text-center">
        <h1 className="text-8xl font-bold text-cyan-400">
          {count > 0 ? count : 'GO!'}
        </h1>
      </div>
    </PageWrapper>
  );
}