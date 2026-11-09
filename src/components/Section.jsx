import React, { useEffect, useRef } from 'react';

export default function Section({ id, children, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(node);

    return () => {
      observer.unobserve(node);
    };
  }, []);

  return (
    <section
      id={id}
      ref={ref}
      className={`reveal-section scroll-mt-20 md:scroll-mt-24 py-16 md:py-24 relative ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        {children}
      </div>
    </section>
  );
}
