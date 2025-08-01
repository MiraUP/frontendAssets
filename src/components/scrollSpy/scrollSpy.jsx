import React, { useState, useEffect, useRef } from 'react';
import { Tabs, Tab, Paper } from '@mui/material';
import styles from './_scrollSpy.module.scss';

const ScrollSpy = ({ sections }) => {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || '');
  const observerRef = useRef(null);
  const scrollingRef = useRef(false);

  // Configura o IntersectionObserver
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: [0.25, 0.5, 0.75], rootMargin: '-100px 0px -40% 0px' },
    );

    // Observa todas as seções existentes na página
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [sections]);

  // Rola até a seção quando um Tab é clicado
  const handleTabClick = (sectionId) => {
    scrollingRef.current = true;
    const element = document.getElementById(sectionId);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }

    setTimeout(() => {
      scrollingRef.current = false;
    }, 1000);
  };

  return (
    <Paper
      className={`${styles.scrollSpy} ${styles.scrollSpyRight}`}
      elevation={0}
    >
      <Tabs
        value={activeSection}
        onChange={(_, newValue) => handleTabClick(newValue)}
        centered
        indicatorColor="primary"
        textColor="primary"
        orientation="vertical"
      >
        {sections.map((section) => (
          <Tab
            key={section.id}
            label={<span className="label">{section.label}</span>}
            value={section.id}
            disableRipple
          />
        ))}
      </Tabs>
    </Paper>
  );
};

export default ScrollSpy;
