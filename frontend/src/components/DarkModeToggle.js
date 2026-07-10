import React from 'react';
import { useTheme } from '../context/ThemeContext';
import styles from './DarkModeToggle.module.css';

const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      className={styles.toggle}
      onClick={toggleDarkMode}
      aria-label="Toggle dark mode"
      title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <i className={`bi ${darkMode ? 'bi-sun-fill' : 'bi-moon-fill'}`}></i>
    </button>
  );
};

export default DarkModeToggle;
