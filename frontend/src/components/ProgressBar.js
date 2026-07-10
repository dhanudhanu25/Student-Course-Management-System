import React from 'react';
import styles from './ProgressBar.module.css';

const ProgressBar = ({ progress, label, showLabel = true, size = 'md' }) => {
  const clampedProgress = Math.min(100, Math.max(0, progress || 0));

  return (
    <div className={styles.wrapper}>
      {showLabel && (
        <div className={styles.labelRow}>
          {label && <span className={styles.label}>{label}</span>}
          <span className={styles.percent}>{clampedProgress}%</span>
        </div>
      )}
      <div className={`${styles.track} ${styles[size]}`}>
        <div
          className={styles.fill}
          style={{ width: `${clampedProgress}%` }}
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
    </div>
  );
};

export default ProgressBar;
