import React from 'react';
import styles from './StatCard.module.css';

const StatCard = ({ icon, title, value, color = 'primary', trend }) => (
  <div className={`card ${styles.card}`}>
    <div className={styles.content}>
      <div>
        <p className={styles.title}>{title}</p>
        <h3 className={styles.value}>{value}</h3>
        {trend && <small className={styles.trend}>{trend}</small>}
      </div>
      <div className={`${styles.icon} ${styles[color]}`}>
        <i className={`bi ${icon}`}></i>
      </div>
    </div>
  </div>
);

export default StatCard;
